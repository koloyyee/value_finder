

interface TabButtonProps {
	onClick: () => void;
	isActive: boolean;
	buttonTitle: string;
}
export function TabButton({ onClick, isActive, buttonTitle }: TabButtonProps) {
	return (
		<button onClick={onClick}
		className={ `tab-button ${isActive ? "bg-blue-950 text-blue-200" : "bg-slate-500 text-slate-400"}`}	
		>
			{buttonTitle}
		</button>
	);
}

export function TabContent({ children }: { children : React.ReactNode}) {
	return (
		<div className="tab-content">
				{children}
		</div>
);
}