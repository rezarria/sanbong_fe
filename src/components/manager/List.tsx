"use client"

import { Flex, Pagination, Table } from "antd"
import { AnyObject } from "antd/es/_util/type"
import { ColumnsType, TablePaginationConfig } from "antd/es/table"
import { AxiosRequestConfig, HttpStatusCode } from "axios"
import { resolve } from "url"
import {
  CSSProperties,
  ForwardedRef,
  ReactNode,
  RefObject,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import useConnect from "@/store/useConnect"

type Pagination = {
  current: number
  pageSize: number
}

type Ref = {
  reload: () => void
}
type Props<T> = Readonly<{
  url: string
  columnsDef: ColumnsType<T>
}>

function ListFC<T extends AnyObject & { id: string }>(
  props: Props<T>,
  ref: ForwardedRef<Ref>,
) {
  const connect = useConnect((s) => s.connect)
  const [data, setData] = useState<T[]>([])
  const [paginationA, setPaginationA] = useState<TablePaginationConfig>({
    showSizeChanger: true,
  })
  const fetch = useCallback(
    (
      paginationPostion: { current: number; pageSize: number } = {
        current: 0,
        pageSize: 20,
      },
    ) => {
      const config: AxiosRequestConfig = {
        params: {
          size: paginationPostion.pageSize,
          page: paginationPostion.current,
        },
      }
      if (paginationPostion != null) {
        config.params = {
          ...config.params,
        }
      }
      Promise.all([
        connect.get<{ content: T[] }>(props.url, config),
        connect.get<number>(resolve(props.url + "/", "size")),
      ]).then((resData) => {
        if (
          resData.filter((i) => i.status == HttpStatusCode.Ok).length ===
          resData.length
        ) {
          const list = resData[0].data.content.map((i) => i.id)
          const oldData = data.filter((i) => !list.includes(i.id))
          setData([...oldData, ...resData[0].data.content])
          setPaginationA({
            ...paginationA,
            total: resData[1].data,
          })
        }
      })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.url],
  )
  useEffect(() => {
    fetch()
  }, [fetch])
  useImperativeHandle(
    ref,
    () => ({
      reload: () => {
        fetch()
      },
    }),
    [fetch],
  )
  return (
    <div className="flex-grow overflow-hidden">
      <Flex vertical={true} className="h-full">
        {TableWrapper<T>(props, data)}
      </Flex>
    </div>
  )
}

function TableWrapper<T extends AnyObject & { id: string }>(
  props: Readonly<{ url: string; columnsDef: ColumnsType<T> }>,
  data: T[],
) {
  const divRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLTableSectionElement>(null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const headerComponent = useCallback(HeaderComponent(headerRef), [])
  const [loading, setLoading] = useState(true)
  const [height, setHeight] = useState(0)
  useLayoutEffect(() => {
    if (headerRef.current != null && divRef.current != null) {
      setLoading(false)
      setHeight(divRef.current.clientHeight - headerRef.current.clientHeight)
    }
  }, [])
  return (
    <div ref={divRef} className="flex-grow overflow-hidden">
      <Table<T>
        columns={props.columnsDef}
        dataSource={data}
        rowKey={"id"}
        pagination={false}
        sticky={true}
        scroll={{ y: height }}
        components={{
          header: {
            wrapper: headerComponent,
          },
        }}
      />
    </div>
  )
}

function HeaderComponent(ref: RefObject<HTMLTableSectionElement>) {
  return function HeaderComponentTemplate(props: {
    style: CSSProperties
    children: ReactNode[]
  }) {
    return (
      <thead className="ant-table-thead" ref={ref} style={props.style}>
        {props.children}
      </thead>
    )
  }
}

export default function List<T extends AnyObject & { id: string }>() {
  return forwardRef(ListFC<T>)
}

export { type Ref }
