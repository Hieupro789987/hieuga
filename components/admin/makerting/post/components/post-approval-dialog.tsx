import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { RiCloseLine, RiNewspaperLine, RiTimeLine, RiUserLine } from "react-icons/ri";
import { formatDate } from "../../../../../lib/helpers/parser";
import { useToast } from "../../../../../lib/providers/toast-provider";
import { Post, PostService } from "../../../../../lib/repo/post.repo";
import {
  Button,
  Field,
  Form,
  FormProps,
  Label,
  Radio,
  Textarea,
} from "../../../../shared/utilities/form";
import { Scrollbar, Spinner } from "../../../../shared/utilities/misc";

interface PropsType extends FormProps {
  post: Post;
  reload: Function;
  readOnly?: boolean;
}

export function PostApprovalDialog({ post, reload, readOnly, ...props }: PropsType) {
  const toast = useToast();

  const handleSubmit = async ({ status, reason }) => {
    try {
      reason = reason.trim();

      if (status === "APPROVED") {
        await PostService.updatePostApproveStatus(post.id, status);
      }

      if (status === "REJECTED") {
        await PostService.updatePostApproveStatus(post.id, status, reason);
      }

      toast.success("Xét duyệt thành công.");
      reload(true);
      props.onClose();
    } catch (error) {
      console.debug(error);
      toast.error(`Xét duyệt thất bại`);
    }
  };

  return (
    <Form
      dialog
      width={800}
      defaultValues={{}}
      onSubmit={handleSubmit}
      extraBodyClass={"px-0"}
      {...props}
    >
      {!post ? (
        <Spinner />
      ) : (
        <>
          <div className="px-5 mb-2 flex-between-center">
            <div className="text-xl font-bold uppercase">
              {readOnly ? "Chi tiết" : "xét duyệt"} bài đăng
            </div>
            <Button
              tooltip="Đóng"
              icon={<RiCloseLine />}
              iconClassName="text-2xl text-gray-400 hover:text-danger"
              className="px-2 -mr-2"
              onClick={props.onClose}
            />
          </div>
          <div className="px-5 pb-3">
            <div className="flex gap-8">
              <DataRow
                icon={<RiNewspaperLine />}
                value={post.topic?.name}
                iconClassName="pb-1 text-lg"
              />
              <DataRow
                icon={<RiTimeLine />}
                value={formatDate(post.createdAt, "dd-MM-yyyy HH:mm")}
                iconClassName="pb-1 text-xl"
              />
              <DataRow
                icon={<RiUserLine />}
                value={post.owner?.name}
                extraValue={post.writerGroup?.name}
                iconClassName="pb-1 text-lg"
              />
            </div>
            <div className="mt-3 text-3xl font-bold">{post.title}</div>
          </div>
          <div className="px-5 pb-4">
            {readOnly ? (
              <div
                className="ck-content min-h-lg"
                dangerouslySetInnerHTML={{
                  __html: post.content,
                }}
              />
            ) : (
              <Scrollbar innerClassName="" height={"52vh"}>
                <div
                  className="ck-content"
                  dangerouslySetInnerHTML={{
                    __html: post.content,
                  }}
                />
              </Scrollbar>
            )}
          </div>
          {!readOnly && (
            <div className="px-5 mx-auto mt-4">
              <PostApprovalDialogRadioGroup />
            </div>
          )}
        </>
      )}
    </Form>
  );
}

export function DataRow({
  icon,
  label = "",
  value = "",
  extraValue = "",
  iconClassName = "",
  className = "",
  ...props
}: ReactProps & {
  icon?: JSX.Element;
  label?: string;
  value?: string;
  extraValue?: string;
  iconClassName?: string;
}) {
  return (
    <div className={`flex text-sm items-start mt-1 text-gray-700 gap-x-2 ${className}`}>
      <i className={`${iconClassName}`}>{icon}</i>
      <span className="">
        <strong>{`${label}`}</strong>
        {value}
        {extraValue && (
          <>
            <span className="text-gray-400"> | </span>
            <span> {extraValue}</span>
          </>
        )}
      </span>
    </div>
  );
}

function PostApprovalDialogRadioGroup() {
  const {
    watch,
    formState: { isSubmitting, errors },
    setError,
    clearErrors,
  } = useFormContext();
  const status = watch("status");
  const reason = watch("reason");

  useEffect(() => {
    if (!reason) return;

    if (status === "APPROVED") {
      clearErrors(["reason"]);
      return;
    }

    const reasonTrim = reason.trim();
    if (reasonTrim.length === 0 && status === "REJECTED")
      setError("reason", { type: "string", message: "Không được để trống nội dung." });
  }, [reason, status]);

  return (
    <>
      <div className="gap-12 flex-center">
        <Label text="Trạng thái bài đăng" className="w-1/4 text-lg" />
        <Field name="status" required noError>
          <Radio
            selectFirst
            options={[
              { value: "APPROVED", label: "Duyệt" },
              { value: "REJECTED", label: "Chưa duyệt" },
            ]}
            iconClassName={"!text-xl !pt-0.5"}
            className="!gap-x-5"
          />
        </Field>
      </div>
      <Field
        name="reason"
        label="Lý do"
        className={`${status !== "REJECTED" && "hidden"}`}
        required={status === "REJECTED"}
      >
        <Textarea placeholder="Vui lòng nhập lý do..." />
      </Field>
      <div className={`flex justify-center mb-3 ${status !== "REJECTED" && "mt-3"}`}>
        <Button
          text={`${status === "REJECTED" ? "Gửi" : "Chấp nhận"}`}
          className="w-52 h-14"
          submit
          isLoading={isSubmitting}
          disabled={Object.keys(errors)?.length > 0 && status === "REJECTED"}
          // {...(status === "REJECTED" ? { danger: true } : { primary: true })}
          primary
        />
      </div>
    </>
  );
}
