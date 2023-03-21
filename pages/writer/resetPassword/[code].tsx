import { NextSeo } from "next-seo";
import { WriterResetPasswordPage } from "../../../components/writer/writer-reset-password/writer-reset-password-page";
import { NoneLayout } from "../../../layouts/none-layout/none-layout";

export default function Page() {
  return (
    <>
      <NextSeo title="Đặt lại mật khẩu mới" />
      <WriterResetPasswordPage />
    </>
  );
}
Page.Layout = NoneLayout;
