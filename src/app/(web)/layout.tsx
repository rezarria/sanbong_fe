import { ReactNode } from "react"
import Header from "../../web/components/Header"

export default function Layout(props: Readonly<{ children?: ReactNode }>) {
  return (
    <>
      <Header />
      {props.children}
    </>
  )
}
