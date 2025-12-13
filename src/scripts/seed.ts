import { eq } from "drizzle-orm/sql";
import bcrypt from "bcryptjs";
import { db } from "@/drizzle/db";
import {
  AgentTable,
  RoleTable,
  UserTable,
  UserToRoleTable,
} from "@/drizzle/schema";
import { ProductCategoryTable, ProductTable } from "@/drizzle/schema";

const INITIAL_ROLES = ["admin", "user", "agent"];

const INITIAL_ADMIN_EMAIL = "admin@example.com";
const INITIAL_ADMIN_PASSWORD = "supersecurepassword";

export async function seedRolesAndAdmin() {
  console.log("Starting role and admin seeding...");

  // 1️⃣ Seed Roles
  for (const name of INITIAL_ROLES) {
    await db.insert(RoleTable).values({ name }).onConflictDoNothing();
  }
  console.log("Roles seeded successfully.");

  // 2️⃣ Ensure Admin User Exists
  const existingAdmin = await db.query.UserTable.findFirst({
    where: eq(UserTable.email, INITIAL_ADMIN_EMAIL),
  });

  let adminUserId;

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(INITIAL_ADMIN_PASSWORD, 10);

    const inserted = await db
      .insert(UserTable)
      .values({
        email: INITIAL_ADMIN_EMAIL,
        passwordHash: hashedPassword,
        name: "admin",
        imageUrl: "",
      })
      .returning();

    adminUserId = inserted[0].id;
    console.log("Admin user created.");
  } else {
    adminUserId = existingAdmin.id;
    console.log("Admin user already exists.");
  }

  await db
    .insert(AgentTable)
    .values({
      userId: adminUserId,
    })
    .onConflictDoNothing();

  for (const role of INITIAL_ROLES) {
    const currentRole = await db.query.RoleTable.findFirst({
      where: eq(RoleTable.name, role),
    });

    if (!currentRole) {
      throw new Error(
        `${currentRole} role was not found. Ensure role seeding runs first.`
      );
    }

    await db
      .insert(UserToRoleTable)
      .values({
        userId: adminUserId,
        roleId: currentRole.id,
      })
      .onConflictDoNothing();
  }

  console.log("Roles assigned to initial admin user.");
  console.log("Seeding completed.");
}
// seedRolesAndAdmin()
//   .then(() => process.exit(0))
//   .catch((err) => {
//     console.error(err);
//     process.exit(1);
//   });

const CATEGORIES_DATA = [
  {
    title: "Electronics",
    description: "Gadgets, devices, and accessories.",
    products: [
      {
        name: "Wireless Headphones",
        description:
          "Noise-cancelling over-ear headphones with 20h battery life.",
        price: "199.99", // Decimal fits string format best in JS
        imageUrl: "https://placehold.co/600x400?text=Headphones",
        totalStock: 5,
      },
      {
        name: "Smartphone 15 Pro",
        description: "Latest flagship smartphone with titanium finish.",
        price: "999.00",
        imageUrl: "https://placehold.co/600x400?text=Smartphone",
        totalStock: 5,
      },
    ],
  },
  {
    title: "Clothing",
    description: "Men's and Women's fashion.",
    products: [
      {
        name: "Classic White Tee",
        description: "100% Cotton premium t-shirt.",
        price: "29.50",
        imageUrl: "https://placehold.co/600x400?text=T-Shirt",
        totalStock: 5,
      },
      {
        name: "Denim Jacket",
        description: "Vintage style denim jacket.",
        price: "89.99",
        imageUrl: "https://placehold.co/600x400?text=Jacket",
        totalStock: 5,
      },
    ],
  },
  {
    title: "Home & Kitchen",
    description: "Essentials for your home.",
    products: [
      {
        name: "Coffee Maker",
        description: "Programmable drip coffee maker.",
        price: "45.00",
        imageUrl: "https://placehold.co/600x400?text=Coffee",
        totalStock: 5,
      },
    ],
  },
];

export async function seedCategoriesAndProducts() {
  console.log("🌱 Starting Category and Product seeding...");

  for (const catData of CATEGORIES_DATA) {
    // 1. Check if category exists to prevent duplicates
    let categoryId;

    const existingCategory = await db.query.ProductCategoryTable.findFirst({
      where: eq(ProductCategoryTable.title, catData.title),
    });

    if (existingCategory) {
      console.log(`- Category '${catData.title}' already exists.`);
      categoryId = existingCategory.id;
    } else {
      const insertedCat = await db
        .insert(ProductCategoryTable)
        .values({
          title: catData.title,
          description: catData.description,
        })
        .returning();

      categoryId = insertedCat[0].id;
      console.log(`+ Created Category: ${catData.title}`);
    }

    // 2. Seed Products for this Category
    for (const product of catData.products) {
      // Check if product exists (by name) within this category
      const existingProduct = await db.query.ProductTable.findFirst({
        where: eq(ProductTable.name, product.name),
      });

      if (!existingProduct) {
        await db.insert(ProductTable).values({
          name: product.name,
          description: product.description,
          price: product.price,
          imageUrl: product.imageUrl,
          categoryId: categoryId,
          totalStock: product.totalStock,
        });
        console.log(`  + Created Product: ${product.name}`);
      } else {
        console.log(`  - Product '${product.name}' already exists.`);
      }
    }
  }

  console.log("✅ Seeding completed successfully.");
}

// // Execute the seed
// seedCategoriesAndProducts()
//   .then(() => process.exit(0))
//   .catch((err) => {
//     console.error("❌ Seeding failed:", err);
//     process.exit(1);
//   });
