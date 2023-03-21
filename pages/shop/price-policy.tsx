import { NextSeo } from "next-seo";
import { PricePolicyPage } from "../../components/shop/price-policy/price-policy-page";
import { ShopLayout } from "../../layouts/shop-layout/shop-layout";

export default function Page() {
  return (
    <>
      <NextSeo title="Bảng giá" />
      <PricePolicyPage />
    </>
  );
}

Page.Layout = ShopLayout;
