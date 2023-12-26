import { Scheduler } from "@aldabil/react-scheduler"
import axios, { HttpStatusCode } from "axios"
import { useEffect, useRef, useState } from "react"
import config from "@/config/Config"
import { DayHours, ProcessedEvent } from "@aldabil/react-scheduler/types"
import { DayProps } from "@aldabil/react-scheduler/views/Day"

type Props = {
  fieldId?: string
}

type SettingType = {
  id: string
  unitStyle: boolean
  unitName: string
  duration: number
  minimumDuration: number
  openTime: number
  closeTime: number
}

export default function Lich(props: Readonly<Props>) {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [hour, setHour] = useState(0)
  const [data, setData] = useState<ProcessedEvent[]>([])
  const divRef = useRef<HTMLDivElement>(null)
  const [setting, setSetting] = useState<DayProps>()

  useEffect(() => {
    axios
      .get<SettingType>(
        [config.baseUrl, "public/api/fieldUnitSetting"].join("/"),
        {
          params: {
            id: props.fieldId,
          },
        },
      )
      .then((res) => {
        if (res.status === HttpStatusCode.Ok) {
          const setting = res.data
          let now = new Date()
          now.setHours(0)
          now.setMinutes(0)
          now.setSeconds(0)
          now.setSeconds(0)
          const start = new Date(now)
          const end = new Date(now)
          start.setMinutes(setting.openTime)
          end.setMinutes(setting.closeTime)
          let startHour = start.getHours() as DayHours
          let endHour = end.getHours() as DayHours
          if (start.getMinutes() > 0) startHour = (startHour - 1) as DayHours
          if (end.getMinutes() > 0) endHour = (endHour + 1) as DayHours
          setSetting({
            startHour,
            endHour,
            step: 30,
          })
        }
      })
  }, [props.fieldId])

  useEffect(() => {
    setHour(new Date().getHours())
  }, [])

  useEffect(() => {
    axios
      .get<{ id: string; from: string; to: string }[]>(
        [config.baseUrl, "public/api/field/schedule"].join("/"),
        {
          params: {
            id: props.fieldId,
          },
        },
      )
      .then((res) => {
        if (res.status === HttpStatusCode.Ok) {
          setData(
            res.data.map(
              (i) =>
                ({
                  event_id: i.id,
                  title: "đã thuê",
                  start: new Date(i.from),
                  end: new Date(i.to),
                }) as ProcessedEvent,
            ),
          )
        }
      })
  }, [props.fieldId])

  useEffect(() => {
    if (divRef.current && setting) {
      const ratio =
        divRef.current.scrollHeight / (setting.endHour - setting.startHour) / 60
      const interval = setInterval(() => {
        const now = new Date()
        const p = (now.getHours() - setting.startHour) * 60 + now.getMinutes()
        divRef.current?.scrollTo({ top: ratio * p })
        console.log(ratio * p)
      }, 10000)
      return () => {
        clearInterval(interval)
      }
    }
  }, [setting])

  return (
    <div className="h-full flex flex-col relative">
      {loading && (
        <div className="absolute bg-white/75 top-0 left-0 z-[999999999999] w-full h-full flex justify-center items-center">
          <div className=" w-16 h-16 border-8 border-dashed rounded-full animate-spin border-blue-600" />
        </div>
      )}
      {error && <CanhBao />}
      <h2>Lịch trong ngày</h2>
      <div ref={divRef} className={`flex-grow overflow-y-scroll scroll-smooth`}>
        {setting && (
          <Scheduler
            day={setting}
            editable={false}
            view="day"
            month={null}
            week={null}
            draggable={true}
            onSelectedDateChange={(d) => console.log(d)}
            events={data}
          />
        )}
      </div>
    </div>
  )
}

function CanhBao() {
  return (
    <div className="flex z-[999] flex-col justify-center items-center text-center w-full absolute h-full bg-white/75">
      <div className="inline-block p-4 bg-yellow-50 rounded-full ">
        <svg
          className="w-12 h-12 fill-current text-yellow-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path d="M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z" />
        </svg>
      </div>
      <h2 className="mt-2 font-semibold text-gray-800">Có lỗi phát sinh</h2>
    </div>
  )
}
