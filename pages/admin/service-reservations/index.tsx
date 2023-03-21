import { AdminServiceReservationsPage } from "../../../components/admin/management/admin-service-reservations/admin-service-reservations-page";
import { AdminLayout } from "../../../layouts/admin-layout/admin-layout";

export default function Page() {
  return (
    <>
      <AdminServiceReservationsPage readOnly />
    </>
  );
}
Page.Layout = AdminLayout;
