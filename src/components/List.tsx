"use client";

import { connect } from "@/lib/Axios";
import { Space, Table } from "antd";
import { AnyObject } from "antd/es/_util/type";
import { ColumnsType } from "antd/es/table";
import { AxiosRequestConfig, HttpStatusCode } from "axios";
import {
  ForwardedRef,
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
  const fetch = useCallback(
    (
      limit: number = 300,
      pagination?: {
        current: number;
        pageSize: number;
      },
    ) => {
      const config: AxiosRequestConfig = {
        params: { limit },
      };
      if (pagination != null) {
        config.params = {
          ...config.params,
          ...pagination,
        };
      }
      connect.get<T[]>(props.url, config).then((res) => {
        if (res.status == HttpStatusCode.Ok) {
          const list = res.data.map((i) => i.id);
          const oldData = data.filter((i) => !list.includes(i.id));
          setData([...oldData, ...res.data]);
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
    <Space direction="vertical" className="flex">
      <Table<T>
        columns={props.columnsDef}
        pagination={{
          total: 500,
          showQuickJumper: {},
        }}
        dataSource={data}
        rowKey={"id"}
      />
    </Space>
  );
}

export default function List<T extends AnyObject & { id: string }>() {
  return forwardRef(ListFC<T>);
}

export { type Ref };
