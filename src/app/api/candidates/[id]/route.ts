import { NextRequest, NextResponse } from 'next/server'
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

export async function GET(
  request: NextRequest
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
    const id = request.nextUrl.pathname.split('/').pop()

    const candidate = await prisma.candidate.findUnique({
      where: {
        id: parseInt(id as string)
      },
      include: {
        job: true
      }
    })

    if (!candidate) {
      return NextResponse.json(
        { error: 'Candidate not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(candidate)
  } catch (error) {
    console.error('Error fetching candidate:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest
) {
  try {
    const auth = await verifyAuth()
    if ('error' in auth) {
      return NextResponse.json(
        { error: auth.error },
        { status: auth.status }
      )
    }

    const body = await request.json()
    // Extract id from the URL
    const id = request.nextUrl.pathname.split('/').pop()
    // Update candidate
    const updatedCandidate = await prisma.candidate.update({
      where: {
        id: parseInt(id as string)
      },
      data: {
        jobId: body.jobId,
        name: body.name,
        location: body.location,
        resumeData: body.resumeData // Store the complete resume data
      },
      include: {
        job: true
      }
    })

    return NextResponse.json(updatedCandidate)
  } catch (error) {
    console.error('Error updating candidate:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest
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
    const id = request.nextUrl.pathname.split('/').pop()
    await prisma.candidate.delete({
      where: {
        id: parseInt(id as string)
      }
    })

    return NextResponse.json({ message: 'Candidate deleted successfully' })
  } catch (error) {
    console.error('Error deleting candidate:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 