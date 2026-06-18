import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useSubmit } from "react-router";
import { toast } from "sonner";
import {
	cities as citiesApi,
	countries as countriesApi,
	states as statesApi,
} from "~/api/endpoint/.client/locations";
import {
	citiesSchema,
	countriesSchema,
	statesSchema,
} from "~/api/schema/locations";
import type {
	GetUserProfileSchema,
	IndustriesSchema,
	JobsSchema,
} from "~/api/schema/user_profile";
import { Footer } from "~/components/layouts/navigation/footer";
import { Hero } from "~/components/shared/hero/hero";
import { parseProfileImage } from "~/lib/utils";
import { useRootLoaderData } from "~/root";
import type { UserProfileActionData } from "~/routes/auth/user-profile";
import { Checkbox } from "../dashboard/checkbox";
import { Dropdown } from "../dashboard/dropdown";
import { DropdownSearch } from "../dashboard/dropdownSearch";
import { Input } from "../dashboard/input";
import { Textarea } from "../dashboard/textarea";

type SectionKey = "account" | "jobs" | "address" | "social" | "participant";

export const UserProfileSection = ({
	userProfile,
	industries,
	jobs,
	actionData,
}: {
	userProfile: GetUserProfileSchema;
	industries: IndustriesSchema;
	jobs: JobsSchema;
	actionData: UserProfileActionData | undefined;
}) => {
	const submit = useSubmit();
	const rootData = useRootLoaderData();

	useEffect(() => {
		if (actionData?.success === true) {
			toast.success("Profile updated successfully!");
		} else if (actionData?.success === false && actionData?.clientError) {
			const errorList = actionData.clientError.errors as Array<{
				field: string;
				message: string;
			}>;
			if (errorList && errorList.length > 0) {
				toast.error(
					<div className="flex flex-col gap-1">
						<p className="font-semibold">
							{actionData.clientError.message ||
								"Invalid data, please check the form fields."}
						</p>
						<ul className="list-disc pl-4 text-sm">
							{errorList.map((e) => (
								<li key={e.field}>
									<strong>{e.field}:</strong> {e.message}
								</li>
							))}
						</ul>
					</div>,
				);
			} else {
				toast.error(
					actionData.clientError.message ||
						"Invalid data, please check the form fields.",
				);
			}
		} else if (actionData?.success === false && actionData?.errors) {
			toast.error("There are problem on the server, please try again later.");
		}
	}, [actionData]);

	const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>(
		{
			account: true,
			jobs: true,
			address: true,
			social: true,
			participant: true,
		},
	);

	const toggleSection = (key: SectionKey) => {
		setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
	};

	// Static dropdown items — memoized to prevent unnecessary re-renders
	const tShirtSizes = useMemo(
		() => [
			{ label: "S", value: "S" },
			{ label: "M", value: "M" },
			{ label: "L", value: "L" },
			{ label: "XL", value: "XL" },
			{ label: "XXL", value: "XXL" },
			{ label: "XXXL", value: "XXXL" },
			{ label: "4XL", value: "4XL" },
		],
		[],
	);
	const genderOptions = useMemo(
		() => [
			{ label: "Male", value: "Male" },
			{ label: "Female", value: "Female" },
			{ label: "Prefer Not To Say", value: "Prefer Not To Say" },
		],
		[],
	);

	// Date of birth format helper
	const formatDateForInput = (dateStr: string | null): string => {
		if (!dateStr) return "";
		// Already YYYY-MM-DD
		if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
		// ISO string: extract YYYY-MM-DD portion
		if (dateStr.includes("T")) {
			return dateStr.split("T")[0];
		}
		// DD/MM/YYYY or other formats — try Date.parse
		const d = new Date(dateStr);
		if (Number.isNaN(d.getTime())) return "";
		const yyyy = d.getFullYear();
		const mm = String(d.getMonth() + 1).padStart(2, "0");
		const dd = String(d.getDate()).padStart(2, "0");
		return `${yyyy}-${mm}-${dd}`;
	};

	// File upload
	const [previewImg, setPreviewImg] = useState<string | null>(null);
	const [file, setFile] = useState<File | null>(null);

	const onImageChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
		const images = evt.target?.files ?? [];
		if (images.length > 0) {
			if (images[0] && images[0].size > 5 * 1024 * 1024) {
				return toast.error("File size must be less than 5MB");
			}
			setFile(images[0]);
			const fr = new FileReader();
			fr.onload = () => {
				setPreviewImg(fr.result?.toString() ?? null);
			};
			fr.readAsDataURL(images[0]);
		}
	};

	useEffect(() => {
		if (userProfile?.profile_picture) {
			setPreviewImg(parseProfileImage({ token: rootData.credentials?.token }));
		}
	}, [userProfile, rootData?.credentials]);

	// Checkboxes
	const [shareEmailPhone, setShareEmailPhone] = useState(
		userProfile.share_my_email_and_phone_number ?? false,
	);
	const [shareJobCompany, setShareJobCompany] = useState(
		userProfile.share_my_job_and_company ?? false,
	);
	const [shareLocation, setShareLocation] = useState(
		userProfile.share_my_location ?? false,
	);
	const [shareSocial, setShareSocial] = useState(
		userProfile.share_my_public_social_media ?? false,
	);
	const [shareDataToSponsor, setShareDataToSponsor] = useState(
		userProfile.share_my_data_to_sponsor ?? false,
	);
	const [retainData, setRetainData] = useState(
		userProfile.retain_my_data_for_next_pycon ?? false,
	);
	const [cocAcknowledged, setCocAcknowledged] = useState(
		userProfile.coc_acknowledged ?? false,
	);
	const [termsAgreed, setTermsAgreed] = useState(
		userProfile.terms_agreed ?? false,
	);
	const [privacyAgreed, setPrivacyAgreed] = useState(
		userProfile.privacy_agreed ?? false,
	);

	// Country/State/City
	const [selectedCountry, setSelectedCountry] = useState<{
		label: string;
		value: string;
	} | null>(
		userProfile.country
			? {
					label: userProfile.country.name,
					value: userProfile.country.id.toString(),
				}
			: null,
	);
	const [searchCountry, setSearchCountry] = useState<{
		search: null | string;
		limit: number;
	}>({
		search: null,
		limit: 20,
	});
	const {
		data: dataCountry,
		isLoading: isLoadingCountry,
		isError: isErrorCountry,
	} = useQuery({
		queryKey: ["countries", searchCountry],
		queryFn: async () => {
			const res = await countriesApi(searchCountry);
			const data = await res.json();
			return countriesSchema.parseAsync(data);
		},
		retry: false,
	});

	const [selectedState, setSelectedState] = useState<{
		label: string;
		value: string;
	} | null>(
		userProfile.state
			? {
					label: userProfile.state.name,
					value: userProfile.state.id.toString(),
				}
			: null,
	);
	const [searchStates, setSearchStates] = useState<{
		search: null | string;
		country_id: number;
		limit: number;
	}>({
		search: null,
		country_id: userProfile.country?.id ?? 0,
		limit: 20,
	});
	const {
		data: dataStates,
		isLoading: isLoadingStates,
		isError: isErrorStates,
	} = useQuery({
		queryKey: ["states", searchStates, selectedCountry?.value],
		queryFn: async () => {
			const country_id = parseInt(selectedCountry?.value || "0");
			const res = await statesApi({
				...searchStates,
				country_id: Number.isNaN(country_id) ? 0 : country_id,
			});
			const data = await res.json();
			return statesSchema.parseAsync(data);
		},
		enabled: !!selectedCountry?.value,
		retry: false,
	});

	const [selectedCity, setSelectedCity] = useState<{
		label: string;
		value: string;
	} | null>(
		userProfile.city
			? {
					label: userProfile.city.name,
					value: userProfile.city.id.toString(),
				}
			: null,
	);
	const [searchCities, setSearchCities] = useState<{
		search: null | string;
		country_id: number;
		state_id: number;
		limit: number;
	}>({
		search: null,
		country_id: userProfile.country?.id ?? 0,
		state_id: userProfile.state?.id ?? 0,
		limit: 20,
	});
	const {
		data: dataCities,
		isLoading: isLoadingCities,
		isError: isErrorCities,
	} = useQuery({
		queryKey: ["cities", searchCities, selectedState?.value],
		queryFn: async () => {
			const state_id = parseInt(selectedState?.value || "0");
			const country_id = parseInt(selectedCountry?.value || "0");
			const res = await citiesApi({
				...searchCities,
				state_id: Number.isNaN(state_id) ? 0 : state_id,
				country_id: Number.isNaN(country_id) ? 0 : country_id,
			});
			const data = await res.json();
			return citiesSchema.parseAsync(data);
		},
		enabled: !!selectedState?.value && !!selectedCountry?.value,
		retry: false,
	});

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);

		if (!formData.has("share_my_email_and_phone_number")) {
			formData.append("share_my_email_and_phone_number", "false");
		}
		if (!formData.has("share_my_job_and_company")) {
			formData.append("share_my_job_and_company", "false");
		}
		if (!formData.has("share_my_location")) {
			formData.append("share_my_location", "false");
		}
		if (!formData.has("share_my_public_social_media")) {
			formData.append("share_my_public_social_media", "false");
		}
		if (!formData.has("share_my_data_to_sponsor")) {
			formData.append("share_my_data_to_sponsor", "false");
		}
		if (!formData.has("retain_my_data_for_next_pycon")) {
			formData.append("retain_my_data_for_next_pycon", "false");
		}
		if (!formData.has("coc_acknowledged")) {
			formData.append("coc_acknowledged", "false");
		}
		if (!formData.has("terms_agreed")) {
			formData.append("terms_agreed", "false");
		}
		if (!formData.has("privacy_agreed")) {
			formData.append("privacy_agreed", "false");
		}

		if (file && file.size > 0) {
			formData.append("profile_picture", file);
		}

		submit(formData, { method: "post", encType: "multipart/form-data" });
	};

	const initials =
		(userProfile.first_name?.charAt(0).toUpperCase() || "") +
		(userProfile.last_name?.charAt(0).toUpperCase() || "");

	return (
		<div className="min-h-[calc(100dvh-120px)]">
			<div className="relative">
				<Hero text="Edit Profile" />
			</div>
			<div className="max-w-[1280px] mx-auto px-6 lg:px-12 py-9">
				<form onSubmit={handleSubmit} className="flex flex-col gap-8">
					{/* Avatar */}
					<div className="flex justify-center">
						<label
							htmlFor="profile_picture"
							className="cursor-pointer relative"
						>
							<input
								type="file"
								id="profile_picture"
								hidden
								onChange={onImageChange}
								accept="image/*"
							/>
							<div className="w-32 h-32 rounded-full border-2 border-[#282828] grid place-items-center text-2xl bg-gray-400 text-white font-bold overflow-hidden">
								{previewImg ? (
									<img
										src={previewImg}
										className="size-full object-cover"
										alt=""
									/>
								) : (
									initials
								)}
							</div>
							<div className="absolute bottom-0 right-0 w-10 h-10 bg-[#282828] rounded-full grid place-items-center border-2 border-white">
								<img
									src="/svg/dashboard/upload-profile-picture.svg"
									alt=""
									width="20"
									height="20"
								/>
							</div>
						</label>
					</div>

					{/* Account Section */}
					<div>
						<a href="/auth/dashboard" className="underline text-blue-500">
							Dashboard
						</a>
					</div>
					<AccordionSection
						title="Account"
						icon={<UserIcon />}
						isOpen={openSections.account}
						onToggle={() => toggleSection("account")}
					>
						<div className="flex flex-col gap-4 pt-2">
							<div className="flex flex-col md:flex-row gap-4">
								<Input
									label="First Name *"
									id="first_name"
									name="first_name"
									placeholder="Enter your first name"
									defaultValue={userProfile.first_name || ""}
									inputClassName="border-[#282828]"
								/>
								<Input
									label="Last Name *"
									id="last_name"
									name="last_name"
									placeholder="Enter your last name"
									defaultValue={userProfile.last_name || ""}
									inputClassName="border-[#282828]"
								/>
							</div>
							<div className="flex flex-col md:flex-row gap-4">
								<Input
									label="Email Address"
									id="email"
									name="email"
									placeholder="e.g: hello@example.com"
									defaultValue={userProfile.email || ""}
									readonly
									inputClassName="border-[#282828]"
								/>
								<Input
									label="Phone Number"
									id="phone"
									name="phone"
									placeholder="+62"
									defaultValue={userProfile.phone || ""}
									inputClassName="border-[#282828]"
								/>
							</div>
							<Checkbox
								id="share_my_email_and_phone_number"
								name="share_my_email_and_phone_number"
								label="Share your email and phone number"
								value={shareEmailPhone}
								onChange={setShareEmailPhone}
								labelClassName="text-sm text-[#282828]"
							/>
							<div className="flex flex-col md:flex-row gap-4">
								<Input
									label="Experience (Years)"
									id="experience"
									name="experience"
									placeholder="Enter years of experience"
									type="number"
									defaultValue={userProfile.experience?.toString() || ""}
									inputClassName="border-[#282828]"
								/>
								<Dropdown
									label="T-Shirt Size"
									id="t_shirt_size"
									name="t_shirt_size"
									placeholder="Choose T-Shirt Size"
									dropdownItems={tShirtSizes}
									value={userProfile.t_shirt_size || ""}
									onChange={() => {}}
									className="[&>div]:border-[#282828]"
								/>
							</div>
							<div className="flex flex-col md:flex-row gap-4">
								<Dropdown
									label="Gender"
									id="gender"
									name="gender"
									placeholder="Choose Gender"
									dropdownItems={genderOptions}
									value={userProfile.gender || ""}
									onChange={() => {}}
									className="[&>div]:border-[#282828]"
								/>
								<Input
									label="Date of Birth"
									id="date_of_birth"
									name="date_of_birth"
									placeholder="24/12/2003"
									type="date"
									defaultValue={formatDateForInput(userProfile.date_of_birth)}
									inputClassName="border-[#282828]"
								/>
							</div>
							<Textarea
								label="Bio / About you *"
								id="bio"
								name="bio"
								placeholder="Tell us about yourself"
								defaultValue={userProfile.bio || ""}
								className="[&>textarea]:border-[#282828]"
							/>
						</div>
					</AccordionSection>

					{/* Jobs Section */}
					<AccordionSection
						title="Jobs"
						icon={<BriefcaseIcon />}
						isOpen={openSections.jobs}
						onToggle={() => toggleSection("jobs")}
					>
						<div className="flex flex-col gap-4 pt-2">
							<div className="flex flex-col md:flex-row gap-4">
								<Input
									label="Job Title *"
									id="job_title"
									name="job_title"
									placeholder="Enter your job title"
									defaultValue={userProfile.job_title || ""}
									inputClassName="border-[#282828]"
								/>
								<Dropdown
									label="Job Categories *"
									id="job_category"
									name="job_category"
									placeholder="Choose Job Categories"
									dropdownItems={jobs.results}
									value={userProfile.job_category || ""}
									onChange={() => {}}
									className="[&>div]:border-[#282828]"
								/>
							</div>
							<div className="flex flex-col md:flex-row gap-4">
								<Input
									label="Company Organization"
									id="company"
									name="company"
									placeholder="Enter your company"
									defaultValue={userProfile.company || ""}
									inputClassName="border-[#282828]"
								/>
								<Dropdown
									label="Industry Categories"
									id="industry_categories"
									name="industry_categories"
									placeholder="Choose Industry Categories"
									dropdownItems={industries.results}
									value={userProfile.industry_categories || ""}
									onChange={() => {}}
									className="[&>div]:border-[#282828]"
								/>
							</div>
							<Checkbox
								id="share_my_job_and_company"
								name="share_my_job_and_company"
								label="Share My Job and Company"
								value={shareJobCompany}
								onChange={setShareJobCompany}
								labelClassName="text-sm text-[#282828]"
							/>
						</div>
					</AccordionSection>

					{/* Address Section */}
					<AccordionSection
						title="Address"
						icon={<MapPinIcon />}
						isOpen={openSections.address}
						onToggle={() => toggleSection("address")}
					>
						<div className="flex flex-col gap-4 pt-2">
							<DropdownSearch
								label="Country *"
								id="country_id"
								name="country_id"
								placeholder="Choose Country"
								dropdownItems={
									dataCountry
										? dataCountry.results.map((item) => ({
												label: item.name,
												value: item.id.toString(),
											}))
										: []
								}
								value={selectedCountry}
								onChange={(value) => {
									setSelectedCountry(value);
									setSelectedState(null);
									setSelectedCity(null);
									setSearchStates((prev) => ({
										...prev,
										country_id: parseInt(value.value) || 0,
									}));
								}}
								searchInputValue={searchCountry.search ?? ""}
								onSearchInputChange={(value) => {
									setSearchCountry((prev) => ({ ...prev, search: value }));
								}}
								isLoading={isLoadingCountry}
								errorMessage={
									isErrorCountry ? "Failed to load countries" : undefined
								}
								className="[&>input]:border-[#282828]"
							/>
							<div className="flex flex-col md:flex-row gap-4">
								<DropdownSearch
									label="State"
									id="state_id"
									name="state_id"
									placeholder="Choose State"
									dropdownItems={
										dataStates
											? dataStates.results.map((item) => ({
													label: item.name,
													value: item.id.toString(),
												}))
											: []
									}
									value={selectedState}
									onChange={(value) => {
										setSelectedState(value);
										setSelectedCity(null);
										setSearchCities((prev) => ({
											...prev,
											state_id: parseInt(value.value) || 0,
										}));
									}}
									searchInputValue={searchStates.search ?? ""}
									onSearchInputChange={(value) => {
										setSearchStates((prev) => ({ ...prev, search: value }));
									}}
									disabled={!selectedCountry}
									isLoading={isLoadingStates}
									errorMessage={
										isErrorStates ? "Failed to load states" : undefined
									}
									className="[&>input]:border-[#282828]"
								/>
								<DropdownSearch
									label="City"
									id="city_id"
									name="city_id"
									placeholder="Choose City"
									dropdownItems={
										dataCities
											? dataCities.results.map((item) => ({
													label: item.name,
													value: item.id.toString(),
												}))
											: []
									}
									value={selectedCity}
									onChange={(value) => {
										setSelectedCity(value);
										setSearchCities((prev) => ({
											...prev,
											search: null,
										}));
									}}
									searchInputValue={searchCities.search ?? ""}
									onSearchInputChange={(value) => {
										setSearchCities((prev) => ({ ...prev, search: value }));
									}}
									disabled={!selectedState || !selectedCountry}
									isLoading={isLoadingCities}
									errorMessage={
										isErrorCities ? "Failed to load cities" : undefined
									}
									className="[&>input]:border-[#282828]"
								/>
							</div>
							<Textarea
								label="Address"
								id="address"
								name="address"
								placeholder="Enter your address"
								defaultValue={userProfile.address || ""}
								className="[&>textarea]:border-[#282828]"
							/>
							<Checkbox
								id="share_my_location"
								name="share_my_location"
								label="Share My Location"
								value={shareLocation}
								onChange={setShareLocation}
								labelClassName="text-sm text-[#282828]"
							/>
						</div>
					</AccordionSection>

					{/* Social Media Section */}
					<AccordionSection
						title="Social Media"
						icon={<GlobeIcon />}
						isOpen={openSections.social}
						onToggle={() => toggleSection("social")}
					>
						<div className="flex flex-col gap-4 pt-2">
							<div className="flex flex-col md:flex-row gap-4">
								<Input
									label="Website / Portfolio"
									id="website"
									name="website"
									placeholder="https://yourwebsite.id"
									defaultValue={userProfile.website || ""}
									inputClassName="border-[#282828]"
								/>
								<Input
									label="Github Username"
									id="github_username"
									name="github_username"
									placeholder="github-username"
									defaultValue={userProfile.github_username || ""}
									inputClassName="border-[#282828]"
								/>
							</div>
							<div className="flex flex-col md:flex-row gap-4">
								<Input
									label="Facebook Username"
									id="facebook_username"
									name="facebook_username"
									placeholder="facebook-username"
									defaultValue={userProfile.facebook_username || ""}
									inputClassName="border-[#282828]"
								/>
								<Input
									label="LinkedIn Username"
									id="linkedin_username"
									name="linkedin_username"
									placeholder="linkedin-username"
									defaultValue={userProfile.linkedin_username || ""}
									inputClassName="border-[#282828]"
								/>
							</div>
							<div className="flex flex-col md:flex-row gap-4">
								<Input
									label="X/Twitter Username"
									id="twitter_username"
									name="twitter_username"
									placeholder="x-username"
									defaultValue={userProfile.twitter_username || ""}
									inputClassName="border-[#282828]"
								/>
								<Input
									label="Instagram Username"
									id="instagram_username"
									name="instagram_username"
									placeholder="instagram-username"
									defaultValue={userProfile.instagram_username || ""}
									inputClassName="border-[#282828]"
								/>
							</div>
							<Checkbox
								id="share_my_public_social_media"
								name="share_my_public_social_media"
								label="Share to Public My Social Media"
								value={shareSocial}
								onChange={setShareSocial}
								labelClassName="text-sm text-[#282828]"
							/>
						</div>
					</AccordionSection>

					{/* Participant Section */}
					<AccordionSection
						title="Participant"
						icon={<UsersIcon />}
						isOpen={openSections.participant}
						onToggle={() => toggleSection("participant")}
					>
						<div className="flex flex-col gap-4 pt-2">
							<Input
								label="Participant Type"
								id="participant_type"
								name="participant_type"
								placeholder="Participant Type"
								defaultValue={userProfile.participant_type || ""}
								readonly
								inputClassName="border-[#282828]"
							/>
							<Checkbox
								id="coc_acknowledged"
								name="coc_acknowledged"
								label={
									<div>
										I acknowledge the{" "}
										<a
											href="/code-of-conduct"
											target="_blank"
											rel="noopener noreferrer"
											className="underline text-blue-500"
										>
											Code of Conduct
										</a>
									</div>
								}
								value={cocAcknowledged}
								onChange={setCocAcknowledged}
								labelClassName="text-sm text-[#282828]"
							/>
							<Checkbox
								id="terms_agreed"
								name="terms_agreed"
								label={
									<div>
										I agree to the{" "}
										<a
											href="/terms-of-service"
											target="_blank"
											rel="noopener noreferrer"
											className="underline text-blue-500"
										>
											Terms of Service
										</a>
									</div>
								}
								value={termsAgreed}
								onChange={setTermsAgreed}
								labelClassName="text-sm text-[#282828]"
							/>
							<Checkbox
								id="privacy_agreed"
								name="privacy_agreed"
								label={
									<div>
										I agree to the{" "}
										<a
											href="/privacy-policy"
											target="_blank"
											rel="noopener noreferrer"
											className="underline text-blue-500"
										>
											Privacy Policy
										</a>
									</div>
								}
								value={privacyAgreed}
								onChange={setPrivacyAgreed}
								labelClassName="text-sm text-[#282828]"
							/>
							<Checkbox
								id="share_my_data_to_sponsor"
								name="share_my_data_to_sponsor"
								label="OPT-IN Share my data to sponsor (optional)"
								value={shareDataToSponsor}
								onChange={setShareDataToSponsor}
								labelClassName="text-sm text-[#282828]"
							/>
							<Checkbox
								id="retain_my_data_for_next_pycon"
								name="retain_my_data_for_next_pycon"
								label="OPT-IN Retain my data for next PyCon ID (optional)"
								value={retainData}
								onChange={setRetainData}
								labelClassName="text-sm text-[#282828]"
							/>
						</div>
					</AccordionSection>

					{/* Save Button */}
					<div className="flex justify-center pt-8 pb-4">
						<button
							type="submit"
							className="flex items-center gap-2 bg-[#282828] text-[#F1F2F3] px-6 py-3 rounded-lg font-medium hover:bg-[#3a3a3a] transition-colors"
						>
							<img
								src="/svg/dashboard/save-changes.svg"
								alt=""
								width="20"
								height="20"
							/>
							Save Changes
						</button>
					</div>
				</form>
			</div>
			<Footer />
		</div>
	);
};

function AccordionSection({
	title,
	icon,
	children,
	isOpen,
	onToggle,
}: {
	title: string;
	icon: React.ReactNode;
	children: React.ReactNode;
	isOpen: boolean;
	onToggle: () => void;
}) {
	return (
		<div className="border border-[#282828] rounded-lg bg-white">
			<button
				type="button"
				onClick={onToggle}
				className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
			>
				<div className="flex items-center gap-3">
					<span className="text-[#282828]">{icon}</span>
					<span className="text-sm font-bold text-[#282828]">{title}</span>
				</div>
				<img
					src="/svg/dashboard/toggle-section.svg"
					alt=""
					width="24"
					height="24"
					className={`text-[#282828] transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`}
				/>
			</button>
			{isOpen && (
				<div className="px-5 pb-5 border-t border-[#282828]">{children}</div>
			)}
		</div>
	);
}

function UserIcon() {
	return (
		<img src="/svg/dashboard/user-icon.svg" alt="" width="20" height="20" />
	);
}

function BriefcaseIcon() {
	return (
		<img
			src="/svg/dashboard/briefcase-icon.svg"
			alt=""
			width="20"
			height="20"
		/>
	);
}

function MapPinIcon() {
	return (
		<img src="/svg/dashboard/map-pin-icon.svg" alt="" width="20" height="20" />
	);
}

function GlobeIcon() {
	return (
		<img src="/svg/dashboard/globe-icon.svg" alt="" width="20" height="20" />
	);
}

function UsersIcon() {
	return (
		<img src="/svg/dashboard/users-icon.svg" alt="" width="20" height="20" />
	);
}
