"use client"
import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Define a type for report data
type ReportData = {
  month: string
  year: string
  totalHours: number
  tasksCompleted: number
  earnings: number
}

export default function MonthlyReportTable() {
  // Predefined data for the monthly reports
  const [reports] = useState<ReportData[]>([
    {
      month: "January",
      year: "2024",
      totalHours: 120,
      tasksCompleted: 45,
      earnings: 1500,
    },
    {
      month: "February",
      year: "2024",
      totalHours: 100,
      tasksCompleted: 40,
      earnings: 1400,
    },
    {
      month: "March",
      year: "2024",
      totalHours: 130,
      tasksCompleted: 50,
      earnings: 1600,
    },
  ])

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold">Monthly Report Summary</h2>
      <Table className="min-w-full mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>Month</TableHead>
            <TableHead>Year</TableHead>
            <TableHead>Total Hours Worked</TableHead>
            <TableHead>Tasks Completed</TableHead>
            <TableHead>Earnings</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report, index) => (
            <TableRow key={index}>
              <TableCell>{report.month}</TableCell>
              <TableCell>{report.year}</TableCell>
              <TableCell>{report.totalHours}</TableCell>
              <TableCell>{report.tasksCompleted}</TableCell>
              <TableCell>${report.earnings}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
