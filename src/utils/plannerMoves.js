import {capacity} from './planner';
import {localDate} from './workload';
const minutes=s=>{const [h,m]=s.split(':').map(Number);return h*60+m};
const time=n=>`${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`;
const stamp=b=>`${b.date}T${b.start}`;
export function moveSession(plan,prefs,tasks,source,date,start){
 if(!plan||plan.errors?.length)return {error:'Generate a valid plan before moving sessions.'};
 const day=capacity(prefs).days.find(d=>d.date===date);
 if(!day)return {error:'Choose one of your configured working days this week.'};
 const task=tasks.find(t=>t.id===source.taskId);
 if(!task||task.status==='Completed')return {error:'This task is no longer open. Generate a fresh plan.'};
 if(date>task.deadline)return {error:`${task.name} is due ${task.deadline}. Choose an earlier slot or renegotiate its deadline.`};
 const old=source.blockId?plan.blocks.find(b=>b.id===source.blockId&&b.type==='task'):null;
 const pending=plan.unscheduled.find(x=>x.task.id===task.id);
 if(source.blockId&&(!old||old.taskId!==task.id))return {error:'This session is no longer in the plan.'};
 if(!source.blockId&&(!pending||pending.remaining<=0))return {error:'There is no unscheduled effort left for this task.'};
 const length=old?minutes(old.end)-minutes(old.start):Math.min(pending.remaining,Math.max(15,Number(prefs.focus)||60));
 if(!Number.isFinite(length)||length<15)return {error:'This session is too short to place. Update the task estimate.'};
 const from=minutes(start),to=from+length;if(date===localDate()&&from<Math.ceil((new Date().getHours()*60+new Date().getMinutes())/15)*15)return {error:'Choose a future time today.'};
 if(from<day.from||to>day.to)return {error:'This session would fall outside your configured work hours.'};
 const other=plan.blocks.filter(b=>b.id!==old?.id&&b.date===date);
 const clash=other.find(b=>from<minutes(b.end)&&to>minutes(b.start));
 if(clash)return {error:`That time overlaps ${clash.title}. Try another open slot.`};
 const nextBlock={...(old||{}),id:old?.id||`manual-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,date,start,end:time(to),type:'task',taskId:task.id,title:task.name,importance:task.importance};
 const blocks=[...plan.blocks.filter(b=>b.id!==old?.id),nextBlock].sort((a,b)=>stamp(a).localeCompare(stamp(b)));
 const unscheduled=old?plan.unscheduled:plan.unscheduled.map(x=>x.task.id===task.id?{...x,remaining:x.remaining-length}:x).filter(x=>x.remaining>0);
 for(const t of tasks.filter(x=>x.status!=='Completed'&&x.dependency)){
  const predecessor=tasks.find(x=>x.id===t.dependency);
  if(!predecessor||predecessor.status==='Completed')continue;
  const first=blocks.filter(b=>b.taskId===t.id).sort((a,b)=>stamp(a).localeCompare(stamp(b)))[0];
  if(!first)continue;
  const predecessorBlocks=blocks.filter(b=>b.taskId===predecessor.id);
  const last=predecessorBlocks.sort((a,b)=>stamp(b).localeCompare(stamp(a)))[0];
  if(!last||unscheduled.some(x=>x.task.id===predecessor.id)||`${last.date}T${last.end}`>stamp(first))return {error:`Finish ${predecessor.name} before scheduling ${t.name}.`};
 }
 return {plan:{...plan,blocks,unscheduled,risks:unscheduled.map(x=>x.task.name)}};
}
export function unplanSession(plan,blockId,tasks){const block=plan?.blocks.find(b=>b.id===blockId&&b.type==='task');if(!block)return {error:'Session not found.'};const task=tasks.find(t=>t.id===block.taskId);if(!task)return {error:'Task not found.'};if(tasks.some(t=>t.status!=='Completed'&&t.dependency===task.id&&plan.blocks.some(b=>b.taskId===t.id)))return {error:'Move dependent sessions off the schedule before unplanning this one.'};const amount=minutes(block.end)-minutes(block.start),existing=plan.unscheduled.find(x=>x.task.id===task.id);return {plan:{...plan,blocks:plan.blocks.filter(b=>b.id!==blockId),unscheduled:existing?plan.unscheduled.map(x=>x.task.id===task.id?{...x,remaining:x.remaining+amount}:x):[...plan.unscheduled,{task,remaining:amount,reason:'Moved to unscheduled work.'}],risks:[...new Set([...plan.risks,task.name])]}}}
