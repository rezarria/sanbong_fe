import { Carousel, Image } from "antd"
import config from "@/config/Config"

type Props = {
  src: string[]
  className?: string
}

export default function ImageList(props: Readonly<Props>) {
  return (
    <div className="w-ful h-[200px] relative">
      <div className="w-full h-ful absolute top-0 left-0">
        <Image.PreviewGroup>
          <Carousel draggable infinite={false} autoplay>
            {props.src.map((i, index) => {
              let src = ""
              if (i.startsWith("http")) src = i
              else src = [config.baseUrl, i].join("")
              return (
                <div key={index}>
                  <div className="flex flex-row justify-center items-center rounded overflow-hidden">
                    <Image
                      className="select-none"
                      style={{
                        objectFit: "cover",
                      }}
                      height={200}
                      src={src}
                      alt="image"
                    />
                  </div>
                </div>
              )
            })}
          </Carousel>
        </Image.PreviewGroup>
      </div>
    </div>
  )
}
