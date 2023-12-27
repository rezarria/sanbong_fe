import { Button, Divider, Input, Select, SelectProps, Space } from "antd"
import { useCallback, useEffect, useState } from "react"
import { DefaultOptionType } from "antd/es/select"
import useConnect from "@/store/useConnect"
import { PlusOutlined } from "@ant-design/icons"

type Props = {
  value?: string
  onChange?(data: string, option: DefaultOptionType | DefaultOptionType[]): void
}

export { type Props as UserSelectInputProps }

type UserType = { id: string; name: string }

export default function CustomerSelectInput(props: Readonly<Props>) {
  const [options, setOptions] = useState<SelectProps["options"]>([])
  const [data, setData] = useState<UserType[]>([])
  const connect = useConnect((s) => s.connect)
  const fetch = useCallback(
    async (name?: string) => {
      return (
        await connect.get<UserType[]>("api/customer", { params: { name } })
      ).data
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
      dropdownRender={(menu) => (
        <>
          {menu}
          <CreateNewCustomer
            onDone={(d) => {
              setOptions((o) => {
                const n = { label: d.name, value: d.id }
                return o ? [...o, n] : [n]
              })
            }}
          />
        </>
      )}
    />
  )
}

function CreateNewCustomer(
  props: Readonly<{ onDone?: (data: UserType) => void }>,
) {
  const [name, setName] = useState<string>()
  const connect = useConnect((s) => s.connect)
  const add = useCallback(
    (n: string) => {
      connect
        .post<UserType>("api/customer/fastAdd", { name: n })
        .then((data) => {
          setName(undefined)
          props.onDone?.(data.data)
        })
    },
    [connect, props],
  )
  return (
    <>
      <Divider style={{ margin: "8px 0" }} />
      <Space style={{ padding: "0 8px 4px" }}>
        <Input
          placeholder="Thêm khách hàng mới"
          onKeyDown={(e) => e.stopPropagation()}
          value={name}
          onChange={(e) => {
            setName(e.target.value)
          }}
        />
        <Button
          type="text"
          onClick={() => {
            if (name) add(name)
          }}
          icon={<PlusOutlined />}
        >
          Thêm
        </Button>
      </Space>
    </>
  )
}
