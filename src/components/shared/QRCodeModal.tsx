import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useUIStore } from '@/store/use-ui.store';
import { QRCodeSVG } from 'qrcode.react';
import { useRef } from 'react';
import { downloadSvgAsPng } from '@/lib/utils';

export function QRCodeModal() {
  const { isQRCodeModalOpen, closeQRCodeModal } = useUIStore();
  const qrCodeRef = useRef<HTMLDivElement>(null);

  const handleDownloadQRCode = () => {
    if (!qrCodeRef.current) return;
    const svg = qrCodeRef.current.querySelector('svg');
    if (!svg) return;
    downloadSvgAsPng(svg, 'qrcode.png');
  };

  const copyLink = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        console.log('Link copied to clipboard');
      })
      .catch((err) => {
        console.error('Failed to copy link:', err);
      });
  };

  const shareLink = () => {
    if (navigator.share) {
      navigator
        .share({
          title: document.title,
          url: window.location.href,
        })
        .then(() => {
          console.log('Share successful');
        })
        .catch((err) => {
          if ((err as Error).name !== 'AbortError') {
            console.error('Share failed:', err);
            copyLink();
          }
        });
    } else {
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
            <Button onClick={handleDownloadQRCode}>Download PNG</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
