import { DiseasesPage } from "../../../components/admin/qa/diseases-page";
import { AdminLayout } from "../../../layouts/admin-layout/admin-layout";

export default function Page() {
  return (
    <>
      <DiseasesPage />
    </>
  );
}
Page.Layout = AdminLayout;
