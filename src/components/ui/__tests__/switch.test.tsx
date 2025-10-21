import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Switch } from '../Switch';

describe('Switch Component', () => {
  describe('Rendering', () => {
    it('should render switch element', () => {
      render(<Switch />);

      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    it('should apply default classes', () => {
      render(<Switch />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveClass('peer');
      expect(switchElement).toHaveClass('inline-flex');
    });

    it('should accept custom className', () => {
      render(<Switch className="custom-class" />);

      expect(screen.getByRole('switch')).toHaveClass('custom-class');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(<Switch ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('Checked State', () => {
    it('should render unchecked by default', () => {
      render(<Switch />);

      expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');
    });

    it('should render checked when checked prop is true', () => {
      render(<Switch checked />);

      expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
    });

    it('should toggle checked state on click', () => {
      const handleChange = jest.fn();
      render(<Switch onCheckedChange={handleChange} />);

      const switchElement = screen.getByRole('switch');
      fireEvent.click(switchElement);

      expect(handleChange).toHaveBeenCalledWith(true);
    });

    it('should handle controlled component', () => {
      const handleChange = jest.fn();
      const { rerender } = render(<Switch checked={false} onCheckedChange={handleChange} />);

      expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false');

      rerender(<Switch checked={true} onCheckedChange={handleChange} />);
      expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
    });

    it('should handle uncontrolled component with defaultChecked', () => {
      render(<Switch defaultChecked />);

      expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
    });
  });

  describe('Disabled State', () => {
    it('should render disabled switch', () => {
      render(<Switch disabled />);

      expect(screen.getByRole('switch')).toBeDisabled();
    });

    it('should apply disabled styles', () => {
      render(<Switch disabled />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveClass('disabled:cursor-not-allowed');
      expect(switchElement).toHaveClass('disabled:opacity-50');
    });

    it('should not toggle when disabled', () => {
      const handleChange = jest.fn();
      render(<Switch disabled onCheckedChange={handleChange} />);

      const switchElement = screen.getByRole('switch');
      fireEvent.click(switchElement);

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  describe('Interactions', () => {
    it('should handle click events', () => {
      const handleChange = jest.fn();
      render(<Switch onCheckedChange={handleChange} />);

      fireEvent.click(screen.getByRole('switch'));

      expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('should toggle between states', () => {
      const handleChange = jest.fn();
      render(<Switch onCheckedChange={handleChange} />);

      const switchElement = screen.getByRole('switch');

      fireEvent.click(switchElement);
      expect(handleChange).toHaveBeenLastCalledWith(true);

      fireEvent.click(switchElement);
      expect(handleChange).toHaveBeenLastCalledWith(false);
    });

    it('should be keyboard accessible with Space', () => {
      const handleChange = jest.fn();
      render(<Switch onCheckedChange={handleChange} />);

      const switchElement = screen.getByRole('switch');
      switchElement.focus();

      fireEvent.click(switchElement);
      expect(handleChange).toHaveBeenCalled();
    });

    it('should be keyboard accessible with Enter', () => {
      const handleChange = jest.fn();
      render(<Switch onCheckedChange={handleChange} />);

      const switchElement = screen.getByRole('switch');
      switchElement.focus();

      fireEvent.click(switchElement);
      expect(handleChange).toHaveBeenCalled();
    });
  });

  describe('Focus and Blur', () => {
    it('should be focusable', () => {
      render(<Switch />);

      const switchElement = screen.getByRole('switch');
      switchElement.focus();

      expect(document.activeElement).toBe(switchElement);
    });

    it('should have focus styles', () => {
      render(<Switch />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveClass('focus-visible:outline-none');
      expect(switchElement).toHaveClass('focus-visible:ring-2');
    });

    it('should handle onFocus event', () => {
      const handleFocus = jest.fn();
      render(<Switch onFocus={handleFocus} />);

      fireEvent.focus(screen.getByRole('switch'));

      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('should handle onBlur event', () => {
      const handleBlur = jest.fn();
      render(<Switch onBlur={handleBlur} />);

      const switchElement = screen.getByRole('switch');
      fireEvent.focus(switchElement);
      fireEvent.blur(switchElement);

      expect(handleBlur).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('should have correct role', () => {
      render(<Switch />);

      expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    it('should have aria-checked attribute', () => {
      render(<Switch checked />);

      expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true');
    });

    it('should work with labels', () => {
      render(
        <>
          <label htmlFor="terms-switch">Accept Terms</label>
          <Switch id="terms-switch" />
        </>
      );

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('id', 'terms-switch');
    });

    it('should support aria-label', () => {
      render(<Switch aria-label="Toggle feature" />);

      expect(screen.getByLabelText('Toggle feature')).toBeInTheDocument();
    });

    it('should support aria-labelledby', () => {
      render(
        <>
          <span id="switch-label">Enable notifications</span>
          <Switch aria-labelledby="switch-label" />
        </>
      );

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveAttribute('aria-labelledby', 'switch-label');
    });
  });

  describe('Edge Cases', () => {
    it('should handle rapid toggling', () => {
      const handleChange = jest.fn();
      render(<Switch onCheckedChange={handleChange} />);

      const switchElement = screen.getByRole('switch');

      for (let i = 0; i < 10; i++) {
        fireEvent.click(switchElement);
      }

      expect(handleChange).toHaveBeenCalledTimes(10);
    });

    it('should accept data attributes', () => {
      render(<Switch data-testid="custom-switch" data-value="test" />);

      const switchElement = screen.getByTestId('custom-switch');
      expect(switchElement).toHaveAttribute('data-value', 'test');
    });

    it('should handle name attribute', () => {
      render(<Switch name="feature-toggle" />);

      expect(screen.getByRole('switch')).toHaveAttribute('name', 'feature-toggle');
    });

    it('should merge custom className with default classes', () => {
      render(<Switch className="custom-class" />);

      const switchElement = screen.getByRole('switch');
      expect(switchElement).toHaveClass('custom-class');
      expect(switchElement).toHaveClass('peer');
    });
  });

  describe('Visual States', () => {
    it('should have different styles for checked state', () => {
      const { rerender } = render(<Switch checked={false} />);
      const switchElement = screen.getByRole('switch');

      expect(switchElement).toHaveClass('data-[state=unchecked]:bg-input');

      rerender(<Switch checked={true} />);
      expect(switchElement).toHaveClass('data-[state=checked]:bg-primary');
    });

    it('should have thumb element', () => {
      const { container } = render(<Switch />);

      const thumb = container.querySelector('[data-state]');
      expect(thumb).toBeInTheDocument();
    });
  });
});