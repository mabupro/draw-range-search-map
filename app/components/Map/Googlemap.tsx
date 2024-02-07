"use client"

import React, { useEffect, useRef, useState } from "react"

const INITIALIZE_LAT = 35.68238
const INITIALIZE_LNG = 139.76556
const INITIALIZE_ZOOM = 15
const INITIALIZE_MAP_WIDTH = "100%"
const INITIALIZE_MAP_HEIGHT = "100vh"

const GoogleMap: React.FC = () => {
    const mapRef = useRef<HTMLDivElement>(null)
    const [map, setMap] = useState<google.maps.Map | null>(null)
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null)
    const [shops, setShops] = useState<google.maps.places.PlaceResult[]>([])

    useEffect(() => {
        // マップの初期化
        if (!mapRef.current) return

        const initializedMap = new google.maps.Map(mapRef.current, {
            center: { lat: INITIALIZE_LAT, lng: INITIALIZE_LNG },
            zoom: INITIALIZE_ZOOM,
        })

        setMap(initializedMap)
    }, [])

    useEffect(() => {
        // マップ上のクリックイベント
        if (!map) return

        const markers: google.maps.Marker[] = []

        map.addListener("click", (event: { latLng: { lat: () => any; lng: () => any } }) => {
            const latitude = event.latLng.lat()
            const longitude = event.latLng.lng()
            setLocation({ lat: latitude, lng: longitude })

            const service = new google.maps.places.PlacesService(map)
            service.nearbySearch({
                location: { lat: latitude, lng: longitude },
                radius: 100,
                type: "store",
            }, (results, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK) {
                    // 結果がnullでないことを確認
                    if (results) {
                        setShops(results)

                        // 既存のマーカーをクリア
                        markers.forEach(marker => marker.setMap(null))

                        // 各場所に新しいマーカーを作成
                        results.forEach(place => {
                            const marker = new google.maps.Marker({
                                position: place.geometry?.location || { lat: 0, lng: 0 },
                                map: map,
                                title: place.name,
                            })

                            marker.addListener("click", () => {
                                const infoWindow = new google.maps.InfoWindow({
                                    content: `<div><strong>${place.name}</strong><br>${place.vicinity}</div>`,
                                })
                                infoWindow.open(map, marker)
                            })

                            markers.push(marker)
                        })
                    }
                }
            })
        })

    }, [map])

    if (location) { console.log(`緯度,経度 ${location.lat},${location.lng}`) }
    if (shops.length > 0) {
        console.log("近くの店舗:")
        shops.forEach((shop, index) => {
            console.log(`${index + 1}. ${shop.name} ${shop.business_status}`)
        })
    }

    return (
        <div>
            <div ref={mapRef} style={{ width: INITIALIZE_MAP_WIDTH, height: INITIALIZE_MAP_HEIGHT }} />
            {/* {location && (
                <div className="mx-5 my-5">
                    <h2 className="underline text-lg mb-3">位置情報</h2>
                    <p>緯度: {location.lat}</p>
                    <p>経度: {location.lng}</p>
                </div>
            )}
            {shops.length > 0 && (
                <div className="mx-5 mb-5">
                    <h2 className="underline text-lg mb-3">近くの店舗</h2>
                    <ul className="list-disc list-inside">
                        {shops.map((shop, index) => (
                            <li key={index}>{shop.name}</li>
                        ))}
                    </ul>
                </div>
            )} */}
        </div>
    )
}

export default GoogleMap
