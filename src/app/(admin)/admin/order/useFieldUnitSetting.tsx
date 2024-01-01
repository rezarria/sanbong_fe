import { useCallback, useState } from "react"
import useConnect from "@/store/useConnect"

export type UnitSettingType = {
  unitStyle: boolean
  unitName: string
  minimumDuration: number
  openTime: number
  closeTime: number
  id: string
  duration: number
}

export default function useFieldUnitSetting(): [
  UnitSettingType | undefined,
  (id: string) => Promise<void>,
] {
  const connect = useConnect((s) => s.connect)
  const [data, setData] = useState<UnitSettingType>()
  const get = useCallback(
    (id: string) =>
      connect
        .get<UnitSettingType>("api/fieldUnitSetting/byFieldId", {
          params: { id },
        })
        .then((res) => {
          setData(res.data)
        }),
    [connect],
  )
  return [data, get]
}
