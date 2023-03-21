import { createContext, useContext, useEffect, useRef, useState } from "react";
import { QRCodeStage } from "../../../../../lib/repo/qr-code/qr-code-stage.repo";
import {
  CollaboratorReport,
  CustomerReport,
  OrderReport,
  PromotionReport,
  ReportQRCode,
  ReportService,
  RewardPointReport,
  ShopReport,
} from "../../../../../lib/repo/report.repo";
import { ServiceReservation } from "../../../../../lib/repo/services/service-reservation.repo";

export const ReportContext = createContext<
  Partial<{
    isAdmin: boolean;
    color: string;
    accent: string;
    shopReport: ShopReport;
    loadReportShop: () => any;
    orderReport: OrderReport;
    loadOrderReport: ({
      fromDate,
      toDate,
      memberId,
      timeUnit,
    }: {
      fromDate: Date;
      toDate: Date;
      memberId: string;
      timeUnit: TimeUnit;
    }) => any;
    serviceReservationReport: ServiceReservation;
    loadServiceReservationReport: ({
      fromDate,
      toDate,
      memberId,
      timeUnit,
    }: {
      fromDate: Date;
      toDate: Date;
      memberId: string;
      timeUnit: TimeUnit;
    }) => any;
    customerReport: CustomerReport;
    loadCustomerReport: ({ fromDate, toDate }: { fromDate: Date; toDate: Date }) => any;
    rewardPointReport: RewardPointReport;
    loadRewardReport: ({
      fromDate,
      toDate,
      memberId,
    }: {
      fromDate: Date;
      toDate: Date;
      memberId: string;
    }) => any;
    collaboratorReport: CollaboratorReport;
    loadCollaboratorReport: ({
      fromDate,
      toDate,
      memberId,
    }: {
      fromDate: Date;
      toDate: Date;
      memberId: string;
    }) => any;
    promotionReport: PromotionReport;
    loadPromotionReport: ({
      fromDate,
      toDate,
      memberId,
    }: {
      fromDate: Date;
      toDate: Date;
      memberId: string;
    }) => any;
    qrCodeStageReport: ReportQRCode;
    loadQRCodeStageReport: ({
      fromDate,
      toDate,
      memberId,
      timeUnit,
    }: {
      fromDate: Date;
      toDate: Date;
      memberId: string;
      timeUnit: TimeUnit;
    }) => any;
  }>
>({});
interface PropsType extends ReactProps {
  isAdmin: boolean;
}
export function ReportProvider({ isAdmin = true, ...props }: PropsType) {
  const [shopReport, setShopReport] = useState<ShopReport>();
  const [orderReport, setOrderReport] = useState<OrderReport>();
  const [serviceReservationReport, setServiceReservationReport] = useState<ServiceReservation>();
  const [customerReport, setCustomerReport] = useState<CustomerReport>();
  const [collaboratorReport, setCollaboratorReport] = useState<CollaboratorReport>();
  const [promotionReport, setPromotionReport] = useState<PromotionReport>();
  const [rewardPointReport, setRewardPointReport] = useState<RewardPointReport>();
  const [qrCodeStageReport, setQRCodeStageReport] = useState<ReportQRCode>();
  const colorRef = useRef();
  const accentRef = useRef();
  const [color, setColor] = useState("#666");
  const [accent, setAccent] = useState("#666");

  const loadReportShop = () => {
    setShopReport(null);
    ReportService.reportShop().then((res) => setShopReport(res));
  };

  const loadOrderReport = ({ fromDate, toDate, memberId, timeUnit }) => {
    setOrderReport(null);
    ReportService.reportOrder({ fromDate, toDate, memberId, timeUnit }).then((res) =>
      setOrderReport(res)
    );
  };

  const loadServiceReservationReport = ({ fromDate, toDate, memberId, timeUnit }) => {
    setServiceReservationReport(null);
    ReportService.reportServiceReservation({
      fromDate,
      toDate,
      memberId,
      timeUnit,
    }).then((res) => setServiceReservationReport(res));
  };

  const loadCustomerReport = ({ fromDate, toDate }) => {
    setCustomerReport(null);
    ReportService.reportCustomer({ fromDate, toDate }).then((res) => setCustomerReport(res));
  };

  const loadCollaboratorReport = ({ memberId, fromDate, toDate }) => {
    setCollaboratorReport(null);
    ReportService.reportCollaborator({ memberId, fromDate, toDate }).then((res) =>
      setCollaboratorReport(res)
    );
  };

  const loadPromotionReport = ({ memberId, fromDate, toDate }) => {
    setPromotionReport(null);
    ReportService.reportPromotion({ memberId, fromDate, toDate }).then((res) =>
      setPromotionReport(res)
    );
  };

  const loadRewardReport = ({ memberId, fromDate, toDate }) => {
    setRewardPointReport(null);
    ReportService.reportRewardPoint({ memberId, fromDate, toDate }).then((res) =>
      setRewardPointReport(res)
    );
  };

  const loadQRCodeStageReport = ({ memberId, fromDate, toDate, timeUnit }) => {
    setQRCodeStageReport(null);
    ReportService.reportQRCode({ fromDate, toDate, memberId, timeUnit }).then((res) =>
      setQRCodeStageReport(res)
    );
  };

  useEffect(() => {
    setTimeout(() => {
      setColor(getComputedStyle(colorRef.current).color);
    }, 100);
  }, [colorRef.current]);

  useEffect(() => {
    setTimeout(() => {
      setAccent(getComputedStyle(accentRef.current).color);
    }, 100);
  }, [accentRef.current]);

  return (
    <ReportContext.Provider
      value={{
        color,
        accent,
        shopReport,
        loadReportShop,
        orderReport,
        loadOrderReport,
        serviceReservationReport,
        loadServiceReservationReport,
        customerReport,
        loadCustomerReport,
        collaboratorReport,
        loadCollaboratorReport,
        promotionReport,
        loadPromotionReport,
        isAdmin,
        rewardPointReport,
        loadRewardReport,
        qrCodeStageReport,
        loadQRCodeStageReport,
      }}
    >
      <div
        className="absolute invisible opacity-0 pointer-events-none text-accent"
        ref={colorRef}
      ></div>
      <div
        className="absolute invisible opacity-0 pointer-events-none text-danger"
        ref={accentRef}
      ></div>
      {props.children}
    </ReportContext.Provider>
  );
}

export const useReportContext = () => useContext(ReportContext);

export const TIME_UNITS: Option[] = [
  { value: "day", label: "Ngày" },
  { value: "week", label: "Tuần" },
  { value: "month", label: "Tháng" },
];
export type TimeUnit = "day" | "week" | "month";
