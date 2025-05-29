import { NextResponse } from "next/server";
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

interface Interviewer {
  id: number;
  name: string;
  department: string;
  jobId: number;
}

const prisma = new PrismaClient()

// Helper function to verify authentication
async function verifyAuth() {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')

  if (!token) {
    return { error: 'Unauthorized', status: 401 }
  }

  const isValid = await verifyToken(token.value)
  if (!isValid) {
    return { error: 'Invalid token', status: 401 }
  }

  return { token: token.value }
}

export async function GET(
  request: Request
) {
  try {
    const auth = await verifyAuth()
    if ('error' in auth) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status }
      )
    }

    // Extract id from the URL
    const id = request.url.split('/').pop()

    const job = await prisma.job.findUnique({
      where: { id: parseInt(id as string) },
      include: {
        interviewers: true,
        candidates: true
      }
    })

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    // Transform the data to match the expected format
    const transformedJob = {
      id: job.id,
      title: job.title,
      location: job.location,
      teamDescription: job.teamDescription,
      jobDescription: job.jobDescription,
      responsibilities: job.responsibilities,
      recruitmentTeam: {
        teamName: job.recruitmentTeamName,
        manager: job.recruitmentManager,
        interviewers: job.interviewers.map((i: Interviewer) => ({
          name: i.name,
          department: i.department
        })),
        candidates: job.candidates.map((c: { name: string; location: string }) => ({
          name: c.name,
          location: c.location
        }))
      }
    }

    return NextResponse.json(transformedJob)
  } catch (error) {
    console.error('Error fetching job:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request
) {
  try {
    const auth = await verifyAuth()
    if ('error' in auth) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status }
      )
    }

    // Extract id from the URL
    const id = request.url.split('/').pop()

    const existingJob = await prisma.job.findUnique({
      where: { id: parseInt(id as string) }
    })

    if (!existingJob) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['title', 'location', 'teamDescription', 'jobDescription', 'responsibilities', 'recruitmentTeamName', 'recruitmentManager']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Update job
    const updatedJob = await prisma.job.update({
      where: { id: parseInt(id as string) },
      data: {
        title: body.title,
        location: body.location,
        teamDescription: body.teamDescription,
        jobDescription: body.jobDescription,
        responsibilities: body.responsibilities,
        recruitmentTeamName: body.recruitmentTeamName,
        recruitmentManager: body.recruitmentManager
      }
    })

    return NextResponse.json(updatedJob)
  } catch (error) {
    console.error('Error updating job:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request
) {
  try {
    const auth = await verifyAuth()
    if ('error' in auth) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status }
      )
    }
    // Extract id from the URL
    const id = request.url.split('/').pop()
    await prisma.job.delete({
      where: { id: parseInt(id as string) }
    })
    return NextResponse.json({ message: 'Job deleted successfully' })
  } catch (error) {
    console.error('Error deleting job:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 