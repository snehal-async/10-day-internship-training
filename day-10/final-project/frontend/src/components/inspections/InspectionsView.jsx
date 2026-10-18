import { useState, useMemo } from 'react';
import { Plus, Search, ArrowUpDown, Calendar, Eye, } from 'lucide-react';
import { OutcomeBadge } from '../common/Badge';
export function InspectionsView({ inspections, facilities, isLoading, onViewInspection, onRecordInspection, }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [facilityFilter, setFacilityFilter] = useState('all');
    const [outcomeFilter, setOutcomeFilter] = useState('all');
    const [sortField, setSortField] = useState('date');
    const [sortAsc, setSortAsc] = useState(false);
    const filteredInspections = useMemo(() => {
        return inspections
            .filter((ins) => {
            const matchesSearch = (ins.facility_name && ins.facility_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                ins.inspection_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (ins.inspector_name && ins.inspector_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                ins.findings.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFacility = facilityFilter === 'all' || ins.facility_id === Number(facilityFilter);
            const matchesOutcome = outcomeFilter === 'all' || ins.outcome === outcomeFilter;
            return matchesSearch && matchesFacility && matchesOutcome;
        })
            .sort((a, b) => {
            if (sortField === 'date') {
                const timeA = new Date(a.inspection_date).getTime();
                const timeB = new Date(b.inspection_date).getTime();
                return sortAsc ? timeA - timeB : timeB - timeA;
            }
            if (sortField === 'score') {
                return sortAsc ? a.score - b.score : b.score - a.score;
            }
            return 0;
        });
    }, [inspections, searchTerm, facilityFilter, outcomeFilter, sortField, sortAsc]);
    function handleSort(field) {
        if (sortField === field) {
            setSortAsc(!sortAsc);
        }
        else {
            setSortField(field);
            setSortAsc(false);
        }
    }
    return (<div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            Compliance & Statutory Audits
          </h1>
          <p className="page-subtitle">
            Safety, environmental, and structural audit registry ({filteredInspections.length} recorded evaluations)
          </p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={onRecordInspection}>
            <Plus size={16}/>
            <span>Record New Audit</span>
          </button>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <div className="card-body" style={{ padding: '1rem 1.25rem', display: 'flex', flexWrap: 'wrap', gap: '0.875rem', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flex: '1 1 280px', minWidth: 260, position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}/>
            <input type="text" placeholder="Filter by audit code, facility, auditor, or findings..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="form-control" style={{ paddingLeft: '2.25rem' }}/>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
            {/* Facility Filter */}
            <select value={facilityFilter} onChange={(e) => setFacilityFilter(e.target.value)} className="form-control" style={{ width: 200 }} aria-label="Filter by facility">
              <option value="all">All Managed Facilities</option>
              {facilities.map((fac) => (<option key={fac.id} value={fac.id}>
                  {fac.name} ({fac.facility_code})
                </option>))}
            </select>

            {/* Outcome Filter */}
            <select value={outcomeFilter} onChange={(e) => setOutcomeFilter(e.target.value)} className="form-control" style={{ width: 170 }} aria-label="Filter by outcome">
              <option value="all">All Audit Outcomes</option>
              <option value="passed">Passed Audit</option>
              <option value="needs_improvement">Needs Improvement</option>
              <option value="failed">Failed Audit</option>
            </select>

            {(searchTerm || facilityFilter !== 'all' || outcomeFilter !== 'all') && (<button className="btn btn-ghost btn-sm" onClick={() => {
                setSearchTerm('');
                setFacilityFilter('all');
                setOutcomeFilter('all');
            }}>
                Clear
              </button>)}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Audit Reference</th>
              <th>Facility Asset</th>
              <th className="sortable" onClick={() => handleSort('date')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  Audit Date
                  <ArrowUpDown size={12}/>
                </div>
              </th>
              <th>Inspector</th>
              <th className="sortable" onClick={() => handleSort('score')}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  Compliance Score
                  <ArrowUpDown size={12}/>
                </div>
              </th>
              <th>Outcome</th>
              <th>Follow-up</th>
              <th style={{ textAlign: 'right' }}>Inspection Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredInspections.length > 0 ? (filteredInspections.map((ins) => (<tr key={ins.id}>
                  <td>
                    <span className="badge-code" style={{ fontWeight: 700 }}>
                      {ins.inspection_code}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {ins.facility_name || `Facility #${ins.facility_id}`}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {ins.facility_code}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8125rem' }}>
                      <Calendar size={13} color="var(--text-muted)"/>
                      <span>{ins.inspection_date}</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                      {ins.inspector_name || 'Inspector'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                      <span style={{
                fontWeight: 800,
                fontSize: '0.9375rem',
                fontVariantNumeric: 'tabular-nums',
                color: ins.score >= 80 ? 'var(--emerald-600)' : ins.score >= 60 ? 'var(--amber-600)' : 'var(--rose-600)',
            }}>
                        {ins.score}%
                      </span>
                      <div style={{ width: 56, height: 6, backgroundColor: 'var(--border-subtle)', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{
                width: `${ins.score}%`,
                height: '100%',
                backgroundColor: ins.score >= 80 ? 'var(--emerald-600)' : ins.score >= 60 ? 'var(--amber-500)' : 'var(--rose-500)',
            }}/>
                      </div>
                    </div>
                  </td>
                  <td>
                    <OutcomeBadge outcome={ins.outcome}/>
                  </td>
                  <td>
                    {ins.requires_follow_up ? (<span style={{ fontSize: '0.75rem', color: 'var(--rose-600)', fontWeight: 600 }}>
                        Required ({ins.follow_up_date || 'TBD'})
                      </span>) : (<span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>None</span>)}
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => onViewInspection(ins)}>
                      <Eye size={14}/>
                      <span>Review</span>
                    </button>
                  </td>
                </tr>))) : (<tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                  No statutory audits found matching your criteria.
                </td>
              </tr>)}
          </tbody>
        </table>
      </div>
    </div>);
}
