import { z } from "zod";

export const updateProductPatchSchema = z.array(
  z.object({
    op: z.literal("replace"),
    path: z.enum(["/name", "/description", "/stock", "/price", "/isActive"]),
    value: z.union([z.string(), z.number(), z.boolean()]),
  })
);

export type UpdateProductPatchDto = z.infer<typeof updateProductPatchSchema>;
