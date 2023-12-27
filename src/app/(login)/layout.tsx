import { ReactNode } from "react"
import "./globals.css"
export default function Layout(props: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className={`m-0 flex flex-col`}>{props.children}</body>
    </html>
  )
}
