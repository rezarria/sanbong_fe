import { Scheduler } from "@aldabil/react-scheduler"
import { useEffect, useState } from "react"

export default function Lich() {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [hour, setHour] = useState(0)
  useEffect(() => {
    setHour(new Date().getHours())
  }, [])

  return (
    <div className="h-full flex flex-col relative">
      {loading && (
        <div className="absolute bg-white/75 top-0 left-0 z-[999999999999] w-full h-full flex justify-center items-center">
          <div className=" w-16 h-16 border-8 border-dashed rounded-full animate-spin border-blue-600" />
        </div>
      )}
      {error && <CanhBao />}
      <h2>Lịch trong ngày</h2>
      <div className={`flex-grow overflow-y-scroll `}>
        <Scheduler
          editable={false}
          view="day"
          month={null}
          week={null}
          draggable={true}
          onSelectedDateChange={(d) => console.log(d)}
          events={[
            {
              event_id: 1,
              title: "Event 1",
              start: new Date("2021/5/2 09:30"),
              end: new Date("2021/5/2 10:30"),
            },
            {
              event_id: 2,
              title: "Event 2",
              start: new Date("2021/5/4 10:00"),
              end: new Date("2021/5/4 11:00"),
            },
          ]}
        />
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
