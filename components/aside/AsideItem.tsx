/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import Image from "next/image";
import Link from "next/link";
import { BsCircleFill } from "react-icons/bs";

import type { AsideItemProps } from "../../types";

const AsideItem = ({
	endpoint,
	name,
	image,
	online,
	Icon,
	active,
}: AsideItemProps) => {
	return (
		<li>
			<Link href={endpoint}>
				<a
					className="flex w-5/6 items-center gap-3 rounded-r-xl px-5 py-2 transition hover:bg-slate-900"
					style={{
						backgroundColor: active ? "rgb(15 23 42)" : "",
					}}>
					{image ? (
						<div className="relative shrink-0">
							<Image
								className="rounded-full"
								src={image}
								alt="user image"
								width="30"
								height="30"
							/>
							<BsCircleFill
								className="absolute bottom-0 left-0 h-3 w-3"
								style={{
									color: online ? "rgb(34 197 94)" : "rgb(239 68 68)",
								}}
							/>
						</div>
					) : Icon ? (
						<Icon className="h-4 w-4 shrink-0 text-pink-200 lg:h-5 lg:w-5" />
					) : null}
					<span className="text-white lg:text-lg">{name}</span>
				</a>
			</Link>
		</li>
	);
};

export default AsideItem;
