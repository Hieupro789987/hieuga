import endOfDay from "date-fns/endOfDay";
import endOfMonth from "date-fns/endOfMonth";
import startOfDay from "date-fns/startOfDay";
import startOfMonth from "date-fns/startOfMonth";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { parseNumber } from "../../../../../lib/helpers/parser";
import { useAuth } from "../../../../../lib/providers/auth-provider";
import { MemberService } from "../../../../../lib/repo/member.repo";
import { Button, DatePicker, Field, Form, Input, Select } from "../../../../shared/utilities/form";
import { Card, Img, Spinner } from "../../../../shared/utilities/misc";
import { TimeUnit, TIME_UNITS, useReportContext } from "../providers/report-providers";
import { ReportTitle } from "./report-title";
import { ReportWidget } from "./report-widget";

interface ServiceReservationsReportProps extends ReactProps {
  isAdmin: boolean;
}

export function ServiceReservationsReport({ isAdmin, ...props }: ServiceReservationsReportProps) {
  const { member } = useAuth();
  const [memberId, setMemberId] = useState<string>();
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [timeUnit, setTimeUnit] = useState<TimeUnit>();
  const [filterInited, setFilterInited] = useState(false);
  let [timeout] = useState<any>();
  const {
    serviceReservationReport,
    loadServiceReservationReport,
    color,
    accent,
  } = useReportContext();

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
        loadServiceReservationReport({ fromDate, toDate, memberId, timeUnit });
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
        {isAdmin ? (
          <Field
            className="p-4 border-r border-gray-100"
            style={{ width: 350 }}
            label="Cửa hàng"
            noError
          >
            <Select
              placeholder="Tất cả cửa hàng thuộc hệ thống"
              value={memberId}
              onChange={setMemberId}
              hasImage
              clearable={true}
              autocompletePromise={({ id, search }) =>
                MemberService.getAllAutocompletePromise(
                  { id, search },
                  {
                    fragment: "id shopName shopLogo",
                    parseOption: (data) => ({
                      value: data.id,
                      label: data.shopName,
                      image: data.shopLogo,
                    }),
                  }
                )
              }
            />
          </Field>
        ) : (
          <Field
            className="p-4 border-r border-gray-100"
            style={{ width: 350 }}
            label="Cửa hàng"
            noError
          >
            <Input readOnly value={member.shopName} />
          </Field>
        )}
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
      {serviceReservationReport ? (
        <div className="flex flex-col gap-6 animate-emerge">
          <Card className="self-start p-6">
            <ReportTitle text="Thống kê số lượng lịch hẹn" />
            <ReportWidget image="/assets/img/reserved.png">
              <div className="font-semibold text-primary">
                Tổng lịch hẹn đang đặt:{" "}
                <span className="text-xl font-bold">
                  {parseNumber(serviceReservationReport.summary.processing)}
                </span>
              </div>
              <div>
                Tổng lịch hẹn thành công:{" "}
                <span className="text-xl font-bold">
                  {parseNumber(serviceReservationReport.summary.completed)}
                </span>
              </div>
              <div>
                Tổng lịch hẹn thất bại:{" "}
                <span className="text-xl font-bold">
                  {parseNumber(serviceReservationReport.summary.canceled)}
                </span>
              </div>
            </ReportWidget>
          </Card>
          {!!serviceReservationReport.topShops?.length && isAdmin && (
            <Card className="self-start w-full max-w-3xl p-6">
              <ReportTitle text="Top 10 cửa hàng có lịch hẹn nhiều nhất" />
              <table className="simple-table">
                <thead>
                  <tr>
                    <th className="text-left">#</th>
                    <th className="text-left">Cửa hàng</th>
                    <th className="text-right">Lịch hẹn</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceReservationReport.topShops.map((shop, index) => (
                    <tr key={shop.id}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="flex items-center justify-start min-w-lg">
                          <Img rounded className="w-8 mr-1" src={shop.shopLogo} />
                          <div className="font-semibold">{shop.shopName}</div>
                        </div>
                      </td>
                      <td className="text-right">{parseNumber(shop.reservation)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}
          {!!serviceReservationReport.topRevenue?.length && isAdmin && (
            <Card className="self-start w-full max-w-3xl p-6">
              <ReportTitle text="Top 10 cửa hàng có doanh thu cao nhất" />
              <table className="simple-table">
                <thead>
                  <tr>
                    <th className="text-left">#</th>
                    <th className="text-left">Cửa hàng</th>
                    <th className="text-right">Doanh thu</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceReservationReport.topRevenue.map((shop, index) => (
                    <tr key={shop.id}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="flex items-center justify-start min-w-lg">
                          <Img rounded className="w-8 mr-1" src={shop.shopLogo} />
                          <div className="font-semibold">{shop.shopName}</div>
                        </div>
                      </td>
                      <td className="text-right">{parseNumber(shop.revenue, true)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}
          {!!serviceReservationReport.topProducts?.length && (
            <Card className="self-start w-full max-w-3xl p-6">
              <ReportTitle text="Top 10 sản phẩm bán chạy nhất" />
              <table className="simple-table">
                <thead>
                  <tr>
                    <th className="text-left">#</th>
                    <th className="text-left">Sản phẩm</th>
                    <th className="text-center">Số lượng</th>
                    <th className="text-right">Tổng tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceReservationReport.topProducts.map((product, index) => (
                    <tr key={product.id}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="flex items-center justify-start min-w-lg">
                          <div className="font-semibold">{product.name}</div>
                        </div>
                      </td>
                      <td className="text-center">{parseNumber(product.qty)}</td>
                      <td className="text-right">{parseNumber(product.amount, true)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}
          {serviceReservationReport.chart && (
            <Card>
              <ReportTitle text="Thống kê lịch hẹn" />
              <Bar
                data={{
                  datasets: [
                    {
                      order: 1,
                      data: [...serviceReservationReport.chart.datasets[0].data],
                      backgroundColor: color,
                      borderColor: color,
                      borderWidth: 2,
                      label: serviceReservationReport.chart.datasets[0].label,
                      type: "bar",
                      yAxisID: "A",
                    },
                    {
                      data: [...serviceReservationReport.chart.datasets[1].data],
                      backgroundColor: "transparent",
                      borderColor: accent,
                      borderWidth: 2,
                      label: serviceReservationReport.chart.datasets[1].label,
                      type: "line",
                      order: 0,
                      yAxisID: "B",
                    },
                  ],
                  labels: serviceReservationReport.chart.labels,
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
