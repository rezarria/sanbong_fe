import { Carousel, Image } from "antd"
import config from "@/config/Config"

type Props = { value?: string[] }

export default function ImageViews(props: Readonly<Props>) {
  return (
    <div className="w-full relative h-[200px]">
      <div className="absolute w-full h-full">
        <Image.PreviewGroup>
          <Carousel
            draggable={false}
            autoplay
            className="rounded overflow-hidden"
            infinite={true}
            adaptiveHeight={true}
          >
            {props.value?.map((url, index) => (
              <Image
                key={index}
                width={"100%"}
                height={200}
                className="object-contain"
                src={[url.startsWith("http") ? "" : config.baseUrl, url].join(
                  "",
                )}
                alt={index.toString()}
              />
            ))}
          </Carousel>
        </Image.PreviewGroup>
      </div>
    </div>
  )
}
