import { useRouter } from "next/router";
import { Slideout, SlideoutProps } from "../../../../shared/utilities/dialog/slideout";
import { Spinner } from "../../../../shared/utilities/misc";
import { TabGroup } from "../../../../shared/utilities/tab/tab-group";
import {
  RegistrationDetailProvider,
  useRegistrationDetailContext,
} from "../providers/registration-detail-provider";
import { RegistrationDetailOverviewTab } from "./registration-detail-overview-tab";

interface Props extends SlideoutProps {
  registerId: string;
  onSubmit?: () => any;
}

export function RegistrationDetailSlideout({ registerId, onSubmit, ...props }: Props) {
  const router = useRouter();

  const onClose = () => {
    router.replace({ pathname: location.pathname, query: {} });
  };

  return (
    <RegistrationDetailProvider id={registerId}>
      <Slideout width="86vw" maxWidth="960px" isOpen={!!registerId} onClose={onClose}>
        <Body onSubmit={onSubmit} />
      </Slideout>
    </RegistrationDetailProvider>
  );
}

function Body({ onSubmit, ...props }: { onSubmit: () => {} }) {
  const { registration } = useRegistrationDetailContext();

  if (!registration) return <Spinner />;
  return (
    <TabGroup
      name="registration"
      flex={false}
      className="px-4 bg-gray-50"
      tabClassName="h-16 py-4 text-base px-4"
      bodyClassName="p-6 v-scrollbar"
      activeClassName="bg-white border-l border-r border-gray-300"
      bodyStyle={{
        height: "calc(100vh - 64px)",
      }}
    >
      <TabGroup.Tab label="Thông tin đăng ký">
        <RegistrationDetailOverviewTab onSubmit={onSubmit} />
      </TabGroup.Tab>
    </TabGroup>
  );
}
