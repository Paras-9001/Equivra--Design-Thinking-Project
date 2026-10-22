import { addDays, format } from 'date-fns';
const date = n => format(addDays(new Date(),n),'yyyy-MM-dd');
// All contact details, institutions, locations and reviews below are fictional demo content.
const sessionCatalog=[
 [['Quick Consultation',30,500,'Online','A brief introduction focused on one concern.'],['Standard Consultation',60,1000,'Both','A longer workplace stress conversation.'],['Extended Consultation',120,1800,'In-person','More time for an in-depth discussion.']],
 [['Burnout Check-in',30,650,'Online','Explore immediate pressures.'],['Burnout Support',60,1400,'Both','A focused conversation on recovery and boundaries.']],
 [['Anxiety Consultation',45,1100,'Online','Discuss concerns at a comfortable pace.'],['Extended Support',90,2000,'Both','Additional time for a detailed conversation.']],
 [['Balance Check-in',30,600,'Online','Review a current work-life challenge.'],['Work-Life Session',60,1200,'In-person','Explore boundaries and routines.']],
 [['Gentle Yoga',45,850,'In-person','Guided movement at a comfortable pace.'],['Extended Yoga',75,1300,'In-person','Longer movement and relaxation practice.']],
 [['Meditation Introduction',30,500,'Online','Learn a short guided practice.'],['Mindfulness Practice',60,750,'Online','A longer guided session.']],
 [['Mindfulness Check-in',30,550,'Online','Explore a simple daily practice.'],['Stress Awareness',60,950,'Online','Guided awareness exercises.']],
 [['Desk Yoga',30,450,'Online','Movement for a work break.'],['Gentle Movement',60,700,'Both','A full gentle movement session.']]
];
const demoLocations=[
 {id:'loc-a',name:'Equivra Example Practice',building:'2nd Floor, Harmony Plaza',area:'Example Nagar',city:'Pune',state:'Maharashtra',pin:'411045'},
 {id:'loc-b',name:'Equivra Demo Studio',building:'Suite 4, Sample House',area:'Model Colony',city:'Pune',state:'Maharashtra',pin:'411016'}
];
const degrees=[
 [['M.Phil. Clinical Psychology','Clinical psychology',2016]],
 [['M.A. Counselling Psychology','Counselling psychology',2018]],
 [['Psy.D. Psychology','Psychology',2014]],
 [['M.Sc. Counselling','Counselling',2019]],
 [['RYT 500 Training','Yoga instruction',2017]],
 [['Meditation Teacher Training','Meditation',2020]],
 [['MBSR Facilitator Training','Mindfulness',2018]],
 [['RYT 200 Training','Yoga instruction',2021]]
];
const demoReviews=[
 [{id:'rv-1',rating:5,date:'2026-08-12',sessionName:'Standard Consultation',text:'The conversation gave me space to reflect on my workday.'},{id:'rv-2',rating:4,date:'2026-07-04',sessionName:'Quick Consultation',text:'A thoughtful introduction and practical next steps.'}],
 [{id:'rv-3',rating:5,date:'2026-06-19',sessionName:'Burnout Support',text:'I appreciated the calm pace of the session.'}],
 [{id:'rv-4',rating:4,date:'2026-09-01',sessionName:'Anxiety Consultation',text:'The discussion was clear and supportive.'}],
 [{id:'rv-5',rating:5,date:'2026-05-22',sessionName:'Work-Life Session',text:'Helpful ideas for setting boundaries.'}],
 [{id:'rv-6',rating:5,date:'2026-08-20',sessionName:'Gentle Yoga',text:'A gentle practice that felt accessible.'}],
 [{id:'rv-7',rating:4,date:'2026-07-18',sessionName:'Meditation Introduction',text:'An easy way to begin practicing.'}],
 [{id:'rv-8',rating:5,date:'2026-06-11',sessionName:'Stress Awareness',text:'The exercises were easy to follow.'}],
 [{id:'rv-9',rating:4,date:'2026-08-03',sessionName:'Desk Yoga',text:'Useful movements for a desk break.'}]
];
export const seed = {
 user:{name:'Alex Morgan',role:'Product designer',cursor:true,motion:true,notifications:true,privacy:true},
 activeProfessionalId:'pr1',
 professional:{name:'Dr. Mira Shah',category:'Psychologist',qualifications:'M.Phil. Clinical Psychology',specialization:'Workplace stress',experience:'9 years',languages:'English, Hindi',bio:'I support professionals as they navigate demanding work environments.',services:'Individual support session',fee:1800,cursor:true,motion:true},
 prefs:{days:[1,2,3,4,5],start:'09:00',end:'17:30',lunch:45,breaks:30,buffer:30,focus:60,meetings:[{id:'m1',title:'Team sync',day:1,start:'10:30',end:'11:00'},{id:'m2',title:'Project review',day:3,start:'14:00',end:'15:00'}]},
 tasks:[
  ['Client renewal presentation',2,3.5,'Critical','In Progress','Client Success','Shape the story, validate figures, and rehearse the proposal with the account team.',''],
  ['Investigate checkout incident',0,2,'Critical','Not Started','Production','Triage the intermittent payment errors and coordinate a safe fix with engineering.',''],
  ['Review launch copy for approval',1,1.5,'High','Not Started','Product Launch','Collect final stakeholder feedback and request sign-off on the revised copy.',''],
  ['Implement approved copy changes',3,2,'High','Not Started','Product Launch','Apply the approved wording across onboarding screens after the review is complete.','t3'],
  ['Prepare Tuesday team sync',1,1,'Medium','Not Started','Team','Outline blockers, decisions needed, and owners before the weekly discussion.',''],
  ['Build accessibility remediation plan',8,7,'High','Not Started','Product','Audit priority journeys and break the remediation plan into reviewable milestones.',''],
  ['Reconcile travel reimbursements',12,1,'Low','Not Started','Administration','Check receipts and submit the monthly expense form when capacity permits.',''],
  ['Document API handoff decisions',5,3,'High','Not Started','Platform','Record integration assumptions, ownership, and error handling for the receiving team.',''],
  ['Respond to urgent customer escalation',1,1.5,'Critical','Not Started','Customer Support','Gather the timeline and propose a clear next update for the affected customer.',''],
  ['Follow up on usability interviews',6,1.5,'Medium','Not Started','Research','Summarize open questions and send a concise follow-up to the research team.',''],
  ['Explore next-quarter research themes',18,2.5,'Low','Not Started','Strategy','Collect potential discovery themes without displacing this week’s commitments.',''],
  ['Turn around finance data request',0,4,'High','Not Started','Operations','Verify the requested numbers and clarify whether the same-day deadline is feasible.','']
 ].map((a,i)=>({id:`t${i+1}`,name:a[0],deadline:date(a[1]),duration:a[2],importance:a[3],status:a[4],project:a[5],description:a[6],dependency:a[7],adjustment:0,progressHours:0})),
 posts:[['QuietKoala','Work Pressure','How do you set boundaries when every request is marked urgent?','I am trying to make room for focused work without feeling guilty about saying no. What has helped you?'],['CalmOtter','Small Wins','A small win: I took my lunch break today','It felt surprisingly restorative to step away from the screen.'],['HopefulPanda','Deadline Stress','I asked my manager to revisit a deadline','We mapped the actual effort together and moved one deliverable. It was a good conversation.'],['SunriseFox','Work-Life Balance','Closing my laptop at a consistent time','I have started writing tomorrow’s priorities before I log off.'],['QuietKoala','Workplace Relationships','How do you prepare for a difficult conversation?','I would love practical ways to keep it constructive.'],['CalmOtter','Career Anxiety','Feeling behind my peers','Sometimes comparison makes it hard to see my own progress.'],['HopefulPanda','Funny Office Moments','The meeting that could have been a sentence','We spent 30 minutes agreeing to send an email. I had to laugh.'],['SunriseFox','General Discussion','What is one thing making work lighter this week?','For me it was blocking quiet focus time on my calendar.'],['QuietKoala','Work Pressure','Too many competing priorities','How do you decide what to renegotiate first?'],['CalmOtter','Small Wins','A teammate noticed my effort','A kind note made a difficult week feel a little easier.']].map((a,i)=>({id:`p${i+1}`,author:a[0],topic:a[1],title:a[2],body:a[3],likes:i+2,comments:[],bookmarked:false,liked:false,own:false})),
 providers:[['Dr. Mira Shah','Psychologist','M.Phil. Clinical Psychology','Workplace stress','English, Hindi',1800,9,'Online, In-person'],['Dr. Arjun Mehta','Counsellor','M.A. Counselling Psychology','Burnout support','English, Hindi',1400,7,'Online'],['Dr. Nisha Rao','Psychologist','Psy.D. Psychology','Anxiety and work','English, Kannada',2000,11,'Online, In-person'],['Priya Nair','Counsellor','M.Sc. Counselling','Work-life balance','English, Malayalam',1200,6,'In-person'],['Ananya Bose','Yoga Instructor','RYT 500','Gentle movement','English, Bengali',850,8,'In-person'],['Kabir Sethi','Meditation Trainer','Certified Meditation Teacher','Mindfulness practice','English, Hindi',750,5,'Online'],['Rhea D’Souza','Mindfulness Instructor','MBSR Facilitator','Stress awareness','English, Marathi',950,7,'Online'],['Dev Malhotra','Yoga Instructor','RYT 200','Desk-friendly yoga','English, Hindi',700,4,'Online, In-person']].map((a,i)=>({id:`pr${i+1}`,name:a[0],category:a[1],qualification:a[2],specialization:a[3],languages:a[4],fee:a[5],experience:a[6],sessionModes:a[7],breakMinutes:0,sessions:sessionCatalog[i].map(([name,duration,price,mode,description],j)=>({id:`s-${i+1}-${j+1}`,name,duration,price,mode,description,active:true})),contact:{phone:`+91 00000 0000${i+1}`,email:`professional${i+1}@equivra.example`,workplace:i<4?'Equivra Example Practice':'Equivra Demo Studio'},locations:a[7].includes('In-person')?(i===0?demoLocations: [demoLocations[i%2]]):[],education:degrees[i].map(([degree,specialization,year])=>({degree,specialization,institution:'Fictional Example Institute',year})),certifications:i<4?['Workplace Stress Management (demo training)']:['Wellness facilitation (demo training)'],training:['Employee well-being awareness (demo training)'],registration:'No licence or registration verified in this prototype',reviews:demoReviews[i],services: ['Psychologist','Counsellor'].includes(a[1])?'Individual support session':'General wellness session',bio:`${a[0]} offers supportive, practical sessions focused on ${a[3].toLowerCase()}. This is a fictional demo profile.`})),
 appointments:[], checkins:[5,6,4,7,5,6,4].map((v,i)=>({id:`c${i}`,date:date(i-6),stress:v,mood:['Okay','Tired','Calm'][i%3],reflection:''})),hours:[7,8,7.5,9,8,0,0].map((h,i)=>({date:date(i-6),hours:h})),availability:[{id:'a1',providerId:'pr1',day:1,start:'10:00',end:'12:00'},{id:'a2',providerId:'pr1',day:3,start:'15:00',end:'17:00'},...Array.from({length:7},(_,i)=>[{id:`a${i+3}x`,providerId:`pr${i+2}`,day:2,start:'10:00',end:'12:00'},{id:`a${i+3}y`,providerId:`pr${i+2}`,day:4,start:'15:00',end:'17:00'}]).flat()]
};
