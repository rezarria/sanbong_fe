"use client"

import { useCallback, useEffect, useState } from "react"
import Container from "@/web/components/Container"
import axios, { HttpStatusCode } from "axios"
import config from "@/config/Config"
import Link from "next/link"
import Lich from "@/web/components/Lich"
import ReactImageGallery, { ReactImageGalleryItem } from "react-image-gallery"
import "react-image-gallery/styles/css/image-gallery.css"

type Props = {
  params: { id: string }
}

type Data = {
  id: string
  name: string
  organization: string
  images: string[]
  price: string[]
  description: string
}

export default function Page(props: Readonly<Props>) {
  const [data, setData] = useState<Data>()
  const [organization, setOrganization] = useState<{ name: string }>()
  const fetch = useCallback(async (id: string) => {
    const res = await axios.get<Data>(
      [config.baseUrl, "public/api/field"].join("/"),
      {
        params: { id },
      },
    )
    if (res.status == HttpStatusCode.Ok) {
      setData(res.data)
      if (res.data.organization != null) {
        axios
          .get([config.baseUrl, "public/api/organization"].join("/"), {
            params: {
              id: res.data.organization,
            },
          })
          .then((r) => {
            if (r.status == HttpStatusCode.Ok) {
              setOrganization(r.data)
            }
          })
      }
    }
  }, [])
  useEffect(() => {
    fetch(props.params.id)
  }, [fetch, props.params.id])
  return (
    <Container className="bg-white text-black pt-5">
      <div className="columns-2">
        <div>
          <div>
            {data && (
              <ReactImageGallery
                items={data.images.map(
                  (i) =>
                    ({
                      original: i.startsWith("http")
                        ? i
                        : "http://localhost:8080" + i,
                      originalHeight: 300,
                    }) as ReactImageGalleryItem,
                )}
              />
            )}
          </div>
        </div>
        <div className="flex flex-col">
          <h2>{data?.name}</h2>
          <div>
            <p>
              Giá <span>{data?.price}</span> vnd
            </p>
            {data && data.description && (
              <div dangerouslySetInnerHTML={{ __html: data.description }} />
            )}
          </div>
          <Link
            className="no-underline"
            href={"/organization/" + data?.organization}
          >
            <p>{organization?.name}</p>
          </Link>
        </div>
      </div>
      <div className="flex flex-row w-full">
        <div className="flex-grow max-h-[600px]">
          <Lich fieldId={props.params.id} />
        </div>
        <div className="basis-1/2 box-border part2">
          <h2>Mô tả</h2>
          <div className="m-0 break-all text-clip">
            {data && (
              <div dangerouslySetInnerHTML={{ __html: data.description }} />
            )}
          </div>
        </div>
      </div>
    </Container>
  )
}
