import { useState } from "react";
import { useToast } from "../../../lib/providers/toast-provider";
import { Plant, PlantService } from "../../../lib/repo/plant.repo";
import { Button, Field, Form, FormProps, ImageInput, Input } from "../../shared/utilities/form";
import { Card } from "../../shared/utilities/misc";
import { DataTable, useDataTable } from "../../shared/utilities/table/data-table";

export function PlantsPage() {
  const [openCreatePlantDialog, setOpenCreatePlantDialog] = useState<Plant>();

  return (
    <Card>
      <DataTable<Plant>
        crudService={PlantService}
        order={{ createdAt: -1 }}
        updateItem={(item) => setOpenCreatePlantDialog(item as Plant)}
      >
        <DataTable.Header>
          <DataTable.Consumer>
            {({ pagination: { total } }) => <DataTable.Title subtitle={`Tổng ${total} loại cây`} />}
          </DataTable.Consumer>
          <DataTable.Buttons>
            <DataTable.Button
              textPrimary
              outline
              isRefreshButton
              refreshAfterTask
              className="bg-white"
            />
            <Button
              primary
              text="Tạo loại cây"
              className="px-5"
              onClick={() => setOpenCreatePlantDialog(null)}
            />
          </DataTable.Buttons>
        </DataTable.Header>
        <DataTable.Search className="mt-8 mb-5" />
        <DataTable.Table className="mt-4 bg-white">
          <DataTable.Column
            label={"Tên loại cây"}
            render={(item: Plant) => (
              <DataTable.CellText image={item.image} imageClassName="w-8" value={item.name} />
            )}
          />
          <DataTable.Column
            right
            render={(item: Plant) => (
              <>
                <DataTable.CellButton value={item} isUpdateButton tooltip="Chỉnh sửa" />
                <DataTable.CellButton value={item} isDeleteButton tooltip="Xóa" />
              </>
            )}
          />
        </DataTable.Table>
        <DataTable.Pagination />
        <PlantDialogForm
          title={openCreatePlantDialog === null ? "Tạo loại cây" : "Sửa loại cây"}
          isOpen={openCreatePlantDialog !== undefined}
          onClose={() => {
            setOpenCreatePlantDialog(undefined);
          }}
          plant={openCreatePlantDialog}
        />
      </DataTable>
    </Card>
  );
}

export interface PlantFormDialog extends FormProps {
  plant?: Plant;
}

export function PlantDialogForm({ ...props }: PlantFormDialog) {
  const toast = useToast();
  const { loadAll } = useDataTable();

  return (
    <Form
      dialog
      width={400}
      defaultValues={props.plant ? props.plant : {}}
      {...props}
      onSubmit={async (data) => {
        try {
          await PlantService.createOrUpdate({ id: props.plant?.id, data });
          props.onClose();
          loadAll(true);
        } catch (error) {
          toast.error("Tạo loại cây thất bại" + error);
        }
      }}
    >
      <Field
        label="Tên loại cây"
        labelClassName="[&>*:nth-child(1)]:text-accent"
        name="name"
        required
      >
        <Input placeholder="Vui lòng nhập tên loại cây" />
      </Field>
      <Field label="Hình cây" labelClassName="[&>*:nth-child(1)]:text-accent" name="image">
        <ImageInput placeholder="Link ảnh" />
      </Field>

      <Form.Footer />
    </Form>
  );
}
