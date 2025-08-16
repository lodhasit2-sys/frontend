import React from 'react'
export default function Skeleton({ w=120, h=14 }) {
  return <div style={{ width: w, height: h, background:'#eee', borderRadius: 6, animation: 'pulse 1.2s ease-in-out infinite' }}/>
}