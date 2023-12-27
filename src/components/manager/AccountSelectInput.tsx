import { Select, SelectProps } from "antd"
import { useCallback, useEffect, useState } from "react"
import { DefaultOptionType } from "antd/es/select"
import useConnect from "@/store/useConnect"

type Props = {
  value?: string
  onChange?(data: string, option: DefaultOptionType | DefaultOptionType[]): void
}

export { type Props as AccountSelectInputProps }

type AccountType = { id: string; username: string }

export default function AccountSelectInput(props: Readonly<Props>) {
  const [options, setOptions] = useState<SelectProps["options"]>([])
  const [data, setData] = useState<AccountType[]>([])
  const connect = useConnect((s) => s.connect)
  const fetch = useCallback(
    async (name?: string) => {
      return (
        await connect.get<AccountType[]>("api/account", {
          params: { name, skipUser: true },
        })
      ).data
    },
    [connect],
  )
  useEffect(() => {
    fetch().then(setData)
  }, [fetch])
  useEffect(() => {
    setOptions(data.map((i) => ({ value: i.id, label: i.username })))
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
