import AllProducts from "@/components/modules/products";
import ProductBanner from "@/components/modules/products/banner";
import CategoryCard from "@/components/ui/core/CategoryCard";
import NMContainer from "@/components/ui/core/NMContainer";
import { getAllCategories } from "@/service/category";
import { getAllProducts } from "@/service/product";
import { ICategory } from "@/type/category";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const AllMoviePage = async ({
  searchParams,
}: {
  searchParams: SearchParams;
}) => {
  const query = await searchParams;
  const { category, searchTerm, sort, page } = query;
  console.log("query", query);
  console.log("category", category);
  console.log("searchTerm", searchTerm);

  
  const { data: categories } = await getAllCategories();
  const { data: products } = await getAllProducts(undefined, undefined, query);

  return (
    <NMContainer>
      <ProductBanner title="All Products" path="Home - Products" />
      <h2 className="text-xl font-bold my-5">Featured Collection </h2>
      <div className="grid grid-cols-6 gap-6">
        {categories?.slice(0, 6).map((category: ICategory, idx: number) => (
          <CategoryCard key={idx} category={category} />
        ))}
      </div>
      <AllProducts products={products} />
    </NMContainer>
  );
};

export default AllMoviePage;