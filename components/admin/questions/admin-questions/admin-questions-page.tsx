import { useRouter } from "next/router";
import { useState } from "react";
import { Question } from "../../../../lib/repo/question/question.repo";
import { QuestionDataTable } from "../../../shared/question/components/question-data-table";
import { QuestionDetailsDialog } from "../../../shared/question/components/question-details-dialog";
import { Card } from "../../../shared/utilities/misc";

export function QuestionsPage() {
  const router = useRouter();
  const [question, setQuestion] = useState<Question>();

  const handleClose = () => router.replace({ pathname: router.pathname, query: {} });

  return (
    <Card>
      <QuestionDataTable isAdmin question={question} setQuestion={setQuestion} />
      <QuestionDetailsDialog isAdmin isOpen={!!router?.query?.id} onClose={handleClose} />
    </Card>
  );
}
