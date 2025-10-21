import React from 'react';
import Image from 'next/image';
import { Brand } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  Wallet,
  MessageSquare,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Youtube,
  Link as LinkIcon,
  QrCode,
} from 'lucide-react';
import { useUIStore } from '@/store/use-ui.store';
import { GlobalCart } from '@/components/shared/GlobalCart';

interface BrandHeaderProps {
  brand: Brand;
  hasStatus: boolean;
}

const iconMap = {
  payment_link: { icon: Wallet, label: 'Payment Link' },
  whatsapp: { icon: MessageSquare, label: 'Contact on WhatsApp' },
  contact: { icon: Phone, label: 'Contact Phone' },
  location_link: { icon: MapPin, label: 'Location on Map' },
  instagram: { icon: Instagram, label: 'Instagram Profile' },
  facebook: { icon: Facebook, label: 'Facebook Page' },
  youtube: { icon: Youtube, label: 'YouTube Channel' },
  custom: { icon: LinkIcon, label: 'Custom Link' },
};

export function BrandHeader({ brand, hasStatus }: BrandHeaderProps) {
  const { openStatusViewer, openQRCodeModal } = useUIStore();

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative mb-4">
        <button
          onClick={hasStatus ? openStatusViewer : undefined}
          className={cn(
            'w-24 h-24 rounded-full p-1',
            hasStatus && 'bg-gradient-to-r from-primary to-primary-strong status-ring-active'
          )}
          disabled={!hasStatus}
          aria-label={hasStatus ? "Open status viewer" : "Site logo"}
        >
          <Image
            src={brand.logo_url}
            alt={`${brand.name} logo`}
            width={96}
            height={96}
            className="rounded-full object-cover w-full h-full"
          />
        </button>
        <button
          onClick={openQRCodeModal}
          className="absolute bottom-0 right-0 bg-background rounded-full p-2 shadow-md"
          aria-label="Open QR code modal"
        >
          <QrCode className="h-6 w-6" />
        </button>
      </div>

      <h1 className="text-2xl font-bold">{brand.name}</h1>
      <p className="text-muted-foreground">{brand.cuisine}</p>
      <p className="mt-2 text-sm">{brand.description}</p>

      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {Object.entries(iconMap).map(([key, { icon: Icon, label }]) => {
          const href = brand[key as keyof Brand];
          if (!href) return null;

          return (
            <a
              key={key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="p-2 bg-secondary text-secondary-foreground rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Icon size={20} />
            </a>
          );
        })}
      </div>
    </div>
  );
}