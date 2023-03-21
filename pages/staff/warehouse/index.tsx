import { StaffWarehousePage } from "../../../components/staff/management/warehouse/staff-warehouse-page";
import { StaffLayout } from "../../../layouts/staff-layout/staff-layout";

function Page() {
  return (
    <>
      <StaffWarehousePage />
    </>
  );
}

export default Page;

Page.Layout = StaffLayout;
