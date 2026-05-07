import { Router } from 'express';
import type { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../lib/prisma.js';
import { sendWelcomeEmail } from '../lib/email.js';

export const authRouter = Router();

const authSchema = z.object({
	name: z.string().min(2).optional(),
	email: z.string().email(),
	phone: z.string().min(7).optional(),
	avatar: z.string().url().optional().or(z.literal(''))
});

const signupAvailabilitySchema = z.object({
	email: z.string().email(),
	phone: z.string().min(7)
});

const accountExistsMessage = 'An account already exists for this email or phone number. Please log in instead.';

const seedDefaultProfileData = async (tx: Prisma.TransactionClient, userId: string) => {
	const addressCount = await tx.savedAddress.count({ where: { userId } });
	if (addressCount === 0) {
		await tx.savedAddress.create({
			data: {
				userId,
				label: 'Home',
				address: 'Kilimani, Nairobi',
				isPrimary: true
			}
		});
	}

	const paymentMethodCount = await tx.savedPaymentMethod.count({ where: { userId } });
	if (paymentMethodCount === 0) {
		await tx.savedPaymentMethod.create({
			data: {
				userId,
				type: 'MPESA',
				label: 'Personal M-Pesa',
				details: '*** *** 678',
				isDefault: true
			}
		});
	}

	const notificationPreferenceCount = await tx.notificationPreference.count({ where: { userId } });
	if (notificationPreferenceCount === 0) {
		await tx.notificationPreference.createMany({
			data: [
				{ userId, key: 'order-updates', enabled: true },
				{ userId, key: 'promotions', enabled: true },
				{ userId, key: 'messages', enabled: true }
			]
		});
	}
};
authRouter.post('/register', async (req, res) => {
	try {
		const parsed = authSchema.safeParse(req.body);
		if (!parsed.success) {
			return res.status(400).json({ error: 'Invalid registration payload', issues: parsed.error.flatten() });
		}

		if (!parsed.data.phone) {
			return res.status(400).json({ error: 'Phone number is required for registration' });
		}

		const { phone, name, avatar } = parsed.data;
		const user = await prisma.$transaction(async (tx) => {
			const existingUser = await tx.user.findFirst({
				where: {
					OR: [
						{ email: parsed.data.email },
						{ phone }
					]
				}
			});

			if (existingUser) {
				const error = new Error(accountExistsMessage) as Error & { statusCode?: number };
				error.statusCode = 409;
				throw error;
			}

			const createdUser = await tx.user.create({
				data: {
					name: name || 'New User',
					email: parsed.data.email || null,
					phone,
					avatar: avatar || null,
					runnerCapabilities: []
				}
			});

			await seedDefaultProfileData(tx, createdUser.id);

			return createdUser;
		});

		// Send welcome email if email is provided
		if (user.email) {
			const firstName = user.name?.split(' ')[0] || 'Friend';
			await sendWelcomeEmail(user.email, {
				firstName,
				appUrl: process.env.APP_BASE_URL || 'https://swiftdrop.co.ke'
			}).catch(err => {
				// Log email error but don't fail the registration
				console.warn('Failed to send welcome email:', err);
			});
		}

		return res.status(201).json({ user });
	} catch (error) {
		const statusCode = error instanceof Error && 'statusCode' in error ? Number((error as { statusCode?: number }).statusCode) : undefined;
		if (statusCode === 409) {
			return res.status(409).json({ error: error instanceof Error ? error.message : accountExistsMessage });
		}

		console.error('Registration failed:', error);
		return res.status(500).json({ error: 'Registration failed' });
	}
});

authRouter.post('/check-signup', async (req, res) => {
	const parsed = signupAvailabilitySchema.safeParse(req.body);
	if (!parsed.success) {
		return res.status(400).json({ error: 'Invalid signup payload', issues: parsed.error.flatten() });
	}

	const existingUser = await prisma.user.findFirst({
		where: {
			OR: [
				{ email: parsed.data.email },
				{ phone: parsed.data.phone }
			]
		}
	});

	if (existingUser) {
		return res.status(409).json({ error: accountExistsMessage });
	}

	return res.json({ available: true });
});

authRouter.post('/login', async (req, res) => {
	const parsed = authSchema.pick({ email: true }).safeParse(req.body);
	if (!parsed.success) {
		return res.status(400).json({ error: 'Email is required' });
	}

	const user = await prisma.user.findFirst({
		where: { email: parsed.data.email }
	});

	if (!user) {
		return res.status(404).json({ error: 'User not found' });
	}

	return res.json({ user });
});
