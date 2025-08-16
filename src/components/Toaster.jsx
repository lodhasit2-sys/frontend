import React from 'react'
const Ctx = React.createContext(null)
export const useToaster = () => React.useContext(Ctx)

export const ToasterHost = () => {
  const [items, setItems] = React.useState([])
  const push = (msg) => {
    const id = String(Math.random())
    setItems(s => [...s, { id, msg }])
    setTimeout(() => setItems(s => s.filter(x => x.id !== id)), 2200)
  }
  return (
    <Ctx.Provider value={{ push }}>
      <div style={{ position:'fixed', top: 12, right: 12, display:'flex', flexDirection:'column', gap: 8, zIndex: 9999 }}>
        {items.map(i => <div key={i.id} style={{ background:'#111', color:'#fff', padding:'10px 14px', borderRadius:8, boxShadow:'0 2px 10px rgba(0,0,0,.2)' }}>{i.msg}</div>)}
      </div>
    </Ctx.Provider>
  )
}