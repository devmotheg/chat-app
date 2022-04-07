/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useQuery } from "react-query";
import { BsFillPeopleFill } from "react-icons/bs";
import axios from "axios";

import type { ChannelDocument } from "../../types";
import { AsideListAddButton, AsideItem } from ".";

const AsideChannels = () => {
	const router = useRouter();
	const { data: session } = useSession();
	const { data: list, status } = useQuery<ChannelDocument[]>(
		"channels",
		async () => {
			const res = await axios(`/api/users/${session?.id}/channels`);
			return res.data.data.channels;
		}
	);

	return (
		<div>
			<AsideListAddButton text="channels" endpoint="/?add=channel" />
			{status === "loading" ? (
				<span className="px-4 capitalize text-pink-200 lg:text-lg">
					fetching...
				</span>
			) : !list?.length ? (
				<span className="p-4 text-pink-200 lg:text-lg">No channels found</span>
			) : (
				<ul className="mr-1 max-h-52 space-y-1 overflow-auto">
					{list?.map(c => {
						return (
							<AsideItem
								key={c._id}
								endpoint={`/?channel=${c._id}`}
								name={c.name as unknown as string}
								Icon={BsFillPeopleFill}
								active={
									router.query.channel &&
									c._id &&
									router.query.channel === c._id
								}
							/>
						);
					})}
				</ul>
			)}
		</div>
	);
};

export default AsideChannels;
