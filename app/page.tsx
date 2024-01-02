import { DrawLine } from "./components/Map/DrawLine";
// import { ShowMap } from "./components/Map/ShowMap";
import KeywordButton from "./components/Parts/KeywordButton";

export default function Home() {
	return (
		<>
			<div>
				{/* <ShowMap /> */}
				<DrawLine />
				<KeywordButton />
			</div>
		</>
	);
}
