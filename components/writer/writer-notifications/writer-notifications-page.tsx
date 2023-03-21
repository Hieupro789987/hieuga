import { useState } from "react";
import { POST_APPROVE_STATUS_NOTIFICATION_OPTIONS } from "../../../lib/repo/post.repo";
import {
  WriterNotification,
  WriterNotificationService,
} from "../../../lib/repo/writer/writer-notification.repo";
import { Button, Field, Select } from "../../shared/utilities/form";
import { Card } from "../../shared/utilities/misc";
import { DataTable } from "../../shared/utilities/table/data-table";
import { WriterNotificationsTable } from "./components/writer-notifications-table";

export function WriterNotificationsPage() {
  const [trigger, setTrigger] = useState(false);

  return (
    <Card>
      <DataTable<WriterNotification>
        crudService={WriterNotificationService}
        order={{ createdAt: -1 }}
      >
        <DataTable.Toolbar>
          <div className="">
            <div className="text-lg font-semibold">Danh sách thông báo</div>
            <DataTable.Consumer>
              {({ pagination: { total } }) => (
                <div className="text-sm text-gray-600">{`Tổng ${total || 0} thông báo`}</div>
              )}
            </DataTable.Consumer>
          </div>
          <DataTable.Filter>
            <DataTable.Button outline isRefreshButton refreshAfterTask className="bg-white" />
            <Field noError name="approveStatus">
              <Select
                clearable
                autosize
                placeholder="Lọc trạng thái"
                options={POST_APPROVE_STATUS_NOTIFICATION_OPTIONS}
              />
            </Field>
          </DataTable.Filter>
          <Button
            primary
            outline
            className="w-36"
            text="Xem hết"
            onClick={() => {
              setTrigger(true);
            }}
          />
        </DataTable.Toolbar>
        <DataTable.Consumer>
          {({ items }) => (
            <WriterNotificationsTable className="mt-4 bg-white" items={items} trigger={trigger} />
          )}
        </DataTable.Consumer>

        <DataTable.Pagination />
      </DataTable>
    </Card>
  );
}

{
  /* <DataTable.Table className="mt-4 bg-white">
<DataTable.Column
  label="Thời gian"
  render={(item: WriterNotification) => (
    <DataTable.CellDate value={item.createdAt} format="HH:mm dd/MM/yyyy" />
  )}
/>
<DataTable.Column
  label="Bài viết"
  render={(item: WriterNotification) => (
    <DataTable.CellText value={item.post?.title} className="text-ellipsis-2" />
  )}
/>
<DataTable.Column
  label="Trạng thái"
  render={(item: WriterNotification) => (
    <DataTable.CellStatus
      value={item.approveStatus}
      type="light"
      options={POST_APPROVE_STATUS_NO_REJECTED_OPTIONS}
    />
  )}
/>
<DataTable.Column
  label="Lý do"
  render={(item: WriterNotification) => (
    <DataTable.CellText value={item.reason} className="text-ellipsis-2" />
  )}
/> */
}
{
  /* <DataTable.Column
  right
  render={(item: any) => (
    <>
      <DataTable.CellButton value={item} isUpdateButton />
      <DataTable.CellButton value={item} isDeleteButton />
    </>
  )}
/>  */
}
{
  /* </DataTable.Table> */
}
