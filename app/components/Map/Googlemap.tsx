import React, { useEffect, useRef, useState } from "react"
import { RestaurantList } from "../Restaurant/RestaurantList"
import { KeywordButton } from "../Parts/KeywordButton"

const INITIALIZE_LAT = 35.68238
const INITIALIZE_LNG = 139.76556
const INITIALIZE_ZOOM = 15
const INITIALIZE_MAP_WIDTH = "100%"
const INITIALIZE_MAP_HEIGHT = "100vh"

type currentLocationProps = {
    currentLocation: { lat: number; lng: number }
};

const GoogleMap: React.FC<{ currentLocation: { lat: number; lng: number } }> = ({ currentLocation }) => {
    const [searchType, setSearchType] = useState<string>("restaurant");
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [location1, setLocation1] = useState<{ lat: number; lng: number } | null>(null);
    const [location2, setLocation2] = useState<{ lat: number; lng: number } | null>(null);
    const [shops, setShops] = useState<google.maps.places.PlaceResult[]>([]);
    const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
    const lineRef = useRef<google.maps.Polyline | null>(null);
    const clickCountRef = useRef<number>(0);

    useEffect(() => {
        if (!mapRef.current) return;

        const initializedMap = new google.maps.Map(mapRef.current, {
            center: { lat: currentLocation?.lat || 35.68238, lng: currentLocation?.lng || 139.76556 },
            zoom: 15,
        });

        setMap(initializedMap);
    }, [currentLocation]);

    const handleToggleType = (type: string) => {
        setSearchType(type);
    };

    const handleDecision = () => {
        if (location1 && location2 && map) {
            const bounds = new google.maps.LatLngBounds();
            bounds.extend({ lat: location1.lat, lng: location1.lng });
            bounds.extend({ lat: location2.lat, lng: location2.lng });

            const service = new google.maps.places.PlacesService(map);
            service.nearbySearch({
                bounds: bounds,
                radius: 100,
                type: searchType,
                language: 'ja',
            }, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    console.log(searchType)
                    if (results) {
                        setShops(results);

                        const newMarkers = results.map(place => {
                            return new google.maps.Marker({
                                position: place.geometry!.location,
                                map: map,
                                title: place.name,
                            });
                        });
                        setMarkers(newMarkers);
                    }
                }
            });
        }
    };

    const handleReset = () => {
        setLocation1(null);
        setLocation2(null);
        setShops([]);
        clickCountRef.current = 0;
        if (lineRef.current) {
            lineRef.current.setMap(null);
        }
        markers.forEach(marker => {
            marker.setMap(null);
        });
        setMarkers([]);
    };

    useEffect(() => {
        if (!map) return;

        map.addListener("click", (event: { latLng: { lat: () => any; lng: () => any } }) => {
            const latitude = event.latLng.lat();
            const longitude = event.latLng.lng();

            clickCountRef.current += 1;

            if (clickCountRef.current === 1) {
                setLocation1({ lat: latitude, lng: longitude });
            } else if (clickCountRef.current === 2) {
                setLocation2({ lat: latitude, lng: longitude });
            }
        });

    }, [map]);

    useEffect(() => {
        if (map && location1 && location2) {
            if (lineRef.current) {
                lineRef.current.setMap(null);
            }
            const lineCoordinates = [
                { lat: location1.lat, lng: location1.lng },
                { lat: location2.lat, lng: location2.lng }
            ];
            const line = new google.maps.Polyline({
                path: lineCoordinates,
                geodesic: true,
                strokeColor: "#FF0000",
                strokeOpacity: 1.0,
                strokeWeight: 2,
                map: map
            });
            lineRef.current = line;
        }
    }, [map, location1, location2]);

    return (
        <div className="relative h-screen">
            <div className="absolute w-full z-20">
                <RestaurantList shops={shops} />
            </div>
            <div className="absolute w-full -z-20">
                <div ref={mapRef} style={{ width: "100%", height: "100vh" }} />
            </div>
            <div className='absolute bottom-28 right-10 z-10'>
                {location1 && location2 && (
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2" onClick={handleDecision}>
                        決定
                    </button>
                )}
                <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded" onClick={handleReset}>
                    リセット
                </button>
            </div>
            <div className="absolute top-1/2 right-0 transform -translate-y-1/2 flex flex-col gap-2">
                <KeywordButton keyword="レストラン" type="restaurant" onToggleType={handleToggleType} />
                <KeywordButton keyword="ラーメン" type="ramen" onToggleType={handleToggleType} />
                <KeywordButton keyword="コーヒー" type="coffee" onToggleType={handleToggleType} />
                <KeywordButton keyword="コンビニ" type="store" onToggleType={handleToggleType} />
            </div>
        </div>
    );
};

export default GoogleMap;

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