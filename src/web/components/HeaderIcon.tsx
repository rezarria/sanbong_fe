import Image from "next/image"

export default function HeaderIcon() {
  return (
    <div className="h-[40px] w-[40px] self-center">
      <Image
        className="h-full w-full !relative"
        src={"/vercel.svg"}
        alt="icon"
        fill
      />
    </div>
  )
}
