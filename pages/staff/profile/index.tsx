import { StaffProfilePage } from "../../../components/staff/management/profile/staff-profile-page";
import { StaffLayout } from "../../../layouts/staff-layout/staff-layout";

export default function Page() {
  return (
    <>
      <StaffProfilePage />
    </>
  );
}

Page.Layout = StaffLayout;
