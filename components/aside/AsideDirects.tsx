/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useQuery } from "react-query";
import axios from "axios";

import type { UserDocument, DirectDocument } from "../../types";
import { AsideListAddButton, AsideItem } from ".";

const AsideDirects = () => {
	const router = useRouter();
	const { data: session } = useSession();
	const { data: list, status } = useQuery<DirectDocument[]>(
		"directs",
		async () => {
			const res = await axios(`/api/users/${session?.id}/directs`);
			return res.data.data.directs;
		}
	);

	return (
		<div>
			<AsideListAddButton text="direct messages" endpoint="/?add=directs" />
			{status === "loading" ? (
				<span className="px-4 capitalize text-pink-200 lg:text-lg">
					fetching...
				</span>
			) : !list?.length ? (
				<span className="p-4 text-pink-200 lg:text-lg">No users found</span>
			) : (
				<ul className="mr-1 max-h-52 space-y-1 overflow-auto">
					{list.map(d => {
						const otherUser =
							session?.id === (d.user1 as UserDocument)._s ? d.user2 : d.user1;
						return (
							<AsideItem
								key={d._id}
								endpoint={`/?direct=${d._id}`}
								name={(otherUser as UserDocument).name as unknown as string}
								image={(otherUser as UserDocument).image as unknown as string}
								online={
									(otherUser as UserDocument).online as unknown as boolean
								}
								active={
									router.query.direct && d._id && router.query.direct === d._id
								}
							/>
						);
					})}
				</ul>
			)}
		</div>
	);
};

export default AsideDirects;
