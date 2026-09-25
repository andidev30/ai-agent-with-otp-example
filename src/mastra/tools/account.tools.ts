import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

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
    execute: async () => {
        return {
            point: 15
        };
    },
});
