"use client"

import Container from "@/web/components/Container"
import useConnect from "@/store/useConnect"
import { useEffect, useState } from "react"
import ReactImageGallery, { ReactImageGalleryItem } from "react-image-gallery"
import "react-image-gallery/styles/css/image-gallery.css"
import { useRouter } from "next/navigation"

type DataType = {
  id: string
  name: string
  fields: {
    id: string
    name: string
    description: string
    images: string[]
  }[]
}

function useOrganizationFetch(id: string) {
  const connect = useConnect((s) => s.connect)
  const [data, setData] = useState<DataType>()
  useEffect(() => {
    connect
      .get<DataType>("/public/api/organization/detail", {
        params: {
          id,
        },
      })
      .then((res) => setData(res.data))
  }, [connect, id])
  return data
}

type Props = {
  params: {
    id: string
  }
}

export default function Page(props: Readonly<Props>) {
  const data = useOrganizationFetch(props.params.id)
  const router = useRouter()
  return (
    <Container className="bg-white text-black pt-5">
      <h1>{data?.name}</h1>
      <div className="flex flex-col gap-2">
        {data?.fields.map((field, index) => (
          <div key={index} className="bg-slate-200 p-4 rounded">
            <h2>{field.name}</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="max-w-[100%]">
                {field.images && field.images.length != 0 && (
                  <ReactImageGallery
                    showFullscreenButton={false}
                    showBullets={false}
                    showPlayButton={false}
                    showNav={false}
                    autoPlay={true}
                    slideDuration={2}
                    items={field.images.map(
                      (i) =>
                        ({
                          original: i.startsWith("http")
                            ? i
                            : "http://localhost:8080" + i,
                        }) as ReactImageGalleryItem,
                    )}
                  />
                )}
              </div>
              <div className="col-span-2 flex flex-col justify-between">
                <div dangerouslySetInnerHTML={{ __html: field.description }} />
                <div>
                  <button
                    className="rounded p-2 bg-green-600 outline-none border-0 cursor-pointer"
                    onClick={() => {
                      router.push("/san/" + field.id)
                    }}
                  >
                    <p className="m-0 text-white font-bold">Xem chi tiết</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Container>
  )
}
