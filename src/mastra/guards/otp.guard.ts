import type { ToolGuard } from '../tools/create-tool';

const verifiedMsisdn = new Set<string>();

export const markOtpVerified = (msisdn: string): void => {
    verifiedMsisdn.add(msisdn);
};

export const isOtpVerified = (msisdn: string): boolean => {
    return verifiedMsisdn.has(msisdn);
};

export const otpVerified: ToolGuard<{ phone_number: string }> = ({ phone_number }) => {
    if (!isOtpVerified(phone_number)) {
        throw new Error('UNAUTHENTICATED: Phone number not verified. Ask the user to complete OTP verification first.');
    }
};
