import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { RiLock2Line } from "react-icons/ri";
import { useToast } from "../../../../lib/providers/toast-provider";
import { TopicService } from "../../../../lib/repo/topic.repo";
import { UserService } from "../../../../lib/repo/user.repo";
import { WriterGroup, WriterGroupService } from "../../../../lib/repo/writer/writer-group.repo";
import { Writer, WriterService } from "../../../../lib/repo/writer/writer.repo";
import { labelAccentField } from "../../../shared/common/label-accent";
import { CloseButtonHeaderDialog } from "../../../shared/dialog/close-button-header-dialog";
import { TitleDialog } from "../../../shared/dialog/title-dialog";
import { Field, Form, FormProps, ImageInput, Input, Select } from "../../../shared/utilities/form";
import { AddressGroup } from "../../../shared/utilities/form/address-group";
import { List } from "../../../shared/utilities/list";
import { Card } from "../../../shared/utilities/misc";
import { DataTable } from "../../../shared/utilities/table/data-table";

export function WritersPage() {
  const router = useRouter();
  const [writerId, setWriterId] = useState<string>();
  const [selectedGroup, setSelectedGroup] = useState<WriterGroup>();
  const [openChangePasswordWriter, setOpenChangePasswordWriter] = useState<Writer>();

  useEffect(() => {
    if (router.query["id"]) {
      setWriterId(router.query["id"] as string);
    } else {
      setWriterId(null);
    }
  }, [router.query]);

  return (
    <Card>
      <DataTable<Writer>
        crudService={WriterService}
        order={{ createdAt: -1 }}
        filter={{ groupId: selectedGroup?.id }}
      >
        <div className="flex items-start mt-1 gap-x-6">
          <DataTable.Consumer>
            {({ loadAll }) => (
              <div className="w-64 shrink-0 grow-0">
                <List<WriterGroup>
                  className=""
                  crudService={WriterGroupService}
                  order={{ priority: -1 }}
                  selectedItem={selectedGroup}
                  onSelect={(item) => setSelectedGroup(item)}
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
                        {item.name || "Tất cả"}
                      </div>
                      <div className="text-xs text-gray-600">
                        {item.id && `Độ ưu tiên: ${item.priority}`}
                      </div>
                    </>
                  )}
                >
                  <List.Form>
                    <div className="grid grid-cols-12 col-span-12 w-[430px] gap-x-4">
                      <Field name="name" label={"Tên đơn vị"} required cols={12}>
                        <Input autoFocus placeholder="Nhập tên đơn vị..." />
                      </Field>
                      <Field
                        name="slug"
                        label="Slug"
                        labelNoAsterisk
                        cols={8}
                        validation={{ slug: true }}
                      >
                        <Input placeholder="Nhập slug..." />
                      </Field>
                      <Field name="priority" label={"Độ ưu tiên"} cols={4}>
                        <Input number />
                      </Field>
                      <Field name="topicIds" label={"Chủ đề đăng tin"} cols={12} required>
                        <Select
                          clearable
                          multi
                          placeholder="Chọn chủ đề"
                          optionsPromise={() =>
                            TopicService.getAllOptionsPromise({
                              query: {
                                filter: {
                                  slug: {
                                    $nin: [
                                      "gioi-thieu",
                                      "thong-tin-mua-vu",
                                      "thong-tin-thi-truong",
                                    ],
                                  },
                                },
                              },
                            })
                          }
                        />
                      </Field>
                      <Field name="image" label={"Hình đại diện"}>
                        <ImageInput placeholder="Nhập link ảnh đại diện" />
                      </Field>
                    </div>
                  </List.Form>
                </List>
              </div>
            )}
          </DataTable.Consumer>

          <div className="flex-1">
            <DataTable.Header>
              <DataTable.Consumer>
                {({ pagination }) => (
                  <DataTable.Title subtitle={`Tổng ${pagination?.total || ""} người đăng tin`} />
                )}
              </DataTable.Consumer>
              <DataTable.Buttons>
                <DataTable.Button outline isRefreshButton refreshAfterTask />
                {/* <DataTable.Button
                  outline
                  text="Xuất danh sách người đăng tin"
                  onClick={() => {
                    toast.info("Tính năng đang phát triển");
                    // setSetOpenExportWriterList(true)
                  }}
                /> */}
                <DataTable.Button primary isCreateButton />
              </DataTable.Buttons>
            </DataTable.Header>

            <DataTable.Divider />
            <DataTable.Toolbar>
              <DataTable.Search />
              {/* <DataTable.Filter>
                <Field name="groupId" noError>
                  <Select
                    placeholder="Nhóm"
                    clearable
                    autosize
                    optionsPromise={() => WriterGroupService.getAllOptionsPromise()}
                  />
                </Field>
              </DataTable.Filter> */}
            </DataTable.Toolbar>
            <DataTable.Table className="mt-4 bg-white">
              <DataTable.Column
                label={"Người đăng tin"}
                render={(item: Writer) => (
                  <DataTable.CellText
                    value={item.name}
                    // className="max-w-md text-ellipsis-2"
                    subText={item.writerGroup?.name}
                    avatar={item.avatar}
                  />
                )}
              />
              <DataTable.Column
                label={"Liên hệ"}
                render={(item: Writer) => (
                  <DataTable.CellText
                    value={
                      <>
                        <div className="">{item.email}</div>
                        <div className="">{item.internationalPhone}</div>
                      </>
                    }
                  />
                )}
              />
              <DataTable.Column
                label={"Đơn vị đăng tin"}
                center
                render={(item: Writer) => <DataTable.CellText value={item.group?.name} />}
              />
              <DataTable.Column
                label={"Ngày tạo"}
                center
                render={(item: Writer) => <DataTable.CellDate value={item.createdAt} />}
              />
              <DataTable.Column
                right
                render={(item: Writer) => (
                  <>
                    <DataTable.CellButton
                      value={item}
                      icon={<RiLock2Line />}
                      tooltip="Đổi mật khẩu"
                      onClick={() => {
                        setOpenChangePasswordWriter(item);
                      }}
                    />
                    <DataTable.CellButton value={item} isUpdateButton />
                    <DataTable.CellButton value={item} isDeleteButton tooltip="Xóa" />
                  </>
                )}
              />
            </DataTable.Table>
            <DataTable.Pagination />
          </div>
        </div>

        <DataTable.Consumer>
          {({ formItem }) => (
            <>
              <DataTable.Form
                grid
                width={720}
                defaultValues={
                  formItem?.id ? { ...formItem, phone: formItem?.internationalPhone } : {}
                }
              >
                <Field
                  label="Email"
                  name="email"
                  cols={!formItem?.id ? 6 : 12}
                  required
                  readOnly={!formItem?.id ? false : true}
                >
                  <Input autoFocus placeholder="Nhập email..." />
                </Field>
                {!formItem?.id && (
                  <>
                    <Field
                      label="Mật khẩu"
                      name="password"
                      cols={6}
                      validation={{ password: true }}
                      required
                    >
                      <Input type="password" />
                    </Field>
                  </>
                )}
                <Field label="Đơn vị" name="groupId" cols={6} required>
                  <Select
                    placeholder="Chọn đơn vị"
                    clearable
                    optionsPromise={() =>
                      WriterGroupService.getAllOptionsPromise({
                        query: { order: { priority: -1 } },
                      })
                    }
                  />
                </Field>
                <Field name="regionCode" cols={6} className="hidden">
                  <Input defaultValue="VN" />
                </Field>
                <Field label="Số điện thoại" name="phone" cols={6}>
                  <Input placeholder="Nhập số điện thoại" />
                </Field>
                <Field label="Họ và tên" name="name" cols={12} required>
                  <Input placeholder="Nhập họ và tên" />
                </Field>
                <Field label="Ảnh đại diện" name="avatar" cols={12}>
                  <ImageInput placeholder="Nhập link ảnh đại diện" />
                </Field>
                <AddressGroup
                  required
                  className="grid grid-cols-12 gap-x-8"
                  provinceCols={4}
                  provinceLabel=""
                  provinceName="address.provinceId"
                  districtCols={4}
                  districtLabel=""
                  districtName="address.districtId"
                  wardCols={4}
                  wardLabel=""
                  wardName="address.wardId"
                  addressCols={12}
                  addressName="address.street"
                  addressLabel=""
                  notRequiredWard
                />
              </DataTable.Form>
            </>
          )}
        </DataTable.Consumer>
        <AdminChangeWriterPassword
          isOpen={!!openChangePasswordWriter}
          onClose={() => setOpenChangePasswordWriter(null)}
          writer={openChangePasswordWriter}
        />
      </DataTable>
    </Card>
  );
}
export function AdminChangeWriterPassword({ writer, ...props }: FormProps & { writer: Writer }) {
  const toast = useToast();

  const handleSubmit = async (data) => {
    try {
      const res = await UserService.updateWriterPasswordByAdmin(writer?.id, data.newPassword);
      props.onClose();
      toast.success("Đổi mật khẩu thành công!");
    } catch (err) {
      console.debug(err);
      toast.error("Đổi mật khẩu thất bại", err.message);
    }
  };

  return (
    <Form
      width="350px"
      dialog
      onSubmit={handleSubmit}
      className="text-accent"
      defaultValues={writer}
      {...props}
    >
      <CloseButtonHeaderDialog onClose={props.onClose} />
      <TitleDialog title="Thay đổi mật khẩu" subtitle="Vui lòng nhập đủ thông tin để tiếp tục" />
      <Field label="Email" name="email" readOnly {...labelAccentField}>
        <Input />
      </Field>
      <Field
        label="Mật khẩu mới"
        name="newPassword"
        validation={{
          password: true,
        }}
        required
        {...labelAccentField}
      >
        <Input type="password" placeholder="Vui lòng nhập mật khẩu mới..." autoFocus />
      </Field>
      <Form.Footer cancelText="" submitText="Đổi mật khẩu" submitProps={{ large: true }} />
    </Form>
  );
}
