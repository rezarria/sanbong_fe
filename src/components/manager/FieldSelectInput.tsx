import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
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
      labelInValue
      filterOption={true}
      onSearch={debounceFetcher}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      options={options}
    />
  )
}

interface FieldValue {
  label: string
  value: string
}

type Props = {
  value?: string
  onChange?: (value?: string) => void
  onChange2?: (value?: string) => void
}

export default function FieldSelectInput(props: Readonly<Props>) {
  const connect = useConnect((s) => s.connect)
  const [value, setValue] = useState<FieldValue>()
  const fetchByName = useCallback(
    (name: string) =>
      connect
        .get<{ id: string; name: string }[]>("api/field", { params: { name } })
        .then((res) =>
          res.data.map((i) => ({ label: i.name, value: i.id }) as FieldValue),
        ),
    [connect],
  )

  return (
    <DebounceSelect
      value={value}
      placeholder="Chọn sân"
      fetchOptions={fetchByName}
      onChange={(e) => {
        props.onChange?.(e.value)
        props.onChange2?.(e.value)
      }}
      style={{ width: "100%" }}
    />
  )
}
