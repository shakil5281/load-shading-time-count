

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

export default function ElectricityHoursTable({data}:any) {

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
              <TableHead>Duration (hrs)</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((entry:any) => (
              <TableRow key={entry.id}>
                <TableCell>{entry.date}</TableCell>
                <TableCell>{entry.month}</TableCell>
                <TableCell>{entry.inTime}</TableCell>
                <TableCell>{entry.outTime}</TableCell>
                <TableCell>{entry.duration} hrs</TableCell> {/* Show duration directly */}
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
          Total Hours Today: <strong>{data.reduce((total:any, entry:any) => total + entry.duration, 0)}</strong> hours
        </div>
      </CardFooter>
    </Card>
  );
}
