import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();


export async function POST(req: NextRequest, res: NextResponse) {

  const body = await req.json();

  if (body?.id) {
    try {
      const deletedRecord = await prisma.resetTimeTracking.delete({
        where: {
          id: body.id,
        },
      });

     return  NextResponse.json({ message: 'Record deleted successfully', deletedRecord }, {status: 200});
    } catch (error) {
      // @ts-ignore
     return  NextResponse.json({ error: 'Failed to delete the record', details: error.message }, {status: 500});
    }
  } else {
    // @ts-ignore
   return  NextResponse.json({ error: 'ID is required to delete the record' }, {status: 400});
  }

}



export async function GET() {
  try {

    const resetTimeTrackingDuration = await prisma.resetTimeTracking.findFirst({
      select: {
        id: true,
        duration: true,
      },
    });


    return NextResponse.json({resetTimeTrackingDuration: resetTimeTrackingDuration ? resetTimeTrackingDuration : '00:00'});
  } catch (error) {
    console.error("Error fetching:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
