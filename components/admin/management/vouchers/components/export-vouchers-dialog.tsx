import { useState } from "react";
import { saveFile } from "../../../../../lib/helpers/file";
import { formatDate } from "../../../../../lib/helpers/parser";
import { useToast } from "../../../../../lib/providers/toast-provider";
import { MemberService } from "../../../../../lib/repo/member.repo";
import { ShopVoucherService } from "../../../../../lib/repo/shop-voucher.repo";
import { DateField } from "../../../../shared/date-field/date-field";
import { DialogProps } from "../../../../shared/utilities/dialog/dialog";
import { Field } from "../../../../shared/utilities/form/field";
import { Form } from "../../../../shared/utilities/form/form";
import { Select } from "../../../../shared/utilities/form/select";

interface PropsType extends DialogProps {
  memberId: string;
}
export function ExportVouchersDialog({ memberId, ...props }: PropsType) {
  const toast = useToast();
  const [memberFullData, setMemberFullData] = useState<Option>();

  const onSubmit = async (data) => {
    const { fromDate, toDate, memberId } = data;
    try {
      await saveFile(
        () =>
          ShopVoucherService.exportExcelAdmin(
            formatDate(fromDate, "yyyy/MM/dd"),
            formatDate(toDate, "yyyy/MM/dd"),
            memberId
          ),
        "excel",
        `COUPON_TU_${formatDate(fromDate, "dd-MM-yyyy")}_DEN_${formatDate(toDate, "dd-MM-yyyy")}${
          memberFullData
            ? `_CUA_HANG_${(memberFullData.label as string).toUpperCase().replaceAll(" ", "_")}`
            : ""
        }.xlsx`,
        {
          onError: (message) => toast.error("Xuất thất bại", message),
        }
      );
    } catch (err) {}
  };

  return (
    <Form
      dialog
      title="Xuất danh sách coupon"
      isOpen={props.isOpen}
      onClose={props.onClose}
      defaultValues={{
        memberId,
      }}
      onSubmit={onSubmit}
      grid
      width="600px"
    >
      <Field name="memberId" label="Cửa hàng" cols={12}>
        <Select
          placeholder="Lọc theo cửa hàng"
          hasImage
          onChange={(member, memberFullData) => {
            setMemberFullData(memberFullData);
          }}
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
      <DateField />
      <Form.Footer />
    </Form>
  );
}
