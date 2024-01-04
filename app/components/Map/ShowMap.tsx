"use client";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { currentLocationProps } from "../../features/types/drawLine";

// APIKEY
const apiKey = process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_MAPS_API_KEY;

export const ShowMap: React.FC<currentLocationProps> = ({
	currentLocation,
}) => {
	const mapStyles = {
		height: "100vh",
		width: "100%",
	};

	const defaultCenter = {
		lat: currentLocation.lat,
		lng: currentLocation.lng,
	};

	return (
		<LoadScript googleMapsApiKey={apiKey || " "}>
			<GoogleMap
				mapContainerStyle={mapStyles}
				zoom={16}
				center={defaultCenter}
			/>
		</LoadScript>
	);
};
