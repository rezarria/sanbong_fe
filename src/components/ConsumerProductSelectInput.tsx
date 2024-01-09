import { Form, Select, SelectProps } from "antd"
import {
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react"
import { DefaultOptionType } from "antd/es/select"
import useConsumerProduct from "@/hooks/useConsumerProduct"
import { ConsumerProduct } from "@/store/useConsumerProductStore"

type Props = {
  value?: string
  onChange?(data: string, option: DefaultOptionType | DefaultOptionType[]): void
  onChange2?: (data?: ConsumerProduct) => void
}

export type ConsumerProductSelectInputProps = {
  findById(id: string): ConsumerProduct | undefined
}

export { type Props as AccountSelectInputProps }

const ConsumerProductSelectInput = forwardRef(_ConsumerProductSelectInput)

export default ConsumerProductSelectInput

function _ConsumerProductSelectInput(
  props: Readonly<Props>,
  ref: ForwardedRef<ConsumerProductSelectInputProps>,
) {
  const [options, setOptions] = useState<SelectProps["options"]>([])
  const consumerProductService = useConsumerProduct()
  const [data, setData] = useState<ConsumerProduct[]>([])
  useImperativeHandle(
    ref,
    () => ({
      findById(id) {
        return data.find((i) => i.id == id)
      },
    }),
    [data],
  )
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
    [consumerProductService],
  )
  return (
    <Select<string>
      showSearch
      value={props.value}
      onChange={(v, o) => {
        props.onChange?.(v, o)
        props.onChange2?.(data.find((i) => i.id == v))
      }}
      onSearch={handleSearch}
      filterOption={false}
      options={options}
    />
  )
}
