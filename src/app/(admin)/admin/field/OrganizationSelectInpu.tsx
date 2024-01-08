import { Select } from "antd"
import {
  ForwardedRef,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react"
import useConnect from "@/store/useConnect"

type Props = {
  value?: string
  onChange?: (v?: string) => void
}
type OrganizationSelectInputRef = {
  fetch(): Promise<void>
}

function useFetch() {
  const connect = useConnect((s) => s.connect)
  const [data, setData] = useState<{ id: string; name: string }[]>([])
  useEffect(() => {
    connect.get("api/organization").then((res) => setData(res.data))
  }, [connect])
  return data
}

function _OrganizationSelectInput(
  props: Readonly<Props>,
  ref: ForwardedRef<OrganizationSelectInputRef>,
) {
  const data = useFetch()
  useImperativeHandle(
    ref,
    () => ({
      fetch: async function () {},
    }),
    [],
  )
  return (
    <Select
      value={props.value}
      onChange={(v) => props.onChange?.(v)}
      options={data.map((i) => ({ label: i.name, value: i.id }))}
    />
  )
}

const OrganizationSelectInput = forwardRef(_OrganizationSelectInput)

export default OrganizationSelectInput
