import { useEffect, useRef, useState } from "react";
import { RiPhoneLine } from "react-icons/ri";
import { Dialog, DialogProps } from "../../../shared/utilities/dialog";
import { CloseButtonHeaderDialog } from "../../../shared/dialog/close-button-header-dialog";
import { Button, Field, Form, Input } from "../../../shared/utilities/form";
import { TitleDialog } from "../../../shared/dialog/title-dialog";
import { useAuth } from "../../../../lib/providers/auth-provider";
import { useToast } from "../../../../lib/providers/toast-provider";
import { useFormContext } from "react-hook-form";
import { WriterService } from "../../../../lib/repo/writer/writer.repo";

export function WriterChangePhoneDialog({ ...props }: DialogProps) {
  const [mode, setMode] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState("");
  const title = mode === 0 ? "Thay đổi số điện thoại" : "Xác nhận OTP";
  const subtitle =
    mode === 0 ? "Vui lòng nhập đủ thông tin để tiếp tục" : "Vui lòng nhập mã OTP được nhận";
  const captchaRef = useRef(null);
  const toast = useToast();

  const { signInWithPhoneNumber, setWrapper, confirmResult, setWriter, writer } = useAuth();

  useEffect(() => {
    setMode(0);
  }, [props.isOpen]);


  const handleSubmit = async ({ phone, otp }) => {
    try {
      if (phone) {
        console.log(phone);
        setWrapper(captchaRef.current);
        await signInWithPhoneNumber(phone);
        setMode(1);
        setPhoneNumber(phone);
      }
      if (otp) {
        const result = await confirmResult.confirm(otp.toString());
        const idToken = await result.user.getIdToken();
        const res = await WriterService.writerUpdatePhoneNumber(idToken);
        toast.info("Xác nhận mã OTP thành công");
        setWriter({ ...writer, internationalPhone: phoneNumber });
        props.onClose();
        setMode(0);
      }
    } catch (error) {
      if (error.code === "auth/invalid-verification-code") {
        toast.error("Mã OTP không đúng, vui lòng thử lại");
      }
      if (error.code === "auth/invalid-phone-number") {
        toast.error("Số điện thoại không hợp lệ");
      }
      if (error.code == undefined) {
        toast.error("Đã xảy ra lỗi. " + error.message);
      }
    }
  };

  return (
    <>
      <Dialog {...props} width="440px" className="text-accent">
        <Dialog.Body>
          <CloseButtonHeaderDialog onClose={props.onClose} />
          <TitleDialog title={title} subtitle={subtitle} />
          <Form onSubmit={handleSubmit}>{DATA[mode]?.component}</Form>
        </Dialog.Body>
      </Dialog>
      <div id="wrapper" ref={captchaRef}>
        <div id="recaptcha-container"></div>
      </div>
    </>
  );
}

function PhoneEnterForm({ ...props }: ReactProps) {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <>
      <Field name="phone" required>
        <Input
          className="h-12"
          placeholder="Vui lòng nhập số điện thoại..."
          autoFocus
          type="tel"
          prefix={
            <i className="text-xl">
              <RiPhoneLine />
            </i>
          }
        />
      </Field>
      <Button
        text="Tiếp tục"
        className="w-full mt-1 mb-3 shadow-lg h-14 shadow-green-700/50"
        primary
        submit
        isLoading={isSubmitting}
      />
    </>
  );
}

function OTPEnterForm({ ...props }: ReactProps) {
  const [otpDelay, setOTPDelay] = useState(0);

  const { signInWithPhoneNumber } = useAuth();
  let [interval] = useState<any>();
  const {
    formState: { isSubmitting },
    getValues,
    setValue,
    watch,
  } = useFormContext();

  const otp: string = watch("otp");

  useEffect(() => {
    if (otp?.toString()?.length > 6) {
      setValue("otp", otp?.toString()?.slice(0, 6));
    }
  }, [otp]);

  useEffect(() => {
    if (otpDelay > 0) {
      var sub = setTimeout(() => {
        setOTPDelay(otpDelay - 1);
      }, 1000);
    }
    return () => clearTimeout(sub);
  }, [otpDelay]);

  const handleResend = async () => {
    setOTPDelay(250);
    await signInWithPhoneNumber(getValues().phone);
  };

  return (
    <>
      <Field className="mb-1" name="otp" required>
        <Input
          autoFocus
          className="h-12"
          inputClassName="text-center font-bold"
          placeholder="Vui lòng nhập mã OTP..."
        />
      </Field>
      <Button
        text="Xác nhận"
        className="w-full mt-1 mb-3 shadow-lg h-14 shadow-green-700/50"
        primary
        submit
        isLoading={isSubmitting}
      />
      {otpDelay > 0 && (
        <div className="mt-1 mb-2 text-sm text-center">
          Bạn chưa nhận được mã OTP? Gửi lại sau
          <span className="text-primary">{` ${otpDelay}`}</span> giây.
        </div>
      )}
      {otpDelay === 0 && (
        <div
          className="text-sm text-center cursor-pointer text-primary hover:underline"
          onClick={handleResend}
        >
          {` Bấm vào đây để gửi lại.`}
        </div>
      )}
    </>
  );
}

export const DATA = [
  {
    component: <PhoneEnterForm />,
  },
  {
    component: <OTPEnterForm />,
  },
];
