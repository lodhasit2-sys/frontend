import React from 'react'
import { useStore } from '../store'
import Table from '../components/Table'
import { useToaster } from '../components/Toaster'

export default function Notices() {
  const { noticesBoard, createBoardNotice, submitNoticeReply } = useStore()
  const toast = useToaster()
  const [title, setTitle] = React.useState('Show Cause')
  const [payerId, setPayerId] = React.useState('AG001')
  const [body, setBody] = React.useState('Please explain the non-payment within 7 days.')

  const add = () => { createBoardNotice({ title, payerId, body }); toast.push('Notice created') }

  return (
    <div style={{ padding: 16 }}>
      <h2>Notices</h2>
      <div style={{ display:'flex', gap:8 }}>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" />
        <input value={payerId} onChange={e=>setPayerId(e.target.value)} placeholder="Payer ID" />
        <input value={body} onChange={e=>setBody(e.target.value)} placeholder="Body" style={{ width: 400 }} />
        <button onClick={add}>Add Notice</button>
      </div>
      <Table cols={[
        { key: 'id', label: 'ID' },
        { key: 'payerId', label: 'Payer' },
        { key: 'title', label: 'Title' },
        { key: 'body', label: 'Body' },
        { key: 'createdAt', label: 'Created' },
      ]} data={noticesBoard} />
    </div>
  )
}