import { createTool as mastraCreateTool, type ToolExecutionContext } from '@mastra/core/tools';
import type { InferPublicSchema, PublicSchema } from '@mastra/core/schema';

type SchemaLike = PublicSchema<any> | undefined;
type InferSchema<T extends SchemaLike> = T extends PublicSchema<any> ? InferPublicSchema<T> : unknown;

/** Thrown by a guard to block a tool call. The message is returned to the model as the tool error. */
export class ToolGuardError extends Error {
    constructor(
        readonly code: string,
        message: string,
    ) {
        super(`${code}: ${message}`);
        this.name = 'ToolGuardError';
    }
}

/** Runs before `execute`. Throw a `ToolGuardError` to block the call. */
export type ToolGuard<TInput = any> = (input: TInput, context: ToolExecutionContext<any, any, any>) => void | Promise<void>;

/** Mastra's `createTool` with an extra `guards` option: checks that must pass before `execute` runs. */
export function createTool<
    TId extends string = string,
    TInputSchema extends SchemaLike = undefined,
    TOutputSchema extends SchemaLike = undefined,
    TSuspendSchema extends SchemaLike = undefined,
    TResumeSchema extends SchemaLike = undefined,
    TRequestContext extends Record<string, any> | unknown = unknown,
    TContext extends ToolExecutionContext<InferSchema<TSuspendSchema>, InferSchema<TResumeSchema>, TRequestContext> = ToolExecutionContext<
        InferSchema<TSuspendSchema>,
        InferSchema<TResumeSchema>,
        TRequestContext
    >,
>(
    opts: Parameters<
        typeof mastraCreateTool<TId, TInputSchema, TOutputSchema, TSuspendSchema, TResumeSchema, TRequestContext, TContext>
    >[0] & { guards?: ToolGuard<InferSchema<TInputSchema>>[] },
) {
    const { guards, execute, ...rest } = opts;

    return mastraCreateTool<TId, TInputSchema, TOutputSchema, TSuspendSchema, TResumeSchema, TRequestContext, TContext>({
        ...rest,
        execute:
            execute && guards?.length
                ? async (input, context) => {
                      for (const guard of guards) await guard(input, context);
                      return execute(input, context);
                  }
                : execute,
    } as typeof opts);
}
