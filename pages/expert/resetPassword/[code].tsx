import { NextSeo } from "next-seo";
import { ExpertResetPasswordPage } from "../../../components/expert/expert-reset-password/expert-reset-password";
import { NoneLayout } from "../../../layouts/none-layout/none-layout";

export default function Page() {
  return (
    <>
      <NextSeo title="Đặt lại mật khẩu mới" />
      <ExpertResetPasswordPage />
    </>
  );
}
Page.Layout = NoneLayout;
