import { z } from 'zod';
import { otpVerified } from '../guards/otp.guard';
import { createTool } from './create-tool';

const accountInputSchema = z.object({
    phone_number: z.string().describe('Phone Number'),
});

export const accountBalanceTool = createTool({
    id: 'account_balance',
    description: 'Get Account Balance by Phone Number',
    inputSchema: accountInputSchema,
    outputSchema: z.object({
        total: z.number().describe('Balance in USD'),
    }),
    guards: [otpVerified],
    execute: async () => {
        return {
            total: 1000
        };
    },
});

export const accountTierTool = createTool({
    id: 'account_tier',
    description: 'Get Account Tier by Phone Number',
    inputSchema: accountInputSchema,
    outputSchema: z.object({
        tier: z.string().describe('Tier Level'),
    }),
    guards: [otpVerified],
    execute: async () => {
        return {
            tier: 'VVIP'
        };
    },
});

export const accountPointTool = createTool({
    id: 'account_point',
    description: 'Get Account Point by Phone Number',
    inputSchema: accountInputSchema,
    outputSchema: z.object({
        point: z.number().describe('Total Point'),
    }),
    guards: [otpVerified],
    execute: async () => {
        return {
            point: 15
        };
    },
});

export const accountRedeemPointTool = createTool({
    id: 'account_redeem_point',
    description: 'Redeem Account Points by Phone Number',
    inputSchema: accountInputSchema.extend({
        point: z.number().describe('Points to redeem'),
    }),
    outputSchema: z.object({
        redeemed: z.number().describe('Redeemed Points'),
    }),
    requireApproval: true,
    guards: [otpVerified],
    execute: async ({ point }) => {
        return {
            redeemed: point
        };
    },
});
