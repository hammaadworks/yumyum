import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Label } from '../Label';

describe('Label Component', () => {
  describe('Rendering', () => {
    it('should render label element', () => {
      render(<Label>Test Label</Label>);

      expect(screen.getByText('Test Label')).toBeInTheDocument();
    });

    it('should apply default classes', () => {
      render(<Label>Label</Label>);

      const label = screen.getByText('Label');
      expect(label).toHaveClass('text-sm');
      expect(label).toHaveClass('font-medium');
    });

    it('should accept custom className', () => {
      render(<Label className="custom-class">Label</Label>);

      expect(screen.getByText('Label')).toHaveClass('custom-class');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLLabelElement>();
      render(<Label ref={ref}>Label</Label>);

      expect(ref.current).toBeInstanceOf(HTMLLabelElement);
    });
  });

  describe('htmlFor Association', () => {
    it('should associate with input via htmlFor', () => {
      render(
        <>
          <Label htmlFor="test-input">Test Label</Label>
          <input id="test-input" />
        </>
      );

      const label = screen.getByText('Test Label');
      expect(label).toHaveAttribute('for', 'test-input');
    });

    it('should enable clicking label to focus input', () => {
      render(
        <>
          <Label htmlFor="email">Email</Label>
          <input id="email" type="email" />
        </>
      );

      const label = screen.getByText('Email');
      const input = screen.getByRole('textbox');

      label.click();
      input.focus();
      expect(document.activeElement).toBe(input);
    });
  });

  describe('Disabled State', () => {
    it('should apply disabled styles when disabled', () => {
      render(<Label>Disabled Label</Label>);

      const label = screen.getByText('Disabled Label');
      expect(label).toHaveClass('peer-disabled:cursor-not-allowed');
      expect(label).toHaveClass('peer-disabled:opacity-70');
    });
  });

  describe('Content', () => {
    it('should render text content', () => {
      render(<Label>Simple Text</Label>);

      expect(screen.getByText('Simple Text')).toBeInTheDocument();
    });

    it('should render JSX children', () => {
      render(
        <Label>
          <span>Required</span> *
        </Label>
      );

      expect(screen.getByText('Required')).toBeInTheDocument();
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('should handle special characters', () => {
      render(<Label>{"Label <>&\""}</Label>);

      expect(screen.getByText('Label <>&"')).toBeInTheDocument();
    });

    it('should handle long text', () => {
      const longText = 'This is a very long label text that might wrap to multiple lines';
      render(<Label>{longText}</Label>);

      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it('should handle empty content', () => {
      render(<Label></Label>);

      const label = document.querySelector('label');
      expect(label).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have correct semantic HTML', () => {
      render(<Label>Accessible Label</Label>);

      const label = screen.getByText('Accessible Label');
      expect(label.tagName).toBe('LABEL');
    });

    it('should support required indicators', () => {
      render(
        <Label>
          Email <span aria-label="required">*</span>
        </Label>
      );

      expect(screen.getByLabelText('required')).toBeInTheDocument();
    });

    it('should work with screen readers', () => {
      render(
        <>
          <Label htmlFor="accessible-input">Accessible Input</Label>
          <input id="accessible-input" aria-labelledby="accessible-input" />
        </>
      );

      const label = screen.getByText('Accessible Input');
      expect(label).toHaveAttribute('for', 'accessible-input');
    });
  });

  describe('Edge Cases', () => {
    it('should handle multiple class names', () => {
      render(<Label className="class1 class2 class3">Label</Label>);

      const label = screen.getByText('Label');
      expect(label).toHaveClass('class1');
      expect(label).toHaveClass('class2');
      expect(label).toHaveClass('class3');
    });

    it('should accept data attributes', () => {
      render(<Label data-testid="custom-label">Label</Label>);

      expect(screen.getByTestId('custom-label')).toBeInTheDocument();
    });

    it('should handle nested elements', () => {
      render(
        <Label>
          <strong>Bold</strong> <em>Italic</em>
        </Label>
      );

      expect(screen.getByText('Bold')).toBeInTheDocument();
      expect(screen.getByText('Italic')).toBeInTheDocument();
    });
  });
});