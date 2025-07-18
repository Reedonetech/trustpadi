// Run this once with: `ts-node scripts/setup-index.ts`
// import clientPromise from '@/lib/mongodb';

// async function setup() {
//   const client = await clientPromise;
//   const db = client.db('newsletter');
//   const collection = db.collection('subscribers');

//   await collection.createIndex({ email: 1 }, { unique: true });

//   console.log('✅ Unique index on "email" field created.');
//   process.exit(0);
// }

// setup().catch(console.error);
