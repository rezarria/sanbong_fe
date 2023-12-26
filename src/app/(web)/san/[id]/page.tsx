"use client"

import { useCallback, useEffect, useState } from "react"
import Container from "@/web/components/Container"
import axios, { HttpStatusCode } from "axios"
import config from "@/config/Config"
import Image from "next/image"
import Link from "next/link"
import { Scheduler } from "@aldabil/react-scheduler"
import { DayHours } from "@aldabil/react-scheduler/types"
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
  pictures: string[]
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
    <Container className="bg-white text-black">
      <div className="columns-2">
        <div>
          <div>
            {data && (
              <ReactImageGallery
                items={data.pictures.map(
                  (i) =>
                    ({
                      original: i,
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
        <div className="flex-grow max-h-[400px]">
          <Lich fieldId={props.params.id} />
        </div>
        <div className="basis-1/2 box-border part2">
          <h2>Mô tả</h2>
          <p className="m-0 break-all text-clip">{data?.description}</p>
        </div>
      </div>
    </Container>
  )
}
