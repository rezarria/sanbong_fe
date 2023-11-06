"use client";

import { Table } from "antd";
import { useState } from "react";

export default function List<T>(
  props: Readonly<{
    url: string;
  }>,
) {
  const [data, setData] = useState<T[]>([]);

  return (
    <>
      <Table />
    </>
  );
}
