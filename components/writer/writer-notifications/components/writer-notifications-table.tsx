import Link from "next/link";
import { useEffect, useState } from "react";
import { useWriterLayoutContext } from "../../../../layouts/writer-layout/providers/writer-layout-provider";
import { formatDate } from "../../../../lib/helpers/parser";
import { useCrud } from "../../../../lib/hooks/useCrud";
import { BaseModel } from "../../../../lib/repo/crud.repo";
import { POST_APPROVE_STATUS_NOTIFICATION_OPTIONS } from "../../../../lib/repo/post.repo";
import {
  WriterNotification,
  WriterNotificationService,
} from "../../../../lib/repo/writer/writer-notification.repo";
import { NotFound, Spinner, StatusLabel } from "../../../shared/utilities/misc";
import { useDataTable } from "../../../shared/utilities/table/data-table";

interface TableProps extends ReactProps {
  items?: BaseModel[];
  trigger?: boolean;
}

export function WriterNotificationsTable({
  className = "",
  trigger = false,
  style = {},
  ...props
}: TableProps) {
  const [tableItems, setTableItems] = useState<BaseModel[]>(undefined);
  const { loadAll } = useDataTable();

  useEffect(() => {
    setTableItems(props.items);
  }, [props.items]);

  const handleClick = async (item: WriterNotification) => {
    if (item.seen) return;
    const res = await WriterNotificationService.markWriterNotificationSeen(item?.id);
    await loadAll(true);
  };

  const seenAllNotifications = async () => {
    const list = await WriterNotificationService.getAll({ query: { filter: { seen: false } } });
    if (list.data.length > 0) {
      await Promise.all(
        list.data.map(async (item) => {
          await WriterNotificationService.markWriterNotificationSeen(item.id);
          await loadAll();
        })
      );
    }
  };

  useEffect(() => {
    if (trigger) {
      seenAllNotifications();
    }
  }, [trigger]);

  return (
    <table
      className={`w-full border-t border-l border-r border-gray-300 border-collapse ${className}`}
      style={{ ...style }}
    >
      <thead>
        <tr className="text-sm font-semibold text-gray-600 uppercase border-b border-gray-300 bg-gray-50">
          <th className="w-40 py-3 pl-3 pr-2 text-left">Thời gian</th>
          <th className="px-2 py-3 text-left">Bài viết</th>
          <th className="px-2 py-3">Trạng thái</th>
          <th className="py-3 pl-2 pr-3 text-left">Lý do</th>
          <th className="w-4 px-2 py-3"></th>
        </tr>
      </thead>
      <tbody className="relative">
        {!tableItems ? (
          <tr>
            <td className="border-b" colSpan={100}>
              <Spinner className="py-20" />
            </td>
          </tr>
        ) : tableItems.length === 0 ? (
          <tr>
            <td className="border-b" colSpan={100}>
              <NotFound className="py-20" text="Chưa có thông báo." />
            </td>
          </tr>
        ) : (
          <>
            {tableItems.map((item: WriterNotification) => (
              <tr
                key={item.id}
                className={`border-b text-accent text-sm duration-75 h-12 ${
                  !item.seen && "bg-primary-light"
                }`}
                onClick={() => handleClick(item)}
              >
                <td className="w-40 py-2 pl-3 pr-2">
                  {formatDate(item.createdAt, "HH:mm dd/MM/yyyy")}
                </td>
                <td className="max-w-xs p-2 overflow-hidden">
                  <Link
                    href={{
                      pathname: "/writer/news",
                      query: { id: item.post?.id },
                    }}
                  >
                    <a target={"_blank"}>
                      <div className="font-semibold text-ellipsis-2 hover:underline hover:text-blue-700">
                        {item.post?.title}
                      </div>
                    </a>
                  </Link>
                </td>
                <td className="p-2 text-center">
                  <StatusLabel
                    type="light"
                    maxContent
                    value={item.approveStatus}
                    extraClassName="px-4 py-2"
                    options={POST_APPROVE_STATUS_NOTIFICATION_OPTIONS}
                  />
                </td>
                <td className="p-2 overflow-hidden w-96">
                  <div className="w-64 text-ellipsis-2">{item.reason || ""}</div>
                </td>
                <td className="w-4 py-2 pl-2 pr-3">
                  {!item.seen && (
                    <div className="flex-center">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </>
        )}
      </tbody>
    </table>
  );
}
