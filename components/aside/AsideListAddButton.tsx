/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import Link from "next/link";
import { BsPlusCircleFill } from "react-icons/bs";

import type { AsideListAddButtonProps } from "../../types";

const AsideListAddButton = ({ text, endpoint }: AsideListAddButtonProps) => {
	return (
		<div className="mb-2 flex items-center justify-between gap-4 px-4 py-2">
			<span className="capitalize text-neutral-100 lg:text-lg">{text}</span>
			<Link href={endpoint}>
				<a>
					<BsPlusCircleFill className="h-4 w-4 text-pink-200 opacity-80 transition hover:opacity-100 lg:h-5 lg:w-5" />
				</a>
			</Link>
		</div>
	);
};

export default AsideListAddButton;
