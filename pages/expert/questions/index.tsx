import { ExpertQuestionsPage } from "../../../components/expert/expert-questions/expert-questions-page";
import { ExpertLayout } from "../../../layouts/expert-layout/expert-layout";

export default function Page() {
  return (
    <>
      <ExpertQuestionsPage />
    </>
  );
}
Page.Layout = ExpertLayout;
