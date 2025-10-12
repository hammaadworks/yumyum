import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { CategoryHighlights } from "./category-highlights";
import { Dish } from "@/lib/types";

const mockDishes: Dish[] = [
  {
    id: "1",
    category: "Appetizers",
    name: "Dish 1",
    image: "",
    description: "",
    price: 10,
    instock: "yes",
    veg: "veg",
  },
  {
    id: "2",
    category: "Main Course",
    name: "Dish 2",
    image: "",
    description: "",
    price: 20,
    instock: "yes",
    veg: "non-veg",
  },
  {
    id: "3",
    category: "Appetizers",
    name: "Dish 3",
    image: "",
    description: "",
    price: 15,
    instock: "yes",
    veg: "veg",
    tag: "bestseller",
  },
];

describe("CategoryHighlights", () => {
  it("should render the 'Specials' category if a dish has a special tag", () => {
    render(
      <CategoryHighlights dishes={mockDishes} onCategorySelect={() => {}} />
    );
    expect(screen.getByText("Specials")).toBeInTheDocument();
  });

  it("should not render the 'Specials' category if no dish has a special tag", () => {
    const dishesWithoutSpecial = mockDishes.map((d) => ({ ...d, tag: "normal" as const }));
    render(
      <CategoryHighlights
        dishes={dishesWithoutSpecial}
        onCategorySelect={() => {}}
      />
    );
    expect(screen.queryByText("Specials")).not.toBeInTheDocument();
  });

  it("should render unique categories in alphabetical order", () => {
    render(
      <CategoryHighlights dishes={mockDishes} onCategorySelect={() => {}} />
    );
    const buttons = screen.getAllByRole("button");
    // Specials, Appetizers, Main Course
    expect(buttons).toHaveLength(3);
    expect(buttons[1]).toHaveTextContent("Appetizers");
    expect(buttons[2]).toHaveTextContent("Main Course");
  });

  it("should call onCategorySelect with the correct category when a button is clicked", () => {
    const onCategorySelect = jest.fn();
    render(
      <CategoryHighlights dishes={mockDishes} onCategorySelect={onCategorySelect} />
    );
    fireEvent.click(screen.getByText("Appetizers"));
    expect(onCategorySelect).toHaveBeenCalledWith("Appetizers");
  });
});