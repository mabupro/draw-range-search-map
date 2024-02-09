"use client"

import { useState } from "react"
import { DrawLine } from "./components/Map/DrawLine"
import KeywordButton from "./components/Parts/KeywordButton"
import { LocateButton } from "./components/Parts/LocateButton"
import { Button } from "@material-tailwind/react"
import CloseIcon from "@mui/icons-material/Close"
import EditLocationAltIcon from "@mui/icons-material/EditLocationAlt"
import GoogleMap from "./components/Map/Googlemap"
import { LatLng } from "./types/drawLine"

const array: string[] = ["レストラン", "ラーメン", "コーヒー", "コンビニ"]

export default function Home() {
	const [currentLocation, setCurrentLocation] = useState({
		lat: 35.681236,
		lng: 139.767125,
	})

	const handleLocationUpdate = (currentLocation: {
		lat: number
		lng: number
	}) => {
		setCurrentLocation(currentLocation)
		console.log(currentLocation.lat, currentLocation.lng)
	}

	const [open, setOpen] = useState<boolean>(false)
	const toggleDrawMode = () => {
		setOpen(!open)
	}

	const [drawLinePositions, setDrawLinePositions] = useState<LatLng[][]>([])
	// 線を引いた座標を保存する
	const handleLatLngSubmit = (drawLinePositions: any) => {
		console.log("Received LatLng Data:", drawLinePositions);
	
		// 配列の中の配列をフィルタリングして抽出
		const updatedData: LatLng[][] = drawLinePositions.map((innerArray: any) => {
			return innerArray.filter((_: any, index: number) => index === 0 || index % 30 === 0);
		});
	
		console.log("Filter LatLng Data:", updatedData);
		setDrawLinePositions(updatedData);
	}	

	return (
		<>
			<div className="relative">
				{/* <GoogleMap currentLocation={currentLocation} /> */}
				<GoogleMap currentLocation={currentLocation} drawLinePositions={drawLinePositions} />
				<div className="absolute top-0 right-0">
					<div className="">
						<Button
							variant="gradient"
							color="green"
							className="absolute top-4 right-4 z-10"
							size="md"
							placeholder={undefined}
							onClick={toggleDrawMode}
						>
							{open ? <CloseIcon /> : <EditLocationAltIcon />}
						</Button>
					</div>
					{open && <DrawLine currentLocation={currentLocation} onLatLngSubmit={handleLatLngSubmit} />}
				</div>
				<div className="absolute top-1/2 right-0 transform -translate-y-1/2 flex flex-col gap-2">
					<LocateButton onLocate={handleLocationUpdate} />
					{array.map((val, index) => (
						<KeywordButton key={index} keyword={val} index={index} />
					))}
				</div>
			</div>
		</>
	)
}
