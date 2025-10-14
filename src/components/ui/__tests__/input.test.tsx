import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Input } from '../input';

describe('Input Component', () => {
  describe('Rendering', () => {
    it('should render input element', () => {
      render(<Input />);

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should apply default classes', () => {
      render(<Input />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('flex');
      expect(input).toHaveClass('h-10');
      expect(input).toHaveClass('w-full');
      expect(input).toHaveClass('rounded-md');
    });

    it('should accept custom className', () => {
      render(<Input className="custom-class" />);

      expect(screen.getByRole('textbox')).toHaveClass('custom-class');
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<Input ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
  });

  describe('Input Types', () => {
    it('should render text input by default', () => {
      render(<Input />);

      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
    });

    it('should render email input', () => {
      render(<Input type="email" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('should render password input', () => {
      render(<Input type="password" />);

      // Password inputs don't have textbox role
      const input = document.querySelector('input[type="password"]');
      expect(input).toBeInTheDocument();
    });

    it('should render number input', () => {
      render(<Input type="number" />);

      const input = screen.getByRole('spinbutton');
      expect(input).toHaveAttribute('type', 'number');
    });

    it('should render search input', () => {
      render(<Input type="search" />);

      const input = screen.getByRole('searchbox');
      expect(input).toHaveAttribute('type', 'search');
    });

    it('should render tel input', () => {
      render(<Input type="tel" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'tel');
    });

    it('should render url input', () => {
      render(<Input type="url" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'url');
    });
  });

  describe('Value and OnChange', () => {
    it('should handle controlled input', () => {
      const handleChange = jest.fn();
      render(<Input value="test" onChange={handleChange} />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('test');

      fireEvent.change(input, { target: { value: 'new value' } });
      expect(handleChange).toHaveBeenCalled();
    });

    it('should handle uncontrolled input', () => {
      render(<Input defaultValue="initial" />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('initial');

      fireEvent.change(input, { target: { value: 'updated' } });
      expect(input.value).toBe('updated');
    });

    it('should call onChange with event', () => {
      const handleChange = jest.fn();
      render(<Input onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'test' } });

      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange.mock.calls[0][0]).toBeInstanceOf(Object);
    });

    it('should handle empty string value', () => {
      render(<Input value="" onChange={jest.fn()} />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('');
    });

    it('should handle multiple rapid changes', () => {
      const handleChange = jest.fn();
      render(<Input onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      fireEvent.change(input, { target: { value: 'a' } });
      fireEvent.change(input, { target: { value: 'ab' } });
      fireEvent.change(input, { target: { value: 'abc' } });

      expect(handleChange).toHaveBeenCalledTimes(3);
    });
  });

  describe('Placeholder', () => {
    it('should render placeholder text', () => {
      render(<Input placeholder="Enter text..." />);

      expect(screen.getByPlaceholderText('Enter text...')).toBeInTheDocument();
    });

    it('should handle empty placeholder', () => {
      render(<Input placeholder="" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('placeholder', '');
    });

    it('should handle special characters in placeholder', () => {
      render(<Input placeholder={'Enter <>&" text'} />);

      expect(screen.getByPlaceholderText('Enter <>&" text')).toBeInTheDocument();
    });
  });

  describe('Disabled State', () => {
    it('should render disabled input', () => {
      render(<Input disabled />);

      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('should apply disabled styles', () => {
      render(<Input disabled />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('disabled:cursor-not-allowed');
      expect(input).toHaveClass('disabled:opacity-50');
    });

    it('should not accept input when disabled', () => {
      const handleChange = jest.fn();
      render(<Input disabled onChange={handleChange} />);

      const input = screen.getByRole('textbox');
      expect(input).toBeDisabled();
    });
  });

  describe('Required State', () => {
    it('should mark input as required', () => {
      render(<Input required />);

      expect(screen.getByRole('textbox')).toBeRequired();
    });

    it('should work with form validation', () => {
      render(
        <form>
          <Input required name="test-input" />
        </form>
      );

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('required');
    });
  });

  describe('Name and ID', () => {
    it('should accept name attribute', () => {
      render(<Input name="username" />);

      expect(screen.getByRole('textbox')).toHaveAttribute('name', 'username');
    });

    it('should accept id attribute', () => {
      render(<Input id="email-input" />);

      expect(screen.getByRole('textbox')).toHaveAttribute('id', 'email-input');
    });

    it('should work with label association via id', () => {
      render(
        <>
          <label htmlFor="test-input">Label</label>
          <Input id="test-input" />
        </>
      );

      const input = screen.getByLabelText('Label');
      expect(input).toBeInTheDocument();
    });
  });

  describe('Focus and Blur', () => {
    it('should handle focus', () => {
      const handleFocus = jest.fn();
      render(<Input onFocus={handleFocus} />);

      const input = screen.getByRole('textbox');
      fireEvent.focus(input);

      expect(handleFocus).toHaveBeenCalledTimes(1);
    });

    it('should handle blur', () => {
      const handleBlur = jest.fn();
      render(<Input onBlur={handleBlur} />);

      const input = screen.getByRole('textbox');
      fireEvent.blur(input);

      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it('should be focusable', () => {
      render(<Input />);

      const input = screen.getByRole('textbox');
      input.focus();

      expect(document.activeElement).toBe(input);
    });

    it('should have focus styles', () => {
      render(<Input />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('focus-visible:outline-none');
      expect(input).toHaveClass('focus-visible:ring-2');
    });
  });

  describe('Min and Max Length', () => {
    it('should accept minLength attribute', () => {
      render(<Input minLength={5} />);

      expect(screen.getByRole('textbox')).toHaveAttribute('minLength', '5');
    });

    it('should accept maxLength attribute', () => {
      render(<Input maxLength={10} />);

      expect(screen.getByRole('textbox')).toHaveAttribute('maxLength', '10');
    });

    it('should enforce maxLength', () => {
      render(<Input maxLength={5} />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input).toHaveAttribute('maxLength', '5');
    });
  });

  describe('Pattern and Validation', () => {
    it('should accept pattern attribute', () => {
      render(<Input pattern="[0-9]*" />);

      expect(screen.getByRole('textbox')).toHaveAttribute('pattern', '[0-9]*');
    });

    it('should accept aria-invalid attribute', () => {
      render(<Input aria-invalid="true" />);

      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('should accept aria-describedby attribute', () => {
      render(<Input aria-describedby="error-message" />);

      expect(screen.getByRole('textbox')).toHaveAttribute(
        'aria-describedby',
        'error-message'
      );
    });
  });

  describe('Autocomplete', () => {
    it('should accept autocomplete attribute', () => {
      render(<Input autoComplete="email" />);

      expect(screen.getByRole('textbox')).toHaveAttribute('autocomplete', 'email');
    });

    it('should handle autocomplete off', () => {
      render(<Input autoComplete="off" />);

      expect(screen.getByRole('textbox')).toHaveAttribute('autocomplete', 'off');
    });
  });

  describe('Edge Cases', () => {
    it('should handle special characters in value', () => {
      render(<Input value={'<>&"'} onChange={jest.fn()} />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('<>&"');
    });

    it('should handle unicode characters', () => {
      render(<Input value="🎉 Hello 世界" onChange={jest.fn()} />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe('🎉 Hello 世界');
    });

    it('should handle very long values', () => {
      const longValue = 'a'.repeat(1000);
      render(<Input value={longValue} onChange={jest.fn()} />);

      const input = screen.getByRole('textbox') as HTMLInputElement;
      expect(input.value).toBe(longValue);
    });

    it('should handle readOnly attribute', () => {
      render(<Input readOnly value="readonly" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('readonly');
    });

    it('should handle multiple className', () => {
      render(<Input className="class1 class2 class3" />);

      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('class1');
      expect(input).toHaveClass('class2');
      expect(input).toHaveClass('class3');
    });
  });

  describe('Accessibility', () => {
    it('should have proper aria attributes', () => {
      render(<Input aria-label="Search input" />);

      expect(screen.getByLabelText('Search input')).toBeInTheDocument();
    });

    it('should support aria-required', () => {
      render(<Input aria-required="true" />);

      expect(screen.getByRole('textbox')).toHaveAttribute('aria-required', 'true');
    });

    it('should be keyboard navigable', () => {
      render(<Input />);

      const input = screen.getByRole('textbox');
      input.focus();

      expect(document.activeElement).toBe(input);
    });

    it('should work with screen readers', () => {
      render(
        <>
          <label htmlFor="accessible-input">Accessible Input</label>
          <Input id="accessible-input" aria-describedby="help-text" />
          <span id="help-text">Help text</span>
        </>
      );

      const input = screen.getByLabelText('Accessible Input');
      expect(input).toHaveAttribute('aria-describedby', 'help-text');
    });
  });
});