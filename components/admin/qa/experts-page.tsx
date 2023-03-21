import { useState } from "react";
import { DiseaseService } from "../../../lib/repo/disease.repo";
import { ExpertGroup, ExpertGroupService } from "../../../lib/repo/expert/expert-group.repo";
import { Expert, ExpertService } from "../../../lib/repo/expert/expert.repo";
import { PlantService } from "../../../lib/repo/plant.repo";
import { Field, FormProps, ImageInput, Input, Select } from "../../shared/utilities/form";
import { AddressGroup } from "../../shared/utilities/form/address-group";
import { List } from "../../shared/utilities/list";
import { Card } from "../../shared/utilities/misc";
import { DataTable } from "../../shared/utilities/table/data-table";

export function ExpertsPage() {
  const [selectedGroup, setSelectedGroup] = useState<ExpertGroup>();

  return (
    <Card>
      <DataTable<Expert>
        crudService={ExpertService}
        order={{ createdAt: -1 }}
        filter={{ isDeleted: { $ne: true }, expertGroupId: selectedGroup?.id }}
      >
        <div className="flex items-start mt-1 gap-x-6">
          <DataTable.Consumer>
            {({ loadAll, formItem }) => (
              <div className="w-64 shrink-0 grow-0">
                <List<ExpertGroup>
                  order={{ createdAt: 1 }}
                  className=""
                  crudService={ExpertGroupService}
                  selectedItem={selectedGroup}
                  onSelect={(item) => setSelectedGroup(item)}
                  onChange={() => {
                    loadAll(true);
                  }}
                  customDefaultValues={{ phone: selectedGroup?.internationalPhone }}
                  renderItem={(item, selected) => (
                    <>
                      <div
                        className={`font-semibold text-sm ${
                          selected ? "text-primary" : "text-gray-700 group-hover:text-primary"
                        }`}
                      >
                        {item.name || "Tất cả"}
                      </div>
                    </>
                  )}
                >
                  <List.Form>
                    <div className="grid grid-cols-12 col-span-12 gap-x-4 min-w-2xl">
                      <Field name="regionCode" cols={6} className="hidden">
                        <Input defaultValue="VN" />
                      </Field>
                      <Field name="name" label={"Tên đơn vị"} required cols={12}>
                        <Input autoFocus placeholder="Nhập tên đơn vị" />
                      </Field>
                      <Field name="representative" label="Người đại diện" cols={6} required>
                        <Input placeholder="Nhập người đại diện" />
                      </Field>
                      <Field
                        label="Số điện thoại"
                        name="phone"
                        cols={6}
                        required
                        validation={{ phone: true }}
                      >
                        <Input placeholder="Nhập số điện thoại" />
                      </Field>
                      <AddressGroup
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
                      <Field name="businessLicense" label="Giấy phép kinh doanh">
                        <ImageInput multi placeholder="Chọn giấy phép kinh doanh" />
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
                {({ pagination: { total } }) => (
                  <DataTable.Title subtitle={`Tổng ${total} chuyên gia`} />
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
                label={"Chuyên gia"}
                render={(item) => (
                  <DataTable.CellText value={item.name} className="max-w-md text-ellipsis-2" />
                )}
              />
              <DataTable.Column
                label={"Liên hệ"}
                render={(item) => (
                  <DataTable.CellText
                    value={
                      <>
                        <div className="">{item.email || ""}</div>
                        <div className="">{item.user?.phone || ""}</div>
                      </>
                    }
                  />
                )}
              />
              <DataTable.Column
                label={"Đơn vị chuyên gia"}
                center
                render={(item) => <DataTable.CellText value={item.expertGroup?.name} />}
              />
              <DataTable.Column
                label={"Ngày tạo"}
                center
                render={(item) => <DataTable.CellDate value={item.createdAt} />}
              />
              <DataTable.Column
                right
                render={(item) => (
                  <>
                    <DataTable.CellButton value={item} isUpdateButton tooltip="Chỉnh sửa" />
                    <DataTable.CellButton value={item} isDeleteButton tooltip="Xóa" />
                  </>
                )}
              />
            </DataTable.Table>
            <DataTable.Pagination />
          </div>
        </div>
        <DataTable.Consumer>
          {({ formItem }) => <CreateOrUpdateExpertForm formItem={formItem} />}
        </DataTable.Consumer>
      </DataTable>
    </Card>
  );
}

function CreateOrUpdateExpertForm({ formItem, ...props }: FormProps & { formItem: Expert }) {
  return (
    <DataTable.Form grid defaultValues={formItem || {}}>
      <Field
        label="Email đăng nhập"
        name="email"
        cols={6}
        validation={{
          email: true,
        }}
        required
        readOnly={!formItem?.id ? false : true}
      >
        <Input placeholder="Nhập email..." />
      </Field>
      {!formItem?.id && (
        <>
          <Field name="regionCode" cols={6} className="hidden">
            <Input defaultValue="VN" />
          </Field>

          <Field
            label="Mật khẩu"
            name="password"
            cols={6}
            required={!formItem?.id}
            validation={{ password: true }}
          >
            <Input placeholder="Nhập mật khẩu" type="password" />
          </Field>
        </>
      )}

      <Field label="Tên chuyên gia" name="name" cols={6} required>
        <Input placeholder="Nhập tên chuyên gia..." />
      </Field>
      <Field
        label="Số điện thoại"
        // name="internationalPhone"
        name="phone"
        cols={6}
        validation={{
          phone: true,
        }}
        required
      >
        <Input
          autoFocus
          placeholder="Nhập sdt..."
          defaultValue={formItem?.id ? formItem?.internationalPhone : ""}
        />
      </Field>
      <Field label="Đơn vị chuyên gia" name="expertGroupId" cols={!formItem?.id ? 12 : 6} required>
        <Select
          placeholder="Chọn"
          clearable
          optionsPromise={() => ExpertGroupService.getAllOptionsPromise()}
        />
      </Field>
      <Field label="Ảnh đại diện" name="avatar" cols={12} required>
        <ImageInput placeholder="Nhập link ảnh đại diện" />
      </Field>
      <AddressGroup
        className="grid grid-cols-12 gap-x-8"
        provinceCols={6}
        provinceLabel=""
        provinceName="address.provinceId"
        districtCols={6}
        districtLabel=""
        districtName="address.districtId"
        wardCols={6}
        wardLabel=""
        wardName="address.wardId"
        addressCols={6}
        addressName="address.street"
        addressLabel=""
        notRequiredWard
      />
      <Field label="Chuyên môn" name="specializes" cols={12}>
        <Input placeholder="Nhập chuyên môn..." />
      </Field>
      <Field label="Loại cây chuyên môn" name="specializesInPlantIds" cols={6}>
        <Select
          placeholder="Chọn"
          clearable
          multi
          optionsPromise={() => PlantService.getAllOptionsPromise()}
        />
      </Field>
      <Field label="Loại bệnh chuyên môn" name="specializesInDiseaseIds" cols={6}>
        <Select
          placeholder="Chọn"
          clearable
          multi
          optionsPromise={() => DiseaseService.getAllOptionsPromise()}
        />
      </Field>
    </DataTable.Form>
  );
}
