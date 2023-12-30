"use client"

import EditableTable from "./edit-table"

interface ServiceProps {
  data?: string[][];
  setData?: (data: string[][]) => void;
}

export default function Service({ data, setData }: ServiceProps) {
  return (
    <div className="flex flex-col">
      <h2>能力态度（0.3）</h2>
      <EditableTable
        data={data}
        columns={['自评', '直接主管', '经理']}
        onDataChange={setData}
      />
    </div>
  )
}
