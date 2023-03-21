import { NextSeo } from "next-seo";
import { WarehouseNotePage } from "../../../components/shop/warehouse-note/warehouse-note-page";
import { ShopLayout } from "../../../layouts/shop-layout/shop-layout";
export default function Page() {
  return (
    <>
      <NextSeo title="Phiếu kho hàng" />
      <WarehouseNotePage />
    </>
  );
}

Page.Layout = ShopLayout;
