import * as React from "react";
import { Brand } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  Wallet,
  MessageSquare,
  Phone,
  MapPin,
  Star,
  Instagram,
  Facebook,
  Youtube,
  Link,
} from "lucide-react";
import Image from "next/image";

export interface BrandHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  brand: Brand;
}

const BrandHeader = React.forwardRef<HTMLDivElement, BrandHeaderProps>(
  ({ className, brand, ...props }, ref) => {
    const iconMap = {
      payment_link: Wallet,
      whatsapp: MessageSquare,
      contact: Phone,
      location_link: MapPin,
      review_link: Star,
      instagram: Instagram,
      facebook: Facebook,
      youtube: Youtube,
      custom: Link,
    };

    const links = Object.entries(iconMap)
      .map(([key, Icon]) => {
        const href = brand[key as keyof Brand];
        if (href) {
          return {
            href: String(href),
            icon: <Icon className="w-5 h-5" />,
            "aria-label": `Visit our ${key.replace("_link", "")}`,
          };
        }
        return null;
      })
      .filter(Boolean);

    return (
      <div
        className={cn("flex flex-col items-center text-center", className)}
        ref={ref}
        {...props}
      >
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary to-primary-strong p-1">
            <Image
              src={brand.logo_url}
              alt={`${brand.name} logo`}
              width={96}
              height={96}
              className="rounded-full object-cover w-full h-full"
            />
          </div>
        </div>
        <h1 className="text-2xl font-bold">{brand.name}</h1>
        <p className="text-muted-foreground">{brand.cuisine}</p>
        <p className="mt-2 text-sm">{brand.description}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {links.map(
            (link) =>
              link && (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link["aria-label"]}
                  className="p-2 bg-secondary text-secondary-foreground rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {link.icon}
                </a>
              )
          )}
        </div>
      </div>
    );
  }
);

BrandHeader.displayName = "BrandHeader";

export { BrandHeader };