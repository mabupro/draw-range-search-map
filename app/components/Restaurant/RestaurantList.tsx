"use client";
import { useEffect, useState } from "react";
import { LatLng } from "../../types/drawLine";

const apiKey = process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_MAPS_API_KEY;

type RestaurantListProps = {
	positions: (LatLng | LatLng[])[];
};

type Restaurant = {
	name: string;
	place_id: string;
};

export const ResutaurantList: React.FC<RestaurantListProps> = ({
	positions,
}) => {
	const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				// Google Places API のエンドポイント
				const apiUrl =
					"https://maps.googleapis.com/maps/api/place/nearbysearch/json";

				// API キーと位置情報を設定
				const location: string[] = positions.map(
					(position: any) => `${position.lat},${position.lng}`
				);

				// クエリパラメータを構築
				const queryParams: string[] = location.map(
					(loc) => `location=${loc}&radius=1000&type=restaurant&key=${apiKey}`
				);

				// API リクエストを送信
				const response = await fetch(`${apiUrl}?${queryParams}`);
				const data = await response.json();

				// レスポンスからレストランのリストを取得
				const restaurantList = data.results;
				setRestaurants(restaurantList);
				console.log(positions);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		// fetchData 関数を実行
		fetchData();
	}, [positions]);

	return (
		<div>
			<h1>Nearby Restaurants</h1>
			<ul>
				{restaurants.map((restaurant) => (
					<li key={restaurant.place_id}>{restaurant.name}</li>
				))}
			</ul>
		</div>
	);
};
