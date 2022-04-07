/*!
 * @author Mohamed Muntasir
 * @link https://github.com/devmotheg
 */

import { useState, useEffect } from "react";
import { BsSearch } from "react-icons/bs";

import { AsideResultsDropdown } from ".";

const AsideSearchBar = () => {
	const [search, setSearch] = useState("");
	const [isDropdownVisisble, setIsDropdownVisible] = useState(false);

	useEffect(() => {
		if (!search) return setIsDropdownVisible(false);
		setIsDropdownVisible(true);
	}, [search]);

	return (
		<form
			className="relative mx-4 mb-6 flex flex-row-reverse items-center gap-3 rounded bg-slate-700 p-2"
			spellCheck="false"
			onSubmit={e => e.preventDefault()}>
			<input
				className="lg:plcaeholder:text-lg peer w-full bg-transparent text-white caret-pink-200 outline-0 placeholder:capitalize placeholder:text-white placeholder:transition focus:placeholder:opacity-0 lg:text-lg"
				type="text"
				placeholder="search"
				value={search}
				onChange={e => setSearch(e.target.value)}
			/>
			<BsSearch className="h-4 w-4 text-pink-200 opacity-80 transition peer-focus:opacity-100 lg:h-5 lg:w-5" />
			<AsideResultsDropdown search={search} isVisible={isDropdownVisisble} />
		</form>
	);
};

export default AsideSearchBar;
