# Postmark Email Integration for SwiftDrop

This directory contains everything you need to integrate Postmark email sending into SwiftDrop.

## Quick Start (5 minutes)

### 1. Add Your Postmark API Token

```bash
# In backend/.env
POSTMARK_API_TOKEN="your-server-api-token-from-postmark"
POSTMARK_FROM_EMAIL="noreply@swiftdrop.co.ke"
POSTMARK_TEMPLATE_ALIAS_PREFIX="swiftdrop"
```

### 2. Create Postmark Templates

Go to [Postmark Dashboard](https://account.postmarkapp.com/) → Your Server → Templates

Create these templates with the **exact aliases** (copy/paste template HTML from `POSTMARK_SETUP.md`):
- `swiftdrop-order-confirmation`
- `swiftdrop-order-status-update`
- `swiftdrop-service-request-created`
- `swiftdrop-payment-receipt`
- `swiftdrop-welcome`
- `swiftdrop-runner-notification`
- `swiftdrop-support-reply`
- `swiftdrop-password-reset`

### 3. Test It

Restart your backend:
```bash
npm run dev
```

Try registering a user with an email - you should receive a welcome email!

## Files Included

- **`src/lib/email.ts`** – Email service with all email functions
- **`POSTMARK_SETUP.md`** – Detailed template setup guide with HTML templates
- **`INTEGRATION_EXAMPLES.md`** – How to use email in your routes
- **`.env.example`** – Environment variables needed

## API Functions

```typescript
import {
  sendOrderConfirmation,           // Order confirmations
  sendOrderStatusUpdate,           // Order status changes
  sendServiceRequestCreated,       // New service requests
  sendPaymentReceipt,              // Payment confirmations
  sendWelcomeEmail,                // Welcome to new users
  sendRunnerNotification,          // Job alerts for runners
  sendSupportReply,                // Support team replies
  sendPasswordReset,               // Password reset links
  sendTemplateEmail,               // Send any Postmark template
  sendSimpleEmail                  // Send raw HTML
} from './lib/email';
```

## Common Integration Points

### User Registration
```typescript
// When user signs up, send welcome email
await sendWelcomeEmail(user.email, {
  firstName: user.name.split(' ')[0],
  appUrl: 'https://swiftdrop.co.ke'
});
```

### Order Created
```typescript
// Confirm order and provide tracking link
await sendOrderConfirmation(user.email, {
  orderId: order.id,
  customerName: user.name,
  totalAmount: order.totalAmount,
  estimatedDelivery: deliveryTime,
  trackingUrl: `${APP_URL}/track/${order.id}`
});
```

### Order Status Changes
```typescript
// Notify customer of status updates
await sendOrderStatusUpdate(user.email, {
  orderId: order.id,
  status: newStatus,
  runnerName: runner?.name,
  trackingUrl: `${APP_URL}/track/${order.id}`
});
```

## Troubleshooting

### "Email service not configured"
- Check `POSTMARK_API_TOKEN` is set in `.env`
- Verify token is valid in Postmark dashboard
- Restart backend server: `npm run dev`

### "Template not found"
- Verify template **Alias** matches exactly (case-sensitive)
- Check template exists in Postmark dashboard
- Alias format: `swiftdrop-{template-name}`

### Email not arriving
- Check spam folder
- Verify sender email is whitelisted in Postmark
- Check Postmark Activity log for bounce/complaint
- Try with `sendSimpleEmail()` first to test basic functionality

### Variables not rendering
- Ensure template model keys match Handlebars syntax: `{{variable_name}}`
- Check console logs for template model data
- Test template in Postmark editor first

## Environment Variables

Add to `.env`:

```bash
# Required
POSTMARK_API_TOKEN="your-server-api-token"

# Optional (defaults shown)
POSTMARK_FROM_EMAIL="noreply@swiftdrop.co.ke"
POSTMARK_TEMPLATE_ALIAS_PREFIX="swiftdrop"
APP_BASE_URL="https://swiftdrop.co.ke"
```

## Next Steps

1. ✅ Install postmark package (done)
2. ✅ Set up email service (done)
3. 📝 Create Postmark templates (follow [POSTMARK_SETUP.md](./POSTMARK_SETUP.md))
4. 🔌 Add to your routes (follow [INTEGRATION_EXAMPLES.md](./INTEGRATION_EXAMPLES.md))
5. 🧪 Test each email type
6. 📊 Monitor in Postmark dashboard

## Resources

- [Postmark Official Docs](https://postmarkapp.com/developer)
- [Postmark API Reference](https://postmarkapp.com/api-overview)
- [Email Template Best Practices](https://postmarkapp.com/guides)
- [Handlebars Syntax](https://handlebarsjs.com/)

## Support

Having issues? Check:
1. [POSTMARK_SETUP.md](./POSTMARK_SETUP.md) - Template creation guide
2. [INTEGRATION_EXAMPLES.md](./INTEGRATION_EXAMPLES.md) - Usage examples
3. Backend console logs: `npm run dev`
4. Postmark Activity dashboard for bounce/error details

---

**Started:** May 5, 2026  
**Version:** 1.0  
**Status:** Ready for local testing
