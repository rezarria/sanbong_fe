import { Button, DescriptionsProps, Modal } from "antd"
import {
  ForwardedRef,
  ReactNode,
  forwardRef,
  isValidElement,
  useEffect,
  useImperativeHandle,
  useState,
} from "react"
import { AxiosError, HttpStatusCode } from "axios"
import Descriptions, { DescriptionsItemType } from "antd/es/descriptions"
import useConnect from "@/store/useConnect"
import Paragraph from "antd/es/typography/Paragraph"
type Section<T> = {
  label: string
  span?: number
  children: (data: T) => ReactNode
}
export type CustomDescriptionRef = {
  show: (id: string) => void
  hide: () => void
}
type Props<T> = {
  url: string
  layout: DescriptionsProps["layout"]
  column: DescriptionsProps["column"]
  modalTitle: string
  sections?: Section<T>[]
  onClose?: () => void
  onOpen?: () => void
  button?: (id: string) => ReactNode
}

type ValueAtPath<
  T,
  Path extends string,
> = Path extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? ValueAtPath<T[Key], Rest>
    : never
  : Path extends keyof T
    ? T[Path]
    : never

// Hàm để truy cập giá trị dựa trên path
const getValueByPath = <T, Path extends string>(
  obj: T,
  path: Path,
): ValueAtPath<T, Path> => {
  const keys = path.split(".")
  let value: any = obj

  for (const key of keys) {
    value = value?.[key]
  }

  return value
}

function CustomDescriptions<T extends { id: string }>(
  props: Props<T>,
  ref: ForwardedRef<CustomDescriptionRef>,
) {
  const [isShowing, setIsShowing] = useState(false)
  const [info, setInfo] = useState<T>()
  const [items, setItems] = useState<DescriptionsProps["items"]>()
  const connect = useConnect((s) => s.connect)
  useEffect(() => {
    if (info && props.sections) {
      setItems(
        props.sections.map(
          (value, index) =>
            ({
              key: index,
              label: value.label,
              span: value.span,
              children: value.children(info),
            }) as DescriptionsItemType,
        ),
      )
    }
  }, [info, props.sections])
  useImperativeHandle(
    ref,
    () => ({
      show: (id: string) => {
        connect
          .get<T>(props.url, {
            params: {
              id,
            },
          })
          .then((res) => {
            if (res.status == HttpStatusCode.Ok) {
              setInfo(res.data)
              setIsShowing(true)
            }
          })
          .catch((err: AxiosError) => {
            console.error(err.message)
          })
      },
      hide: () => {
        setInfo(undefined)
        setIsShowing(false)
      },
    }),
    [connect, props.url],
  )
  return (
    <Modal
      open={isShowing}
      title={props.modalTitle}
      onCancel={() => setIsShowing(false)}
      footer={
        <>
          {info && props.button?.(info?.id)}
          <Button
            title="đóng"
            type="primary"
            onClick={() => setIsShowing(false)}
          >
            ĐÓNG
          </Button>
        </>
      }
      afterOpenChange={(o) => {
        if (o) props?.onOpen?.()
        else props?.onClose?.()
      }}
    >
      {
        <Descriptions
          column={props.column}
          bordered
          items={items?.map((i) => {
            if (!isValidElement(i.children)) {
              return {
                ...i,
                children: <Paragraph copyable={true}>{i.children}</Paragraph>,
              } as DescriptionsItemType
            }
            return i
          })}
          layout={props.layout}
        />
      }
    </Modal>
  )
}

export { type CustomDescriptionRef as ViewRef }
const ForwardedRefCustomDescriptions = <T extends { id: string }>() =>
  forwardRef(CustomDescriptions<T>)
export default ForwardedRefCustomDescriptions
