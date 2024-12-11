import { BASE, ScreenerStorageImpl } from "../storage";
import { Screeners } from "../types";
import { extractTicker } from "./utils";



const ScreenerSaver: React.FC = () => {
	const screenerStorage = new ScreenerStorageImpl(chrome.storage.local);

	const [screeners, setScreeners] = useState<Screeners>({});
	const [currTicker, setCurrTicker] = useState<string>("");
	const [companyUrl, setCompanyUrl] = useState<string>("");
	const [errorMsg, setErrorMsg] = useState("");
	const [secUrl, setSecUrl] = useState("");
	const [isFinvizPage, setIsFinvizPage] = useState(false);



	useEffect(() => {
		(async () => {
			const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
			if (tab.url!.includes("quote.ashx")) {
				setCurrTicker((extractTicker(tab.url!) ?? ""))
				const compPort = chrome.runtime.connect({ name: "comp" })
				compPort.onMessage.addListener(msg => {
					// console.log(`Received from background CoMp`)
					// console.log({msg})
					setSecUrl(msg.url);
					setCompanyUrl(msg.companyUrl)
				})

				// for testing purpose
				// const compPort = chrome.runtime.connect({ name: "comp" })
				// compPort.onMessage.addListener(msg => {
				// 	console.log(`Received from background oMCp`)
				// 	console.log({msg})
				// 	// setSecUrl(msg.url);
				// 	setCompanyUrl(msg.companyUrl)
				// })
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
		const savedScreeners = await screenerStorage.get() as Screeners;
		setScreeners(savedScreeners);
	};

	const favoritesFormHandler = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const form = event.currentTarget;
		const formData = new FormData(form);
		const [tab] = await chrome.tabs.query({ active: true });
		const screener = String(formData.get("screener"));

		const { err } = await screenerStorage.save(screener, tab.url!);
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

	const removeItem = async (event: React.FormEvent<HTMLFormElement>, key: string) => {
		event.preventDefault();
		await screenerStorage.del(key)
		renderList();
	};

	const clearList = () => {
		const confirmation = confirm("The WHOLE list will be wiped, are you sure?!");
		if (confirmation) {
			screenerStorage.clear()
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
			<p id="errorMsg" className=" text-pink-500" aria-label='error-message'> {errorMsg} </p>
			<section className="p-4 m-3 border-2 border-emerald-600 rounded">
				<form
					id="favoritesForm"
					onSubmit={favoritesFormHandler}
					className={`${isFinvizPage ? 'flex justify-evenly items-center' : 'hidden'}`}
				>
					<input
						type="text"
						name="screener"
						id="screener"
						placeholder="Input New Screener"
						className='py-2 rounded'
						required
					/>
					<button type="submit">Save</button>
				</form>

				<h3 className="text-lg font-bold" >Screeners </h3>
				<div className="mt-4 h-48 overflow-y-auto">

					{Object.keys(screeners).length > 0 ? (
						<>
							<ul className="w-full grid grid-cols-2 grid-rows-5 justify-between items-center">
								{Object.entries(screeners).map(([k, v]) => (
									<li key={k} id={`item-${k}`} className="flex gap-3 items-center">
										<form
											className=""
											id={`removeItem-${k}`}
											onSubmit={(e) => removeItem(e, k)}>
											<div className="">
												<a href={v} target="_blank" rel="noopener noreferrer" className="">
													{k}
												</a>
												<button
													type="submit"
													className="hover:border-red-400"
												>
													🗑️
												</button>
											</div>
										</form>
									</li>
								))}
							</ul>
						</>
					) : (
						<div>
							<p>The watchlist is empty :(</p>
							<a href={BASE} target="_blank" rel="noopener noreferrer">
								Go to Finviz Screener
							</a>
						</div>
					)}
				</div>

				{Object.keys(screeners).length > 0 && (
					<button
						id="clear_list"
						onClick={clearList}
						className="mt-4 hover:bg-red-600 hover:text-white rounded"
					>
						Clear List
					</button>
				)}

			</section>
			<section className="m-3 p-4 border-2 border-emerald-600 rounded">

				<div className="flex items-center gap-3">
					<h3 className="text-md font-bold">Comp. Fundamentals</h3>
					<form
						id="tickerForm"
						onSubmit={tickerFormHandler}
						className="flex gap-3"
					>
						<input
							type="text"
							name="ticker"
							placeholder="Enter Ticker"
							className="py-2 rounded"
							required
						/>
						<button type="submit">Search by Ticker</button>
					</form>

				</div>

				{currTicker && (
					<>
						<hr className='my-2' />
						<div className="p-2 m-3 border-b-2 border-emerald-600 rounded">
							<span className="font-semi text-[1.0rem]">{currTicker}: </span>
							<a href={secUrl} target="_blank">  Quarter & Annual Fillings </a>
							 | <a href={companyUrl} target="_blank"> Homepage / IR</a>
						</div>
					</>
				)}
			</section>
		</div>
	);
};

export default ScreenerSaver;