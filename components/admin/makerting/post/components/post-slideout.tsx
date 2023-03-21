import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useToast } from "../../../../../lib/providers/toast-provider";
import { AreaService } from "../../../../../lib/repo/area.repo";
import { PostTagService } from "../../../../../lib/repo/post-tag.repo";
import { Post, PostService } from "../../../../../lib/repo/post.repo";
import { Topic, TopicService } from "../../../../../lib/repo/topic.repo";
import { Slideout, SlideoutProps } from "../../../../shared/utilities/dialog/slideout";
import {
  Button,
  DatePicker,
  Editor,
  Field,
  Form,
  ImageInput,
  Input,
  Select,
  Textarea,
} from "../../../../shared/utilities/form";
import { Spinner } from "../../../../shared/utilities/misc";

interface PostSlideoutPropsType extends SlideoutProps {
  postId: string;
  loadAll: () => Promise<any>;
  selectedTopic: Topic;
}

export function PostSlideout({ postId, loadAll, selectedTopic, ...props }: PostSlideoutPropsType) {
  const { t } = useTranslation();
  const router = useRouter();
  const [post, setPost] = useState<Partial<Post>>(null);
  const toast = useToast();
  const [selectedLocale, setSelectedLocale] = useState("vi");

  useEffect(() => {
    if (postId !== null) {
      if (postId) {
        PostService.getOne({ id: postId }).then((res) => {
          setPost(res);
        });
      } else {
        setPost({});
      }
    } else {
      setPost(null);
    }
  }, [postId]);

  const onSubmit = async (data) => {
    if (!data.title) {
      toast.info(t("Bắt buộc nhập tiêu đề bài viết."));
      return;
    }
    if (!data.topicId) {
      toast.info("Bắt buộc chọn chủ đề.");
      return;
    }
    if (!data.content) {
      toast.info("Bắt buộc nhập nội dung bài viết.");
      return;
    }

    await PostService.createOrUpdate({ id: post.id, data: { ...data } })
      .then((res) => {
        toast.success(`${post.id ? t("Cập nhật") : t("Tạo")} ${t("bài viết thành công")}`);
        loadAll();
        onClose();
      })
      .catch((err) => {
        console.debug(err);
        toast.error(
          `${post.id ? t("Cập nhật") : t("Tạo")} ${t("bài viết thất bại")}. ${err.message}`
        );
      });
  };

  const onClose = () => router.replace({ pathname: location.pathname, query: {} });

  return (
    <Slideout width="86vw" maxWidth={"1200px"} isOpen={postId !== null} onClose={onClose}>
      {!post ? (
        <Spinner />
      ) : (
        <Form
          className="flex h-full"
          defaultValues={post.id ? post : { topicId: selectedTopic ? selectedTopic.id : undefined }}
          onSubmit={onSubmit}
        >
          <div className="flex-1 w-screen max-w-screen-lg p-10 v-scrollbar">
            <Field name="title" noError locale={selectedLocale}>
              <Textarea
                controlClassName=""
                rows={1}
                className="text-3xl font-semibold text-gray-700 border-0 shadow-none resize-none no-scrollbar"
                placeholder={`(${t("Tiêu đề bài viết")})`}
              />
            </Field>
            <Field name="content" noError locale={selectedLocale}>
              <Editor
                minHeight="calc(100vh - 150px)"
                noBorder
                controlClassName=""
                className="bg-transparent border-0"
                maxWidth="none"
                placeholder={t("Nội dung bài viết")}
              />
            </Field>
          </div>
          <div className="flex flex-col w-full max-w-xs border-l border-gray-300 bg-gray-50">
            <div className="p-4 v-scrollbar" style={{ height: "calc(100% - 64px)" }}>
              <Field name="featureImage" label={t("Hình đại diện")}>
                <ImageInput largeImage ratio169 placeholder={t("Tỉ lệ 16:9")} />
              </Field>
              <Field name="excerpt" label={t("Mô tả ngắn bài viết")} locale={selectedLocale}>
                <Textarea placeholder={t("Nên để khoảng 280 ký tự")} />
              </Field>
              <Field
                name="slug"
                label={t("Slug bài viết")}
                tooltip={t(
                  "common:Chỉ cho phép chữ, số và dấu gạch ngang, không có khoảng trắng.Ví dụ: bai-viet-123"
                )}
                validation={{ code: true }}
              >
                <Input placeholder={`(${t("Tự tạo nếu để trống")})`} />
              </Field>
              <Field name="priority" label={t("Ưu tiên bài viết")}>
                <Input number placeholder={t("Ưu tiên cao sẽ hiện lên đầu.")} />
              </Field>
              <Field name="tagIds" label={t("Tag bài viết")}>
                <Select
                  multi
                  clearable={false}
                  placeholder={t("Chọn tag đã có hoặc nhập tag mới")}
                  createablePromise={(inputValue) =>
                    PostTagService.getAllCreatablePromise({ inputValue })
                  }
                />
              </Field>
              <Field name="topicId" label={t("Chọn chủ đề")} required>
                <Select
                  clearable={false}
                  placeholder={t("Chọn chủ đề")}
                  optionsPromise={() =>
                    TopicService.getAllOptionsPromise({
                      query: {
                        filter: {
                          slug: { $nin: ["thong-tin-mua-vu", "thong-tin-thi-truong"] },
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
      )}
    </Slideout>
  );
}

function FooterButtons({ onClose, post }) {
  const { t } = useTranslation();
  const {
    formState: { isSubmitting },
  } = useFormContext();
  return (
    <>
      <div className="flex items-center h-16 px-4 mt-auto border-t border-gray-300 gap-x-2">
        <Button outline text={t("Đóng")} onClick={onClose} />
        <Button
          submit
          className="flex-1"
          primary
          isLoading={isSubmitting}
          text={`${post.id ? t("Cập nhật") : t("Tạo")} ${t("bài viết")}`}
        />
      </div>
    </>
  );
}

export function PostDateField() {
  const { watch, setValue } = useFormContext();
  const postedAt = watch("postedAt");
  const current = new Date().toISOString();

  useEffect(() => {
    if (!postedAt) setValue("postedAt", current);
  }, [postedAt]);

  return (
    <Field name="postedAt" label="Ngày đăng">
      <DatePicker clearable={false} />
    </Field>
  );
}
