import React, { useState } from 'react';

interface InteractiveIslandProps {
    initialCount?: number;
}

export default function InteractiveIsland({ initialCount = 0 }: InteractiveIslandProps) {
    const [count, setCount] = useState(initialCount);

    return (
        <div className="p-4 border border-gray-200 rounded-lg shadow-sm font-sans">
            <h3 className="text-lg font-semibold mb-2">Interactive Island</h3>
            <p className="mb-4 text-gray-600 text-sm">
                This component is hydrated independently. It has its own state but no global context.
            </p>
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setCount(c => c - 1)}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                    aria-label="Decrease count"
                >
                    -
                </button>
                <span className="font-mono text-xl font-bold">{count}</span>
                <button
                    onClick={() => setCount(c => c + 1)}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition"
                    aria-label="Increase count"
                >
                    +
                </button>
            </div>
        </div>
    );
}
