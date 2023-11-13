"use client";

import { structFlated } from "./MenuItem";

const App: React.FC = () => {
  return (
    <>
      <h1 className="text-slate-950">{JSON.stringify(structFlated)}</h1>
    </>
  );
};

export default App;
