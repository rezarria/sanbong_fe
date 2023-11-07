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

type Ref = {};
type Props<T> = Readonly<{
  url: string;
  columnsDef: ColumnsType<T>;
}>;

function List<T extends AnyObject & { id: string }>(
  props: Props<T>,
  ref: ForwardedRef<Ref>,
) {
  const [data, setData] = useState<T[]>([]);
  useImperativeHandle(ref, () => ({}), []);
  const fetch = useCallback(
    (
      url: string,
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
      connect.get<T[]>(url, config).then((res) => {
        if (res.status == HttpStatusCode.Ok) {
          const list = res.data.map((i) => i.id);
          const oldData = data.filter((i) => !list.includes(i.id));
          setData([...oldData, ...res.data]);
        }
      });
    },
    [data],
  );
  useEffect(() => {
    fetch(props.url);
  }, [fetch, props.url]);
  return (
    <Space direction="vertical" className="flex">
      <Table
        columns={props.columnsDef}
        pagination={{
          total: 500,
          showQuickJumper: {},
        }}
      />
    </Space>
  );
}

export default function _List<T extends AnyObject & { id: string }>(
  props: Props<T>,
) {
  const Ty = forwardRef(List<T>);
  return <Ty {...props} />;
}
