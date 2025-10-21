import React from 'react';
import { render } from '@testing-library/react';
import { InterestCTA } from '../InterestCTA';

describe('InterestCTA', () => {
  it('renders without crashing', () => {
    render(<InterestCTA />);
  });
});
