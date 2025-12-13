import { ProductCard } from "./ProductCard";

function ProductList({
  data,
}: {
  data: {
    category: string;
    id: string;
    name: string;
    imageUrl: string;
    price: number;
  }[];
}) {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {data.map((product) => {
        return (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        );
      })}
    </ul>
  );
}

export default ProductList;
