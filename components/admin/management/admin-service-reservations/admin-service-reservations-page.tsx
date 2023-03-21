import { useState } from "react";
import { RiFileList2Line, RiMapPinFill, RiStoreFill } from "react-icons/ri";
import { parseNumber } from "../../../../lib/helpers/parser";
import { useToast } from "../../../../lib/providers/toast-provider";
import {
  ServiceReservation,
  ServiceReservationService,
  SERVICE_RESERVATION_ADDRESS_TYPE_LIST,
  SERVICE_RESERVATION_STATUS_LIST,
} from "../../../../lib/repo/services/service-reservation.repo";
import { ShopServiceCategoryService } from "../../../../lib/repo/services/shop-service-category.repo";
import { ServiceReservationsTable } from "../../../shared/service-reservations/service-reservations-table";
import { DatePicker, Field, Select } from "../../../shared/utilities/form";
import { Card } from "../../../shared/utilities/misc";
import { DataTable } from "../../../shared/utilities/table/data-table";
import { ExportReservationsDialog } from "../../../shop/shop-service-reservations/components/export-reservations-dialog";
import { ServiceReservationDetailsDialog } from "../../../shop/shop-service-reservations/components/service-reservation-details/service-reservation-details-dialog";

interface AdminServiceReservationsPageProps extends ReactProps {
  readOnly: boolean;
}

export function AdminServiceReservationsPage({
  readOnly,
  ...props
}: AdminServiceReservationsPageProps) {
  // const toast = useToast();
  // const [reservationDate, setReservationDate] = useState<any>();
  // const [shopServiceCategoryId, setShopServiceCategoryId] = useState<string>();
  // const [status, setStatus] = useState();
  // const [addressType, setAddressType] = useState();
  // const [openExportReservations, setOpenExportReservations] = useState(false);
  // const [reservationId, setReservationId] = useState<string>();
  // const [openUpdatePriceDialog, setOpenUpdatePriceDialog] = useState(false);

  // const handleFilterDate = (val) => {
  //   const obj = { reservationDate: val?.startDate && val?.endDate ? {} : undefined };
  //   if (val?.startDate) {
  //     obj["reservationDate"]["$gte"] = val?.startDate;
  //   }
  //   if (val?.endDate) {
  //     obj["reservationDate"]["$lte"] = val?.endDate;
  //   }
  //   setReservationDate(obj);
  // };

  return (
    // <Card>
    //   <DataTable<ServiceReservation>
    //     crudService={ServiceReservationService}
    //     order={{ createdAt: -1 }}
    //     autoRefresh={30000}
    //     filter={{
    //       shopServiceCategoryId: !!shopServiceCategoryId ? shopServiceCategoryId : undefined,
    //       status: !!status ? status : undefined,
    //       addressType: !!addressType ? addressType : undefined,
    //       ...reservationDate,
    //     }}
    //   >
    //     <DataTable.Header>
    //       <DataTable.Consumer>
    //         {({ pagination: { total } }) => <DataTable.Title subtitle={`Tổng ${total} dịch vụ`} />}
    //       </DataTable.Consumer>
    //       <DataTable.Buttons>
    //         <DataTable.Button outline isRefreshButton refreshAfterTask />
    //         <DataTable.Button
    //           primary
    //           outline
    //           text="Xuất danh sách lịch hẹn"
    //           onClick={() =>
    //             // setOpenExportReservations(true)
    //             toast.info("Tính năng đang cập nhật.")
    //           }
    //         />
    //       </DataTable.Buttons>
    //     </DataTable.Header>

    //     <div className="mt-4">
    //       <DataTable.Toolbar>
    //         <DataTable.Search className="h-12" />
    //         <DataTable.Filter>
    //           <div className="flex flex-wrap justify-end gap-2">
    //             <Field noError>
    //               <DatePicker
    //                 className="h-12"
    //                 selectsRange
    //                 startOfDay
    //                 endOfDay
    //                 placeholder="Ngày hẹn"
    //                 onChange={(val) => handleFilterDate(val)}
    //               />
    //             </Field>
    //             <Field name="shopServiceCategoryId" noError>
    //               <Select
    //                 className="inline-grid h-12"
    //                 autosize
    //                 clearable
    //                 placeholder="Danh mục"
    //                 optionsPromise={() => ShopServiceCategoryService.getAllOptionsPromise()}
    //                 onChange={(val) => setShopServiceCategoryId(val)}
    //               />
    //             </Field>
    //             <Field name="status" noError>
    //               <Select
    //                 className="inline-grid h-12"
    //                 autosize
    //                 clearable
    //                 placeholder="Trạng thái"
    //                 options={SERVICE_RESERVATION_STATUS_LIST}
    //                 onChange={(val) => setStatus(val)}
    //               />
    //             </Field>
    //             <Field name="addressType" noError>
    //               <Select
    //                 className="inline-grid h-12"
    //                 autosize
    //                 clearable
    //                 placeholder="Địa điểm"
    //                 options={SERVICE_RESERVATION_ADDRESS_TYPE_LIST}
    //                 onChange={(val) => setAddressType(val)}
    //               />
    //             </Field>
    //           </div>
    //         </DataTable.Filter>
    //       </DataTable.Toolbar>
    //     </div>

    //     <DataTable.Table className="mt-4 bg-white">
    //       <DataTable.Column
    //         label="Lịch hẹn"
    //         render={(item: ServiceReservation) => (
    //           <DataTable.CellText
    //             value={
    //               <>
    //                 <div className="font-bold">{`#${item.code}`}</div>
    //                 <div className="text-sm text-gray-600">{item.name}</div>
    //               </>
    //             }
    //           />
    //         )}
    //       />
    //       <DataTable.Column
    //         center
    //         label="Ngày hẹn"
    //         render={(item: ServiceReservation) => (
    //           <DataTable.CellDate value={item.reservationDate} />
    //         )}
    //       />
    //       <DataTable.Column
    //         label="Người đặt"
    //         render={(item: ServiceReservation) => (
    //           <DataTable.CellText
    //             className="font-bold"
    //             subTextClassName="font-normal"
    //             value={item.reserverFullname}
    //             subText={item.reserverInternationalPhone}
    //           />
    //         )}
    //       />
    //       <DataTable.Column
    //         center
    //         label="Cửa hàng"
    //         render={(item: ServiceReservation) => (
    //           <DataTable.CellText value={item.member?.shopName} />
    //         )}
    //       />
    //       <DataTable.Column
    //         center
    //         label="Địa điểm thực hiện"
    //         render={(item: ServiceReservation) => (
    //           <DataTable.CellText
    //             value={
    //               item.addressType === "AT_SHOP" ? (
    //                 <div className="flex justify-center gap-2">
    //                   <i className="text-lg text-gray-500">
    //                     <RiStoreFill />
    //                   </i>
    //                   <div className="">Tại chi nhánh cửa hàng</div>
    //                 </div>
    //               ) : (
    //                 <div className="flex justify-center gap-2">
    //                   <i className="text-lg text-gray-500">
    //                     <RiMapPinFill />
    //                   </i>
    //                   <div className="">Tại địa chỉ khách hàng</div>
    //                 </div>
    //               )
    //             }
    //           />
    //         )}
    //       />
    //       <DataTable.Column
    //         center
    //         label="Trạng thái"
    //         render={(item: ServiceReservation) => (
    //           <DataTable.CellStatus
    //             value={item.status}
    //             options={SERVICE_RESERVATION_STATUS_LIST}
    //             type="light"
    //           />
    //         )}
    //       />
    //       <DataTable.Column
    //         label="Tổng tiền"
    //         render={(item: ServiceReservation) => (
    //           <DataTable.CellText
    //             value={item.totalPrice === 0 ? "Liên hệ" : parseNumber(item.totalPrice, true)}
    //           />
    //         )}
    //       />
    //       <DataTable.Column
    //         right
    //         render={(item: ServiceReservation) => (
    //           <>
    //             <DataTable.CellButton
    //               value={item}
    //               icon={<RiFileList2Line />}
    //               tooltip="Xem chi tiết"
    //               onClick={() => setReservationId(item.id)}
    //             />
    //           </>
    //         )}
    //       />
    //     </DataTable.Table>
    //     <DataTable.Pagination />

    //     <DataTable.Consumer>
    //       {({ filter, loadAll }) => (
    //         <>
    //           <ServiceReservationDetailsDialog
    //             id={reservationId}
    //             isOpen={!!reservationId}
    //             showUpdatePriceDialog={openUpdatePriceDialog}
    //             onClose={() => {
    //               setReservationId("");
    //               setOpenUpdatePriceDialog(false);
    //               loadAll(true);
    //             }}
    //             readOnly={readOnly}
    //           />
    //           <ExportReservationsDialog
    //             isOpen={openExportReservations}
    //             onClose={() => {
    //               setOpenExportReservations(false);
    //             }}
    //             // shopBranchId={filter.shopBranchId}
    //             // pickupMethod={filter.pickupMethod}
    //             // paymentMethod={filter.paymentMethod}
    //             // status={filter.status}
    //           />
    //         </>
    //       )}
    //     </DataTable.Consumer>
    //   </DataTable>
    // </Card>
    <ServiceReservationsTable isAdmin isShop={false} />
  );
}
