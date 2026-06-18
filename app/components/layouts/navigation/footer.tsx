import { Mail } from "lucide-react";

export const Footer = () => {
	return (
		<footer className="bg-surface text-white pt-20 pb-10">
			<div className="container mx-auto px-6 lg:px-12">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
					{/* Column 1: Logo & Organizer */}
					<div className="flex flex-col gap-6 items-start">
						<img
							src="/svg/logo/2026/logo-white.svg"
							alt="PyCon ID 2026 Logo"
							className="h-12 lg:h-16 object-contain"
						/>
						<div className="flex flex-col gap-2">
							<div className="font-sans font-medium text-lg">
								Organized by :
							</div>
							<div className="flex items-center gap-4">
								<img
									src="/images/logo-python-id-no-text.png"
									alt="Python ID"
									className="h-10 object-contain"
								/>
							</div>
						</div>
					</div>

					{/* Column 2: Contact Us */}
					<div className="flex flex-col gap-4">
						<h3 className="font-sans font-bold text-xl lg:text-2xl">
							Contact Us
						</h3>
						<div className="flex items-center gap-3">
							<Mail className="h-5 w-5" />
							<a
								href="mailto:pycon@python.or.id"
								className="hover:underline font-sans text-sm md:text-base"
							>
								pycon@python.or.id
							</a>
						</div>
						<p className="text-gray-400 font-sans text-sm leading-relaxed max-w-xs">
							PyCon ID 2026 is organized by volunteers, so it may take more time
							for us to reply to inquiries. Thank you for your patience.
						</p>
					</div>

					{/* Column 3: Other */}
					<div className="flex flex-col gap-4">
						<h3 className="font-sans font-bold text-xl lg:text-2xl">Other</h3>
						<ul className="flex flex-col gap-3 font-sans text-gray-300 text-sm md:text-base">
							<li>
								<a
									href="/everybody-pays"
									className="hover:text-white transition-colors"
								>
									Everyone who can, pay
								</a>
							</li>
							<li>
								<a
									href="/call-for-sponsor"
									className="hover:text-white transition-colors"
								>
									Be a Sponsor
								</a>
							</li>
							<li>
								{/* <a
									href="/schedule"
									className="hover:text-white transition-colors"
								>
									Check Schedule
								</a> */}
							</li>
						</ul>
					</div>

					{/* Column 4: About */}
					<div className="flex flex-col gap-4">
						<h3 className="font-sans font-bold text-xl lg:text-2xl">About</h3>
						<ul className="flex flex-col gap-3 font-sans text-gray-300 text-sm md:text-base">
							<li>
								<a
									href="/terms-of-service"
									className="hover:text-white transition-colors"
								>
									Terms of Service
								</a>
							</li>
							<li>
								<a
									href="/privacy-policy"
									className="hover:text-white transition-colors"
								>
									Privacy Policy
								</a>
							</li>
							<li>
								<a
									href="/code-of-conduct"
									className="hover:text-white transition-colors"
								>
									Code of Conduct
								</a>
							</li>
						</ul>
					</div>
				</div>

				{/* Bottom Bar: Social & Copyright */}
				<div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/10 gap-6">
					<div className="flex items-center gap-6">
						<a
							href="https://instagram.com/pythonid"
							target="_blank"
							rel="noreferrer noopener"
							className="opacity-80 hover:opacity-100"
						>
							<img src="/svg/ig.svg" alt="IG" className="size-10" />
						</a>
						<a
							href="https://github.com/pyconid"
							target="_blank"
							rel="noreferrer noopener"
							className="opacity-80 hover:opacity-100"
						>
							<img src="/svg/github.svg" alt="Github" className="size-10" />
						</a>
						<a
							href="https://x.com/id_python"
							target="_blank"
							rel="noreferrer noopener"
							className="opacity-80 hover:opacity-100"
						>
							<img src="/svg/x.svg" alt="X" className="size-10" />
						</a>
						<a
							href="mailto:pycon@python.or.id"
							className="opacity-80 hover:opacity-100"
						>
							<img src="/svg/mail.svg" alt="Email" className="size-10" />
						</a>
					</div>
					<div className="font-sans text-sm text-gray-400">
						© PyCon ID 2026. All rights reserved.
					</div>
				</div>
			</div>
		</footer>
	);
};
