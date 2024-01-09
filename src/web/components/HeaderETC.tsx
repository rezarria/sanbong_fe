"use client"

import Link from "next/link"
import useUser from "@/store/web/useUser"
import DropDown from "./DropDown"

export default function HeaderETC() {
  const [name] = useUser((s) => [s.name])
  return (
    <ul className="text-right list-none flex flex-row justify-end gap-[5px]">
      {name ? (
        <DropDown name={name} />
      ) : (
        <>
          <li>
            <Link href={"/user/login"}>Đăng nhập</Link>
          </li>
          <li className="w-[2px] bg-white" />
          <li>
            <Link href={"/user/login?dangky=true"}>Đăng ký</Link>
          </li>
        </>
      )}
    </ul>
  )
}
