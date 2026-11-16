
const DEST = [
  {id:"cox",name:"Cox’s Bazar",tag:"Beach",blurb:"Longest sea beach, family stays, seafood, easy domestic dates.",perDay:4500,image:"https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=720&q=60&fm=webp",moods:["beach","family","budget"]},
  {id:"dubai",name:"Dubai",tag:"City",blurb:"Desert, malls, landmarks, and a polished city break.",perDay:18000,image:"https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=720&q=60&fm=webp",moods:["city","luxury","family"]},
  {id:"thai",name:"Thailand",tag:"Honeymoon",blurb:"Islands, street food, and couple-friendly resorts.",perDay:12000,image:"https://images.unsplash.com/photo-1504214208698-ea1916a2195a?auto=format&fit=crop&w=720&q=60&fm=webp",moods:["beach","honeymoon","budget"]},
  {id:"maldives",name:"Maldives",tag:"Luxury",blurb:"Overwater stays and a quiet, high-end escape.",perDay:32000,image:"https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=720&q=60&fm=webp",moods:["beach","luxury","honeymoon"]},
  {id:"nepal",name:"Nepal",tag:"Adventure",blurb:"Hills, short treks, and a mountain reset.",perDay:7000,image:"https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=720&q=60&fm=webp",moods:["mountain","adventure","budget"]},
  {id:"umrah",name:"Umrah",tag:"Spiritual",blurb:"Flights, stay near the Haram, and a guided plan.",perDay:15000,image:"https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&w=720&q=60&fm=webp",moods:["holy","family"]}
];
const MULT = {Budget:0.85,Comfort:1,Luxury:1.55};
const MOODS = [["beach","Beach"],["city","City"],["mountain","Mountains"],["holy","Umrah"],["honeymoon","Honeymoon"],["family","Family"]];
const bdt = (n) => new Intl.NumberFormat("en-BD",{style:"currency",currency:"BDT",maximumFractionDigits:0}).format(n);
const destSel = document.getElementById("dest");
DEST.forEach(d => { const o=document.createElement("option"); o.value=d.id; o.textContent=d.name; destSel.appendChild(o); });
let mood = "beach";
const year = document.getElementById("year"); if (year) year.textContent = new Date().getFullYear();
function current(){
  const dest = DEST.find(d=>d.id===destSel.value)||DEST[0];
  const people = Number(document.getElementById("people").value)||1;
  const days = Number(document.getElementById("days").value)||2;
  const style = document.getElementById("style").value;
  const mid = Math.round(dest.perDay*people*days*(MULT[style]||1));
  return {dest,people,days,style,low:Math.round(mid*0.9),high:Math.round(mid*1.15)};
}
function paintQuote(){
  const q = current();
  document.getElementById("qLabel").textContent = "Estimated range for "+q.dest.name;
  document.getElementById("qPrice").textContent = bdt(q.low)+" – "+bdt(q.high);
  document.getElementById("qMeta").textContent = q.people+" travelers · "+q.days+" days · "+q.style;
}
function lock(name, extra){
  document.getElementById("destField").value = name;
  document.getElementById("msgField").value = extra;
  document.getElementById("pickedLabel").textContent = name;
  document.getElementById("inquiry").scrollIntoView({behavior:"smooth"});
}
["dest","people","days","style"].forEach(id=>document.getElementById(id).addEventListener("input", paintQuote));
document.getElementById("useQuote").onclick = () => {
  const q = current();
  lock(q.dest.name, q.people+" travelers, "+q.days+" days, "+q.style+". Quote range "+bdt(q.low)+" to "+bdt(q.high)+".");
};
const cards = document.getElementById("cards");
DEST.forEach(d=>{
  const el=document.createElement("article"); el.className="card";
  el.innerHTML = `<img src="${d.image}" alt="${d.name}" width="720" height="420" loading="lazy"><div><p class="tag">${d.tag}</p><h3>${d.name}</h3><p class="muted">${d.blurb}</p><p><strong>From ${bdt(d.perDay)} / person / day</strong></p><button class="btn" type="button">Request this plan</button></div>`;
  el.querySelector("button").onclick=()=>{ destSel.value=d.id; paintQuote(); lock(d.name, "Interested in the "+d.name+" "+d.tag.toLowerCase()+" plan."); };
  cards.appendChild(el);
});
const moodsEl=document.getElementById("moods"), matches=document.getElementById("matches");
function paintMoods(){
  moodsEl.innerHTML=""; matches.innerHTML="";
  MOODS.forEach(([id,label])=>{
    const b=document.createElement("button"); b.type="button"; b.textContent=label; if(id===mood) b.className="on";
    b.onclick=()=>{mood=id; paintMoods();}; moodsEl.appendChild(b);
  });
  DEST.filter(d=>d.moods.includes(mood)).forEach(d=>{
    const b=document.createElement("button"); b.type="button"; b.className="pick";
    b.innerHTML=`<strong>${d.name}</strong><p class="muted">${d.blurb}</p><p><strong>Plan this →</strong></p>`;
    b.onclick=()=>{destSel.value=d.id; paintQuote(); lock(d.name, "Matched from mood: "+mood+".");};
    matches.appendChild(b);
  });
}
paintMoods(); paintQuote();
const menuBtn=document.getElementById("menuBtn"), mobile=document.getElementById("mobile");
menuBtn.onclick=()=>mobile.classList.toggle("open");
mobile.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>mobile.classList.remove("open")));
