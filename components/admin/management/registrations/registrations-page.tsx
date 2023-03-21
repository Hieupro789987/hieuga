import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { RiEyeLine } from "react-icons/ri";
import { SHOP_TYPE_LIST } from "../../../../lib/repo/member.repo";
import {
  ShopRegistration,
  ShopRegistrationService,
  SHOP_REGISTRATION_STATUS,
} from "../../../../lib/repo/shop-registration.repo";
import { DatePicker } from "../../../shared/utilities/form/date";
import { Field } from "../../../shared/utilities/form/field";
import { Select } from "../../../shared/utilities/form/select";
import { Card } from "../../../shared/utilities/misc";
import { DataTable } from "../../../shared/utilities/table/data-table";
import { RegistrationDetailSlideout } from "./components/registration-detail-slideout";

export function RegistrationsPage(props) {
  const router = useRouter();
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [registerId, setRegisterId] = useState<string>();

  const filter = useMemo(() => {
    let tempFilter = {};

    if (fromDate || toDate) {
      tempFilter["updatedAt"] = {};
      if (fromDate) {
        tempFilter["updatedAt"]["$gte"] = fromDate;
      }
      if (toDate) {
        tempFilter["updatedAt"]["$lte"] = toDate;
      }
    }
    return tempFilter;
  }, [fromDate, toDate]);

  useEffect(() => {
    if (router.query["create"]) {
      setRegisterId("");
    } else if (router.query["id"]) {
      setRegisterId(router.query["id"] as string);
    } else {
      setRegisterId(null);
    }
  }, [router.query]);

  return (
    <Card>
      <DataTable<ShopRegistration>
        crudService={ShopRegistrationService}
        order={{ createdAt: -1 }}
        filter={filter}
        updateItem={(item) =>
          router.replace({ pathname: location.pathname, query: { id: item.id } }, null, {
            shallow: true,
          })
        }
      >
        <DataTable.Header>
          <DataTable.Title />
          <DataTable.Buttons>
            <DataTable.Button outline isRefreshButton refreshAfterTask />
          </DataTable.Buttons>
        </DataTable.Header>

        <DataTable.Divider />

        <DataTable.Toolbar>
          <DataTable.Search />
          <DataTable.Filter>
            <Field name="status" noError>
              <Select
                autosize
                clearable
                placeholder="Tất cả trạng thái"
                options={SHOP_REGISTRATION_STATUS}
              />
            </Field>
            <Field noError>
              <DatePicker value={fromDate} onChange={setFromDate} placeholder="Từ ngày" />
            </Field>
            <Field noError>
              <DatePicker value={toDate} onChange={setToDate} placeholder="Đến ngày" />
            </Field>
          </DataTable.Filter>
        </DataTable.Toolbar>

        <DataTable.Table className="mt-4">
          <DataTable.Column
            orderBy="shopName"
            label="Cửa hàng"
            render={(item: ShopRegistration) => (
              <DataTable.CellText
                value={item.shopName}
                subText={item.shopCode}
                className="font-semibold"
              />
            )}
          />
          <DataTable.Column
            orderBy="name"
            label="Người đại diện"
            render={(item: ShopRegistration) => (
              <DataTable.CellText
                value={item.name}
                subText={item.phone}
                className="font-semibold"
              />
            )}
          />
          <DataTable.Column
            label="Email đăng ký"
            render={(item: ShopRegistration) => <DataTable.CellText value={item.email} />}
          />
          <DataTable.Column
            center
            label="Danh mục"
            render={(item: ShopRegistration) => <DataTable.CellText value={item.category?.name} />}
          />
          <DataTable.Column
            center
            label="Thởi gian đăng ký"
            render={(item: ShopRegistration) => (
              <DataTable.CellDate format="dd-MM-yyyy HH:mm" value={item.createdAt} />
            )}
          />
          <DataTable.Column
            center
            orderBy="status"
            label="Trạng thái"
            render={(item: ShopRegistration) => (
              <DataTable.CellStatus value={item.status} options={SHOP_REGISTRATION_STATUS} />
            )}
          />
          <DataTable.Column
            center
            label="Loại cửa hàng"
            render={(item: ShopRegistration) => (
              <DataTable.CellStatus type="text" options={SHOP_TYPE_LIST} value={item?.shopType} />
            )}
          />
          <DataTable.Column
            right
            render={(item: ShopRegistration) => (
              <>
                <DataTable.CellButton value={item} isUpdateButton icon={<RiEyeLine />} />
              </>
            )}
          />
        </DataTable.Table>
        <DataTable.Pagination />
        <DataTable.Consumer>
          {({ loadAll }) => (
            <RegistrationDetailSlideout onSubmit={() => loadAll(true)} registerId={registerId} />
          )}
        </DataTable.Consumer>
      </DataTable>
    </Card>
  );
}
