import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { accountBalanceTool, accountPointTool, accountRedeemPointTool, accountTierTool } from '../tools/account.tools';
import { otpSend, otpVerify } from '../tools/otp.tools';
import { productDetail, productList } from '../tools/product.tools';

export const csAgent = new Agent({
  id: 'cs-agent',
  name: 'CS Agent',
  description: 'Customer Care agent for account info and product questions',
  metadata: {
    suggestedPrompts: [
      'My Balance?',
      'Account Tier?',
      'My Point?',
      'Product List?',
    ],
  },
  instructions: 'You are a friendly and helpful Customer Care agent',
  model: 'google/gemini-3.8-flash',
  memory: new Memory(),
  tools: {
    otpSend,
    otpVerify,
    accountBalanceTool,
    accountTierTool,
    accountPointTool,
    accountRedeemPointTool,
    productList,
    productDetail,
  },
});
