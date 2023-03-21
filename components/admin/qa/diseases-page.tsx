import { useState } from "react";
import { useToast } from "../../../lib/providers/toast-provider";
import { Disease, DiseaseService } from "../../../lib/repo/disease.repo";
import { PlantService } from "../../../lib/repo/plant.repo";
import {
  Button,
  Field,
  Form,
  FormProps,
  ImageInput,
  Input,
  InputProps,
  Select,
} from "../../shared/utilities/form";
import { Card } from "../../shared/utilities/misc";
import { DataTable, useDataTable } from "../../shared/utilities/table/data-table";
import { useTranslation } from "react-i18next";
import { RiEdit2Line } from "react-icons/ri";
import { labelAccentField } from "../../shared/common/label-accent";

export function DiseasesPage() {
  const [openCreateDiseasesDialog, setOpenCreateDiseasesDialog] = useState<Disease>();

  const { t } = useTranslation();
  return (
    <Card>
      <DataTable<Disease> crudService={DiseaseService} order={{ createdAt: -1 }}>
        <DataTable.Header>
          <DataTable.Consumer>
            {({ pagination: { total } }) => (
              <DataTable.Title subtitle={`Tổng ${total} loại bệnh`} />
            )}
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
              text="Tạo loại bệnh"
              className="px-5"
              onClick={() => setOpenCreateDiseasesDialog(null)}
            />
          </DataTable.Buttons>
        </DataTable.Header>
        <DataTable.Search className="mt-8 mb-5" />

        <DataTable.Table className="mt-4 bg-white">
          <DataTable.Column
            label={t("Tên loại bệnh")}
            render={(item: Disease) => (
              <DataTable.CellText
                className="min-w-max"
                image={item.image}
                imageClassName="w-8"
                value={item.name}
              />
            )}
          />
          <DataTable.Column
            render={(item: Disease) => (
              <DataTable.CellText
                className="break-all"
                value={item.plants?.map((item) => item.name).join(", ")}
              />
            )}
          />
          <DataTable.Column
            right
            render={(item: Disease) => (
              <>
                <Button
                  className="px-[6px]"
                  tooltip="Sửa loại bệnh"
                  icon={<RiEdit2Line />}
                  onClick={() => {
                    setOpenCreateDiseasesDialog(item);
                  }}
                />
                <DataTable.CellButton value={item} isDeleteButton tooltip="Xóa loại bệnh" />
              </>
            )}
          />
        </DataTable.Table>
        <DataTable.Pagination />
        <DiseaseDialogForm
          title={openCreateDiseasesDialog === null ? "Tạo loại bệnh" : "Sửa loại bệnh"}
          isOpen={openCreateDiseasesDialog !== undefined}
          onClose={() => {
            setOpenCreateDiseasesDialog(undefined);
          }}
          disease={openCreateDiseasesDialog}
        />
      </DataTable>
    </Card>
  );
}
export interface DiseaseFormDialog extends FormProps {
  disease?: Disease;
}

export function DiseaseDialogForm({ ...props }: DiseaseFormDialog) {
  const toast = useToast();
  const { loadAll } = useDataTable();
  return (
    <Form
      dialog
      defaultValues={props.disease ? props.disease : {}}
      {...props}
      onSubmit={async (data) => {
        try {
          await DiseaseService.createOrUpdate({ id: props.disease?.id, data });
          props.onClose();
          loadAll(true);
        } catch (error) {
          toast.error("Tạo loại bệnh thất bại" + error);
        }
      }}
    >
      <Field label="Tên loại bệnh" {...labelAccentField} name="name" required>
        <Input clearable placeholder="Vui lòng nhập tên loại bệnh" />
      </Field>
      <Field label="Chọn loại cây " {...labelAccentField} required name="plantIds">
        <Select
          multi
          placeholder="Vui lòng chọn loại cây"
          optionsPromise={() =>
            PlantService.getAllOptionsPromise({
              query: {
                limit: 0,
                order: { createdAt: -1 },
              },
              parseOption: (data) => ({
                value: data.id,
                label: data.name,
              }),
            })
          }
        />
      </Field>
      <Field label="Hình loại bệnh" {...labelAccentField} className="mb-8" name="image">
        <ImageInput />
      </Field>

      <Form.Footer />
    </Form>
  );
}
