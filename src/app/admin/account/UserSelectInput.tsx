import { Select, SelectProps } from "antd"
import { useCallback, useEffect, useState } from "react"
import { connect } from "@/lib/Axios"
import { DefaultOptionType } from "antd/es/select"

type Props = {
  value?: string;
  onChange?(
    data: string,
    option: DefaultOptionType | DefaultOptionType[],
  ): void;
};

export { type Props as UserSelectInputProps }

type UserType = { id: string; name: string };

async function fetch(name?: string) {
  return (await connect.get<UserType[]>("api/user", { params: { name } })).data
}

export default function UserSelectInput(props: Readonly<Props>) {
  const [options, setOptions] = useState<SelectProps["options"]>([])
  const [data, setData] = useState<UserType[]>([])
  useEffect(() => {
    fetch().then(setData)
  }, [])
  useEffect(() => {
    setOptions(data.map((i) => ({ value: i.id, label: i.name })))
  }, [data])
  const handleSearch = useCallback((query: string) => {
    fetch(query).then(setData)
  }, [])
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
