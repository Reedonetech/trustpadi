import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { sendConfirmationEmail } from '../../../lib/mailer';

export async function POST(req: NextRequest) {
  try {
    const { name, email } = await req.json();

    if (!name) {
      return NextResponse.json({ message: 'Please enter your name' }, { status: 400 });
    }

    const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

if (!isValidEmail(email)) {
  return NextResponse.json({ message: 'Invalid email address' }, { status: 400 });
}


    const client = await clientPromise;
    const db = client.db('newsletter');
    const collection = db.collection('subscribers');

    const existing = await collection.findOne({ email });

    if (existing) {
      return NextResponse.json({ message: 'Email already subscribed' }, { status: 409 });
    }

    await collection.insertOne({ name, email, subscribedAt: new Date() });

    await sendConfirmationEmail(email, name);

    return NextResponse.json({ message: 'Subscription successful! Confirmation email sent.' });
  } catch (error) {
    console.error('Newsletter error:', error);
    return NextResponse.json({ message: 'Something went wrong.' }, { status: 500 });
  }
}
