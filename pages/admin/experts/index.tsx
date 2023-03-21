import { ExpertsPage } from "../../../components/admin/qa/experts-page";
import { AdminLayout } from "../../../layouts/admin-layout/admin-layout";

export default function Page() {
  return (
    <>
      <ExpertsPage />
    </>
  );
}
Page.Layout = AdminLayout;
