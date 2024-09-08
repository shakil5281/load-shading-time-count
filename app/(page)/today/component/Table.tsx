"use client";

import { MoreHorizontal } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data for demo
const electricityData = [
  {
    date: "2024-09-01",
    month: "September",
    inTime: "06:00 AM",
    outTime: "12:00 PM",
    hoursOn: 6,
  },
  {
    date: "2024-09-01",
    month: "September",
    inTime: "01:00 PM",
    outTime: "05:00 PM",
    hoursOn: 4,
  },
  {
    date: "2024-09-02",
    month: "September",
    inTime: "07:00 AM",
    outTime: "11:00 AM",
    hoursOn: 4,
  },
];

// Function to calculate total hours per day
const calculateTotalHours = (data:any) => {
  return data.reduce((acc:any, entry:any) => acc + entry.hoursOn, 0);
};

export default function ElectricityHoursTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Electricity Usage Hours</CardTitle>
        <CardDescription>
          Track how many hours the electricity is on each day.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Month</TableHead>
              <TableHead>In Time</TableHead>
              <TableHead>Out Time</TableHead>
              <TableHead>Hours On</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {electricityData.map((entry, index) => (
              <TableRow key={index}>
                <TableCell>{entry.date}</TableCell>
                <TableCell>{entry.month}</TableCell>
                <TableCell>{entry.inTime}</TableCell>
                <TableCell>{entry.outTime}</TableCell>
                <TableCell>{entry.hoursOn} hrs</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button aria-haspopup="true" className="btn-icon p-4">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Total Hours Today:{" "}
          <strong>{calculateTotalHours(electricityData)}</strong> hours
        </div>
      </CardFooter>
    </Card>
  );
}
