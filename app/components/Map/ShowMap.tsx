"use client";
import { GoogleMap, LoadScript } from "@react-google-maps/api";

const apiKey = process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_MAPS_API_KEY;

export const ShowMap = () => {
	const mapStyles = {
		height: "100vh",
		width: "100%",
	};

	const defaultCenter = {
		lat: 35.681236,
		lng: 139.767125,
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
