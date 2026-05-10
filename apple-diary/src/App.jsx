import { useState } from "react";

const XIA = {
  happy:     "/imgs/xia_happy.png",
  sad:       "/imgs/xia_sad.png",
  angry:     "/imgs/xia_angry.png",
  sleepy:    "/imgs/xia_sleepy.png",
  surprised: "/imgs/xia_surprised.png",
  cool:      "/imgs/xia_cool.png",
  shy:       "/imgs/xia_shy.png",
};
const YING = {
  happy:     "/imgs/ying_happy.png",
  sad:       "/imgs/ying_sad.png",
  angry:     "/imgs/ying_angry.png",
  shy:       "/imgs/ying_shy.png",
  surprised: "/imgs/ying_surprised.png",
  sleepy:    "/imgs/ying_sleepy.png",
  cool:      "/imgs/ying_cool.png",
};
const BG = "/imgs/bg.png";

const INTERACTIONS = [
  { moodA:"happy",     moodB:"happy",     bA:"莹莹今天开心吗~",        bB:"哥哥你也太可爱了吧！",  aFirst:true  },
  { moodA:"happy",     moodB:"shy",       bA:"宝宝脸红啦？",            bB:"才没有…哥哥大人坏！",   aFirst:true  },
  { moodA:"cool",      moodB:"happy",     bA:"妹妹不要闹了。",          bB:"大长官严肃什么嘻嘻~",   aFirst:false },
  { moodA:"happy",     moodB:"surprised", bA:"小长官，惊什么呢。",       bB:"哥哥！？怎么突然来！",  aFirst:false },
  { moodA:"sad",       moodB:"happy",     bA:"妹妹…哥哥今天累了。",     bB:"哥哥抱抱！马上好！",    aFirst:true  },
  { moodA:"cool",      moodB:"angry",     bA:"莹莹，消消气。",          bB:"哼！大笨蛋！不理你！",  aFirst:false },
  { moodA:"angry",     moodB:"sad",       bA:"妹妹大人，别哭了。",      bB:"呜呜…夏以昼你凶我…",   aFirst:false },
  { moodA:"shy",       moodB:"happy",     bA:"……谢谢你，莹莹。",        bB:"哥哥脸红了哈哈哈！",    aFirst:false },
  { moodA:"surprised", moodB:"cool",      bA:"妹妹！你怎么这么淡定！",  bB:"大长官慌什么，我在呢。",aFirst:true  },
  { moodA:"sleepy",    moodB:"happy",     bA:"莹莹……困了……",           bB:"哥哥哥哥快起来！",      aFirst:false },
  { moodA:"happy",     moodB:"sleepy",    bA:"宝宝睡着了？",            bB:"嗯…妹妹大人要睡了…",   aFirst:true  },
  { moodA:"cool",      moodB:"shy",       bA:"妹妹大人，乖。",          bB:"哥哥…你突然这么温柔…", aFirst:true  },
  { moodA:"angry",     moodB:"surprised", bA:"莹莹，过来。",            bB:"哥！？哥哥你干嘛！",    aFirst:true  },
  { moodA:"happy",     moodB:"happy",     bA:"莹莹真可爱。",            bB:"哥哥你才可爱！哼！",    aFirst:true  },
  { moodA:"sad",       moodB:"sad",       bA:"妹妹……",                  bB:"哥哥……",               aFirst:true  },
];

function Bubble({ text, isLeft, isTop, textColor, borderColor }) {
  const br = isLeft ? "14px 14px 14px 4px" : "14px 14px 4px 14px";
  const hPos = isLeft
    ? { left: "50%", transform: "translateX(-5%)" }
    : { right: "50%", transform: "translateX(5%)" };
  const vPos = isTop ? "calc(100% + 10px)" : "14px";
  const tailH  = isLeft ? { left: 12 } : { right: 12 };
  const tailH2 = isLeft ? { left: 14 } : { right: 14 };
  return (
    <div className="bubble-pop" style={{
      position:"absolute", bottom:vPos, ...hPos,
      background:"white", border:"2.5px solid "+borderColor,
      borderRadius:br, padding:"6px 13px",
      fontSize:12, color:textColor, fontWeight:700,
      whiteSpace:"nowrap", boxShadow:"2px 3px 0 "+borderColor, zIndex:30,
    }}>
      {text}
      <div style={{
        position:"absolute", bottom:-9, ...tailH,
        width:0, height:0,
        borderLeft:"7px solid transparent", borderRight:"7px solid transparent",
        borderTop:"9px solid "+borderColor,
      }}/>
      <div style={{
        position:"absolute", bottom:-6, ...tailH2,
        width:0, height:0,
        borderLeft:"5px solid transparent", borderRight:"5px solid transparent",
        borderTop:"7px solid white",
      }}/>
    </div>
  );
}

export default function App() {
  const [idx, setIdx] = useState(null);
  const [story, setStory] = useState("");
  const [loading, setLoading] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const current = idx !== null ? INTERACTIONS[idx] : null;
  const imgYing = YING[current ? current.moodB : "happy"];
  const imgXia  = XIA[current ? current.moodA : "happy"];

  const handleGenerate = async () => {
    setLoading(true);
    setStory("");
    const newIdx = Math.floor(Math.random() * INTERACTIONS.length);
    setIdx(newIdx);
    setAnimKey(k => k + 1);
    const inter = INTERACTIONS[newIdx];
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: "你是可爱故事生成器。用一句话（20-35字）描述以下场景，语气软萌，像日记或小说片段，带点两人之间的小情绪或温馨感。哥哥叫「夏以昼」，妹妹叫「莹莹」。夏以昼说：「" + inter.bA + "」，莹莹说：「" + inter.bB + "」。只输出一句话，不要任何解释。"
        })
      });
      const data = await res.json();
      setStory(data.text || "");
    } catch(e) {
      setStory("夏以昼和莹莹又在院子里闹小情绪了。");
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight:"100vh", background:"#a8dde8",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      padding:"16px", fontFamily:"'Noto Sans SC', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;600;700;900&display=swap');
        @keyframes floatA { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes floatB { 0%,100%{transform:translateY(-5px)} 50%{transform:translateY(5px)} }
        @keyframes popIn  { from{transform:scale(0.5) translateY(8px);opacity:0} to{transform:scale(1) translateY(0);opacity:1} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse  { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }
        .float-a { animation: floatA 3s ease-in-out infinite; }
        .float-b { animation: floatB 3.3s ease-in-out infinite; }
        .bubble-pop { animation: popIn 0.4s cubic-bezier(.34,1.56,.64,1) forwards; }
        .story-fade { animation: fadeUp 0.5s ease forwards; }
        button:hover { transform: scale(1.06) translateY(-2px) !important; }
        button:active { transform: scale(0.96) !important; }
      `}</style>

      <div style={{
        background:"rgba(255,255,255,0.92)", border:"3px solid #ffb7c5",
        borderRadius:20, padding:"8px 28px", marginBottom:14, boxShadow:"0 4px 0 #ffb7c5",
      }}>
        <span style={{fontSize:20, fontWeight:900, color:"#e8759a", letterSpacing:3}}>
          🍎 今日苹果日记 🍏
        </span>
      </div>

      <div style={{
        width:"100%", maxWidth:600, position:"relative",
        borderRadius:24, border:"3px solid rgba(255,255,255,0.85)",
        boxShadow:"0 8px 32px rgba(150,120,140,0.3)", overflow:"visible",
      }}>
        <img src={BG} alt="bg" style={{
          width:"100%", display:"block", borderRadius:21, imageRendering:"pixelated",
        }}/>

        <div key={animKey} style={{
          position:"absolute", bottom:"30%", left:0, right:0,
          display:"flex", justifyContent:"space-between", alignItems:"flex-end",
          padding:"0 6%",
        }}>
          {/* 左边：莹莹 */}
          <div style={{display:"flex", flexDirection:"column", alignItems:"center", position:"relative"}}>
            {current && (
              <Bubble text={current.bB} isLeft={true} isTop={!current.aFirst}
                textColor="#1a4a30" borderColor="#a8e0b8" />
            )}
            <div className="float-a">
              <img src={imgYing} alt="莹莹" style={{
                width:118, imageRendering:"pixelated", display:"block",
                transform:(current && current.moodB==="surprised") ? "none" : "scaleX(-1)",
              }}/>
            </div>
            <div style={{
              background:"#3a8e5a", borderRadius:20, padding:"3px 12px",
              fontSize:11, fontWeight:800, color:"white",
              letterSpacing:1, boxShadow:"0 2px 0 #1a6a3a", marginTop:4,
            }}>🍏 莹莹</div>
          </div>

          <div style={{fontSize:18, paddingBottom:60, animation:"pulse 2s ease-in-out infinite"}}>🌸</div>

          {/* 右边：夏以昼 */}
          <div style={{display:"flex", flexDirection:"column", alignItems:"center", position:"relative"}}>
            {current && (
              <Bubble text={current.bA} isLeft={false} isTop={current.aFirst}
                textColor="#5a2840" borderColor="#f0b8c8" />
            )}
            <div className="float-b">
              <img src={imgXia} alt="夏以昼" style={{
                width:118, imageRendering:"pixelated", display:"block",
              }}/>
            </div>
            <div style={{
              background:"#e8759a", borderRadius:20, padding:"3px 12px",
              fontSize:11, fontWeight:800, color:"white",
              letterSpacing:1, boxShadow:"0 2px 0 #c05070", marginTop:4,
            }}>🍎 夏以昼</div>
          </div>
        </div>
      </div>

      <div style={{
        minHeight:52, width:"100%", maxWidth:500,
        display:"flex", alignItems:"center", justifyContent:"center",
        marginTop:14, marginBottom:14,
      }}>
        {loading ? (
          <div style={{display:"flex", gap:7}}>
            {[0,1,2].map(i=>(
              <div key={i} style={{
                width:9, height:9, borderRadius:"50%", background:"#ffb7c5",
                animation:"pulse 1s ease-in-out "+(i*0.2)+"s infinite",
              }}/>
            ))}
          </div>
        ) : story ? (
          <div className="story-fade" style={{
            background:"rgba(255,255,255,0.92)", border:"2px solid #ffd4de",
            borderRadius:16, padding:"10px 20px", fontSize:14, color:"#6a3a4a",
            lineHeight:1.8, textAlign:"center", fontWeight:600, boxShadow:"0 3px 0 #ffd4de",
          }}>✦ {story} ✦</div>
        ) : (
          <div style={{fontSize:13, color:"rgba(80,60,70,0.4)", letterSpacing:1}}>
            点击下方按钮，生成今日日记 ↓
          </div>
        )}
      </div>

      <button onClick={handleGenerate} disabled={loading} style={{
        background:loading?"#f0c0cc":"linear-gradient(135deg,#ff8fab,#ffb3c1)",
        border:"none", borderRadius:50, padding:"13px 44px",
        fontSize:15, fontWeight:800, color:"white",
        cursor:loading?"not-allowed":"pointer",
        letterSpacing:3, boxShadow:"0 5px 0 #e8849a",
        transition:"transform 0.15s, box-shadow 0.15s",
        fontFamily:"inherit", textShadow:"0 1px 2px rgba(0,0,0,0.15)",
      }}>
        {loading ? "生成中…" : "✨ 随机生成"}
      </button>

      <p style={{fontSize:11, color:"rgba(80,60,70,0.35)", marginTop:14, letterSpacing:1}}>
        每次随机一个互动场景 + AI生成日记一句话
      </p>
    </div>
  );
}
