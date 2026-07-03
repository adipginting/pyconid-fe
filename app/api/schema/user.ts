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

export const getUserDetailSchema = z.object({
	profile_picture: z.string().nullable(),
	first_name: z.string().nullable(),
	last_name: z.string().nullable(),
	job_category: z.string().nullable(),
	job_title: z.string().nullable(),
	country: z
		.object({
			id: z.number(),
			name: z.string(),
		})
		.nullable(),
	bio: z.string().nullable(),
	participant_type: z.string().nullable(),
	coc_acknowledged: z.boolean().nullable(),
	terms_agreed: z.boolean().nullable(),
	privacy_agreed: z.boolean().nullable(),
	email: z.string().nullable(),
	industry_categories: z.string().nullable(),
	company: z.string().nullable(),
	experience: z.number().nullable(),
	t_shirt_size: z.string().nullable(),
	gender: z.string().nullable(),
	date_of_birth: z.string().nullable(),
	phone: z.string().nullable(),
	state: z
		.object({
			id: z.number(),
			name: z.string(),
		})
		.nullable(),
	city: z
		.object({
			id: z.number(),
			name: z.string(),
		})
		.nullable(),
	zip_code: z.string().nullable(),
	address: z.string().nullable(),
	interest: z.array(z.string()).nullable(),
	looking_for: z.string().nullable(),
	expertise: z.array(z.string()).nullable(),
	website: z.string().url().nullable(),
	github_username: z.string().nullable(),
	facebook_username: z.string().nullable(),
	linkedin_username: z.string().nullable(),
	twitter_username: z.string().nullable(),
	instagram_username: z.string().nullable(),
	share_my_email_and_phone_number: z.boolean().nullable(),
	share_my_job_and_company: z.boolean().nullable(),
	share_my_location: z.boolean().nullable(),
	share_my_interest: z.boolean().nullable(),
	share_my_public_social_media: z.boolean().nullable(),
	share_my_data_to_sponsor: z.boolean().nullable(),
	retain_my_data_for_next_pycon: z.boolean().nullable(),
	attendance_day_1: z.boolean().nullable(),
	attendance_day_2: z.boolean().nullable(),
	attendance_day_1_at: z.string().nullable(),
	attendance_day_2_at: z.string().nullable(),
});

export type GetUserDetailSchema = z.infer<typeof getUserDetailSchema>;
