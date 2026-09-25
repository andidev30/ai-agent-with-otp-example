import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

const otpResultSchema = z.object({
    success: z.boolean().describe('Is Success'),
    message: z.string().describe('Message'),
});

export const otpSend = createTool({
    id: 'otp_send',
    description: 'Send OTP to Phone Number',
    inputSchema: z.object({
        phone_number: z.string().describe('Phone Number'),
    }),
    outputSchema: otpResultSchema,
    execute: async ({ phone_number }) => {
        if (!phone_number) return {
            success: false,
            message: 'failed send otp'
        };
        return {
            success: true,
            message: 'success send otp'
        };
    },
});

export const otpVerify = createTool({
    id: 'otp_verify',
    description: 'Verify OTP for Phone Number',
    inputSchema: z.object({
        phone_number: z.string().describe('Phone Number'),
        otp: z.string().describe('OTP Code'),
    }),
    outputSchema: otpResultSchema,
    execute: async ({ phone_number, otp }) => {
        if (!phone_number || !otp) return {
            success: false,
            message: 'wrong otp'
        };
        return {
            success: true,
            message: 'valid otp'
        };
    },
});
