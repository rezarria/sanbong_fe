"use client"

import axios, { HttpStatusCode } from "axios"
import { useCallback, useEffect, useState } from "react"
import config from "../../config/Config"
import FieldItem from "./FieldItem"

type Field = {
  pictures: string[]
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

export default function FieldSection() {
  const [data, setData] = useState<Field[]>([])
  const [organization, setOrganization] = useState<Map<string, string>>()
  const fetch = useCallback(async () => {
    const res = await axios.get<ResponeType>(
      [config.baseUrl, "public/api/field"].join("/"),
      {
        params: {
          size: 20,
          page: 0,
        },
      },
    )
    if (res.status == HttpStatusCode.Ok) {
      setData(res.data.content)
      return res.data.content
    }
  }, [])
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
    <section className="py-3 flex flex-col gap-[15px]">
      {data.map((i, index) => (
        <FieldItem
          key={index}
          fieldId={i.id}
          name={i.name}
          price={i.price}
          picture={i.pictures.length != 0 ? i.pictures[0] : undefined}
          description={i.description}
          organization={
            i.organization
              ? { id: i.organization, name: organization?.get(i.organization) }
              : undefined
          }
        />
      ))}
    </section>
  )
}
