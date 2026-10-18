import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { InspectionFormModal } from '../components/inspections/InspectionFormModal';
import { ComplaintFormModal } from '../components/complaints/ComplaintFormModal';
const mockFacilities = [
    {
        id: 1,
        facility_code: 'FAC-B1-001',
        name: 'Metropolitan Logistics Hub',
        type: 'warehouse',
        status: 'operational',
        condition_rating: 'good',
        address: '100 Industrial Parkway',
        city: 'Jersey City',
        state: 'NJ',
        postal_code: '07302',
        country: 'USA',
        capacity: 120000,
        square_feet: 450000,
        created_at: '2026-01-10T08:00:00Z',
        updated_at: '2026-01-10T08:00:00Z',
        department_name: 'Logistics & Supply Chain',
    },
];
const mockInspectors = [
    { id: 1, name: 'Marcus Vance', email: 'marcus.v@facilityops.io', role: 'inspector' },
    { id: 2, name: 'Elena Rostova', email: 'elena.r@facilityops.io', role: 'inspector' },
];
describe('InspectionFormModal Validation & Behavior', () => {
    it('does not render when isOpen is false', () => {
        const { container } = render(<InspectionFormModal isOpen={false} facilities={mockFacilities} inspectors={mockInspectors} onClose={vi.fn()} onSubmit={vi.fn()} isLoading={false}/>);
        expect(container.firstChild).toBeNull();
    });
    it('renders correctly when open and displays initial defaults', () => {
        render(<InspectionFormModal isOpen={true} facilities={mockFacilities} inspectors={mockInspectors} onClose={vi.fn()} onSubmit={vi.fn()} isLoading={false}/>);
        expect(screen.getByText(/Record Statutory Facility Audit/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Audit Protocol Reference/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Inspector Qualitative Observations & Findings/i)).toBeInTheDocument();
    });
    it('validates minimum length for findings and prevents submission', async () => {
        const handleSubmit = vi.fn();
        render(<InspectionFormModal isOpen={true} facilities={mockFacilities} inspectors={mockInspectors} onClose={vi.fn()} onSubmit={handleSubmit} isLoading={false}/>);
        const submitBtn = screen.getByRole('button', { name: /Register Inspection Audit/i });
        const form = submitBtn.closest('form');
        fireEvent.submit(form);
        await waitFor(() => {
            expect(screen.getByText(/Qualitative observations must be at least 10 characters/i)).toBeInTheDocument();
        });
        expect(handleSubmit).not.toHaveBeenCalled();
    });
    it('calculates score grade properly and changes grade classification on slider update', async () => {
        render(<InspectionFormModal isOpen={true} facilities={mockFacilities} inspectors={mockInspectors} onClose={vi.fn()} onSubmit={vi.fn()} isLoading={false}/>);
        const scoreSlider = screen.getByLabelText(/Compliance score percentage slider/i);
        fireEvent.change(scoreSlider, { target: { value: '65' } });
        await waitFor(() => {
            expect(screen.getByText(/Grade C — Needs Corrective Action/i)).toBeInTheDocument();
        });
    });
    it('submits successfully when form fields are valid', async () => {
        const handleSubmit = vi.fn().mockResolvedValue(undefined);
        render(<InspectionFormModal isOpen={true} facilities={mockFacilities} inspectors={mockInspectors} onClose={vi.fn()} onSubmit={handleSubmit} isLoading={false}/>);
        const findingsInput = screen.getByLabelText(/Inspector Qualitative Observations & Findings/i);
        fireEvent.change(findingsInput, {
            target: { value: 'All emergency exits and backup generators meet standard compliance specifications.' },
        });
        const submitBtn = screen.getByRole('button', { name: /Register Inspection Audit/i });
        const form = submitBtn.closest('form');
        fireEvent.submit(form);
        await waitFor(() => {
            expect(handleSubmit).toHaveBeenCalledTimes(1);
        });
    });
});
describe('ComplaintFormModal Validation & Behavior', () => {
    it('validates title and description length', async () => {
        const handleSubmit = vi.fn();
        render(<ComplaintFormModal isOpen={true} facilities={mockFacilities} onClose={vi.fn()} onSubmit={handleSubmit} isLoading={false}/>);
        const submitBtn = screen.getByRole('button', { name: /Dispatch Ticket/i });
        const form = submitBtn.closest('form');
        fireEvent.submit(form);
        await waitFor(() => {
            expect(screen.getByText(/Title must be at least 5 characters/i)).toBeInTheDocument();
            expect(screen.getByText(/Description must be at least 10 characters/i)).toBeInTheDocument();
        });
        expect(handleSubmit).not.toHaveBeenCalled();
    });
    it('submits successfully when filled with valid data', async () => {
        const handleSubmit = vi.fn().mockResolvedValue(undefined);
        render(<ComplaintFormModal isOpen={true} facilities={mockFacilities} onClose={vi.fn()} onSubmit={handleSubmit} isLoading={false}/>);
        const titleInput = screen.getByPlaceholderText(/e.g. Cleanroom Airlock Differential Sensor Fluctuation/i);
        const descInput = screen.getByPlaceholderText(/Specify precise physical location, diagnostic measurements/i);
        fireEvent.change(titleInput, { target: { value: 'Chiller Unit Vibration Anomaly' } });
        fireEvent.change(descInput, {
            target: { value: 'Severe secondary harmonics detected in compressor cooling loop A3.' },
        });
        const submitBtn = screen.getByRole('button', { name: /Dispatch Ticket/i });
        const form = submitBtn.closest('form');
        fireEvent.submit(form);
        await waitFor(() => {
            expect(handleSubmit).toHaveBeenCalledTimes(1);
            expect(handleSubmit).toHaveBeenCalledWith(expect.objectContaining({
                title: 'Chiller Unit Vibration Anomaly',
                category: 'HVAC & Airflow',
                priority: 'high',
            }));
        });
    });
});
