import type { Comp } from "../types";

import compTickers from "@/assets/company_tickers.json";

export function SearchTicker() {

	const [searchedComps, setSearchedComps] = useState<Comp[]>([]);

	const tickerFormHandler = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const form = event.currentTarget;
		const formData = new FormData(form);
		const ticker = String(formData.get("ticker"));

		await chrome.tabs.update({ url: `https://finviz.com/quote.ashx?t=${ticker}` });
		// await chrome.runtime.sendMessage({ ticker: ticker})
		window.close();
	};

	function debounceSearch(e: React.ChangeEvent<HTMLInputElement>) {
		setTimeout(() => {
			const query = e.target.value.toLowerCase()
			if (query === "") {
				setSearchedComps([]);
				return
			}
			let result = Object.values(compTickers).filter(comp => {
				return comp.ticker.toLowerCase().includes(query) || comp.title.toLowerCase().includes(query)
			})
			setSearchedComps(result);
		}, 800)
	}

	return (
		<div className="flex items-center gap-3 ">
			<form
				id="tickerForm"
				onSubmit={tickerFormHandler}
				className="flex gap-3 justify-between w-max"
			>
				<input
					id="tickerInput"
					type="text"
					name="ticker"
					placeholder="Enter Ticker"
					className=" rounded min-w-48"
					required
					onChange={(e) => debounceSearch(e)}
				/>

				{searchedComps && searchedComps.length > 0 && (
					<div className="absolute bg-white dark:bg-slate-700 text-slate-800 dark:text-gray-300 border rounded mt-12 max-h-60 overflow-y-auto z-10">
						{searchedComps.map((result, index) => (
							<div
								key={result.cik_str + index}
								className="p-2 hover:bg-green-200 cursor-pointer"
								onClick={(e) => {
									const input = document.getElementById("tickerInput") as HTMLInputElement
									if (input) {
										input.value = result.ticker;
										setSearchedComps([])
									}
								}}
							>
								{result.title}
							</div>
						))}
					</div>
				)}
				<button type="submit">Search by Ticker</button>
			</form>

		</div>
	);
}