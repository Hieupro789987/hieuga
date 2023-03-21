import { ExpertInteractionsHistoryPage } from "../../../components/expert/expert-interactions-history/expert-interactions-history-page";
import { ExpertLayout } from "../../../layouts/expert-layout/expert-layout";

export default function Page() {
  return (
    <>
      <ExpertInteractionsHistoryPage />
    </>
  );
}
Page.Layout = ExpertLayout;
