import { ReactNode } from "react"
import Header from "@/web/components/Header"
import Footer from "@/web/components/Footer"

export default function Layout(props: Readonly<{ children?: ReactNode }>) {
  return (
    <>
      <Header />
      <div className="overflow-hidden w-full">{props.children}</div>
      <Footer />
    </>
  )
}
