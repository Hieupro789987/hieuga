import { NextSeo } from "next-seo";
import { ExpertOverviewPage } from "../../../components/expert/expert-overview/expert-overview-page";
import { ExpertLayout } from "../../../layouts/expert-layout/expert-layout";


export default function Page() {
  return (
    <>
      <NextSeo title="Tổng quan" />
      <ExpertOverviewPage />
    </>
  );
}

Page.Layout = ExpertLayout;
