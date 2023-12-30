"use client"

import EditableTable from "./edit-table"

interface PerformanceProps {
  data?: string[][];
  setData?: (data: string[][]) => void;
  onRowsChange?: (rows: number) => void;
}

export default function Performance({ data, setData, onRowsChange }: PerformanceProps) {

  return (
    <div className="flex flex-col">
      <h2>绩效（0.7）</h2>
      <select title="行数" value={data?.length} onChange={(e) => {
        onRowsChange?.(Number(e.target.value));
      }}>
        {[5, 6, 7, 8, 9, 10].map((n) => (<option key={n} value={n}>{n}</option>))}
      </select>
      <EditableTable
        data={data}
        columns={['自评', '直接主管', '经理']}
        onDataChange={setData}
      />
    </div>
  )
}
