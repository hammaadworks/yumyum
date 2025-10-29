'use client';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useUIStore } from '@/store/use-ui.store';
import Image from 'next/image';

export function ImageViewerModal() {
  const { isImageViewerOpen, imageViewerSrc, closeImageViewer } = useUIStore();

  return (
    <Dialog open={isImageViewerOpen} onOpenChange={closeImageViewer}>
      <DialogContent className="max-w-3xl p-0">
        {imageViewerSrc && (
          <div className="relative aspect-square w-full">
            <Image
              src={imageViewerSrc}
              alt="Full screen image"
              fill
              className="object-contain"
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
