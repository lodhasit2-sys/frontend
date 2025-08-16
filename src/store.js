import { create } from 'zustand'
import { nanoid } from 'nanoid'
import dayjs from 'dayjs'

export const roles = ['AGENCY','BOARD_ADMIN','BOARD_ACCOUNTS','BOARD_INSPECTOR','VIEWER']

const k = 'dbocwwb-proto-v1'
const load = (key, fallback) => {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : fallback } catch { return fallback }
}
const save = (key, data) => { try { localStorage.setItem(key, JSON.stringify(data)) } catch {} }

export const useStore = create((set, get) => {
  const persisted = load(k, null)
  const initial = persisted ?? {
    session: null,
    masters: {
      districts: ["North Delhi","North-East Delhi","North-West Delhi","West Delhi","South Delhi","South-West Delhi","South-East Delhi","New Delhi","Central Delhi","Shahdara","East Delhi"],
      zones: ["East","West","Central","North","South"],
      agencyTypes: ["Govt Body","Local Authority","Private Agency"],
      cessRates: [{ code: "DEFAULT", label: "Default Cess", percent: 1.0 }],
      noticeTemplates: [{ code: "SC", label: "Show Cause", body: "Please explain the non-payment within 7 days." }],
      stateTransferAccounts: [{ code: "ST-001", accountNo: "123456789012", ifsc: "SBIN0000123", name: "DBOCWWB Cess Collection" }],
      constructionStages: ["Planning & Approvals","Site Preparation","Foundation","Substructure","Superstructure","Roofing","Brickwork & Plaster","Flooring","Finishing","Electrical","Plumbing & Sanitation","HVAC/Fire Safety","External Development","Commissioning"],
      valuationItems: ["Earthwork","PCC/RCC","Steel/Structural","Brick/Block Work","Plaster/Paint","Doors/Windows","Flooring/Tiling","Electrical","Plumbing","Fire Safety","HVAC","Lift/Elevator","External Works","Consultancy/PMC","Contingency"]
    },
    projects: [],
    assessments: [],
    payments: [],
    notices: [],
    complaints: [],
    recon: [],
    audit: [],
    inspections: [],
    noticesBoard: [],
    otps: []
  }

  const persistAll = () => {
    const data = { ...get() }
    ;['login','logout','log','createProject','createAssessment','recordPayment','issueNotice','serveNotice','acknowledgeNotice','createComplaint','updateComplaint','pushRecon','setReconStatus','updateAssessment','upsertMasters','requestEmailOtp','verifyEmailOtpAndReset','createInspection','uploadInspectionReport','submitInspectionReply','createBoardNotice','submitNoticeReply'].forEach(k=> delete data[k])
    save(k, data)
  }

  return {
    ...initial,
    login: (role) => set({ session: { role } }),
    logout: () => set({ session: null }),
    log: (who, action, meta) => set(s => ({ audit: [...s.audit, { id: nanoid(), at: dayjs().toISOString(), who, action, meta }] })),

    createProject: (p) => { const proj = { id: nanoid(), ...p }; set(s => ({ projects: [proj, ...s.projects] })); persistAll(); get().log(get().session?.role ?? 'VIEWER', 'PROJECT_CREATE', proj); return proj },
    createAssessment: (a) => { const as = { id: nanoid(), status: 'Draft', createdAt: dayjs().toISOString(), ...a }; set(s => ({ assessments: [as, ...s.assessments] })); persistAll(); get().log(get().session?.role ?? 'VIEWER','ASSESSMENT_CREATE', as); return as },
    updateAssessment: (id, patch) => { set(s => ({ assessments: s.assessments.map(x => x.id===id?{...x,...patch}:x) })); persistAll() },
    recordPayment: (p) => { const pay = { id: nanoid(), txnTime: dayjs().toISOString(), ...p }; set(s => ({ payments: [pay, ...s.payments] })); persistAll(); get().log(get().session?.role ?? 'VIEWER','PAYMENT_RECORD', pay); return pay },

    issueNotice: (n) => { const notice = { id: nanoid(), createdAt: dayjs().toISOString(), status: n.status ?? 'Pending', ...n }; set(s => ({ notices: [notice, ...s.notices] })); persistAll(); get().log(get().session?.role ?? 'VIEWER','NOTICE_ISSUE', notice); return notice },
    serveNotice: (id) => { set(s => ({ notices: s.notices.map(x => x.id===id?{...x, status:'Served'}:x) })); persistAll(); get().log(get().session?.role ?? 'VIEWER','NOTICE_SERVED', { id }) },
    acknowledgeNotice: (id) => { set(s => ({ notices: s.notices.map(x => x.id===id?{...x, status:'Acknowledged'}:x) })); persistAll(); get().log(get().session?.role ?? 'VIEWER','NOTICE_ACK', { id }) },

    createComplaint: (c) => { const comp = { id: nanoid(), createdAt: dayjs().toISOString(), status: 'Open', ...c }; set(s => ({ complaints: [comp, ...s.complaints] })); persistAll(); get().log(get().session?.role ?? 'VIEWER','COMPLAINT_CREATE', comp); return comp },
    updateComplaint: (id, patch) => { set(s => ({ complaints: s.complaints.map(x=>x.id===id?{...x,...patch}:x) })); persistAll() },

    pushRecon: (rows) => { const toPush = rows.map(r => ({ id: nanoid(), status:'Unmatched', audit: [], ...r })); set(s => ({ recon: [...toPush, ...s.recon] })); persistAll() },
    setReconStatus: (id, patch) => { set(s => ({ recon: s.recon.map(r => r.id===id?{...r, ...patch, audit:[...r.audit, JSON.stringify({ at: dayjs().format(), patch })]}:r) })); persistAll() },
    upsertMasters: (patch) => { set(s => ({ masters: { ...s.masters, ...patch } })); persistAll() },

    // Email OTP (Forgot Password)
    requestEmailOtp: (loginId, email) => {
      const otp = { email, code: String(Math.floor(100000 + Math.random() * 900000)), loginId, expiresAt: dayjs().add(10, 'minute').toISOString() }
      set(s => ({ otps: [otp, ...(s.otps || [])] })); persistAll()
      get().log('BOARD_ADMIN','EMAIL_SEND',{ sender:'DBOCWWB', to: email, subject:'Password Reset OTP', body:`OTP ${otp.code}` })
      return { sent: true }
    },
    verifyEmailOtpAndReset: (loginId, code, newPassword) => {
      const hit = (get().otps||[]).find(o => o.loginId===loginId && o.code===code && dayjs().isBefore(o.expiresAt))
      if (!hit) return { ok:false, reason:'Invalid or expired OTP' }
      // In a real app we'd update user table; here we just log
      get().log('BOARD_ADMIN','PASSWORD_RESET',{ loginId })
      set(s => ({ otps: s.otps.filter(o => !(o.loginId===loginId && o.code===code)) })); persistAll()
      return { ok:true }
    },

    // Inspections & Notices (board-managed + agency reply)
    createInspection: (i) => {
      const ins = { id: nanoid(), createdAt: dayjs().toISOString(), createdBy: get().session?.role ?? 'BOARD_ADMIN', ...i }
      set(s => ({ inspections: [ins, ...s.inspections] })); persistAll()
      get().log('BOARD_INSPECTOR','INSPECTION_CREATE',{ id: ins.id, title: ins.title })
      return ins
    },
    uploadInspectionReport: (id, reportUrl) => {
      set(s => ({ inspections: s.inspections.map(x => x.id===id ? { ...x, reportUrl } : x) })); persistAll()
      get().log('BOARD_INSPECTOR','INSPECTION_REPORT_UPLOAD',{ id })
    },
    submitInspectionReply: (id, fileUrl, payerId) => {
      set(s => ({ inspections: s.inspections.map(x => x.id===id && !x.reply ? { ...x, reply:{ payerId, fileUrl, submittedAt: dayjs().toISOString() } } : x) })); persistAll()
      get().log('AGENCY','INSPECTION_REPLY_SUBMIT',{ id })
    },

    createBoardNotice: (n) => {
      const no = { id: nanoid(), createdAt: dayjs().toISOString(), createdBy: get().session?.role ?? 'BOARD_ADMIN', ...n }
      set(s => ({ noticesBoard: [no, ...s.noticesBoard] })); persistAll()
      get().log('BOARD_ADMIN','NOTICE_CREATE',{ id: no.id, title: no.title })
      get().log('BOARD_ADMIN','SMS_EMAIL',{ sender:'DBOCWWB', to: n.payerId, about:'notice created' })
      return no
    },
    submitNoticeReply: (id, fileUrl) => {
      set(s => ({ noticesBoard: s.noticesBoard.map(x => x.id===id && !x.reply ? { ...x, reply:{ fileUrl, submittedAt: dayjs().toISOString() } } : x) })); persistAll()
      get().log('AGENCY','NOTICE_REPLY_SUBMIT',{ id })
    }
  }
})