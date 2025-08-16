import dayjs from 'dayjs'
export function autoMatchRecon(rows, assessments) {
  rows.forEach(r => {
    const candidate = assessments.find(a =>
      a.eChallan?.utr && r.utr && a.eChallan?.utr.trim() === r.utr.trim() &&
      Math.abs(dayjs(r.bankDate).diff(dayjs(a.createdAt), 'day')) <= 7 &&
      Math.round(a.totalPayable) === Math.round(r.amount)
    )
    if (candidate) {
      r.matchedAssessmentId = candidate.id
      r.matchConfidence = 1
      r.status = 'AutoMatched'
      r.audit = r.audit || []
      r.audit.push(`AutoMatch: assessment=${candidate.id}`)
    }
  })
}
export function assistedSuggestions(r, assessments) {
  return assessments.filter(a => Math.abs(a.totalPayable - r.amount) <= 5).slice(0,5).map(a => ({ id: a.id, score: 0.7 }))
}