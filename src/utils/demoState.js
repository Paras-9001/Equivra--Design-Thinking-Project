const clone=value=>JSON.parse(JSON.stringify(value));
export function hydrateDemo(saved,seed){
 if(!saved||!Array.isArray(saved.tasks)||!saved.prefs)return clone(seed);
 const next={...clone(seed),...saved};next.activeProfessionalId=saved.activeProfessionalId||seed.activeProfessionalId;
 next.providers=(Array.isArray(saved.providers)?saved.providers:clone(seed.providers)).map(p=>{const base=seed.providers.find(x=>x.id===p.id)||{};return {...base,...p,sessions:Array.isArray(p.sessions)?p.sessions:clone(base.sessions||[]),education:Array.isArray(p.education)?p.education:clone(base.education||[]),reviews:Array.isArray(p.reviews)?p.reviews:clone(base.reviews||[]),locations:Array.isArray(p.locations)?p.locations:clone(base.locations||[]),contact:p.contact||clone(base.contact||{}),certifications:p.certifications||clone(base.certifications||[]),training:p.training||clone(base.training||[])}});
 next.appointments=(Array.isArray(saved.appointments)?saved.appointments:[]).map(a=>({...a,duration:a.duration??seed.providers.find(p=>p.id===a.providerId)?.duration??50,fee:a.fee??seed.providers.find(p=>p.id===a.providerId)?.fee??0}));
 const legacy=Array.isArray(saved.availability)&&saved.availability.some(a=>!a.providerId);
 next.availability=(Array.isArray(saved.availability)?saved.availability:clone(seed.availability)).map(a=>({...a,providerId:a.providerId||seed.activeProfessionalId}));
 if(legacy)for(const base of seed.availability.filter(a=>a.providerId!==seed.activeProfessionalId))if(!next.availability.some(a=>a.providerId===base.providerId))next.availability.push(clone(base));
 return next;
}
