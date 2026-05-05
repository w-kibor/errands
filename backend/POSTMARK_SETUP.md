# Postmark Email Templates Setup Guide

This guide will help you set up Postmark templates for SwiftDrop.

## Step 1: Get Your Postmark API Token

1. Go to https://account.postmarkapp.com/
2. Navigate to **Servers** and select your server
3. Go to **API Tokens** and copy your **Server API token**
4. Add it to your `.env` file:
   ```
   POSTMARK_API_TOKEN=your-token-here
   ```

## Step 2: Set Up Email Address

1. In Postmark, go to **Sender Signatures**
2. Add/verify your sender email: `noreply@swiftdrop.co.ke`
3. Update `.env` if using a different address:
   ```
   POSTMARK_FROM_EMAIL=your-email@swiftdrop.co.ke
   ```

## Step 3: Create Email Templates in Postmark

Create the following templates in your Postmark server. Use **Template Alias** (not Name) to match the code exactly.

### 1. Order Confirmation
**Alias:** `swiftdrop-order-confirmation`

```html
<h1>Order Confirmed</h1>
<p>Hi {{customer_name}},</p>
<p>Your order #{{order_id}} has been confirmed!</p>

<div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
  <p><strong>Estimated Delivery:</strong> {{estimated_delivery}}</p>
  <p><strong>Total Amount:</strong> {{total_amount}}</p>
  <p><strong>Items:</strong> {{items}}</p>
</div>

<a href="{{action_url}}" style="background: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
  Track Your Order
</a>

<p>Thank you for using SwiftDrop!</p>
```

**Template Variables:**
- `customer_name` - Customer's first name
- `order_id` - Order ID
- `total_amount` - Amount in KES
- `estimated_delivery` - Delivery date/time
- `items` - List of items ordered
- `action_url` - Tracking page URL

### 2. Order Status Update
**Alias:** `swiftdrop-order-status-update`

```html
<h1>Order Status Update</h1>
<p>Hi {{customer_name}},</p>
<p>Your order #{{order_id}} status has been updated:</p>

<div style="background: #e3f2fd; padding: 20px; margin: 20px 0; border-radius: 8px;">
  <p><strong style="font-size: 18px;">{{status}}</strong></p>
  <p>{{status_description}}</p>
  {{#if runner_name}}
  <p><strong>Your Runner:</strong> {{runner_name}}</p>
  <p><strong>Contact:</strong> {{runner_phone}}</p>
  {{/if}}
</div>

<a href="{{action_url}}" style="background: #2196F3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
  View Details
</a>
```

**Template Variables:**
- `customer_name` - Customer name
- `order_id` - Order ID
- `status` - Status (Pending, Out for Delivery, etc.)
- `status_description` - Detailed description
- `runner_name` - Runner name (optional)
- `runner_phone` - Runner phone (optional)
- `action_url` - Tracking URL

### 3. Service Request Created
**Alias:** `swiftdrop-service-request-created`

```html
<h1>Service Request Received</h1>
<p>Hi {{customer_name}},</p>
<p>We've received your {{service_type}} request #{{request_id}}.</p>

<div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
  <p><strong>Service Type:</strong> {{service_type}}</p>
  <p><strong>Description:</strong> {{description}}</p>
  <p><strong>Estimated Cost:</strong> {{estimated_cost}}</p>
  <p><strong>Due Date:</strong> {{due_date}}</p>
</div>

<p>We'll review your request and send updates soon.</p>

<a href="{{action_url}}" style="background: #FF9800; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
  View Request
</a>
```

**Template Variables:**
- `customer_name` - Customer name
- `request_id` - Request ID
- `service_type` - Type of service
- `description` - Service description
- `estimated_cost` - Cost estimate in KES
- `due_date` - Due date
- `action_url` - Dashboard URL

### 4. Payment Receipt
**Alias:** `swiftdrop-payment-receipt`

```html
<h1>Payment Received</h1>
<p>Hi {{customer_name}},</p>
<p>Thank you! We've received your payment.</p>

<div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
  <p><strong>Transaction ID:</strong> {{transaction_id}}</p>
  <p><strong>Amount:</strong> {{amount}}</p>
  <p><strong>Payment Method:</strong> {{payment_method}}</p>
  <p><strong>Date:</strong> {{date}}</p>
  {{#if order_id}}
  <p><strong>Order ID:</strong> {{order_id}}</p>
  {{/if}}
</div>

<p>Your receipt has been attached to this email.</p>

<a href="{{action_url}}" style="background: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
  View Receipt
</a>
```

**Template Variables:**
- `customer_name` - Customer name
- `transaction_id` - Transaction ID
- `amount` - Amount paid in KES
- `payment_method` - Payment method (M-Pesa, Card, etc.)
- `date` - Transaction date
- `order_id` - Order ID (optional)
- `action_url` - Receipt URL

### 5. Welcome Email
**Alias:** `swiftdrop-welcome`

```html
<h1>Welcome to SwiftDrop!</h1>
<p>Hi {{first_name}},</p>
<p>Welcome to SwiftDrop – your trusted Nairobi delivery and errands partner!</p>

<p>We're excited to have you on board. With SwiftDrop, you can:</p>
<ul>
  <li>Get fast deliveries across Nairobi</li>
  <li>Shop from your favorite stores</li>
  <li>Request verification services</li>
  <li>Access business support</li>
</ul>

{{#if verification_url}}
<p><strong>Next Step:</strong> Verify your email to unlock all features.</p>
<a href="{{verification_url}}" style="background: #2196F3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
  Verify Email
</a>
{{/if}}

<a href="{{app_url}}" style="background: #4CAF50; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; margin-left: 10px;">
  Start Using SwiftDrop
</a>

<p>{{ support_team }}</p>
```

**Template Variables:**
- `first_name` - User's first name
- `verification_url` - Email verification link (optional)
- `app_url` - App URL
- `action_url` - Primary CTA URL

### 6. Runner Job Alert
**Alias:** `swiftdrop-runner-notification`

```html
<h1>New Job Available!</h1>
<p>Hi {{runner_name}},</p>
<p>A new {{job_title}} job is available near you!</p>

<div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
  <p><strong>Job:</strong> {{job_title}}</p>
  <p><strong>Description:</strong> {{job_description}}</p>
  <p><strong>Location:</strong> {{location}}</p>
  <p><strong>Estimated Pay:</strong> {{estimated_pay}}</p>
</div>

<p>Act fast – other runners might be interested!</p>

<a href="{{action_url}}" style="background: #FF5722; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
  View & Accept Job
</a>
```

**Template Variables:**
- `runner_name` - Runner name
- `job_title` - Job title
- `job_description` - Job details
- `location` - Job location
- `estimated_pay` - Pay in KES
- `action_url` - Job details URL

### 7. Support Reply
**Alias:** `swiftdrop-support-reply`

```html
<h1>Support Response</h1>
<p>Hi,</p>
<p>{{support_name}} from SwiftDrop Support has replied to your ticket #{{ticket_id}}.</p>

<div style="background: #f5f5f5; padding: 20px; margin: 20px 0; border-radius: 8px;">
  <p><strong>Priority:</strong> {{priority}}</p>
  <p>{{message}}</p>
</div>

<a href="{{action_url}}" style="background: #2196F3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
  View Full Reply
</a>

<p>Thank you for contacting SwiftDrop!</p>
```

**Template Variables:**
- `support_name` - Support agent name
- `ticket_id` - Ticket ID
- `priority` - Priority level
- `message` - Reply message
- `action_url` - Support page URL

### 8. Password Reset
**Alias:** `swiftdrop-password-reset`

```html
<h1>Password Reset Request</h1>
<p>Hi {{first_name}},</p>
<p>We received a request to reset your password. Click the link below to create a new password:</p>

<a href="{{reset_url}}" style="background: #FF5722; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
  Reset Password
</a>

<p><strong>Note:</strong> This link expires in {{expiry_time}}.</p>
<p>If you didn't request this, you can safely ignore this email.</p>

<p>For security, never share your password with anyone.</p>
```

**Template Variables:**
- `first_name` - User's first name
- `reset_url` - Password reset link
- `expiry_time` - Link expiration time
- `action_url` - Reset URL

## Step 4: Testing

Use the included test script to verify your setup:

```bash
npm run test:email
```

Or test manually:

```typescript
import { sendOrderConfirmation } from './lib/email';

await sendOrderConfirmation('test@example.com', {
  orderId: 'ORD-123',
  customerName: 'John Doe',
  totalAmount: 2500,
  status: 'pending',
  estimatedDelivery: '2026-05-06 14:00',
});
```

## Step 5: Integrate with Routes

See [INTEGRATION_EXAMPLES.md](./INTEGRATION_EXAMPLES.md) for how to add email sending to your routes.

## Troubleshooting

### Email not sending?
- Check `POSTMARK_API_TOKEN` is set correctly
- Verify sender email is verified in Postmark
- Check template alias spelling matches exactly
- Look at server logs for error messages

### Template not found?
- Ensure alias is exactly: `swiftdrop-{template-name}`
- Check in Postmark dashboard that template exists
- Click "Test" in template to verify it renders

### Template variables missing?
- Template model keys must match `{{variable_name}}` in template
- Check console logs for what's being sent
- Test with hardcoded values first

## Resources

- [Postmark API Documentation](https://postmarkapp.com/developer)
- [Postmark Templates Guide](https://postmarkapp.com/templates)
- [Handlebars (template syntax)](https://handlebarsjs.com/)
