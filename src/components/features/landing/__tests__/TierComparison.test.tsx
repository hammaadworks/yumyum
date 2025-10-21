import React from 'react';
import { render } from '@testing-library/react';
import { TierComparison } from '../TierComparison';

describe('TierComparison', () => {
  it('renders without crashing', () => {
    render(<TierComparison />);
  });
});
