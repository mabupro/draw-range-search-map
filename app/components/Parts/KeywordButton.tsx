"use client";
import React from "react";
import { Button } from "@material-tailwind/react";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
import RamenDiningOutlinedIcon from "@mui/icons-material/RamenDiningOutlined";
import FreeBreakfastOutlinedIcon from "@mui/icons-material/FreeBreakfastOutlined";
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";

interface KeywordButtonProps {
	keyword: string;
	index: number;
}

const KeywordButton: React.FC<KeywordButtonProps> = ({ keyword, index }) => {
	let selectedIcon;
	if (index === 0) {
		selectedIcon = (
			<RestaurantOutlinedIcon fontSize="small" className="text-green-500" />
		);
	} else if (index === 1) {
		selectedIcon = (
			<RamenDiningOutlinedIcon fontSize="small" className="text-green-500" />
		);
	} else if (index === 2) {
		selectedIcon = (
			<FreeBreakfastOutlinedIcon fontSize="small" className="text-green-500" />
		);
	} else {
		selectedIcon = (
			<StoreOutlinedIcon fontSize="small" className="text-green-500" />
		);
	}

	return (
		<div>
			<Button
				variant="outlined"
				color="green"
				className="rounded-full flex items-center gap-2"
				placeholder={undefined}
				size="sm"
			>
				{selectedIcon}
				{keyword}
			</Button>
		</div>
	);
};

export default KeywordButton;
