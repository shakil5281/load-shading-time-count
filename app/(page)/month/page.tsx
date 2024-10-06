"use client"
import { Edit, MoreHorizontal, Trash } from "lucide-react";
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
import { useEffect, useState } from "react";
import Loading from "@/app/loading";

const fetchTimeEntries = async () => {
  const response = await fetch('/api/load-shedding?month=10&year=2024');
  if (!response.ok) {
    throw new Error('Failed to fetch time entries');
  }
  return response.json();
};

export default function Month() {
  const [data, setData] = useState<any>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    try {
      const timeEntries = await fetchTimeEntries();
      setData(timeEntries);
      setLoading(false);
    } catch (err) {
      setError('Failed to load data');
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Electricity Usage Hours</CardTitle>
        <CardDescription>Monthly Report</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Month</TableHead>
              <TableHead>In Time</TableHead>
              <TableHead>Out Time</TableHead>
              <TableHead>Duration (hrs)</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.formattedEntries?.map((entry: any) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.date}</TableCell>
                <TableCell>{entry.month}</TableCell>
                <TableCell>{entry.inTime}</TableCell>
                <TableCell>{entry.outTime}</TableCell>
                <TableCell>{entry.duration} hrs</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button aria-haspopup="true" className="btn-icon p-3">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-52 p-2" align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem className="p-0">
                        <div className="flex space-x-4 justify-start items-center hover:bg-sky-400 hover:text-white w-full p-2 rounded-md duration-200 cursor-pointer">
                          <Edit className="h-4 w-4" />
                          <span>Edit</span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="p-0">
                        <div className="flex space-x-4 justify-start items-center hover:bg-destructive hover:text-destructive-foreground w-full p-2 rounded-md duration-200 cursor-pointer">
                          <Trash className="h-4 w-4" />
                          <span>Delete</span>
                        </div>
                      </DropdownMenuItem>
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
          Total Hours: <strong>{data?.totalDuration}</strong> hours
        </div>
      </CardFooter>
    </Card>
  );
}
