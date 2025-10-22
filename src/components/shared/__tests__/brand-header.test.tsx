import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { BrandHeader } from "../BrandHeader";
import { Brand } from "@/lib/types";

// Mock Lucide icons once globally
jest.mock("lucide-react", () => ({
  Wallet: () => <div data-testid="wallet-icon" />,
  MessageSquare: () => <div data-testid="whatsapp-icon" />,
  Phone: () => <div data-testid="phone-icon" />,
  MapPin: () => <div data-testid="location-icon" />,
  Instagram: () => <div data-testid="instagram-icon" />,
  Facebook: () => <div data-testid="facebook-icon" />,
  Youtube: () => <div data-testid="youtube-icon" />,
  Link: () => <div data-testid="custom-link-icon" />,
  QrCode: () => <div data-testid="qrcode-icon" />,
}));

// ---- Mock Data ----
const MOCK_BRAND_FULL: Brand = {
  name: "The Burger Den",
  logo_url: "https://example.com/logo.png",
  cuisine: "American",
  description: "The best burgers in town.",
  payment_link: "https://example.com/pay",
  whatsapp: "1112223333",
  contact: "4445556666",
  location_link: "https://maps.google.com",
  instagram: "https://instagram.com/burgerden",
  facebook: "https://facebook.com/burgerden",
  youtube: "https://youtube.com/burgerden",
  custom: "https://example.com/custom",
};

const MOCK_BRAND_MINIMAL: Brand = {
  name: "The Pizza Place",
  logo_url: "https://example.com/pizza.png",
  cuisine: "Italian",
  description: "Authentic Italian pizza.",
  payment_link: "",
  whatsapp: "",
  contact: "",
};

// ---- Tests ----
describe("BrandHeader", () => {
  it("renders all information when provided with full data", () => {
    render(<BrandHeader brand={MOCK_BRAND_FULL} hasStatus={true} />);

    expect(screen.getByText("The Burger Den")).toBeInTheDocument();
    expect(screen.getByText("American")).toBeInTheDocument();
    expect(screen.getByText("The best burgers in town.")).toBeInTheDocument();

    const image = screen.getByRole("img", { name: /The Burger Den logo/i });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", expect.stringContaining("https://example.com/logo.png"));

    expect(screen.getByLabelText(/Payment Link/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contact on WhatsApp/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contact Phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Location on Map/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Instagram Profile/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Facebook Page/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/YouTube Channel/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Custom Link/i)).toBeInTheDocument();
  });

  it("renders only required information when optional data is missing", () => {
    render(<BrandHeader brand={MOCK_BRAND_MINIMAL} hasStatus={false} />);

    expect(screen.getByText("The Pizza Place")).toBeInTheDocument();
    expect(screen.queryByLabelText(/Payment Link/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Contact on WhatsApp/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/Instagram Profile/i)).not.toBeInTheDocument();
  });

  it("has correct aria-labels for icon links", () => {
    render(<BrandHeader brand={MOCK_BRAND_FULL} hasStatus={false} />);

    const labels = [
      "Payment Link",
      "Contact on WhatsApp",
      "Contact Phone",
      "Location on Map",
      "Instagram Profile",
      "Facebook Page",
      "YouTube Channel",
      "Custom Link",
    ];

    labels.forEach(label => {
      expect(screen.getByLabelText(label)).toHaveAttribute("aria-label", label);
    });
  });

  it("displays a gradient ring when hasStatus is true", () => {
    const { container } = render(<BrandHeader brand={MOCK_BRAND_FULL} hasStatus={true} />);
    expect(container.querySelector(".status-ring-active")).toBeInTheDocument();
  });

  it("does not display a gradient ring when hasStatus is false", () => {
    const { container } = render(<BrandHeader brand={MOCK_BRAND_FULL} hasStatus={false} />);
    expect(container.querySelector(".status-ring-active")).not.toBeInTheDocument();
  });
});
