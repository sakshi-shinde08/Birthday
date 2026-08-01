document.addEventListener('DOMContentLoaded', () => {
  window.scrollTo(0, 0);

  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) {
    return;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return;
  }
  function resize(){ canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  const colors = ['#FFB627','#FF6B6B','#C9B6E4','#FDF6EC','#9C84C4'];
  let particles = [];

  function spawnConfetti(count = 140){
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduced) count = Math.min(count, 30);
    for(let i=0;i<count;i++){
      particles.push({
        x: Math.random()*canvas.width,
        y: -20 - Math.random()*canvas.height*0.3,
        w: 6+Math.random()*6,
        h: 8+Math.random()*10,
        color: colors[Math.floor(Math.random()*colors.length)],
        speedY: 2+Math.random()*3.5,
        speedX: -1.5+Math.random()*3,
        rot: Math.random()*360,
        rotSpeed: -6+Math.random()*12,
        life: 0,
        maxLife: 220+Math.random()*100
      });
    }
  }

  // ---------------- Fireworks engine ----------------
  let spawnFireworks = function(x,y,count){ /* no-op until canvas ready */ };
  const fwCanvas = document.getElementById('fireworks-canvas');
  let fwCtx, fwW, fwH, fwParticles = [];
  if (fwCanvas) {
    fwCtx = fwCanvas.getContext('2d');
    if (!fwCtx) {
      return;
    }
    function resizeFW(){ fwCanvas.width = window.innerWidth; fwCanvas.height = window.innerHeight; fwW = fwCanvas.width; fwH = fwCanvas.height; }
    resizeFW(); window.addEventListener('resize', resizeFW);

    class FWParticle { constructor(x,y,color){ this.x=x; this.y=y; this.vx=(Math.random()-0.5)*6; this.vy=(Math.random()-0.5)*6; this.life=60+Math.random()*40; this.color=color; }
      update(){ this.x+=this.vx; this.y+=this.vy; this.vy+=0.05; this.life--; }
      draw(){ fwCtx.globalAlpha = Math.max(0, this.life/100); fwCtx.fillStyle = this.color; fwCtx.beginPath(); fwCtx.arc(this.x,this.y,Math.max(1, this.life/12),0,Math.PI*2); fwCtx.fill(); }
    }

    spawnFireworks = function(x=fwW/2,y=fwH/2,count=50){ const colors=['#FF6B6B','#FFB347','#C9B6E4','#9C84C4','#FFF2CC']; for(let i=0;i<count;i++){ fwParticles.push(new FWParticle(x,y,colors[Math.floor(Math.random()*colors.length)]) ); } };

    function renderFW(){ fwCtx.clearRect(0,0,fwW,fwH); for(let i=fwParticles.length-1;i>=0;i--){ const p=fwParticles[i]; p.update(); p.draw(); if(p.life<=0) fwParticles.splice(i,1); } requestAnimationFrame(renderFW); }
    renderFW();
  }

  function animate(){
    if (!ctx || !canvas) return;
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p=>{
      p.x += p.speedX;
      p.y += p.speedY;
      p.rot += p.rotSpeed;
      p.life++;
      ctx.save();
      ctx.translate(p.x,p.y);
      ctx.rotate(p.rot*Math.PI/180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h);
      ctx.restore();
    });
    particles = particles.filter(p=>p.life < p.maxLife && p.y < canvas.height+40);
    requestAnimationFrame(animate);
  }
  animate();

  // ---------------- Hero unlock button ----------------
  const unlockBtn = document.getElementById('unlockBtn');
  const badgeOverlay = document.getElementById('badgeOverlay');
  const badgeClose = document.getElementById('badgeClose');

  if(unlockBtn) {
      unlockBtn.addEventListener('click', ()=>{
        spawnConfetti(160);
        if (typeof playUnlockSound === 'function') playUnlockSound();
        badgeOverlay.classList.add('show');
      });
  }

  if(badgeClose) {
      badgeClose.addEventListener('click', ()=>{ badgeOverlay.classList.remove('show'); });
  }
  if(badgeOverlay) {
      badgeOverlay.addEventListener('click', (e)=>{
        if(e.target === badgeOverlay) badgeOverlay.classList.remove('show');
      });
  }

  // ---------------- Gift cards ----------------
  const cardFlipWrap = document.getElementById('cardFlipWrap');
  if(cardFlipWrap) {
      cardFlipWrap.addEventListener('click', ()=>{ cardFlipWrap.classList.toggle('flipped'); });
  }

  const giftCert = document.getElementById('giftCert');
  const certStamp = document.getElementById('certStamp');
  if(giftCert && certStamp) {
      giftCert.addEventListener('click', ()=>{ certStamp.classList.toggle('show'); spawnConfetti(20); });
  }

  const giftCoupon = document.getElementById('giftCoupon');
  const couponRedeemed = document.getElementById('couponRedeemed');
  if(giftCoupon && couponRedeemed) {
      giftCoupon.addEventListener('click', ()=>{
        couponRedeemed.classList.toggle('show');
        if(couponRedeemed.classList.contains('show')) spawnConfetti(30);
      });
  }

  // Celebration modal controls
  const celebrationModal = document.getElementById('celebrationModal');
  const celebrationClose = document.getElementById('celebrationClose');
  const celebrationReplay = document.getElementById('celebrationReplay');
  const celebrationTitle = document.getElementById('celebrationTitle');
  const celebrationMessage = document.getElementById('celebrationMessage');

  function showCelebration(title, message){ if(celebrationTitle) celebrationTitle.textContent = title || 'Hooray!'; if(celebrationMessage) celebrationMessage.textContent = message || ''; if(celebrationModal){ celebrationModal.setAttribute('aria-hidden','false'); celebrationModal.classList.add('show'); } spawnConfetti(180); spawnFireworks(window.innerWidth/2, window.innerHeight/3, 90); if(typeof playUnlockSound==='function') playUnlockSound(); }
  function hideCelebration(){ if(celebrationModal){ celebrationModal.setAttribute('aria-hidden','true'); celebrationModal.classList.remove('show'); } }
  if(celebrationClose) celebrationClose.addEventListener('click', hideCelebration);
  if(celebrationReplay) celebrationReplay.addEventListener('click', ()=>{ spawnConfetti(160); spawnFireworks(window.innerWidth/2, window.innerHeight/3, 90); if(typeof playUnlockSound==='function') playUnlockSound(); });

  // ---------------- Tic-Tac-Toe (simple) ----------------
  const tttBoard = document.getElementById('tictactoe');
  const tttRestart = document.getElementById('tttRestart');
  let tttState = Array(9).fill(null);
  let tttTurn = 'X';
  function tttCheckWin(state){ const wins=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]; for(const [a,b,c] of wins){ if(state[a] && state[a]===state[b] && state[a]===state[c]) return state[a]; } return null; }
  function tttRender(){ if(!tttBoard) return; tttBoard.querySelectorAll('.cell').forEach((cell,i)=>{ cell.textContent = tttState[i] || ''; }); }
  function tttReset(){ tttState = Array(9).fill(null); tttTurn='X'; tttRender(); }
  if(tttBoard){ tttBoard.addEventListener('click', (e)=>{ const cell = e.target.closest('.cell'); if(!cell) return; const idx = Number(cell.dataset.index); if(isNaN(idx)) return; if(tttState[idx]) return; tttState[idx]=tttTurn; tttRender(); const winner = tttCheckWin(tttState); if(winner){ setTimeout(()=>{ showCelebration('Winner!','You won tic-tac-toe 🎉'); }, 250); } else {
      tttTurn = tttTurn === 'X' ? 'O' : 'X';
    }
  }); }
  if(tttRestart) tttRestart.addEventListener('click', tttReset);
  // initialize board
  tttReset();

  // ---------------- Gallery puzzle unlock ----------------
  function unlockSlot(slot){
    if(slot.classList.contains('unlocked')) return;
    slot.classList.add('unlocked');
    spawnConfetti(50);
    if(document.getElementById('autoCelebrate') && document.getElementById('autoCelebrate').checked){ showCelebration('Unlocked!','You revealed a cute memory.'); }
  }

  document.querySelectorAll('.photo-slot').forEach(slot=>{
    const answer = (slot.dataset.answer || '').trim().toLowerCase();
    const feedback = slot.querySelector('.puzzle-feedback');

    function checkAnswer(value){
      const clean = (value || '').trim().toLowerCase();
      if(clean === '') return;
      if(clean === answer){
        feedback.textContent = 'Unlocked! 🎉';
        feedback.classList.add('correct');
        unlockSlot(slot);
      } else {
        feedback.textContent = 'Try again';
        feedback.classList.remove('correct');
      }
    }

    const input = slot.querySelector('.puzzle-input');
    const submitBtn = slot.querySelector('.puzzle-submit');
    if(input && submitBtn){
      submitBtn.addEventListener('click', ()=>checkAnswer(input.value));
      input.addEventListener('keydown', (e)=>{
        if(e.key === 'Enter'){ e.preventDefault(); checkAnswer(input.value); }
      });
    }

    slot.querySelectorAll('.choice-btn').forEach(btn=>{
      btn.addEventListener('click', ()=>checkAnswer(btn.dataset.val));
    });
  });

  // ---------------- Scroll reveal ----------------
  const reveals = document.querySelectorAll('.reveal');
  reveals.forEach(el => el.classList.add('in'));

  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){ entry.target.classList.add('in'); }
    });
  }, { threshold: 0.15 });
  reveals.forEach(el=>observer.observe(el));

  // ---------------- ANTI-GRAVITY CANVA & HUG ANIMATION ----------------
  const agCanvas = document.getElementById('anti-gravity-canvas');
  const triggerHugBtn = document.getElementById('triggerHugBtn');
  const characterStage = document.getElementById('characterStage');

  if (agCanvas) {
    const agCtx = agCanvas.getContext('2d');
    let agWidth, agHeight;

    function resizeAGCanvas() {
      const parent = agCanvas.parentElement;
      agWidth = agCanvas.width = parent.clientWidth;
      agHeight = agCanvas.height = parent.clientHeight;
    }
    resizeAGCanvas();
    window.addEventListener('resize', resizeAGCanvas);

    let agParticles = [];
    let isHeartFormed = false;

    // Generate heart target points
    function getHeartTargets(numPoints) {
      const targets = [];
      const centerX = agWidth / 2;
      const centerY = agHeight / 2 - 20;
      const scale = Math.min(agWidth, agHeight) / 32;

      for (let i = 0; i < numPoints; i++) {
        const t = (i / numPoints) * Math.PI * 2;
        // Parametric equation for a heart
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        targets.push({
          x: centerX + x * scale,
          y: centerY + y * scale
        });
      }
      return targets;
    }

    class AGParticle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * agWidth;
        this.y = agHeight + Math.random() * 50;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = -(1 + Math.random() * 2.5); // Anti-gravity upward velocity
        this.radius = 2 + Math.random() * 3.5;
        this.color = ['#FF6B81', '#FFB347', '#FF9E9E', '#FFF2CC', '#E0C3FC'][Math.floor(Math.random() * 5)];
        this.alpha = 0.3 + Math.random() * 0.7;
        this.targetX = null;
        this.targetY = null;
      }

      update() {
        if (isHeartFormed && this.targetX !== null) {
          // Attract towards heart target coordinate
          const dx = this.targetX - this.x;
          const dy = this.targetY - this.y;
          this.vx += dx * 0.015;
          this.vy += dy * 0.015;
          this.vx *= 0.88;
          this.vy *= 0.88;
          this.x += this.vx;
          this.y += this.vy;
        } else {
          // Natural anti-gravity upward movement
          this.x += this.vx;
          this.y += this.vy; // Floating UPWARDS against gravity!

          if (this.y < -20) {
            this.reset();
          }
        }
      }

      draw() {
        agCtx.save();
        agCtx.globalAlpha = this.alpha;
        agCtx.fillStyle = this.color;
        agCtx.shadowBlur = 10;
        agCtx.shadowColor = this.color;
        agCtx.beginPath();
        agCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        agCtx.fill();
        agCtx.restore();
      }
    }

    // Initialize 160 anti-gravity particles
    for (let i = 0; i < 160; i++) {
      agParticles.push(new AGParticle());
    }

    function renderAG() {
      agCtx.clearRect(0, 0, agWidth, agHeight);

      // Draw anti-gravity particles
      agParticles.forEach(p => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(renderAG);
    }

    renderAG();

    const loveTextBanner = document.getElementById('loveTextBanner');

    // Trigger Magic Hug Sequence
    if (triggerHugBtn && characterStage) {
      triggerHugBtn.addEventListener('click', () => {
        // Step 1: Reset & start walking
        if (loveTextBanner) loveTextBanner.classList.remove('visible');
        characterStage.classList.remove('hugged');
        characterStage.classList.add('walking');
        triggerHugBtn.disabled = true;
        triggerHugBtn.textContent = '💖 Walking together...';

        // Step 2: Characters embrace into a hug after 1.5 seconds
        setTimeout(() => {
          characterStage.classList.remove('walking');
          characterStage.classList.add('hugged');
          triggerHugBtn.textContent = '✨ Magic Heart Burst! ✨';

          // Step 3: Anti-gravity particle heart formation
          isHeartFormed = true;
          const targets = getHeartTargets(agParticles.length);
          agParticles.forEach((p, idx) => {
            if (targets[idx]) {
              p.targetX = targets[idx].x;
              p.targetY = targets[idx].y;
            }
          });

          // Show large glowing "I LOVE YOU ❤️" text above the button
          if (loveTextBanner) {
            loveTextBanner.classList.add('visible');
          }

          // Also trigger window confetti burst
            spawnConfetti(120);
            spawnFireworks(window.innerWidth/2, window.innerHeight/3, 80);
            if(typeof playHugSound === 'function') playHugSound();

          // Keep text visible for 6.5 seconds before fading out and enabling replay
          setTimeout(() => {
            if (loveTextBanner) loveTextBanner.classList.remove('visible');
            triggerHugBtn.disabled = false;
            triggerHugBtn.textContent = '✨ Replay Magic Hug ✨';
          }, 6500);
        }, 1600);
      });
    }
  }

  setTimeout(()=>spawnConfetti(40), 1200);
  // ---------------- WebAudio simple effects ----------------
  let audioCtx;
  function ensureAudio(){ if(!audioCtx){ audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } }
  function playTone(freq, when=0, type='sine', duration=0.12, gain=0.08){ ensureAudio(); const o = audioCtx.createOscillator(); const g = audioCtx.createGain(); o.type = type; o.frequency.value = freq; g.gain.value = gain; o.connect(g); g.connect(audioCtx.destination); o.start(audioCtx.currentTime + when); o.stop(audioCtx.currentTime + when + duration); }
  function playUnlockSound(){ try{ playTone(880,0,'sawtooth',0.08,0.06); playTone(1320,0.06,'sine',0.18,0.05);}catch(e){} }
  function playHugSound(){ try{ playTone(440,0,'sine',0.12,0.08); playTone(660,0.12,'sine',0.18,0.06); }catch(e){} }
});
