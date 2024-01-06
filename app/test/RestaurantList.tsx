import axios from 'axios';

const apiKey = process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_MAPS_API_KEY;

const getNearbyRestaurants = async (location: { lat: number; lng: number }) => {
	const radius = 1000;

	const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json
					?keyword=cruise
					&location=${location.lat}%2C${location.lng}
					&radius=${radius}
					&type=restaurant
					&key=${apiKey}`;

	try {
		const response = await axios.get(url);
		const results = response.data;
		return results;
	} catch (error) {
		console.log('Error fetching nearby restaurants:', error);
		return [];
	}
};

export const RestaurantList = async () => {
	// 東京駅の座標
	const tokyoStation = { lat: 35.681236, lng: 139.767125 };

	console.log('Fetching nearby restaurants for Tokyo Station...');
	const tokyoRestaurants = await getNearbyRestaurants(tokyoStation);
	console.log(tokyoRestaurants);

	return (
		<>
			
		</>
	);
};
