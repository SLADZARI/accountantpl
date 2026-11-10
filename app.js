"use strict";
// All entries are synthetic demo fixtures. No accounting or tax computations are performed.
const rows = [
  { id:"demo-001",date:"2026-11-09",name:"Faktura FV/11/01",category:"Usługi",type:"income",amount:12500,counterparty:"Klient demonstracyjny A",reference:"FV/11/01",status:"Opłacono" },
  { id:"demo-002",date:"2026-11-07",name:"Wynajem biura",category:"Lokal",type:"expense",amount:2800,counterparty:"Wynajmujący demo",reference:"DEMO/N/11",status:"Opłacono" },
  { id:"demo-003",date:"2026-11-05",name:"Subskrypcja narzędzi",category:"Oprogramowanie",type:"expense",amount:249,counterparty:"Dostawca demo",reference:"DEMO/S/11",status:"Opłacono" },
  { id:"demo-004",date:"2026-11-03",name:"Faktura FV/11/02",category:"Konsulting",type:"income",amount:7400,counterparty:"Klient demonstracyjny B",reference:"FV/11/02",status:"Opłacono" },
  { id:"demo-005",date:"2026-10-24",name:"Faktura FV/10/03",category:"Usługi",type:"income",amount:11200,counterparty:"Klient demonstracyjny C",reference:"FV/10/03",status:"Opłacono" },
  { id:"demo-006",date:"2026-10-16",name:"Sprzęt biurowy",category:"Wyposażenie",type:"expense",amount:1690,counterparty:"Sklep demonstracyjny",reference:"DEMO/Z/10",status:"Opłacono" },
  { id:"demo-007",date:"2026-10-06",name:"Abonament",category:"Oprogramowanie",type:"expense",amount:249,counterparty:"Dostawca demo",reference:"DEMO/S/10",status:"Opłacono" },
  { id:"demo-008",date:"2026-09-20",name:"Faktura FV/09/01",category:"Konsulting",type:"income",amount:9800,counterparty:"Klient demonstracyjny D",reference:"FV/09/01",status:"Opłacono" },
  { id:"demo-009",date:"2026-09-11",name:"Koszty operacyjne",category:"Operacyjne",type:"expense",amount:3100,counterparty:"Dostawca demo",reference:"DEMO/K/09",status:"Opłacono" }
];
const format = n => new Intl.NumberFormat("pl-PL",{style:"currency",currency:"PLN",maximumFractionDigits:2}).format(n);
const dateLabel = s => new Intl.DateTimeFormat("pl-PL",{day:"2-digit",month:"short",year:"numeric",timeZone:"UTC"}).format(new Date(s+"T12:00:00Z"));
const monthLabel = (y,m) => new Intl.DateTimeFormat("pl-PL",{month:"long",year:"numeric",timeZone:"UTC"}).format(new Date(Date.UTC(y,m,1)));
let year=2026, month=10, filter="all", search="", openId=null, activeView="overview";
const el=id=>document.getElementById(id);
const monthRows=()=>rows.filter(r=>{const [y,m]=r.date.split("-").map(Number);return y===year&&m===month+1});
const visibleRows=()=>monthRows().filter(r=>(filter==="all"||r.type===filter)&&[r.name,r.category,r.counterparty,r.reference].some(s=>s.toLocaleLowerCase("pl").includes(search)));
function render(){
  const current=monthRows();
  const income=current.filter(r=>r.type==="income").reduce((n,r)=>n+r.amount,0);
  const expenses=current.filter(r=>r.type==="expense").reduce((n,r)=>n+r.amount,0);
  el("month-name").textContent=monthLabel(year,month);
  el("prev-label").textContent=monthLabel(year,month-1);
  el("next-label").textContent=monthLabel(year,month+1);
  el("income").textContent=format(income);
  el("expenses").textContent=format(expenses);
  el("balance").textContent=format(income-expenses);
  const list=el("transactions");list.replaceChildren();
  for(const r of visibleRows()){
    const row=document.createElement("button");row.type="button";row.className="tx-row";row.setAttribute("aria-expanded",String(openId===r.id));row.setAttribute("aria-controls","detail-"+r.id);
    const cell=(cls,value)=>{const e=document.createElement("span");e.className=cls;e.textContent=value;return e};
    const name=document.createElement("span");name.className="tx-name";
    const icon=cell("tx-icon",r.type==="income"?"↙":"↗");icon.setAttribute("aria-hidden","true");name.append(icon,cell("tx-name-text",r.name));
    row.append(name,cell("tx-category",r.category),cell("tx-date",dateLabel(r.date)),cell("tx-amount "+(r.type==="income"?"positive":"negative"),(r.type==="income"?"+":"−")+format(r.amount)));
    row.addEventListener("click",()=>{openId=openId===r.id?null:r.id;render()});list.append(row);
    if(openId===r.id){const detail=document.createElement("div");detail.className="tx-detail";detail.id="detail-"+r.id;for(const [label,value] of [["Kontrahent",r.counterparty],["Numer dokumentu",r.reference],["Status",r.status]]){const box=document.createElement("div");const strong=document.createElement("strong");strong.textContent=label;box.append(strong,document.createTextNode(value));detail.append(box)}list.append(detail)}
  }
  if(!visibleRows().length){const empty=document.createElement("div");empty.className="empty";empty.textContent="Brak operacji dla wybranego okresu lub filtrów.";list.append(empty)}
  el("result-count").textContent=visibleRows().length+" operacji";
}
function moveMonth(delta){const next=new Date(Date.UTC(year,month+delta,1));year=next.getUTCFullYear();month=next.getUTCMonth();openId=null;render()}
el("prev-month").addEventListener("click",()=>moveMonth(-1));
el("next-month").addEventListener("click",()=>moveMonth(1));
el("search").addEventListener("input",e=>{search=e.target.value.trim().toLocaleLowerCase("pl");openId=null;render()});
el("type-filter").addEventListener("change",e=>{filter=e.target.value;openId=null;render()});
el("theme-toggle").addEventListener("click",()=>{document.documentElement.classList.toggle("dark");const dark=document.documentElement.classList.contains("dark");el("theme-toggle").setAttribute("aria-pressed",String(dark));try{localStorage.setItem("accountantpl-theme",dark?"dark":"light")}catch{}});
try{if(localStorage.getItem("accountantpl-theme")==="dark")document.documentElement.classList.add("dark")}catch{}
el("theme-toggle").setAttribute("aria-pressed",String(document.documentElement.classList.contains("dark")));
document.querySelectorAll("[data-view]").forEach(btn=>btn.addEventListener("click",()=>{activeView=btn.dataset.view;document.querySelectorAll("[data-view]").forEach(b=>{const selected=b===btn;b.classList.toggle("active",selected);if(selected)b.setAttribute("aria-current","page");else b.removeAttribute("aria-current")});const names={overview:"Przegląd",transactions:"Operacje",reports:"Raporty"};el("section-label").textContent=names[activeView];el("page-title").textContent=activeView==="reports"?"Raport miesięczny":activeView==="transactions"?"Operacje finansowe":"Przegląd finansów";el("ledger-title").textContent=activeView==="reports"?"Zestawienie operacji":"Operacje";el("main").focus()}));
el("main").setAttribute("tabindex","-1");
el("export-btn").addEventListener("click",()=>{
 const header=["Data","Operacja","Kategoria","Typ","Kwota PLN","Kontrahent","Numer dokumentu"];
 const escapeCSV=s=>'"'+String(s).replaceAll('"','""')+'"';
 const csv="\uFEFF"+[header,...visibleRows().map(r=>[r.date,r.name,r.category,r.type,r.type==="expense"?-r.amount:r.amount,r.counterparty,r.reference])].map(a=>a.map(escapeCSV).join(";")).join("\r\n");
 const blob=new Blob([csv],{type:"text/csv;charset=utf-8"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="accountantpl-demo-"+year+"-"+String(month+1).padStart(2,"0")+".csv";document.body.append(a);a.click();a.remove();URL.revokeObjectURL(url)
});
render();