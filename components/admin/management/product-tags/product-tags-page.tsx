import { ProductTagService, ProductTag } from "../../../../lib/repo/product-tag.repo";
import { Field, ImageInput, Input } from "../../../shared/utilities/form";
import { Card } from "../../../shared/utilities/misc";
import { DataTable } from "../../../shared/utilities/table/data-table";

export function ProductTagsPage() {
  return (
    <Card>
      <DataTable<ProductTag>
        crudService={ProductTagService}
        order={{ createdAt: -1 }}
        autoRefresh={30000}
      >
        <DataTable.Header>
          <DataTable.Title />
          <DataTable.Buttons>
            <DataTable.Button outline isRefreshButton refreshAfterTask />
            <DataTable.Button primary isCreateButton />
          </DataTable.Buttons>
        </DataTable.Header>

        <DataTable.Divider />

        <DataTable.Toolbar>
          <DataTable.Search />
        </DataTable.Toolbar>

        <DataTable.Table className="mt-4">
          <DataTable.Column
            label="Tag"
            render={(item: ProductTag) => (
              <DataTable.CellText image={item?.image} value={item?.name} />
            )}
          />
          <DataTable.Column
            label="Ngày tạo"
            render={(item: ProductTag) => <DataTable.CellDate value={item?.createdAt} />}
          />
          <DataTable.Column
            center
            width={280}
            label="Số lượng sản phẩm đã gắn"
            render={(item: ProductTag) => <DataTable.CellNumber value={item?.productCount} />}
          />
          <DataTable.Column
            right
            render={(item: ProductTag) => (
              <>
                <DataTable.CellButton value={item} isUpdateButton />
                <DataTable.CellButton hoverDanger value={item} isDeleteButton />
              </>
            )}
          />
        </DataTable.Table>
        <DataTable.Pagination />

        <DataTable.Form grid>
          <Field label="Tên tag" name="name" required cols={12}>
            <Input placeholder="Nhập tên tag..." />
          </Field>
          <Field label="Hình ảnh" name="image" cols={12}>
            <ImageInput placeholder="Nhập ảnh..." />
          </Field>
        </DataTable.Form>
      </DataTable>
    </Card>
  );
}
