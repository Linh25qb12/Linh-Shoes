import getBillboards from "@/actions/get-billboards";
import getProducts from "@/actions/get-products";
import ProductList from "@/components/product-list";
import Billboard from "@/components/ui/billboard";
import Container from "@/components/ui/container";

export const revalidate = 0;

const HomePage = async () => {
  const products = await getProducts({ isFeatured: true });
  const billboards = await getBillboards();

  return (
    <div className="custom-container">
      <Container>
        <div className={`space-y-10 pb-10 ${products.length <= 0 && 'h-[calc(100vh-162px)]'}`}>
          <Billboard
            data={billboards[0]}
          />
          <div className="flex flex-col gap-y-8 px-4 sm:px-6 lg:px-8">
            <ProductList title="Featured Products" items={products} />
          </div>
        </div>
      </Container>
    </div>
  )
};

export default HomePage;
