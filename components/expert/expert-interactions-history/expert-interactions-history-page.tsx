import { Disease, DiseaseService } from "../../../lib/repo/disease.repo";
// import { MOCK_OPTION } from "../../index/profile/components/profile-interaction-history";
import { Field, Select } from "../../shared/utilities/form";
import { Card, StatusLabel } from "../../shared/utilities/misc";
import { DataTable } from "../../shared/utilities/table/data-table";
import { useTranslation } from "react-i18next";
import { formatDate } from "../../../lib/helpers/parser";
import { useState } from "react";
import {
  Interaction,
  InteractionService,
} from "../../../lib/repo/global-customer/interaction.repo";

import Link from "next/link";
import { ACTION, isActionCrud } from "../../index/profile/components/profile-interaction-history";

export function ExpertInteractionsHistoryPage({ ...props }) {
  const { t } = useTranslation();
  const [filterInteraction, setFilterInteraction] = useState<any>();

  const filter = (x: string) => {
    const obj = {};
    if (x === "ALL") {
      obj["action"] = {};
      obj["action"] = undefined;
    } else {
      if (x === "LIKED_COMMENT" || x === "LIKED_QUESTION") {
        obj["action"] = {};
        obj["action"] = "LIKED";
        obj["targetType"] = x === "LIKED_COMMENT" ? "QuestionComment" : "Question";
      } else {
        obj["action"] = {};
        obj["action"] = x;
      }
    }
    setFilterInteraction(obj);
  };
  return (
    <Card>
      <DataTable
        crudService={InteractionService}
        filter={{ ...filterInteraction }}
        order={{ createdAt: -1 }}
      >
        <DataTable.Header>
          <DataTable.Title />
          <DataTable.Buttons>
            <DataTable.Button textPrimary light isRefreshButton refreshAfterTask />
            <DataTable.Filter>
              <Field noError>
                <Select
                  placeholder="Lọc loại tương tác"
                  native
                  autosize
                  options={INTERACTION_TYPE}
                  onChange={(val) => filter(val)}
                />
              </Field>
            </DataTable.Filter>
          </DataTable.Buttons>
        </DataTable.Header>

        <DataTable.Table className="mt-4 bg-white" disableDbClick>
          <DataTable.Column
            label={t("Hoạt động")}
            render={(interaction) => (
              <DataTable.CellText
                className=""
                value={
                  <Link href={`/expert/questions?id=${interaction?.question?.id}`}>
                    <a className="cursor-pointer group">
                      <div className="max-w-5xl text-sm lowercase lg:flex lg:text-base group-hover:underline group-hover:text-primary">
                        <span className="min-w-fit lg:mr-1">Bạn đã </span>
                        <strong className="min-w-fit">
                          {" "}
                          {ACTION[interaction.action](interaction.targetType)?.label}{" "}
                        </strong>
                        {interaction.action !== "LIKED" ? (
                          <span className="mx-1 text-ellipsis-1">
                            {" "}
                            {isActionCrud(interaction.action) &&
                            interaction.targetType === "Question"
                              ? interaction.question?.title
                              : interaction.comment?.content}
                          </span>
                        ) : (
                          <span className="lg:mx-1">của</span>
                        )}
                        {!isActionCrud(interaction.action) && (
                          <span className="min-w-fit" style={{ display: "inline" }}>
                            {" "}
                            {interaction.action !== "LIKED" && "câu hỏi của"}{" "}
                            <strong>
                              @
                              {interaction.targetType === "Question"
                                ? interaction.question?.globalCustomerId
                                  ? interaction.question?.globalCustomer?.name
                                  : interaction.question?.expert?.name
                                : interaction.comment?.globalCustomerId
                                ? interaction.comment?.globalCustomer?.name
                                : interaction.comment?.expert?.name}
                            </strong>
                          </span>
                        )}
                      </div>
                    </a>
                  </Link>
                }
              />
            )}
          />
          <DataTable.Column
            label="Loại tương tác"
            render={(interaction) => (
              <StatusLabel
                maxContent
                type="light"
                options={INTERACTION_TYPE}
                value={
                  interaction.action === "LIKED"
                    ? interaction?.targetType === "Question"
                      ? "LIKED_QUESTION"
                      : "LIKED_COMMENT"
                    : interaction.action
                }
                className="px-8 py-1"
              />
            )}
          />
          <DataTable.Column
            label="Thời gian"
            render={(interaction) => (
              <DataTable.CellText
                className="break-all"
                value={formatDate(interaction.time, "HH:mm dd/MM/yyyy")}
              />
            )}
          />
        </DataTable.Table>
        <DataTable.Pagination />
      </DataTable>
    </Card>
  );
}

export const EXPERT_INTERACTIONS_STATUS_LIST: Option[] = [
  { value: "COMMENT", label: "Bình luân", color: "info" },
  { value: "LIKE_QUESTION", label: "Thích câu hỏi", color: "pink" },
  { value: "LIKE_COMMENT", label: "Thích bình luận", color: "orange" },
  { value: "CREATE", label: "Tạo câu hỏi", color: "purple" },
  { value: "DELETE", label: "Xóa câu hỏi", color: "slate" },
  { value: "EDIT", label: "Chỉnh sửa câu hỏi", color: "primary" },
];

export const INTERACTION_TYPE = [
  { value: "ALL", label: "Tất cả" },
  { value: "CREATED", label: "Tạo câu hỏi", color: "blue" },
  { value: "UPDATED", label: "Chỉnh sửa câu hỏi", color: "purple" },

  {
    value: "LIKED_COMMENT",
    label: "Thích bình luận",
    color: "orange",
  },
  {
    value: "LIKED_QUESTION",
    label: "Thích câu hỏi",
    color: "orange",
  },
  { value: "COMMENTED", label: "Bình luận", color: "green" },
  { value: "DELETED", label: "Xóa câu hỏi", color: "danger" },
];
