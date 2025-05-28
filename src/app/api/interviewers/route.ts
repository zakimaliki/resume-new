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

    const interviewers = await prisma.interviewer.findMany({
      include: {
        job: true
      }
    })

    return NextResponse.json(interviewers)
  } catch (error) {
    console.error('Error fetching interviewers:', error)
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
    const requiredFields = ['jobId', 'department', 'name']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Create new interviewer
    const newInterviewer = await prisma.interviewer.create({
      data: {
        jobId: body.jobId,
        department: body.department,
        name: body.name
      },
      include: {
        job: true
      }
    })

    return NextResponse.json(newInterviewer, { status: 201 })
  } catch (error) {
    console.error('Error creating interviewer:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 