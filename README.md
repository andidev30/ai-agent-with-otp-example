# ai-agent-with-otp-example

A [Mastra](https://mastra.ai) example that shows how to protect agent tools with **guards**: declarative checks that must pass before a tool's `execute` runs.

The demo is a customer care agent. Anyone can browse products, but account tools (balance, tier, points) only run after the user's phone number has been verified with an OTP.

```ts
export const accountBalanceTool = createTool({
    id: 'account_balance',
    description: 'Get Account Balance by Phone Number',
    inputSchema: accountInputSchema,
    outputSchema: z.object({ total: z.number() }),
    guards: [otpVerified],
    execute: async () => ({ total: 1000 }),
});
```

## Why guards

Mastra gives you a few places to block a tool call, and each has a downside for this use case:

| Option | Downside |
| --- | --- |
| Check inside `execute` | Mixes access rules with business logic, repeated in every tool |
| `onInputAvailable` on the tool | Notification only. Errors thrown there are logged and `execute` still runs |
| `hooks.beforeToolCall` on the agent | Works, but the agent has to keep a list of which tool names need protection, and the check only applies to that agent |

With guards, the rule lives on the tool itself. It applies wherever the tool is used (any agent, a workflow, or a direct call), and `execute` stays focused on business logic.

## How it works

- [`src/mastra/tools/create-tool.ts`](src/mastra/tools/create-tool.ts) wraps Mastra's `createTool` and adds a `guards` option. It keeps Mastra's generics, so schema inference and `execute` typing still work.
- Guards run in order before `execute`. A guard blocks the call by throwing; the error message goes back to the model as the tool result, so the agent knows to start the OTP flow.
- Guards are typed against the tool's input schema. Adding `otpVerified` to a tool without `phone_number` is a compile error.
- [`src/mastra/guards/otp.guard.ts`](src/mastra/guards/otp.guard.ts) defines the `otpVerified` guard. `otpVerify` marks a number as verified once the OTP is accepted.

Writing another guard only takes a function:

```ts
import type { ToolGuard } from '../tools/create-tool';

export const withinBusinessHours: ToolGuard = () => {
    const hour = new Date().getHours();
    if (hour < 8 || hour >= 20) throw new Error('CLOSED: Account services are available 08:00-20:00.');
};

// guards: [otpVerified, withinBusinessHours]
```

Tools that use guards must import `createTool` from `./create-tool`, not from `@mastra/core/tools`.

## Project structure

```
src/mastra/
  agents/cs.agent.ts        # customer care agent
  guards/otp.guard.ts       # otpVerified guard + verification store
  tools/create-tool.ts      # createTool with `guards` option
  tools/account.tools.ts    # balance, tier, points (guarded)
  tools/otp.tools.ts        # otp_send, otp_verify
  tools/product.tools.ts    # product list and detail (public)
  index.ts                  # Mastra instance, storage, observability
```

## Get started

Set `GOOGLE_GENERATIVE_AI_API_KEY` in `.env`, then run:

```shell
pnpm install
pnpm run dev
```

Open [http://localhost:4111](http://localhost:4111), select **CS Agent** in Mastra Studio, and try:

1. `What's my balance? My number is 08123456789.` The tool call is blocked and the agent asks you to verify.
2. Ask it to send an OTP, then give it any code. The demo accepts every OTP.
3. Ask for your balance again. The tool now runs.

## Demo limitations

This example keeps things simple to focus on the guard pattern. Don't copy it to production as-is:

- `otp_send` doesn't send anything, and `otp_verify` accepts any code.
- Verification is keyed by phone number and kept in an in-memory `Set`. It resets on restart, and once a number is verified, anyone who types that number passes the guard. In production, key verification by session (for example `context.agent.threadId`), store it server-side with a TTL, and read the verified number from context instead of from tool input.

## Storage

Agent memory is stored in `file:./mastra.db` by default. To use Turso, set `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` in `.env`. Observability data is stored locally in DuckDB.
