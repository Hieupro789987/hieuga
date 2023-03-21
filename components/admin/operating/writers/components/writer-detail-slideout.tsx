import { useRouter } from "next/router";
import { Slideout, SlideoutProps } from "../../../../shared/utilities/dialog";
import { Spinner } from "../../../../shared/utilities/misc";
import { TabGroup } from "../../../../shared/utilities/tab/tab-group";
import { useWriterDetailContext, WriterDetailProvider } from "../providers/writer-detail-provider";
import { WriterDetailOverviewTab } from "./writer-detail-overview-tab";

interface Props extends SlideoutProps {
  id: string;
}

export function WriterDetailSlideout({ id, ...props }: Props) {
  const router = useRouter();

  const onClose = () => {
    router.replace({ pathname: location.pathname, query: {} });
  };

  return (
    <WriterDetailProvider id={id}>
      <Slideout width="86vw" maxWidth="960px" isOpen={!!id} onClose={onClose}>
        <Body />
      </Slideout>
    </WriterDetailProvider>
  );
}

function Body() {
  const { writer } = useWriterDetailContext();

  if (!writer) return <Spinner />;

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
      <TabGroup.Tab label="Thông tin">
        <WriterDetailOverviewTab />
      </TabGroup.Tab>
    </TabGroup>
  );
}
