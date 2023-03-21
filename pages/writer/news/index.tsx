import { WriterNewsPage } from "../../../components/writer/writer-news/writer-news-page";
import { WriterLayout } from "../../../layouts/writer-layout/writer-layout";

export default function Page() {
  return (
    <>
      <WriterNewsPage />
    </>
  );
}
Page.Layout = WriterLayout;
