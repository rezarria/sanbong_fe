"use client";

import { Space, Table } from "antd";
import { connect } from "@/lib/Axios";
import { useEffect, useState } from "react";
import Account from "./model";
import Add from "./Add";

const columns = [
  { title: "id", dataIndex: "id", key: "id" },
  { title: "username", dataIndex: "username", key: "username" },
];

export default function Page() {
  const [params, setParams] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const [account, setAccount] = useState<Account[]>([]);

  const fetch = () => {
    connect
      .get<Account[]>("/api/account", {
        params: {
          ...params.pagination,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          setAccount([...account, ...res.data]);
        }
      });
  };

  useEffect(() => {
    // fetch;
  }, []);
  return (
    <Space direction="vertical" style={{ display: "flex" }}>
      <Add />
      <Table columns={columns} />
    </Space>
  );
}
