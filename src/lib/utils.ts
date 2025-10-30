import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind CSS classes with clsx for conditional classes.
 * This is a standard utility from shadcn/ui.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a URL-friendly, stable ID from a dish name.
 * This is a system-required utility to ensure consistent identifiers.
 * @param name The name of the dish (e.g., "Spicy Chicken Supreme").
 * @returns A slugified string (e.g., "spicy-chicken-supreme").
 */
export function generateDishId(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

/**
 * Generates a WhatsApp chat link, prioritizing the deep link protocol
 * with a fallback to the web version after a short delay.
 * @param phoneNumber The phone number with country code (e.g., "918310428923").
 * @param message Optional pre-filled message.
 * @returns The WhatsApp link.
 */
export function generateWhatsAppLink(
  phoneNumber: string,
  message?: string,
): string {
  const encodedMessage = message ? encodeURIComponent(message) : '';
  const whatsappDeepLink = `whatsapp://send?phone=${phoneNumber}${encodedMessage ? `&text=${encodedMessage}` : ''}`;
  const whatsappWebLink = `https://wa.me/${phoneNumber}${encodedMessage ? `?text=${encodedMessage}` : ''}`;

  // Attempt deep link first, then fallback to web after a short delay
  // This pattern provides a better user experience on mobile while still working on desktop.
  if (typeof window !== 'undefined') { // Guard window access
    setTimeout(() => {
      window.location.href = whatsappWebLink;
    }, 500);
  }

  return whatsappDeepLink;
}

/**
 * Downloads an SVG element as a PNG image.
 * @param svgElement The SVG element to download.
 * @param filename The desired filename for the downloaded PNG.
 */
export function downloadSvgAsPng(svgElement: SVGSVGElement, filename: string) {
  const svgData = new XMLSerializer().serializeToString(svgElement);

  const svgBlob = new Blob([svgData], {
    type: 'image/svg+xml;charset=utf-8',
  });
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  img.onload = () => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error(
          'Unable to get 2D context for canvas when exporting QR code',
        );
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
        downloadLink.download = filename;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(pngUrl);
        URL.revokeObjectURL(url);
      }, 'image/png');
    } catch (err) {
      console.error('Failed to export QR code as PNG:', err);
      URL.revokeObjectURL(url);
    }
  };
  img.src = url;
}

export const isValidHttpUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
};

export const normalizeWhatsapp = (number: string) =>
  number.replace(/[^+\d]/g, '');

export const validateWhatsapp = (number: string) => {
  const normalized = normalizeWhatsapp(number);
  return /^(\+)?[1-9]\d{7,14}$/.test(normalized);
};

export const openPopup = (url: string): boolean => {
  if (typeof window !== 'undefined') { // Guard window access
    const popup = window.open(url, '_blank');
    return popup !== null;
  }
  return false; // Return false if window is not defined
};
