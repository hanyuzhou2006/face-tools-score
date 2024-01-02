"use client"

import { useState } from "react"
import Expect from "./expect"
import Performance from "./performance"
import Result from "./result"
import Service from "./service"
import { combineFinal, expectScore, getScore, transRows } from "./utils"

const defaultPefromance = Array.from({ length: 6 }, () => ['', '', '']);
const defaultService = Array.from({ length: 4 }, () => ['', '', '']);

export default function Home() {
  const [performance, setPerformance] = useState<string[][]>(defaultPefromance);
  const [service, setService] = useState<string[][]>(defaultService)

  const score = getScore(performance, service);

  const submitFaceScore = (expect: number) => {
    const transPerformance = transRows(performance);
    const transService = transRows(service);
    const [finalPerformance, finalService] = expectScore(expect, transPerformance, transService);
    const performanceData = combineFinal(performance, finalPerformance);
    const serviceData = combineFinal(service, finalService);
    setPerformance(performanceData);
    setService(serviceData);
  }

  const onPerformanceRowsChange = (rows: number) => {
    const ori = performance.length;
    if (rows > ori) {
      const newRows = Array.from({length:rows - ori},()=>['', '', '']);
      const performanceData = performance.concat(newRows);
      setPerformance(performanceData);
      return;
    }
    const performanceData = performance.slice(0, rows);
    setPerformance(performanceData);
  }

  return (
    <main className="flex min-h-screen flex-col items-center  p-12">
      <Expect submitFaceScore={submitFaceScore} />
      <Result score={score} />
      <Performance data={performance} setData={setPerformance} onRowsChange={onPerformanceRowsChange} />
      <Service data={service} setData={setService} />
    </main>
  )
}
