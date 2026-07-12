import { z } from "zod";

export const patronTierSchema = z.enum([
	"ultimate",
	"platinum",
	"gold",
	"silver",
]);

export type PatronTier = z.infer<typeof patronTierSchema>;

export const patronListResponseItemSchema = z.object({
	id: z.string(),
	name: z.string(),
	tier: z.string(),
	has_image: z.boolean(),
});

export type PatronListResponseItem = z.infer<
	typeof patronListResponseItemSchema
>;

export const patronListResponseSchema = z.object({
	results: z.array(patronListResponseItemSchema),
});

export type PatronListResponse = z.infer<typeof patronListResponseSchema>;

export const patronResponseItemSchema = z.object({
	id: z.string(),
	name: z.string(),
	tier: z.string(),
});

export type PatronResponseItem = z.infer<typeof patronResponseItemSchema>;

export const patronCreateSchema = z.object({
	name: z.string(),
	tier: patronTierSchema,
	image: z.instanceof(File).nullable().optional(),
});

export type PatronCreate = z.infer<typeof patronCreateSchema>;

export const patronUpdateSchema = patronCreateSchema;

export type PatronUpdate = z.infer<typeof patronUpdateSchema>;
