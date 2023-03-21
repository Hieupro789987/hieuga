import { WriterNotificationsPage } from "../../../components/writer/writer-notifications/writer-notifications-page";
import { WriterLayout } from "../../../layouts/writer-layout/writer-layout";

export default function Page() {
  return (
    <>
      <WriterNotificationsPage />
    </>
  );
}
Page.Layout = WriterLayout;
