// app/components/ElectricityHoursTable.tsx

"use client";

import { useEffect, useState } from "react";
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

const fetchTimeEntries = async () => {
  const response = await fetch('/api/time-entry');
  if (!response.ok) {
    throw new Error('Failed to fetch time entries');
  }
  return response.json();
};

// Function to calculate hours between two time strings
const calculateHours = (inTime: string, outTime: string) => {
  const [inHour, inMinute] = inTime.split(':').map(Number);
  const [outHour, outMinute] = outTime.split(':').map(Number);
  
  const inDate = new Date();
  inDate.setHours(inHour, inMinute);
  
  const outDate = new Date();
  outDate.setHours(outHour, outMinute);
  
  const diffMs = outDate.getTime() - inDate.getTime();
  return (diffMs / (1000 * 60 * 60)).toFixed(2); // Return hours as a string with 2 decimal places
};

// Function to calculate total hours per day
const calculateTotalHours = (data: any) => {
  return data.reduce((acc: any, entry: any) => acc + parseFloat(calculateHours(entry.inTime, entry.outTime)), 0);
};

export default function ElectricityHoursTable() {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const timeEntries = await fetchTimeEntries();
        setData(timeEntries);
      } catch (err) {
        setError('Failed to load data');
      }
    };
    getData();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

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
            {data.map((entry, index) => (
              <TableRow key={index}>
                <TableCell>{entry.date}</TableCell>
                <TableCell>{entry.month}</TableCell>
                <TableCell>{entry.inTime}</TableCell>
                <TableCell>{entry.outTime}</TableCell>
                <TableCell>{calculateHours(entry.inTime, entry.outTime)} hrs</TableCell>
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
          <strong>{calculateTotalHours(data)}</strong> hours
        </div>
      </CardFooter>
    </Card>
  );
}
