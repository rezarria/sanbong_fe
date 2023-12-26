"use client"

import { structFlated } from "@/components/AppBreadcrumb/MenuItem"

const App: React.FC = () => {
  return <h1 className="text-slate-950">{JSON.stringify(structFlated)}</h1>
}

export default App
