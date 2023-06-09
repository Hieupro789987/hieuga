import { ShopCategory, ShopCategoryService } from "../../../../lib/repo/shop-category.repo";
import { Field, ImageInput, Input } from "../../../shared/utilities/form";
import { Card } from "../../../shared/utilities/misc";
import { DataTable } from "../../../shared/utilities/table/data-table";

export function ShopCategoriesPage() {
  return (
    <Card>
      <DataTable<ShopCategory> crudService={ShopCategoryService} order={{ priority: -1 }}>
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
          <DataTable.Filter></DataTable.Filter>
        </DataTable.Toolbar>

        <DataTable.Table className="mt-4">
          <DataTable.Column
            label="Danh mục cửa hàng"
            render={(item: ShopCategory) => (
              <DataTable.CellText image={item.image} value={item.name} />
            )}
          />
          <DataTable.Column
            label="Mô tả"
            render={(item: ShopCategory) => <DataTable.CellText value={item.desc} />}
          />
          <DataTable.Column
            center
            label="Ưu tiên"
            render={(item: ShopCategory) => <DataTable.CellText value={item.priority} />}
          />
          <DataTable.Column
            right
            render={(item: ShopCategory) => (
              <>
                <DataTable.CellButton value={item} isUpdateButton />
                <DataTable.CellButton hoverDanger value={item} isDeleteButton />
              </>
            )}
          />
        </DataTable.Table>
        <DataTable.Pagination />

        <DataTable.Form grid>
          <Field label="Tên danh mục" name="name" required cols={8}>
            <Input />
          </Field>
          <Field label="Ưu tiên" name="priority" cols={4}>
            <Input number />
          </Field>
          <Field label="Hình ảnh" name="image" cols={12}>
            <ImageInput />
          </Field>
          <Field label="Mô tả" name="desc" cols={12}>
            <Input />
          </Field>
        </DataTable.Form>
      </DataTable>
    </Card>
  );
}
