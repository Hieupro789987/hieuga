import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuth } from "../lib/providers/auth-provider";

export default function Page(props) {
  const router = useRouter();
  const arrType = ["staff", "admin", "expert", "writer", "shop"];

  const checkTypeDashboard = () => {
    const type = arrType.find((x) => router.query[x]);
    
    if(!type) return; 
    router.push(`/${type}`)
  };

  useEffect(() => {
    checkTypeDashboard();
  }, [router.query]);

  return null;
}
