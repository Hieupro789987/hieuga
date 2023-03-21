import { NextSeo } from "next-seo";
import { WarehousePage } from "../../../components/shop/warehouse/warehouse-page";
import { ShopLayout } from "../../../layouts/shop-layout/shop-layout";
export default function Page() {
  return (
    <>
      <NextSeo title="kho hàng" />
      <WarehousePage />
    </>
  );
}

Page.Layout = ShopLayout;
