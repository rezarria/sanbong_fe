"use client"

import useConnect from "@/store/useConnect"
import {
  ForwardedRef,
  ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react"
import { Table as AntDTable, TableProps as AntDTableProps } from "antd"

type TableProps<T> = {
  url: string
  columns: AntDTableProps<T>["columns"]
  buttonColRender?(value: any, record: T, index: number): ReactNode
}

export type TableRef = {
  update(): void
}

type Pagination = {
  currentPage: number
  totalPage?: number
  pageSize: number
}

export default function Table<T extends {}>() {
  return forwardRef(_Table<T>)
}

function _Table<T extends {}>(
  props: Readonly<TableProps<T>>,
  ref: ForwardedRef<TableRef>,
) {
  const [data, setData] = useState<T[]>([])
  const [page, setPage] = useState<Pagination>({
    currentPage: 0,
    pageSize: 10,
  })
  const [fetch] = useFetchData<T>(props.url)
  useEffect(() => {
    fetch(page.currentPage, page.pageSize).then((response) => {
      setData(response.data.content)
      setPage((p) => ({
        pageSize: response.data.pageable.pageSize,
        totalPage: response.data.totalPages,
        currentPage: response.data.number,
      }))
    })
  }, [fetch, page.currentPage, page.pageSize])
  useImperativeHandle(
    ref,
    () => ({
      update: () => {
        fetch(0, page.pageSize).then((data) => {
          setData(data.data.content)
          setPage((o) => ({
            pageSize: data.data.pageable.pageSize,
            currentPage: data.data.number,
            totalPage: data.data.totalPages,
          }))
        })
      },
    }),
    [fetch, page.pageSize],
  )
  return (
    <AntDTable<T>
      pagination={{
        current: page.currentPage + 1,
        pageSize: page.pageSize,
        total: page.pageSize * (page.totalPage ?? 0),
        onChange(page, pageSize) {
          fetch(page - 1, pageSize).then((data) => {
            setPage({
              pageSize: data.data.pageable.pageSize,
              currentPage: data.data.number,
              totalPage: data.data.totalPages,
            })
          })
        },
        showSizeChanger: true,
        showPrevNextJumpers: true,
      }}
      columns={[
        {
          dataIndex: "",
          title: "No",
          width: "30px",
          render(value, record, index) {
            return <>{index + page.currentPage * page.pageSize + 1}</>
          },
        },
        ...(props.columns ?? []),
        {
          dataIndex: "id",
          rowScope: "row",
          width: "100px",
          render: props.buttonColRender,
        },
      ]}
      dataSource={data}
    />
  )
}

function useFetchData<T extends {}>(url: string) {
  const connect = useConnect((s) => s.connect)
  const fetch = useCallback(
    (page: number, pageSize: number) =>
      connect.get<{
        totalPages: number
        pageable: {
          pageSize: number
        }
        number: number
        content: T[]
      }>(url, {
        params: {
          page,
          size: pageSize,
        },
      }),
    [connect, url],
  )
  return [fetch]
}
