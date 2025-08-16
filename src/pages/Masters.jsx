import React from 'react'
import { useStore } from '../store'
import { useToaster } from '../components/Toaster'

export default function Masters() {
  const { masters, upsertMasters } = useStore()
  const toast = useToaster()

  const addRate = () => {
    const code = prompt('Rate code?')
    const label = prompt('Rate label?')
    const percent = parseFloat(prompt('Percent?') || '0')
    if (!code || !label || isNaN(percent)) return
    upsertMasters({ cessRates: [...masters.cessRates, { code, label, percent }] })
    toast.push('Cess rate added')
  }
  const addTemplate = () => {
    const code = prompt('Template code?')
    const label = prompt('Template label?')
    const body = prompt('Body?')
    if (!code || !label || !body) return
    upsertMasters({ noticeTemplates: [...masters.noticeTemplates, { code, label, body }] })
    toast.push('Template added')
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>Masters (Admin)</h2>
      <section style={{ border:'1px solid #eee', padding:12, borderRadius:8 }}>
        <h3>Cess Rates</h3>
        <ul>{masters.cessRates.map(r => <li key={r.code}>{r.code} – {r.label} – {r.percent}%</li>)}</ul>
        <button onClick={addRate}>Add Rate</button>
      </section>
      <section style={{ border:'1px solid #eee', padding:12, borderRadius:8, marginTop:16 }}>
        <h3>Notice Templates</h3>
        <ul>{masters.noticeTemplates.map(r => <li key={r.code}>{r.code} – {r.label}: {r.body}</li>)}</ul>
        <button onClick={addTemplate}>Add Template</button>
      </section>
      <section style={{ border:'1px solid #eee', padding:12, borderRadius:8, marginTop:16 }}>
        <h3>State Transfer Accounts</h3>
        <ul>{masters.stateTransferAccounts.map(a => <li key={a.code}>{a.code} – {a.name} – {a.accountNo} ({a.ifsc})</li>)}</ul>
      </section>
    </div>
  )
}