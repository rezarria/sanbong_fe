"use client";

import { connect } from "@/lib/Axios";
import { Table } from "antd";
import { AnyObject } from "antd/es/_util/type";
import { ColumnsType } from "antd/es/table";
import { HttpStatusCode } from "axios";
import { useCallback, useEffect, useState } from "react";

export default function List<T extends AnyObject>(
  props: Readonly<{
    url: string;
    columnsDef: ColumnsType<T>;
  }>,
) {
  const [data, setData] = useState<T[]>([]);
  const fetch = useCallback(
    (url: string) => {
      connect.get<T[]>(url).then((res) => {
        if (res.status == HttpStatusCode.Ok) {
          setData([...data, ...res.data]);
        }
      });
    },
    [data],
  );
  useEffect(() => {
    fetch(props.url);
  }, [fetch, props.url]);
  return (
    <>
      <Table columns={props.columnsDef} />
    </>
  );
}
