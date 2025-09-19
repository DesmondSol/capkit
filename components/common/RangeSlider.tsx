import React from 'react';

interface RangeSliderProps {
  leftLabel: string;
  rightLabel: string;
  value: number;
  onChange: (value: number) => void;
}

export const RangeSlider: React.FC<RangeSliderProps> = ({ leftLabel, rightLabel, value, onChange }) => {
  return (
    <div>
      <div className="flex justify-between items-center text-xs font-medium text-slate-300 px-1 mb-1">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer range-slider"
      />
       <style>{`
        .range-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          background: #3b82f6; /* blue-500 */
          cursor: pointer;
          border-radius: 50%;
          border: 2px solid #fff;
        }

        .range-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #3b82f6;
          cursor: pointer;
          border-radius: 50%;
          border: 2px solid #fff;
        }
      `}</style>
    </div>
  );
};
