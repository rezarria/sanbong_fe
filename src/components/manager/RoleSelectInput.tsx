import { Select, SelectProps } from "antd"
import { useCallback, useEffect, useState } from "react"
import { DefaultOptionType } from "antd/es/select"
import useConnect from "@/store/useConnect"

type Props = {
  value?: string[]
  onChange?(
    data: string[],
    option: DefaultOptionType | DefaultOptionType[],
  ): void
}

export { type Props as RoleSelectInputProps }

type RoleType = { id: string; name: string; displayName: string }

export default function RoleSelectInput(props: Readonly<Props>) {
  const [options, setOptions] = useState<SelectProps["options"]>([])
  const [data, setData] = useState<RoleType[]>([])
  const connect = useConnect((s) => s.connect)
  const fetch = useCallback(
    async (name?: string) => {
      return (await connect.get<RoleType[]>("api/role", { params: { name } }))
        .data
    },
    [connect],
  )
  useEffect(() => {
    fetch().then(setData)
  }, [fetch])
  useEffect(() => {
    setOptions(data.map((i) => ({ value: i.id, label: i.displayName })))
  }, [data])
  const handleSearch = useCallback(
    (query: string) => {
      fetch(query).then(setData)
    },
    [fetch],
  )
  return (
    <Select<string[]>
      showSearch
      value={props.value}
      onChange={props.onChange}
      onSearch={handleSearch}
      filterOption={false}
      options={options}
      mode="multiple"
    />
  )
}
