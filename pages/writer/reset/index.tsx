import { NextSeo } from "next-seo";
import { WriterResetPasswordPage } from "../../../components/writer/writer-reset-password/writer-reset-password-page";
import { NoneLayout } from "../../../layouts/none-layout/none-layout";

export default function Page() {
  return (
    <>
      <NextSeo title="Reset mật khẩu người đăng tin" />
      <WriterResetPasswordPage />
    </>
  );
}

Page.Layout = NoneLayout;
