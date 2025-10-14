import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useUIStore } from '@/store/use-ui.store';

export function QRCodeModal() {
  const { isQRCodeModalOpen, closeQRCodeModal } = useUIStore();
  const qrCodeRef = useRef<HTMLDivElement>(null);

  const downloadQRCode = () => {
    if (!qrCodeRef.current) return;
    const svg = qrCodeRef.current.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);

    // Create a blob from the SVG string (handles unicode safely) and create an object URL
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          console.error('Unable to get 2D context for canvas when exporting QR code');
          URL.revokeObjectURL(url);
          return;
        }
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (!blob) {
            console.error('Failed to create blob from canvas');
            URL.revokeObjectURL(url);
            return;
          }
          const pngUrl = URL.createObjectURL(blob);
          const downloadLink = document.createElement('a');
          downloadLink.href = pngUrl;
          downloadLink.download = 'qrcode.png';
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
          // Clean up object URLs
          URL.revokeObjectURL(pngUrl);
          URL.revokeObjectURL(url);
        }, 'image/png');
      } catch (err) {
        console.error('Failed to export QR code as PNG:', err);
        URL.revokeObjectURL(url);
      }
    };
    // Use the object URL as an image source to avoid btoa unicode issues
    img.src = url;
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        // TODO: Show success toast/notification
        console.log('Link copied to clipboard');
      })
      .catch((err) => {
        console.error('Failed to copy link:', err);
        // TODO: Show error toast/notification
      });
  };

  const shareLink = () => {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        url: window.location.href,
      })
        .then(() => {
          console.log('Share successful');
        })
        .catch((err) => {
          // User cancelled: AbortError. For other errors, log and fallback to clipboard copy.
          if ((err as Error).name !== 'AbortError') {
            console.error('Share failed:', err);
            copyLink();
          }
        });
    } else {
      // Fallback: copy to clipboard instead
      copyLink();
    }
  };

  return (
    <Dialog open={isQRCodeModalOpen} onOpenChange={closeQRCodeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Menu</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4 p-4">
          <div ref={qrCodeRef}>
            <QRCodeSVG value={window.location.href} size={256} />
          </div>
          <div className="flex gap-2">
            <Button onClick={copyLink}>Copy Link</Button>
            <Button onClick={shareLink}>Share</Button>
            <Button onClick={downloadQRCode}>Download PNG</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
