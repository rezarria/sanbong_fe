import React, {
  ForwardedRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react"
import debounce from "lodash/debounce"
import { Select, Spin } from "antd"
import type { SelectProps } from "antd/es/select"
import useConnect from "@/store/useConnect"

export interface DebounceSelectProps<ValueType = any>
  extends Omit<SelectProps<ValueType>, "options" | "children"> {
  fetchOptions: (search: string) => Promise<ValueType[]>
  debounceTimeout?: number
}

function DebounceSelect<
  ValueType extends {
    key?: string
    label: React.ReactNode
    value: string | number
  } = any,
>({
  fetchOptions,
  debounceTimeout = 800,
  ...props
}: Readonly<DebounceSelectProps<ValueType>>) {
  const [fetching, setFetching] = useState(false)
  const [options, setOptions] = useState<ValueType[]>([])
  const fetchRef = useRef(0)

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value: string) => {
      fetchRef.current += 1
      const fetchId = fetchRef.current
      setOptions([])
      setFetching(true)

      fetchOptions(value).then((newOptions) => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return
        }

        setOptions(newOptions)
        setFetching(false)
      })
    }

    return debounce(loadOptions, debounceTimeout)
  }, [fetchOptions, debounceTimeout])
  useEffect(() => {
    fetchOptions("").then(setOptions)
  }, [fetchOptions])
  return (
    <Select
      disabled={props.disabled}
      labelInValue
      filterOption={true}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      options={options}
    />
  )
}

type Field = { id: string; name: string; price: number; priceId: string }

interface FieldValue {
  label: string
  value: string
}

type Props = {
  value?: string
  onChange?: (value?: string) => void
  onChange2?: (value?: string) => void
  onChange3?: (value?: Field) => void
  readonly?: boolean
}

type Ref = {
  getField(): Field | undefined
}

export { type Ref as FieldSelectInputRef }

function _FieldSelectInput(props: Readonly<Props>, ref: ForwardedRef<Ref>) {
  const connect = useConnect((s) => s.connect)
  const [value, setValue] = useState<FieldValue>()
  const [fields, setFields] = useState<Field[]>([])
  const fetchByName = useCallback(
    (name: string) =>
      connect.get<Field[]>("api/field", { params: { name } }).then((res) => {
        setFields(res.data)
        return res.data.map(
          (i) => ({ label: i.name, value: i.id }) as FieldValue,
        )
      }),
    [connect],
  )
  useImperativeHandle(
    ref,
    () => ({
      getField() {
        return fields.filter((i) => i.id == props.value)[0]
      },
    }),
    [fields, props.value],
  )
  useEffect(() => {
    const field = fields.find((i) => i.id == props.value)
    if (field) {
      setValue({
        label: field.name,
        value: field.id,
      })
    } else {
      fetchByName("")
    }
  }, [fetchByName, fields, props.value])
  return (
    <DebounceSelect
      disabled={props.readonly}
      value={value}
      placeholder="Chọn sân"
      fetchOptions={fetchByName}
      onChange={(e) => {
        setValue(e)
        props.onChange?.(e.value)
        props.onChange2?.(e.value)
        props.onChange3?.(fields.find((i) => i.id == e.value))
      }}
      style={{ width: "100%" }}
    />
  )
}

const FieldSelectInput = forwardRef(_FieldSelectInput)

export default FieldSelectInput
