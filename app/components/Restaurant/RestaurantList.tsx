import React, { useState, useEffect } from 'react';
import { List, ListItem, Badge } from "@material-tailwind/react";
import { FaAngleUp, FaAngleDown } from 'react-icons/fa';
import { RestaurantDetail } from './RestaurantDitial';

type RestaurantListProps = {
    shops: google.maps.places.PlaceResult[];
}

export const RestaurantList: React.FC<RestaurantListProps> = ({ shops }) => {
    const [isListOpen, setIsListOpen] = useState(false);
    const [selectedRestaurant, setSelectedRestaurant] = useState<google.maps.places.PlaceResult | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);

    const toggleList = () => {
        setIsListOpen(!isListOpen);
    };

    const handleSelectIndex = (index: number) => {
        setSelectedIndex(index);
    };

    const handleRestaurantClick = (index: number) => {
        setSelectedRestaurant(shops[index]);
        setSelectedIndex(index);
    }

    const handleCloseDetail = () => {
        setSelectedRestaurant(null);
        setSelectedIndex(-1);
    };

    useEffect(() => {
        if (selectedIndex >= 0 && selectedIndex < shops.length) {
            setSelectedRestaurant(shops[selectedIndex]);
        }
    }, [selectedIndex, shops]);

    return (
        <div className={`fixed bottom-0 w-full md:left-0 md:w-1/2 bg-white p-4 shadow-lg overflow-hidden rounded-lg ${isListOpen ? 'h-screen' : 'h-16'}`}>
            <div className="w-full flex justify-center items-center">
                <button
                    className="w-1/3 bg-orange-500 text-white p-2 m-2 rounded-full flex justify-center items-center  hover:opacity-75"
                    onClick={toggleList}
                >
                    {isListOpen ? <FaAngleDown /> : <FaAngleUp />}
                    {shops.length > 0 && (
                        <Badge color="red" className="ml-2">
                            {shops.length}
                        </Badge>
                    )}
                </button>
            </div>
            {isListOpen && (
                <div className="overflow-auto h-full m-2">
                    <List className='my-5' placeholder={undefined}>
                        {shops.map((shop, index) => (
                            <ListItem
                                key={index}
                                onClick={() => handleRestaurantClick(index)}
                                className="flex items-center max-h-42" placeholder={undefined}                            >
                                {shop.photos && shop.photos.length > 0 && <img src={shop.photos[0].getUrl()} alt={shop.name} style={{ width: '30%', margin: '10px' }} />}
                                <div>
                                    <p className="font-bold">{shop.name}</p>
                                    <p className="text-sm">{shop.vicinity}</p>
                                </div>
                            </ListItem>
                        ))}
                    </List>
                    {selectedRestaurant && (
                        <div className="absolute top-0 left-0 w-full h-full bg-white p-4">
                            <RestaurantDetail
                                restaurant={selectedRestaurant}
                                selectedIndex={selectedIndex}
                                onClose={handleCloseDetail}
                                restaurants={[]}
                                onSelect={handleSelectIndex}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
