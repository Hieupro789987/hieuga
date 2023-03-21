import { ServiceTagsPage } from "../../../components/admin/management/service-tags/service-tags-page";
import { AdminLayout } from "../../../layouts/admin-layout/admin-layout";

export default function Page() {
  return (
    <>
      <ServiceTagsPage />
    </>
  );
}
Page.Layout = AdminLayout;
