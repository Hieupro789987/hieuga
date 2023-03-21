import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { AiOutlineLeft, AiOutlineMail } from "react-icons/ai";
import { useToast } from "../../../lib/providers/toast-provider";
import { WriterService } from "../../../lib/repo/writer/writer.repo";
import { AuthenticateLayout } from "../../shared/auth/authenticate-layout";
import { Button, Field, Form, Input } from "../../shared/utilities/form";

export function WriterForgotPasswordPage() {
  const toast = useToast();
  const [isSentEmail, setIsSentEmail] = useState(false);

  const handleSubmit = async ({ email }) => {
    if (!email) return;

    try {
      setIsSentEmail(false);
      const res = await WriterService.resetWriterPasswordByEmailSendLink(email);
      if (res) {
        setIsSentEmail(true);
      }
    } catch (error) {
      console.log(error);
      toast.error(`${error.message}`);
    }
  };

  const title = isSentEmail ? "Gửi email thành công" : "Quên mật khẩu?";
  const subtitle = isSentEmail
    ? " Email đổi mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra hòm thư."
    : "Vui lòng nhập Email để chúng tôi gửi lại mật khẩu cho bạn";

  return (
    <AuthenticateLayout user="writer" title={title} subTitle={subtitle} {...(isSentEmail && {className: "px-5 pt-2"})}>
      <Form
        className="flex flex-col p-6 rounded max-w-screen-xs"
        onSubmit={handleSubmit}
        
      >
        {isSentEmail ? <SentEmailAlertPart /> : <SendEmailPart />}
      </Form>
    </AuthenticateLayout>
  );
}

function LoginButton() {
  const {
    formState: { isSubmitting },
  } = useFormContext();
  return (
    <Button
      submit
      primary
      className="mb-5 shadow-lg h-14 shadow-green-700/50"
      text="Gửi"
      isLoading={isSubmitting}
    />
  );
}

function SendEmailPart() {
  return (
    <>
      <Field className="mb-1" name="email" required>
        <Input
          className="h-12 w-96 "
          placeholder="Vui lòng nhập Email"
          autoFocus
          prefix={<AiOutlineMail size={25} className="font-extrabold" />}
        />
      </Field>
      <LoginButton />
    </>
  );
}

function SentEmailAlertPart() {
  return (
    <>
      <Button
        className="w-full mb-4 shadow-lg h-14 shadow-green-700/50"
        primary
        text="Quay lại trang đăng nhập"
        href="/writer/login"
      />
    </>
  );
}
