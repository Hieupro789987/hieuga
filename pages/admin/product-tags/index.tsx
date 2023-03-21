import { ProductTagsPage } from "../../../components/admin/management/product-tags/product-tags-page";
import { AdminLayout } from "../../../layouts/admin-layout/admin-layout";

export default function Page() {
  return (
    <>
      <ProductTagsPage />
    </>
  );
}
Page.Layout = AdminLayout;
