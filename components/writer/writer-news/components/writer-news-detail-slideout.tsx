import { isEmpty } from "lodash";
import { useRouter } from "next/router";
import { useFormContext } from "react-hook-form";
import { useAuth } from "../../../../lib/providers/auth-provider";
import { useToast } from "../../../../lib/providers/toast-provider";
import { AreaService } from "../../../../lib/repo/area.repo";
import { PostTagService } from "../../../../lib/repo/post-tag.repo";
import { PostService } from "../../../../lib/repo/post.repo";
import { Topic, TopicService } from "../../../../lib/repo/topic.repo";
import { PostDateField } from "../../../admin/makerting/post/components/post-slideout";
import { Slideout, SlideoutProps } from "../../../shared/utilities/dialog/slideout";
import {
  Button,
  Editor,
  Field,
  Form,
  ImageInput,
  Input,
  Select,
  Textarea,
} from "../../../shared/utilities/form";
import { Spinner } from "../../../shared/utilities/misc";
import {
  useWriterPostDetailContext,
  WriterPostDetailProvider,
} from "../providers/writer-news-detail-provider";

interface Props extends SlideoutProps {
  postId: string;
  selectedTopic: Topic;
}
export function WriterPostSlideout({ postId, selectedTopic, ...props }: Props) {
  const router = useRouter();

  const onClose = () => {
    router.replace({ pathname: location.pathname, query: {} });
  };

  return (
    <WriterPostDetailProvider id={postId}>
      <Slideout
        width="86vw"
        maxWidth={"1200px"}
        isOpen={!!postId || !!router.query.create}
        onClose={onClose}
      >
        <WriterPostBody selectedTopic={selectedTopic} onClose={onClose} />
      </Slideout>
    </WriterPostDetailProvider>
  );
}

function WriterPostBody({
  onClose,
  selectedTopic,
  ...props
}: ReactProps & { selectedTopic: Topic; onClose: () => void }) {
  const { writer } = useAuth();
  const { post } = useWriterPostDetailContext();

  if (!post) return <Spinner />;

  return (
    <Form
      className="flex h-full"
      defaultValues={post.id ? post : { topicId: selectedTopic ? selectedTopic.id : undefined }}
    >
      <div className="flex-1 w-screen max-w-screen-lg p-10 v-scrollbar">
        <Field name="title" noError>
          <Textarea
            controlClassName=""
            rows={1}
            className="text-3xl font-semibold text-gray-700 border-0 shadow-none resize-none no-scrollbar"
            placeholder={`(${"Tiêu đề bài viết"})`}
          />
        </Field>
        <Field name="content" noError>
          <Editor
            minHeight="calc(100vh - 150px)"
            noBorder
            controlClassName=""
            className="bg-transparent border-0"
            maxWidth="none"
            placeholder={"Nội dung bài viết"}
          />
        </Field>
      </div>
      <div className="flex flex-col w-full max-w-md border-l border-gray-300 bg-gray-50">
        <div className="p-4 v-scrollbar" style={{ height: "calc(100% - 64px)" }}>
          <Field name="featureImage" label={"Hình đại diện"}>
            <ImageInput largeImage ratio169 placeholder={"Tỉ lệ 16:9"} />
          </Field>
          <Field name="excerpt" label={"Mô tả ngắn bài viết"}>
            <Textarea placeholder={"Nên để khoảng 280 ký tự"} />
          </Field>
          <Field
            name="slug"
            label={"Slug bài viết"}
            tooltip={
              "common:Chỉ cho phép chữ, số và dấu gạch ngang, không có khoảng trắng.Ví dụ: bai-viet-123"
            }
            validation={{ code: true }}
          >
            <Input placeholder={`(${"Tự tạo nếu để trống"})`} />
          </Field>
          <Field name="priority" label={"Ưu tiên bài viết"}>
            <Input number placeholder={"Ưu tiên cao sẽ hiện lên đầu."} />
          </Field>
          <Field name="tagIds" label={"Tag bài viết"}>
            <Select
              multi
              clearable={false}
              placeholder={"Chọn tag đã có hoặc nhập tag mới"}
              createablePromise={(inputValue) =>
                PostTagService.getAllCreatablePromise({ inputValue })
              }
            />
          </Field>
          <Field name="topicId" label={"Chọn chủ đề"}>
            <Select
              clearable={false}
              placeholder={"Chọn chủ đề"}
              optionsPromise={() =>
                TopicService.getAllOptionsPromise({
                  query: {
                    filter: {
                      _id: isEmpty(writer?.group?.topicIds)
                        ? undefined
                        : {
                            $in: writer?.group?.topicIds,
                          },
                      slug: { $ne: "gioi-thieu" },
                    },
                  },
                })
              }
            />
          </Field>
          <Field name="areaId" label="Khu vực">
            <Select optionsPromise={() => AreaService.getAllOptionsPromise()} />
          </Field>
          <PostDateField />
          <Field name="source" label="Nguồn">
            <Input placeholder="Nhập tên nguồn..." />
          </Field>
        </div>
        <FooterButtons onClose={onClose} post={post} />
      </div>
    </Form>
  );
}

function FooterButtons({ onClose, post }) {
  const toast = useToast();
  const { setPost } = useWriterPostDetailContext();
  const {
    formState: { isSubmitting },
    handleSubmit,
  } = useFormContext();

  const createOrUpdatePost = async (data: any, type?: string) => {
    if (!data.topicId) {
      toast.info("Bắt buộc chọn chủ đề.");
      return;
    }
    if (!data.title) {
      toast.info("Bắt buộc nhập tiêu đề bài viết.");
      return;
    }
    if (!data.content) {
      toast.info("Bắt buộc nhập nội dung bài viết.");
      return;
    }

    let noti = "";
    try {
      const res = await PostService.createOrUpdate({
        id: post.id,
        data: { ...data, approveStatus: type || post.approveStatus },
      });

      if (type === "DRAFT") {
        noti = "Lưu bản nháp thành công.";
      } else {
        noti = post.id ? "Cập nhật bài viết thành công." : "Tạo bài viết thành công.";
      }

      toast.success(noti);
      setPost(res);
      onClose();
    } catch (error) {
      if (type === "DRAFT") {
        noti = "Lưu bản nháp thất bại.";
      } else {
        noti = post.id ? "Cập nhật bài viết thất bại." : "Tạo bài viết thất bại.";
      }
      toast.error(noti, error.message);
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex items-center h-16 px-4 mt-auto border-t border-gray-300 gap-x-2">
        <Button
          outline
          onClick={handleSubmit(async (data) => {
            await createOrUpdatePost(data, "DRAFT");
          })}
          disabled={isSubmitting}
          text={"Lưu bản nháp"}
        />
        <Button
          className="flex-1"
          primary
          disabled={isSubmitting}
          text={`${post.id ? "Cập nhật" : "Tạo"} bài viết`}
          onClick={handleSubmit(async (data) => {
            await createOrUpdatePost(data, "PENDING");
          })}
        />
      </div>
    </>
  );
}
