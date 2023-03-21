import { StaffOrdersPage } from "../../../components/staff/management/orders/staff-orders-page";
import { StaffLayout } from "../../../layouts/staff-layout/staff-layout";

export default function Page() {
  return (
    <>
      <StaffOrdersPage />
    </>
  );
}

Page.Layout = StaffLayout;
