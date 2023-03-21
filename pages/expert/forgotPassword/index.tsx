import { NextSeo } from "next-seo";
import { ExpertForgotPasswordPage } from "../../../components/expert/expert-forgot-password/expert-forgot-password";

import { NoneLayout } from "../../../layouts/none-layout/none-layout";

export default function Page() {
  return (
    <>
      <NextSeo title="Quên mật khẩu người chuyên gia" />
      <ExpertForgotPasswordPage />
    </>
  );
}

Page.Layout = NoneLayout;
