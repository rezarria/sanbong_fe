import { Select, SelectProps } from "antd"
import { useCallback, useEffect, useState } from "react"
import { DefaultOptionType } from "antd/es/select"
import useConnect from "@/store/useConnect"

type Props = {
  value?: string
  onChange?(data: string, option: DefaultOptionType | DefaultOptionType[]): void
}

export { type Props as UserSelectInputProps }

type UserType = { id: string; name: string }

export default function UserSelectInput(props: Readonly<Props>) {
  const [options, setOptions] = useState<SelectProps["options"]>([])
  const [data, setData] = useState<UserType[]>([])
  const connect = useConnect((s) => s.connect)
  const fetch = useCallback(
    async (name?: string) => {
      return (await connect.get<UserType[]>("api/user", { params: { name } }))
        .data
    },
    [connect],
  )
  useEffect(() => {
    fetch().then(setData)
  }, [fetch])
  useEffect(() => {
    setOptions(data.map((i) => ({ value: i.id, label: i.name })))
  }, [data])
  const handleSearch = useCallback(
    (query: string) => {
      fetch(query).then(setData)
    },
    [fetch],
  )
  return (
    <Select<string>
      showSearch
      value={props.value}
      onChange={props.onChange}
      onSearch={handleSearch}
      filterOption={false}
      options={options}
    />
  )
}
