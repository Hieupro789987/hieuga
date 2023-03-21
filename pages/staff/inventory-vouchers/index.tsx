import { StaffInventoryVouchers } from "../../../components/staff/management/inventory-vouchers/staff-inventory-vouchers-page";
import { StaffLayout } from "../../../layouts/staff-layout/staff-layout";

function Page() {
  return (
    <>
      <StaffInventoryVouchers />
    </>
  );
}

export default Page;

Page.Layout = StaffLayout;
