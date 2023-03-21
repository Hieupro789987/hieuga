import { NextSeo } from "next-seo";
import { LoginPage } from "../components/dashboard/login-page";
import { NoneLayout } from "../layouts/none-layout/none-layout";


export default function Page() {
    return (
        <>
            <NextSeo title="Đăng nhập doanh nghiệp" />
            <LoginPage />
        </>
    );
}

Page.Layout = NoneLayout;
