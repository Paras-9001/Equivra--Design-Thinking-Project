import {addDays,format,startOfWeek,endOfWeek,parseISO,differenceInCalendarDays} from 'date-fns';
export const localDate=(d=new Date())=>format(d,'yyyy-MM-dd');
export function dateRange(period='next7',now=new Date()){
 const today=new Date(now.getFullYear(),now.getMonth(),now.getDate());
 if(period==='today')return {start:localDate(today),end:localDate(today),label:'Today'};
 if(period==='week')return {start:localDate(startOfWeek(today,{weekStartsOn:1})),end:localDate(endOfWeek(today,{weekStartsOn:1})),label:'This calendar week'};
 if(period==='lastWeek'){const previous=addDays(today,-7);return {start:localDate(startOfWeek(previous,{weekStartsOn:1})),end:localDate(endOfWeek(previous,{weekStartsOn:1})),label:'Last calendar week'};}
 if(period==='last30')return {start:localDate(addDays(today,-29)),end:localDate(today),label:'Last 30 days'};
 return {start:localDate(today),end:localDate(addDays(today,6)),label:'Next seven days'};
}
export function remainingHours(task){if(task.status==='Completed')return 0;const estimate=Number(task.duration),done=Number(task.progressHours)||0;return Number.isFinite(estimate)?Math.max(0,estimate-Math.max(0,done)):0}
export function workloadInRange(tasks,range){const relevant=tasks.filter(t=>t.status!=='Completed'&&t.deadline<=range.end);const required=relevant.reduce((n,t)=>n+remainingHours(t),0);return {tasks:relevant,hours:required,count:relevant.length}}
export function allPendingWork(tasks){return tasks.reduce((n,t)=>n+remainingHours(t),0)}
const minutes=s=>{const [h,m]=String(s).split(':').map(Number);return h*60+m};
export function capacityInRange(prefs,range,now=new Date(),futureOnly=false){
 let total=0;const days=[],conflicts=[],fromDate=parseISO(range.start),toDate=parseISO(range.end);
 for(let date=fromDate;date<=toDate;date=addDays(date,1)){
  const day=date.getDay(),dateKey=localDate(date);if(!prefs.days.includes(day))continue;
  const configuredStart=minutes(prefs.start),end=minutes(prefs.end);
  if(!Number.isFinite(configuredStart)||!Number.isFinite(end)||end<=configuredStart){conflicts.push('Work end must be after start.');continue}
  const nowMinute=now.getHours()*60+now.getMinutes(),start=futureOnly&&dateKey===localDate(now)?Math.min(end,Math.max(configuredStart,Math.ceil(nowMinute/15)*15)):configuredStart;
  let last=configuredStart,meetingMinutes=0;const all=(prefs.meetings||[]).filter(m=>Number(m.day)===day).map(m=>({...m,from:minutes(m.start),to:minutes(m.end)})).sort((a,b)=>a.from-b.from),meetings=[];
  for(const m of all){if(!Number.isFinite(m.from)||!Number.isFinite(m.to)||m.from<configuredStart||m.to>end||m.to<=m.from||m.from<last)conflicts.push(`Conflicting or invalid meeting: ${m.title}`);else if(m.to>start){meetings.push({...m,from:Math.max(start,m.from)});meetingMinutes+=m.to-Math.max(start,m.from)}last=Math.max(last,m.to)}
  const remaining=(value,at)=>{const amount=Math.max(0,Number(value)||0);return futureOnly&&dateKey===localDate(now)?Math.max(0,at+amount-Math.max(start,at)):amount};
  const recoveryParts={lunch:remaining(prefs.lunch,750),breaks:remaining(prefs.breaks,900),buffer:remaining(prefs.buffer,end-Math.max(0,Number(prefs.buffer)||0))};
  const recovery=Object.values(recoveryParts).reduce((n,x)=>n+x,0),available=Math.max(0,end-start-meetingMinutes-recovery);total+=available;days.push({date:dateKey,weekday:day,from:start,to:end,meetings,meetingMinutes,recovery,recoveryParts,available});
 }
 return {minutes:total,hours:total/60,days,conflicts};
}
export function workloadSummary(tasks,prefs,range){const work=workloadInRange(tasks,range),capacity=capacityInRange(prefs,range,new Date(),range.label==='Next seven days');return {...work,capacity,overload:Math.max(0,work.hours-capacity.hours),range}}
export function deadlineRisks(tasks,prefs,range){return workloadInRange(tasks,range).tasks.filter(t=>t.deadline<range.start||remainingHours(t)>capacityInRange(prefs,{start:range.start,end:t.deadline},new Date(),range.label==='Next seven days').hours).map(t=>({id:t.id,name:t.name,deadline:t.deadline,reason:t.deadline<range.start?'Overdue':'Effort exceeds remaining capacity by its deadline'}))}
export function planSignature(tasks,prefs,now=new Date()){return JSON.stringify([localDate(now),tasks,prefs])}
export function planState(data,now=new Date()){const signature=planSignature(data.tasks,data.prefs,now);return {plan:data.plan?.signature===signature?data.plan.result:null,stale:!!data.plan&&data.plan.signature!==signature}}
