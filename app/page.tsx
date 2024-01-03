"use client";
import { useState } from "react";
import { ShowMap } from "./components/Map/ShowMap";
import { DrawLine } from "./components/Map/DrawLine";
import KeywordButton from "./components/Parts/KeywordButton";
import { LocateButton } from "./components/Parts/LocateButton";
import { Button } from "@material-tailwind/react";
import CloseIcon from '@mui/icons-material/Close';
import EditLocationAltIcon from '@mui/icons-material/EditLocationAlt';

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

	const [open, setOpen] = useState<boolean>(false);

	const toggleDrawMode = () => {
		setOpen(!open);
	}

	return (
		<>
			<div className="relative">
				<ShowMap />
				<div className="absolute top-0 right-0">
					<div className="">
						<Button
							variant="gradient"
							color="green"
							className="absolute top-4 right-4 z-10"
							size="md"
							placeholder={undefined}
							onClick={toggleDrawMode} 						>
							{open ? <CloseIcon /> : <EditLocationAltIcon />}
						</Button>

					</div>
					{open &&
						<DrawLine />
					}
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
