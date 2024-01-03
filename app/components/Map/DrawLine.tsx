'use client'

import { useState } from "react";
import { Button } from "@material-tailwind/react";
import { LatLng, Point } from "../../features/types/drawLine";

export const DrawLine = () => {
    const [drawing, setDrawing] = useState(false);
    const [lines, setLines] = useState<Point[][]>([]);
    const [currentLine, setCurrentLine] = useState<Point[]>([]);
    const [currentPosition, setCurrentPosition] = useState<LatLng[]>([]);

    const defaultCenter: LatLng = {
        lat: 35.681236,
        lng: 139.767125,
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>): void => {
        setDrawing(true);
        setCurrentLine([getMousePosition(e)]);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>): void => {
        if (!drawing) return;

        setCurrentLine(currentLine => [...currentLine, getMousePosition(e)]);
        const latLng = mapPointToLatLng(e.clientX, e.clientY, defaultCenter);
        setCurrentPosition((currentPosition) => [...currentPosition, latLng]);
        console.log('Current Line:', currentPosition);
    };

    const handleMouseUp = (): void => {
        if (!drawing) return;

        setDrawing(false);
        setLines(lines => [...lines, currentLine]);
        setCurrentLine([]);
        setCurrentPosition([]);
    };

    const getMousePosition = (e: React.MouseEvent<HTMLDivElement>): Point => {
        return { x: e.clientX, y: e.clientY };
    };

    const mapPointToLatLng = (x: number, y: number, defaultCenter: LatLng): LatLng => {
        const latLng: LatLng = {
            lat: defaultCenter.lat + ((y - window.innerHeight / 2) / window.innerHeight) * (-0.01),
            lng: defaultCenter.lng + ((x - window.innerWidth / 2) / window.innerWidth) * 0.02,
        };
        return latLng;
    };

    const submitToLatLng = (): void => {
        console.log("Sending LatLng...");
    }

    const clearLines = (): void => {
        setLines([]);
        console.log('Lines cleared.');
    };

    return (
        <>
            <div
                className="bg-slate-100 opacity-60"
            >
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
                        <svg key={index} className="absolute top-0 left-0 w-full h-full pointer-events-none">
                            <polyline
                                fill="none"
                                stroke="#E60012"
                                strokeWidth="20"
                                points={line.map(point => `${point.x},${point.y}`).join(" ")}
                            />
                        </svg>
                    ))}
                    {drawing && (
                        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                            <polyline
                                fill="none"
                                stroke="#E60012"
                                strokeWidth="20"
                                points={currentLine.map(point => `${point.x},${point.y}`).join(" ")}
                            />
                        </svg>
                    )}
                </div>

            </div>
            <div className="flex gap-2 p-2">
                <Button
                    variant="gradient"
                    color="green"
                    className="flex items-center gap-2 bg-white"
                    placeholder={undefined}
                    size="md"
                    onClick={clearLines}
                >
                    線を消す
                </Button>
                <Button
                    variant="gradient"
                    color="green"
                    className="flex items-center gap-2 bg-white"
                    placeholder={undefined}
                    size="md"
                    onClick={submitToLatLng}
                >
                    決定
                </Button>
                <button onClick={submitToLatLng} className="p-2 bg-white">
                    決定
                </button>
            </div>
        </>
    );
};
