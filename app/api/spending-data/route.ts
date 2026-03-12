import { NextResponse } from 'next/server';

const spendingDataByYear: Record<number, Array<{month: string, amount: number}>> = {
  2024: [
    { month: "Jan", amount: 2800 },
    { month: "Feb", amount: 2100 },
    { month: "Mar", amount: 2400 },
    { month: "Apr", amount: 1800 },
    { month: "May", amount: 2100 },
    { month: "Jun", amount: 1950 },
    { month: "Jul", amount: 2300 },
    { month: "Aug", amount: 2700 },
    { month: "Sep", amount: 2400 },
    { month: "Oct", amount: 2900 },
    { month: "Nov", amount: 2200 },
    { month: "Dec", amount: 3200 },
  ],
  2025: [
    { month: "Jan", amount: 2100 },
    { month: "Feb", amount: 2600 },
    { month: "Mar", amount: 2300 },
    { month: "Apr", amount: 2800 },
    { month: "May", amount: 2400 },
    { month: "Jun", amount: 2700 },
    { month: "Jul", amount: 2900 },
    { month: "Aug", amount: 2500 },
    { month: "Sep", amount: 2300 },
    { month: "Oct", amount: 2600 },
    { month: "Nov", amount: 2800 },
    { month: "Dec", amount: 3100 },
  ],
  2026: [
    { month: "Jan", amount: 2400 },
    { month: "Feb", amount: 1398 },
    { month: "Mar", amount: 3200 },
    { month: "Apr", amount: 2780 },
    { month: "May", amount: 1890 },
    { month: "Jun", amount: 2390 },
    { month: "Jul", amount: 3490 },
    { month: "Aug", amount: 2100 },
    { month: "Sep", amount: 2700 },
    { month: "Oct", amount: 3100 },
    { month: "Nov", amount: 2800 },
    { month: "Dec", amount: 3600 },
  ],
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());
    
    const data = spendingDataByYear[year];
    
    if (!data) {
      return NextResponse.json(
        { error: `No data available for year ${year}` },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ year, data });
  } catch (error) {
    console.error('Error fetching spending data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch spending data' },
      { status: 500 }
    );
  }
}
