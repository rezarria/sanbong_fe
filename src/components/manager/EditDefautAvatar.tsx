"use client";

import { UserOutlined } from "@ant-design/icons";
import { useLayoutEffect, useRef } from "react";

export default function EditDefaultAvatar() {
  const divRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);
  useLayoutEffect(() => {
    if (divRef.current && iconRef.current) {
      iconRef.current.style.height = divRef.current.clientHeight + "px";
      iconRef.current.style.width = divRef.current.clientWidth + "px";
    }
  }, []);
  return (
    <div ref={divRef} className="w-full h-full">
      <UserOutlined ref={iconRef} />
    </div>
  );
}
