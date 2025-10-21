import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GlobalCart } from './global-cart';
import { useCartItemCount } from '@/store/use-cart.store';
import { useUIStore } from '@/store/use-ui.store';

// Define mock type for the Zustand store
type MockUIStore = typeof useUIStore;

// Mock the entire modules for Zustand stores
jest.mock('@/store/use-cart.store', () => ({
  useCartItemCount: jest.fn(),
}));
jest.mock('@/store/use-ui.store', () => ({
  useUIStore: jest.fn(),
}));

describe('GlobalCart', () => {
  let mockUIStoreState: any;
  const mockOpenCartSummary = jest.fn();

  beforeEach(() => {
    mockUIStoreState = {
      isReelViewOpen: false,
      openReelView: jest.fn(),
      closeReelView: jest.fn(),
      activeDishId: null,
      setActiveDishId: jest.fn(),
      isCartSummaryOpen: false,
      openCartSummary: mockOpenCartSummary,
      closeCartSummary: jest.fn(),
      isFeedbackViewOpen: false,
      openFeedbackView: jest.fn(),
      closeFeedbackView: jest.fn(),
      isStatusViewerOpen: false,
      openStatusViewer: jest.fn(),
      closeStatusViewer: jest.fn(),
      isQRCodeModalOpen: false,
      openQRCodeModal: jest.fn(),
      closeQRCodeModal: jest.fn(),
    };
    (useUIStore as unknown as jest.MockedFunction<MockUIStore>).mockImplementation(() => mockUIStoreState);
  });

  it('should render the cart icon', () => {
    (useCartItemCount as jest.Mock).mockReturnValue(0);
    render(<GlobalCart />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should not display the badge when the cart is empty', () => {
    (useCartItemCount as jest.Mock).mockReturnValue(0);
    render(<GlobalCart />);
    expect(screen.queryByTestId('cart-badge')).not.toBeInTheDocument();
  });

  it('should display the badge with the correct item count', () => {
    (useCartItemCount as jest.Mock).mockReturnValue(5);
    render(<GlobalCart />);
    const badge = screen.getByTestId('cart-badge');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveTextContent('5');
  });

  it('should call openCartSummary when the button is clicked', () => {
    (useCartItemCount as jest.Mock).mockReturnValue(0);
    render(<GlobalCart />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockOpenCartSummary).toHaveBeenCalled();
  });
});
