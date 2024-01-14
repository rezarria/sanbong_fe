import Image from "next/image"
import Link from "next/link"
import config from "@/config/Config"

type Props = {
  fieldId: string
  name: string
  price: number
  description: string
  picture?: string
  organization?: { id?: string; name?: string }
}
export default function FieldItem(props: Readonly<Props>) {
  return (
    <div className="text-black flex flex-row gap-[15px]">
      <div className="rounded overflow-hidden w-[300px] h-[200px]">
        <Image
          className="!relative"
          src={
            props.picture?.startsWith("http")
              ? props.picture
              : [config.baseUrl, props.picture].join("") ?? "/field.svg"
          }
          alt="field image"
          fill
        />
      </div>
      <div className="flex flex-col">
        <div className="flex-grow flex flex-col">
          <h2 className="m-0">{props.name}</h2>
          {props.organization && (
            <p className="m-0">
              Địa điểm{" "}
              <Link href={"/organization/" + props.organization.id}>
                <span className="font-bold m-0">{props.organization.name}</span>
              </Link>
            </p>
          )}
          <p className="m-0">Giá {props.price}</p>
          <div
            className="m-0 flex-grow"
            dangerouslySetInnerHTML={{ __html: props.description }}
          ></div>
        </div>
        <div className="flex flex-row gap-[5px]">
          <Link
            className="rounded overflow-hidden bg-blue-300 p-3 no-underline"
            href={"/san/" + props.fieldId}
          >
            Xem chi tiết
          </Link>
          <Link
            className="rounded overflow-hidden bg-yellow-300 p-3 no-underline"
            href={"/datsan/" + props.fieldId}
          >
            Đặt sân ngay
          </Link>
          <button className="rounded overflow-hidden bg-yellow-300 p-3 no-underline border-none font-semibold cursor-pointer">
            Xem lịch
          </button>
        </div>
      </div>
    </div>
  )
}
