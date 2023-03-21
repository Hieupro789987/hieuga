import Link from "next/link";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { RiLockLine, RiMailLine } from "react-icons/ri";
import { useAuth } from "../../../lib/providers/auth-provider";
import { useToast } from "../../../lib/providers/toast-provider";
import { AuthenticateLayout } from "../../shared/auth/authenticate-layout";
import { Button, Field, Form, Input } from "../../shared/utilities/form";

export function ExpertLoginPage() {
  const toast = useToast();
  //Begin: Old Authentication's Code
  const { expert, loginExpert, redirectToExpert } = useAuth();

  useEffect(() => {
    if (expert) {
      redirectToExpert();
    }
  }, [expert]);

  const handleLogin = async ({ username, password }) => {
    if (!username || !password) return;

    try {
      await loginExpert(username, password);
    } catch (err) {
      console.error(err);
      toast.error(err);
    }
  };
  //End: Old Authentication's Code

  //Comment New Authentication's Code
  // useEffect(() => {
  //   if (expert) {
  //     redirectToLoggedIn();
  //   }
  // }, [expert]);

  // const handleLogin = async ({ username, password }) => {
  //   if (!username || !password) return;
  //   await login(username, password);
  //   router.replace("/expert/profile");
  // };

  return (
    <AuthenticateLayout user="expert" title="Đăng nhập" subTitle="Vui lòng Đăng nhập để tiếp tục">
      <Form
        className="flex flex-col p-5 pt-8 bg-white rounded shadow-xl max-w-screen-xs"
        onSubmit={handleLogin}
      >
        <Field className="mb-1" name="username" required>
          <Input
            className="h-12 w-96"
            placeholder="Email / Tên đăng nhập"
            autoFocus
            prefix={<RiMailLine size={25} className="font-bold" />}
          />
        </Field>

        <Field className="mb-1" name="password" required>
          <Input
            className="h-12 w-96"
            type="password"
            placeholder="Mật khẩu"
            prefix={<RiLockLine size={25} className="font-bold" />}
          />
        </Field>
        <LoginButton />
        <Link href="/expert/forgotPassword">
          <a className="mb-3 text-sm font-bold text-center text-primary hover:underline">
            Quên mật khẩu?
          </a>
        </Link>
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
      text="Đăng nhập Chuyên gia"
      isLoading={isSubmitting}
    />
  );
}
