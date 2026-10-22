import {format} from 'date-fns';
const minutes=s=>{const [h,m]=String(s).split(':').map(Number);return h*60+m};
const clock=n=>`${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`;
const validTime=s=>/^([01]\d|2[0-3]):[0-5]\d$/.test(s);
export const providerFor=data=>data.providers.find(p=>p.id===data.activeProfessionalId)||data.providers[0];
export const activeSessions=p=>(p?.sessions||[]).filter(s=>s.active!==false&&Number.isInteger(Number(s.duration))&&Number(s.duration)>0&&Number.isFinite(Number(s.price))&&Number(s.price)>=0);
export const sessionModes=s=>s?.mode==='Both'?['Online','In-person']:s?.mode==='In-person'?['In-person']:['Online'];
export const publicModes=p=>[...new Set(activeSessions(p).flatMap(sessionModes))];
export const appointmentEnd=a=>validTime(a.time)?clock(minutes(a.time)+Number(a.duration||0)):'';
export function validateSession(session){
 if(!String(session.name||'').trim())return 'Enter a session name.';
 if(!Number.isInteger(Number(session.duration))||Number(session.duration)<5||Number(session.duration)>480)return 'Enter a duration from 5 to 480 minutes.';
 if(session.price===''||session.price===null||!Number.isFinite(Number(session.price))||Number(session.price)<0)return 'Enter a valid non-negative price.';
 if(!['Online','In-person','Both'].includes(session.mode))return 'Choose an online, in-person, or both session mode.';
 return '';
}
export function validateAvailability(data,entry,excludeId){
 if(!data.providers.some(p=>p.id===entry.providerId))return 'Choose a valid demo professional.';
 if(!Number.isInteger(Number(entry.day))||Number(entry.day)<0||Number(entry.day)>6||!validTime(entry.start)||!validTime(entry.end)||entry.end<=entry.start)return 'Choose a valid day and end time after the start time.';
 const provider=data.providers.find(p=>p.id===entry.providerId),minimum=Math.min(...activeSessions(provider).map(s=>Number(s.duration)));
 if(Number.isFinite(minimum)&&minutes(entry.end)-minutes(entry.start)<minimum)return `Allow at least ${minimum} minutes for an active session.`;
 if(data.availability.some(a=>a.id!==excludeId&&a.providerId===entry.providerId&&Number(a.day)===Number(entry.day)&&minutes(entry.start)<minutes(a.end)&&minutes(entry.end)>minutes(a.start)))return 'This window overlaps another availability window.';
 return '';
}
export function bookableSlots(data,providerId,date,now=new Date(),excludeAppointmentId='',options={}){
 const provider=data.providers.find(p=>p.id===providerId),day=new Date(`${date}T12:00:00`);
 if(!provider||!/^\d{4}-\d{2}-\d{2}$/.test(date)||Number.isNaN(day.getTime())||format(day,'yyyy-MM-dd')!==date)return [];
 const session=activeSessions(provider).find(s=>s.id===(options.sessionId||activeSessions(provider)[0]?.id));
 const duration=Number(options.duration||session?.duration);
 if(!Number.isInteger(duration)||duration<5||duration>480)return [];
 const windows=data.availability.filter(a=>a.providerId===providerId&&Number(a.day)===day.getDay()&&validTime(a.start)&&validTime(a.end)&&a.end>a.start);
 const breakMinutes=Math.max(0,Number(provider.breakMinutes)||0),slots=[];
 for(const a of windows){for(let m=minutes(a.start);m+duration<=minutes(a.end);m+=30){
  const time=clock(m),start=new Date(`${date}T${time}:00`);if(start<=now)continue;
  const collision=data.appointments.some(x=>x.id!==excludeAppointmentId&&x.providerId===providerId&&x.date===date&&x.status!=='Cancelled'&&m<minutes(x.time)+Number(x.duration||0)+breakMinutes&&m+duration+breakMinutes>minutes(x.time));
  if(!collision&&!slots.some(s=>s.time===time))slots.push({time,availabilityId:a.id,duration});
 }}return slots.sort((a,b)=>a.time.localeCompare(b.time));
}
export function bookingWithinAvailability(data,appointment){return bookableSlots(data,appointment.providerId,appointment.date,new Date(0),appointment.id,{duration:Number(appointment.duration)}).some(s=>s.time===appointment.time)}
export function affectedBookings(data,entryId,nextEntry){const proposed={...data,availability:nextEntry?data.availability.map(a=>a.id===entryId?nextEntry:a):data.availability.filter(a=>a.id!==entryId)};return data.appointments.filter(a=>a.status==='Upcoming'&&a.availabilityId===entryId&&!bookingWithinAvailability(proposed,a))}
export function bookAppointment(data,{providerId,date,time,sessionId,mode,locationId},now=new Date()){
 const provider=data.providers.find(p=>p.id===providerId),session=activeSessions(provider).find(s=>s.id===(sessionId||activeSessions(provider)[0]?.id));
 if(!provider||!session)return {error:'Choose an available session before booking.'};
 const chosenMode=mode||sessionModes(session)[0];if(!sessionModes(session).includes(chosenMode))return {error:'This session is not offered in that mode.'};
 const locations=provider.locations||[],location=chosenMode==='In-person'?locations.find(l=>l.id===(locationId||locations[0]?.id)):null;
 if(chosenMode==='In-person'&&!location)return {error:'Choose an available demo clinic location.'};
 const slot=bookableSlots(data,providerId,date,now,'',{sessionId:session.id}).find(s=>s.time===time);
 if(!slot)return {error:'That time is no longer available for this session. Choose another slot.'};
 const appointment={id:`ap-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,providerId,provider:provider.name,date,time,duration:Number(session.duration),fee:Number(session.price),sessionId:session.id,sessionName:session.name,mode:chosenMode,location:location?{...location}:null,availabilityId:slot.availabilityId,status:'Upcoming'};
 return {appointments:[...data.appointments,appointment],appointment};
}
export function rescheduleAppointment(data,id,date,time,now=new Date()){
 const old=data.appointments.find(a=>a.id===id);
 if(!old||old.status!=='Upcoming')return {error:'This appointment cannot be rescheduled.'};
 const slot=bookableSlots(data,old.providerId,date,now,id,{duration:Number(old.duration)}).find(s=>s.time===time);
 if(!slot)return {error:'Choose a future time that fits the full session. Your original booking is unchanged.'};
 return {appointments:data.appointments.map(a=>a.id===id?{...a,date,time,availabilityId:slot.availabilityId}:a)};
}
export function cancelAppointment(data,id){const old=data.appointments.find(a=>a.id===id);if(!old||old.status!=='Upcoming')return {error:'This appointment cannot be cancelled.'};return {appointments:data.appointments.map(a=>a.id===id?{...a,status:'Cancelled'}:a)}}
