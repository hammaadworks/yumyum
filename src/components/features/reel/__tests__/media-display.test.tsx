import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MediaDisplay } from '@/components/features/reel/MediaDisplay';
import { Dish } from '@/lib/types';

const MOCK_DISH_IMAGE_ONLY: Dish = {
  id: '1',
  name: 'Burger',
  image: 'https://example.com/burger.jpg',
  category: 'Main',
  price: 10,
  description: '',
  instock: 'yes',
  veg: 'non-veg',
};

const MOCK_DISH_WITH_REEL: Dish = {
  id: '2',
  name: 'Pizza Reel',
  image: 'https://example.com/pizza.jpg',
  reel: 'https://example.com/pizza.mp4',
  category: 'Main',
  price: 12,
  description: '',
  instock: 'yes',
  veg: 'veg',
};

describe('MediaDisplay Component', () => {
  // Test Case: 2.2-R-01
  it('should render an image when only an image URL is provided', () => {
    render(<MediaDisplay dish={MOCK_DISH_IMAGE_ONLY} />);
    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image.getAttribute('src')).toContain(
      encodeURIComponent(MOCK_DISH_IMAGE_ONLY.image),
    );
    expect(screen.queryByTestId('video-element')).not.toBeInTheDocument();
  });

  // Test Case: 2.2-R-02
  it('should render a video when a reel URL is provided', () => {
    render(<MediaDisplay dish={MOCK_DISH_WITH_REEL} />);
    const video = screen.getByTestId('video-element');
    expect(video).toBeInTheDocument();
    expect(video).toHaveAttribute('src', MOCK_DISH_WITH_REEL.reel);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  // Test Case: 2.2-A-01
  it('should use the image URL as a poster for the video', () => {
    render(<MediaDisplay dish={MOCK_DISH_WITH_REEL} />);
    const video = screen.getByTestId('video-element');
    expect(video).toHaveAttribute('poster', MOCK_DISH_WITH_REEL.image);
  });

  // Test Case: 2.2-A-02
  it('should have correct playback attributes for the video', () => {
    render(<MediaDisplay dish={MOCK_DISH_WITH_REEL} />);
    const video = screen.getByTestId('video-element');
    expect(video).toHaveAttribute('autoPlay');
    expect(video).toHaveAttribute('loop');
    expect((video as HTMLVideoElement).muted).toBe(true);
    expect(video).toHaveAttribute('playsInline');
  });
});
