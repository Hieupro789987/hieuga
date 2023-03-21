import { NextSeo } from "next-seo";
import { WriterForgotPasswordPage } from "../../../components/writer/writer-forgot-password/writer-forgot-password-page";

import { NoneLayout } from "../../../layouts/none-layout/none-layout";

export default function Page() {
  return (
    <>
      <NextSeo title="Quên mật khẩu người đăng tin" />
      <WriterForgotPasswordPage />
    </>
  );
}

Page.Layout = NoneLayout;
