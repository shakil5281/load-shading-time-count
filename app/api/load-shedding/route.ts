import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// Helper function to calculate duration and return a formatted time string
function calculateDuration(startTime: string, endTime: string): string {
  const [startHours, startMinutes] = startTime.split(":").map(Number);
  const [endHours, endMinutes] = endTime.split(":").map(Number);

  const startTotalMinutes = startHours * 60 + startMinutes;
  const endTotalMinutes = endHours * 60 + endMinutes;

  // Check if end time is earlier than start time
  if (endTotalMinutes < startTotalMinutes) {
    throw new Error("End time must be later than start time");
  }

  const durationInMinutes = endTotalMinutes - startTotalMinutes;

  // Calculate hours and minutes for formatting
  const hours = Math.floor(durationInMinutes / 60);
  const minutes = durationInMinutes % 60;

  // Return formatted time string (e.g., "00:15")
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { date, startTime, endTime } = data;

    // Calculate duration
    const duration = calculateDuration(startTime, endTime);

    const newLoadShedding = await prisma.loadShedding.create({
      data: {
        date: new Date(date),
        startTime,
        endTime,
        duration, // Store duration as a formatted time string
      },
    });

    return NextResponse.json(newLoadShedding, { status: 201 });
  } catch (error: any) {
    console.error("Error creating load shedding entry:", error);
    return NextResponse.json({ error: error.message || "Error creating load shedding entry" }, { status: 500 });
  }
}



export async function GET() {
  try {
    const timeEntries = await prisma.loadShedding.findMany({
      select: {
        id: true,
        date: true,
        startTime: true,
        endTime: true,
        duration: true,
      },
    });

    const formattedEntries = timeEntries.map((entry) => ({
      id: entry.id,
      date: entry.date.toISOString().split("T")[0], // Format date to YYYY-MM-DD
      month: entry.date.toLocaleString("default", { month: "long" }), // Get month name
      inTime: entry.startTime,
      outTime: entry.endTime,
      duration: entry.duration,
    }));

    return NextResponse.json(formattedEntries);
  } catch (error) {
    console.error("Error fetching time entries:", error);
    return NextResponse.json({ error: "Failed to fetch time entries" }, { status: 500 });
  }
}
