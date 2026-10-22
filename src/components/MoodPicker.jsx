import React from 'react';
import {Check} from 'lucide-react';
import {moods} from '../utils/wellbeing';
export function MoodPicker({value,onChange}){return <fieldset className="mood-field"><legend>Mood</legend><div className="mood-grid">{moods.map(([name,emoji])=><button type="button" key={name} className={`mood-option ${value===name?'selected':''}`} aria-label={`${name} mood`} aria-pressed={value===name} onClick={()=>onChange(name)}><span className="mood-emoji" aria-hidden="true">{emoji}</span><span>{name}</span>{value===name&&<Check className="mood-check" size={15} aria-hidden="true"/>}</button>)}</div></fieldset>}
