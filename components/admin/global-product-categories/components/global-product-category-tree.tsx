import { cloneDeep } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { useFormContext } from "react-hook-form";
import { RiNewspaperFill, RiNewspaperLine } from "react-icons/ri";
import { useCrud } from "../../../../lib/hooks/useCrud";
import { useAlert } from "../../../../lib/providers/alert-provider";
import { useToast } from "../../../../lib/providers/toast-provider";
import {
  GlobalProductCategory,
  GlobalProductCategoryService,
} from "../../../../lib/repo/global-product-category.repo";
import { Button, Field, Form, ImageInput, Input, Label } from "../../../shared/utilities/form";

interface GlobalProductCategoryTreeProps extends ReactProps {
  onSelectCate: (cate: GlobalProductCategory) => any;
}

export function GlobalProductCategoryTree({
  onSelectCate,
  ...props
}: GlobalProductCategoryTreeProps) {
  const alert = useAlert();
  const toast = useToast();
  const [selectedCateId, setSelectedCateId] = useState("");
  const [selectedCate, setSelectedCate] = useState<GlobalProductCategory>();
  const [openCateDialog, setOpenCateDialog] = useState<{
    parent?: GlobalProductCategory;
    cate: GlobalProductCategory;
  }>();

  const cateCrud = useCrud(GlobalProductCategoryService, {
    limit: 10000,
    order: { priority: -1 },
  });

  const scrollToCate = useCallback((id: string) => {
    setTimeout(() => {
      const el = document.getElementById(id);

      if (el) el.scrollIntoView({ block: "center", behavior: "smooth" });
    }, 500);
  }, []);

  const cate: GlobalProductCategory = useMemo(
    () =>
      cateCrud.items && selectedCateId
        ? cateCrud.items.find((x) => x.id == selectedCateId)
        : ({
            id: "",
            name: "Không có",
          } as GlobalProductCategory),
    [cateCrud.items, selectedCateId]
  );

  const cateList = useMemo(() => {
    if (cateCrud.items) {
      let cateList: GlobalProductCategory[] = cloneDeep(cateCrud.items);
      let rootCateList = cateList.filter((x) => !x.parentId);
      const attachChildrenCateList = (
        cate: GlobalProductCategory,
        cateList: GlobalProductCategory[]
      ) => {
        cate.children = cateList.filter((x) => x.parentId === cate?.id);
        for (let child of cate.children) {
          attachChildrenCateList(child, cateList);
        }
      };

      for (let cate of rootCateList) {
        attachChildrenCateList(cate, cateList);
      }

      return [
        {
          id: "",
          name: "Tất cả danh mục sản phẩm",
          parentId: undefined,
        },
        ...rootCateList,
      ];
    }

    return [];
  }, [cateCrud.items]);

  const hasChildren = useMemo(() => {
    if (!selectedCateId || !cateList?.length) return false;

    const selectedCate: any = cateList.find((cate) => cate.id === selectedCateId);
    return selectedCate?.children?.length > 0;
  }, [cateList, selectedCateId]);

  useEffect(() => {
    const cate = selectedCateId ? cateCrud.items.find((x) => x.id == selectedCateId) : null;
    onSelectCate(cate);
    setSelectedCate(cate);
  }, [selectedCateId]);

  return (
    <div className="sticky flex flex-col w-64 px-0 py-0 bg-white border shadow-sm top-20 grow-0 shrink-0 self-baseline">
      <div className="px-3 py-2">
        <Label className="mb-0 text-xl" text="Danh mục sản phẩm" />
      </div>
      <Scrollbars
        className="p-3 border-t border-b border-gray-200"
        style={{ height: "calc(100vh - 214px)" }}
      >
        <div className="p-3">
          {cateList?.map((child, index) => (
            <CateBranch
              key={child.id}
              cate={child}
              selectedCateId={selectedCateId}
              isLast={index == cateList.length - 1}
              onClick={(child) => {
                setSelectedCateId(child);
              }}
            />
          ))}
        </div>
      </Scrollbars>
      <div className="flex items-center flex-1 p-3 gap-x-2">
        <Button
          outline
          hoverSuccess
          text="Tạo"
          className="flex-1 px-0"
          onClick={() => {
            if (!cate) return;

            setOpenCateDialog({
              parent: cate,
              cate: {} as any,
            });
          }}
          disabled={!!selectedCate?.parentId}
        />
        <Button
          outline
          hoverAccent
          text="Sửa"
          className="flex-1 px-0"
          onClick={() => {
            if (!cate || !cate.id) return;

            setOpenCateDialog({
              cate,
            });
          }}
          disabled={!cate?.id}
        />
        <Button
          outline
          hoverDanger
          text="Xoá"
          className="flex-1 px-0"
          onClick={() => {
            if (!cate || !cate.id) return;
            alert.danger(
              "Xoá danh mục sản phẩm?",
              `Bạn có chắc chắc muốn xoá danh mục sản phẩm "${cate.name}" không?`,
              "Xoá danh mục sản phẩm?",
              async () => {
                await GlobalProductCategoryService.delete({ id: cate.id, toast });
                await cateCrud.loadAll();
                setSelectedCateId("");
                scrollToCate("all");
                return true;
              }
            );
          }}
          disabled={!cate?.id || hasChildren}
        />
      </div>
      <Form
        dialog
        width="450px"
        allowResetDefaultValues
        defaultValues={openCateDialog?.cate}
        isOpen={!!openCateDialog}
        onClose={() => setOpenCateDialog(null)}
        title={`${openCateDialog?.cate?.id ? "Chỉnh sửa" : "Tạo"} danh mục sản phẩm`}
        onSubmit={(data) =>
          GlobalProductCategoryService.createOrUpdate({
            id: openCateDialog?.cate?.id,
            data,
            toast,
            fragment: GlobalProductCategoryService.shortFragment,
          }).then(async (res) => {
            await cateCrud.loadAll();
            setSelectedCateId(res.id);
            setOpenCateDialog(null);
            scrollToCate(res.id);
          })
        }
      >
        <Field label="Tên danh mục sản phẩm" name="name" required>
          <Input autoFocus />
        </Field>
        <Field name="slug" label="Slug" validation={{ slug: true }}>
          <Input placeholder="Tự tạo nếu để trống." />
        </Field>
        <Field name="priority" label="Ưu tiên" description="Ưu tiên cao sẽ hiện đầu.">
          <Input number />
        </Field>
        <Field name="image" label="Hình ảnh">
          <ImageInput />
        </Field>
        <ParentCateField cateList={cateCrud.items} cateParentId={openCateDialog?.parent?.id} />
        <Form.Footer />
      </Form>
    </div>
  );
}

function ParentCateField({
  cateList,
  cateParentId,
}: {
  cateList: GlobalProductCategory[];
  cateParentId: string;
}) {
  const { register } = useFormContext();

  if (!cateParentId) {
    register("parentId", { value: undefined });
    return <></>;
  }

  const cate = cateList.find((x) => x.id == cateParentId);
  register("parentId", { value: cate.id });

  return (
    <Field label="Thuộc chủ đề" readOnly>
      <Input value={cate.name} />
    </Field>
  );
}

interface BranchProps {
  cate: Partial<GlobalProductCategory & { children: GlobalProductCategory[] }>;
  selectedCateId: string;
  isLast?: boolean;
  onClick?: (cateId: string) => any;
  onCreateClick?: () => any;
  onUpdateClick?: () => any;
  onDeleteClick?: () => any;
}
function CateBranch({
  cate,
  selectedCateId,
  isLast,
  onClick,
  onCreateClick,
  onUpdateClick,
  onDeleteClick,
}: BranchProps) {
  const isSelected = useMemo(() => selectedCateId == cate.id, [cate, selectedCateId]);

  return (
    <>
      <div className={`relative ${cate?.parentId ? "branch-item" : ""} ${isLast ? "is-last" : ""}`}>
        <div className="flex mb-0.5 relative" id={cate?.id || "all"}>
          <Button
            primary={isSelected}
            icon={cate?.id ? isSelected ? <RiNewspaperFill /> : <RiNewspaperLine /> : null}
            className={`ml-1 min-h-7 h-auto py-1 pl-1.5 pr-3 text-sm justify-start text-left items-start ${
              isSelected ? "z-10" : "hover:bg-primary-light hover:z-10"
            }`}
            iconClassName="mt-0.5"
            text={cate.name}
            onClick={() => onClick(cate.id)}
          />
        </div>
        {!!cate.children?.length && (
          <div className={`pl-4 relative flex flex-col items-start branch-parentId`}>
            {cate.children?.map((child, index) => (
              <CateBranch
                key={child.id}
                cate={child}
                selectedCateId={selectedCateId}
                isLast={index == cate.children.length - 1}
                onClick={onClick}
                onCreateClick={onCreateClick}
                onUpdateClick={onUpdateClick}
                onDeleteClick={onDeleteClick}
              />
            ))}
          </div>
        )}
      </div>
      {/* <style jsx>{`
        .branch-item:not(.is-last)::before {
          position: absolute;
          content: "";
          top: -12px;
          left: -4px;
          width: 1px;
          height: calc(100% + 24px);
          border-left: 1px solid #ccc;
        }
        .branch-item.is-last::before {
          position: absolute;
          content: "";
          top: -8px;
          left: -4px;
          width: 1px;
          height: 20px;
          border-left: 1px solid #ccc;
        }
        .branch-item::after {
          position: absolute;
          content: "";
          top: 12px;
          left: -4px;
          width: 8px;
          height: 1px;
          border-top: 1px solid #ccc;
        }
      `}</style> */}
    </>
  );
}
