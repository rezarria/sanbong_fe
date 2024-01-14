"use client"

import axios, { HttpStatusCode } from "axios"
import { useCallback, useEffect, useState } from "react"
import config from "@/config/Config"
import FieldItem from "./FieldItem"
import { Pagination } from "@mui/material"

type Field = {
  images: string[]
  price: number
  prices: number[]
  name: string
  id: string
  description: string
  organization: string
}

type ResponeType = {
  content: Field[]
  number: number
  totalPages: number
  size: number
}

type Props = {
  search?: string
}

export default function FieldSection(props: Readonly<Props>) {
  const [data, setData] = useState<Field[]>([])
  const [organization, setOrganization] = useState<Map<string, string>>()
  const fetch = useCallback(async () => {
    const res = await axios.get<ResponeType>(
      [config.baseUrl, "public/api/field"].join("/"),
      {
        params: {
          size: 20,
          page: 0,
          search: props.search,
        },
      },
    )
    if (res.status == HttpStatusCode.Ok) {
      setData(res.data.content)
      return res.data.content
    }
  }, [props.search])
  const fetchOrganization = useCallback(async (ids: string[]) => {
    const res = await axios.post<{ id: string; name: string }[]>(
      [config.baseUrl, "public/api/organization/ids"].join("/"),
      ids,
    )
    if (res.status == HttpStatusCode.Ok) {
      setOrganization(new Map(res.data.map((i) => [i.id, i.name])))
    }
  }, [])
  useEffect(() => {
    fetch().then((r) => {
      if (r != null) {
        fetchOrganization(r.map((i) => i.organization))
      }
    })
  }, [fetch, fetchOrganization])
  return (
    <section className="py-3 flex flex-col gap-[15px] bg-yellow-50 px-5">
      {data.map((i, index) => (
        <FieldItem
          key={index}
          fieldId={i.id}
          name={i.name}
          price={i.price}
          picture={i.images.length != 0 ? i.images[0] : undefined}
          description={i.description}
          organization={
            i.organization
              ? { id: i.organization, name: organization?.get(i.organization) }
              : undefined
          }
        />
      ))}
      <Pagination count={10} onChange={(e, page) => {}} />
    </section>
  )
}
