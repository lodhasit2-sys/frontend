export function round2(n) { return Math.round((n + Number.EPSILON) * 100) / 100 }
export function calcCessAmount(projectValue, cessPercent) { return round2(projectValue * (cessPercent / 100)) }
export function calcTotalPayable(projectValue, cessPercent, penalties, interest) {
  return round2(calcCessAmount(projectValue, cessPercent) + (penalties||0) + (interest||0))
}
export function validateNonNegativeNumber(v, field) { if (typeof v !== 'number' || isNaN(v) || v < 0) throw new Error(`${field} must be a non-negative number`) }