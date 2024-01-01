import { Select, SelectProps } from "antd"
import { useCallback, useEffect, useState } from "react"
import { DefaultOptionType } from "antd/es/select"
import useConsumerProduct from "@/hooks/useConsumerProduct"
import { ConsumerProduct } from "@/store/useConsumerProductStore"

type Props = {
  value?: string
  onChange?(data: string, option: DefaultOptionType | DefaultOptionType[]): void
}

export { type Props as AccountSelectInputProps }

export default function ConsumerProductSelectInput(props: Readonly<Props>) {
  const [options, setOptions] = useState<SelectProps["options"]>([])
  const consumerProductService = useConsumerProduct()
  const [data, setData] = useState<ConsumerProduct[]>([])

  useEffect(() => {
    setData([...consumerProductService.data.values()])
  }, [consumerProductService.data])
  useEffect(() => {
    setOptions(data.map((i) => ({ value: i.id, label: i.name })))
  }, [data])
  const handleSearch = useCallback(
    (query: string) => {
      consumerProductService.search(query).then(setData)
    },
    [consumerProductService.search],
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
