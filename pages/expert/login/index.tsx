import { NextSeo } from "next-seo";
import { ExpertLoginPage } from "../../../components/expert/expert-login/expert-login-page";
import { NoneLayout } from "../../../layouts/none-layout/none-layout";

export default function Page() {
  return (
    <>
      <NextSeo title="Đăng nhập Chuyên gia" />
      <ExpertLoginPage />
    </>
  );
}

Page.Layout = NoneLayout;
