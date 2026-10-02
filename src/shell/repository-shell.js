(()=>{
  const title=document.title.replace(/\s*[—–-].*$/,"").trim()||"Repository";
  const style=document.createElement("style");
  style.textContent=`
    #repository-status{position:fixed;z-index:90;left:max(.7rem,env(safe-area-inset-left));top:max(.7rem,env(safe-area-inset-top));padding:.45rem .6rem;border:1px solid #77736b40;border-radius:.45rem;background:#e7e2d8df;color:#4d4d49;font:11px/1.25 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.02em;pointer-events:none;box-shadow:0 3px 12px #5a514314;backdrop-filter:blur(4px)}
    #repository-status strong{display:block;margin-bottom:.18rem;color:#292b2c;font:600 11px/1.2 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;letter-spacing:.11em;text-transform:uppercase}
    #repository-devtools{position:fixed;z-index:90;left:50%;bottom:max(.6rem,env(safe-area-inset-bottom));transform:translateX(-50%);display:none;grid-auto-flow:column;gap:.28rem;padding:.28rem;border:1px solid #77736b45;border-radius:.5rem;background:#e7e2d8e8;box-shadow:0 3px 14px #5a514318;backdrop-filter:blur(5px)}
    #repository-devtools.active{display:grid}
    #repository-devtools button{box-sizing:border-box;width:2.65rem;height:2.65rem;min-height:0;padding:0;border:1px solid #77736b55;border-radius:.45rem;background:#d9d6cf;color:#343638;font:1rem/1 ui-monospace,monospace}
    #repository-devtools button.active{outline:1px solid #555;background:#cbc7be}
  `;
  document.head.append(style);

  const status=document.createElement("output");
  status.id="repository-status";
  const heading=document.createElement("strong");
  heading.textContent=title;
  const readout=document.createElement("span");
  readout.textContent=`${globalThis.__REPOSITORY_BUILD__||"local"} • fps …`;
  status.append(heading,readout);
  document.body.append(status);

  const tools=document.createElement("div");
  tools.id="repository-devtools";
  tools.setAttribute("aria-label","Repository developer tools");
  document.body.append(tools);

  let fps=0,frames=0,stamp=performance.now();
  function sample(now){
    frames++;
    if(now-stamp>=500){
      fps=Math.round(frames*1000/(now-stamp));
      readout.textContent=`${globalThis.__REPOSITORY_BUILD__||"local"} • fps ${fps}`;
      frames=0;stamp=now;
    }
    requestAnimationFrame(sample);
  }
  requestAnimationFrame(sample);

  const registered=new Map();
  function registerTool({id,text,label,onClick,active=false}){
    if(!id||registered.has(id))throw new Error(`Repository dev tool already registered: ${id}`);
    const button=document.createElement("button");
    button.type="button";
    button.textContent=text||"•";
    button.setAttribute("aria-label",label||id);
    button.classList.toggle("active",!!active);
    button.addEventListener("click",()=>onClick?.(button));
    registered.set(id,button);
    tools.append(button);
    tools.classList.add("active");
    return button;
  }
  function removeTool(id){
    registered.get(id)?.remove();
    registered.delete(id);
    tools.classList.toggle("active",registered.size>0);
  }

  globalThis.RepositoryShell={
    title,
    build:globalThis.__REPOSITORY_BUILD__,
    status,
    devtools:tools,
    registerTool,
    removeTool,
    inspect:()=>({title,build:globalThis.__REPOSITORY_BUILD__,fps,tools:[...registered.keys()]})
  };
})();