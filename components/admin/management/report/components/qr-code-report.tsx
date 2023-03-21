import endOfDay from "date-fns/endOfDay";
import endOfMonth from "date-fns/endOfMonth";
import startOfDay from "date-fns/startOfDay";
import startOfMonth from "date-fns/startOfMonth";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { parseNumber } from "../../../../../lib/helpers/parser";
import { useAuth } from "../../../../../lib/providers/auth-provider";
import { Button, DatePicker, Field, Form, Input, Select } from "../../../../shared/utilities/form";
import { Card, Spinner } from "../../../../shared/utilities/misc";
import { TimeUnit, TIME_UNITS, useReportContext } from "../providers/report-providers";
import { ReportTitle } from "./report-title";
import { ReportWidget } from "./report-widget";

interface QRCodesReportProps extends ReactProps {
  isAdmin: boolean;
}

export function QRCodesReport({ isAdmin, ...props }: QRCodesReportProps) {
  const { member } = useAuth();
  const [memberId, setMemberId] = useState<string>();
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [filterInited, setFilterInited] = useState(false);
  const [timeUnit, setTimeUnit] = useState<TimeUnit>();
  let [timeout] = useState<any>();
  const { qrCodeStageReport, loadQRCodeStageReport, color, accent } = useReportContext();

  useEffect(() => {
    initFilter();
  }, []);

  const initFilter = () => {
    let reportFilter: any = sessionStorage.getItem("order-report-filter");
    if (reportFilter) {
      reportFilter = JSON.parse(reportFilter);
      setMemberId(reportFilter.memberId);
      setFromDate(reportFilter.startDate || startOfMonth(new Date()));
      setToDate(reportFilter.endDate || endOfMonth(new Date()));
      setTimeUnit(reportFilter.timeUnit);
    } else {
      setMemberId("");
      setFromDate(startOfMonth(new Date()));
      setToDate(endOfMonth(new Date()));
      setTimeUnit("day");
    }
    setFilterInited(true);
  };

  useEffect(() => {
    if (filterInited) {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        loadQRCodeStageReport({ fromDate, toDate, memberId, timeUnit });
        sessionStorage.setItem(
          "order-report-filter",
          JSON.stringify({ fromDate, toDate, memberId, timeUnit })
        );
      }, 100);
    }
  }, [memberId, fromDate, toDate, timeUnit, filterInited]);

  return (
    <div className="flex flex-col gap-6">
      <Form className="flex bg-white shadow-md animate-emerge">
        <Field
          className="p-4 border-r border-gray-100"
          style={{ width: 350 }}
          label="Cửa hàng"
          noError
        >
          <Input readOnly value={member.shopName} />
        </Field>
        {/* )} */}
        <div className="p-4 border-r border-gray-100 rounded border-group">
          <Button
            outline
            className="bg-gray-100 whitespace-nowrap mt-7"
            text="Tháng trước"
            onClick={() => {
              let date = new Date(fromDate.getTime());
              date.setMonth(date.getMonth() - 1);
              setFromDate(startOfMonth(date));
              setToDate(endOfMonth(date));
            }}
          />
          <Field label="Từ ngày" noError>
            <DatePicker
              className="rounded-none w-36"
              value={fromDate}
              onChange={(val) => setFromDate(startOfDay(val))}
              clearable={false}
            />
          </Field>
          <Field label="Đến ngày" noError>
            <DatePicker
              className="rounded-none w-36"
              value={toDate}
              onChange={(val) => setToDate(endOfDay(val))}
              clearable={false}
            />
          </Field>
          <Button
            outline
            className="bg-gray-100 whitespace-nowrap mt-7"
            text="Tháng sau"
            onClick={() => {
              let date = new Date(fromDate.getTime());
              date.setMonth(date.getMonth() + 1);
              setFromDate(startOfMonth(date));
              setToDate(endOfMonth(date));
            }}
          />
        </div>
        <Field className="p-4" label="Đơn vị" noError>
          <Select className="w-32" value={timeUnit} onChange={setTimeUnit} options={TIME_UNITS} />
        </Field>
      </Form>
      {qrCodeStageReport ? (
        <div className="flex flex-col gap-6 animate-emerge">
          <Card className="self-start p-6">
            <ReportTitle text="Thống kê số lượng đợt QR Code" />
            <ReportWidget image="/assets/img/qr-code.png">
              <div>
                Tổng đợt QR Code:{" "}
                <span className="text-xl font-bold">
                  {parseNumber(qrCodeStageReport.summary?.qrCodeStageSummary)}
                </span>
              </div>
              <div>
                Tổng số QR Code động được tạo:{" "}
                <span className="text-xl font-bold">
                  {parseNumber(qrCodeStageReport.summary?.qrCodeSummary)}
                </span>
              </div>
              <div>
                Tổng lượt quét toàn bộ QR Code:{" "}
                <span className="text-xl font-bold">
                  {parseNumber(qrCodeStageReport.summary?.qrCodeScanSummary)}
                </span>
              </div>
            </ReportWidget>
          </Card>
          <Card className="self-start w-full max-w-3xl p-6">
            <ReportTitle text="Top 10 QR Code được quét nhiều nhất" />
            <table className="simple-table">
              <thead>
                <tr>
                  <th className="text-left">#</th>
                  <th className="text-left">QR Code</th>
                  <th className="text-left">Tên sản phẩm</th>
                  <th className="text-right">Số lượt quét</th>
                </tr>
              </thead>
              <tbody>
                {qrCodeStageReport.top10QRCodeScan.map((QRCode, index) => (
                  <tr key={QRCode.id}>
                    <td>{index + 1}</td>
                    <td>
                      {/* window.location?.origin */}
                      <div className="flex items-center justify-start min-w-2xs">
                        {/* <QRCode
                          size={80}
                          className=""
                          value={"https://green-agri-staging.mcom.app/"}
                        /> */}
                        <div className="font-semibold">{QRCode.code}</div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center justify-start min-w-2xs">
                        <div className="font-semibold">{QRCode.productName}</div>
                      </div>
                    </td>
                    <td className="text-right">{parseNumber(QRCode.scanCount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
          {qrCodeStageReport.chart && (
            <Card>
              <ReportTitle text="Thống kê đợt QR Code" />
              <Bar
                data={{
                  datasets: [
                    // {
                    //   order: 1,
                    //   data: [...qrCodeStageReport.chart.datasets.data],
                    //   backgroundColor: color,
                    //   borderColor: color,
                    //   borderWidth: 2,
                    //   label: qrCodeStageReport.chart.datasets.label,
                    //   type: "bar",
                    //   yAxisID: "A",
                    // },
                    {
                      data: [...qrCodeStageReport.chart.datasets.data],
                      backgroundColor: "transparent",
                      borderColor: accent,
                      borderWidth: 2,
                      label: qrCodeStageReport.chart.datasets.label,
                      type: "line",
                      order: 0,
                      yAxisID: "B",
                    },
                  ],
                  labels: qrCodeStageReport.chart.labels,
                }}
                options={{
                  responsive: true,
                  plugins: { legend: { position: "bottom", align: "start" } },
                  scales: {
                    yAxes: [
                      {
                        id: "A",
                        type: "linear",
                        position: "left",
                      },
                      {
                        id: "B",
                        type: "linear",
                        position: "right",
                      },
                    ],
                  },
                }}
              />
            </Card>
          )}
        </div>
      ) : (
        <Spinner />
      )}
    </div>
  );
}
