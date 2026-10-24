import type { ReactNode } from "react";

export type TableColumn<T> = {
  key: keyof T | string;
  label: string;
  render?: (row: T) => ReactNode;
};

export type TableProps<T> = {
  columns: TableColumn<T>[];
  rows: T[];
  emptyMessage?: string;
};

export function Table<T>({ columns, rows, emptyMessage = "No data available." }: TableProps<T>) {
  if (!rows.length) {
    return <div className="ui-table-empty">{emptyMessage}</div>;
  }

  return (
    <div className="ui-table-wrapper">
      <table className="ui-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={String(column.key)}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column) => (
                <td key={`${rowIndex}-${String(column.key)}`}>
                  {column.render ? column.render(row) : String((row as Record<string, unknown>)[String(column.key)] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
