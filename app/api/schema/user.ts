import { z } from "zod";

export const userQrSchema = z.object({
	id: z.string(),
	username: z.string().nullable(),
	first_name: z.string().nullable(),
	last_name: z.string().nullable(),
	email: z.string().nullable(),
});

export type UserQrType = z.infer<typeof userQrSchema>;

export const getUserForQrSchema = z.object({
	page: z.number(),
	page_size: z.number(),
	count: z.number(),
	page_count: z.number(),
	results: z.array(userQrSchema),
});

export type GetUserForQrType = z.infer<typeof getUserForQrSchema>;

export const getDetailUserForQrSchema = userQrSchema;

export type GetDetailUserForQrType = z.infer<typeof getDetailUserForQrSchema>;
