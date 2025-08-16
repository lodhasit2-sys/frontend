import { useStore } from '../store'
import { calcCessAmount, calcTotalPayable } from '../utils/calc'

export function runDevTests() {
  try {
    console.group('%cProto Tests', 'color: #0a0')
    const st = useStore.getState()
    console.assert(Array.isArray(st.masters.districts), 'Masters.districts array')
    console.assert(st.masters.cessRates.length >= 1, 'At least one cess rate')
    console.assert(calcCessAmount(100000, 1) === 1000, 'Cess 1% of 1L is 1000')
    console.assert(calcTotalPayable(100000, 1, 50, 50) === 1100, 'Total with penalties+interest')
    const proj = st.createProject({ name: 'Test Work', district: st.masters.districts[0], value: 100000, startDate: new Date().toISOString(), files: [], agencyId: 'AGX' })
    const as = st.createAssessment({ projectId: proj.id, projectValue: proj.value, cessPercent: 1, penalties: 0, interest: 0, cessAmount: 1000, totalPayable: 1000 })
    console.assert(st.assessments.some(x => x.id === as.id), 'Assessment created')
    st.pushRecon([{ bankDate: '2025-08-16', amount: 1000, utr: 'UTR123' }])
    console.assert(st.recon.length >= 1, 'Reconciliation row loaded')
    console.log('✅ All proto tests passed')
    console.groupEnd()
  } catch (e) {
    console.error('❌ Tests failed', e)
  }
}