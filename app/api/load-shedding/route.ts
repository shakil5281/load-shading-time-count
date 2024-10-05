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


    const timeEntries = await prisma.loadShedding.findMany({
      select: {
        duration: true,
      },
    });

    // Function to convert duration string "HH:mm" to total minutes
    // @ts-ignore
    const convertToMinutes = (duration) => {
      const [hours, minutes] = duration.split(':').map(Number);
      return hours * 60 + minutes;
    };

// Calculate total duration in minutes
    const totalDurationInMinutes = timeEntries.reduce((total, entry) => {
      return total + convertToMinutes(entry.duration);
    }, 0);

// Optionally, convert total minutes back to "HH:mm" format
    const hours = Math.floor(totalDurationInMinutes / 60);
    const minutes = totalDurationInMinutes % 60;
    const totalDuration = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

    console.log('Total Duration:', totalDuration, 'Hours:', hours);


    const storeResetTimeTracking = await prisma.resetTimeTracking.create({
      data: {
        duration: totalDuration, // Store duration as a formatted time string
      },
    });

    return NextResponse.json(newLoadShedding, { status: 201 });
  } catch (error: any) {
    console.error("Error creating load shedding entry:", error);
    return NextResponse.json({ error: error.message || "Error creating load shedding entry" }, { status: 500 });
  }
}



/*export async function GET() {
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


    // Function to convert duration string "HH:mm" to total minutes
    // @ts-ignore
    const convertToMinutes = (duration) => {
      const [hours, minutes] = duration.split(':').map(Number);
      return hours * 60 + minutes;
    };

// Calculate total duration in minutes
    const totalDurationInMinutes = timeEntries.reduce((total, entry) => {
      return total + convertToMinutes(entry.duration);
    }, 0);

// Optionally, convert total minutes back to "HH:mm" format
    const hours = Math.floor(totalDurationInMinutes / 60);
    const minutes = totalDurationInMinutes % 60;
    const totalDuration = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

    console.log('Total Duration:', totalDuration, 'Hours:', hours);

    return NextResponse.json(formattedEntries);
  } catch (error) {
    console.error("Error fetching time entries:", error);
    return NextResponse.json({ error: "Failed to fetch time entries" }, { status: 500 });
  }
}*/


export async function GET(req: NextRequest) {
  try {
    // Extract query parameters for filtering
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get('filter') || 'today'; // 'today', 'week', 'month', 'year', 'custom'
    const month = searchParams.get('month'); // for dynamic month filtering (1-12)
    const year = searchParams.get('year'); // for dynamic year filtering (e.g., 2024)
    const startDateParam = searchParams.get('startDate'); // Custom date range start
    const endDateParam = searchParams.get('endDate'); // Custom date range end

    const now = new Date();
    let startDate, endDate;

    // Handle specific date range if provided
    if (startDateParam && endDateParam) {
      startDate = new Date(startDateParam);
      endDate = new Date(endDateParam);
      endDate.setHours(23, 59, 59, 999); // Set the end date to the end of the day
    }
    // Handle dynamic month and year filter
    else if (month && year) {
      const monthNumber = parseInt(month) - 1; // JavaScript months are 0-indexed
      // @ts-ignore
      startDate = new Date(year, monthNumber, 1); // First day of the given month
      // @ts-ignore
      endDate = new Date(year, monthNumber + 1, 0); // Last day of the given month
      endDate.setHours(23, 59, 59, 999); // Set the end date to the end of the last day
    }
    // Handle other predefined filters (today, week, year)
    else {
      switch (filter) {
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - now.getDay())); // Start of the week (Sunday)
          endDate = new Date(); // Today
          break;
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1); // Start of the month
          endDate = new Date(); // Today
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1); // Start of the year
          endDate = new Date(); // Today
          break;
        case 'today':
        default:
          startDate = new Date(now.setHours(0, 0, 0, 0)); // Start of today
          endDate = new Date(now.setHours(23, 59, 59, 999)); // End of today
          break;
      }
    }

    // Fetch entries within the calculated date range
    const timeEntries = await prisma.loadShedding.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        id: true,
        date: true,
        startTime: true,
        endTime: true,
        duration: true,
      },
    });

    // Format the entries
    const formattedEntries = timeEntries.map((entry) => ({
      id: entry.id,
      date: entry.date.toISOString().split("T")[0], // Format date to YYYY-MM-DD
      month: entry.date.toLocaleString("default", { month: "long" }), // Get month name
      inTime: entry.startTime,
      outTime: entry.endTime,
      duration: entry.duration,
    }));

    // Function to convert duration string "HH:mm" to total minutes
    // @ts-ignore
    const convertToMinutes = (duration) => {
      const [hours, minutes] = duration.split(':').map(Number);
      return hours * 60 + minutes;
    };

    // Calculate total duration in minutes based on the filtered entries
    const totalDurationInMinutes = timeEntries.reduce((total, entry) => {
      return total + convertToMinutes(entry.duration);
    }, 0);

    // Optionally, convert total minutes back to "HH:mm" format
    const hours = Math.floor(totalDurationInMinutes / 60);
    const minutes = totalDurationInMinutes % 60;
    const totalDuration = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

    return NextResponse.json({
      entries: formattedEntries,
      totalDuration, // Total duration for the filtered range
    });
  } catch (error) {
    console.error("Error fetching time entries:", error);
    return NextResponse.json({ error: "Failed to fetch time entries" }, { status: 500 });
  }
}

