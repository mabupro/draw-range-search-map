"use client";
import React from "react";
import { Button } from "@material-tailwind/react";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
import RamenDiningOutlinedIcon from "@mui/icons-material/RamenDiningOutlined";
import FreeBreakfastOutlinedIcon from "@mui/icons-material/FreeBreakfastOutlined";
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";

interface KeywordButtonProps {
    keyword: string;
    type: string;
    onToggleType: (type: string) => void;
}

export const KeywordButton: React.FC<KeywordButtonProps> = ({ keyword, type, onToggleType }) => {
    let selectedIcon;
    if (type === "restaurant") {
        selectedIcon = (
            <RestaurantOutlinedIcon fontSize="small" className="text-green-500" />
        );
    } else if (type === "ramen") {
        selectedIcon = (
            <RamenDiningOutlinedIcon fontSize="small" className="text-green-500" />
        );
    } else if (type === "coffee") {
        selectedIcon = (
            <FreeBreakfastOutlinedIcon fontSize="small" className="text-green-500" />
        );
    } else {
        selectedIcon = (
            <StoreOutlinedIcon fontSize="small" className="text-green-500" />
        );
    }

    const handleClick = () => {
        onToggleType(type);
    };

    return (
        <div>
            <Button
                variant="outlined"
                color="green"
                className="rounded-full flex items-center gap-2 bg-white"
                placeholder={undefined}
                size="sm"
                onClick={handleClick}
            >
                {selectedIcon}
                {keyword}
            </Button>
        </div>
    );
};

export default KeywordButton;
