import { useState } from "react";
import { RiCalendarEventLine } from "react-icons/ri";
import { formatDate } from "../../../../lib/helpers/parser";
import { MemberService } from "../../../../lib/repo/member.repo";
import {
  ShopVoucher,
  ShopVoucherService,
  SHOP_VOUCHER_TYPES,
} from "../../../../lib/repo/shop-voucher.repo";
import { Field, Select } from "../../../shared/utilities/form";
import { Card } from "../../../shared/utilities/misc";
import { DataTable } from "../../../shared/utilities/table/data-table";
import { ExportVouchersDialog } from "./components/export-vouchers-dialog";

export function VouchersPage(props) {
  const [openExportVoucher, setOpenExportVoucher] = useState(false);
  return (
    <Card>
      <DataTable<ShopVoucher>
        crudService={ShopVoucherService}
        order={{ createdAt: -1 }}
        fragment={`${ShopVoucherService.shortFragment} 
          member { id shopName shopLogo code } 
        `}
      >
        <DataTable.Header>
          <DataTable.Title />
          <DataTable.Buttons>
            <DataTable.Button outline isRefreshButton refreshAfterTask />
            <DataTable.Button
              primary
              text="Xuất danh sách coupon"
              onClick={() => setOpenExportVoucher(true)}
            />
          </DataTable.Buttons>
        </DataTable.Header>

        <DataTable.Divider />

        <DataTable.Toolbar>
          <DataTable.Search />
          <DataTable.Filter>
            <Field name="memberId" noError>
              <Select
                className="min-w-2xs"
                placeholder="Lọc theo cửa hàng"
                hasImage
                clearable
                autocompletePromise={({ id, search }) =>
                  MemberService.getAllAutocompletePromise(
                    { id, search },
                    {
                      fragment: "id shopName shopLogo",
                      parseOption: (data) => ({
                        value: data.id,
                        label: data.shopName,
                        image: data.shopLogo,
                      }),
                    }
                  )
                }
              />
            </Field>
          </DataTable.Filter>
        </DataTable.Toolbar>

        <DataTable.Table className="mt-4 bg-white">
          <DataTable.Column
            label="Mã khuyến mãi"
            className="max-w-xs"
            render={(item: ShopVoucher) => (
              <DataTable.CellText
                image={item.image}
                className="font-semibold"
                value={item.code}
                subText={item.description}
              />
            )}
          />
          <DataTable.Column
            label="Cửa hàng"
            render={(item: ShopVoucher) => (
              <DataTable.CellText
                value={item.member?.shopName}
                subText={item.member?.code}
                image={item.member?.shopLogo}
              />
            )}
          />
          <DataTable.Column
            center
            label="Loại"
            render={(item: ShopVoucher) => (
              <DataTable.CellStatus value={item.type} options={SHOP_VOUCHER_TYPES} />
            )}
          />
          <DataTable.Column
            center
            label="Ngày hoạt động"
            render={(item: ShopVoucher) => (
              <DataTable.CellText
                className="text-sm text-gray-500"
                value={
                  <>
                    {item.startDate && (
                      <div className="flex">
                        <i className="mt-1 mr-1">
                          <RiCalendarEventLine />
                        </i>
                        Từ ngày {formatDate(item.startDate, "dd-MM-yyyy")}
                      </div>
                    )}
                    {item.endDate && (
                      <div className="flex">
                        <i className="mt-1 mr-1">
                          <RiCalendarEventLine />
                        </i>
                        Đến ngày {formatDate(item.endDate, "dd-MM-yyyy")}
                      </div>
                    )}
                  </>
                }
              />
            )}
          />
          <DataTable.Column
            center
            label="Kích hoạt"
            render={(item: ShopVoucher) => (
              <DataTable.CellBoolean className="flex justify-center" value={item.isActive} />
            )}
          />
        </DataTable.Table>
        <DataTable.Pagination />
        <DataTable.Consumer>
          {({ filter }) => (
            <ExportVouchersDialog
              isOpen={openExportVoucher}
              onClose={() => {
                setOpenExportVoucher(false);
              }}
              memberId={filter.memberId}
            />
          )}
        </DataTable.Consumer>
      </DataTable>
    </Card>
  );
}
