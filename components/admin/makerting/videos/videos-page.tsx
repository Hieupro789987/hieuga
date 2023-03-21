import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { RiEdit2Line, RiEyeLine } from "react-icons/ri";
import { useToast } from "../../../../lib/providers/toast-provider";
import { TOPIC_ICON_LIST } from "../../../../lib/repo/post.repo";
import {
  YoutubeVideoGroup,
  YoutubeVideoGroupService,
} from "../../../../lib/repo/youtube-video-group.repo";
import { YoutubeVideo, YoutubeVideoService } from "../../../../lib/repo/youtube-video.repo";
import { convertIcon } from "../../../shared/common/convert-icon";
import { VideoDialog } from "../../../shared/shop-layout/video-dialog";
import { Button, Form, FormProps, Input, Switch } from "../../../shared/utilities/form";
import { Field } from "../../../shared/utilities/form/field";
import { Select } from "../../../shared/utilities/form/select";
import { List } from "../../../shared/utilities/list";
import { Card } from "../../../shared/utilities/misc";
import { DataTable, useDataTable } from "../../../shared/utilities/table/data-table";

export function VideoPage() {
  const toast = useToast();
  const [openVideoDialog, setOpenVideoDialog] = useState<string>();
  const [VideoGroup, setVideoGroup] = useState<YoutubeVideoGroup[]>();
  const [openAssignVideoForm, setOpenAssignVideoForm] = useState<YoutubeVideo>();
  const [selectedVideoGroup, setSelectedVideoGroup] = useState<YoutubeVideoGroup>();

  return (
    <Card>
      <DataTable<YoutubeVideo>
        crudService={YoutubeVideoService}
        order={{ published: -1 }}
        filter={{ groupId: selectedVideoGroup ? { $in: selectedVideoGroup?.id } : undefined }}
        updateItem={(item) => setOpenAssignVideoForm(item as YoutubeVideo)}
      >
        <div className="flex gap-x-3">
          <DataTable.Consumer>
            {({ loadAll }) => (
              <List<YoutubeVideoGroup>
                className="w-64"
                crudService={YoutubeVideoGroupService}
                selectedItem={selectedVideoGroup}
                order={{ priority: -1 }}
                onSelect={(item) => setSelectedVideoGroup(item)}
                onChange={() => {
                  loadAll(true);
                }}
                onLoadItems={(item) => setVideoGroup(item)}
                customDefaultValues={{
                  image: selectedVideoGroup ? selectedVideoGroup.image : "season",
                }}
                renderItem={(item, selected) => (
                  <>
                    <div
                      className={`font-semibold text-sm flex items-stretch gap-1 ${
                        selected ? "text-primary" : "text-gray-700 group-hover:text-primary"
                      }`}
                    >
                      <i className="text-lg">{convertIcon(item.image || "allVideos")}</i>
                      <div className="">{item.name || "Tất cả"}</div>
                    </div>
                    <div className="my-1 text-xs text-gray-600">
                      {item.slug || "Lọc theo tất cả chủ đề"}
                    </div>
                    <div className="text-xs text-gray-600">
                      {item.id && `Độ ưu tiên: ${item.priority}`}
                    </div>
                  </>
                )}
              >
                <List.Form>
                  <TopicFormBody />
                </List.Form>
              </List>
            )}
          </DataTable.Consumer>

          <div className="flex-1">
            <DataTable.Header>
              <DataTable.Toolbar>
                <DataTable.Search />
              </DataTable.Toolbar>
              <div className="flex gap-x-2">
                <DataTable.Button outline isRefreshButton refreshAfterTask className="bg-white" />
                <DataTable.Consumer>
                  {({ loadAll }) => (
                    <Button
                      className="flex-1"
                      primary
                      onClick={async () => {
                        try {
                          await YoutubeVideoService.syncYoutubeVideo();
                          loadAll(true);
                        } catch (err) {
                          toast.error(err.message);
                        }
                      }}
                      text="Đồng bộ từ Youtube"
                    />
                  )}
                </DataTable.Consumer>
              </div>
            </DataTable.Header>

            <DataTable.Consumer>
              {({ changeRowData }) => (
                <DataTable.Table className="mt-4 bg-white">
                  <DataTable.Column
                    label={"Tiêu đề video"}
                    render={(item: YoutubeVideo) => (
                      <DataTable.CellText
                        image={item.thumb}
                        imageClassName="w-16"
                        value={item.title}
                        subText={item.description}
                        subTextClassName="max-w-xs text-ellipsis-1"
                        className="max-w-xs font-extrabold text-ellipsis-2"
                      />
                    )}
                  />
                  <DataTable.Column
                    label={"Chủ đề"}
                    center
                    render={(item: YoutubeVideo) => (
                      <DataTable.CellText
                        className="max-w-xs text-ellipsis-2 "
                        value={item.group?.name}
                      />
                    )}
                  />
                  <DataTable.Column
                    label={"Ngày tạo"}
                    center
                    render={(item: YoutubeVideo) => <DataTable.CellDate value={item.createdAt} />}
                  />
                  <DataTable.Column
                    label={"Ngày phát hành"}
                    center
                    render={(item: YoutubeVideo) => <DataTable.CellDate value={item.published} />}
                  />
                  <DataTable.Column
                    center
                    label="Kích hoạt"
                    render={(item: YoutubeVideo) => (
                      <DataTable.CellText
                        className="flex justify-center"
                        value={
                          <Switch
                            dependent
                            value={item.active}
                            onChange={async () => {
                              try {
                                const res = await YoutubeVideoService.update({
                                  id: item.id,
                                  data: { active: !item.active },
                                });
                                changeRowData(item, "active", res.active);
                              } catch (err) {
                                changeRowData(item, "active", item.active);
                              }
                            }}
                          />
                        }
                      />
                    )}
                  />
                  <DataTable.Column
                    right
                    render={(item: YoutubeVideo) => (
                      <>
                        <DataTable.CellButton
                          tooltip="Cập nhật chủ đề"
                          value={item}
                          isUpdateButton
                          icon={<RiEdit2Line />}
                          onClick={() => {
                            setOpenAssignVideoForm(item);
                          }}
                        />
                        <Button
                          className="px-2"
                          icon={<RiEyeLine />}
                          tooltip="Xem video"
                          onClick={() => {
                            setOpenVideoDialog(item.videoId);
                          }}
                        />
                      </>
                    )}
                  />
                </DataTable.Table>
              )}
            </DataTable.Consumer>
            <DataTable.Pagination />
          </div>
        </div>

        <AssignVideoGroupForm
          videoGroups={VideoGroup}
          video={openAssignVideoForm}
          isOpen={!!openAssignVideoForm}
          onClose={() => {
            setOpenAssignVideoForm(null);
          }}
        />
      </DataTable>

      <VideoDialog
        videoUrl={openVideoDialog ? `https://www.youtube.com/watch?v=${openVideoDialog}` : ""}
        isOpen={!!openVideoDialog}
        onClose={() => setOpenVideoDialog("")}
      />
    </Card>
  );
}

function AssignVideoGroupForm({
  video,
  videoGroups,
  ...props
}: FormProps & { video: Partial<YoutubeVideo>; videoGroups: any[] }) {
  const { t } = useTranslation();
  const toast = useToast();
  const { loadAll } = useDataTable();

  return (
    <Form
      dialog
      width="450px"
      title="Cập nhật chủ đề"
      defaultValues={video}
      {...props}
      onSubmit={async (data) => {
        try {
          await YoutubeVideoService.assignYoutubeVideoGroup(video.id, data.groupId);
          loadAll(true);
          props.onClose();
        } catch (error) {
          toast.error("cập nhật chủ đề thất bại" + error);
        }
      }}
    >
      <Field name="groupId" label="Danh sách chủ đề" cols={6}>
        <Select options={videoGroups?.map((e) => ({ value: e.id, label: e.name }))} />
      </Field>
      <Form.Footer />
    </Form>
  );
}

function TopicFormBody() {
  const { watch } = useFormContext();
  const image = watch("image");
  const [iconTopic, setIconTopic] = useState<any>();

  useEffect(() => {
    if (image) setIconTopic(convertIcon(image));
  }, [image]);

  return (
    <div className="grid grid-cols-12 col-span-12 min-w-sm">
      <Field name="name" label={"Tên chủ đề"} required>
        <Input autoFocus />
      </Field>
      <Field name="slug" label="Slug" validation={{ slug: true }}>
        <Input placeholder="(Tự tạo nếu để trống)" />
      </Field>
      <div className="flex items-center col-span-12 gap-2 mb-5">
        <i className="w-10 h-10 text-2xl border rounded border-slate-600 grow-0 shrink-0 flex-center">
          {iconTopic}
        </i>
        <Field name="image" label="" className="flex-1" noError>
          <Select options={TOPIC_ICON_LIST} />
        </Field>
      </div>
      <Field name="priority" label={"Độ ưu tiên"} tooltip="Độ ưu tiên từ cao đến thấp">
        <Input number />
      </Field>
    </div>
  );
}
