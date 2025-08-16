import React from 'react'
import { useStore } from '../store'
import Table from '../components/Table'
import { useToaster } from '../components/Toaster'
import { parseCSV } from '../utils/csv'
import { autoMatchRecon, assistedSuggestions } from '../utils/recon'

export default function BoardDashboard() {
  const { masters, assessments, recon, pushRecon, setReconStatus } = useStore()
  const toast = useToaster()
  const [filters, setFilters] = React.useState({ district: '', agencyType: '', fy: '' })

  const onUpload = async (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    const rows = await parseCSV(f)
    const mapped = rows.map(r => ({
      bankDate: r.date || r.txn_date || r.posting_date || new Date().toISOString().slice(0,10),
      amount: parseFloat(r.amount || r.amt || '0'),
      utr: String(r.utr || r.ref || '').trim(),
      ifsc: r.ifsc || r.ifsc_code
    }))
    pushRecon(mapped)
    toast.push(`Imported ${mapped.length} rows`)
  }

  const runAuto = () => {
    const st = useStore.getState()
    const rows = [...st.recon]
    autoMatchRecon(rows, st.assessments)
    rows.forEach(r => st.setReconStatus(r.id, r))
    toast.push('Auto-match complete')
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>Board Dashboard</h2>

      <div style={{ display:'flex', gap:8, alignItems:'center' }}>
        <label>District
          <select value={filters.district} onChange={e=>setFilters(f=>({ ...f, district: e.target.value }))}>
            <option value="">All</option>
            {masters.districts.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </label>
        <label>Agency Type
          <select value={filters.agencyType} onChange={e=>setFilters(f=>({ ...f, agencyType: e.target.value }))}>
            <option value="">All</option>
            {masters.agencyTypes.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </label>
        <label>FY
          <select value={filters.fy} onChange={e=>setFilters(f=>({ ...f, fy: e.target.value }))}>
            <option value="">All</option>
            <option>2023-24</option>
            <option>2024-25</option>
          </select>
        </label>
      </div>

      <section style={{ marginTop: 16, border:'1px solid #eee', padding:12, borderRadius:8 }}>
        <h3>Defaulter Drilldown</h3>
        <Table
          cols={[
            { key: 'id', label: 'Assessment' },
            { key: 'projectId', label: 'Project' },
            { key: 'totalPayable', label: 'Amount' },
            { key: 'status', label: 'Status' },
          ]}
          data={assessments.filter(a => a.status !== 'Paid').map(a => ({ id: a.id, projectId: a.projectId.slice(0,6), totalPayable: a.totalPayable, status: a.status }))}
        />
        <small>Escalation (stub): Email/SMS reminders; schedule inspection.</small>
      </section>

      <section style={{ marginTop: 16, border:'1px solid #eee', padding:12, borderRadius:8 }}>
        <h3>Reconciliation</h3>
        <input type="file" accept=".csv" onChange={onUpload} />
        <button onClick={runAuto} style={{ marginLeft: 8 }}>Auto-match</button>
        <Table
          cols={[
            { key: 'bankDate', label: 'Bank Date' },
            { key: 'amount', label: 'Amount' },
            { key: 'utr', label: 'UTR' },
            { key: 'status', label: 'Status' },
            { key: 'matchedAssessmentId', label: 'Matched Assessment' },
            { key: 'matchConfidence', label: 'Confidence' },
          ]}
          data={recon}
        />
        <div style={{ marginTop: 8 }}>
          Assisted Match:
          <button onClick={()=>{
            const st = useStore.getState()
            const r = st.recon.find(x => x.status === 'Unmatched')
            if (!r) return toast.push('No unmatched rows')
            const sug = assistedSuggestions(r, st.assessments)
            if (sug.length === 0) return toast.push('No suggestions')
            st.setReconStatus(r.id, { status: 'AssistedMatched', matchedAssessmentId: sug[0].id, matchConfidence: sug[0].score })
            toast.push('Assisted match applied')
          }}>Suggest & Match First</button>
        </div>
      </section>
    </div>
  )
}