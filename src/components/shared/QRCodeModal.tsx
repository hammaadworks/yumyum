import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useUIStore } from '@/store/use-ui.store';

export function QRCodeModal() {
  const { isQRCodeModalOpen, closeQRCodeModal } = useUIStore();
  const qrCodeRef = useRef<HTMLDivElement>(null);

  const downloadQRCode = () => {
    if (qrCodeRef.current) {
      const svg = qrCodeRef.current.querySelector('svg');
      if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          const pngUrl = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream');
          let downloadLink = document.createElement('a');
          downloadLink.href = pngUrl;
          downloadLink.download = 'qrcode.png';
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        };
        img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
      }
    }
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
          // User cancelled or share failed
          if (err.name !== 'AbortError') {
            console.error('Share failed:', err);
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
