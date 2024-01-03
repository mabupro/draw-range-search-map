import { DrawLine } from "./components/Map/DrawLine";
import { ShowMap } from "./components/Map/ShowMap";
import KeywordButton from "./components/Parts/KeywordButton";

const array: string[] = ["レストラン", "ラーメン", "コーヒー", "コンビニ"];

export default function Home() {
	return (
		<>
			<div className="relative">
				<ShowMap />
				<DrawLine />
				<div className="absolute top-1/2 right-0 flex flex-col gap-2">
					{array.map((val, index) => (
						<KeywordButton key={index} keyword={val} index={index} />
					))}
				</div>
			</div>
		</>
	);
}
