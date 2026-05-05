import { Client } from 'postmark';

let postmarkClient: any = null;
let clientInitialized = false;

function getPostmarkClient() {
	if (clientInitialized) {
		return postmarkClient;
	}

	clientInitialized = true;
	const POSTMARK_API_TOKEN = process.env.POSTMARK_API_TOKEN;

	if (!POSTMARK_API_TOKEN) {
		console.warn('POSTMARK_API_TOKEN is not set. Email functionality will not work.');
		return null;
	}

	postmarkClient = new Client(POSTMARK_API_TOKEN);
	return postmarkClient;
}

export function getPostmarkConfig() {
	return {
		fromEmail: process.env.POSTMARK_FROM_EMAIL || 'noreply@swiftdrop.co.ke',
		templateAliasPrefix: process.env.POSTMARK_TEMPLATE_ALIAS_PREFIX || 'swiftdrop'
	};
}

export interface EmailPayload {
	to: string;
	templateAlias: string;
	templateModel: Record<string, any>;
	tag?: string;
	replyTo?: string;
}

export interface SimplEmailPayload {
	to: string;
	subject: string;
	htmlBody: string;
	textBody?: string;
	tag?: string;
	replyTo?: string;
}

/**
 * Send email using Postmark template
 */
export async function sendTemplateEmail(payload: EmailPayload): Promise<{ success: boolean; messageId?: string; error?: string }> {
	const client = getPostmarkClient();
	if (!client) {
		console.error('Postmark client not initialized. Check POSTMARK_API_TOKEN.');
		return { success: false, error: 'Email service not configured' };
	}

	const config = getPostmarkConfig();

	try {
		const result = await client.sendEmailWithTemplate({
			From: config.fromEmail,
			To: payload.to,
			TemplateAlias: payload.templateAlias,
			TemplateModel: payload.templateModel,
			Tag: payload.tag,
			ReplyTo: payload.replyTo
		});

		console.log(`✅ Email sent to ${payload.to} using template ${payload.templateAlias}`, {
			messageId: result.MessageID
		});

		return { success: true, messageId: result.MessageID };
	} catch (error) {
		const errorDetails = error instanceof Error ? {
			message: error.message,
			name: error.name,
			...(error as any).statusCode && { statusCode: (error as any).statusCode },
			...(error as any).code && { code: (error as any).code },
			...(error as any).recipients && { recipients: (error as any).recipients }
		} : error;
		console.error(`\n❌ Failed to send email to ${payload.to}:`);
		console.error('Error Details:', JSON.stringify(errorDetails, null, 2));
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error'
		};
	}
}

/**
 * Send simple HTML email (for custom content)
 */
export async function sendSimpleEmail(payload: SimplEmailPayload): Promise<{ success: boolean; messageId?: string; error?: string }> {
	const client = getPostmarkClient();
	if (!client) {
		console.error('Postmark client not initialized. Check POSTMARK_API_TOKEN.');
		return { success: false, error: 'Email service not configured' };
	}

	const config = getPostmarkConfig();

	try {
		const result = await client.sendEmail({
			From: config.fromEmail,
			To: payload.to,
			Subject: payload.subject,
			HtmlBody: payload.htmlBody,
			TextBody: payload.textBody,
			Tag: payload.tag,
			ReplyTo: payload.replyTo
		});

		console.log(`✅ Email sent to ${payload.to}:`, { messageId: result.MessageID });

		return { success: true, messageId: result.MessageID };
	} catch (error) {
		const errorDetails = error instanceof Error ? {
			message: error.message,
			name: error.name,
			...(error as any).statusCode && { statusCode: (error as any).statusCode },
			...(error as any).code && { code: (error as any).code },
			...(error as any).recipients && { recipients: (error as any).recipients }
		} : error;
		console.error(`\n❌ Failed to send email to ${payload.to}:`);
		console.error('Error Details:', JSON.stringify(errorDetails, null, 2));
		return {
			success: false,
			error: error instanceof Error ? error.message : 'Unknown error'
		};
	}
}

/**
 * Specialized email functions for SwiftDrop
 */

export async function sendOrderConfirmation(email: string, orderData: {
	orderId: string;
	customerName: string;
	totalAmount: number;
	status: string;
	estimatedDelivery: string;
	items?: string;
	trackingUrl?: string;
}) {
	const config = getPostmarkConfig();
	return sendTemplateEmail({
		to: email,
		templateAlias: `${config.templateAliasPrefix}-order-confirmation`,
		templateModel: {
			customer_name: orderData.customerName,
			order_id: orderData.orderId,
			total_amount: `KES ${orderData.totalAmount}`,
			estimated_delivery: orderData.estimatedDelivery,
			items: orderData.items || 'Items',
			tracking_url: orderData.trackingUrl || '',
			action_url: orderData.trackingUrl || 'https://swiftdrop.co.ke'
		},
		tag: 'order-confirmation'
	});
}

export async function sendOrderStatusUpdate(email: string, orderData: {
	orderId: string;
	customerName: string;
	status: string;
	statusDescription: string;
	runnerId?: string;
	runnerName?: string;
	runnerPhone?: string;
	trackingUrl?: string;
}) {
	const config = getPostmarkConfig();
	return sendTemplateEmail({
		to: email,
		templateAlias: `${config.templateAliasPrefix}-order-status-update`,
		templateModel: {
			customer_name: orderData.customerName,
			order_id: orderData.orderId,
			status: orderData.status,
			status_description: orderData.statusDescription,
			runner_name: orderData.runnerName || 'Runner',
			runner_phone: orderData.runnerPhone || '',
			tracking_url: orderData.trackingUrl || '',
			action_url: orderData.trackingUrl || 'https://swiftdrop.co.ke'
		},
		tag: 'order-status-update'
	});
}

export async function sendServiceRequestCreated(email: string, requestData: {
	requestId: string;
	customerName: string;
	serviceType: string;
	description: string;
	estimatedCost: number;
	dueDate: string;
	dashboardUrl?: string;
}) {
	const config = getPostmarkConfig();
	return sendTemplateEmail({
		to: email,
		templateAlias: `${config.templateAliasPrefix}-service-request-created`,
		templateModel: {
			customer_name: requestData.customerName,
			request_id: requestData.requestId,
			service_type: requestData.serviceType,
			description: requestData.description,
			estimated_cost: `KES ${requestData.estimatedCost}`,
			due_date: requestData.dueDate,
			action_url: requestData.dashboardUrl || 'https://swiftdrop.co.ke'
		},
		tag: 'service-request-created'
	});
}

export async function sendPaymentReceipt(email: string, paymentData: {
	transactionId: string;
	customerName: string;
	amount: number;
	paymentMethod: string;
	date: string;
	receiptUrl?: string;
	orderId?: string;
}) {
	const config = getPostmarkConfig();
	return sendTemplateEmail({
		to: email,
		templateAlias: `${config.templateAliasPrefix}-payment-receipt`,
		templateModel: {
			customer_name: paymentData.customerName,
			transaction_id: paymentData.transactionId,
			amount: `KES ${paymentData.amount}`,
			payment_method: paymentData.paymentMethod,
			date: paymentData.date,
			order_id: paymentData.orderId || '',
			action_url: paymentData.receiptUrl || 'https://swiftdrop.co.ke'
		},
		tag: 'payment-receipt'
	});
}

export async function sendWelcomeEmail(email: string, userData: {
	firstName: string;
	verificationUrl?: string;
	appUrl?: string;
}) {
	const config = getPostmarkConfig();
	return sendTemplateEmail({
		to: email,
		templateAlias: `${config.templateAliasPrefix}-welcome`,
		templateModel: {
			first_name: userData.firstName,
			verification_url: userData.verificationUrl || '',
			app_url: userData.appUrl || 'https://swiftdrop.co.ke',
			action_url: userData.appUrl || 'https://swiftdrop.co.ke'
		},
		tag: 'welcome'
	});
}

export async function sendRunnerNotification(email: string, notificationData: {
	runnerName: string;
	jobTitle: string;
	jobDescription: string;
	location: string;
	estimatedPay: number;
	jobUrl?: string;
}) {
	const config = getPostmarkConfig();
	return sendTemplateEmail({
		to: email,
		templateAlias: `${config.templateAliasPrefix}-runner-notification`,
		templateModel: {
			runner_name: notificationData.runnerName,
			job_title: notificationData.jobTitle,
			job_description: notificationData.jobDescription,
			location: notificationData.location,
			estimated_pay: `KES ${notificationData.estimatedPay}`,
			action_url: notificationData.jobUrl || 'https://swiftdrop.co.ke'
		},
		tag: 'runner-job-alert'
	});
}

export async function sendSupportReply(email: string, replyData: {
	supportName: string;
	ticketId: string;
	message: string;
	priority?: string;
}) {
	const config = getPostmarkConfig();
	return sendTemplateEmail({
		to: email,
		templateAlias: `${config.templateAliasPrefix}-support-reply`,
		templateModel: {
			support_name: replyData.supportName,
			ticket_id: replyData.ticketId,
			message: replyData.message,
			priority: replyData.priority || 'normal',
			action_url: 'https://swiftdrop.co.ke/support'
		},
		tag: 'support-reply'
	});
}

export async function sendPasswordReset(email: string, resetData: {
	firstName: string;
	resetUrl: string;
	expiryTime?: string;
}) {
	const config = getPostmarkConfig();
	return sendTemplateEmail({
		to: email,
		templateAlias: `${config.templateAliasPrefix}-password-reset`,
		templateModel: {
			first_name: resetData.firstName,
			reset_url: resetData.resetUrl,
			expiry_time: resetData.expiryTime || '24 hours',
			action_url: resetData.resetUrl
		},
		tag: 'password-reset'
	});
}
