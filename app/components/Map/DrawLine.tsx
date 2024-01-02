'use client';

import { useState } from "react";
import { Point } from "../../features/types/drawLine";

export const DrawLine = () => {
    const [drawing, setDrawing] = useState(false);                  // 描画中かどうかを示すフラグ
    const [lines, setLines] = useState<Point[][]>([]);              // 過去の描かれた線の配列
    const [currentLine, setCurrentLine] = useState<Point[]>([]);    // 現在描かれている線の座標の配列

    // マウスが要素上で押されたときに呼び出される関数
    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>): void => {
        setDrawing(true);     // 描画中フラグを立てる
        setCurrentLine([{ x: e.clientX, y: e.clientY }]); // 初期の座標を設定
    };

    // マウスが要素上で移動するたびに呼び出される関数
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>): void => {
        if (!drawing) return; // 描画中でなければ何もしない

        // 現在の座標を配列に追加
        setCurrentLine(currentLine => [...currentLine, { x: e.clientX, y: e.clientY }]);
    };

    // マウスのボタンが離されたときに呼び出される関数
    const handleMouseUp = (): void => {
        if (!drawing) return; // 描画中でなければ何もしない

        setDrawing(false); // 描画中フラグを解除
        setLines(lines => [...lines, currentLine]); // 現在の線を過去の線として保存
        setCurrentLine([]); // 現在の線をリセット
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
                    {/* 過去の線を描画 */}
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
                    {/* 現在の線を描画（描画中のみ） */}
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
    );
};
