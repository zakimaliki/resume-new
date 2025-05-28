import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Check if user exists before creating
  const existingUser = await prisma.user.findUnique({
    where: {
      email: 'admin@example.com',
    },
  })

  if (!existingUser) {
    // Create a sample user
    await prisma.user.create({
      data: {
        email: 'admin@example.com',
        password: 'hashed_password_here', // In real app, use proper password hashing
      },
    })
  }

  // Create a sample job
  const job = await prisma.job.create({
    data: {
      title: 'Senior Software Engineer',
      location: 'Jakarta',
      teamDescription: 'We are looking for a talented engineer to join our team',
      jobDescription: 'Join our dynamic team as a Senior Software Engineer',
      responsibilities: [
        'Develop and maintain web applications',
        'Collaborate with cross-functional teams',
        'Mentor junior developers'
      ],
      recruitmentTeamName: 'Tech Recruitment',
      recruitmentManager: 'John Doe',
    },
  })

  // Create sample interviewers
  await prisma.interviewer.create({
    data: {
      jobId: job.id,
      department: 'Engineering',
      name: 'Alice Smith',
    },
  })

  await prisma.interviewer.create({
    data: {
      jobId: job.id,
      department: 'Product',
      name: 'Bob Johnson',
    },
  })

  // Create sample candidates with resume data
  await prisma.candidate.create({
    data: {
      jobId: job.id,
      name: 'Charlie Brown',
      location: 'Bandung',
      resumeData: {
        personal_information: {
          name: 'Charlie Brown',
          title: 'Senior Software Engineer',
          city: 'Bandung'
        },
        contact: {
          email: 'charlie.brown@example.com',
          linkedin: 'linkedin.com/in/charliebrown',
          phone: '+62 812-3456-7890'
        },
        experience: [
          {
            company: 'Tech Corp',
            title: 'Software Engineer',
            startYear: '2020',
            endYear: '2023',
            location: 'Jakarta',
            description: 'Led development of multiple web applications using React and Node.js'
          }
        ],
        education: [
          {
            university: 'Bandung Institute of Technology',
            degree: 'Bachelor of Computer Science',
            gpa: '3.8',
            startYear: '2016',
            endYear: '2020'
          }
        ],
        additional_information: {
          technical_skills: 'React, Node.js, TypeScript, PostgreSQL, AWS'
        }
      }
    },
  })

  await prisma.candidate.create({
    data: {
      jobId: job.id,
      name: 'Diana Prince',
      location: 'Surabaya',
      resumeData: {
        personal_information: {
          name: 'Diana Prince',
          title: 'Full Stack Developer',
          city: 'Surabaya'
        },
        contact: {
          email: 'diana.prince@example.com',
          linkedin: 'linkedin.com/in/dianaprince',
          phone: '+62 813-9876-5432'
        },
        experience: [
          {
            company: 'Digital Solutions',
            title: 'Full Stack Developer',
            startYear: '2019',
            endYear: '2023',
            location: 'Surabaya',
            description: 'Developed and maintained multiple full-stack applications'
          }
        ],
        education: [
          {
            university: 'Surabaya University',
            degree: 'Bachelor of Information Technology',
            gpa: '3.9',
            startYear: '2015',
            endYear: '2019'
          }
        ],
        additional_information: {
          technical_skills: 'JavaScript, Python, Django, React, MongoDB'
        }
      }
    },
  })

  console.log('Seed data created successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 