import Link from "next/link"

export default function HeaderETC() {
  return (
    <ul className="text-right list-none flex flex-row justify-end gap-[5px]">
      <li>
        <Link href={"#"}>Đăng nhập</Link>
      </li>
      <li className="w-[2px] bg-white" />
      <li>
        <Link href={"#"}>Đăng ký</Link>
      </li>
    </ul>
  )
}
