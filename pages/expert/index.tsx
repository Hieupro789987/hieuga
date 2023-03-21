import { useRouter } from "next/router";
import { useEffect } from "react";
import { ExpertLayout } from "../../layouts/expert-layout/expert-layout";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/expert");
  }, []);

  return null;
}

Page.Layout = ExpertLayout;
