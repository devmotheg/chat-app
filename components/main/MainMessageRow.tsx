/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import type { UserDocument, MainMessageRowProps } from "../../types";
import { MainMessage } from ".";
import messageDate from "../../lib/message-date";

const MainMessageRow = ({ index: i, messages }: MainMessageRowProps) => {
	let notSameDateAsPrev = true;
	if (i - 1 > -1)
		notSameDateAsPrev =
			messageDate(messages[i].createdAt as unknown as string) !==
			messageDate(messages[i - 1].createdAt as unknown as string);

	let notSameDateAsNext = true;
	if (i + 1 < messages.length)
		notSameDateAsNext =
			messageDate(messages[i].createdAt as unknown as string) !==
			messageDate(messages[i + 1].createdAt as unknown as string);

	let notSameUserAsNext = true;
	if (i + 1 < messages.length)
		notSameUserAsNext =
			(messages[i].creator as UserDocument)._s !==
			(messages[i + 1].creator as UserDocument)._s;

	return (
		<div>
			{notSameDateAsPrev && (
				<span className="mx-auto mb-2 block w-fit rounded-full bg-slate-800 px-2 py-1 text-center text-sm font-bold text-pink-200">
					{messageDate(messages[i].createdAt as unknown as string)}
				</span>
			)}
			<MainMessage
				message={messages[i]}
				shouldShowImage={notSameUserAsNext || notSameDateAsNext}
			/>
		</div>
	);
};

export default MainMessageRow;
