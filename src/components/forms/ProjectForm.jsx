import React from 'react'
import { useStore } from '../../store'
import { useToaster } from '../Toaster'

export default function ProjectForm() {
  const { createProject, masters } = useStore()
  const toast = useToaster()
  const [name, setName] = React.useState('')
  const [district, setDistrict] = React.useState(masters.districts[0] ?? '')
  const [value, setValue] = React.useState(0)
  const [files, setFiles] = React.useState([])

  const onFiles = (e) => { const fl = Array.from(e.target.files ?? []).map(f => ({ name: f.name })); setFiles(fl) }

  return (
    <div style={{ border:'1px solid #eee', padding:12, borderRadius:8 }}>
      <h3>Register Project/Work</h3>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        <label>Name <input value={name} onChange={e=>setName(e.target.value)} /></label>
        <label>District
          <select value={district} onChange={e=>setDistrict(e.target.value)}>
            {masters.districts.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </label>
        <label>Project Value (₹) <input type="number" value={value} onChange={e=>setValue(parseFloat(e.target.value||'0'))} /></label>
        <label>Files <input type="file" multiple onChange={onFiles} /></label>
      </div>
      <button style={{ marginTop: 12 }} onClick={()=>{
        if (!name) return toast.push('Project name required')
        if (value <= 0) return toast.push('Value must be > 0')
        createProject({ name, district, value, startDate: new Date().toISOString(), files, agencyId: 'AGX' })
        toast.push('Project created')
      }}>Save Project</button>
    </div>
  )
}