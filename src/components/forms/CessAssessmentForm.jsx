import React from 'react'
import { useStore } from '../../store'
import { useToaster } from '../Toaster'
import { calcTotalPayable, calcCessAmount, validateNonNegativeNumber } from '../../utils/calc'
import { generateEChallanPDF } from '../../utils/pdf'

export default function CessAssessmentForm() {
  const { projects, masters, createAssessment, updateAssessment } = useStore()
  const toast = useToaster()
  const [projectId, setProjectId] = React.useState(projects[0]?.id ?? '')
  const [cessCode, setCessCode] = React.useState(masters.cessRates[0]?.code ?? 'DEFAULT')
  const [penalties, setPenalties] = React.useState(0)
  const [interest, setInterest] = React.useState(0)
  const project = projects.find(p => p.id === projectId)
  const cessPercent = (masters.cessRates.find(r => r.code === cessCode) || { percent: 1 }).percent

  const cessAmount = project ? calcCessAmount(project.value, cessPercent) : 0
  const total = project ? calcTotalPayable(project.value, cessPercent, penalties, interest) : 0

  const genChallan = async () => {
    try {
      if (!project) return toast.push('Select a project')
      validateNonNegativeNumber(penalties, 'penalties')
      validateNonNegativeNumber(interest, 'interest')
      const as = createAssessment({
        projectId: project.id, projectValue: project.value, cessPercent,
        penalties, interest, cessAmount, totalPayable: total
      })
      const challanNo = 'CH' + as.id.slice(0, 6).toUpperCase()
      const validTill = new Date(Date.now() + 7*86400000).toISOString().slice(0,10)
      const blob = await generateEChallanPDF({ challanNo, agencyName: 'XYZ Constructions', projectName: project.name, amount: total, validTill })
      const url = URL.createObjectURL(blob)
      updateAssessment(as.id, { status: 'E-Challan Generated', eChallan: { number: challanNo, validTill, pdfBlobUrl: url } })
      toast.push('E‑Challan generated')
      window.open(url, '_blank')
    } catch (e) { toast.push(e.message || 'Error') }
  }

  return (
    <div style={{ border:'1px solid #eee', padding:12, borderRadius:8 }}>
      <h3>Cess Assessment</h3>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
        <label>Project
          <select value={projectId} onChange={e=>setProjectId(e.target.value)}>
            {projects.map(p => <option key={p.id} value={p.id}>{p.name} (₹{p.value.toLocaleString('en-IN')})</option>)}
          </select>
        </label>
        <label>Cess Rate
          <select value={cessCode} onChange={e=>setCessCode(e.target.value)}>
            {masters.cessRates.map(r => <option key={r.code} value={r.code}>{r.label} ({r.percent}%)</option>)}
          </select>
        </label>
        <label>Penalties <input type="number" value={penalties} onChange={e=>setPenalties(parseFloat(e.target.value||'0'))} /></label>
        <label>Interest <input type="number" value={interest} onChange={e=>setInterest(parseFloat(e.target.value||'0'))} /></label>
        <div>Calculated Cess: <b>₹ {cessAmount.toLocaleString('en-IN')}</b></div>
        <div>Total Payable: <b>₹ {total.toLocaleString('en-IN')}</b></div>
      </div>
      <button style={{ marginTop: 12 }} onClick={genChallan}>Generate E‑Challan (QR)</button>
    </div>
  )
}