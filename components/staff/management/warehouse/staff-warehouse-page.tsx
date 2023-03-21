import { Card } from "../../../shared/utilities/misc";
import { WarehouseTable } from "../../../shared/warehouse/warehouse-table";


export function StaffWarehousePage() {
  return (
    <Card>
      <WarehouseTable type="staff" />
    </Card>
  );
}
