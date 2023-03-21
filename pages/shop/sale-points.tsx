import { NextSeo } from "next-seo";
import { SalePointsPage } from "../../components/shop/sale-points/sale-points-page";
import { ShopLayout } from "../../layouts/shop-layout/shop-layout";

export default function Page() {
  return (
    <>
      <NextSeo title="Điểm bán" />
      <SalePointsPage />
    </>
  );
}

Page.Layout = ShopLayout;
