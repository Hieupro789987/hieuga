import { useState } from "react";
import { useToast } from "../../../lib/providers/toast-provider";

import {
  QuestionTopic,
  QuestionTopicService,
} from "../../../lib/repo/question/question-topic.repo";
import { Field, ImageInput, Input } from "../../shared/utilities/form";
import { List } from "../../shared/utilities/list";
import { Card } from "../../shared/utilities/misc";
import { DataTable, useDataTable } from "../../shared/utilities/table/data-table";

export function QuestionsTopicPage() {
  return (
    <Card>
      <DataTable<QuestionTopic> crudService={QuestionTopicService} order={{ createdAt: -1 }}>
        <DataTable.Header>
          <DataTable.Consumer>
            {({ pagination: { total } }) => <DataTable.Title subtitle={`Tổng ${total} chủ đề`} />}
          </DataTable.Consumer>
          <DataTable.Buttons>
            <DataTable.Button
              textPrimary
              outline
              isRefreshButton
              refreshAfterTask
              className="bg-white"
            />
            <DataTable.Button primary isCreateButton />
          </DataTable.Buttons>
        </DataTable.Header>
        <DataTable.Search className="mt-8 mb-5 min-w-xs" />
        <DataTable.Table className="mt-4 bg-white">
          <DataTable.Column
            label={"Chủ đề"}
            render={(item: QuestionTopic) => (
              <DataTable.CellText image={item.image} imageClassName="w-8" value={item.name} />
            )}
          />
          <DataTable.Column
            label={"Slug"}
            render={(item: QuestionTopic) => <DataTable.CellText value={item.slug} />}
          />
          <DataTable.Column
            right
            render={(item: QuestionTopic) => (
              <>
                <DataTable.CellButton value={item} isUpdateButton tooltip="Chỉnh sửa" />
                <DataTable.CellButton value={item} isDeleteButton tooltip="Xóa" />
              </>
            )}
          />
        </DataTable.Table>
        <DataTable.Pagination />
        <DataTable.Consumer>
          {({ formItem, loadAll }) => (
            <DataTable.Form grid width={500}>
              <Field label="Tên" name="name" required>
                <Input autoFocus />
              </Field>
              <Field name="slug" label="Slug" validation={{ slug: true }}>
                <Input placeholder="Tự tạo nếu để trống." />
              </Field>
              <Field name="image" label="Hình ảnh">
                <ImageInput />
              </Field>
            </DataTable.Form>
          )}
        </DataTable.Consumer>
      </DataTable>
    </Card>
  );
}
