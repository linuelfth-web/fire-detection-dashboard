import React from 'react'

const C: any = {
  normal:  { card:'#1a2332', border:'#1e3a52', pill:'#064e3b', pillText:'#34d399', pillBorder:'#065f46', pillLabel:'Normal',   value:'#34d399', bar:'#10b981' },
  warning: { card:'#1c1a0f', border:'#92400e', pill:'#451a03', pillText:'#fbbf24', pillBorder:'#92400e', pillLabel:'Warning',  value:'#fbbf24', bar:'#f59e0b' },
  danger:  { card:'#1c0f0f', border:'#b91c1c', pill:'#3b0000', pillText:'#f87171', pillBorder:'#dc2626', pillLabel:'Critical', value:'#f87171', bar:'#ef4444' },
}

export const SensorCard = ({ title, model, channel, icon, alertLevel, readings, stateLabel, thresholdSummary }: any) => {
  const s = C[alertLevel] || C.normal
  return (
    <div style={{background:s.card,border:'2px solid '+s.border,borderRadius:14,overflow:'hidden',height:'100%'}}>
      <div style={{padding:'14px 18px',borderBottom:'1px solid '+s.border,display:'flex',alignItems:'center',justifyContent:'space-between',gap:8}}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <span style={{fontSize:26}}>{icon}</span>
          <div>
            <div style={{fontWeight:700,fontSize:15,color:'#e2e8f0',lineHeight:1.2}}>{title}</div>
            <div style={{fontFamily:'JetBrains Mono, monospace',fontSize:11,color:'#6b7280',marginTop:3}}>{model} · {channel}</div>
          </div>
        </div>
        <span style={{fontSize:11,fontWeight:700,padding:'4px 12px',borderRadius:20,background:s.pill,color:s.pillText,border:'1px solid '+s.pillBorder,whiteSpace:'nowrap' as const}}>{s.pillLabel}</span>
      </div>
      <div style={{padding:'16px 18px'}}>
        {stateLabel && (
          <div style={{fontFamily:'JetBrains Mono, monospace',fontSize:24,fontWeight:700,textAlign:'center' as const,color:s.value,marginBottom:14,letterSpacing:1,padding:'8px 0',background:'#0f172a',borderRadius:8}}>{stateLabel}</div>
        )}
        {readings.map((r: any, i: number) => (
          <div key={i} style={{marginBottom:14}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:6}}>
              <span style={{fontSize:12,color:'#9ca3af',fontWeight:600,textTransform:'uppercase' as const,letterSpacing:0.5}}>{r.label}</span>
              <span style={{fontFamily:'JetBrains Mono, monospace',fontSize:26,color:s.value,lineHeight:1,fontWeight:700}}>{r.value}<span style={{fontSize:13,color:'#6b7280',marginLeft:4}}>{r.unit}</span></span>
            </div>
            {r.percent !== undefined && (
              <div style={{height:8,background:'#0f172a',borderRadius:4,overflow:'hidden'}}>
                <div style={{height:'100%',width:Math.min(r.percent,100)+'%',background:s.bar,borderRadius:4,transition:'width 0.6s'}}/>
              </div>
            )}
          </div>
        ))}
        {thresholdSummary && (
          <div style={{display:'flex',justifyContent:'space-between',background:'#0f172a',borderRadius:8,padding:'10px 14px',marginTop:10}}>
            {[['Warn',thresholdSummary.warnAt],['Alert',thresholdSummary.alertAt],['Range',thresholdSummary.range]].map(([k,v],i) => (
              <div key={i} style={{textAlign:'center' as const}}>
                <div style={{fontSize:10,color:'#6b7280',marginBottom:3,fontWeight:600}}>{k}</div>
                <div style={{fontFamily:'JetBrains Mono, monospace',fontSize:12,color:'#94a3b8',fontWeight:600}}>{v}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
