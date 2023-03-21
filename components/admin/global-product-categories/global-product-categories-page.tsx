import { useState } from "react";
import { GlobalProductCategory } from "../../../lib/repo/global-product-category.repo";
import { Product, ProductService } from "../../../lib/repo/product.repo";
import { DataTable } from "../../shared/utilities/table/data-table";
import { GlobalProductCategoryTree } from "./components/global-product-category-tree";

interface GlobalProductCategoriesPageProps extends ReactProps {}

export function GlobalProductCategoriesPage({ ...props }: GlobalProductCategoriesPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<GlobalProductCategory>();

  return (
    <>
      <DataTable<Product>
        crudService={ProductService}
        order={{ createdAt: -1 }}
        filter={{
          globalProductCategoryIds: selectedCategory?.id,
        }}
      >
        <div className="flex gap-3">
          <DataTable.Consumer>
            {() => (
              <GlobalProductCategoryTree
                onSelectCate={(category) => setSelectedCategory(category)}
              />
            )}
          </DataTable.Consumer>

          <div className="flex-1">
            <DataTable.Header>
              <DataTable.Consumer>
                {({ pagination }) => (
                  <DataTable.Title subtitle={`Tổng ${pagination?.total || ""} sản phẩm`} />
                )}
              </DataTable.Consumer>
              <DataTable.Buttons>
                <DataTable.Button isRefreshButton refreshAfterTask outline className="bg-white" />
              </DataTable.Buttons>
            </DataTable.Header>

            <DataTable.Divider />
            <DataTable.Toolbar>
              <DataTable.Search />
            </DataTable.Toolbar>
            <DataTable.Table className="mt-4 bg-white" disableDbClick>
              <DataTable.Column
                label={"Sản phẩm"}
                render={(item: Product) => (
                  <DataTable.CellText
                    image={item.image}
                    value={item.name}
                    subText={item.code}
                    className="max-w-xs text-ellipsis-2"
                  />
                )}
              />
              <DataTable.Column
                label="Cửa hàng"
                render={(item: Product) => (
                  <DataTable.CellText
                    value={item.member?.shopName}
                    subText={item.member?.code}
                    image={item.member?.shopLogo}
                  />
                )}
              />
              <DataTable.Column
                label={"Giá"}
                center
                render={(item: Product) => <DataTable.CellNumber currency value={item.basePrice} />}
              />
              <DataTable.Column
                label={"Số lượng đã bán"}
                center
                render={(item: Product) => <DataTable.CellNumber value={item.soldQty} />}
              />
            </DataTable.Table>
            <DataTable.Pagination />
          </div>
        </div>
      </DataTable>
    </>
  );
}
