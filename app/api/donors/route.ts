import { NextResponse } from 'next/server';

// Mock database of donors with unique IDs
const allDonors = Array.from({ length: 100 }, (_, i) => {
  const timestamp = Date.now() - (i * 60000); // Subtract minutes to make each timestamp unique
  return {
    id: `donor_${timestamp}_${i}`, // Unique ID combining timestamp and index
    name: `Donor ${i + 1}`,
    amount: `₹${Math.floor(Math.random() * 10000)}`,
    cause: ["Medical Care", "Food & Nutrition", "Emergency Fund", "Winter Care", "Shelter & Housing", "Toys & Enrichment"][
      Math.floor(Math.random() * 6)
    ],
    time: `${Math.floor(Math.random() * 24)} hours ago`,
    avatar: "/placeholder.svg?height=40&width=40",
    message: [
      "Hope this helps our furry friends get better!",
      "Every dog deserves a good meal.",
      "For emergency care when they need it most.",
      "Stay warm, little ones!",
      "A safe home for every dog.",
      "Happiness is important too!"
    ][Math.floor(Math.random() * 6)]
  };
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '6');
  
  const start = (page - 1) * limit;
  const end = start + limit;
  const donors = allDonors.slice(start, end);
  const hasMore = end < allDonors.length;

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  return NextResponse.json({
    donors,
    hasMore,
    total: allDonors.length
  });
} 