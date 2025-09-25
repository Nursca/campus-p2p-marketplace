import { NextResponse } from 'next/server';
import { Connection, PublicKey, SystemProgram, Transaction, clusterApiUrl } from '@solana/web3.js';
import { findReference, FindReferenceError } from '@solana/pay';
import { mockListings } from '@/lib/items';

// Constants
const SOLANA_NETWORK = 'devnet';
const MERCHANT_WALLET = new PublicKey(process.env.MERCHANT_WALLET || '8FBgLBFxJcm7Rre75C1fmA6TyqFRpnRqzucktLJBvC82'); // Fallback to a placeholder

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const itemId = searchParams.get('itemId');

  if (!itemId) {
    return NextResponse.json({ error: 'Item ID not provided' }, { status: 400 });
  }

  try {
    const item = mockListings.find((item) => item.id.toString() === itemId);
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    const label = `Campus Market - ${item.title}`;
    const icon = 'https://exiled-bot.vercel.app/logo.png'; // Replace with your actual icon URL

    return NextResponse.json({ label, icon }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid item data' }, { status: 400 });
  }
}

export async function POST(req) {
  const { searchParams } = new URL(req.url);
  const itemId = searchParams.get('itemId');
  const { account } = await req.json();

  if (!itemId || !account) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
  }

  try {
    const item = mockListings.find((item) => item.id.toString() === itemId);
    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    const buyerPublicKey = new PublicKey(account);
    const reference = new PublicKey(item.id); // Using item ID as reference for simplicity

    const connection = new Connection(clusterApiUrl(SOLANA_NETWORK));

    // Ensure the transaction has not already been paid
    try {
        await findReference(connection, reference);
        return NextResponse.json({ error: 'Transaction already paid' }, { status: 400 });
    } catch (error) {
        if (error instanceof FindReferenceError) {
            // This is expected if the reference is not found
        } else {
            console.error(error);
            return NextResponse.json({ error: 'Error checking transaction status' }, { status: 500 });
        }
    }

    const { blockhash } = await connection.getLatestBlockhash();

    const transaction = new Transaction({
      recentBlockhash: blockhash,
      feePayer: buyerPublicKey,
    });

    const transferInstruction = SystemProgram.transfer({
      fromPubkey: buyerPublicKey,
      toPubkey: MERCHANT_WALLET,
      lamports: item.price * 10 ** 9, // Assuming price is in SOL
    });

    // Add a reference to the instruction to identify the transaction
    transferInstruction.keys.push({
      pubkey: reference,
      isSigner: false,
      isWritable: false,
    });

    transaction.add(transferInstruction);

    const serializedTransaction = transaction.serialize({
      requireAllSignatures: false,
    });
    const base64Transaction = serializedTransaction.toString('base64');

    const message = `Purchase of ${item.title} for ${item.price} SOL`;

    return NextResponse.json({ transaction: base64Transaction, message }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error creating transaction' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}