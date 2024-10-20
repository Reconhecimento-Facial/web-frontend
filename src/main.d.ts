/* eslint-disable @typescript-eslint/no-unused-vars */
import '@tanstack/react-table'
import { TdHTMLAttributes } from 'react'

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    style: {
      align?: TdHTMLAttributes<HTMLTableCellElement>['align']
    }
  }
}
