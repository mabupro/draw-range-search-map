"use client";
import { DrawLine } from "./components/Map/DrawLine";
import { ShowMap } from "./components/Map/ShowMap";
import KeywordButton from "./components/Parts/KeywordButton";
import { LocateButton } from "./components/Parts/LocateButton";
import { useState } from "react";

const array: string[] = ["レストラン", "ラーメン", "コーヒー", "コンビニ"];

export default function Home() {
	const [currentLocation, setCurrentLocation] = useState({
		lat: 36,
		lng: 139,
	});
	const handleLocationUpdate = (currentLocation: {
		lat: number;
		lng: number;
	}) => {
		setCurrentLocation(currentLocation);
		console.log(currentLocation.lat, currentLocation.lng);
	};

	return (
		<>
			<div className="relative">
				<ShowMap />
				<div className="absolute top-0 right-0">
					<DrawLine />
				</div>
				<div className="absolute top-1/2 right-0 transform -translate-y-1/2 flex flex-col gap-2">
					<LocateButton onLocate={handleLocationUpdate} />
					{array.map((val, index) => (
						<KeywordButton key={index} keyword={val} index={index} />
					))}
				</div>
			</div>
		</>
	);
}
