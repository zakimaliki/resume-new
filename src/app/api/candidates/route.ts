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

    const candidates = await prisma.candidate.findMany({
      include: {
        job: true
      }
    })

    return NextResponse.json(candidates)
  } catch (error) {
    console.error('Error fetching candidates:', error)
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
    const requiredFields = ['jobId', 'name', 'location', 'resumeData']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Validate jobId is a number
    const jobId = Number(body.jobId)
    if (isNaN(jobId)) {
      return NextResponse.json(
        { error: 'jobId must be a valid number' },
        { status: 400 }
      )
    }

    // Verify job exists
    const job = await prisma.job.findUnique({
      where: { id: jobId }
    })

    if (!job) {
      return NextResponse.json(
        { error: `Job with ID ${jobId} not found` },
        { status: 404 }
      )
    }

    // Create new candidate with resume data
    const newCandidate = await prisma.candidate.create({
      data: {
        jobId,
        name: body.name,
        location: body.location,
        resumeData: body.resumeData
      },
      include: {
        job: true
      }
    })

    return NextResponse.json(newCandidate, { status: 201 })
  } catch (error) {
    console.error('Error creating candidate:', error)
    // Check for Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A candidate with this information already exists' },
        { status: 409 }
      )
    }
    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: 'Invalid job reference' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
} 