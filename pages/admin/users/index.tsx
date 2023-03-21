import { UsersPage } from "../../../components/admin/management/users/users-page";
import { AdminLayout } from "../../../layouts/admin-layout/admin-layout";

export default function Page() {
  return (
    <>
      <UsersPage />
    </>
  );
}
Page.Layout = AdminLayout;
