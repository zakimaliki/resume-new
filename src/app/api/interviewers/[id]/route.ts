import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAuth } from "@/lib/auth";

export async function PUT(
  request: NextRequest
) {
  try {
    // Verify authentication
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the new interviewers data from request body
    const { interviewers } = await request.json();

    // Extract id from the URL
    const id = request.nextUrl.pathname.split('/').pop();

    // Delete existing interviewers
    await prisma.interviewer.deleteMany({
      where: {
        jobId: parseInt(id as string)
      }
    });

    // Create new interviewers
    const createdInterviewers = await Promise.all(
      interviewers.map((interviewer: { name: string; department: string }) =>
        prisma.interviewer.create({
          data: {
            name: interviewer.name,
            department: interviewer.department,
            jobId: parseInt(id as string)
          }
        })
      )
    );

    return NextResponse.json({ 
      message: "Interviewers updated successfully",
      interviewers: createdInterviewers 
    });
  } catch (error) {
    console.error("Error updating interviewers:", error);
    return NextResponse.json(
      { error: "Failed to update interviewers" },
      { status: 500 }
    );
  }
} 