import { useState } from "react";
import { DatePicker } from "../../shared/utilities/form";
import { Card } from "../../shared/utilities/misc";

export function ExpertOverviewPage() {
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  return (
    <Card>
      <div className="font-extrabold uppercase text-accent">Tổng quan</div>
      <div className="flex flex-row mt-6 mb-8 gap-x-6">
        <DatePicker
          value={fromDate}
          onChange={setFromDate}
          placeholder="Từ ngày"
          className="h-14"
        />
        <DatePicker value={toDate} onChange={setToDate} placeholder="Đến ngày" className="h-14" />
      </div>
      <div className="flex flex-row flex-wrap gap-x-2">
        {MOCK_DATA.map((item, index) => (
          <ExpertOverviewItem total={item.total} type={item.type} key={index}/>
        ))}
      </div>
    </Card>
  );
}

export function ExpertOverviewItem({ total, type, ...props }: { total: number; type: string }) {
  return (
    <div className="p-12 border border-neutralGrey">
      <div className="text-4xl font-extrabold text-primary">{total}</div>
      <div className="font-normal">{type}</div>
    </div>
  );
}

const MOCK_DATA = [
  {
    type: "Câu hỏi",
    total: 4120,
  },
  {
    type: "Bình luận",
    total: 212,
  },
  {
    type: "Lượt thích",
    total: 6579,
  },
];
