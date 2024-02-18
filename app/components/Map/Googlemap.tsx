import React, { useEffect, useRef, useState } from "react"

const INITIALIZE_LAT = 35.68238
const INITIALIZE_LNG = 139.76556
const INITIALIZE_ZOOM = 15
const INITIALIZE_MAP_WIDTH = "100%"
const INITIALIZE_MAP_HEIGHT = "400px"

type currentLocationProps = {
    currentLocation: { lat: number; lng: number }
};

const GoogleMap: React.FC<currentLocationProps> = ({ currentLocation }) => {
    const mapRef = useRef<HTMLDivElement>(null)
    const [map, setMap] = useState<google.maps.Map | null>(null)
    const [location1, setLocation1] = useState<{ lat: number; lng: number } | null>(null) // First click location
    const [location2, setLocation2] = useState<{ lat: number; lng: number } | null>(null) // Second click location
    const [shops, setShops] = useState<google.maps.places.PlaceResult[]>([])
    const [markers, setMarkers] = useState<google.maps.Marker[]>([]) // State for markers
    const lineRef = useRef<google.maps.Polyline | null>(null) // Ref for the drawn line
    const clickCountRef = useRef<number>(0) // Ref for click count

    useEffect(() => {
        // マップの初期化
        if (!mapRef.current) return

        const initializedMap = new google.maps.Map(mapRef.current, {
            center: { lat: currentLocation?.lat || INITIALIZE_LAT, lng: currentLocation?.lng || INITIALIZE_LNG },
            zoom: INITIALIZE_ZOOM,
        })

        setMap(initializedMap)
    }, [currentLocation])

    const handleDecision = () => {
        if (location1 && location2 && map) { // Check if map is initialized
            const bounds = new google.maps.LatLngBounds()
            bounds.extend({ lat: location1.lat, lng: location1.lng })
            bounds.extend({ lat: location2.lat, lng: location2.lng })

            const service = new google.maps.places.PlacesService(map)
            service.nearbySearch({
                bounds: bounds,
                radius: 100,
                type: "restaurant",
            }, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    if (results) {
                        setShops(results)

                        // レストランの位置にマーカーを追加
                        const newMarkers = results.map(place => {
                            return new google.maps.Marker({
                                position: place.geometry!.location,
                                map: map,
                                title: place.name,
                            })
                        })
                        setMarkers(newMarkers)
                    }
                }
            })
        }
    }

    const handleReset = () => {
        setLocation1(null)
        setLocation2(null)
        setShops([])
        clickCountRef.current = 0 // Reset click count
        if (lineRef.current) {
            lineRef.current.setMap(null) // Clear existing line
        }
        // Remove markers
        markers.forEach(marker => {
            marker.setMap(null)
        })
        setMarkers([])
    }

    useEffect(() => {
        // マップ上のクリックイベント
        if (!map) return

        map.addListener("click", (event: { latLng: { lat: () => any; lng: () => any } }) => {
            const latitude = event.latLng.lat()
            const longitude = event.latLng.lng()

            clickCountRef.current += 1

            if (clickCountRef.current === 1) {
                setLocation1({ lat: latitude, lng: longitude })
            } else if (clickCountRef.current === 2) {
                setLocation2({ lat: latitude, lng: longitude })
            }
        })

    }, [map])

    useEffect(() => {
        // 直線を描画
        if (map && location1 && location2) {
            if (lineRef.current) {
                lineRef.current.setMap(null) // Clear existing line
            }
            const lineCoordinates = [
                { lat: location1.lat, lng: location1.lng },
                { lat: location2.lat, lng: location2.lng }
            ]
            const line = new google.maps.Polyline({
                path: lineCoordinates,
                geodesic: true,
                strokeColor: "#FF0000",
                strokeOpacity: 1.0,
                strokeWeight: 2,
                map: map
            })
            lineRef.current = line
        }
    }, [map, location1, location2])

    return (
        <div>
            <div ref={mapRef} style={{ width: INITIALIZE_MAP_WIDTH, height: INITIALIZE_MAP_HEIGHT }} />
            {location1 && (
                <div className="mx-5 my-5">
                    <h2 className="underline text-lg mb-3 font-bold">位置情報 1</h2>
                    <p>緯度: {location1.lat}</p>
                    <p>経度: {location1.lng}</p>
                </div>
            )}
            {location2 && (
                <div className="mx-5 my-5">
                    <h2 className="underline text-lg mb-3 font-bold">位置情報 2</h2>
                    <p>緯度: {location2.lat}</p>
                    <p>経度: {location2.lng}</p>
                </div>
            )}
            {shops.length > 0 && (
                <div className="mx-5 mb-5">
                    <h2 className="underline text-lg mb-3 font-bold">近くの店舗</h2>
                    <ul className="list-disc list-inside">
                        {shops.map((shop, index) => (
                            <li key={index}>{shop.name}</li>
                        ))}
                    </ul>
                </div>
            )}
            {location1 && location2 && (
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2" onClick={handleDecision}>
                    決定
                </button>
            )}
            <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded" onClick={handleReset}>
                リセット
            </button>
        </div>
    )
}

export default GoogleMap



// import React, { useEffect, useRef, useState } from "react";
// import { LatLng } from "../../types/drawLine";

// const INITIALIZE_ZOOM = 15;
// const INITIALIZE_MAP_WIDTH = "100%";
// const INITIALIZE_MAP_HEIGHT = "100vh";

// type GoogleMapProps = {
//     currentLocation: { lat: number; lng: number };
//     drawLinePositions: LatLng[][];
// }

// const GoogleMap: React.FC<GoogleMapProps> = ({ currentLocation, drawLinePositions }) => {
//     const mapRef = useRef<HTMLDivElement>(null);
//     const [map, setMap] = useState<google.maps.Map | null>(null);
//     const [shops, setShops] = useState<google.maps.places.PlaceResult[]>([]);

//     useEffect(() => {
//         if (!mapRef.current) return;

//         const initializedMap = new google.maps.Map(mapRef.current, {
//             center: { lat: currentLocation?.lat || 35.68238, lng: currentLocation?.lng || 139.76556 },
//             zoom: INITIALIZE_ZOOM,
//         });

//         setMap(initializedMap);
//     }, [currentLocation]);

//     // useEffect(() => {
//     //     if (!map || !drawLinePositions || drawLinePositions.length === 0) return;

//     //     const searchNearbyPlaces = async (positions: LatLng[][]) => {
//     //         const newShops: google.maps.places.PlaceResult[] = [];
//     //         let requestsCompleted = 0;
//     //         let requestCount = 0;

//     //         for (const positionArray of positions) {
//     //             for (const { lat, lng } of positionArray) {
//     //                 console.log("Searching for coordinates:", lat, lng);
//     //                 const service = new google.maps.places.PlacesService(map);
//     //                 const request = {
//     //                     location: { lat: parseFloat(lat.toFixed(6)), lng: parseFloat(lng.toFixed(6)) },
//     //                     radius: 100,
//     //                     type: "restaurant",
//     //                 };
//     //                 requestCount++
//     //                 const results = await new Promise<google.maps.places.PlaceResult[]>((resolve) => {
//     //                     service.nearbySearch(request, (results, status) => {
//     //                         if (status === google.maps.places.PlacesServiceStatus.OK && results) {
//     //                             resolve(results);
//     //                         } else {
//     //                             resolve([]);
//     //                         }
//     //                     });
//     //                 });
//     //                 results.forEach(shop => {
//     //                     if (shop.geometry && shop.geometry.location) {
//     //                         if (!newShops.some(existingShop => existingShop.name === shop.name)) {
//     //                             newShops.push(shop);
//     //                             const marker = new google.maps.Marker({
//     //                                 position: { lat: shop.geometry.location.lat(), lng: shop.geometry.location.lng() },
//     //                                 map: map,
//     //                                 title: shop.name,
//     //                             });
//     //                         }
//     //                     }
//     //                 });
//     //             }
//     //             requestsCompleted++;
//     //             if (requestsCompleted === drawLinePositions.length) {
//     //                 console.log(requestCount);
//     //                 setShops(newShops);
//     //             }
//     //         }
//     //     };

//     //     searchNearbyPlaces(drawLinePositions);

//     //     return () => {
//     //         // Clean-up function
//     //     };
//     // }, [map, drawLinePositions]);

//     // useEffect(() => {
//     //     if (shops.length > 0) {
//     //         const shopLogs = shops.map((shop, index) => `${index + 1}. ${shop.name}`).join("\n");
//     //         console.log("Unique shops:\n", shopLogs);
//     //     }
//     // }, [shops]);

//     return (
//         <div>
//             <div ref={mapRef} style={{ width: INITIALIZE_MAP_WIDTH, height: INITIALIZE_MAP_HEIGHT }} />
//         </div>
//     );
// };

// export default GoogleMap;