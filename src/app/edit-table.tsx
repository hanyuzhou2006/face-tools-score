"use client"

import { useState } from 'react';

interface EditableTableProps {
  defaultData?: string[][];
  data?: string[][];
  columns: string[];
  onDataChange?: (data: string[][]) => void;
}

type OnDateChange = (data: string[][]) => void;
type OnCellChange = (rowIndex: number, columnIndex: number, value: string) => void;

const useData = (data?: string[][], defaultData?: string[][], onDataChange?: OnDateChange): [string[][], OnCellChange] => {
  const [tableData, setTableData] = useState<string[][]>(defaultData ?? []);
  if (data) {
    const handleCellChange = (rowIndex: number, columnIndex: number, value: string) => {
      const updatedData = [...data];
      updatedData[rowIndex][columnIndex] = value;
      onDataChange?.(updatedData);
    };
    return [data, handleCellChange];
  }

  const handleCellChange = (rowIndex: number, columnIndex: number, value: string) => {
    const updatedData = [...tableData];
    updatedData[rowIndex][columnIndex] = value;
    setTableData(updatedData);
  };
  return [tableData, handleCellChange];

};

const EditableTable: React.FC<EditableTableProps> = ({ data, defaultData, columns, onDataChange }) => {
  const [tableData, handleCellChange] = useData(data, defaultData, onDataChange);
  return (
    <table>
      <thead>
        <tr>
          {columns.map((column, columnIndex) => (
            <th key={columnIndex}>{column}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tableData.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell: number | string, columnIndex: number) => (
              <td key={columnIndex}>
                <input
                  className=''
                  title='cell'
                  type="number"
                  value={cell}
                  min={0}
                  max={100}
                  onChange={(e) => handleCellChange(rowIndex, columnIndex, e.target.value)}
                  tabIndex={columnIndex === 2 ? -1 : undefined}
                  readOnly={columnIndex === 2}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default EditableTable;
