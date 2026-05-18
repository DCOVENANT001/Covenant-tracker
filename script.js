   // Initialize Supabase
const _supabase = supabase.createClient(
  'https://ipvhnmqdpeaylwozneen.supabase.co', 
  'sb_publishable_pQhEuI-eEWLoJ5itg3NVag_DUc-xlOA'
);

// Initialize OneSignal (Replace with your actual App ID once you have it)
window.OneSignal = window.OneSignal || [];
OneSignal.push(function() {
  OneSignal.init({
    appId: "YOUR_ONESIGNAL_APP_ID",
    allowLocalhostAsSecureOrigin: true,
  });
});
 const BLOCKS=[
      {id:'b1',num:'01',emoji:'🌅',title:'Morning Foundation',dur:'45 mins',tasks:['Prayer + mindset','Review and rewrite your goals','Read 10 pages of a book']},
      {id:'b2',num:'02',emoji:'🧠',title:'Deep Learning',dur:'90 mins',tasks:['GHL — 2 videos + practice','Make — 1 video + practice','Zapier — 1 video + practice (academy)']},
      {id:'b3',num:'03',emoji:'🔨',title:'Build',dur:'2 hours',tasks:['Build something for a client','Work on active client projects','Screenshot + document everything built']},
      {id:'b4',num:'04',emoji:'📣',title:'Content + Client Acquisition',dur:'1 hour',tasks:['Post on X + LinkedIn (show your work)','Apply to 5 jobs or send 5 DMs','Reply to comments + engage','Post on TikTok (3x/week)']},
      {id:'b5',num:'05',emoji:'🎓',title:'Teaching + Private Classes',dur:'2–3 hours',tasks:['Private student classes (daily)','Thursday — academy evening class']},
      {id:'b6',num:'06',emoji:'🌙',title:'Night Wrap',dur:'45 mins',tasks:['Review what you accomplished','Write 3 non-negotiables for tomorrow','Light reading or podcast/audio','Sleep — you earned it']}
    ];
    const QUOTES=[
      {t:"Don't wish it were easier. Wish you were better.",a:"Jim Rohn"},
      {t:"Become the best in the world at what you do.",a:"Naval Ravikant"},
      {t:"Cleaners don't think about what they want. They think about what needs to be done.",a:"Tim S. Grover"},
      {t:"Money is a reward for solving problems. Solve bigger problems.",a:"Myron Golden"},
      {t:"You don't rise to the level of your goals. You fall to the level of your systems.",a:"James Clear"},
      {t:"Rich people have big libraries. Poor people have big TVs.",a:"Jim Rohn"},
      {t:"Until you value yourself, you won't value your time.",a:"Myles Munroe"},
      {t:"The house before 25. The skyscraper after. Stay locked in.",a:"Covenant's Vision"}
    ];

    // ── Storage ──
    const todayK=()=>new Date().toISOString().split('T')[0];
    const ld=(k,d)=>{try{const v=localStorage.getItem(k);return v!==null?JSON.parse(v):d}catch{return d}};
    const sv=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch{}};
    const getDd=k=>{const a=ld('cov3',{});return a[k]||{tasks:{},win:''}};
    const saveDd=(k,d)=>{const a=ld('cov3',{});a[k]=d;sv('cov3',a)};

    // ── Particles ──
    function burst(x,y,n=14){
      const cols=['#B8960C','#D4AC0D','#FBF5DC','#0D0D0D','#E8D5A3','#fff'];
      const w=document.getElementById('ptcl');
      for(let i=0;i<n;i++){
        const el=document.createElement('div');el.className='pt';
        const ang=Math.random()*360,dist=45+Math.random()*85;
        el.style.cssText=`left:${x}px;top:${y}px;width:${5+Math.random()*6}px;height:${5+Math.random()*6}px;background:${cols[Math.floor(Math.random()*cols.length)]};--tx:${Math.cos(ang*Math.PI/180)*dist}px;--ty:${Math.sin(ang*Math.PI/180)*dist}px;--rot:${(Math.random()-.5)*720}deg;--dur:${.6+Math.random()*.5}s;border-radius:${Math.random()>.5?'50%':'3px'}`;
        w.appendChild(el);setTimeout(()=>el.remove(),1200);
      }
    }
    function floatE(e,x,y){
      const el=document.createElement('div');el.className='fe';el.textContent=e;
      el.style.left=x-14+'px';el.style.top=y-14+'px';
      document.body.appendChild(el);setTimeout(()=>el.remove(),920);
    }

    // ── Scoring ──
    function calcSc(k){
      const d=getDd(k);let tot=0,done=0;
      BLOCKS.forEach(b=>b.tasks.forEach((_,i)=>{tot++;if(d.tasks[`${b.id}_${i}`])done++;}));
      return tot?Math.round(done/tot*100):0;
    }
    function calcStreak(){
      let s=0;const t=new Date();
      for(let i=0;i<365;i++){const d=new Date(t);d.setDate(d.getDate()-i);if(calcSc(d.toISOString().split('T')[0])===100)s++;else if(i>0)break;}
      return s;
    }
    function weakB(){
      const all=ld('cov3',{});const sc={},ct={};
      BLOCKS.forEach(b=>{sc[b.id]=0;ct[b.id]=0});
      Object.values(all).forEach(day=>BLOCKS.forEach(b=>{
        let done=0;b.tasks.forEach((_,i)=>{if(day.tasks&&day.tasks[`${b.id}_${i}`])done++;});
        sc[b.id]+=done/b.tasks.length;ct[b.id]++;
      }));
      let wId=null,wS=999;
      BLOCKS.forEach(b=>{if(ct[b.id]>0){const avg=sc[b.id]/ct[b.id];if(avg<wS){wS=avg;wId=b.id;}}});
      return wId?BLOCKS.find(b=>b.id===wId):null;
    }

    // ── Home ──
    function renderHome(){
      const k=todayK();
      document.getElementById('homeDate').textContent=new Date().toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'}).toUpperCase();
      const sc=calcSc(k),streak=calcStreak();
      document.getElementById('streakV').innerHTML=`${streak}<span> days</span>`;
      document.getElementById('scoreV').innerHTML=`${sc}<span>%</span>`;
      document.getElementById('dpPct').textContent=sc+'%';
      document.getElementById('progFill').style.width=sc+'%';
      if(sc===100)document.getElementById('compBanner').classList.add('show');
      else document.getElementById('compBanner').classList.remove('show');
      const data=getDd(k);
      document.getElementById('winIn').value=data.win||'';
      renderBlocks(data);
      const q=QUOTES[new Date().getDay()%QUOTES.length];
      document.getElementById('qBody').textContent=q.t;
      document.getElementById('qAuth').textContent='— '+q.a;
    }

    function renderBlocks(data){
      const wrap=document.getElementById('blocksWrap');wrap.innerHTML='';
      BLOCKS.forEach((b,bi)=>{
        const allDone=b.tasks.every((_,i)=>data.tasks[`${b.id}_${i}`]);
        const dnCt=b.tasks.filter((_,i)=>data.tasks[`${b.id}_${i}`]).length;
        const pct=Math.round(dnCt/b.tasks.length*100);
        const card=document.createElement('div');
        card.className='blk'+(allDone?' done':'');
        card.id='c_'+b.id;
        card.style.animation=`fadeUp .45s cubic-bezier(.22,1,.36,1) ${bi*.08}s both`;
        const tasksHTML=b.tasks.map((task,i)=>`
          <div class="trow${data.tasks[`${b.id}_${i}`]?' ticked':''}" id="tr_${b.id}_${i}" onclick="tickTask('${b.id}',${i},event)">
            <div class="tbox"><svg class="tchk" width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
            <div class="ttxt">${task}</div>
          </div>`).join('');
        card.innerHTML=`
          <div class="bhdr" onclick="toggleBlk('${b.id}')">
            <div class="bnum">${b.num}</div>
            <div class="binfo"><div class="bemj">${b.emoji}</div><div class="btit">${b.title}</div>
              <div class="bmeta"><div class="bdur">${b.dur}</div>${pct>0?`<div class="bpct">· ${pct}%</div>`:''}</div>
            </div>
            <div class="bacts">
              <button class="expbtn" onclick="event.stopPropagation();toggleBlk('${b.id}')">▾</button>
              <button class="tkbtn" onclick="event.stopPropagation();tickBlock('${b.id}',event)">
                <svg class="tkicon" width="13" height="11" viewBox="0 0 13 11" fill="none"><path d="M1 5.5L5 9.5L12 1.5" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
            </div>
          </div>
          <div class="tpanel"><div class="tinner">${tasksHTML}</div></div>`;
        wrap.appendChild(card);
      });
    }

    function toggleBlk(id){document.getElementById('c_'+id).classList.toggle('open')}

    function tickTask(blockId, idx, e){
  e.stopPropagation();
  const k=todayK(),data=getDd(k),key=`${blockId}_${idx}`;
  data.tasks[key]=!data.tasks[key];saveDd(k,data);
  const row=document.getElementById(`tr_${blockId}_${idx}`);
  row.classList.toggle('ticked',data.tasks[key]);
  if(data.tasks[key]){
    const r=row.getBoundingClientRect();
    burst(r.left+r.width/2,r.top+r.height/2,10);
    floatE('✓',r.left+r.width/2,r.top);
  }
  refreshBlk(blockId,data);
  refreshScore();
  
  // FINAL CONNECTION LINE:
  syncToSupabase(); 
}

    function tickBlock(blockId, e){
  e.stopPropagation();
  const k=todayK(),data=getDd(k),b=BLOCKS.find(x=>x.id===blockId);
  const allDone=b.tasks.every((_,i)=>data.tasks[`${blockId}_${i}`]);
  b.tasks.forEach((_,i)=>{
    data.tasks[`${blockId}_${i}`]=!allDone;
    const r=document.getElementById(`tr_${blockId}_${i}`);
    if(r)r.classList.toggle('ticked',!allDone);
  });
  saveDd(k,data);
  refreshBlk(blockId,data);
  refreshScore();
  if(!allDone){
    const card=document.getElementById('c_'+blockId);
    card.classList.add('shk');setTimeout(()=>card.classList.remove('shk'),420);
    const r=card.getBoundingClientRect();
    burst(r.left+r.width*.3,r.top+50,12);burst(r.left+r.width*.7,r.top+50,12);
  }

  // FINAL CONNECTION LINE:
  syncToSupabase();
}

    function refreshBlk(blockId,data){
      const b=BLOCKS.find(x=>x.id===blockId);
      const allDone=b.tasks.every((_,i)=>data.tasks[`${blockId}_${i}`]);
      const dnCt=b.tasks.filter((_,i)=>data.tasks[`${blockId}_${i}`]).length;
      const pct=Math.round(dnCt/b.tasks.length*100);
      const card=document.getElementById('c_'+blockId);if(!card)return;
      card.classList.toggle('done',allDone);
      const pm=card.querySelector('.bpct');
      if(pct>0){if(pm)pm.textContent='· '+pct+'%';else{const m=card.querySelector('.bmeta');if(m){const d2=document.createElement('div');d2.className='bpct';d2.textContent='· '+pct+'%';m.appendChild(d2);}}}
      else if(pm)pm.remove();
    }

    function refreshScore(){
      const sc=calcSc(todayK());
      const el=document.getElementById('scoreV');
      el.classList.remove('bump');void el.offsetWidth;el.classList.add('bump');
      el.innerHTML=`${sc}<span>%</span>`;
      document.getElementById('dpPct').textContent=sc+'%';
      document.getElementById('progFill').style.width=sc+'%';
      if(sc===100){
        document.getElementById('compBanner').classList.add('show');
        const str=calcStreak();
        const sv2=document.getElementById('streakV');
        sv2.classList.remove('bump');void sv2.offsetWidth;sv2.classList.add('bump');
        sv2.innerHTML=`${str}<span> days</span>`;
        setTimeout(()=>{
          for(let i=0;i<7;i++)setTimeout(()=>burst(window.innerWidth*(.1+Math.random()*.8),window.innerHeight*(.1+Math.random()*.4),20),i*120);
          floatE('👑',window.innerWidth/2,window.innerHeight*.2);
          setTimeout(()=>floatE('🔥',window.innerWidth*.28,window.innerHeight*.3),210);
          setTimeout(()=>floatE('⚡',window.innerWidth*.72,window.innerHeight*.3),420);
        },350);
      }
    }

    function resetDay(){
      if(!confirm('Reset today?'))return;
      saveDd(todayK(),{tasks:{},win:''});
      document.getElementById('compBanner').classList.remove('show');
      renderHome();
    }

    document.addEventListener('DOMContentLoaded',()=>{
      const wi=document.getElementById('winIn');
      wi&&wi.addEventListener('input',()=>{const d=getDd(todayK());d.win=wi.value;saveDd(todayK(),d);});
    });

    // ── Goal Rewrite ──
    let curSess='morning';
    function switchSess(s){
      curSess=s;
      document.getElementById('tabM').classList.toggle('on',s==='morning');
      document.getElementById('tabN').classList.toggle('on',s==='night');
      document.getElementById('sessLbl').textContent=s==='morning'?'Morning Session':'Night Session';
      ['rw1','rw2','rw3'].forEach(id=>document.getElementById(id).value='');
      renderRwH();
    }
    function saveRw(){
      const g1=document.getElementById('rw1').value.trim();
      const g2=document.getElementById('rw2').value.trim();
      const g3=document.getElementById('rw3').value.trim();
      if(!g1&&!g2&&!g3)return;
      const h=ld('cov_rw3',[]);
      h.unshift({date:new Date().toISOString(),session:curSess,goals:[g1,g2,g3].filter(Boolean)});
      sv('cov_rw3',h.slice(0,200));
      ['rw1','rw2','rw3'].forEach(id=>document.getElementById(id).value='');
      renderRwH();
      const btn=document.getElementById('saveBtn');
      btn.textContent='✓ Saved!';btn.classList.add('saved');
      const r=btn.getBoundingClientRect();burst(r.left+r.width/2,r.top,18);
      setTimeout(()=>{btn.textContent='Save This Session →';btn.classList.remove('saved');},2200);
    }
    function renderRwH(){
      const h=ld('cov_rw3',[]).filter(x=>x.session===curSess);
      const el=document.getElementById('rwHist');
      if(!h.length){el.innerHTML='';return;}
      el.innerHTML='<div class="slbl" style="margin-top:0">Recent Rewrites</div>'+
        h.slice(0,10).map(x=>{
          const d=new Date(x.date);
          const lbl=d.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})+' · '+d.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'});
          return`<div class="hentry"><div class="htime">${lbl.toUpperCase()}</div>${x.goals.map(g=>`<div class="htxt">${g}</div>`).join('')}</div>`;
        }).join('');
    }

    // ── Stats ──
    function renderStats(){
      const weak=weakB();
      if(weak){document.getElementById('wkName').textContent=weak.emoji+' '+weak.title;document.getElementById('wkSub').textContent='This block needs more attention from you';}
      const wr=document.getElementById('weekRow');wr.innerHTML='';
      const days=['SUN','MON','TUE','WED','THU','FRI','SAT'];
      const t=new Date(),tdow=t.getDay();
      days.forEach((day,i)=>{
        const d=new Date(t);d.setDate(d.getDate()-(tdow-i));
        const k=d.toISOString().split('T')[0],sc=calcSc(k),isT=i===tdow;
        const cls=sc===100?'full':sc>0?'part':isT?'today':'';
        wr.innerHTML+=`<div style="text-align:center;animation:fadeUp .35s ease ${(i*.06).toFixed(2)}s both">
          <div class="wday">${day}</div><div class="wcirc ${cls}">${sc>0?sc+'%':isT?'·':''}</div></div>`;
      });
      const all=ld('cov3',{});const bp=document.getElementById('blockPerf');bp.innerHTML='';
      BLOCKS.forEach((b,bi)=>{
        let tot=0,done=0;
        Object.values(all).forEach(day=>b.tasks.forEach((_,i)=>{tot++;if(day.tasks&&day.tasks[`${b.id}_${i}`])done++;}));
        const pct=tot?Math.round(done/tot*100):0;
        bp.innerHTML+=`<div class="prow" style="animation:slideL .4s ease ${(bi*.07).toFixed(2)}s both">
          <div class="pname">${b.emoji} ${b.title}</div>
          <div class="pbar-wrap"><div class="pbar" data-pct="${pct}"></div></div>
          <div class="ppct">${pct}%</div></div>`;
      });
      requestAnimationFrame(()=>requestAnimationFrame(()=>{
        document.querySelectorAll('.pbar').forEach(bar=>{bar.style.width=bar.dataset.pct+'%';});
      }));
    }

    // ── Calendar ──
    let calY=new Date().getFullYear(),calM=new Date().getMonth();
    function renderCal(){
      const months=['January','February','March','April','May','June','July','August','September','October','November','December'];
      document.getElementById('calMonth').textContent=months[calM]+' '+calY;
      const fd=new Date(calY,calM,1).getDay(),dim=new Date(calY,calM+1,0).getDate();
      const ts=new Date().toISOString().split('T')[0];
      const wrap=document.getElementById('calDays');wrap.innerHTML='';
      let full=0,totSc=0,sd=0;
      for(let i=0;i<fd;i++)wrap.innerHTML+=`<div class="calday"></div>`;
      for(let d=1;d<=dim;d++){
        const ds=`${calY}-${String(calM+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        const sc=calcSc(ds),isT=ds===ts;
        let cls=sc===100?'complete':sc>0?'partial':'';if(isT)cls+=' today';
        if(sc===100)full++;if(sc>0){totSc+=sc;sd++;}
        wrap.innerHTML+=`<div class="calday ${cls}" style="animation:scaleIn .3s ease ${(d*.018).toFixed(2)}s both">${d}</div>`;
      }
      document.getElementById('calFull').textContent=full;
      document.getElementById('calStreak').textContent=calcStreak();
      document.getElementById('calAvg').textContent=sd?Math.round(totSc/sd)+'%':'0%';
    }
    function changeMonth(dir){calM+=dir;if(calM>11){calM=0;calY++;}if(calM<0){calM=11;calY--;}renderCal();}

    // ── Navigation ──
    const PANELS={home:'p-home',goals:'p-goals',stats:'p-stats',cal:'p-cal'};
    let curTab='home';
    function go(tab){
      if(tab===curTab)return;
      // Hide current — remove from layout
      const old=document.getElementById(PANELS[curTab]);
      old.classList.remove('active');
      // Show new — add to layout + trigger fresh animation
      const next=document.getElementById(PANELS[tab]);
      next.classList.add('active');
      // Force animation restart
      next.style.animation='none';
      void next.offsetWidth;
      next.style.animation='';
      // Nav buttons
      document.querySelectorAll('.nb').forEach(b=>b.classList.remove('on'));
      const navBtn=document.getElementById('nav-'+tab);
      navBtn.classList.add('on');
      // Restart icon animation
      const ni=navBtn.querySelector('.ni');
      ni.style.animation='none';void ni.offsetWidth;ni.style.animation='';
      window.scrollTo(0,0);
      curTab=tab;
      if(tab==='stats')renderStats();
      if(tab==='cal')renderCal();
      if(tab==='goals')renderRwH();
    }
    // ── Cloud Sync Engine ──
async function syncToSupabase() {
    const { data: { user } } = await _supabase.auth.getUser();
    if (!user) return; 

    const k = todayK();
    const data = getDd(k);
    const sc = calcSc(k);

    const { error } = await _supabase
        .from('daily_stats')
        .upsert({ 
            user_id: user.id,
            day_date: k,
            score: sc,
            streak: parseInt(document.getElementById('calStreak').textContent) || 0,
            blocks_data: data.tasks
        }, { onConflict: 'user_id, day_date' });

    if (error) console.error("Cloud Error:", error.message);
    else console.log("Locked In to Cloud! 👑");
}

    // ── Init ──
    renderHome();
    