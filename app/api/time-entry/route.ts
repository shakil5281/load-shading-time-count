// app/api/time-entry/route.ts

import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const timeEntries = await prisma.timeEntry.findMany({
      orderBy: { date: 'desc' } // Adjust ordering as needed
    });

    return NextResponse.json(timeEntries, { status: 200 });
  } catch (error) {
    console.error("Error fetching time entries:", error);
    return NextResponse.json({ error: "Error fetching time entries" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { date, month, inTime, outTime } = data;

    const newTimeEntry = await prisma.timeEntry.create({
      data: {
        date: new Date(date),
        month,
        inTime,
        outTime,
      },
    });

    return NextResponse.json(newTimeEntry, { status: 201 });
  } catch (error) {
    console.error("Error creating time entry:", error);
    return NextResponse.json({ error: "Error creating time entry" }, { status: 500 });
  }
}
