import { Card } from "../../../shared/utilities/misc";
import { WarehouseNoteTable } from "../../../shared/warehouse/warehouse-note/warehouse-note-table";

export function StaffInventoryVouchers() {
  return (
    <Card>
      <WarehouseNoteTable type="staff" />
    </Card>
  );
}
