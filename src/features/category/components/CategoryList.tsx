import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollText } from "lucide-react";
import Link from "next/link";
import React from "react";

const CategoryList = ({
  categories,
}: {
  categories: {
    id: string;
    name: string;
    productCount: number;
  }[];
}) => {
  return (
    <div className="flex flex-col gap-1 overflow-y-auto">
			{categories.map((category, index) => (
				<React.Fragment key={category.id}>
					<Link
						href={""}
						className="flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-hidden ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground h-8 text-sm"
					>
						<ScrollText /> {category.name} <Badge className="size-5 ml-auto rounded-full" >{category.productCount}</Badge>
					</Link>
					{index + 1 !== categories.length && <Separator />}
				</React.Fragment>
			))}
		</div>
  );
};

export default CategoryList;
