import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, } from 'recharts';
const CONDITION_COLORS = {
    excellent: '#10b981', // emerald
    good: '#059669', // dark emerald
    fair: '#f59e0b', // amber
    poor: '#f97316', // orange
    critical: '#ef4444', // rose
};
const PRIORITY_COLORS = {
    urgent: '#dc2626',
    high: '#ea580c',
    medium: '#d97706',
    low: '#2563eb',
};
export function DashboardCharts({ facilities, complaints, inspectionTrends }) {
    // 1. Condition distribution data for Donut
    const conditionCounts = {
        excellent: 0,
        good: 0,
        fair: 0,
        poor: 0,
        critical: 0,
    };
    facilities.forEach((f) => {
        if (conditionCounts[f.condition_rating] !== undefined) {
            conditionCounts[f.condition_rating]++;
        }
    });
    const conditionData = Object.entries(conditionCounts)
        .filter(([_, value]) => value > 0)
        .map(([key, value]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        ratingKey: key,
        value,
    }));
    // 2. Complaints by Priority data
    const priorityCounts = {
        urgent: 0,
        high: 0,
        medium: 0,
        low: 0,
    };
    complaints.forEach((c) => {
        if (priorityCounts[c.priority] !== undefined) {
            priorityCounts[c.priority]++;
        }
    });
    const priorityData = [
        { priority: 'Urgent', count: priorityCounts.urgent, fill: PRIORITY_COLORS.urgent },
        { priority: 'High', count: priorityCounts.high, fill: PRIORITY_COLORS.high },
        { priority: 'Medium', count: priorityCounts.medium, fill: PRIORITY_COLORS.medium },
        { priority: 'Low', count: priorityCounts.low, fill: PRIORITY_COLORS.low },
    ];
    return (<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
      {/* Chart 1: Inspections Over Time */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Audits Over Time</h2>
            <p className="card-subtitle">Monthly inspection volume & verified passes</p>
          </div>
          <span className="badge badge-info">Recharts</span>
        </div>
        <div className="card-body" style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={inspectionTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)"/>
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }}/>
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }}/>
              <Tooltip contentStyle={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            fontSize: 12,
        }}/>
              <Legend wrapperStyle={{ fontSize: 12 }}/>
              <Bar dataKey="total" name="Total Audits" fill="var(--primary-200)" radius={[4, 4, 0, 0]}/>
              <Bar dataKey="passed" name="Passed" fill="var(--primary-600)" radius={[4, 4, 0, 0]}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Condition Distribution Donut */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Facility Condition Distribution</h2>
            <p className="card-subtitle">Structural rating across managed properties</p>
          </div>
          <span className="badge badge-neutral">{facilities.length} Total</span>
        </div>
        <div className="card-body" style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={conditionData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                {conditionData.map((entry) => (<Cell key={`cell-${entry.name}`} fill={CONDITION_COLORS[entry.ratingKey] || '#6366f1'}/>))}
              </Pie>
              <Tooltip contentStyle={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            fontSize: 12,
        }}/>
              <Legend wrapperStyle={{ fontSize: 12 }}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 3: Complaints by Priority */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">Work Orders by Urgency</h2>
            <p className="card-subtitle">Active maintenance backlog distribution</p>
          </div>
          <span className="badge badge-warning">{complaints.length} Total</span>
        </div>
        <div className="card-body" style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priorityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)"/>
              <XAxis dataKey="priority" tick={{ fontSize: 11, fill: 'var(--text-muted)' }}/>
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} allowDecimals={false}/>
              <Tooltip contentStyle={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-primary)',
            fontSize: 12,
        }}/>
              <Bar dataKey="count" name="Tickets" fill="var(--amber-600)" radius={[4, 4, 0, 0]}>
                {priorityData.map((entry) => (<Cell key={`cell-${entry.priority}`} fill={entry.fill}/>))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>);
}
