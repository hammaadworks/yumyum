import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrandHeader } from "./brand-header";
import { Brand } from "@/lib/types";

const mockBrand: Brand = {
  name: "Test Brand",
  logo_url: "https://via.placeholder.com/150",
  cuisine: "Test Cuisine",
  description: "Test Description",
  payment_link: "https://test.payment.link",
  whatsapp: "1234567890",
  contact: "0987654321",
  location_link: "https://test.location.link",
  instagram: "https://test.instagram.link",
};

describe("BrandHeader", () => {
  it("should render the component with the correct text", () => {
    render(<BrandHeader brand={mockBrand} hasStatus={false} />);
    expect(screen.getByText("Test Brand")).toBeInTheDocument();
    expect(screen.getByText("Test Cuisine")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  it("should render all provided links", () => {
    render(<BrandHeader brand={mockBrand} hasStatus={false} />);
    expect(screen.getByLabelText("Payment Link")).toBeInTheDocument();
    expect(screen.getByLabelText("Contact on WhatsApp")).toBeInTheDocument();
    expect(screen.getByLabelText("Contact Phone")).toBeInTheDocument();
    expect(screen.getByLabelText("Location on Map")).toBeInTheDocument();
    expect(screen.getByLabelText("Instagram Profile")).toBeInTheDocument();
  });

  it("should not render links that are not provided", () => {
    render(<BrandHeader brand={mockBrand} hasStatus={false} />);
    expect(screen.queryByLabelText("Facebook Page")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("YouTube Channel")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Custom Link")).not.toBeInTheDocument();
  });

  it("should have correct aria-labels", () => {
    render(<BrandHeader brand={mockBrand} hasStatus={false} />);
    expect(screen.getByLabelText("Payment Link")).toHaveAttribute(
      "aria-label",
      "Payment Link"
    );
  });
});