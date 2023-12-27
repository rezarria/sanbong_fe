"use client"

import { ForwardedRef, forwardRef, useImperativeHandle, useState } from "react"

export type DangKyRef = {
  show: () => void
  hide: () => void
}

const DangKy = forwardRef(_DangKy)

export default DangKy

function _DangKy(props: {}, ref: ForwardedRef<DangKyRef>) {
  const [open, setOpen] = useState(false)
  useImperativeHandle(
    ref,
    () => ({
      show: () => {
        setOpen(true)
      },
      hide: () => {
        setOpen(false)
      },
    }),
    [],
  )
  return (
    <div
      className={`w-full h-full items-center absolute top-0 pt-24 left-0 bg-white duration-200 ${
        open ? "" : "left-full"
      }`}
    >
      <h1 className="text-2xl xl:text-3xl font-extrabold text-center">
        Đăng ký
      </h1>
      <div className="w-full flex-1 mt-8">
        <div className="mx-auto max-w-xs">
          <input
            className="w-full box-border px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
            type="email"
            placeholder="Email"
          />
          <input
            className="w-full box-border px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
            type="password"
            placeholder="Password"
          />
          <button className="cursor-pointer mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none">
            <svg
              className="w-6 h-6 -ml-2"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="8.5" cy="7" r="4" />
              <path d="M20 8v6M23 11h-6" />
            </svg>
            <span className="ml-3">Đăng ký</span>
          </button>
          <button
            onClick={() => {
              setOpen(false)
            }}
            type="button"
            className="cursor-pointer mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
          >
            <span className="ml-3">Quay lại</span>
          </button>
        </div>
      </div>
    </div>
  )
}
