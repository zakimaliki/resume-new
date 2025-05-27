import { NextResponse } from "next/server";

// Mock data - replace with actual database query
const mockJobData = {
  title: "Engineer Machine Learning",
  location: "Jakarta",
  updatedAt: "hari ini",
  teamDescription: "Tim AI & Data Science adalah tim multidisiplin yang berfokus pada inovasi dan pengembangan solusi berbasis data untuk mendukung keputusan strategis di perusahaan.",
  jobDescription: "Posisi ini bertanggung jawab dalam merancang, membangun, dan mengimplementasikan model machine learning yang dapat mendukung kebutuhan bisnis secara efektif.",
  responsibilities: [
    "Merancang dan mengembangkan model machine learning untuk berbagai use case.",
    "Melakukan analisis data dan eksperimen model secara berkala.",
    "Berkolaborasi dengan tim produk, engineering, dan bisnis.",
    "Melakukan deployment dan monitoring model di lingkungan produksi.",
    "Memberikan dokumentasi serta pelatihan terkait penggunaan model."
  ],
  recruitmentTeam: {
    teamName: "API Experience",
    manager: "Atty Eleti",
    interviewers: {
      engineering: ["Michelle Pokrass"],
      product: ["Olivier Godement"],
      design: ["Karolis Kosas"]
    },
    candidates: [
      { name: "Alice Johnson", location: "San Francisco, CA" },
      { name: "Bob Smith", location: "New York, NY" },
      { name: "Carlos Martinez", location: "Austin, TX" },
      { name: "Diana Lee", location: "Seattle, WA" },
      { name: "Ethan Brown", location: "Boston, MA" },
      { name: "Fiona Chen", location: "San Francisco, CA" },
      { name: "George Kim", location: "Los Angeles, CA" },
      { name: "Hannah Patel", location: "Chicago, IL" },
      { name: "Ivan Petrov", location: "New York, NY" },
      { name: "Julia Roberts", location: "San Francisco, CA" },
      { name: "Kevin Nguyen", location: "San Jose, CA" },
      { name: "Sophia Lee", location: "Seattle, WA" },
      { name: "Michael Chen", location: "New York, NY" }
    ]
  }
};

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // TODO: Replace with actual database query
    // For now, we'll return mock data
    return NextResponse.json(mockJobData);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch job data" },
      { status: 500 }
    );
  }
} 