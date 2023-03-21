import { GlobalProductCategoriesPage } from "../../../components/admin/global-product-categories/global-product-categories-page";
import { AdminLayout } from "../../../layouts/admin-layout/admin-layout";

export default function Page() {
  return (
    <>
      <GlobalProductCategoriesPage />
    </>
  );
}
Page.Layout = AdminLayout;
