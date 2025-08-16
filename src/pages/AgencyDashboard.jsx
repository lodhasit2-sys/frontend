import React from 'react'
import { useStore } from '../store'
import ProjectForm from '../components/forms/ProjectForm'
import CessAssessmentForm from '../components/forms/CessAssessmentForm'
import { useToaster } from '../components/Toaster'
import Table from '../components/Table'
import dayjs from 'dayjs'

export default function AgencyDashboard() {
  const { assessments, payments, notices, recordPayment, updateAssessment } = useStore()
  const toast = useToaster()

  const pay = (id) => {
    const as = assessments.find(a => a.id === id)
    const ok = Math.random() > 0.1
    const utr = ok ? ('UTR' + id.slice(0,6).toUpperCase()) : undefined
    recordPayment({ assessmentId: id, amount: as.totalPayable, mode: 'ONLINE', status: ok ? 'Success' : 'Failed', utr })
    updateAssessment(id, { status: ok ? 'Paid' : 'Failed', eChallan: { ...(as.eChallan||{}), utr } })
    toast.push(ok ? 'Payment Success' : 'Payment Failed')
  }

  const recentNotices = [
    { id: 'N-045', agency: 'XYZ Constructions Ltd', type: 'Demand', amount: 50000, status: 'Served' },
    { id: 'N-046', agency: 'ABC Dept',               type: 'ShowCause', amount: 20000, status: 'Pending' },
  ]

  return (
    <div style={{ padding: 16 }}>
      <h2>Agency Dashboard</h2>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 16 }}>
        <ProjectForm />
        <CessAssessmentForm />
      </div>

      <div style={{ marginTop: 16, border:'1px solid #eee', padding:12, borderRadius:8 }}>
        <h3>Assessments</h3>
        <Table
          cols={[
            { key: 'id', label: 'ID' },
            { key: 'projectId', label: 'Project' },
            { key: 'totalPayable', label: 'Amount' },
            { key: 'status', label: 'Status' },
          ]}
          data={assessments.map(a => ({ id: a.id, projectId: a.projectId.slice(0,6), totalPayable: a.totalPayable, status: a.status }))}
        />
        <div style={{ display:'flex', gap:8 }}>
          {assessments.filter(a => a.status === 'E-Challan Generated').map(a => (
            <button key={a.id} onClick={() => pay(a.id)}>Pay {a.id.slice(0,6)} (₹{a.totalPayable})</button>
          ))}
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginTop: 16 }}>
        <div style={{ border:'1px solid #eee', padding:12, borderRadius:8 }}>
          <h3>Recent Notices</h3>
          <Table cols={[
              { key: 'id', label: 'ID' },
              { key: 'agency', label: 'Agency' },
              { key: 'type', label: 'Type' },
              { key: 'amount', label: 'Amount' },
              { key: 'status', label: 'Status' },
            ]}
            data={recentNotices}
          />
        </div>

        <div style={{ border:'1px solid #eee', padding:12, borderRadius:8 }}>
          <h3>Payments</h3>
          <Table cols={[
              { key: 'id', label: 'Txn' },
              { key: 'assessmentId', label: 'Assessment' },
              { key: 'amount', label: 'Amount' },
              { key: 'status', label: 'Status' },
              { key: 'utr', label: 'UTR' },
              { key: 'txnTime', label: 'Time' },
            ]}
            data={payments.map(p => ({ ...p, txnTime: dayjs(p.txnTime).format('YYYY-MM-DD HH:mm') }))}
          />
        </div>
      </div>
    </div>
  )
}