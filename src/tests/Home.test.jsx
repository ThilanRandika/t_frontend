import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import { describe, it, expect } from 'vitest';

// Helper to render inside router since Home has <Link> components
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('Home Component', () => {
  it('renders the main hero text', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText(/The Future of/i)).toBeInTheDocument();
    expect(screen.getByText(/Online Shopping/i)).toBeInTheDocument();
  });

  it('renders call to action buttons', () => {
    renderWithRouter(<Home />);
    const shopBtn = screen.getByText(/Shop Now/i);
    const registerBtn = screen.getByText(/Create Account/i);
    expect(shopBtn).toBeInTheDocument();
    expect(shopBtn.closest('a')).toHaveAttribute('href', '/products');
    expect(registerBtn).toBeInTheDocument();
    expect(registerBtn.closest('a')).toHaveAttribute('href', '/register');
  });

  it('displays the architecture section', () => {
    renderWithRouter(<Home />);
    expect(screen.getByText('🏗 Architecture')).toBeInTheDocument();
    expect(screen.getByText('Frontend')).toBeInTheDocument();
    expect(screen.getByText('User Service')).toBeInTheDocument();
  });
});
