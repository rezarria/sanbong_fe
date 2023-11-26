import { InputRef } from "antd";
import { ForwardedRef, useImperativeHandle } from "react";

export default function TestInput(ref: ForwardedRef<InputRef>) {
  useImperativeHandle(
    ref,
    () => ({
      select: () => {},
      input,
    }),
    [],
  );
  return <></>;
}
