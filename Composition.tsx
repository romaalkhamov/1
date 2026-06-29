import React from "react";
import { AbsoluteFill, Audio, Sequence, interpolate, useCurrentFrame, Easing, Img, staticFile } from "remotion";
// Use system font — no network required
const fontFamily = "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif";

// ─── Palette ─────────────────────────────────────────────────────────────────
const BG       = "#F2F2F7";
const WHITE    = "#FFFFFF";
const DARK     = "#111111";
const ORANGE   = "#E8854A";
const BLUE_BTN = "#2563EB";
const MID      = "#6B7280";
const LIGHT    = "#9CA3AF";
const BORDER   = "#E5E7EB";
const GREEN_BG = "#D1FAE5"; const GREEN_TX = "#065F46";
const BLUE_BG  = "#DBEAFE"; const BLUE_TX  = "#1E40AF";

// ─── Easing ──────────────────────────────────────────────────────────────────
const ease = (f: number, s: number, e: number, from = 0, to = 1) =>
  interpolate(f, [s, e], [from, to], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

const springEase = (f: number, s: number, e: number, from = 0, to = 1) =>
  interpolate(f, [s, e], [from, to], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
  });

// ─── Background gradients per phase ──────────────────────────────────────────
const BG_PHASES = ["#EAEAF5","#F0E8DC","#DCF0E4","#D8EAF8","#EAD8F8","#F8E0D4","#F0F0F0"];
const ACCENTS   = [
  "rgba(232,133,74,0.14)","rgba(232,133,74,0.20)","rgba(16,185,129,0.16)",
  "rgba(37,99,235,0.16)","rgba(139,92,246,0.16)","rgba(232,133,74,0.18)","rgba(232,133,74,0.22)",
];

// ─── Captions ────────────────────────────────────────────────────────────────
const CAPTIONS: [number, number, string][] = [
  [5,   93,  "Still sending money\nto strangers direct?"],
  [123, 212, "Meet TrustDepo.\nEscrow for everyone."],
  [245, 334, "Buyer\'s funds held safe."],
  [366, 453, "No risk on either side."],
  [486, 603, "Every deal covered.\nEvery amount. Protected."],
  [636, 723, "BMW 3 Series.\n£8,500 — secured."],
  [751, 853, "Download TrustDepo.\nSafe deals. Zero risk."],
];

// ─── Sound URLs (Pixabay free license) ───────────────────────────────────────
const SND = {
  counter:      staticFile("sounds/counter.wav"),
  notification: staticFile("sounds/notification.wav"),
};

// Voiceover: single MP3 file used via staticFile("sounds/voiceover.mp3")

// ─── Icons ───────────────────────────────────────────────────────────────────
const LockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const PersonIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const BellIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);
const HomeNavIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const WalletNavIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
  </svg>
);
const ArrowUpRight = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#E8451A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
  </svg>
);
const TxnIcon = () => (
  <div style={{width:38,height:38,borderRadius:"50%",background:"#F3F4F6",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
    <div style={{width:26,height:26,borderRadius:"50%",background:"#FEE2E2",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <ArrowUpRight/>
    </div>
  </div>
);

// ─── Transactions data ────────────────────────────────────────────────────────
interface TxnData { name:string; date:string; amt:string; amtValue:number; badge:string; badgeBg:string; badgeTxt:string; }
interface TxnRow extends TxnData { slideY:number; op:number; }

const ALL_TXNS: TxnData[] = [
  { name:"Website",       date:"24 Jun",    amt:"-£10",    amtValue:10,   badge:"Funded",    badgeBg:GREEN_BG, badgeTxt:GREEN_TX },
  { name:"Deposit",       date:"3 hr ago",  amt:"-£2,000", amtValue:2000, badge:"Funded",    badgeBg:GREEN_BG, badgeTxt:GREEN_TX },
  { name:"Logo Design",   date:"1 hr ago",  amt:"-£300",   amtValue:300,  badge:"Funded",    badgeBg:GREEN_BG, badgeTxt:GREEN_TX },
  { name:"Rolex Datejust",date:"5 min ago", amt:"-£4,800", amtValue:4800, badge:"In Escrow", badgeBg:BLUE_BG,  badgeTxt:BLUE_TX  },
  { name:"MacBook Pro",   date:"2 min ago", amt:"-£1,200", amtValue:1200, badge:"Funded",    badgeBg:GREEN_BG, badgeTxt:GREEN_TX },
  { name:"BMW 3 Series",  date:"Just now",  amt:"-£8,500", amtValue:8500, badge:"In Escrow", badgeBg:BLUE_BG,  badgeTxt:BLUE_TX  },
];

// ─── App screen ───────────────────────────────────────────────────────────────
const AppScreen: React.FC<{ balanceStr:string; escrowNum:number; txns:TxnRow[] }> = ({ balanceStr, escrowNum, txns }) => (
  <div style={{background:BG,width:390,height:844,fontFamily,position:"relative",overflow:"hidden"}}>

    {/* Header */}
    <div style={{padding:"14px 20px 6px",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
      <div>
        <div style={{fontSize:15,color:MID,fontWeight:400,marginBottom:1}}>Good morning,</div>
        <div style={{fontSize:30,fontWeight:800,color:DARK,letterSpacing:-0.5}}>Sam</div>
      </div>
      <div style={{display:"flex",gap:8,alignItems:"center",marginTop:4}}>
        <div style={{width:36,height:36,borderRadius:"50%",background:"#E9EAEC",display:"flex",alignItems:"center",justifyContent:"center"}}><PersonIcon/></div>
        <div style={{width:36,height:36,borderRadius:"50%",background:"#E9EAEC",display:"flex",alignItems:"center",justifyContent:"center"}}><BellIcon/></div>
        <div style={{width:36,height:36,borderRadius:"50%",background:DARK,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700,color:WHITE}}>SM</div>
      </div>
    </div>

    {/* Balance card */}
    <div style={{margin:"6px 16px",borderRadius:20,background:DARK,padding:"16px 18px 14px"}}>
      <div style={{fontSize:10,color:"#666",textTransform:"uppercase" as const,letterSpacing:1.4,marginBottom:6}}>Available Balance</div>
      <div style={{display:"flex",alignItems:"baseline",gap:3,marginBottom:12}}>
        <span style={{fontSize:22,fontWeight:400,color:WHITE,marginRight:2,opacity:0.85}}>£</span>
        <span style={{fontSize:50,fontWeight:900,color:WHITE,letterSpacing:-2,lineHeight:1}}>{balanceStr}</span>
        <span style={{fontSize:28,fontWeight:700,color:WHITE}}>.00</span>
      </div>
      <div style={{display:"flex",gap:20}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:28,height:28,borderRadius:"50%",background:"#2a2a2a",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><LockIcon/></div>
          <div>
            <div style={{fontSize:9,color:"#888",textTransform:"uppercase" as const,letterSpacing:0.9}}>In Escrow</div>
            <div style={{fontSize:14,fontWeight:800,color:WHITE}}>{escrowNum} active</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:28,height:28,borderRadius:"50%",background:"#2a2a2a",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><ClockIcon/></div>
          <div>
            <div style={{fontSize:9,color:"#888",textTransform:"uppercase" as const,letterSpacing:0.9}}>Pending Withdrawal</div>
            <div style={{fontSize:14,fontWeight:800,color:WHITE}}>£0</div>
          </div>
        </div>
      </div>
    </div>

    {/* Fee Calculator */}
    <div style={{margin:"8px 16px 0",background:WHITE,borderRadius:16,padding:"14px 16px 16px"}}>
      <div style={{fontSize:17,fontWeight:700,color:DARK,marginBottom:3}}>Fee Calculator</div>
      <div style={{fontSize:13,color:MID,marginBottom:10}}>Input your transaction amount below</div>
      <div style={{display:"flex",alignItems:"center",border:`1.5px solid ${BORDER}`,borderRadius:12,overflow:"hidden"}}>
        <div style={{padding:"11px 13px",borderRight:`1.5px solid ${BORDER}`,fontSize:16,fontWeight:600,color:"#374151"}}>£</div>
        <div style={{padding:"11px 13px",fontSize:14,color:LIGHT}}>Enter amount</div>
      </div>
    </div>

    {/* Recent Transactions */}
    <div style={{margin:"8px 16px 0",background:WHITE,borderRadius:16,overflow:"hidden"}}>
      <div style={{padding:"14px 16px 0"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <span style={{fontSize:17,fontWeight:700,color:DARK}}>Recent Transactions</span>
          <span style={{fontSize:13,color:"#007AFF",fontWeight:500}}>See all</span>
        </div>
        {txns.map((tx,i)=>(
          <div key={i} style={{
            display:"flex",alignItems:"center",justifyContent:"space-between",
            paddingTop:9,paddingBottom:9,
            borderBottom:i<txns.length-1?`1px solid ${BORDER}`:"none",
            transform:`translateY(${tx.slideY}px)`,
            opacity:tx.op,
          }}>
            <div style={{display:"flex",alignItems:"center",gap:11}}>
              <TxnIcon/>
              <div>
                <div style={{fontSize:14,fontWeight:700,color:DARK,lineHeight:1.2}}>{tx.name}</div>
                <div style={{fontSize:12,color:LIGHT,marginTop:2}}>{tx.date}</div>
              </div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:14,fontWeight:700,color:DARK}}>{tx.amt}</div>
              <span style={{fontSize:11,fontWeight:700,padding:"3px 8px",borderRadius:6,background:tx.badgeBg,color:tx.badgeTxt,display:"inline-block",marginTop:3}}>{tx.badge}</span>
            </div>
          </div>
        ))}
        <div style={{height:8}}/>
      </div>
    </div>

    {/* Bottom nav */}
    <div style={{position:"absolute",bottom:0,left:0,right:0,background:"rgba(255,255,255,0.92)",borderTop:"0.5px solid rgba(0,0,0,0.1)",display:"flex",alignItems:"center",justifyContent:"space-around",paddingTop:10,paddingBottom:24}}>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
        <HomeNavIcon/><span style={{fontSize:11,color:"#8E8E93"}}>Home</span>
      </div>
      <div style={{width:52,height:52,borderRadius:"50%",background:BLUE_BTN,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 0 0 8px rgba(37,99,235,0.18),0 4px 16px rgba(37,99,235,0.4)`}}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={WHITE} strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
      </div>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
        <WalletNavIcon/><span style={{fontSize:11,color:"#8E8E93"}}>Wallet</span>
      </div>
    </div>
  </div>
);

// ─── iPhone 17 Pro shell ──────────────────────────────────────────────────────
const IPhone17Pro: React.FC<{children:React.ReactNode; scale:number}> = ({children,scale}) => {
  const SW=390,SH=844,PAD=20,SIDE=12,R=50;
  const SHELL_W=SW+SIDE*2, SHELL_H=SH+PAD*2;
  return (
    <div style={{width:SHELL_W*scale,height:SHELL_H*scale,position:"relative",flexShrink:0}}>
      <div style={{width:SHELL_W,height:SHELL_H,transform:`scale(${scale})`,transformOrigin:"top left",position:"relative"}}>
        <div style={{position:"absolute",inset:0,borderRadius:R,background:"linear-gradient(150deg,#9a9a9e 0%,#6c6c70 25%,#b0b0b5 45%,#5a5a5f 65%,#9a9a9e 85%,#7a7a7f 100%)",boxShadow:`inset 0 1px 0 rgba(255,255,255,0.3),inset 0 -1px 0 rgba(0,0,0,0.4),0 60px 160px rgba(0,0,0,0.55),0 20px 60px rgba(0,0,0,0.3),0 4px 16px rgba(0,0,0,0.2)`}}/>
        <div style={{position:"absolute",inset:5,borderRadius:R-5,background:"#050505"}}/>
        <div style={{position:"absolute",top:PAD+5,left:SIDE+5,width:SW-10,height:SH,borderRadius:R-14,overflow:"hidden",background:BG}}>{children}</div>
        {/* Dynamic Island */}
        <div style={{position:"absolute",top:8,left:"50%",transform:"translateX(-50%)",width:120,height:34,background:"#000",borderRadius:20,zIndex:20}}>
          <div style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",display:"flex",gap:5,alignItems:"center"}}>
            <div style={{width:11,height:11,borderRadius:"50%",background:"#111",border:"1px solid #222"}}/>
            <div style={{width:7,height:7,borderRadius:"50%",background:"#111"}}/>
          </div>
        </div>
        {/* Volume buttons */}
        {[{top:90,h:36},{top:142,h:62},{top:216,h:62}].map((b,i)=>(
          <div key={i} style={{position:"absolute",left:-4,top:b.top,width:4,height:b.h,background:"linear-gradient(90deg,#4a4a4f,#8a8a8f,#4a4a4f)",borderRadius:"3px 0 0 3px"}}/>
        ))}
        {/* Power button */}
        <div style={{position:"absolute",right:-4,top:150,width:4,height:80,background:"linear-gradient(270deg,#4a4a4f,#8a8a8f,#4a4a4f)",borderRadius:"0 3px 3px 0"}}/>
        {/* Home indicator */}
        <div style={{position:"absolute",bottom:PAD+8,left:"50%",transform:"translateX(-50%)",width:134,height:5,background:"#2a2a2a",borderRadius:3,zIndex:20}}/>
        {/* Glass shine */}
        <div style={{position:"absolute",inset:5,borderRadius:R-5,background:"linear-gradient(135deg,rgba(255,255,255,0.07) 0%,transparent 45%)",pointerEvents:"none",zIndex:30}}/>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPOSITION — 300 frames = 10 s
// ═══════════════════════════════════════════════════════════════════════════
export const TrustDepoHome: React.FC = () => {
  const f = useCurrentFrame();

  // Timings — 855 frames = 28.5s, synced to voiceover
  const PHONE_IN_S = 0;
  const PHONE_IN_E = 5;    // phone appears instantly before voice starts
  const TXN_START  = 5;    // first txn with first caption
  const TXN_GAP    = 120;  // ~4s between txns matching speech gaps
  // LAST_TXN_F = TXN_START + 4 * TXN_GAP = 485
  const OUTRO_S    = 760;
  const OUTRO_E    = 853;

  // ── Shifting background ───────────────────────────────────────────────
  const phase =
    f < PHONE_IN_E ? 0
    : f < TXN_START ? 1
    : Math.min(6, Math.floor((f - TXN_START) / TXN_GAP) + 2);
  const phaseLocalF = f < PHONE_IN_E ? f : f < TXN_START ? f - PHONE_IN_E : (f - TXN_START) % TXN_GAP;
  const bgBlend = ease(phaseLocalF, 0, 14, 0, 1);
  const currBg  = BG_PHASES[Math.min(phase,   BG_PHASES.length - 1)];
  const nextBg  = BG_PHASES[Math.min(phase+1, BG_PHASES.length - 1)];
  const accent  = ACCENTS[Math.min(phase, ACCENTS.length - 1)];

  // ── Logo ──────────────────────────────────────────────────────────────
  const logoOp    = interpolate(f, [0, 10, 16, 22], [0, 1, 1, 0], { extrapolateLeft:"clamp", extrapolateRight:"clamp" });
  const logoScale = springEase(f, 0, 12, 0.7, 1);

  // ── Phone entry ───────────────────────────────────────────────────────
  const prog     = ease(f, PHONE_IN_S, PHONE_IN_E);
  const entryX   = interpolate(prog, [0,1], [320, 0]);
  const entryY   = interpolate(prog, [0,1], [460, 0]);
  const entryRot = interpolate(prog, [0,1], [13, 0]);
  const entryScl = interpolate(prog, [0,1], [0.83, 1]);
  const phoneOp  = interpolate(f, [PHONE_IN_S, PHONE_IN_S+16, OUTRO_S-16, OUTRO_S+8], [0,1,1,0], { extrapolateLeft:"clamp", extrapolateRight:"clamp" });

  // ── Float ─────────────────────────────────────────────────────────────
  const floatF = Math.max(0, f - PHONE_IN_E);
  const floatY = f >= PHONE_IN_E ? Math.sin(floatF * (Math.PI*2) / 90) * 16 : 0;
  const floatR = f >= PHONE_IN_E ? Math.sin(floatF * (Math.PI*2) / 90 + 0.6) * 0.45 : 0;
  const tx  = f < PHONE_IN_E ? entryX  : 0;
  const ty  = f < PHONE_IN_E ? entryY  : 0;
  const rot = (f < PHONE_IN_E ? entryRot : 0) + (f >= PHONE_IN_E ? floatR : 0);
  const scl = f < PHONE_IN_E ? entryScl : 1;

  // ── Shadow ────────────────────────────────────────────────────────────
  const shadowSclX = f >= PHONE_IN_E ? 1 - Math.sin(floatF*(Math.PI*2)/90)*0.13 : 1;
  const shadowOp   = ease(f, PHONE_IN_E, PHONE_IN_E+20, 0, 0.2) * phoneOp;

  // ── Transactions ──────────────────────────────────────────────────────
  const newCount = f < TXN_START ? 0 : Math.min(5, Math.floor((f-TXN_START)/TXN_GAP)+1);
  const visIndices: number[] = [];
  for (let i = newCount; i >= 0; i--) visIndices.push(i);

  const totalBalance  = visIndices.reduce((s,i) => s + ALL_TXNS[i].amtValue, 0);
  const prevBalance   = newCount === 0 ? ALL_TXNS[0].amtValue : visIndices.slice(1).reduce((s,i) => s + ALL_TXNS[i].amtValue, 0);
  const newTxnArriveF = newCount === 0 ? 0 : TXN_START + (newCount-1)*TXN_GAP;
  const balProg = ease(f, newTxnArriveF, newTxnArriveF+22, 0, 1);
  const balance = f < TXN_START ? ALL_TXNS[0].amtValue : Math.round(prevBalance + (totalBalance-prevBalance)*balProg);
  const balStr  = balance.toLocaleString("en-GB");

  const escrowCount = Math.max(1, visIndices.filter(i => ALL_TXNS[i].badge==="In Escrow").length);

  const txnRows: TxnRow[] = visIndices.map((srcIdx,pos) => {
    const isNewest = pos===0 && newCount>0;
    const arriveF  = TXN_START + (srcIdx-1)*TXN_GAP;
    const slideY   = isNewest && f < arriveF+22 ? ease(f, arriveF, arriveF+22, -65, 0) : 0;
    const op       = srcIdx===0 ? 1 : ease(f, arriveF, arriveF+18, 0, 1);
    return { ...ALL_TXNS[srcIdx], slideY, op };
  });

  // ── Canvas scale ──────────────────────────────────────────────────────
  const SHELL_W = 414, SHELL_H = 884;
  const canvasScale = Math.min(920/SHELL_W, 1640/SHELL_H);
  const scaledW = SHELL_W*canvasScale, scaledH = SHELL_H*canvasScale;
  const phoneLeft = (1080-scaledW)/2, phoneTop = (1920-scaledH)/2;

  // ── Outro ─────────────────────────────────────────────────────────────
  const outroWhite  = ease(f, OUTRO_S, OUTRO_S+28, 0, 1);
  const outroLogoOp = ease(f, OUTRO_S+28, OUTRO_E-8, 0, 1);

  // ── Txn frames for sounds ─────────────────────────────────────────────
  const txnFrames = Array.from({length:5}, (_,i) => TXN_START + i*TXN_GAP);

  return (
    <AbsoluteFill style={{fontFamily}}>

      {/* ── Shifting background ─────────────────────────────────── */}
      <AbsoluteFill style={{background:currBg}}/>
      <AbsoluteFill style={{background:nextBg, opacity:bgBlend, pointerEvents:"none"}}/>
      <div style={{position:"absolute",top:-200,right:-200,width:900,height:900,borderRadius:"50%",background:`radial-gradient(circle, ${accent} 0%, transparent 65%)`,pointerEvents:"none"}}/>

      {/* ── Logo intro ──────────────────────────────────────────── */}
      <AbsoluteFill style={{background:WHITE,opacity:logoOp,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",pointerEvents:"none"}}>
        <div style={{transform:`scale(${logoScale})`,display:"flex",flexDirection:"column",alignItems:"center",gap:28}}>
          <Img src={staticFile("logo-icon.png")} style={{width:160,height:160,borderRadius:36}}/>
          <Img src={staticFile("logo-text.png")} style={{height:60,width:"auto"}}/>
        </div>
      </AbsoluteFill>

      {/* ── Shadow ──────────────────────────────────────────────── */}
      <div style={{position:"absolute",left:phoneLeft+scaledW*0.08,top:phoneTop+scaledH+(floatY*canvasScale)+16,width:scaledW*0.84,height:28,background:"rgba(0,0,0,0.25)",borderRadius:"50%",filter:"blur(16px)",transform:`scaleX(${shadowSclX})`,transformOrigin:"50% 50%",opacity:shadowOp,pointerEvents:"none"}}/>

      {/* ── iPhone 17 Pro ───────────────────────────────────────── */}
      <div style={{position:"absolute",left:phoneLeft,top:phoneTop,opacity:phoneOp,transform:`translate(${tx*canvasScale}px,${ty*canvasScale}px) rotate(${rot}deg) translateY(${floatY*canvasScale}px) scale(${scl})`,transformOrigin:"50% 100%"}}>
        <IPhone17Pro scale={canvasScale}>
          <AppScreen balanceStr={balStr} escrowNum={escrowCount} txns={txnRows}/>
        </IPhone17Pro>
      </div>

      {/* ── Captions ────────────────────────────────────────────── */}
      <AbsoluteFill style={{pointerEvents:"none"}}>
        {CAPTIONS.map(([s,e,text],i) => {
          const op  = interpolate(f, [s, s+8, e-6, e], [0,1,1,0], {extrapolateLeft:"clamp",extrapolateRight:"clamp"});
          const yOff = ease(f, s, s+10, 14, 0);
          if (op < 0.01) return null;
          const isBottom = i%2===0;
          return (
            <div key={i} style={{position:"absolute",left:0,right:0,...(isBottom?{bottom:260}:{top:180}),display:"flex",justifyContent:"center",opacity:op,transform:`translateY(${isBottom?yOff:-yOff}px)`}}>
              <div style={{background:"rgba(0,0,0,0.70)",backdropFilter:"blur(14px)",borderRadius:22,padding:"18px 38px",maxWidth:840,textAlign:"center"}}>
                {text.split("\n").map((line,li)=>(
                  <div key={li} style={{fontSize:li===0?54:42,fontWeight:li===0?800:500,color:li===0?WHITE:ORANGE,lineHeight:1.25,letterSpacing:li===0?-1:0,fontFamily:"-apple-system,BlinkMacSystemFont,sans-serif"}}>
                    {line}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </AbsoluteFill>

      {/* ── Sound effects ───────────────────────────────────────── */}
      {txnFrames.map((sf,i)=>(
        <Sequence key={"counter"+i} from={sf} durationInFrames={42}>
          <Audio src={SND.counter} volume={0.5}/>
        </Sequence>
      ))}
      {txnFrames.map((sf,i)=>(
        <Sequence key={"notif"+i} from={sf+6} durationInFrames={40}>
          <Audio src={SND.notification} volume={0.55}/>
        </Sequence>
      ))}

      {/* ── Full voiceover audio ────────────────────────────────────── */}
      <Audio src={staticFile("sounds/voiceover.mp3")} volume={1.0}/>

      {/* ── Outro white fade + logo ──────────────────────────────── */}
      <AbsoluteFill style={{background:WHITE,opacity:outroWhite,pointerEvents:"none"}}/>
      <AbsoluteFill style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",opacity:outroLogoOp,pointerEvents:"none"}}>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:28}}>
          <Img src={staticFile("logo-icon.png")} style={{width:180,height:180,borderRadius:40}}/>
          <Img src={staticFile("logo-text.png")} style={{height:70,width:"auto"}}/>
          <div style={{fontSize:30,color:ORANGE,fontWeight:700,marginTop:8}}>trustdepo.com</div>
          <div style={{background:ORANGE,borderRadius:24,padding:"24px 60px",marginTop:16}}>
            <div style={{fontSize:40,fontWeight:900,color:WHITE,letterSpacing:-0.5}}>📱 Download Now</div>
            <div style={{fontSize:24,color:"rgba(255,255,255,0.85)",textAlign:"center",marginTop:6}}>App Store · Google Play</div>
          </div>
        </div>
      </AbsoluteFill>

    </AbsoluteFill>
  );
};
