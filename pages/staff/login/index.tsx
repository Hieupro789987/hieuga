import { NextSeo } from "next-seo";
import { StaffLoginPage } from "../../../components/staff/login/staff-login-page";
import { NoneLayout } from "../../../layouts/none-layout/none-layout";

export default function Page() {
  return (
    <>
      <NextSeo title="Đăng nhập Nhân viên" />
      <StaffLoginPage />
    </>
  );
}

Page.Layout = NoneLayout;
