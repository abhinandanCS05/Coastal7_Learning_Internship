import{useEffect}from"react";

export function Modal({open,onClose,title,children}){
  useEffect(()=>{
    const f=e=>{
      if(e.key==="Escape")onClose();
    };

    if(open)addEventListener("keydown",f);

    return()=>removeEventListener("keydown",f);
  },[open,onClose]);

  if(!open)return null;

  return(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="flex w-full max-w-3xl max-h-[90vh] flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl dark:bg-slate-900"
      >

        <div className="flex shrink-0 items-center justify-between border-b px-6 py-5">
          <h2 className="text-xl font-black">
            {title}
          </h2>

          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-xl px-2 text-2xl transition hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            ×
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
          {children}
        </div>

      </div>
    </div>
  );
}

export function Toast({message,onClose}){
  useEffect(()=>{
    if(message){
      let t=setTimeout(onClose,3000);
      return()=>clearTimeout(t);
    }
  },[message,onClose]);

  return message?(
    <div className="fixed bottom-5 right-5 z-[60] rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-xl">
      {message}
    </div>
  ):null;
}
