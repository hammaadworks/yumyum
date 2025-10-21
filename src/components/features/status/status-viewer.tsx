'use client';

import { Status } from '@/lib/types';
import { useUIStore } from '@/store/use-ui.store';
import Image from 'next/image';
import React from 'react';

interface StatusViewerProps {
  status: Status;
}

export function StatusViewer({ status }: StatusViewerProps) {
  const { isStatusViewerOpen, closeStatusViewer } = useUIStore();
  const [currentIndex, setCurrentIndex] = React.useState(0);

  React.useEffect(() => {
    if (!isStatusViewerOpen) return;

    const currentDuration = status[currentIndex]?.duration;
    const delay = (currentDuration !== undefined ? currentDuration : 5) * 1000;

    const timer = setTimeout(
      () => {
        if (currentIndex < status.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          closeStatusViewer();
          setCurrentIndex(0);
        }
      },
      delay,
    );

    return () => clearTimeout(timer);
  }, [currentIndex, status, isStatusViewerOpen, closeStatusViewer]);

  if (!isStatusViewerOpen) return null;

  const currentStatus = status[currentIndex];
  if (!currentStatus) return null;

  return (
    <div
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
      onClick={closeStatusViewer}
    >
      <div className="relative w-full h-full max-w-md mx-auto">
        {currentStatus.type === 'image' && (
          <Image
            src={currentStatus.content}
            alt="Status"
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
        {currentStatus.type === 'video' && (
          <video
            src={currentStatus.content}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-contain"
          />
        )}
        {currentStatus.type === 'text' && (
          <div className="flex items-center justify-center h-full p-8">
            <p className="text-white text-center text-xl">
              {currentStatus.content}
            </p>
          </div>
        )}

        <div className="absolute top-0 left-0 right-0 flex gap-1 p-2">
          {status.map((_, i) => (
            <div
              key={i}
              className="flex-1 h-1 bg-white/30 overflow-hidden rounded"
            >
              <div
                className={`h-full bg-white transition-all duration-[5000ms] ease-linear ${
                  i === currentIndex
                    ? 'w-full'
                    : i < currentIndex
                      ? 'w-full'
                      : 'w-0'
                }`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
