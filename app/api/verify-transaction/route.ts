import { NextResponse } from 'next/server';

/**
 * API endpoint to handle transaction verification (e.g., from Slack approval)
 * Can be triggered by Slack interactive components or webhook callbacks
 * 
 * Expected request body:
 * {
 *   transactionId: number,
 *   verified: boolean,
 *   source?: string (e.g., 'slack')
 * }
 */

// Simple in-memory store (in production, use a database)
// NOTE: This resets on server restart. For persistence, use localStorage or a database.
const verifiedTransactions = new Set<number>();

// Helper function to add logging
function logVerification(message: string, data?: any) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`, data || '');
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { transactionId, verified, source = 'api' } = body;

    // Validate required fields
    if (transactionId === undefined || verified === undefined) {
      logVerification('❌ Invalid request: missing fields', { transactionId, verified });
      return NextResponse.json(
        { error: 'Missing required fields: transactionId, verified' },
        { status: 400 }
      );
    }

    // Store verification status
    if (verified) {
      verifiedTransactions.add(Number(transactionId));
    } else {
      verifiedTransactions.delete(Number(transactionId));
    }

    logVerification('✓ Transaction verified', {
      transactionId,
      verified,
      source,
      totalVerified: verifiedTransactions.size,
    });

    return NextResponse.json(
      {
        success: true,
        message: `Transaction ${transactionId} verification status updated to ${verified}`,
        transactionId: Number(transactionId),
        verified,
        timestamp: new Date().toISOString(),
        storedCount: verifiedTransactions.size,
      },
      { status: 200 }
    );
  } catch (error: any) {
    logVerification('❌ POST Error:', error.message);
    return NextResponse.json(
      { error: 'Failed to process verification request', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to fetch verification status or health check
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const transactionId = searchParams.get('transactionId');

    if (transactionId) {
      const id = Number(transactionId);
      const isVerified = verifiedTransactions.has(id);
      logVerification(`Query verification status for ${id}:`, { verified: isVerified });
      
      return NextResponse.json({
        transactionId: id,
        verified: isVerified,
        timestamp: new Date().toISOString(),
      });
    }

    // Return overall status
    const allVerified = Array.from(verifiedTransactions);
    return NextResponse.json(
      {
        status: 'active',
        message: 'Verify transaction endpoint is active',
        description: 'GET /?transactionId=<ID> to check status, or POST to verify',
        verifiedCount: verifiedTransactions.size,
        verifiedTransactions: allVerified,
        serverTime: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error: any) {
    logVerification('❌ GET Error:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch verification status', details: error.message },
      { status: 500 }
    );
  }
}


