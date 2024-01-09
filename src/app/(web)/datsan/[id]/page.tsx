"use client"

import { useCallback, useEffect, useState } from "react"
import Container from "@/web/components/Container"
import axios, { HttpStatusCode } from "axios"
import config from "@/config/Config"
import OrderForm from "@/web/components/OrderForm"

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
    <Container className="bg-white text-black">
      <OrderForm fieldId={props.params.id} />
    </Container>
  )
}
