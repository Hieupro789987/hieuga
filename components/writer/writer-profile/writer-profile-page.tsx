import { useState } from "react";
import { uploadImage } from "../../../lib/helpers/image";
import { useScreen } from "../../../lib/hooks/useScreen";
import { useAlert } from "../../../lib/providers/alert-provider";
import { useAuth } from "../../../lib/providers/auth-provider";
import { useToast } from "../../../lib/providers/toast-provider";
import { WriterGroupService } from "../../../lib/repo/writer/writer-group.repo";
import { Writer, WriterService } from "../../../lib/repo/writer/writer.repo";
import { ChangeAvatarDialog } from "../../shared/auth/change-avatar-dialog";
import { ChangePasswordDialog } from "../../shared/auth/change-password-dialog";
import { LabelAccent, labelAccentField } from "../../shared/common/label-accent";
import { CloseButtonHeaderDialog } from "../../shared/dialog/close-button-header-dialog";
import { TitleDialog } from "../../shared/dialog/title-dialog";
import { Button, Field, Form, Input, Select } from "../../shared/utilities/form";
import { AddressGroup } from "../../shared/utilities/form/address-group";
import { Img, Spinner } from "../../shared/utilities/misc";
import { WriterChangePhoneDialog } from "./components/writer-change-phone-dialog";

export function WriterProfilePage() {
  const [openChangePasswordDialog, setOpenChangePasswordDialog] = useState(false);
  const toast = useToast();
  const { writer, setWriter } = useAuth();
  const screenLg = useScreen("lg");
  const [openChangeAvatar, setOpenChangeAvatar] = useState(false);
  const [openChangePhoneDialog, setOpenChangePhoneDialog] = useState(false);

  if (!writer) return <Spinner />;

  return (
    <>
      <Form
        className="w-[846px] p-5 bg-white rounded shadow pb-9"
        defaultValues={writer}
        onSubmit={async (data) => {
          try {
            const res = await WriterService.updateWriterSelf(writer.id, data);
            setWriter(res);
            toast.success("Cập nhật thông tin thành công");
          } catch (error) {
            console.log(error);
            toast.error("Cập nhật thông tin không thành công", error.message);
          }
        }}
      >
        <div className="flex items-center gap-4">
          <Img
            src={writer?.avatar}
            avatar
            className="w-24 border border-gray-100 rounded-full grow-0 shrink-0"
            alt="writer-avatar"
            lazyload={false}
          />

          <div className="flex-1">
            <div className="text-lg font-bold text-accent">{writer?.name}</div>
            <div>{writer?.email}</div>
            <Button
              textPrimary
              text="Đổi avatar"
              className="px-0 font-extrabold"
              onClick={() => setOpenChangeAvatar(true)}
            />
          </div>
        </div>
        <div className="grid grid-cols-12 mt-10 rounded gap-x-8 gap-y-2">
          <Field label="Họ và tên" cols={6} name="name" required {...labelAccentField}>
            <Input placeholder="Nhập họ tên..." />
          </Field>
          <div className={` ${screenLg ? "col-span-6" : "col-span-12"}  mb-5`}>
            <LabelAccent text="Số điện thoại" />
            <div className="flex items-center w-full mt-1">
              <span
                className={`text-sm font-medium lg:text-base ${
                  writer?.internationalPhone ? "text-accent" : "text-gray-500"
                }`}
              >
                {writer?.internationalPhone ? writer?.internationalPhone : "chưa có"}
              </span>
              <Button
                text={writer?.internationalPhone ? "Thay đổi" : "Cập nhật"}
                textPrimary
                small={!screenLg}
                className="p-0 ml-5 underline"
                onClick={() => setOpenChangePhoneDialog(true)}
                unfocusable
              />
            </div>
          </div>
          <Field label="Email đăng nhập" cols={6} name="email" readOnly {...labelAccentField}>
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
          <AddressGroup
            required
            className="grid grid-cols-12 gap-x-8"
            provinceCols={4}
            provinceLabel=""
            provinceName="address.provinceId"
            districtCols={4}
            districtLabel=""
            districtName="address.districtId"
            wardCols={4}
            wardLabel=""
            wardName="address.wardId"
            addressCols={12}
            addressName="address.street"
            addressLabel=""
            notRequiredWard
            labelClassName="font-extrabold text-accent"
            labelAddressClassName="font-extrabold text-accent"
          />
          <div className="col-span-6 mb-5">
            <LabelAccent text="Đơn vị đăng tin" />
            <div className="flex items-center w-full mt-1">
              <span className="mt-2 text-sm font-medium lg:text-base text-accent">
                {writer?.group?.name}
              </span>
            </div>
          </div>

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
      </Form>

      <ChangeWriterPassword
        isOpen={openChangePasswordDialog}
        onClose={() => setOpenChangePasswordDialog(false)}
      />

      <WriterChangePhoneDialog
        isOpen={openChangePhoneDialog}
        onClose={() => setOpenChangePhoneDialog(false)}
      />

      <ChangeAvatarDialog
        userType={writer}
        isOpen={!!openChangeAvatar}
        onClose={() => setOpenChangeAvatar(false)}
      />
    </>
  );
}

export function ChangeWriterPassword({ ...props }) {
  const toast = useToast();
  const alert = useAlert();
  const { logoutWriter } = useAuth();

  const handleSubmit = async (data) => {
    try {
      const { oldPassword, newPassword } = data;
      const res = await WriterService.updateWriterPassword(newPassword, oldPassword);
      await alert.success("Đổi mật khẩu thành công!", "Vui lòng đăng nhập lại với mật khẩu mới");
      logoutWriter();
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
