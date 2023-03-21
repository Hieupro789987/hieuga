import { QuestionsPage } from "../../../components/admin/questions/admin-questions/admin-questions-page";
import { AdminLayout } from "../../../layouts/admin-layout/admin-layout";

export default function Page() {
  return (
    <>
      <QuestionsPage />
    </>
  );
}
Page.Layout = AdminLayout;
