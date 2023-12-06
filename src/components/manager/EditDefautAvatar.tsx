"use client"

import { UserOutlined } from "@ant-design/icons"
import {
  MouseEventHandler,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"

export default function EditDefaultAvatar(
  props: Readonly<{
    className?: string
    onMouseEnter?: MouseEventHandler<HTMLDivElement>
  }>,
) {
  const divRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ height: 0, width: 0 })

  useLayoutEffect(() => {
    if (divRef.current) {
      setSize({
        height: divRef.current.clientHeight,
        width: divRef.current.clientWidth,
      })
    }
  }, [])

  useEffect(() => {
    const div = divRef.current
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((i) => {
        setSize({ width: i.contentRect.width, height: i.contentRect.height })
      })
    })
    if (div) {
      resizeObserver.observe(divRef.current)
    }
    return () => {
      if (div) {
        resizeObserver.unobserve(div)
        resizeObserver.disconnect()
      }
    }
  }, [])

  return (
    <div
      ref={divRef}
      onMouseEnter={props.onMouseEnter}
      className={["w-full h-full", props.className].join(" ")}
    >
      <UserOutlined style={{ fontSize: size.height }} />
    </div>
  )
}
