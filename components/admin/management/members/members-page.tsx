import Link from "next/link";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  RiFileAddLine,
  RiLock2Line,
  RiLoginBoxLine,
  RiMoneyDollarCircleLine,
} from "react-icons/ri";
import { SetMemberToken } from "../../../../lib/graphql/auth.link";
import { useToast } from "../../../../lib/providers/toast-provider";
import { CustomerService } from "../../../../lib/repo/customer.repo";
import { Member, MemberService, SHOP_TYPE_LIST } from "../../../../lib/repo/member.repo";
import {
  ShopSubscriptionService,
  SUBSCRIPTION_PLANS,
} from "../../../../lib/repo/shop-subscription.repo";
import { Field } from "../../../shared/utilities/form/field";
import { Form } from "../../../shared/utilities/form/form";
import { ImageInput } from "../../../shared/utilities/form/image-input";
import { Input } from "../../../shared/utilities/form/input";
import { Select } from "../../../shared/utilities/form/select";
import { Switch } from "../../../shared/utilities/form/switch";
import { Card } from "../../../shared/utilities/misc";
import { DataTable } from "../../../shared/utilities/table/data-table";
import { SubscriptionsDialog } from "./components/subscriptions-dialog";

export function MembersPage() {
  const toast = useToast();
  const [openChangePasswordMember, setOpenChangePasswordMember] = useState<Member>(null);
  const [openSubscriptionDialog, setOpenSubscriptionDialog] = useState<Member>();
  const [extendShop, setExtendShop] = useState<Member>(null);

  return (
    <Card>
      <DataTable<Member> crudService={MemberService}>
        <DataTable.Header>
          <DataTable.Title />
          <DataTable.Buttons>
            <DataTable.Button outline isRefreshButton refreshAfterTask />
            <DataTable.Button primary isCreateButton />
          </DataTable.Buttons>
        </DataTable.Header>

        <DataTable.Divider />

        <DataTable.Toolbar>
          <DataTable.Search />
          <DataTable.Filter></DataTable.Filter>
        </DataTable.Toolbar>

        <DataTable.Table className="mt-4">
          <DataTable.Column
            label="Cửa hàng"
            render={(item: Member) => (
              <DataTable.CellText
                image={item.shopLogo}
                value={item.shopName}
                subText={
                  <div className="flex flex-col items-start">
                    <Link href={`/${item.code}`}>
                      <a target="_blank" className="font-semibold text-primary hover:underline">
                        {item.code}
                      </a>
                    </Link>
                    {item.category && (
                      <div className="inline-block p-1 mt-1 text-xs font-semibold text-gray-600 bg-gray-200 rounded">
                        {item.category.name}
                      </div>
                    )}
                  </div>
                }
              />
            )}
          />
          <DataTable.Column
            label="Người đại diện"
            render={(item: Member) => (
              <DataTable.CellText
                value={item.name}
                subText={item.phone}
                className="font-semibold"
              />
            )}
          />
          <DataTable.Column
            label="Email đăng nhập"
            render={(item: Member) => <DataTable.CellText value={item.username} />}
          />
          <DataTable.Column
            center
            orderBy="role"
            label="Trạng thái"
            render={(item: Member) => (
              <DataTable.CellStatus
                options={[
                  { value: true, label: "Hoạt động", color: "success" },
                  { value: false, label: "Đóng cửa", color: "slate" },
                ]}
                value={item.activated}
              />
            )}
          />
          <DataTable.Column
            center
            label="Ngày tạo"
            render={(item: Member) => <DataTable.CellDate value={item.createdAt} />}
          />
          {/* <DataTable.Column
            center
            label="Loại cửa hàng"
            render={(item: Member) => (
              <DataTable.CellStatus options={SHOP_TYPE_LIST} value={item?.shopType} />
            )}
          /> */}
          <DataTable.Column
            right
            render={(item: Member) => (
              <>
                <DataTable.CellButton
                  value={item}
                  icon={<RiFileAddLine />}
                  tooltip="Thanh toán dịch vụ"
                  onClick={() => {
                    setExtendShop(item);
                  }}
                />
                <DataTable.CellButton
                  value={item}
                  icon={<RiMoneyDollarCircleLine />}
                  tooltip="Lịch sử thanh toán dịch vụ"
                  onClick={() => {
                    setOpenSubscriptionDialog(item);
                  }}
                />
                <DataTable.CellButton
                  value={item}
                  icon={<RiLoginBoxLine />}
                  tooltip="Quản lý"
                  onClick={async () => {
                    const open = window.open("", "_blank");
                    const token = await MemberService.getMemberToken(item.id);
                    SetMemberToken(token, open.localStorage);
                    open.location.href = `${location.origin}/shop`;
                  }}
                />
                <DataTable.CellButton
                  value={item}
                  icon={<RiLock2Line />}
                  tooltip="Đổi mật khẩu"
                  onClick={() => {
                    setOpenChangePasswordMember(item);
                  }}
                />
                {/* <DataTable.CellButton value={item} moreItems={[
                    {
                      value: item,
                      icon: <RiFileAddLine />,
                      tooltip: "Thanh toán dịch vụ",
                      onClick: () => {
                        setExtendShop(item);
                    } }
                  }
                ]}/> */}
                <DataTable.CellButton value={item} isUpdateButton />
                <DataTable.CellButton hoverDanger value={item} isDeleteButton />
              </>
            )}
          />
        </DataTable.Table>
        <DataTable.Pagination />

        <DataTable.Consumer>
          {({ formItem, loadAll }) => (
            <>
              <DataTable.Form grid beforeSubmit={(data) => ({ ...data, shopType: "ENTERPRISE" })}>
                <Field
                  label="Email đăng nhập"
                  name="username"
                  cols={formItem?.id ? 12 : 6}
                  readOnly={formItem?.id}
                  required
                >
                  <Input autoFocus type="email" />
                </Field>
                {!formItem?.id && (
                  <Field label="Mật khẩu" name="password" cols={6} required>
                    <Input type="password" />
                  </Field>
                )}
                <Field
                  label="Mã cửa hàng"
                  name="code"
                  cols={7}
                  required
                  validation={{
                    shopCode: (value) => {
                      const regex = /^([a-z0-9])(?:[-_a-z0-9])*$/;
                      if (!regex.test(String(value).toLowerCase())) {
                        return "Gồm chữ thường, số, và dấu gạch dưới";
                      }
                    },
                  }}
                  readOnly={formItem?.id}
                >
                  <Input placeholder="Gồm chữ thường, số, và dấu gạch dưới" />
                </Field>
                <Field label="Trạng thái" name="activated" cols={5}>
                  <Switch
                    placeholder="Hoạt động"
                    value={formItem?.id ? formItem?.activated : true}
                  />
                </Field>
                <Field label="Tên cửa hàng" name="shopName" cols={12} required>
                  <Input />
                </Field>
                {/* <ShopTypeSelect /> */}
                <Field label="Logo cửa hàng" name="shopLogo" cols={12}>
                  <ImageInput defaultValue="https://i.imgur.com/g9DHv7s.png" />
                </Field>
                <Field label="Họ tên người đại diện" name="name" cols={6} required>
                  <Input />
                </Field>
                <Field label="Số điện thoại" name="phone" cols={6} required>
                  <Input type="tel" />
                </Field>
              </DataTable.Form>
              <Form
                title="Thay đổi mật khẩu cửa hàng"
                defaultValues={openChangePasswordMember}
                dialog
                isOpen={!!openChangePasswordMember}
                onClose={() => setOpenChangePasswordMember(null)}
                onSubmit={async (data) => {
                  try {
                    await MemberService.updateMemberPassword(
                      openChangePasswordMember?.id,
                      data.password
                    );
                    setOpenChangePasswordMember(null);
                    toast.success("Thay đổi mật khẩu thành công.");
                  } catch (err) {
                    toast.error("Thay đổi mật khẩu thất bại. " + err.message);
                  }
                }}
              >
                <Field readOnly label="Cửa hàng">
                  <Input value={openChangePasswordMember?.shopName} />
                </Field>
                <Field readOnly label="Email">
                  <Input value={openChangePasswordMember?.username} />
                </Field>
                <Field required name="password" label="Mật khẩu mới">
                  <Input type="password" />
                </Field>
                <Form.Footer submitText="Đổi mật khẩu" />
              </Form>
              <Form
                title="Thanh toán dịch vụ"
                dialog
                isOpen={!!extendShop}
                onClose={() => setExtendShop(null)}
                onSubmit={async (data) => {
                  try {
                    await ShopSubscriptionService.extendSubscription(extendShop?.id, data.plan);
                    setExtendShop(null);
                    toast.success("Thanh toán dịch vụ thành công. Dữ liệu đang dược cập nhật");
                    loadAll(true);
                  } catch (err) {
                    toast.error("Thanh toán dịch vụ thất bại. " + err.message);
                  }
                }}
              >
                <Field readOnly label="Cửa hàng">
                  <Input value={extendShop?.shopName} />
                </Field>
                <Field label="Gói dịch vụ" name="plan">
                  <Select options={SUBSCRIPTION_PLANS} />
                </Field>
                <Form.Footer submitText="Xác nhận thanh toán" />
              </Form>
            </>
          )}
        </DataTable.Consumer>
      </DataTable>
      <SubscriptionsDialog
        member={openSubscriptionDialog}
        isOpen={!!openSubscriptionDialog}
        onClose={() => setOpenSubscriptionDialog(null)}
      />
    </Card>
  );
}

export const ShopTypeSelect = () => {
  const { watch } = useFormContext();
  const shopType = watch("shopType");
  const isSalePoint = shopType === "SALE_POINT";

  return (
    <>
      <Field label="Loại cửa hàng" name="shopType" required cols={12}>
        <Select options={SHOP_TYPE_LIST} />
      </Field>
      <div className={`grid col-span-12 ${!isSalePoint && "hidden"}`}>
        <Field label="Tài khoản đại lý" name="customerId" required={isSalePoint} cols={6}>
          <Select optionsPromise={() => CustomerService.getAllOptionsPromise()} clearable />
        </Field>
        <Field label="Điểm bán của cửa hàng" name="parentMemberId" required={isSalePoint} cols={6}>
          <Select optionsPromise={() => MemberService.getAllOptionsPromise()} clearable />
        </Field>
      </div>
    </>
  );
};
