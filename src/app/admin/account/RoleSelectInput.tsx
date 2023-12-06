import { Select, SelectProps } from "antd"
import { useCallback, useEffect, useState } from "react"
import { connect } from "@/lib/Axios"
import { DefaultOptionType } from "antd/es/select"

type Props = {
  value?: string[]
  onChange?(
    data: string[],
    option: DefaultOptionType | DefaultOptionType[],
  ): void
}

export { type Props as RoleSelectInputProps }

type RoleType = { id: string; name: string; displayName: string }

async function fetch(name?: string) {
  return (await connect.get<RoleType[]>("api/role", { params: { name } })).data
}

export default function RoleSelectInput(props: Readonly<Props>) {
  const [options, setOptions] = useState<SelectProps["options"]>([])
  const [data, setData] = useState<RoleType[]>([])
  useEffect(() => {
    fetch().then(setData)
  }, [])
  useEffect(() => {
    setOptions(data.map((i) => ({ value: i.id, label: i.displayName })))
  }, [data])
  const handleSearch = useCallback((query: string) => {
    fetch(query).then(setData)
  }, [])
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
