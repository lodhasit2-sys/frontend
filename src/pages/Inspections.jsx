import React from 'react'
import { useStore } from '../store'
import Table from '../components/Table'
import { useToaster } from '../components/Toaster'

export default function Inspections() {
  const { inspections, createInspection, uploadInspectionReport, submitInspectionReply } = useStore()
  const toast = useToaster()
  const [title, setTitle] = React.useState('Site visit')
  const [projectId, setProjectId] = React.useState('PROJ1')

  const addInspection = () => {
    createInspection({ projectId, title })
    toast.push('Inspection created')
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>Inspections</h2>
      <div style={{ display:'flex', gap:8 }}>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" />
        <input value={projectId} onChange={e=>setProjectId(e.target.value)} placeholder="Project ID" />
        <button onClick={addInspection}>Add</button>
      </div>
      <Table cols={[
        { key: 'id', label: 'ID' },
        { key: 'projectId', label: 'Project' },
        { key: 'title', label: 'Title' },
        { key: 'createdAt', label: 'Created' },
        { key: 'reportUrl', label: 'Report URL' },
      ]} data={inspections} />
    </div>
  )
}