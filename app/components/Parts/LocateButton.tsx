"use client";
import { Button } from "@material-tailwind/react";

type LocateButtonProps = {
	onLocate: (coords: { lat: number; lng: number }) => void;
};

export const LocateButton: React.FC<LocateButtonProps> = ({ onLocate }) => {
	const handleSearchCurrentLocation = (): void => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					// 現在地の座標が入っているオブジェクト
					const currentLocation = {
						lat: position.coords.latitude,
						lng: position.coords.longitude,
					};
					onLocate({ lat: currentLocation.lat, lng: currentLocation.lng });
				},
				(error) => {
					console.error("Error getting current location:", error);
				}
			);
		} else {
			console.error("Geolocation is not supported by this browser.");
		}
	};

	return (
		<Button
			variant="gradient"
			color="green"
			className="gap-2 bg-white z-10"
			placeholder={undefined}
			size="md"
			onClick={handleSearchCurrentLocation}
		>
			現在地取得
		</Button>
	);
};
