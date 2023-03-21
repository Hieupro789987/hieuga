import { cloneDeep } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { useFormContext } from "react-hook-form";
import { RiNewspaperFill, RiNewspaperLine } from "react-icons/ri";
import { useCrud } from "../../../../../lib/hooks/useCrud";
import { useAlert } from "../../../../../lib/providers/alert-provider";
import { useToast } from "../../../../../lib/providers/toast-provider";
import { Topic, TopicService } from "../../../../../lib/repo/topic.repo";
import { Button, Field, Form, ImageInput, Input, Label } from "../../../../shared/utilities/form";

interface Props {
  onSelectTopic: (topic: Topic) => any;
}

export function TopicTree({ onSelectTopic }: Props) {
  const [selectedTopicId, setSelectedTopicId] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<Topic>();
  const topicCrud = useCrud(TopicService, { limit: 100000, order: { createdAt: 1 } });
  const [openTopicDialog, setOpenTopicDialog] = useState<{
    parent?: Topic;
    topic: Topic;
  }>(undefined);

  const alert = useAlert();
  const toast = useToast();

  const scrollToTopic = useCallback((id: string) => {
    setTimeout(() => {
      const el = document.getElementById(id);

      if (el) el.scrollIntoView({ block: "center", behavior: "smooth" });
    }, 500);
  }, []);

  const topic: Topic = useMemo(
    () =>
      topicCrud.items && selectedTopicId
        ? topicCrud.items.find((x) => x.id == selectedTopicId)
        : ({
            id: "",
            name: "Không có",
          } as Topic),
    [topicCrud.items, selectedTopicId]
  );

  const topics = useMemo(() => {
    if (topicCrud.items) {
      let topics: Topic[] = cloneDeep(topicCrud.items);
      let rootTopics = topics.filter((x) => !x.group || !topics.find((y) => y.slug == x.group));
      const attachChildrenTopics = (topic: Topic, topics: Topic[]) => {
        topic.children = topics.filter((x) => x.group === topic.slug);
        for (let child of topic.children) {
          attachChildrenTopics(child, topics);
        }
      };
      for (let topic of rootTopics) {
        attachChildrenTopics(topic, topics);
      }

      return [
        {
          id: "",
          name: "Tất cả chủ đề",
          slug: "",
        },
        ...rootTopics,
      ];
    }
    return [];
  }, [topicCrud.items]);

  useEffect(() => {
    const topic = selectedTopicId ? topicCrud.items.find((x) => x.id == selectedTopicId) : null;
    onSelectTopic(topic);
    setSelectedTopic(topic);
  }, [selectedTopicId]);

  return (
    <div className="sticky flex flex-col w-56 px-0 py-0 bg-white border shadow-sm top-20 grow-0 shrink-0 self-baseline">
      <div className="px-3 py-2">
        <Label className="mb-0 text-xl" text="Chủ đề" />
      </div>
      <Scrollbars
        className="p-3 border-t border-b border-gray-200"
        style={{ height: "calc(100vh - 214px)" }}
      >
        <div className="p-3">
          {topics?.map((child, index) => (
            <TopicBranch
              key={child.id}
              topic={child}
              selectedTopicId={selectedTopicId}
              isLast={index == topics.length - 1}
              onClick={(child) => {
                setSelectedTopicId(child);
              }}
            />
          ))}
        </div>
      </Scrollbars>
      <div className="flex items-center flex-1 p-3 gap-x-2">
        <Button
          outline
          hoverSuccess
          text="Tạo"
          className="flex-1 px-0"
          onClick={() => {
            if (!topic) return;

            setOpenTopicDialog({
              parent: topic,
              topic: {} as any,
            });
          }}
          disabled={!!selectedTopic?.group}
        />
        <Button
          outline
          hoverAccent
          text="Sửa"
          className="flex-1 px-0"
          onClick={() => {
            if (!topic || !topic.id) return;

            setOpenTopicDialog({
              topic,
            });
          }}
          disabled={!topic?.id}
        />
        <Button
          outline
          hoverDanger
          text="Xoá"
          className="flex-1 px-0"
          onClick={() => {
            if (!topic || !topic.id) return;
            alert.danger(
              "Xoá chủ đề",
              `Bạn có chắc chắc muốn xoá chủ đề "${topic.name}" không?`,
              "Xoá chủ đề",
              async () => {
                await TopicService.delete({ id: topic.id, toast });
                await topicCrud.loadAll();
                setSelectedTopicId("");
                scrollToTopic("all");
                return true;
              }
            );
          }}
          disabled={!topic?.id}
        />
      </div>
      <Form
        dialog
        width="450px"
        allowResetDefaultValues
        defaultValues={openTopicDialog?.topic}
        isOpen={!!openTopicDialog}
        onClose={() => setOpenTopicDialog(null)}
        title={`${openTopicDialog?.topic?.id ? "Chỉnh sửa" : "Tạo"} chủ đề`}
        onSubmit={(data) =>
          TopicService.createOrUpdate({
            id: openTopicDialog?.topic?.id,
            data,
            toast,
            fragment: TopicService.shortFragment,
          }).then(async (res) => {
            await topicCrud.loadAll();
            setSelectedTopicId(res.id);
            setOpenTopicDialog(null);
            scrollToTopic(res.id);
          })
        }
      >
        <Field label="Tên chủ đề" name="name" required>
          <Input autoFocus />
        </Field>
        <Field name="slug" label="Slug" required validation={{ slug: true }}>
          <Input />
        </Field>
        {/* <Field name="priority" label="Ưu tiên">
          <Input number />
        </Field> */}
        <Field name="image" label="Hình chủ đề">
          <ImageInput />
        </Field>
        <ParentTopicField topics={topicCrud.items} parentId={openTopicDialog?.parent?.id} />
        <Form.Footer />
      </Form>
    </div>
  );
}

function ParentTopicField({ topics, parentId }: { topics: Topic[]; parentId: string }) {
  const { register, setValue, watch } = useFormContext();

  if (!parentId) {
    register("group", { value: "" });
    return <></>;
  }
  const topic = topics.find((x) => x.id == parentId);
  register("group", { value: topic.slug });
  const group = watch("group");

  return (
    <Field label="Thuộc chủ đề" readOnly>
      <Input placeholder="Nhập slug của chủ đề" value={topic.name} />
    </Field>
  );
}

interface BranchProps {
  topic: Partial<Topic & { children: Topic[] }>;
  selectedTopicId: string;
  isLast?: boolean;
  onClick?: (topicId: string) => any;
  onCreateClick?: () => any;
  onUpdateClick?: () => any;
  onDeleteClick?: () => any;
}
function TopicBranch({
  topic,
  selectedTopicId,
  isLast,
  onClick,
  onCreateClick,
  onUpdateClick,
  onDeleteClick,
}: BranchProps) {
  const isSelected = useMemo(() => selectedTopicId == topic.id, [topic, selectedTopicId]);

  return (
    <>
      <div className={`relative ${topic?.group ? "branch-item" : ""} ${isLast ? "is-last" : ""}`}>
        <div className="flex mb-0.5 relative" id={topic?.id || "all"}>
          <Button
            primary={isSelected}
            icon={topic?.id ? isSelected ? <RiNewspaperFill /> : <RiNewspaperLine /> : null}
            className={`ml-1 min-h-7 h-auto py-1 pl-1.5 pr-3 text-sm justify-start text-left items-start ${
              isSelected ? "z-10" : "hover:bg-primary-light hover:z-10"
            }`}
            iconClassName="mt-0.5"
            text={topic.name}
            onClick={() => onClick(topic.id)}
          />
        </div>
        {!!topic.children?.length && (
          <div className={`pl-4 relative flex flex-col items-start branch-group`}>
            {topic.children?.map((child, index) => (
              <TopicBranch
                key={child.id}
                topic={child}
                selectedTopicId={selectedTopicId}
                isLast={index == topic.children.length - 1}
                onClick={onClick}
                onCreateClick={onCreateClick}
                onUpdateClick={onUpdateClick}
                onDeleteClick={onDeleteClick}
              />
            ))}
          </div>
        )}
      </div>
      {/* <style jsx>{`
        .branch-item:not(.is-last)::before {
          position: absolute;
          content: "";
          top: -12px;
          left: -4px;
          width: 1px;
          height: calc(100% + 24px);
          border-left: 1px solid #ccc;
        }
        .branch-item.is-last::before {
          position: absolute;
          content: "";
          top: -8px;
          left: -4px;
          width: 1px;
          height: 20px;
          border-left: 1px solid #ccc;
        }
        .branch-item::after {
          position: absolute;
          content: "";
          top: 12px;
          left: -4px;
          width: 8px;
          height: 1px;
          border-top: 1px solid #ccc;
        }
      `}</style> */}
    </>
  );
}
