import { Carousel, Image } from "antd"
import { connect } from "../../lib/Axios"

type Props = { value?: string[] }

export default function ImageViews(props: Readonly<Props>) {
  return (
    <Image.PreviewGroup>
      <Carousel
        draggable={false}
        autoplay
        className="rounded overflow-hidden"
        infinite={false}
      >
        {props.value?.map((url, index) => (
          <Image
            key={index}
            src={[connect.defaults.baseURL, url].join("")}
            alt={index.toString()}
          />
        ))}
      </Carousel>
    </Image.PreviewGroup>
  )
}
