import { WritersPage } from "../../../components/admin/operating/writers/writers-page";
import { AdminLayout } from "../../../layouts/admin-layout/admin-layout";

export default function Page() {
  return (
    <>
      <WritersPage />
    </>
  );
}
Page.Layout = AdminLayout;
