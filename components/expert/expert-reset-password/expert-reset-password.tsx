import { useRouter } from "next/router";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { AiOutlineLeft, AiOutlineLock } from "react-icons/ai";
import { useToast } from "../../../lib/providers/toast-provider";
import { ExpertService } from "../../../lib/repo/expert/expert.repo";
import { WriterService } from "../../../lib/repo/writer/writer.repo";
import { AuthenticateLayout } from "../../shared/auth/authenticate-layout";
import { Button, Field, Form, Input } from "../../shared/utilities/form";

export function ExpertResetPasswordPage() {
  const router = useRouter();
  const toast = useToast();
  const { code } = router.query;

  const checkUrl = useMemo(async () => {
    if (!code) return false;

    try {
      const res = await ExpertService.resetExpertPasswordByEmailCheckLink(code as string);
      if (res) return true;
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }, [router.asPath]);

  const handleSubmit = async ({ password }) => {
    if (!password || !checkUrl) return;

    try {
      console.log("code", code);

      const res = await ExpertService.resetExpertPasswordByEmail(code as string, password);
      console.log("Sdsadas", res);
      if (res) {
        router.push("/expert/login");
        toast.success("Reset mật khẩu thành công.");
      }
    } catch (error) {
      console.log(error);

      if (error.message === "Reset passwordLink invalid or expired") {
        toast.error("Đường link hết hạn hoặc không hợp lệ.");
        return;
      }

      toast.error(`${error.message}`);
    }
  };
  const title = checkUrl ? "Đặt lại mật khẩu" : "Đường link không hợp lệ";
  const subtitle = checkUrl
    ? "Vui lòng nhập mật khẩu để tiếp tục"
    : "Đường link không chính xác. Vui lòng kiểm tra lại.";

  return (
    <AuthenticateLayout user="writer" title={title} subTitle={subtitle}>
      <Form
        className="flex flex-col p-6 bg-white rounded shadow-xl max-w-screen-xs"
        onSubmit={handleSubmit}
      >
        {checkUrl ? <ResetPasswordPart /> : <WrongLinkPart />}
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
      className="mt-1 mb-3 bg-green-700 shadow-lg h-14 "
      text="Xác nhận"
      isLoading={isSubmitting}
    />
  );
}

function ResetPasswordPart() {
  return (
    <>
      <Field className="mb-1 group" name="password" required validation={{ password: true }}>
        <Input
          className="h-12 w-96"
          type="password"
          placeholder="Nhập mật khẩu mới"
          autoFocus
          prefix={<AiOutlineLock size={25} className="font-extrabold" />}
        />
      </Field>
      <Field
        className="mb-1 "
        name="confirmPassword"
        required
        validation={{
          password: true,
          confirmPassword: (confirmPassword, data) =>
            confirmPassword !== data.password ? "Mật khẩu xác nhận không đúng" : "",
        }}
      >
        <Input
          className="h-12 w-96"
          type="password"
          placeholder="Nhập lại mật khẩu mới"
          prefix={<AiOutlineLock size={25} className="font-extrabold" />}
        />
      </Field>
      <LoginButton />
    </>
  );
}

function WrongLinkPart() {
  return (
    <>
      <Button
        className="w-full mb-4 h-14"
        primary
        text="Quay lại trang đăng nhập"
        href="/writer/login"
      />
    </>
  );
}
