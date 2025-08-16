import React from 'react'
import { saveAs } from 'file-saver'
import { jsPDF } from 'jspdf'

export default function Table({ data = [], cols = [] }) {
  const [visible, setVisible] = React.useState(cols.map(c => String(c.key)))
  const filteredCols = cols.filter(c => visible.includes(String(c.key)))

  const exportCSV = () => {
    const rows = data.map(row => filteredCols.map(c => row[c.key]))
    const head = filteredCols.map(c => c.label)
    const csv = [head, ...rows].map(r => r.map(x => `"${String(x ?? '')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    saveAs(blob, 'export.csv')
  }

  const exportPDF = () => {
    const doc = new jsPDF({ unit: 'pt' })
    doc.setFontSize(12)
    let y = 40
    doc.text('Export', 40, y); y += 20
    const head = filteredCols.map(c => c.label)
    const widths = filteredCols.map(() => 120)
    const drawRow = (vals) => { let x = 40; vals.forEach((v,i)=>{ doc.text(String(v ?? ''), x, y); x+=widths[i] }); y+=20 }
    drawRow(head)
    data.forEach(row => drawRow(filteredCols.map(c => row[c.key])))
    doc.save('export.pdf')
  }

  return (
    <div>
      <div style={{ marginBottom: 8, display:'flex', gap:8, alignItems:'center' }}>
        <details>
          <summary>Columns</summary>
          {cols.map(c => (
            <label key={String(c.key)} style={{ display:'block' }}>
              <input
                type="checkbox"
                checked={visible.includes(String(c.key))}
                onChange={(e) => setVisible(s => e.target.checked ? [...s, String(c.key)] : s.filter(x => x !== String(c.key)))}
              /> {c.label}
            </label>
          ))}
        </details>
        <button onClick={exportCSV}>Export CSV</button>
        <button onClick={exportPDF}>Export PDF</button>
      </div>
      <div style={{ overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr>{filteredCols.map(c => <th key={String(c.key)} style={{ textAlign:'left', borderBottom:'1px solid #ddd', padding:'8px' }}>{c.label}</th>)}</tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                {filteredCols.map(c => <td key={String(c.key)} style={{ borderBottom:'1px solid #f0f0f0', padding:'8px' }}>{String(row[c.key] ?? '')}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}