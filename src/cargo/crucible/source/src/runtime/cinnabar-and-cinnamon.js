export function createCinnabarAndCinnamon(){
  // Turns are immutable scored consequences. Clockchain is terminal state derived
  // from the complete known turn array; appending a turn necessarily moves it.
  const turns=[
    {turn:1,actor:"human",at:0,duration:12000,kind:"raise-dome"},
    {turn:2,actor:"model",at:12000,duration:10000,kind:"unfurl-kite"},
    {turn:3,actor:"human",at:22000,duration:5200,kind:"clockchain-burrow-to-dome"},
    {turn:4,actor:"human",at:27200,duration:6500,kind:"meteorstorm-abates"},
    {turn:5,actor:"human",at:33700,duration:7000,kind:"dome-granular-field"},
    {turn:6,actor:"human",at:40700,duration:9000,kind:"dome-granular-field-intensifies"},
    {turn:7,actor:"human",at:49700,duration:2600,kind:"kite-tether-snaps"},
    {turn:8,actor:"human",at:52300,duration:10000,kind:"distant-brass-spire-rises"},
    {turn:9,actor:"model",at:62300,duration:8000,kind:"paper-flag-on-spire"}
  ];
  // Historical resolutions remain evidence, but only a resolution whose afterTurn
  // equals the current terminal turn may drive the visible Clockchain.
  const clockchain=[
    {afterTurn:2,owner:"human",method:"clockchain-derived",at:22000},
    // Turn 3 resolved Human under the original derivation before Turn 4 was authored.
    // Persist it here so every later Clockchain head contains the same immutable history.
    {afterTurn:3,owner:"human",method:"clockchain-derived",at:27200,seed:4078113516},
    {afterTurn:4,owner:"human",method:"clockchain-derived-v2",at:33700,seed:2729507116},
    {afterTurn:5,owner:"human",method:"clockchain-derived-v2",at:40700,seed:2197232084},
    {afterTurn:6,owner:"human",method:"clockchain-derived-v2",at:49700},
    {afterTurn:7,owner:"human",method:"clockchain-derived-v2",at:52300,seed:1416287156}
  ];
  let origin=null,replays=0,fastForwardTarget=null;
  function update(now){if(origin==null)origin=now;return Math.max(0,now-origin);}
  function replay(){origin=null;fastForwardTarget=null;replays++;}
  function frontier(){return turns.reduce((m,t)=>Math.max(m,t.at+t.duration),0);}
  function terminalTurn(){return turns.reduce((m,t)=>Math.max(m,t.turn),0);}
  function nextTurnStart(fieldNow){for(const t of turns)if(t.at>fieldNow+.5)return t.at;return frontier();}
  function fastForwardTo(target=frontier()){fastForwardTarget=Math.max(0,target);return fastForwardTarget;}
  function consumeFastForward(fieldNow){if(fastForwardTarget==null)return 1;const remaining=fastForwardTarget-fieldNow;if(remaining<=0){fastForwardTarget=null;return 1;}const span=Math.max(0,Math.min(1,remaining/1800));const eased=span*span*(3-2*span);return 1+3*eased;}
  function terminalResolution(){const n=terminalTurn();return clockchain.findLast?.(r=>r.afterTurn===n)??[...clockchain].reverse().find(r=>r.afterTurn===n)??null;}
  function clockchainHead(){return JSON.stringify({turns:turns.map(({turn,actor,at,duration,kind})=>({turn,actor,at,duration,kind})),clockchain:clockchain.map(({afterTurn,owner,method,seed})=>({afterTurn,owner,method,seed}))});}
  function turn(number){return turns.find(entry=>entry.turn===number)??null;}
  function recordResolution(result){const afterTurn=terminalTurn(),existing=terminalResolution();if(existing)return existing;const entry={afterTurn,...result};clockchain.push(entry);return entry;}
  function inspect(now=null){const elapsed=origin==null?0:(now==null?null:Math.max(0,now-origin));return{kind:"cinnabar-and-cinnamon",clock:"simulation",origin,elapsed,replays,frontier:frontier(),terminalTurn:terminalTurn(),fastForwardTarget,clockchainHead:clockchainHead(),turns:turns.map(entry=>({...entry})),rules:{fromTurn:3,initiative:"clockchain-per-turn",clockchain:"terminal-after-all-known-turns"},clockchain:clockchain.map(entry=>({...entry})),terminalResolution:terminalResolution()};}
  return{turns,clockchain,update,replay,turn,recordResolution,terminalResolution,terminalTurn,frontier,nextTurnStart,fastForwardTo,consumeFastForward,clockchainHead,inspect};
}
