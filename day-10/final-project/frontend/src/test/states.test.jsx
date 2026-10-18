import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorState } from '../components/common/ErrorState';
describe('Common States (EmptyState & ErrorState)', () => {
    it('renders EmptyState with custom title, description, and action button', () => {
        const handleAction = vi.fn();
        render(<EmptyState title="No Maintenance Records Found" description="There are currently no open work orders registered in this sector." actionLabel="Create Work Order" onAction={handleAction}/>);
        expect(screen.getByText('No Maintenance Records Found')).toBeInTheDocument();
        expect(screen.getByText('There are currently no open work orders registered in this sector.')).toBeInTheDocument();
        const actionButton = screen.getByRole('button', { name: /Create Work Order/i });
        expect(actionButton).toBeInTheDocument();
        fireEvent.click(actionButton);
        expect(handleAction).toHaveBeenCalledTimes(1);
    });
    it('renders ErrorState with error message and retry button', () => {
        const handleRetry = vi.fn();
        render(<ErrorState title="PostgreSQL Telemetry Unavailable" message="Connection to backend endpoint timed out after 3000ms." onRetry={handleRetry} isRetrying={false}/>);
        expect(screen.getByText('PostgreSQL Telemetry Unavailable')).toBeInTheDocument();
        expect(screen.getByText('Connection to backend endpoint timed out after 3000ms.')).toBeInTheDocument();
        const retryButton = screen.getByRole('button', { name: /Retry Connection/i });
        expect(retryButton).toBeInTheDocument();
        fireEvent.click(retryButton);
        expect(handleRetry).toHaveBeenCalledTimes(1);
    });
    it('disables retry button when isRetrying is true', () => {
        render(<ErrorState message="Backend offline" onRetry={vi.fn()} isRetrying={true}/>);
        const retryButton = screen.getByRole('button', { name: /Retrying.../i });
        expect(retryButton).toBeDisabled();
    });
});
