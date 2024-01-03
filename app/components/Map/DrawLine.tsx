'use client'

import { useState } from "react";
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

    const clearLines = (): void => {
        setLines([]);
        console.log('Lines cleared.');
    };

    const mapPointToLatLng = (x: number, y: number, defaultCenter: LatLng): LatLng => {
        const latLng: LatLng = {
            lat: defaultCenter.lat + ((y - window.innerHeight / 2) / window.innerHeight) * (-0.01),
            lng: defaultCenter.lng + ((x - window.innerWidth / 2) / window.innerWidth) * 0.02,
        };
        return latLng;
    };

    const submitToLatLng = () => {
        console.log("Sending LatLng...");
    }

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
            <button
                className="absolute top-2.5 right-12 mx-1 px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded"
                onClick={clearLines}
            >
                Clear Lines
            </button>
            <button
                className="absolute top-2.5 right-40 mx-3 px-4 py-2 bg-white text-gray-800 border border-gray-300 rounded"
                onClick={submitToLatLng}
            >
                Submit
            </button>
        </>
    );
};
