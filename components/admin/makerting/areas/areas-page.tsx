import { Area, AreaService } from "../../../../lib/repo/area.repo";
import { Field, ImageInput, Input } from "../../../shared/utilities/form";
import { Card } from "../../../shared/utilities/misc";
import { DataTable } from "../../../shared/utilities/table/data-table";

export function AreasPage() {
  return (
    <Card>
      <DataTable<Area> crudService={AreaService} order={{ createdAt: -1 }}>
        <DataTable.Header>
          <DataTable.Consumer>
            {({ pagination: { total } }) => <DataTable.Title subtitle={`Tổng ${total} khu vực`} />}
          </DataTable.Consumer>
          <DataTable.Buttons>
            <DataTable.Button
              textPrimary
              outline
              isRefreshButton
              refreshAfterTask
              className="bg-white"
            />
            <DataTable.Button primary isCreateButton />
          </DataTable.Buttons>
        </DataTable.Header>
        <DataTable.Search className="mt-8 mb-5" />
        <DataTable.Table className="mt-4 bg-white">
          <DataTable.Column
            label={"Khu vực"}
            render={(item: Area) => (
              <DataTable.CellText image={item.image} imageClassName="w-8" value={item.name} />
            )}
          />
          <DataTable.Column
            label={"Slug"}
            render={(item: Area) => <DataTable.CellText value={item.slug} />}
          />
          <DataTable.Column
            center
            label={"Độ ưu tiên"}
            render={(item: Area) => <DataTable.CellText value={item.priority} />}
          />
          <DataTable.Column
            right
            render={(item: Area) => (
              <>
                <DataTable.CellButton value={item} isUpdateButton tooltip="Chỉnh sửa" />
                <DataTable.CellButton value={item} isDeleteButton tooltip="Xóa" />
              </>
            )}
          />
        </DataTable.Table>
        <DataTable.Pagination />
        <DataTable.Consumer>
          {() => (
            <DataTable.Form grid width={500}>
              <Field label="Tên" name="name" required>
                <Input autoFocus />
              </Field>
              <Field name="slug" label="Slug" validation={{ slug: true }}>
                <Input placeholder="Tự tạo nếu để trống." />
              </Field>
              <Field
                name="priority"
                label={"Độ ưu tiên"}
                description="Ưu tiên cao sẽ hiện lên đầu."
              >
                <Input number />
              </Field>
              <Field name="image" label="Hình ảnh">
                <ImageInput />
              </Field>
            </DataTable.Form>
          )}
        </DataTable.Consumer>
      </DataTable>
    </Card>
  );
}
