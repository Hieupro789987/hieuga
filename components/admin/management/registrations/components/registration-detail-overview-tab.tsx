import {
  RiBarcodeBoxLine,
  RiBuilding4Line,
  RiCalendarTodoLine,
  RiCommunityLine,
  RiErrorWarningLine,
  RiHome3Line,
  RiImageLine,
  RiMailLine,
  RiMapPinLine,
  RiPhoneLine,
  RiShoppingCart2Line,
  RiStore2Line,
  RiUserFollowLine,
} from "react-icons/ri";
import { useAdminLayoutContext } from "../../../../../layouts/admin-layout/providers/admin-layout-provider";
import { formatDate } from "../../../../../lib/helpers/parser";
import { useToast } from "../../../../../lib/providers/toast-provider";
import { SHOP_TYPE_LIST } from "../../../../../lib/repo/member.repo";
import {
  ShopRegistrationService,
  SHOP_REGISTRATION_STATUS,
} from "../../../../../lib/repo/shop-registration.repo";
import { Button } from "../../../../shared/utilities/form";
import { StatusLabel } from "../../../../shared/utilities/misc";
import { useRegistrationDetailContext } from "../providers/registration-detail-provider";

export function RegistrationDetailOverviewTab({ onSubmit, ...props }: { onSubmit: () => {} }) {
  const toast = useToast();
  const { checkPendingRegistrations } = useAdminLayoutContext();
  const { registration, setRegistration } = useRegistrationDetailContext();

  const handleApprovedClick = async () => {
    await ShopRegistrationService.approveShopRegis(registration.id, true)
      .then(async (res) => {
        await setRegistration(res);
        await checkPendingRegistrations();
        onSubmit();
        toast.success("Duyệt đăng ký thành công");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Duyệt đăng ký thất bại. " + err.message);
      });
  };

  const handleRejectedClick = async () => {
    await ShopRegistrationService.approveShopRegis(registration.id, false)
      .then(async (res) => {
        await setRegistration(res);
        await checkPendingRegistrations();
        onSubmit();
        toast.success("Từ chối đăng ký thành công");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Từ chối đăng ký thất bại. " + err.message);
      });
  };

  return (
    <div className="flex flex-col gap-2 mt-4">
      <div className="grid grid-cols-2 mt-1 text-gray-700">
        <InfoRow label="Tên shop" content={registration?.shopName} icon={<RiStore2Line />} />
        <InfoRow label="Mã shop" content={registration?.shopCode} icon={<RiBarcodeBoxLine />} />
      </div>
      <div className="grid grid-cols-2 mt-1 text-gray-700">
        <InfoRow
          label="Danh mục"
          content={registration?.category?.name}
          icon={<RiShoppingCart2Line />}
        />
        <InfoRow
          label="Trạng thái"
          content={<StatusLabel options={SHOP_REGISTRATION_STATUS} value={registration?.status} />}
          icon={<RiErrorWarningLine />}
        />

        {/* <InfoRow label="Mã số thuế" content={registration?.taxCode} icon={<RiBankCardLine />} /> */}
      </div>
      <div className="grid grid-cols-2 mt-1 text-gray-700">
        <InfoRow
          label="Logo shop"
          image={registration?.shopLogo}
          imageClassName="w-1/3"
          icon={<RiImageLine />}
        />
        <InfoRow
          label="Ngày xét duyệt"
          content={
            registration?.status === "APPROVED"
              ? registration?.approvedAt
              : registration?.rejectedAt
          }
          isDate
          icon={<RiCalendarTodoLine />}
        />
      </div>
      <div className="grid grid-cols-2 mt-1 text-gray-700">
        <InfoRow label="Người đại diện" content={registration?.name} icon={<RiUserFollowLine />} />
        <InfoRow
          label="Ngày sinh"
          content={registration?.birthday}
          isDate
          icon={<RiCalendarTodoLine />}
        />
      </div>
      <div className="grid grid-cols-2 mt-1 text-gray-700">
        <InfoRow label="Email" content={registration?.email} icon={<RiMailLine />} />
        <InfoRow label="SDT" content={registration?.phone} icon={<RiPhoneLine />} />
      </div>
      <div className="grid grid-cols-2 mt-1 text-gray-700">
        <InfoRow label="Địa chỉ" content={registration?.address} icon={<RiMapPinLine />} />
        <InfoRow
          label="Loại shop"
          content={
            <StatusLabel options={SHOP_TYPE_LIST} value={registration?.shopType} type="text" />
          }
          icon={<RiBuilding4Line />}
        />
      </div>
      {registration?.shopType === "SALE_POINT" && (
        <>
          <div className="grid grid-cols-2 mt-1 text-gray-700">
            <InfoRow
              label="Tài khoản đại lý"
              content={registration?.customer?.name}
              icon={<RiHome3Line />}
            />
            <InfoRow
              label="Điểm bán của cửa hàng"
              content={registration?.parentMember?.name}
              icon={<RiCommunityLine />}
            />
          </div>
        </>
      )}
      {registration?.status === "PENDING" && (
        <>
          <hr className="my-3 border-gray-300" />
          <div className="flex justify-center w-full gap-x-4">
            <Button text="Chấp nhận" large success onClick={handleApprovedClick} />
            <Button danger text="Từ chối" large onClick={handleRejectedClick} />
          </div>
        </>
      )}
    </div>
  );
}

export function InfoRow({
  label,
  content,
  icon,
  isDate,
  className = "",
  image,
  imageClassName = "",
}: {
  label?: string;
  content?: any;
  icon?: any;
  isDate?: boolean;
  image?: string;
  imageClassName?: string;
} & ReactProps) {
  return (
    <div className={`flex items-start mt-1 text-gray-700 ${className}`}>
      <i className="mt-1 mr-2">{icon}</i>
      <div className="flex">
        {label && <span className="mr-1">{label}:</span>}
        {content ? (
          <span className="font-semibold">
            {isDate ? formatDate(content, "dd-MM-yyyy HH:mm") : content || ""}{" "}
          </span>
        ) : (
          <span className="font-light text-gray-500">Không có</span>
        )}
        {image && <img src={image} className={`${imageClassName}`} />}
      </div>
    </div>
  );
}
