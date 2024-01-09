import { Calendar, dayjsLocalizer } from "react-big-calendar"
import dayjs from "dayjs"
import timezone from "dayjs/plugin/timezone"
import { useEffect, useState } from "react"
import { Schedule } from "./orderType"
import useConnect from "@/store/useConnect"
dayjs.extend(timezone)
const localizer = dayjsLocalizer(dayjs)

type Props = {
  fieldId?: string
}

type Event = {
  id: string
  title: string
  start: Date
  end: Date
}

export default function FieldCalendar(props: Readonly<Props>) {
  const [data, setData] = useState<Event[]>([])
  const connect = useConnect((s) => s.connect)
  useEffect(() => {
    if (props.fieldId) {
      connect
        .get<Schedule[]>("api/field/schedule", {
          params: {
            id: props.fieldId,
          },
        })
        .then((res) => {
          setData(
            res.data.map(
              (i) =>
                ({
                  id: i.id,
                  start: new Date(i.from * 1000),
                  end: new Date(i.to * 1000),
                  title: "thuê",
                }) as Event,
            ),
          )
        })
    }
  }, [connect, props.fieldId])
  return (
    <div>
      <Calendar
        events={data}
        showMultiDayTimes
        localizer={localizer}
        startAccessor="start"
        endAccessor="end"
        titleAccessor={"title"}
        style={{ height: 400 }}
      />
    </div>
  )
}
