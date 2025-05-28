import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

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

export async function GET() {
  try {
    const auth = await verifyAuth()
    if ('error' in auth) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status }
      )
    }

    const jobs = await prisma.job.findMany({
      include: {
        interviewers: true,
        candidates: true
      }
    })

    return NextResponse.json(jobs)
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const auth = await verifyAuth()
    if ('error' in auth) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status }
      )
    }

    const body = await request.json()
    
    // Validate required fields
    const requiredFields = [
      'title',
      'location',
      'teamDescription',
      'jobDescription',
      'responsibilities',
      'recruitmentTeamName',
      'recruitmentManager'
    ]
    
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Create new job
    const newJob = await prisma.job.create({
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

    return NextResponse.json(newJob, { status: 201 })
  } catch (error) {
    console.error('Error creating job:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const auth = await verifyAuth()
    if ('error' in auth) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status }
      )
    }

    const body = await request.json()
    
    if (!body.id) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      )
    }

    // Update job
    const updatedJob = await prisma.job.update({
      where: {
        id: body.id
      },
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