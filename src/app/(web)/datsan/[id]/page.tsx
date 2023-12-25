"use client"

import { useCallback, useEffect, useState } from "react"
import Container from "../../../../web/components/Container"
import axios, { HttpStatusCode } from "axios"
import config from "../../../../config/Config"
import Image from "next/image"
import Link from "next/link"

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
  }, [props.params.id])
  return (
    <Container className="bg-white text-black">
      <div className="columns-2">
        <div>
          <div>
            <Image
              className="!relative"
              src={data?.pictures[0] ?? "/field.svg"}
              fill
              alt="field image"
            />
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
        <div className="flex-grow p-3 bg-red-300"></div>
        <div className="basis-1/2 box-border part2">
          <p className="m-0 break-all text-clip">
            abcdsfsfsfsfsfsfsfsfsfsdfasfasdffsfsfsfsfsfsffsfsfsfsfsfsffsfsfsfsfsfsffsfsfsfsfsfsffsfsfsfsfsfsffsfsfsfsfsfsffsfsfsfsfsfsffsfsfsfsfsfsffsfsfsfsfsfsf
          </p>
        </div>
      </div>
    </Container>
  )
}
