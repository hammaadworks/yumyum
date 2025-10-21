import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from '../Button';
import Link from 'next/link';

describe('Button Component', () => {
  describe('Rendering', () => {
    it('should render button with children', () => {
      render(<Button>Click me</Button>);

      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
    });

    it('should render as a button element by default', () => {
      render(<Button>Button</Button>);

      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should accept className prop', () => {
      render(<Button className="custom-class">Button</Button>);

      expect(screen.getByRole('button')).toHaveClass('custom-class');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<Button ref={ref}>Button</Button>);

      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('Variants', () => {
    it('should render default variant', () => {
      render(<Button variant="default">Button</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-primary');
    });

    it('should render destructive variant', () => {
      render(<Button variant="destructive">Button</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-destructive');
    });

    it('should render outline variant', () => {
      render(<Button variant="outline">Button</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('border');
      expect(button).toHaveClass('border-input');
    });

    it('should render secondary variant', () => {
      render(<Button variant="secondary">Button</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-secondary');
    });

    it('should render ghost variant', () => {
      render(<Button variant="ghost">Button</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('hover:bg-accent');
    });

    it('should render link variant', () => {
      render(<Button variant="link">Button</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('text-primary');
      expect(button).toHaveClass('underline-offset-4');
    });
  });

  describe('Sizes', () => {
    it('should render default size', () => {
      render(<Button size="default">Button</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-10');
      expect(button).toHaveClass('px-4');
      expect(button).toHaveClass('py-2');
    });

    it('should render sm size', () => {
      render(<Button size="sm">Button</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-9');
      expect(button).toHaveClass('px-3');
    });

    it('should render lg size', () => {
      render(<Button size="lg">Button</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-11');
      expect(button).toHaveClass('px-8');
    });

    it('should render icon size', () => {
      render(<Button size="icon">Button</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-10');
      expect(button).toHaveClass('w-10');
    });
  });

  describe('Interactions', () => {
    it('should handle click events', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);

      fireEvent.click(screen.getByRole('button'));

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not trigger click when disabled', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick} disabled>Click me</Button>);

      fireEvent.click(screen.getByRole('button'));

      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should handle multiple clicks', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);

      const button = screen.getByRole('button');
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(3);
    });

    it('should be keyboard accessible', () => {
      const handleClick = jest.fn();
      render(<Button onClick={handleClick}>Click me</Button>);

      const button = screen.getByRole('button');
      button.focus();
      expect(document.activeElement).toBe(button);

      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalled();
    });
  });

  describe('Disabled State', () => {
    it('should render disabled button', () => {
      render(<Button disabled>Button</Button>);

      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should apply disabled styles', () => {
      render(<Button disabled>Button</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('disabled:pointer-events-none');
      expect(button).toHaveClass('disabled:opacity-50');
    });

    it('should handle disabled with different variants', () => {
      const { rerender } = render(<Button variant="default" disabled>Button</Button>);
      expect(screen.getByRole('button')).toBeDisabled();

      rerender(<Button variant="outline" disabled>Button</Button>);
      expect(screen.getByRole('button')).toBeDisabled();

      rerender(<Button variant="ghost" disabled>Button</Button>);
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('AsChild Functionality', () => {
    it('should render as child when asChild is true', () => {
      render(
        <Button asChild>
          <Link href="/test">Link Button</Link>
        </Button>
      );

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/test');
    });
  });

  describe('HTML Attributes', () => {
    it('should accept type attribute', () => {
      render(<Button type="submit">Submit</Button>);

      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });

    it('should accept aria attributes', () => {
      render(
        <Button aria-label="Custom label" aria-pressed="true">
          Button
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Custom label');
      expect(button).toHaveAttribute('aria-pressed', 'true');
    });

    it('should accept data attributes', () => {
      render(<Button data-testid="custom-button" data-value="test">Button</Button>);

      const button = screen.getByTestId('custom-button');
      expect(button).toHaveAttribute('data-value', 'test');
    });

    it('should accept id attribute', () => {
      render(<Button id="my-button">Button</Button>);

      expect(screen.getByRole('button')).toHaveAttribute('id', 'my-button');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty children', () => {
      render(<Button></Button>);

      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should handle long text content', () => {
      const longText = 'This is a very long button text that should still render properly';
      render(<Button>{longText}</Button>);

      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it('should handle special characters in content', () => {
      render(<Button>{"Click <>&\" me"}</Button>);

      expect(screen.getByText('Click <>&" me')).toBeInTheDocument();
    });

    it('should handle JSX children', () => {
      render(
        <Button>
          <span>Icon</span> Text
        </Button>
      );

      expect(screen.getByText('Icon')).toBeInTheDocument();
      expect(screen.getByText('Text')).toBeInTheDocument();
    });

    it('should combine variant and size classes correctly', () => {
      render(
        <Button variant="outline" size="lg">
          Button
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('border');
      expect(button).toHaveClass('h-11');
    });

    it('should merge custom className with variant classes', () => {
      render(
        <Button variant="default" className="custom-class">
          Button
        </Button>
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
      expect(button).toHaveClass('bg-primary');
    });
  });

  describe('Accessibility', () => {
    it('should have proper focus styles', () => {
      render(<Button>Button</Button>);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('focus-visible:outline-none');
      expect(button).toHaveClass('focus-visible:ring-2');
    });

    it('should be accessible via keyboard', () => {
      render(<Button>Button</Button>);

      const button = screen.getByRole('button');
      button.focus();

      expect(document.activeElement).toBe(button);
    });

    it('should have correct role', () => {
      render(<Button>Button</Button>);

      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should support screen reader text', () => {
      render(
        <Button>
          <span className="sr-only">Screen reader text</span>
          <span>Visible text</span>
        </Button>
      );

      expect(screen.getByText('Screen reader text')).toBeInTheDocument();
      expect(screen.getByText('Visible text')).toBeInTheDocument();
    });
  });
});