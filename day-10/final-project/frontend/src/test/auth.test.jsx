import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthModal } from '../components/common/AuthModal';
import { api } from '../services/api';

vi.mock('../services/api', () => ({
  api: {
    login: vi.fn(),
    register: vi.fn(),
  },
}));

describe('AuthModal Sign In and Register Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Sign In mode by default with tabs and email field', () => {
    render(<AuthModal isOpen={true} onClose={vi.fn()} onSuccess={vi.fn()} />);

    expect(screen.getByRole('heading', { name: /Sign In to FacilityOps/i })).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Sign In/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
  });

  it('switches to Register / Create Account mode when clicking Create Account tab', () => {
    render(<AuthModal isOpen={true} onClose={vi.fn()} onSuccess={vi.fn()} />);

    const createAccountTab = screen.getByRole('button', { name: /Create Account/i });
    fireEvent.click(createAccountTab);

    expect(screen.getByRole('heading', { name: /Create an Account/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Account Role/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Account & Sign In/i })).toBeInTheDocument();
  });

  it('validates mismatched passwords in Register mode', async () => {
    render(<AuthModal isOpen={true} onClose={vi.fn()} onSuccess={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Snehal Solanke' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'snehal@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password999' } });

    const submitBtn = screen.getByRole('button', { name: /Create Account & Sign In/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
    });

    expect(api.register).not.toHaveBeenCalled();
  });

  it('calls api.register and onSuccess when registration form is valid', async () => {
    const mockUser = { id: 10, name: 'Snehal Solanke', email: 'snehal@example.com', role: 'staff' };
    api.register.mockResolvedValueOnce({ user: mockUser, token: 'fake-token-123' });

    const handleSuccess = vi.fn();
    const handleClose = vi.fn();

    render(<AuthModal isOpen={true} onClose={handleClose} onSuccess={handleSuccess} />);

    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Snehal Solanke' } });
    fireEvent.change(screen.getByLabelText(/Email Address/i), { target: { value: 'snehal@example.com' } });
    fireEvent.change(screen.getByLabelText(/^Password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), { target: { value: 'password123' } });

    fireEvent.click(screen.getByRole('button', { name: /Create Account & Sign In/i }));

    await waitFor(() => {
      expect(api.register).toHaveBeenCalledWith({
        name: 'Snehal Solanke',
        email: 'snehal@example.com',
        password: 'password123',
        role: 'staff',
      });
      expect(handleSuccess).toHaveBeenCalledWith(mockUser);
      expect(handleClose).toHaveBeenCalled();
    });
  });
});
