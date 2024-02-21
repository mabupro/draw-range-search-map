import { Card, CardBody, Typography, Spinner, Chip, Button } from '@material-tailwind/react';
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

type RestaurantDetailProps = {
    restaurant: google.maps.places.PlaceResult | null;
    restaurants: google.maps.places.PlaceResult[];
    selectedIndex: number;
    onSelect: (index: number) => void;
}

export const RestaurantDetail: React.FC<RestaurantDetailProps & { onClose: () => void }> = ({ restaurant, restaurants, selectedIndex, onSelect, onClose }) => {
    if (!restaurant) {
        return <div className="flex justify-center items-center h-screen">
            <Spinner className="h-10 w-10" />
        </div>;
    }

    const handleNext = () => {
        const nextIndex = (selectedIndex + 1) % restaurants.length;
        onSelect(nextIndex);
    };

    const handlePrev = () => {
        const prevIndex = (selectedIndex - 1 + restaurants.length) % restaurants.length;
        onSelect(prevIndex);
    };

    const genreValue = restaurant.types ? restaurant.types.join(', ') : 'ジャンル不明';
    const rateValue = restaurant.rating ? restaurant.rating : '評価不明'; // Google Places APIでは予算情報は提供されない

    return (
        <div className="absolute top-0 left-0 w-full h-full bg-white p-4 z-10 overflow-auto">
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={onClose} className="text-blue-500">
                        <FaArrowLeft className="inline mr-2" />戻る
                    </button>
                    <div>
                        <Button
                            color="orange"
                            size="sm"
                            onClick={handlePrev}
                            className="mr-2" placeholder={undefined}                        >
                            <FaArrowLeft />
                        </Button>
                        <Button
                            color="orange"
                            size="sm"
                            onClick={handleNext} placeholder={undefined}                        >
                            <FaArrowRight />
                        </Button>
                    </div>
                </div>
                <Card placeholder={undefined}>
                    <CardBody placeholder={undefined}>
                        <img src={restaurant.photos ? restaurant.photos[0].getUrl() : ''} alt={restaurant.name} className="w-full max-h-96 object-cover mb-4" />

                        <Typography variant="h5" color="gray" placeholder={undefined}>{restaurant.name}</Typography>
                        <Typography color="gray" className="mb-2" placeholder={undefined}>{restaurant.vicinity}</Typography>

                        <div className="flex flex-wrap gap-2 my-2">
                            <Chip color="cyan" value={genreValue} variant="outlined" />
                            <Chip color="amber" value={rateValue} variant="outlined" />
                        </div>

                        <Typography color="gray" placeholder={undefined}>営業状況: {restaurant.business_status}</Typography>
                        <Typography color="gray" placeholder={undefined}>アクセス: {restaurant.website}</Typography>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};
