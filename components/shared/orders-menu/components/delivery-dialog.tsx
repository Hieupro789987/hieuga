import { useFormContext } from "react-hook-form";
import { parseNumber } from "../../../../lib/helpers/parser";
import { useAlert } from "../../../../lib/providers/alert-provider";
import { useToast } from "../../../../lib/providers/toast-provider";
import { DriverService, DriverType, DRIVER_TYPES } from "../../../../lib/repo/driver.repo";
import { Order, OrderService } from "../../../../lib/repo/order.repo";
import { DialogProps } from "../../../shared/utilities/dialog/dialog";
import { Radio } from "../../../shared/utilities/form";
import { Field } from "../../../shared/utilities/form/field";
import { Form } from "../../../shared/utilities/form/form";
import { Select } from "../../../shared/utilities/form/select";

export function DeliveryDialog({
  orderId,
  openDetailsOrderDialog,
  onConfirm,
  onReloadDetailsDialog,
  ...props
}: DialogProps & {
  orderId: string;
  openDetailsOrderDialog: boolean;
  onConfirm: () => void;
  onReloadDetailsDialog: (order: Order) => void;
}) {
  const alert = useAlert();
  const toast = useToast();
  return (
    <Form
      dialog
      width={400}
      title="Chọn tài xế"
      {...props}
      onSubmit={async (data) => {
        try {
          let res: any;
          if (data.type == "DRIVER") {
            console.log("check1");
            await OrderService.transferOrderToDriver(orderId, data.driverId);
            res = await OrderService.deliveryMemberOrder(orderId);
          } else {
            console.log("check2");
            res = await OrderService.transferOrderToAhamove(
              orderId,
              data.serviceId,
              data.ahamovePromotionCode
            );
          }
          console.log("res", res);
          onConfirm();
          props.onClose();
          if (openDetailsOrderDialog) {
            onReloadDetailsDialog(res);
          }
          alert.success("Chuyển giao hàng thành công");
        } catch (err) {
          console.error(err);
          toast.error("Chuyển giao hàng thất bại");
        }
      }}
    >
      <Field label="Phương thức giao hàng" name="type" required>
        <Radio options={DRIVER_TYPES} />
      </Field>

      <DriverFields orderId={orderId} />
      <Form.Footer submitText="Giao hàng" />
    </Form>
  );
}

function DriverFields({ orderId }: { orderId: string }) {
  const { watch } = useFormContext();

  const type: DriverType = watch("type");
  const serviceId: string = watch("serviceId");

  return (
    <>
      <Field
        label="Chọn tài xế"
        name="driverId"
        className={`${type == "DRIVER" ? "" : "hidden"}`}
        required={type == "DRIVER"}
      >
        <Select
          hasImage
          optionsPromise={() =>
            DriverService.getAllOptionsPromise({
              fragment: "id name avatar",
              parseOption: (data) => ({ value: data.id, label: data.name, image: data.avatar }),
            })
          }
        />
      </Field>
      <Field
        label="Chọn loại dịch vụ"
        name="serviceId"
        className={`${type == "AHAMOVE" ? "" : "hidden"}`}
        required={type == "AHAMOVE"}
      >
        <Select
          hasImage
          optionsPromise={() => {
            return DriverService.getAllDeliveryService(orderId).then((res) => {
              return res
                .filter((x) => x.serviceId !== "DRIVER")
                .map((item) => {
                  return {
                    value: item.serviceId,
                    label: `${item.serviceName} - ${parseNumber(item.shipFee)}đ`,
                    image: item.iconUrl,
                  };
                });
            });
          }}
        />
      </Field>
      {serviceId && (
        <Field
          label="Chọn mã khuyến mãi"
          name="ahamovePromotionCode"
          className={`${type == "AHAMOVE" ? "" : "hidden"}`}
        >
          <Select
            hasImage
            optionsPromise={() => {
              return DriverService.getAhamovePromotions(orderId).then((res) => {
                return res.map((item) => {
                  return { value: item.id, label: item.desc, image: item.image };
                });
              });
            }}
          />
        </Field>
      )}
    </>
  );
}
