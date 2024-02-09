"use client"

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@material-tailwind/react";
import { LatLng, Point } from "../../types/drawLine";

type DrawLineProps = {
	onLatLngSubmit: (drawLinePositions: any) => void;
	currentLocation: LatLng;
};

export const DrawLine: React.FC<DrawLineProps> = ({ onLatLngSubmit, currentLocation }) => {
	const [drawing, setDrawing] = useState(false);
	const [lines, setLines] = useState<Point[][]>([]);
	const [positions, setPositions] = useState<(LatLng | LatLng[])[]>([]);
	const [currentLine, setCurrentLine] = useState<Point[]>([]);
	const [currentPosition, setCurrentPosition] = useState<LatLng[]>([]);

	const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>): void => {
		setDrawing(true);
		setCurrentLine([getMousePosition(e)]);
	};

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>): void => {
		if (!drawing) return;

		setCurrentLine((currentLine) => [...currentLine, getMousePosition(e)]);
		const latLng = mapPointToLatLng(e.clientX, e.clientY, currentLocation);
		setCurrentPosition((currentPosition) => [...currentPosition, latLng]);
	};

	const handleMouseUp = (): void => {
		if (!drawing) return;

		setDrawing(false);
		setLines((lines) => [...lines, currentLine]);
		setPositions((positions) => [...positions, currentPosition]);
		setCurrentLine([]);
		setCurrentPosition([]);
	};

	const getMousePosition = (e: React.MouseEvent<HTMLDivElement>): Point => {
		return { x: e.clientX, y: e.clientY };
	};

	const mapPointToLatLng = (
		x: number,
		y: number,
		defaultCenter: LatLng
	): LatLng => {
		const latLng: LatLng = {
			lat:
				defaultCenter.lat +
				((y - window.innerHeight / 2) / window.innerHeight) * -0.01,
			lng:
				defaultCenter.lng +
				((x - window.innerWidth / 2) / window.innerWidth) * 0.02,
		};
		return latLng;
	};

	const submitToLatLng = (): void => {
		console.log("Sending LatLng...");
		const updatedPositions = [...positions, ...currentPosition.filter((_, index) => index % 30 === 0)];
		setPositions(updatedPositions);
		console.log(updatedPositions);
		onLatLngSubmit(updatedPositions);
	};

	const clearLines = (): void => {
		setLines([]);
		console.log("Lines cleared.");
		onLatLngSubmit([]);
	};

	return (
		<>
			<div className="bg-slate-100 opacity-60">
				<div
					role="button"
					tabIndex={0}
					onMouseDown={handleMouseDown}
					onMouseMove={handleMouseMove}
					onMouseUp={handleMouseUp}
					onMouseLeave={handleMouseUp}
					className="w-full h-full fixed top-0 left-0"
				>
					{lines.map((line, index) => (
						<svg
							key={index}
							className="absolute top-0 left-0 w-full h-full pointer-events-none"
						>
							<polyline
								fill="none"
								stroke="#E60012"
								strokeWidth="20"
								points={line
									.map((point) => `${point.x},${point.y}`)
									.join(" ")}
							/>
						</svg>
					))}
					{drawing && (
						<svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
							<polyline
								fill="none"
								stroke="#E60012"
								strokeWidth="20"
								points={currentLine
									.map((point) => `${point.x},${point.y}`)
									.join(" ")}
							/>
						</svg>
					)}
				</div>
			</div>
			<div className="flex gap-2 p-2">
				<Button
					variant="gradient"
					color="green"
					className="flex items-center gap-2 bg-white z-10"
					placeholder={undefined}
					size="md"
					onClick={clearLines}
				>
					線を消す
				</Button>
				<Button
					variant="gradient"
					color="green"
					className="flex items-center gap-2 bg-white z-10"
					placeholder={undefined}
					size="md"
					onClick={submitToLatLng}
				>
					決定
				</Button>
			</div>
		</>
	);
};