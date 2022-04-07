/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import Image from "next/image";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

import type { NextPageWithAuth } from "../../types";

const SignIn: NextPageWithAuth = () => {
	return (
		<div className="grid min-h-screen md:grid-cols-2">
			<div className="relative flex flex-col items-center justify-center gap-8 bg-cover py-4 before:absolute before:top-0 before:left-0 before:z-10 before:h-full before:w-full before:bg-white/90">
				<strong className="relative z-20 px-4 text-center text-4xl capitalize text-slate-800">
					welcome to my chat app
				</strong>
				<a
					className="relative z-20 text-2xl font-bold text-slate-800 before:absolute before:-bottom-2 before:left-1/2 before:h-[0.2rem] before:w-0 before:-translate-x-1/2 before:rounded-full before:bg-slate-800 before:transition-all hover:before:w-full"
					href="https://github.com/devmotheg">
					Mohamed Muntasir
				</a>
			</div>
			<div className="flex flex-col items-center justify-center gap-8 bg-slate-900 py-4">
				<strong className="px-4 text-center text-4xl capitalize text-white">
					sign in with
				</strong>
				<ul>
					<li>
						<button
							className="flex items-center gap-2 rounded-full bg-white p-1 text-lg opacity-80 transition hover:opacity-100"
							onClick={() => signIn("google", { redirect: false })}>
							<span className="sr-only">google</span>
							<FcGoogle className="h-16 w-16" />
						</button>
					</li>
				</ul>
			</div>
		</div>
	);
};

SignIn.auth = {
	guestsOnly: true,
};

export default SignIn;
