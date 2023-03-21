import { NextSeo } from "next-seo";
import { WriterLoginPage } from "../../../components/writer/writer-login/writer-login-page";
import { NoneLayout } from "../../../layouts/none-layout/none-layout";

export default function Page() {
  return (
    <>
      <NextSeo title="Đăng nhập Người đăng tin" />
      <WriterLoginPage />
    </>
  );
}

Page.Layout = NoneLayout;
