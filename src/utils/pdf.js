import { jsPDF } from 'jspdf'
import QRCode from 'qrcode'

export async function generateEChallanPDF({ challanNo, agencyName, projectName, amount, validTill, utr }) {
  const doc = new jsPDF({ unit: 'pt' })
  const pad = 36
  doc.setFont('helvetica','bold'); doc.setFontSize(16)
  doc.text('E-CHALLAN', pad, 54)
  doc.setFont('helvetica','normal'); doc.setFontSize(11)
  const lines = [
    ['Challan No', challanNo],
    ['Agency', agencyName],
    ['Project', projectName],
    ['Amount', `₹ ${amount.toLocaleString('en-IN')}`],
    ['Valid Till', validTill],
    ['UTR', utr || '—'],
  ]
  let y = 90
  lines.forEach(([k,v]) => { doc.text(`${k}:`, pad, y); doc.text(String(v), 160, y); y += 20 })
  const qrText = `CHALLAN:${challanNo}|AMT:${amount}|VALID:${validTill}|UTR:${utr||'-'}`
  const dataUrl = await QRCode.toDataURL(qrText, { margin: 1, width: 160 })
  doc.addImage(dataUrl, 'PNG', 400, 54, 160, 160)
  doc.setLineWidth(0.5); doc.line(pad, y+10, 560, y+10)
  doc.setFontSize(9); doc.text('Scan QR to verify challan at /verify', pad, y+30)
  return doc.output('blob')
}