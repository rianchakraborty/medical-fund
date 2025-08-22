import Razorpay from 'razorpay';

export default async function handler(req, res) {
  // Allow preflight (CORS)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { amount_inr } = req.body || {};
  if (!amount_inr || amount_inr < 1) return res.status(400).json({ error: 'Invalid amount' });

  try {
    const rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const order = await rzp.orders.create({
      amount: amount_inr * 100, // in paise
      currency: 'INR',
      payment_capture: 1,
      notes: { purpose: 'Medical Fund' }
    });

    return res.status(200).json({ order, keyId: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Order creation failed', message: err?.message });
  }
}

Add create-order API
