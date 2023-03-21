import { isEmpty } from "lodash";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { useAuth } from "../../../lib/providers/auth-provider";
import { useToast } from "../../../lib/providers/toast-provider";
import {
  Post,
  PostService,
  POST_APPROVE_STATUS_NO_REJECTED_OPTIONS,
} from "../../../lib/repo/post.repo";
import { Topic, TopicService } from "../../../lib/repo/topic.repo";
import { Checkbox, Field, ImageInput, Input, Select, Switch } from "../../shared/utilities/form";
import { List } from "../../shared/utilities/list";
import { Card } from "../../shared/utilities/misc";
import { DataTable } from "../../shared/utilities/table/data-table";
import { WriterPostSlideout } from "./components/writer-news-detail-slideout";

export function WriterNewsPage() {
  const router = useRouter();
  const toast = useToast();
  const { writer } = useAuth();
  const [postId, setPostId] = useState<string>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic>();

  useEffect(() => {
    if (router.query["create"]) {
      setPostId("");
    } else if (router.query["id"]) {
      setPostId(router.query["id"] as string);
    } else {
      setPostId(null);
    }
  }, [router.query]);

  return (
    <Card>
      <DataTable<Post>
        crudService={PostService}
        order={{ createdAt: -1 }}
        filter={{ topicId: selectedTopic?.id }}
        createItem={() => router.replace({ pathname: location.pathname, query: { create: true } })}
        updateItem={(item) =>
          router.replace({ pathname: location.pathname, query: { id: item.id } })
        }
      >
        <div className="flex items-start mt-1 gap-x-6">
          <DataTable.Consumer>
            {({ loadAll }) => (
              <div className="w-64 shrink-0 grow-0">
                <List<Topic>
                  className=""
                  crudService={TopicService}
                  selectedItem={selectedTopic}
                  onSelect={(item) => setSelectedTopic(item)}
                  hasAdd={false}
                  hasDelete={false}
                  hasUpdate={false}
                  filter={{
                    _id: isEmpty(writer?.group?.topicIds)
                      ? undefined
                      : {
                          $in: writer?.group?.topicIds,
                        },
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
                    <Field name="image" label="Hình chủ đề">
                      <ImageInput />
                    </Field>
                    <Field name="isHidden" label="">
                      <Checkbox placeholder="Ẩn chủ đề" />
                    </Field>
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
                <DataTable.Button outline isRefreshButton refreshAfterTask />
                <DataTable.Button primary isCreateButton />
              </DataTable.Buttons>
            </DataTable.Header>

            <DataTable.Divider />
            <DataTable.Toolbar>
              <DataTable.Search />
              <DataTable.Filter>
                <Field name="approveStatus" noError>
                  <Select
                    placeholder={"Lọc trạng thái"}
                    clearable
                    autosize
                    options={POST_APPROVE_STATUS_NO_REJECTED_OPTIONS}
                  />
                </Field>
              </DataTable.Filter>
            </DataTable.Toolbar>
            <DataTable.Table className="mt-4 bg-white">
              <DataTable.Column
                label={"Tiêu đề"}
                render={(item: Post) => (
                  <DataTable.CellText
                    value={item?.title}
                    className="max-w-md text-ellipsis-2"
                    avatar={item?.image}
                  />
                )}
              />
              <DataTable.Column
                center
                label={"Chủ đề"}
                render={(item: Post) => (
                  <DataTable.CellText
                    value={item?.topic?.name}
                    className="max-w-xs text-ellipsis-2"
                  />
                )}
              />
              <DataTable.Column
                label={"Trạng thái"}
                center
                render={(item: Post) => (
                  <DataTable.CellStatus
                    value={item.approveStatus}
                    options={POST_APPROVE_STATUS_NO_REJECTED_OPTIONS}
                    type="light"
                  />
                )}
              />
              <DataTable.Column
                center
                render={(item: Post) => (
                  <DataTable.CellText
                    className="flex justify-center"
                    value={
                      <div
                        onClick={(e) => e.stopPropagation()}
                        data-tooltip="Hiện bài đăng"
                        data-placement="top-center"
                      >
                        <Switch dependent value={item.active} readOnly />
                      </div>
                    }
                  />
                )}
              />
              <DataTable.Column
                label={"Ngày tạo"}
                center
                render={(item: Post) => <DataTable.CellDate value={item?.createdAt} />}
              />
              <DataTable.Column
                right
                render={(item: Post) => (
                  <>
                    <DataTable.CellButton value={item} tooltip="Chỉnh sửa" isUpdateButton />
                    <DataTable.CellButton
                      value={item}
                      tooltip="Xóa"
                      icon={<RiDeleteBinLine />}
                      hoverDanger
                      {...(item.active
                        ? { onClick: () => toast.info("Không được xóa bài viết đang kích hoạt.") }
                        : { isDeleteButton: true })}
                    />
                  </>
                )}
              />
            </DataTable.Table>
            <DataTable.Pagination />
          </div>
        </div>

        <WriterPostSlideout postId={postId} selectedTopic={selectedTopic} />
      </DataTable>
    </Card>
  );
}
