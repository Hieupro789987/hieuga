import { ServiceTag, ServiceTagService } from "../../../../lib/repo/services/service-tag.repo";
import { Field, ImageInput, Input } from "../../../shared/utilities/form";
import { Card } from "../../../shared/utilities/misc";
import { DataTable } from "../../../shared/utilities/table/data-table";

interface ServiceTagsPageProps extends ReactProps {}

export function ServiceTagsPage({ ...props }: ServiceTagsPageProps) {
  return (
    <Card>
      <DataTable<ServiceTag>
        crudService={ServiceTagService}
        order={{ createdAt: -1 }}
        filter={{ deletedAt: { $eq: null } }}
      >
        <DataTable.Header>
          <DataTable.Consumer>
            {({ pagination: { total } }) => (
              <DataTable.Title subtitle={`Tổng ${total} loại dịch vụ`} />
            )}
          </DataTable.Consumer>
          <DataTable.Buttons>
            <DataTable.Button textPrimary outline isRefreshButton refreshAfterTask />
            <DataTable.Button primary isCreateButton />
          </DataTable.Buttons>
        </DataTable.Header>

        <DataTable.Search className="mt-8 mb-5" />

        <DataTable.Table className="mt-4 bg-white">
          <DataTable.Column
            label={"Loại dịch vụ"}
            render={(item: ServiceTag) => (
              <DataTable.CellText className="min-w-md" image={item.image} value={item.name} />
            )}
          />
          <DataTable.Column
            label={"Số lượng dịch vụ"}
            center
            render={(item: ServiceTag) => (
              <DataTable.CellText className="min-w-2xs" value={item.serviceCount} />
            )}
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
        <DataTable.Form grid width={400}>
          <Field name="name" label="Tên loại dịch vụ" cols={12} required>
            <Input placeholder="Nhập tên loại dịch vụ..." autoFocus />
          </Field>
          <Field name="image" label="Hình ảnh" cols={12}>
            <ImageInput largeImage placeholder="Nhập link ảnh..." />
          </Field>
        </DataTable.Form>
      </DataTable>
    </Card>
  );
}
