import { useState } from "react";
import { useScreen } from "../../../lib/hooks/useScreen";
import { useAlert } from "../../../lib/providers/alert-provider";
import { useAuth } from "../../../lib/providers/auth-provider";
import { useToast } from "../../../lib/providers/toast-provider";
import { DiseaseService } from "../../../lib/repo/disease.repo";
import { ExpertService } from "../../../lib/repo/expert/expert.repo";

import { PlantService } from "../../../lib/repo/plant.repo";
import { ChangeAvatarDialog } from "../../shared/auth/change-avatar-dialog";
import { LabelAccent, labelAccentField } from "../../shared/common/label-accent";
import { CloseButtonHeaderDialog } from "../../shared/dialog/close-button-header-dialog";
import { TitleDialog } from "../../shared/dialog/title-dialog";
import { Button, Field, Form, Input, Select } from "../../shared/utilities/form";
import { AddressGroup } from "../../shared/utilities/form/address-group";
import { Img, Spinner } from "../../shared/utilities/misc";
import { ExpertChangePhoneDialog } from "./components/expert-change-phone-dialog";

export function ExpertProfilePage() {
  const toast = useToast();
  const screenLg = useScreen();
  const [openChangePasswordDialog, setOpenChangePasswordDialog] = useState(false);
  const [openChangePhoneDialog, setOpenChangePhoneDialog] = useState(false);
  const { expert, setExpert } = useAuth();
  const [openChangeAvatar, setOpenChangeAvatar] = useState(false);

  if (!expert) return <Spinner />;

  return (
    <>
      <Form
        className="p-8 bg-white rounded shadow pb-9 max-w-[846px]"
        defaultValues={expert}
        onSubmit={async (data) => {
          try {
            const res = await ExpertService.updateExpertSelf(data);
            setExpert(res);
            toast.success("Cập nhật thông tin thành công");
          } catch (error) {
            console.log(error);
            toast.error("Cập nhật thông tin không thành công", error.message);
          }
        }}
      >
        <div className="flex items-center gap-4">
          <Img
            src={expert?.avatar}
            avatar
            className="w-24 border border-gray-100 rounded-full grow-0 shrink-0"
            alt="expert-avatar"
            lazyload={false}
          />
          <div className="flex-1">
            <div className="text-lg font-bold text-accent">{expert?.name}</div>
            <div>{expert?.email}</div>
            <Button
              textPrimary
              text="Đổi avatar"
              className="px-0 font-extrabold"
              unfocusable
              onClick={() => setOpenChangeAvatar(true)}
            />
          </div>
        </div>
        <div className="mt-10">
          <div className="mb-4 text-xl font-bold uppercase">thông tin cá nhân</div>
          <div className="grid grid-cols-12 gap-x-8">
            <Field label="Họ và tên" cols={6} name="name" required {...labelAccentField}>
              <Input placeholder="Nhập họ tên..." value={expert?.name} />
            </Field>
            <div className="col-span-6 mb-5">
              <LabelAccent text="Số điện thoại" />
              <div className="flex items-center w-full mt-1">
                <span
                  className={`text-sm font-medium lg:text-base ${
                    expert?.internationalPhone ? "text-accent" : "text-gray-500"
                  }`}
                >
                  {!!expert?.internationalPhone ? expert?.internationalPhone : "Chưa có"}
                </span>
                <Button
                  text={!!expert?.internationalPhone ? "Thay đổi" : "Cập nhật"}
                  textPrimary
                  small={!screenLg}
                  className="p-0 ml-5 underline"
                  unfocusable
                  onClick={() => setOpenChangePhoneDialog(true)}
                />
              </div>
            </div>
            <Field label="Email đăng nhập" cols={6} name="email" {...labelAccentField} readOnly>
              <Input placeholder="Nhập email đăng nhập..." />
            </Field>

            <div className="col-span-6 mb-5">
              <LabelAccent text="Mật khẩu" />
              <div className="flex items-center w-full mt-1">
                <span className="text-sm font-medium lg:text-base text-accent">******</span>
                <Button
                  text="Thay đổi"
                  textPrimary
                  small={!screenLg}
                  className="p-0 ml-5 underline"
                  unfocusable
                  onClick={() => setOpenChangePasswordDialog(true)}
                />
              </div>
            </div>

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
              provinceName="address.provinceId"
              districtName="address.districtId"
              wardName="address.wardId"
              addressName="address.street"
              labelAddressClassName="text-accent text-sm font-extrabold"
            />
            <div className="col-span-12 mb-4 text-xl font-bold uppercase text-accent">
              thông tin chuyên môn
            </div>
            <div className="col-span-6">
              <LabelAccent text="Đối tác chuyên gia" />
              <div className="flex items-center gap-2 mt-4">
                <div className="font-medium">{expert?.expertGroup?.name}</div>
              </div>
            </div>
            <Field label="Chuyên môn" cols={6} name="specializes" {...labelAccentField}>
              <Input placeholder="Vui lòng nhập nội dung" />
            </Field>
            <Field
              label="Loại cây chuyên môn"
              cols={6}
              name="specializesInPlantIds"
              {...labelAccentField}
            >
              <Select
                clearable
                optionsPromise={() => PlantService.getAllOptionsPromise()}
                placeholder="Chọn loại cây chuyên môn"
                multi
              />
            </Field>
            <Field
              label="Loại bệnh chuyên môn"
              cols={6}
              name="specializesInDiseaseIds"
              {...labelAccentField}
            >
              <Select
                clearable
                optionsPromise={() => DiseaseService.getAllOptionsPromise()}
                placeholder="Chọn loại bệnh chuyên môn"
                multi
              />
            </Field>
            <div className="flex col-span-12 gap-8">
              <Form.Footer
                submitText="Lưu thay đổi"
                cancelText=""
                submitProps={{
                  className: "mr-auto h-12  w-44 shadow-lg shadow-green-700/50",
                }}
              />
            </div>
          </div>
        </div>
      </Form>

      <ChangeExpertPassword
        isOpen={openChangePasswordDialog}
        onClose={() => setOpenChangePasswordDialog(false)}
      />

      <ExpertChangePhoneDialog
        isOpen={openChangePhoneDialog}
        onClose={() => setOpenChangePhoneDialog(false)}
      />

      <ChangeAvatarDialog
        userType={expert}
        isOpen={!!openChangeAvatar}
        onClose={() => setOpenChangeAvatar(false)}
      />
    </>
  );
}

export function ChangeExpertPassword({ ...props }) {
  const toast = useToast();
  const alert = useAlert();
  const { logoutExpert } = useAuth();

  const handleSubmit = async (data) => {
    try {
      const { oldPassword, newPassword } = data;
      const res = await ExpertService.updateExpertPassword(newPassword, oldPassword);
      await alert.success("Đổi mật khẩu thành công!", "Vui lòng đăng nhập lại với mật khẩu mới");
      await logoutExpert();
    } catch (err) {
      console.log(err);
      toast.error(err.message);
    }
  };

  return (
    <Form {...props} width="350px" dialog onSubmit={handleSubmit} className="text-accent">
      <CloseButtonHeaderDialog onClose={props.onClose} />
      <TitleDialog title="Thay đổi mật khẩu" subtitle="Vui lòng nhập đủ thông tin để tiếp tục" />
      <Field label="Mật khẩu cũ" name="oldPassword" required {...labelAccentField}>
        <Input type="password" placeholder="Vui lòng nhập mật khẩu cũ..." autoFocus />
      </Field>
      <Field
        label="Mật khẩu mới"
        name="newPassword"
        validation={{
          password: true,
        }}
        required
        {...labelAccentField}
      >
        <Input type="password" placeholder="Vui lòng nhập mật khẩu mới..." />
      </Field>
      <Form.Footer submitText="Đổi mật khẩu" submitProps={{ large: true }} />
    </Form>
  );
}
