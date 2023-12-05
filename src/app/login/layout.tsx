import { ReactNode } from "react"
import PublicSession from "../../session/PublicSession"

export default function Layout(props: { children: ReactNode }) {
  return <PublicSession>{props.children}</PublicSession>
}
