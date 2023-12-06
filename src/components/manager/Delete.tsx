import { ForwardedRef, forwardRef } from "react"

type Ref = {}
type Props = {}

function Delete(props: Props, ref: ForwardedRef<Ref>) {
  return <></>
}

export default forwardRef(Delete)
