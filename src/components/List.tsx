"use client";

import { connect } from "@/lib/Axios";
import { Flex, Pagination, Space, Table, TableColumnProps } from "antd";
import { AnyObject } from "antd/es/_util/type";
import { ColumnsType, TablePaginationConfig, TableProps } from "antd/es/table";
import { AxiosRequestConfig, HttpStatusCode } from "axios";
import { resolve } from "url";
import path from "path";
import {
  CSSProperties,
  ForwardedRef,
  PropsWithChildren,
  ReactNode,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

type Pagination = {
  current: number;
  pageSize: number;
};

type Ref = {
  reload: () => void;
};
type Props<T> = Readonly<{
  url: string;
  columnsDef: ColumnsType<T>;
}>;

function ListFC<T extends AnyObject & { id: string }>(
  props: Props<T>,
  ref: ForwardedRef<Ref>,
) {
  const [data, setData] = useState<T[]>([]);
  const [paginationA, setPaginationA] = useState<TablePaginationConfig>({
    showSizeChanger: true,
  });
  const fetch = useCallback(
    (
      limit: number = 300,
      paginationPostion?: {
        current: number;
        pageSize: number;
      },
    ) => {
      const config: AxiosRequestConfig = {
        params: { limit },
      };
      if (paginationPostion != null) {
        config.params = {
          ...config.params,
          ...paginationPostion,
        };
      }
      Promise.all([
        connect.get<T[]>(props.url, config),
        connect.get<number>(resolve(props.url + "/", "size")),
      ]).then((api) => {
        if (
          api.filter((i) => i.status == HttpStatusCode.Ok).length === api.length
        ) {
          const list = api[0].data.map((i) => i.id);
          const oldData = data.filter((i) => !list.includes(i.id));
          setData([...oldData, ...api[0].data]);
          setPaginationA({
            ...paginationA,
            total: api[1].data,
          });
        }
      });
    },
    [props.url],
  );
  useEffect(() => {
    fetch();
  }, [fetch]);
  useImperativeHandle(
    ref,
    () => ({
      reload: () => {
        fetch();
      },
    }),
    [fetch],
  );
  return (
    <div className="flex-grow overflow-hidden">
      <Flex vertical={true} className="h-full">
        <div className="flex-grow overflow-hidden">
          <Table<T>
            columns={props.columnsDef}
            dataSource={data}
            rowKey={"id"}
            pagination={false}
            sticky={true}
            components={{ table: TableBody }}
          />
        </div>
        <div className="">
          <Pagination className="w-full" />
        </div>
      </Flex>
    </div>
  );
}

function TableBody(
  props: Readonly<{ style: CSSProperties; children: ReactNode[] }>,
) {
  console.log(props);
  return (
    <table style={props.style}>
      {props.children[1]}
      {props.children[2]}
    </table>
  );
}

export default function List<T extends AnyObject & { id: string }>() {
  return forwardRef(ListFC<T>);
}

export { type Ref };
