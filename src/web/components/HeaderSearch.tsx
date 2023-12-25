import Image from "next/image"

export default function HeaderSearch() {
  return (
    <div className="flex flex-row items-center">
      <div className="rounded overflow-hidden border border-solid border-black flex-grow flex flex-row">
        <input
          placeholder="tìm sân bóng"
          title="search"
          className="flex-grow leading-normal px-2 m-0 text-[15px] h-[25px] outline-none box-border border-none"
        />
        <button
          title="search"
          className=" p-0 m-0 h-[25px] px-1 bg-transparent cursor-pointer border-none"
        >
          <div className="aspect-square w-[15px] flex justify-center items-center ">
            <Image
              fill
              src={"/search.svg"}
              className="!relative object-contain"
              alt="search icon"
            />
          </div>
        </button>
      </div>
    </div>
  )
}
