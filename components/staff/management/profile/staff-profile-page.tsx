import { useState } from "react";

import { useAuth } from "../../../../lib/providers/auth-provider";
import { useToast } from "../../../../lib/providers/toast-provider";
import { STAFF_SCOPE } from "../../../../lib/repo/staff.repo";
import { ChangeAvatarDialog } from "../../../shared/auth/change-avatar-dialog";

import { Form, Button, Field, Input } from "../../../shared/utilities/form";
import { AddressGroup } from "../../../shared/utilities/form/address-group";
import { LabelAccent, labelAccentField } from "../../../shared/common/label-accent";

import { Img } from "../../../shared/utilities/misc";

interface StaffProfilePageProps extends ReactProps {}

export function StaffProfilePage({ ...props }: StaffProfilePageProps) {
  const toast = useToast();
  const { staff, staffUpdateMe } = useAuth();
  const [openChangeAvatar, setOpenChangeAvatar] = useState(false);

  const handleSubmit = async (data) => {
    console.log("data", data);
    try {
      await staffUpdateMe(data);
      toast.success("Cập nhật thông tin thành công");
    } catch (error) {
      console.log(error);
      toast.error("Cập nhật thông tin không thành công", error.message);
    }
  };

  const convertScopes = (scopes: STAFF_SCOPE[]) => {
    if (!scopes?.length) return "";

    return scopes
      .map((scope) => {
        if (scope === "REPORT") return "App - Xem thống kê";
        if (scope === "MANAGER") return "App - Quản lý";
        if (scope === "WAREHOUSE") return "Thủ kho";
        if (scope === "ORDER") return "Xử lý đơn hàng";
      })
      .join(", ");
  };

  return (
    <>
      <Form
        className="w-[846px] p-5 bg-white rounded shadow pb-9"
        defaultValues={staff}
        onSubmit={handleSubmit}
      >
        <div className="mb-4 text-xl font-bold uppercase">thông tin cá nhân</div>
        <div className="flex items-center gap-4">
          <Img
            src={staff?.avatar}
            avatar
            className="w-24 border border-gray-100 rounded-full grow-0 shrink-0"
            alt="staff-avatar"
            lazyload={false}
          />
          <div className="flex-1">
            <div className="text-lg font-bold text-accent">{staff?.name}</div>
            <Button
              textPrimary
              text="Đổi avatar"
              className="px-0 font-extrabold"
              unfocusable
              onClick={() => setOpenChangeAvatar(true)}
            />
          </div>
        </div>
        <div className="grid grid-cols-12 mt-8 gap-x-8">
          <Field label="Họ và tên" cols={6} name="name" required {...labelAccentField}>
            <Input value={staff?.name} />
          </Field>
          <Field label="Tên đăng nhập" cols={6} name="username" readOnly {...labelAccentField}>
            <Input value={staff?.username} />
          </Field>
          <Field label="Số điện thoại" cols={6} name="phone" {...labelAccentField}>
            <Input value={staff?.phone} type="tel" />
          </Field>
          <div className="col-span-12 -mb-[2rem]">
            <LabelAccent text="Địa chỉ" />
          </div>
          <AddressGroup
            className="grid grid-cols-12 gap-x-8"
            provinceCols={4}
            provinceLabel=" "
            districtCols={4}
            districtLabel=" "
            wardCols={4}
            wardLabel=" "
            addressCols={12}
            addressLabel=""
            provinceName="fullAddress.provinceId"
            districtName="fullAddress.districtId"
            wardName="fullAddress.wardId"
            addressName="fullAddress.street"
            labelAddressClassName="text-accent text-sm font-extrabold"
          />
          <div className="col-span-6">
            <LabelAccent text="Chi nhánh trực thuộc" />
            <div className="">{staff?.branch.name}</div>
          </div>
          <div className="col-span-6">
            <LabelAccent text="Mã chi nhánh" />
            <div className="">{staff?.branch.code}</div>
          </div>
          <div className="col-span-12 mt-5">
            <LabelAccent text="Quyền" />
            <div className="">{convertScopes(staff?.scopes)}</div>
          </div>
          <div className="flex col-span-12 gap-8 mt-12">
            <Form.Footer
              submitText="Lưu thay đổi"
              cancelText=""
              submitProps={{
                className: "mr-auto h-12  w-44 shadow-lg shadow-green-700/50",
              }}
            />
          </div>
        </div>
      </Form>

      <ChangeAvatarDialog
        userType={staff}
        isOpen={!!openChangeAvatar}
        onClose={() => setOpenChangeAvatar(false)}
      />
    </>
  );
}
