"use client"

import { Scheduler } from "@aldabil/react-scheduler"
import Container from "@/web/components/Container"

export default function Page() {
  return (
    <Container>
      <Scheduler
        view="day"
        day={{ step: 30, startHour: 7, endHour: 21 }}
        month={null}
        week={null}
        navigation={false}
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
    </Container>
  )
}
