import { ProductsMenu } from "../../../shared/products-menu/products-menu";

interface StaffProductsPageProps extends ReactProps {}

export function StaffProductsPage({ ...props }: StaffProductsPageProps) {
  return <ProductsMenu isStaff />;
}
