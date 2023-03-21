import { NextSeo } from 'next-seo';

import { RegisterPage } from '../components/dashboard/register-page/register-page';
import { NoneLayout } from '../layouts/none-layout/none-layout';


export default function Page() {
    return (
        <>
            <NextSeo title="Đăng ký doanh nghiệp" />
            <RegisterPage />
        </>
    );
}

Page.Layout = NoneLayout;
