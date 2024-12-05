import React, { useEffect, useState } from 'react';
import "./App.css";
import { BASE, local } from "./utils";

interface Screeners {
	[key: string]: string;
}

const FinvizFavorites: React.FC = () => {
	const [screeners, setScreeners] = useState<Screeners>({});
	const [currTicker, setCurrTicker] = useState<string>("");
	const [errorMsg, setErrorMsg] = useState("");
	const [secUrl, setSecUrl] = useState("");
	const [isFinvizPage, setIsFinvizPage] = useState(false);

	useEffect(() => {
		(async () => {
			const [tab] = await chrome.tabs.query({ active: true });
			if (tab.url!.includes("quote.ashx")) {
				const port = chrome.runtime.connect({ name: "ticker" })
				port.onMessage.addListener(msg => {
					setSecUrl(msg.url);
					setCurrTicker(msg.ticker)
				})

				return () => {
					port.disconnect();
				};
			} else {
				setSecUrl("")
				setCurrTicker("")
			}
		})();
	}, [secUrl])



	useEffect(() => {
		const loadPage = async () => {
			const [tab] = await chrome.tabs.query({ active: true });
			if (tab.url?.includes("https://finviz.com/screener.ashx")) {
				setIsFinvizPage(true);
			}
			renderList();
		};

		loadPage();
	}, []);

	const renderList = async () => {
		const savedScreeners = await local.get();
		setScreeners(savedScreeners);
	};

	const favoritesFormHandler = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const form = event.currentTarget;
		const formData = new FormData(form);
		const [tab] = await chrome.tabs.query({ active: true });
		const screener = String(formData.get("screener"));

		const { err } = await local.save(screener, tab.url!);
		if (err !== null) {
			showErrorMsg(err);
		}
		// Reset form
		form.reset();
		renderList();
	};

	const showErrorMsg = (err: string) => {
		setErrorMsg(err);
		setTimeout(() => {
			setErrorMsg("")
		}, 1000)
	}

	const removeItem = async (key: string) => {
		await chrome.storage.local.remove(key);
		renderList();
	};

	const clearList = () => {
		const confirmation = confirm("The WHOLE list will be wiped, are you sure?!");
		if (confirmation) {
			local.clear();
			setScreeners({});
		}
	};

	const tickerFormHandler = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const form = event.currentTarget;
		const formData = new FormData(form);
		const ticker = String(formData.get("ticker"));


		await chrome.tabs.update({ url: `https://finviz.com/quote.ashx?t=${ticker}` });

		// await chrome.runtime.sendMessage({ ticker: ticker})
		window.close();
	};

	return (
		<div>
			{currTicker && (
				<p>
					<a href={secUrl} target="_blank"> {currTicker.toUpperCase()} SEC 10Ks 10Qs</a>
				</p>

			)}
			<p id="errorMsg" className=" text-red-600" aria-label='error-message'> {errorMsg} </p>
			<section>
				<form
					id="favoritesForm"
					onSubmit={favoritesFormHandler}
					className={`${isFinvizPage ? 'flex justify-evenly items-center' : 'hidden'}`}
				>
					<input
						type="text"
						name="screener"
						id="screener"
						placeholder="Screener Name"
						required
					/>
					<button type="submit">Save</button>
				</form>

				<ul id="list" className="mt-4">
					{Object.keys(screeners).length > 0 ? (
						Object.entries(screeners).map(([k, v]) => (
							<li key={k} id={`item-${k}`} className="flex gap-3 items-center">
								<a href={v} target="_blank" rel="noopener noreferrer" className="text-[1.1rem]">
									{k}
								</a>
								<form
									id={`removeItem-${k}`}
									onSubmit={(e) => {
										e.preventDefault();
										removeItem(k);
									}}
								>
									<button
										type="submit"
										className="hover:border-red-400"
									>
										🗑️
									</button>
								</form>
							</li>
						))
					) : (
						<div>
							<p>The watchlist is empty :(</p>
							<a href={BASE} target="_blank" rel="noopener noreferrer">
								Go to Finviz Screener
							</a>
						</div>
					)}
				</ul>

				{Object.keys(screeners).length > 0 && (
					<button
						id="clear_list"
						onClick={clearList}
						className="mt-4 hover:bg-red-600 hover:text-white rounded"
					>
						Clear List
					</button>
				)}
				<hr className='my-4' />
				<form
					id="tickerForm"
					onSubmit={tickerFormHandler}
					className="flex gap-3"
				>
					<input
						type="text"
						name="ticker"
						placeholder="Enter Ticker"
						required
					/>
					<button type="submit">Go to Quote</button>
				</form>

			</section>
		</div>
	);
};

export default FinvizFavorites;