import dotenv from 'dotenv';
import path from 'path';

// Load environment variables FIRST before any other imports
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

import { sendOrderConfirmation } from '../lib/email.js';

async function main() {
  const to = process.env.TEST_EMAIL || 'test@example.com';
  console.log('Sending test email to', to);
  console.log('From:', process.env.POSTMARK_FROM_EMAIL);
  console.log('API Token set:', !!process.env.POSTMARK_API_TOKEN);

  const result = await sendOrderConfirmation(to, {
    orderId: 'TEST-ORD-1',
    customerName: 'Test User',
    totalAmount: 100,
    status: 'pending',
    estimatedDelivery: new Date().toLocaleString(),
    items: 'Sample Item',
    trackingUrl: `${process.env.APP_BASE_URL || 'https://swiftdrop.co.ke'}/track/TEST-ORD-1`
  });

  console.log('Email send result:', result);
  
  if (!result.success) {
    console.error('\n❌ Email failed.');
    console.log('\nPossible reasons:');
    console.log('1. Template "swiftdrop-order-confirmation" not created in Postmark');
    console.log('2. Sender email "' + process.env.POSTMARK_FROM_EMAIL + '" not verified in Postmark');
    console.log('3. Invalid API token');
    process.exit(1);
  } else {
    console.log('\n✅ Email sent successfully!');
    console.log('Message ID:', result.messageId);
  }
}

main().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
