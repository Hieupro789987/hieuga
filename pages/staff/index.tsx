import { useRouter } from "next/router";
import { useEffect } from "react";
import { StaffLayout } from "../../layouts/staff-layout/staff-layout";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/staff");
  }, []);

  return null;
}

Page.Layout = StaffLayout;
