import { PlantsPage } from "../../../components/admin/qa/plants-page";
import { AdminLayout } from "../../../layouts/admin-layout/admin-layout";

export default function Page() {
  return (
    <>
      <PlantsPage />
    </>
  );
}
Page.Layout = AdminLayout;
