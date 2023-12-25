import { ReactNode } from "react"

type Props = {
  children: ReactNode
  fill?: boolean
  className?: string
}

export default function Container(props: Readonly<Props>) {
  return (
    <div className={`w-screen ${props.className}`}>
      <div className={`lg:w-[1024px] m-auto ${props.fill ? "!w-full" : ""}`}>
        {props.children}
      </div>
    </div>
  )
}
