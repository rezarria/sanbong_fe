import { ReactNode } from "react"
import Header from "@/web/components/Header"
import Footer from "@/web/components/Footer"

export default function Layout(props: Readonly<{ children?: ReactNode }>) {
  return (
    <>
      <Header />
      {props.children}
      <Footer />
    </>
  )
}
