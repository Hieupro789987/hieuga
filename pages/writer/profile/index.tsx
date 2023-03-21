import { WriterProfilePage } from "../../../components/writer/writer-profile/writer-profile-page";
import { WriterLayout } from "../../../layouts/writer-layout/writer-layout";

export default function Page() {
  return (
    <>
      <WriterProfilePage />
    </>
  );
}
Page.Layout = WriterLayout;
