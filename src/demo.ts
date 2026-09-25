// Runs the guarded tools directly, without an agent or an LLM API key.
import { noopObserve } from '@mastra/core/tools';
import { accountBalanceTool } from './mastra/tools/account.tools';
import { otpVerify } from './mastra/tools/otp.tools';

const input = { phone_number: '08123456789' };
const context = { observe: noopObserve };

const run = async (label: string) => {
    try {
        console.log(`${label}:`, await accountBalanceTool.execute!(input, context));
    } catch (error) {
        console.log(`${label}: blocked ->`, (error as Error).message);
    }
};

await run('1. balance before OTP');
await otpVerify.execute!({ ...input, otp: '123456' }, context);
console.log('2. OTP verified for', input.phone_number);
await run('3. balance after OTP');
