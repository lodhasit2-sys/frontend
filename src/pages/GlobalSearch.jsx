import React from 'react'
import { useStore } from '../store'
import Table from '../components/Table'

export default function GlobalSearch() {
  const { projects, assessments, payments, notices } = useStore()
  const [q, setQ] = React.useState('')
  const L = (s) => (s||'').toLowerCase()
  const match = (v) => (v ?? '').toString().toLowerCase().includes(L(q))
  const results = [
    ...projects.filter(p => match(p.name) || match(p.district)),
    ...assessments.filter(a => match(a.id) || match(a.projectId)),
    ...payments.filter(p => match(p.utr) || match(p.id)),
    ...notices.filter(n => match(n.id) || match(n.agency)),
  ].slice(0, 50)
  return (
    <div style={{ padding: 16 }}>
      <h2>Global Search</h2>
      <input placeholder="Search by project, assessment, payment, notice..." value={q} onChange={e=>setQ(e.target.value)} style={{ width: 420 }} />
      <div style={{ marginTop: 12 }}>
        <Table cols={[
            { key: 'id', label: 'ID' },
            { key: 'name', label: 'Name' },
            { key: 'district', label: 'District' },
            { key: 'utr', label: 'UTR' },
            { key: 'agency', label: 'Agency' },
          ]}
          data={results}
        />
      </div>
    </div>
  )
}