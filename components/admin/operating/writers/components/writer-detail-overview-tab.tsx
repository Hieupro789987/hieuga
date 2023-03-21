import { useRouter } from "next/router";
import { useToast } from "../../../../../lib/providers/toast-provider";
import { WriterGroupService } from "../../../../../lib/repo/writer/writer-group.repo";
import { WriterService } from "../../../../../lib/repo/writer/writer.repo";
import {
  Field,
  Form,
  ImageInput,
  Input,
  Select,
  Textarea,
} from "../../../../shared/utilities/form";
import { useWriterDetailContext } from "../providers/writer-detail-provider";

export interface WriterDetailOverviewTabProps extends ReactProps {}

export function WriterDetailOverviewTab({ ...props }: WriterDetailOverviewTabProps) {
  const toast = useToast();
  const { writer, setWriter } = useWriterDetailContext();
  const router = useRouter();

  const handleSubmit = async (data) => {
    try {
      const res = await WriterService.update({
        id: writer.id,
        data: {
          ...data,
          regionCode: "VN",
        },
        toast,
      });
      setWriter(res);
      router.replace({ pathname: router.pathname, query: {} });
    } catch (error) {
      console.debug(error);
    }
  };

  return (
    <Form
      grid
      defaultValues={{ ...writer, phone: writer.internationalPhone }}
      onSubmit={handleSubmit}
    >
      <Field name="regionCode" cols={6} className="hidden">
        <Input defaultValue="VN" />
      </Field>
      <Field label="Email" name="email" cols={6} readOnly>
        <Input autoFocus placeholder="Nhập email..." />
      </Field>
      <Field label="Họ và tên" name="name" cols={6}>
        <Input placeholder="Nhập họ và tên..." />
      </Field>
      <Field label="Số điện thoại" name="phone" validation={{ phone: true }} cols={6}>
        <Input placeholder="Nhập số điện thoại..." />
      </Field>
      <Field label="Đơn vị" name="groupId" cols={6}>
        <Select
          placeholder="Chọn đơn vị..."
          clearable
          optionsPromise={() =>
            WriterGroupService.getAllOptionsPromise({
              query: { order: { priority: -1 } },
            })
          }
        />
      </Field>
      <Field label="Ảnh đại diện" name="avatar" cols={12}>
        <ImageInput placeholder="Nhập link ảnh đại diện..." />
      </Field>
      <Field label="Địa chỉ" name="address" cols={12}>
        <Input placeholder="Nhập địa chỉ..." />
      </Field>
      <Form.Footer cancelText=" " />
    </Form>
  );
}
