import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { FacilitiesView } from '../components/facilities/FacilitiesView';
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
    {
        id: 2,
        facility_code: 'FAC-B2-004',
        name: 'Apollo Biotechnology Center',
        type: 'laboratory',
        status: 'operational',
        condition_rating: 'excellent',
        address: '45 BioTech Blvd',
        city: 'Cambridge',
        state: 'MA',
        postal_code: '02142',
        country: 'USA',
        capacity: 450,
        square_feet: 85000,
        created_at: '2026-01-12T09:30:00Z',
        updated_at: '2026-01-12T09:30:00Z',
        department_name: 'Biomedical Research',
    },
    {
        id: 3,
        facility_code: 'FAC-C3-009',
        name: 'Old Mill Storage Annex',
        type: 'warehouse',
        status: 'under_maintenance',
        condition_rating: 'critical',
        address: '99 Riverbed Rd',
        city: 'Allentown',
        state: 'PA',
        postal_code: '18101',
        country: 'USA',
        capacity: 50,
        square_feet: 22000,
        created_at: '2026-01-15T11:00:00Z',
        updated_at: '2026-01-15T11:00:00Z',
        department_name: 'Estate Management',
    },
];
describe('FacilitiesView Search & Filtering', () => {
    it('renders table rows for all facilities', () => {
        render(<MemoryRouter>
        <FacilitiesView facilities={mockFacilities} isLoading={false} onViewFacility={vi.fn()} onEditFacility={vi.fn()} onDeleteFacility={vi.fn()} onCreateFacility={vi.fn()} onRecordAudit={vi.fn()}/>
      </MemoryRouter>);
        expect(screen.getByText('Metropolitan Logistics Hub')).toBeInTheDocument();
        expect(screen.getByText('Apollo Biotechnology Center')).toBeInTheDocument();
        expect(screen.getByText('Old Mill Storage Annex')).toBeInTheDocument();
    });
    it('filters facilities by search term', () => {
        render(<MemoryRouter>
        <FacilitiesView facilities={mockFacilities} isLoading={false} onViewFacility={vi.fn()} onEditFacility={vi.fn()} onDeleteFacility={vi.fn()} onCreateFacility={vi.fn()} onRecordAudit={vi.fn()}/>
      </MemoryRouter>);
        const searchInput = screen.getByLabelText(/Search facilities/i);
        fireEvent.change(searchInput, { target: { value: 'Apollo' } });
        expect(screen.getByText('Apollo Biotechnology Center')).toBeInTheDocument();
        expect(screen.queryByText('Metropolitan Logistics Hub')).not.toBeInTheDocument();
        expect(screen.queryByText('Old Mill Storage Annex')).not.toBeInTheDocument();
    });
    it('filters facilities by condition rating', () => {
        render(<MemoryRouter>
        <FacilitiesView facilities={mockFacilities} isLoading={false} onViewFacility={vi.fn()} onEditFacility={vi.fn()} onDeleteFacility={vi.fn()} onCreateFacility={vi.fn()} onRecordAudit={vi.fn()}/>
      </MemoryRouter>);
        const conditionSelect = screen.getByRole('combobox', { name: /Filter by condition rating/i });
        fireEvent.change(conditionSelect, { target: { value: 'critical' } });
        expect(screen.getByText('Old Mill Storage Annex')).toBeInTheDocument();
        expect(screen.queryByText('Apollo Biotechnology Center')).not.toBeInTheDocument();
    });
    it('displays empty state when search produces no matching facilities', () => {
        render(<MemoryRouter>
        <FacilitiesView facilities={mockFacilities} isLoading={false} onViewFacility={vi.fn()} onEditFacility={vi.fn()} onDeleteFacility={vi.fn()} onCreateFacility={vi.fn()} onRecordAudit={vi.fn()}/>
      </MemoryRouter>);
        const searchInput = screen.getByLabelText(/Search facilities/i);
        fireEvent.change(searchInput, { target: { value: 'NonExistentFacilityQuery123' } });
        expect(screen.getByText(/No facilities found/i)).toBeInTheDocument();
        expect(screen.getByText(/No facilities match your active search filters/i)).toBeInTheDocument();
    });
    it('invokes onViewFacility callback when viewing an item', () => {
        const handleView = vi.fn();
        render(<MemoryRouter>
        <FacilitiesView facilities={mockFacilities} isLoading={false} onViewFacility={handleView} onEditFacility={vi.fn()} onDeleteFacility={vi.fn()} onCreateFacility={vi.fn()} onRecordAudit={vi.fn()}/>
      </MemoryRouter>);
        const viewButton = screen.getByLabelText(/View details for Metropolitan Logistics Hub/i);
        fireEvent.click(viewButton);
        expect(handleView).toHaveBeenCalledTimes(1);
        expect(handleView).toHaveBeenCalledWith(mockFacilities[0]);
    });
});
