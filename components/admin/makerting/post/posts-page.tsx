import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { RiDeleteBin6Line, RiEditBoxLine, RiFileList2Line } from "react-icons/ri";
import { useToast } from "../../../../lib/providers/toast-provider";
import {
  APPROVAL_STATUS,
  Post,
  PostService,
  POST_APPROVE_STATUS_NO_REJECTED_AND_DRAFT_OPTIONS,
  TOPIC_ICON_LIST,
} from "../../../../lib/repo/post.repo";
import { Topic, TopicService } from "../../../../lib/repo/topic.repo";
import { convertIcon } from "../../../shared/common/convert-icon";
import { Button, Checkbox, Input, Label, Switch } from "../../../shared/utilities/form";
import { Field } from "../../../shared/utilities/form/field";
import { Select } from "../../../shared/utilities/form/select";
import { List } from "../../../shared/utilities/list";
import { Card, Spinner } from "../../../shared/utilities/misc";
import { DataTable } from "../../../shared/utilities/table/data-table";
import { PostApprovalDialog } from "./components/post-approval-dialog";
import { PostSlideout } from "./components/post-slideout";

export function PostsPage() {
  const toast = useToast();
  const router = useRouter();
  const [postId, setPostId] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic>();
  const [selectedTopicIdList, setSelectedTopicIdList] = useState<string[]>();
  const [openApprovalDialog, setOpenApprovalDialog] = useState<Post>();
  const [approvalStatus, setApprovalStatus] = useState<APPROVAL_STATUS>();
  const [seasonInfo, setSeasonInfo] = useState<Topic>();
  const [marketInfo, setMarketInfo] = useState<Topic>();
  const [aboutUsTopic, setAboutUsTopic] = useState<Topic>();
  const [readOnly, setReadOnly] = useState(false);

  const filter = useMemo(() => {
    return {
      topicId: selectedTopicIdList ? { $in: selectedTopicIdList } : undefined || selectedTopic?.id,
      approveStatus: approvalStatus || { $ne: "DRAFT" },
    };
  }, [approvalStatus, selectedTopic, selectedTopicIdList]);

  useEffect(() => {
    if (router.query["create"]) {
      setPostId("");
    } else if (router.query["id"]) {
      setPostId(router.query["id"]);
    } else {
      setPostId(null);
    }
  }, [router.query]);

  useEffect(() => {
    getTopicListData();
  }, []);

  const getTopicListData = async () => {
    try {
      const { data } = await TopicService.getAll({ query: { limit: 10000 } });
      let seasonInfoTopic = data.find((topic) => topic.slug === "thong-tin-mua-vu");
      seasonInfoTopic = { ...seasonInfoTopic, name: "Tất cả" };
      setSeasonInfo(seasonInfoTopic);
      let marketInfoTopic = data.find((topic) => topic.slug === "thong-tin-thi-truong");
      marketInfoTopic = { ...marketInfoTopic, name: "Tất cả" };
      setMarketInfo(marketInfoTopic);
      const aboutUsTopic = data.find((topic) => topic.slug === "gioi-thieu");
      setAboutUsTopic(aboutUsTopic);
      setSelectedTopic(aboutUsTopic);
    } catch (error) {
      console.debug("error", error);
    }
  };

  const getChildTopicIds = async (topicSlug: string) => {
    try {
      const res = await TopicService.getAll({
        query: {
          limit: 10000,
          filter: {
            group: topicSlug,
          },
        },
      });
      const childTopicIds = res.data.map((topic) => topic.id);
      return childTopicIds;
    } catch (error) {
      console.debug(error);
    }
  };

  if (!marketInfo?.id && !seasonInfo?.id && !aboutUsTopic?.id) return <Spinner />;

  return (
    <Card>
      <DataTable<Post>
        crudService={PostService}
        order={{ createdAt: -1 }}
        filter={filter}
        fetchingCondition={!!selectedTopic?.id}
        createItem={() => router.replace({ pathname: location.pathname, query: { create: true } })}
        updateItem={(item) =>
          router.replace({ pathname: location.pathname, query: { id: item.id } })
        }
      >
        <div className="flex gap-3">
          <DataTable.Consumer>
            {({ loadAll }) => (
              <div className="w-72 shrink-0 grow-0 flex-cols">
                <List<Topic>
                  displayName="Giới thiệu"
                  className="pb-4"
                  description={""}
                  crudService={TopicService}
                  filter={{
                    slug: { $nin: ["thong-tin-mua-vu", "thong-tin-thi-truong"] },
                    group: { $nin: ["thong-tin-mua-vu", "thong-tin-thi-truong"] },
                  }}
                  autoSelect={false}
                  hasAll={false}
                  hasAdd={false}
                  hasTitle={false}
                  selectedItem={selectedTopic}
                  notEditItemIds={[aboutUsTopic?.id]}
                  onSelect={(item) => {
                    setSelectedTopic(item);
                    setSelectedTopicIdList(null);
                  }}
                  onChange={() => {
                    loadAll(true);
                  }}
                  renderItem={(item, selected) => (
                    <>
                      <div
                        className={`font-semibold text-sm ${
                          selected ? "text-primary" : "text-gray-700 group-hover:text-primary"
                        }`}
                      >
                        <div className={`${item.isHidden ? "line-through opacity-80" : ""}`}>
                          {item.name || "Tất cả"}
                        </div>
                      </div>
                    </>
                  )}
                >
                  <List.Form>
                    <Field label="Tên chủ đề" name="name" required>
                      <Input autoFocus />
                    </Field>
                    <Field name="slug" label="Slug" required validation={{ slug: true }}>
                      <Input />
                    </Field>
                    <Field name="group" label="Group">
                      <Input placeholder="Nhập slug nhóm chủ đề" />
                    </Field>
                    <Field name="image" label="Icon">
                      <Select />
                    </Field>
                    <Field name="isHidden" label="">
                      <Checkbox placeholder="Ẩn chủ đề" />
                    </Field>
                  </List.Form>
                </List>

                <List<Topic>
                  autoSelect={false}
                  displayName="thông tin mùa vụ"
                  className="py-4"
                  crudService={TopicService}
                  filter={{ group: "thong-tin-mua-vu" }}
                  selectedItem={selectedTopic}
                  hasAll={seasonInfo}
                  onSelect={async (item) => {
                    if (item.name === "Tất cả") {
                      const childTopicIds = await getChildTopicIds("thong-tin-mua-vu");
                      setSelectedTopicIdList(childTopicIds);
                      setSelectedTopic(item);
                      return;
                    }

                    setSelectedTopic(item);
                    setSelectedTopicIdList(null);
                  }}
                  onChange={() => {
                    loadAll(true);
                  }}
                  customDefaultValues={{
                    image: selectedTopic ? selectedTopic.image : "season",
                  }}
                  renderItem={(item, selected) => (
                    <>
                      <div
                        className={`font-semibold text-sm flex items-stretch gap-1 ${
                          selected ? "text-primary" : "text-gray-700 group-hover:text-primary"
                        }`}
                      >
                        <i className="text-lg">{convertIcon(item.image || "allNews")}</i>
                        <div className="">{item.name || "Tất cả"}</div>
                      </div>
                    </>
                  )}
                >
                  <List.Form>
                    <TopicFormBody group="thong-tin-mua-vu" />
                  </List.Form>
                </List>

                <List<Topic>
                  autoSelect={false}
                  displayName="thông tin thị trường"
                  className="pt-4 rounded-non"
                  crudService={TopicService}
                  filter={{ group: "thong-tin-thi-truong" }}
                  selectedItem={selectedTopic}
                  hasAll={marketInfo}
                  onSelect={async (item) => {
                    if (item.name === "Tất cả") {
                      const childTopicIds = await getChildTopicIds("thong-tin-thi-truong");
                      setSelectedTopicIdList(childTopicIds);
                      setSelectedTopic(item);
                      return;
                    }

                    setSelectedTopic(item);
                    setSelectedTopicIdList(null);
                  }}
                  onChange={() => {
                    loadAll(true);
                  }}
                  customDefaultValues={{
                    image: selectedTopic ? selectedTopic.image : "season",
                  }}
                  renderItem={(item, selected) => (
                    <>
                      <div
                        className={`font-semibold text-sm flex items-stretch gap-1 ${
                          selected ? "text-primary" : "text-gray-700 group-hover:text-primary"
                        }`}
                      >
                        <i className="text-lg">{convertIcon(item.image || "allNews")}</i>
                        <div className="">{item.name || "Tất cả"}</div>
                      </div>
                    </>
                  )}
                >
                  <List.Form>
                    <TopicFormBody group="thong-tin-thi-truong" />
                  </List.Form>
                </List>
              </div>
            )}
          </DataTable.Consumer>

          <div className="flex-1">
            <DataTable.Header>
              <DataTable.Consumer>
                {({ pagination }) => (
                  <DataTable.Title subtitle={`Tổng ${pagination?.total || ""} bài viết`} />
                )}
              </DataTable.Consumer>
              <DataTable.Buttons>
                <DataTable.Button isRefreshButton refreshAfterTask outline />
                <DataTable.Button primary isCreateButton />
              </DataTable.Buttons>
            </DataTable.Header>

            <DataTable.Divider />
            <DataTable.Toolbar>
              <DataTable.Search />
              <DataTable.Filter>
                <Field name="" noError>
                  <Select
                    placeholder={"Lọc trạng thái"}
                    clearable
                    autosize
                    options={POST_APPROVE_STATUS_NO_REJECTED_AND_DRAFT_OPTIONS}
                    onChange={(val) => setApprovalStatus(val)}
                  />
                </Field>
              </DataTable.Filter>
            </DataTable.Toolbar>
            <DataTable.Consumer>
              {({ changeRowData }) => (
                <DataTable.Table className="mt-4 bg-white" disableDbClick>
                  <DataTable.Column
                    label={"Tiêu đề bài đăng"}
                    render={(item: Post) => (
                      <DataTable.CellText
                        image={item.featureImage}
                        imageClassName="w-16"
                        value={item.title}
                        className="max-w-xs text-ellipsis-2"
                      />
                    )}
                  />
                  <DataTable.Column
                    label={"Chủ đề"}
                    center
                    render={(item: Post) => <DataTable.CellText value={item.topic?.name} />}
                  />
                  <DataTable.Column
                    label={"Ngày tạo"}
                    center
                    render={(item: Post) => <DataTable.CellDate value={item.createdAt} />}
                  />
                  <DataTable.Column
                    label={"Trạng thái"}
                    center
                    render={(item: Post) => (
                      <DataTable.CellStatus
                        value={item.approveStatus}
                        options={POST_APPROVE_STATUS_NO_REJECTED_AND_DRAFT_OPTIONS}
                        type="light"
                      />
                    )}
                  />
                  <DataTable.Column
                    center
                    label={"Hiển thị"}
                    render={(item: Post) => (
                      <DataTable.CellText
                        className="flex justify-center"
                        value={
                          <div
                            onClick={(e) => e.stopPropagation()}
                            data-tooltip="Ẩn/hiện bài đăng"
                            data-placement="top-center"
                          >
                            <Switch
                              dependent
                              value={item.active}
                              onChange={async (value) => {
                                if (item.approveStatus !== "APPROVED") {
                                  toast.info("Bài viết cần được duyệt trước.");
                                  return;
                                }

                                try {
                                  const res = await PostService.updatePostStatus(
                                    item.id,
                                    "PUBLIC", // BE only show posts have status is PUBLIC but Design has removed it
                                    !item.active
                                  );
                                  changeRowData(item, "active", res.active);
                                  toast.success(`${value ? "Hiện" : "Ẩn"} bài viết thành công.`);
                                } catch (err) {
                                  changeRowData(item, "active", item.active);
                                  toast.error(`${value ? "Hiện" : "Ẩn"} bài viết thất bại.`);
                                }
                              }}
                            />
                          </div>
                        }
                      />
                    )}
                  />
                  <DataTable.Column
                    right
                    render={(item: Post) => (
                      <>
                        {item?.writerGroupId ? (
                          <Button
                            icon={<RiFileList2Line />}
                            iconClassName="text-xl"
                            className="px-1"
                            tooltip="Chi tiết"
                            onClick={() => {
                              setReadOnly(true);
                              setOpenApprovalDialog(item);
                            }}
                          />
                        ) : (
                          <DataTable.CellButton value={item} tooltip="Chỉnh sửa" isUpdateButton />
                        )}
                        {item.approveStatus !== "APPROVED" && (
                          <DataTable.CellButton
                            value={item}
                            icon={<RiEditBoxLine />}
                            iconClassName="text-xl"
                            tooltip="Xét duyệt"
                            onClick={() => setOpenApprovalDialog(item)}
                          />
                        )}
                        {!item?.writerGroupId && (
                          <DataTable.CellButton
                            value={item}
                            icon={<RiDeleteBin6Line />}
                            iconClassName="text-xl"
                            tooltip="Xóa"
                            isDeleteButton
                          />
                        )}
                      </>
                    )}
                  />
                </DataTable.Table>
              )}
            </DataTable.Consumer>
            <DataTable.Pagination />
          </div>
        </div>
        <DataTable.Consumer>
          {({ loadAll }) => (
            <PostSlideout loadAll={loadAll} selectedTopic={selectedTopic} postId={postId} />
          )}
        </DataTable.Consumer>
        <DataTable.Consumer>
          {({ loadAll }) => (
            <PostApprovalDialog
              post={openApprovalDialog}
              isOpen={!!openApprovalDialog}
              onClose={() => {
                setReadOnly(false);
                setOpenApprovalDialog(null);
              }}
              reload={loadAll}
              readOnly={readOnly}
            />
          )}
        </DataTable.Consumer>
      </DataTable>
    </Card>
  );
}

interface TopicFormBodyProps extends ReactProps {
  group: string;
}

function TopicFormBody({ group, ...props }: TopicFormBodyProps) {
  const { watch } = useFormContext();
  const image = watch("image");
  const [iconTopic, setIconTopic] = useState<any>();

  useEffect(() => {
    if (image) setIconTopic(convertIcon(image));
  }, [image]);

  return (
    <>
      <Field label="Tên chủ đề" name="name" required>
        <Input autoFocus />
      </Field>
      <Field name="slug" label="Slug" validation={{ slug: true }}>
        <Input />
      </Field>
      <Label text="Icon" className="col-span-12" />
      <div className="flex items-center col-span-12 gap-2 mb-5">
        <i className="w-10 h-10 text-2xl border rounded border-slate-600 grow-0 shrink-0 flex-center">
          {iconTopic}
        </i>
        <Field name="image" label="" className="flex-1" noError>
          <Select options={TOPIC_ICON_LIST} />
        </Field>
      </div>
      <Field name="isHidden" label="">
        <Checkbox placeholder="Ẩn chủ đề" />
      </Field>
      <Field name="group" label="Group" className="hidden">
        <Input defaultValue={group} />
      </Field>
    </>
  );
}
