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
    render(<BrandHeader brand={mockBrand} />);
    expect(screen.getByText("Test Brand")).toBeInTheDocument();
    expect(screen.getByText("Test Cuisine")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  it("should render all provided links", () => {
    render(<BrandHeader brand={mockBrand} />);
    expect(screen.getByLabelText("Visit our payment")).toBeInTheDocument();
    expect(screen.getByLabelText("Visit our whatsapp")).toBeInTheDocument();
    expect(screen.getByLabelText("Visit our contact")).toBeInTheDocument();
    expect(screen.getByLabelText("Visit our location")).toBeInTheDocument();
    expect(screen.getByLabelText("Visit our instagram")).toBeInTheDocument();
  });

  it("should not render links that are not provided", () => {
    render(<BrandHeader brand={mockBrand} />);
    expect(screen.queryByLabelText("Visit our review")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Visit our facebook")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Visit our youtube")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Visit our custom")).not.toBeInTheDocument();
  });

  it("should have correct aria-labels", () => {
    render(<BrandHeader brand={mockBrand} />);
    expect(screen.getByLabelText("Visit our payment")).toHaveAttribute(
      "aria-label",
      "Visit our payment"
    );
  });
});