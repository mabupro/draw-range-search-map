import React, { useEffect, useRef, useState } from "react";
import { LatLng } from "../../types/drawLine";

const INITIALIZE_ZOOM = 15;
const INITIALIZE_MAP_WIDTH = "100%";
const INITIALIZE_MAP_HEIGHT = "100vh";

type GoogleMapProps = {
    currentLocation: { lat: number; lng: number };
    drawLinePositions: LatLng[][];
}

const GoogleMap: React.FC<GoogleMapProps> = ({ currentLocation, drawLinePositions }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [shops, setShops] = useState<google.maps.places.PlaceResult[]>([]);

    useEffect(() => {
        if (!mapRef.current) return;

        const initializedMap = new google.maps.Map(mapRef.current, {
            center: { lat: currentLocation?.lat || 35.68238, lng: currentLocation?.lng || 139.76556 },
            zoom: INITIALIZE_ZOOM,
        });

        setMap(initializedMap);
    }, [currentLocation]);

    useEffect(() => {
        if (!map || !drawLinePositions || drawLinePositions.length === 0) return;

        const searchNearbyPlaces = async (positions: LatLng[][]) => {
            const newShops: google.maps.places.PlaceResult[] = [];
            let requestsCompleted = 0;
            let requestCount = 0;

            for (const positionArray of positions) {
                for (const { lat, lng } of positionArray) {
                    console.log("Searching for coordinates:", lat, lng);
                    const service = new google.maps.places.PlacesService(map);
                    const request = {
                        location: { lat: parseFloat(lat.toFixed(6)), lng: parseFloat(lng.toFixed(6)) },
                        radius: 100,
                        type: "restaurant",
                    };
                    requestCount++
                    const results = await new Promise<google.maps.places.PlaceResult[]>((resolve) => {
                        service.nearbySearch(request, (results, status) => {
                            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                                resolve(results);
                            } else {
                                resolve([]);
                            }
                        });
                    });
                    results.forEach(shop => {
                        if (shop.geometry && shop.geometry.location) {
                            if (!newShops.some(existingShop => existingShop.name === shop.name)) {
                                newShops.push(shop);
                                const marker = new google.maps.Marker({
                                    position: { lat: shop.geometry.location.lat(), lng: shop.geometry.location.lng() },
                                    map: map,
                                    title: shop.name,
                                });
                            }
                        }
                    });                    
                }
                requestsCompleted++;
                if (requestsCompleted === drawLinePositions.length) {
                    console.log(requestCount);
                    setShops(newShops);
                }
            }
        };

        searchNearbyPlaces(drawLinePositions);

        return () => {
            // Clean-up function
        };
    }, [map, drawLinePositions]);

    useEffect(() => {
        if (shops.length > 0) {
            const shopLogs = shops.map((shop, index) => `${index + 1}. ${shop.name}`).join("\n");
            console.log("Unique shops:\n", shopLogs);
        }
    }, [shops]);

    return (
        <div>
            <div ref={mapRef} style={{ width: INITIALIZE_MAP_WIDTH, height: INITIALIZE_MAP_HEIGHT }} />
        </div>
    );
};

export default GoogleMap;
