import { useRouter } from "next/router";
import { useEffect } from "react";
import { WriterLayout } from "../../layouts/writer-layout/writer-layout";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/writer");
  }, []);

  return null;
}

Page.Layout = WriterLayout;
