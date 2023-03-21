import { QuestionsTopicPage } from "../../../components/admin/questions-topic/questions-topic-page";
import { AdminLayout } from "../../../layouts/admin-layout/admin-layout";

export default function Page() {
  return (
    <>
      <QuestionsTopicPage />
    </>
  );
}
Page.Layout = AdminLayout;
