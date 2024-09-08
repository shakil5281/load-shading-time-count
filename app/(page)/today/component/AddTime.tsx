"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon, PlusCircle } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import axios from "axios";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Toast } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Define enum for months
const Months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
] as const

// Define schema for validation
const FormSchema = z.object({
    date: z.date({ required_error: "Date is required." }),
    month: z.enum(Months, { required_error: "Month is required." }),
    inTime: z.string().nonempty({ message: "In Time is required." }),
    outTime: z.string().nonempty({ message: "Out Time is required." }),
})

export default function TimeEntry() {

    const { toast } = useToast()
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            date: new Date(),
            month: Months[new Date().getMonth()],
            inTime: "",
            outTime: "",
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log("Form Data:", data); // Check what data is being submitted
    
        try {
            const response = await axios.post("/api/time-entry", data);
            console.log("Response Data:", response.data); // Log the result
            toast({
                title: "Time Entry Created",
                description: `ID: ${response.data.id}`,
            });
        } catch (error:any) {
            console.error("Error Response:", error.response?.data || error.message); // Log error details
            toast({
                title: "Error",
                description: "Could not create time entry",
            });
        }
    }



    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Add Time
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-white">
                <DialogHeader>
                    <DialogTitle>Add Time Entry</DialogTitle>
                    <DialogDescription>
                        Fill in the details for your time entry below. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "pl-3 text-left font-normal w-full",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={(date) => field.onChange(date || undefined)}
                                                disabled={(date) =>
                                                    date > new Date() || date < new Date("1900-01-01")
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormDescription>Select the date of entry.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="month"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Month</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select month" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Months.map((month) => (
                                                <SelectItem key={month} value={month}>
                                                    {month}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>This is the month of entry.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="inTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>In Time</FormLabel>
                                        <FormControl>
                                            <Input type="time" {...field} />
                                        </FormControl>
                                        <FormDescription>Enter the start time.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="outTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Out Time</FormLabel>
                                        <FormControl>
                                            <Input type="time" {...field} />
                                        </FormControl>
                                        <FormDescription>Enter the end time.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>


                        <DialogFooter>
                            <Button type="submit">Save changes</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
