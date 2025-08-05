'use client';
import { FC, useState } from 'react';
import Image from 'next/image';
import { data } from '@/lib/base-mock';

const floorImages = [
  '/ground-floor.png',
  '/first-floor.png',
  '/second-floor.png',
];

const floorLabels = ['Ground', 'First', 'Second'];

export const BaseViewer: FC = () => {
  const [selectedFloor, setSelectedFloor] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className='flex flex-col items-center justify-center h-full w-screen bg-black relative'>
      <Image
        src={floorImages[selectedFloor]}
        alt={floorLabels[selectedFloor] + ' Floor'}
        width={600}
        height={600}
        className={`${selectedFloor === 2 ? '!h-1/4' : 'h-full'} object-contain transform scale-125`}
      />
      <div className='absolute bottom-6 left-6 flex flex-col-reverse justify-center items-center p-4 gap-4 z-50'>
        {floorLabels.map((label, idx) => (
          <button
            key={label}
            onClick={() => setSelectedFloor(idx)}
            className={`px-5 py-2 rounded-lg font-bold cursor-pointer transition-colors duration-200 uppercase w-full
              ${selectedFloor === idx
              ? 'bg-[#F1F1F1] text-black'
              : 'bg-[#2A2A2D] text-white'}
            `}
          >
            {label} Floor
          </button>
        ))}
      </div>
      <button
        className='absolute top-4 right-4 p-2 cursor-pointer z-50 w-fit opacity-80'
        onClick={() => setShowDetails((prev) => !prev)}
      >
        <Image
          src="/icons/info.png"
          alt="Info icon"
          width={32}
          height={32}
          className="inline-block w-8 h-8"
        />  
      </button>
      {showDetails && (
        <div className="absolute top-16 right-4 p-4 z-40 max-w-md text-xl">
          {Object.entries(data[selectedFloor].locations).map(([sectorKey, sector]) => (
            <div key={sectorKey} className="mb-4">
              <div
                className="font-bold mb-2"
                style={{ color: sector.color }}
              >
                {sector.label}:
              </div>
              {Object.entries(sector.rooms).map(([sign, name]) => (
                <div key={sign} className="flex items-center mb-1">
                  <span
                    className="font-bold mr-2"
                    style={{ color: sector.color }}
                  >
                    {sign.replace(/_/g, '').toUpperCase()}
                  </span>
                  <span className="text-white">{String(name)}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};