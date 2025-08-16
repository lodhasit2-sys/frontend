import React from 'react'
import { Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import { useStore } from './store'
import AgencyDashboard from './pages/AgencyDashboard'
import BoardDashboard from './pages/BoardDashboard'
import Masters from './pages/Masters'
import GlobalSearch from './pages/GlobalSearch'
import Inspections from './pages/Inspections'
import Notices from './pages/Notices'
import BulkUpload from './pages/BulkUpload'
import { ToasterHost } from './components/Toaster'

const Guard = ({ roles, children }) => {
  const { session } = useStore()
  if (!session) return <Navigate to="/login" replace />
  if (roles && !roles.includes(session.role)) return <div style={{ padding: 24 }}>Access denied</div>
  return <>{children}</>
}

const Login = () => {
  const { login } = useStore()
  const nav = useNavigate()
  const [role, setRole] = React.useState('AGENCY')
  return (
    <div style={{ padding: 24 }}>
      <h2>Login (Prototype)</h2>
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="AGENCY">AGENCY</option>
        <option value="BOARD_ADMIN">BOARD_ADMIN</option>
        <option value="BOARD_ACCOUNTS">BOARD_ACCOUNTS</option>
        <option value="BOARD_INSPECTOR">BOARD_INSPECTOR</option>
        <option value="VIEWER">VIEWER</option>
      </select>
      <button style={{ marginLeft: 8 }}
        onClick={() => { login(role); nav(role.startsWith('BOARD') ? '/board' : '/agency') }}>
        Enter
      </button>
    </div>
  )
}

const Nav = () => {
  const nav = useNavigate()
  const { session, logout } = useStore()
  return (
    <div style={{ padding: 12, display: 'flex', gap: 12, alignItems: 'center', background: '#f6f7fb' }}>
      <img src="/dbocwwb-logo.png" alt="logo" style={{ height: 24 }} />
      <Link to="/agency">Agency</Link>
      <Link to="/board">Board</Link>
      <Link to="/masters">Masters</Link>
      <Link to="/inspections">Inspections</Link>
      <Link to="/notices">Notices</Link>
      <Link to="/bulk">Bulk Upload</Link>
      <Link to="/search">Search</Link>
      <div style={{ marginLeft: 'auto' }}>
        {session ? (
          <>
            <span style={{ marginRight: 8 }}>Logged in as <b>{session.role}</b></span>
            <button onClick={() => { logout(); nav('/login') }}>Logout</button>
          </>
        ) : <Link to="/login">Login</Link>}
      </div>
    </div>
  )
}

export default function App() {
  return (
    <>
      <ToasterHost />
      <Nav />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/agency" element={<Guard roles={['AGENCY']}><AgencyDashboard /></Guard>} />
        <Route path="/board" element={<Guard roles={['BOARD_ADMIN','BOARD_ACCOUNTS','BOARD_INSPECTOR']}><BoardDashboard /></Guard>} />
        <Route path="/masters" element={<Guard roles={['BOARD_ADMIN']}><Masters /></Guard>} />
        <Route path="/inspections" element={<Guard><Inspections /></Guard>} />
        <Route path="/notices" element={<Guard><Notices /></Guard>} />
        <Route path="/bulk" element={<Guard roles={['BOARD_ADMIN','BOARD_ACCOUNTS']}><BulkUpload /></Guard>} />
        <Route path="/search" element={<Guard><GlobalSearch /></Guard>} />
        <Route path="*" element={<div style={{ padding: 24 }}>Not found</div>} />
      </Routes>
    </>
  )
}