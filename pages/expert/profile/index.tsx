import { ExpertProfilePage } from "../../../components/expert/expert-profile/expert-profile-page";
import { ExpertLayout } from "../../../layouts/expert-layout/expert-layout";

export default function Page() {
  return (
    <>
      <ExpertProfilePage />
    </>
  );
}
Page.Layout = ExpertLayout;
