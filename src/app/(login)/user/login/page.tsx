"use client"

import { useEffect, useRef } from "react"
import DangKy, { DangKyRef } from "./DangKy"
import { useRouter } from "next/navigation"

type Props = {
  searchParams: {
    returnUrl?: string
    dangky?: boolean
  }
}

export default function Page(props: Readonly<Props>) {
  const dangKyRef = useRef<DangKyRef>(null)
  const router = useRouter()
  useEffect(() => {
    if (props.searchParams.dangky) {
      dangKyRef.current?.show()
    }
  }, [props.searchParams.dangky])
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex justify-center">
      <div className="max-w-screen-xl m-0 sm:m-10 bg-white shadow sm:rounded-lg flex justify-center flex-1">
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12 relative overflow-hidden">
          <DangKy ref={dangKyRef} />
          <div className="mt-12 flex flex-col items-center">
            <h1 className="text-2xl xl:text-3xl font-extrabold">Đăng nhập</h1>
            <div className="w-full flex-1 mt-8">
              <form
                className="mx-auto max-w-xs"
                onSubmit={(e) => {
                  e.preventDefault()
                  const body = JSON.stringify(
                    Object.fromEntries(new FormData(e.currentTarget).entries()),
                  )
                  fetch("http://localhost:8080/api/security/login", {
                    method: "POST",
                    body,
                    headers: {
                      "Content-Type": "application/json",
                    },
                  }).then((res) => {
                    if (res.status === 200) {
                      res.json().then((d) => {
                        localStorage.clear()
                        localStorage.setItem("jwt", d.jwt)
                        localStorage.setItem("refresh", d.refresh)
                        router.push("/")
                      })
                    }
                  })
                }}
              >
                <input
                  className="w-full box-border px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                  name="username"
                  placeholder="Email"
                />
                <input
                  className="w-full box-border px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5"
                  type="password"
                  name="password"
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
                  <span className="ml-3">Đăng nhập</span>
                </button>
                <button
                  onClick={() => {
                    dangKyRef.current?.show()
                  }}
                  type="button"
                  className="cursor-pointer mt-5 tracking-wide font-semibold bg-indigo-500 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                >
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
              </form>
            </div>
          </div>
        </div>
        <div className="flex-1 bg-indigo-100 text-center hidden lg:flex">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage:
                "url('https://storage.googleapis.com/devitary-image-host.appspot.com/15848031292911696601-undraw_designer_life_w96d.svg')",
            }}
          ></div>
        </div>
      </div>
    </div>
  )
}
