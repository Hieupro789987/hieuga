import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { RiCloseLine } from "react-icons/ri";
import { useAuth } from "../../../../lib/providers/auth-provider";
import { useToast } from "../../../../lib/providers/toast-provider";
import { ExpertService } from "../../../../lib/repo/expert/expert.repo";
import { Question, QuestionService } from "../../../../lib/repo/question/question.repo";
import { DialogProps } from "../../../shared/utilities/dialog";
import { Button, Field, Form, Select, Textarea } from "../../../shared/utilities/form";
import { useDataTable } from "../../../shared/utilities/table/data-table";

export function ExpertTransferDialog({ question, ...props }: { question: Question } & DialogProps) {
  const toast = useToast();
  const { loadAll } = useDataTable();

  const handleSubmit = async (data) => {
    try {
      const { reason, reasonOther } = data;

      console.log(!!reasonOther ? reasonOther : reason);
      await QuestionService.transferQuestion(
        question?.id,
        data.assignExpertId,
        !!reasonOther ? reasonOther : reason
      );
      await loadAll(true);
      props.onClose();
      toast.success("Chuyển chuyên gia thành công");
    } catch (error) {
      console.log(error);
      toast.error("Chuyền chuyên gia thất bại", error.message);
    }
  };

  return (
    <Form width="520px" dialog onSubmit={handleSubmit} {...props}>
      <div className="w-full my-3 flex-cols">
        <div className="flex items-center">
          <div className="flex-1 text-lg font-bold text-center uppercase">chuyển chuyên gia</div>
          <Button
            iconClassName="text-2xl ml-auto text-gray-500 hover:text-danger"
            small
            className="px-2 -mt-4 -mr-4"
            icon={<RiCloseLine />}
            onClick={props.onClose}
          />
        </div>
        <div className="my-2 text-center">
          Câu hỏi
          {question?.code ? (
            <span className="font-bold text-primary">{` ${question?.code} `}</span>
          ) : (
            ""
          )}
          sẽ được chuyển đến chuyên gia khác.
        </div>
      </div>
      <FormBody />
    </Form>
  );
}

function FormBody() {
  const [other, setOther] = useState();
  const { expert } = useAuth();
  const { unregister } = useFormContext();

  useEffect(() => {
    return () => {
      unregister("assignExpertId");
      unregister("reason");
      unregister("reasonOther");
    };
  }, []);
  useEffect(() => {
    if (other != "other") {
      unregister("reasonOther");
    }
  }, [other]);

  return (
    <>
      <Field label="Chuyên gia" name="assignExpertId" required>
        <Select
          placeholder="Vui lòng chọn chuyên gia"
          clearable
          optionsPromise={() =>
            ExpertService.getAllOptionsPromise({
              query: { filter: { _id: { $ne: expert?.id } } },
            })
          }
        />
      </Field>
      <Field label="Lý do" name="reason" required>
        <Select
          placeholder="Vui lòng chọn lý do"
          clearable
          options={REASON_OPTIONS}
          onChange={(val) => setOther(val)}
        />
      </Field>
      {other === "other" && (
        <Field label="Nội dung lý do" name="reasonOther" required labelNoAsterisk>
          <Textarea placeholder="Nhập nội dung lý do..." />
        </Field>
      )}
      <Form.Footer
        submitText="Chuyển chuyên gia"
        submitProps={{ large: true }}
        cancelProps={{ large: true, hoverDanger: true }}
      />
    </>
  );
}

const REASON_OPTIONS: Option[] = [
  {
    value: "Vượt chuyên môn",
    label: "Vượt chuyên môn",
  },
  {
    value: "Đi công tác",
    label: "Đi công tác",
  },
  {
    value: "Ngoài chuyên môn",
    label: "Ngoài chuyên môn",
  },
  {
    value: "other",
    label: "Khác",
  },
];
