'use client';

import React from 'react';
import Stories from 'react-insta-stories';
import { Status } from '@/lib/types';
import { useUIStore } from '@/store/use-ui.store';

interface StatusViewerProps {
  status: Status;
}

export function StatusViewer({ status }: StatusViewerProps) {
  const { isStatusViewerOpen, closeStatusViewer } = useUIStore();

  const stories = Array.isArray(status)
    ? status.map(item => {
        if (item.type === 'image' || item.type === 'video') {
          return {
            url: item.content,
            type: item.type,
            duration: item.duration,
          };
        }
        return {
          content: () => <div className="p-4 text-white">{item.content}</div>,
          duration: item.duration,
        };
      })
    : [];

  if (!isStatusViewerOpen) {
    return null;
  }

  return (
    <div className={`fixed inset-0 z-50 ${isStatusViewerOpen ? 'block' : 'hidden'}`}>
      <Stories
        stories={stories}
        defaultInterval={5000}
        onAllStoriesEnd={closeStatusViewer}
      />
    </div>
  );
}
