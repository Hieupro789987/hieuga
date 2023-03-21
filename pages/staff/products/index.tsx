import { StaffProductsPage } from "../../../components/staff/management/products/staff-products-page";
import { StaffLayout } from "../../../layouts/staff-layout/staff-layout";

export default function Page() {
  return (
    <>
      <StaffProductsPage />
    </>
  );
}

Page.Layout = StaffLayout;
