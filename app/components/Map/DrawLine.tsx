'use client'

import { useState } from "react"
import { Point } from "../../features/types/drawLine";

export const DrawLine = () => {
    const [drawing, setDrawing] = useState(false);
    const [lines, setLines] = useState<Point[][]>([]);
    const [currentLine, setCurrentLine] = useState<Point[]>([]);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>): void => {
        setDrawing(true);
        setCurrentLine([{ x: e.clientX, y: e.clientY }]);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>): void => {
        if (!drawing) return;
        setCurrentLine(currentLine => [...currentLine, { x: e.clientX, y: e.clientY }]);
    };

    const handleMouseUp = (): void => {
        if (!drawing) return;
        setDrawing(false);
        setLines(lines => [...lines, currentLine]);
        setCurrentLine([]);
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
        </>
    )
}
