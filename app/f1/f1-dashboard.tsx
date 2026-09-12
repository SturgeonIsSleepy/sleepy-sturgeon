"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useLiquidGlass } from "../experience";

type View = "calendar" | "standings" | "next";
type ChartMode = "drivers" | "constructors";
type Session = { date: string; time?: string };
type Circuit = { circuitId: string; circuitName: string; url: string; Location: { locality: string; country: string } };
type Race = { season:string; round:string; raceName:string; date:string; time?:string; Circuit:Circuit; FirstPractice?:Session; SecondPractice?:Session; ThirdPractice?:Session; Sprint?:Session; SprintQualifying?:Session; Qualifying?:Session };
type DriverStanding = { position:string; points:string; wins:string; Driver:{driverId:string;givenName:string;familyName:string;code?:string}; Constructors:{name:string}[] };
type ConstructorStanding = { position:string; points:string; wins:string; Constructor:{constructorId:string;name:string} };
type RaceFinish = { position:string; Driver:{givenName:string;familyName:string}; Constructor:{name:string} };
type ResultRace = Race & { Results:RaceFinish[] };
type Progress = { round:number; drivers:Record<string,number>; constructors:Record<string,number> };
type ScheduleResponse = { MRData:{RaceTable:{Races:Race[]}} };
type DriverResponse = { MRData:{StandingsTable:{StandingsLists:{DriverStandings:DriverStanding[]}[]}} };
type ConstructorResponse = { MRData:{StandingsTable:{StandingsLists:{ConstructorStandings:ConstructorStanding[]}[]}} };
type ResultsResponse = { MRData:{RaceTable:{Races:ResultRace[]}} };
type CircuitData = { slug:string; image:string; length:string; first:string; laps:string; fastest:string; distance:string };

const API = "https://api.jolpi.ca/ergast/f1";
const F1_OFFICIAL = "https://www.formula1.com/en/racing/2026";
const officialTrackImage=(name:string)=>`https://media.formula1.com/image/upload/c_fit%2Ch_704/q_auto/v1740000001/common/f1/2026/track/2026track${name}detailed.webp`;
const officialCircuits:Record<string,CircuitData> = {
  albert_park:{slug:"australia",image:"melbourne",length:"5.278 km",first:"1996",laps:"58",fastest:"1:19.813 · Charles Leclerc (2024)",distance:"306.124 km"},
  shanghai:{slug:"china",image:"shanghai",length:"5.451 km",first:"2004",laps:"56",fastest:"1:32.238 · Michael Schumacher (2004)",distance:"305.066 km"},
  suzuka:{slug:"japan",image:"suzuka",length:"5.807 km",first:"1987",laps:"53",fastest:"1:30.965 · Kimi Antonelli (2025)",distance:"307.471 km"},
  miami:{slug:"miami",image:"miami",length:"5.412 km",first:"2022",laps:"57",fastest:"1:29.708 · Max Verstappen (2023)",distance:"308.326 km"},
  villeneuve:{slug:"canada",image:"montreal",length:"4.361 km",first:"1967",laps:"70",fastest:"1:13.078 · Valtteri Bottas (2019)",distance:"305.270 km"},
  monaco:{slug:"monaco",image:"montecarlo",length:"3.337 km",first:"1950",laps:"78",fastest:"1:12.909 · Lewis Hamilton (2021)",distance:"260.286 km"},
  catalunya:{slug:"barcelona-catalunya",image:"catalunya",length:"4.657 km",first:"1991",laps:"66",fastest:"1:15.743 · Oscar Piastri (2025)",distance:"307.236 km"},
  red_bull_ring:{slug:"austria",image:"spielberg",length:"4.326 km",first:"1970",laps:"71",fastest:"1:07.924 · Oscar Piastri (2025)",distance:"307.018 km"},
  silverstone:{slug:"great-britain",image:"silverstone",length:"5.891 km",first:"1950",laps:"52",fastest:"1:27.097 · Max Verstappen (2020)",distance:"306.198 km"},
  spa:{slug:"belgium",image:"spafrancorchamps",length:"7.004 km",first:"1950",laps:"44",fastest:"1:44.701 · Sergio Perez (2024)",distance:"308.052 km"},
  hungaroring:{slug:"hungary",image:"hungaroring",length:"4.381 km",first:"1986",laps:"70",fastest:"1:16.627 · Lewis Hamilton (2020)",distance:"306.630 km"},
  zandvoort:{slug:"netherlands",image:"zandvoort",length:"4.259 km",first:"1952",laps:"72",fastest:"1:11.097 · Lewis Hamilton (2021)",distance:"306.587 km"},
  monza:{slug:"italy",image:"monza",length:"5.793 km",first:"1950",laps:"53",fastest:"1:20.901 · Lando Norris (2025)",distance:"306.720 km"},
  madring:{slug:"spain",image:"madring",length:"5.414 km",first:"2026",laps:"57",fastest:"—",distance:"308.399 km"},
  madrid:{slug:"spain",image:"madring",length:"5.414 km",first:"2026",laps:"57",fastest:"—",distance:"308.399 km"},
  baku:{slug:"azerbaijan",image:"baku",length:"6.003 km",first:"2016",laps:"51",fastest:"1:43.009 · Charles Leclerc (2019)",distance:"306.049 km"},
  sepang:{slug:"bahrain",image:"kualalumpur",length:"5.543 km",first:"1999",laps:"56",fastest:"1:34.080 · Sebastian Vettel (2017)",distance:"310.418 km"},
  marina_bay:{slug:"singapore",image:"singapore",length:"4.940 km",first:"2008",laps:"62",fastest:"1:34.486 · Daniel Ricciardo (2024)",distance:"306.143 km"},
  americas:{slug:"united-states",image:"austin",length:"5.513 km",first:"2012",laps:"56",fastest:"1:36.169 · Charles Leclerc (2019)",distance:"308.405 km"},
  rodriguez:{slug:"mexico",image:"mexicocity",length:"4.304 km",first:"1963",laps:"71",fastest:"1:17.774 · Valtteri Bottas (2021)",distance:"305.354 km"},
  interlagos:{slug:"brazil",image:"interlagos",length:"4.309 km",first:"1973",laps:"71",fastest:"1:10.540 · Valtteri Bottas (2018)",distance:"305.879 km"},
  vegas:{slug:"las-vegas",image:"lasvegas",length:"6.201 km",first:"2023",laps:"50",fastest:"1:34.876 · Lando Norris (2024)",distance:"309.958 km"},
  losail:{slug:"qatar",image:"lusail",length:"5.419 km",first:"2021",laps:"57",fastest:"1:22.384 · Lando Norris (2024)",distance:"308.611 km"},
  yas_marina:{slug:"abu-dhabi",image:"yasmarina",length:"5.281 km",first:"2009",laps:"58",fastest:"1:25.637 · Kevin Magnussen (2024)",distance:"306.183 km"},
};
const teamColors:Record<string,string> = { Mercedes:"#00d2be",Ferrari:"#ff304f",McLaren:"#ff8700","Red Bull":"#4c7cff","RB F1 Team":"#78a5ff","Alpine F1 Team":"#35a8ff","Haas F1 Team":"#d5d8dc",Audi:"#f50537",Williams:"#65c4ff","Aston Martin":"#2bc58f","Cadillac F1 Team":"#f0d15f" };
const nav:{id:View;label:string;icon:ReactNode}[] = [
  {id:"calendar",label:"CALENDAR",icon:<><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/></>},
  {id:"standings",label:"STANDINGS",icon:<path d="M5 19V9h4v10M10 19V5h4v14M15 19v-7h4v7"/>},
  {id:"next",label:"RACE DATA",icon:<path d="M5 20V4M6 5h11l-2.5 3L17 11H6"/>},
];

const readView=():View=>typeof window!=="undefined"&&["calendar","standings","next"].includes(location.hash.slice(1))?location.hash.slice(1) as View:"calendar";
const asDate=(date:string,time?:string)=>new Date(`${date}T${time||"00:00:00Z"}`);
const localTime=(date:string,time?:string)=>new Intl.DateTimeFormat("en-GB",{month:"short",day:"numeric",weekday:"short",hour:time?"2-digit":undefined,minute:time?"2-digit":undefined,timeZoneName:time?"short":undefined}).format(asDate(date,time));
const driverName=(driver:DriverStanding)=>`${driver.Driver.givenName} ${driver.Driver.familyName}`;
const sessions=(race:Race):[string,Session][]=>[["FP1",race.FirstPractice],["FP2",race.SecondPractice],["FP3",race.ThirdPractice],["SPRINT",race.Sprint],["SPRINT Q",race.SprintQualifying],["QUALIFYING",race.Qualifying],["RACE",{date:race.date,time:race.time}]].filter((item):item is [string,Session]=>Boolean(item[1]));

function GlassFilter({id,target}:{id:string;target:React.RefObject<HTMLElement|null>}){
  const map=useRef<SVGFEImageElement>(null),spec=useRef<SVGFEImageElement>(null),displacement=useRef<SVGFEDisplacementMapElement>(null);
  useLiquidGlass({dock:target,map,spec,displacement});
  return <svg className="filter-host" colorInterpolationFilters="sRGB" aria-hidden="true"><defs><filter id={id} x="0%" y="0%" width="100%" height="100%" filterUnits="objectBoundingBox" primitiveUnits="userSpaceOnUse"><feImage ref={map} preserveAspectRatio="none" result="raw"/><feGaussianBlur in="raw" stdDeviation=".35" result="map"/><feGaussianBlur in="SourceGraphic" stdDeviation=".18" result="src"/><feDisplacementMap ref={displacement} in="src" in2="map" scale="34" xChannelSelector="R" yChannelSelector="G" result="refracted"/><feImage ref={spec} preserveAspectRatio="none" result="spec"/><feBlend in="spec" in2="refracted" mode="normal"/></filter></defs></svg>;
}

function SessionCards({race,compact=false}:{race:Race;compact?:boolean}){
  const all=sessions(race),now=Date.now(),next=all.find(([,session])=>asDate(session.date,session.time).getTime()>=now)?.[0];
  return <div className={compact?"session-grid compact":"session-grid"}>{all.map(([name,session])=>{const done=asDate(session.date,session.time).getTime()<now;return <article className="session-item" key={name}><span data-state={done?"done":name===next?"next":"future"}>{name}</span><time>{localTime(session.date,session.time)}</time></article>})}</div>;
}

function PointsChart({history,drivers,constructors}:{history:Progress[];drivers:DriverStanding[];constructors:ConstructorStanding[]}){
  const [mode,setMode]=useState<ChartMode>("drivers");
  const [hidden,setHidden]=useState<Set<string>>(()=>new Set());
  const driverOrderByTeam=new Map<string,number>();
  const driverSeries=drivers.map((driver)=>{
    const team=driver.Constructors[0]?.name||"Unknown";
    const order=(driverOrderByTeam.get(team)||0)+1;
    driverOrderByTeam.set(team,order);
    return {id:`driver-${driver.Driver.driverId}`,dataId:driver.Driver.driverId,label:driverName(driver),short:driver.Driver.code||driver.Driver.familyName.slice(0,3).toUpperCase(),color:teamColors[team]||"#dce7ef",dashed:order>1};
  });
  const constructorSeries=constructors.map((entry)=>({id:`team-${entry.Constructor.constructorId}`,dataId:entry.Constructor.constructorId,label:entry.Constructor.name,short:entry.Constructor.name,color:teamColors[entry.Constructor.name]||"#dce7ef",dashed:false}));
  const series=mode==="drivers"?driverSeries:constructorSeries;
  const values=(row:Progress)=>mode==="drivers"?row.drivers:row.constructors;
  const width=Math.max(980,history.length*76),height=420,left=64,right=24,top=24,bottom=56;
  const max=Math.max(1,...history.flatMap((row)=>series.map((line)=>values(row)[line.dataId]||0)));
  const ceiling=Math.ceil(max/50)*50||50;
  const x=(index:number)=>left+index*(width-left-right)/Math.max(1,history.length-1);
  const y=(points:number)=>top+(1-points/ceiling)*(height-top-bottom);
  const toggle=(id:string)=>setHidden((current)=>{const next=new Set(current);if(next.has(id))next.delete(id);else next.add(id);return next;});
  const changeMode=(next:ChartMode)=>{setMode(next);setHidden(new Set());};
  return <div className="points-chart">
    <div className="chart-toolbar" role="group" aria-label="Chart series"><button type="button" data-active={mode==="drivers"||undefined} onClick={()=>changeMode("drivers")}>DRIVERS</button><button type="button" data-active={mode==="constructors"||undefined} onClick={()=>changeMode("constructors")}>TEAMS</button></div>
    <div className="chart-scroll"><svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${mode} championship points by round`}>
      {[0,.2,.4,.6,.8,1].map((ratio)=>{const score=Math.round(ceiling*(1-ratio));const py=top+(height-top-bottom)*ratio;return <g key={ratio}><line className="axis-grid" x1={left} x2={width-right} y1={py} y2={py}/><text x={left-10} y={py+4} textAnchor="end">{score}</text></g>})}
      {history.map((row,index)=><g key={row.round}><line className="axis-tick" x1={x(index)} x2={x(index)} y1={height-bottom} y2={height-bottom+7}/><text x={x(index)} y={height-bottom+24} textAnchor="middle">R{row.round}</text></g>)}
      <text className="axis-label" x="16" y={height/2} textAnchor="middle" transform={`rotate(-90 16 ${height/2})`}>POINTS</text><text className="axis-label" x={width/2} y={height-8} textAnchor="middle">ROUND</text>
      {series.map((line)=><polyline key={line.id} points={history.map((row,index)=>`${x(index)},${y(values(row)[line.dataId]||0)}`).join(" ")} style={{stroke:line.color,opacity:hidden.has(line.id)?0:1}} strokeDasharray={line.dashed?"10 7":undefined}/>)}</svg></div>
    <div className="chart-legend">{series.map((line)=><button type="button" key={line.id} data-hidden={hidden.has(line.id)||undefined} onClick={()=>toggle(line.id)} aria-pressed={!hidden.has(line.id)} title={line.label}><i style={{borderTopColor:line.color,borderTopStyle:line.dashed?"dashed":"solid"}}/>{line.short}</button>)}</div>
  </div>;
}

export default function F1Dashboard(){
  const [mounted,setMounted]=useState(false),[view,setView]=useState<View>("calendar"),[selectedRound,setSelectedRound]=useState(""),[races,setRaces]=useState<Race[]>([]),[drivers,setDrivers]=useState<DriverStanding[]>([]),[constructors,setConstructors]=useState<ConstructorStanding[]>([]),[results,setResults]=useState<ResultRace[]>([]),[lastWinners,setLastWinners]=useState<ResultRace[]>([]),[progress,setProgress]=useState<Progress[]>([]),[status,setStatus]=useState<"loading"|"live"|"offline">("loading"),[updated,setUpdated]=useState(""),[dockMoving,setDockMoving]=useState(false);
  const rootRef=useRef<HTMLElement>(null),dockRef=useRef<HTMLElement>(null),selectorRef=useRef<HTMLDivElement>(null),contentRef=useRef<HTMLDivElement>(null),dockContentCloneRef=useRef<HTMLDivElement>(null),selectorContentCloneRef=useRef<HTMLDivElement>(null),pointerFrame=useRef(0),scrollFrame=useRef(0);
  const get=useCallback(async<T,>(path:string):Promise<T>=>{const response=await fetch(`${API}/${path}`);if(!response.ok)throw new Error(String(response.status));return response.json() as Promise<T>;},[]);
  const load=useCallback(async()=>{
    setStatus("loading");
    try{
      const [scheduleData,driverData,constructorData]=await Promise.all([get<ScheduleResponse>("current.json?limit=100"),get<DriverResponse>("current/driverstandings.json"),get<ConstructorResponse>("current/constructorstandings.json")]);
      const nextRaces=scheduleData.MRData.RaceTable.Races;
      const nextDrivers=driverData.MRData.StandingsTable.StandingsLists[0]?.DriverStandings||[];
      const nextConstructors=constructorData.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings||[];
      setRaces(nextRaces);setDrivers(nextDrivers);setConstructors(nextConstructors);
      setUpdated(new Intl.DateTimeFormat(undefined,{hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(new Date()));setStatus("live");
      const extras=await Promise.allSettled([get<ResultsResponse>("current/results.json?limit=2000"),get<ResultsResponse>("2025/results/1.json?limit=100")]);
      if(extras[0].status==="fulfilled")setResults(extras[0].value.MRData.RaceTable.Races);
      if(extras[1].status==="fulfilled")setLastWinners(extras[1].value.MRData.RaceTable.Races);
      const completedRounds=nextRaces.filter((race)=>asDate(race.date,race.time).getTime()<Date.now()).map((race)=>Number(race.round));
      const rows=await Promise.allSettled(completedRounds.map(async(round)=>{
        const [roundDrivers,roundTeams]=await Promise.all([get<DriverResponse>(`current/${round}/driverstandings.json`),get<ConstructorResponse>(`current/${round}/constructorstandings.json`)]);
        const driverList=roundDrivers.MRData.StandingsTable.StandingsLists[0]?.DriverStandings||[];
        const teamList=roundTeams.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings||[];
        return {round,drivers:Object.fromEntries(driverList.map((driver)=>[driver.Driver.driverId,Number(driver.points)])),constructors:Object.fromEntries(teamList.map((team)=>[team.Constructor.constructorId,Number(team.points)]))};
      }));
      setProgress(rows.flatMap((row)=>row.status==="fulfilled"?[row.value]:[]));
    }catch{setStatus("offline");}
  },[get]);
  useEffect(()=>{setMounted(true);setView(readView());load();const sync=()=>setView(readView());addEventListener("hashchange",sync);addEventListener("popstate",sync);return()=>{removeEventListener("hashchange",sync);removeEventListener("popstate",sync);};},[load]);
  useEffect(()=>{setDockMoving(true);const timer=setTimeout(()=>setDockMoving(false),850);return()=>clearTimeout(timer);},[view]);
  const go=(next:View)=>{
    if(next===view)return;
    setDockMoving(true);
    window.setTimeout(()=>{
      setView(next);
      window.history.pushState(null,"",`#${next}`);
      requestAnimationFrame(()=>rootRef.current?.scrollTo({top:0,behavior:"smooth"}));
    },110);
  };
  const nextRace=useMemo(()=>races.find((race)=>asDate(race.date,race.time).getTime()>=Date.now())||races.at(-1),[races]);
  useEffect(()=>{if(!selectedRound&&nextRace)setSelectedRound(nextRace.round);},[nextRace,selectedRound]);
  const raceDataRace=useMemo(()=>races.find((race)=>race.round===selectedRound)||nextRace,[races,selectedRound,nextRace]);
  const circuitData=raceDataRace?officialCircuits[raceDataRace.Circuit.circuitId]:undefined;
  const completed=useMemo(()=>races.filter((race)=>nextRace&&Number(race.round)<Number(nextRace.round)),[races,nextRace]);
  const future=useMemo(()=>races.filter((race)=>nextRace&&Number(race.round)>Number(nextRace.round)),[races,nextRace]);
  const resultByRound=useMemo(()=>Object.fromEntries(results.map((race)=>[race.round,race])),[results]);
  const winnerByCircuit=useMemo(()=>Object.fromEntries(lastWinners.map((race)=>[race.Circuit.circuitId,race.Results[0]])),[lastWinners]);
  const pageIndex=nav.findIndex((item)=>item.id===view);

  useEffect(()=>{
    if(!mounted||!contentRef.current)return;
    const frame=requestAnimationFrame(()=>{
      for(const target of [dockContentCloneRef.current,selectorContentCloneRef.current]){
        if(!target||!contentRef.current)continue;
        const clone=contentRef.current.cloneNode(true) as HTMLDivElement;
        clone.setAttribute("aria-hidden","true");
        clone.querySelectorAll("[id]").forEach((element)=>element.removeAttribute("id"));
        clone.querySelectorAll("a,button,[tabindex]").forEach((element)=>element.setAttribute("tabindex","-1"));
        target.replaceChildren(clone);
      }
    });
    return()=>cancelAnimationFrame(frame);
  },[mounted,races,drivers,constructors,results,lastWinners,progress,status,updated,selectedRound]);

  useEffect(()=>{
    const frame=requestAnimationFrame(()=>{
      const transform=`translate3d(-${pageIndex*33.333333}%,0,0)`;
      for(const target of [dockContentCloneRef.current,selectorContentCloneRef.current]){
        target?.querySelectorAll<HTMLElement>(".f1-context-track,.f1-slider-track").forEach((track)=>{track.style.transform=transform;});
      }
    });
    return()=>cancelAnimationFrame(frame);
  },[pageIndex]);

  useEffect(()=>{
    const source=contentRef.current;
    if(!mounted||!source)return;
    let frame=0;
    const refresh=()=>{
      cancelAnimationFrame(frame);
      frame=requestAnimationFrame(()=>{
        for(const target of [dockContentCloneRef.current,selectorContentCloneRef.current]){
          if(!target)continue;
          const clone=source.cloneNode(true) as HTMLDivElement;
          clone.setAttribute("aria-hidden","true");
          clone.querySelectorAll("[id]").forEach((element)=>element.removeAttribute("id"));
          clone.querySelectorAll("a,button,[tabindex]").forEach((element)=>element.setAttribute("tabindex","-1"));
          target.replaceChildren(clone);
        }
      });
    };
    const observer=new MutationObserver(refresh);
    observer.observe(source,{subtree:true,childList:true,attributes:true,attributeFilter:["data-active","data-hidden","style"]});
    return()=>{observer.disconnect();cancelAnimationFrame(frame);};
  },[mounted]);

  const syncRefractedScroll=(event:React.UIEvent<HTMLDivElement>)=>{
    const source=event.target as HTMLElement;
    if(!source.matches(".chart-scroll")||!contentRef.current)return;
    const sourceIndex=Array.from(contentRef.current.querySelectorAll<HTMLElement>(".chart-scroll")).indexOf(source);
    if(sourceIndex<0)return;
    for(const target of [dockContentCloneRef.current,selectorContentCloneRef.current]){
      const mirror=target?.querySelectorAll<HTMLElement>(".chart-scroll")[sourceIndex];
      if(mirror)mirror.scrollLeft=source.scrollLeft;
    }
  };

  const moveBackdrop=(event:React.PointerEvent<HTMLElement>)=>{
    if(matchMedia("(prefers-reduced-motion: reduce)").matches||!rootRef.current)return;
    const x=(event.clientX/innerWidth-.5)*18,y=(event.clientY/innerHeight-.5)*12;
    cancelAnimationFrame(pointerFrame.current);
    pointerFrame.current=requestAnimationFrame(()=>{
      rootRef.current?.style.setProperty("--f1-pointer-x",`${x.toFixed(2)}px`);
      rootRef.current?.style.setProperty("--f1-pointer-y",`${y.toFixed(2)}px`);
    });
  };

  const scrollBackdrop=(event:React.UIEvent<HTMLElement>)=>{
    cancelAnimationFrame(scrollFrame.current);
    const top=event.currentTarget.scrollTop;
    scrollFrame.current=requestAnimationFrame(()=>{
      rootRef.current?.style.setProperty("--f1-scroll-y",`${Math.max(-64,-top*.085).toFixed(2)}px`);
      rootRef.current?.style.setProperty("--f1-scroll-top",`${top.toFixed(2)}px`);
    });
  };
  const RaceRow=({race,state}:{race:Race;state:"done"|"future"})=>{
    const podium=resultByRound[race.round]?.Results.slice(0,3),winner=winnerByCircuit[race.Circuit.circuitId];
    return <div className="calendar-race" data-state={state}><b>R{String(race.round).padStart(2,"0")}</b><span><strong>{race.raceName}</strong><small>{race.Circuit.circuitName} · {localTime(race.date,race.time)}</small></span>{state==="done"?<div className="race-result">{podium?.map((entry)=><i key={entry.position}>{entry.position}. {entry.Driver.familyName}</i>)||<i>RESULT PENDING</i>}</div>:<div className="race-result"><i>2025 WINNER</i><em>{winner?`${winner.Driver.givenName} ${winner.Driver.familyName}`:"—"}</em></div>}</div>;
  };

  if(!mounted)return <main className="f1-shell f1-loading"><div className="f1-backdrop" aria-hidden="true"/><p>PS C:\TOOLS\F1&gt; INITIALIZING...</p></main>;

  return <main ref={rootRef} className={`f1-shell f1-view-${view}`} onPointerMove={moveBackdrop} onScroll={scrollBackdrop}>
    <div className="f1-backdrop" aria-hidden="true"/><div className="f1-scan" aria-hidden="true"/><div className="f1-bottom-fade" aria-hidden="true"/>
    <a className="f1-home-button" href="/#home"><span className="f1-home-button__content"><img src="/sturgeon-hero.png" alt=""/>BACK HOME</span></a>

    <div ref={contentRef} className="f1-refractable-content" onScrollCapture={syncRefractedScroll}>
    <div className="f1-context-window"><div className="f1-context-track" style={{transform:`translate3d(-${pageIndex*33.333333}%,0,0)`}}>
      <header className="f1-context f1-context-calendar"><p>PS C:\TOOLS\F1&gt; Get-NextWeekend</p>{nextRace&&<><div><span>NEXT / ROUND {nextRace.round}</span><h1>{nextRace.raceName}</h1><strong>{nextRace.Circuit.Location.locality} · {localTime(nextRace.date,nextRace.time)}</strong></div><SessionCards race={nextRace} compact/></>}</header>
      <header className="f1-context f1-context-standings"><p>PS C:\TOOLS\F1&gt; Get-ChampionshipLeaders</p><div className="leader-board"><section><span>DRIVERS / TOP 3</span>{drivers.slice(0,3).map((driver,index)=><div key={driver.Driver.driverId}><b>0{index+1}</b><strong>{driverName(driver)}</strong><em>{driver.points} PTS</em></div>)}</section><section><span>TEAMS / TOP 3</span>{constructors.slice(0,3).map((team,index)=><div key={team.Constructor.constructorId}><b>0{index+1}</b><strong style={{color:teamColors[team.Constructor.name]}}>{team.Constructor.name}</strong><em>{team.points} PTS</em></div>)}</section></div></header>
      <header className="f1-context f1-context-next"><p>PS C:\TOOLS\F1&gt; Get-RaceData</p>{raceDataRace&&<><span>ROUND {raceDataRace.round} / {raceDataRace.Circuit.Location.country}</span><h1>{raceDataRace.Circuit.circuitName}</h1><strong>{localTime(raceDataRace.date,raceDataRace.time)}</strong></>}</header>
    </div></div>

    <div className="f1-slider-window"><div className="f1-slider-track" style={{transform:`translate3d(-${pageIndex*33.333333}%,0,0)`}}>
      <section className="f1-panel f1-calendar" aria-labelledby="calendar-title"><div className="f1-panel-head"><div><small>// FULL SEASON</small><h2 id="calendar-title">2026 CALENDAR</h2></div><span>{races.length} ROUNDS</span></div>{nextRace&&<div className="next-race-row"><b>NOW / R{nextRace.round}</b><strong>{nextRace.raceName}</strong><span>{nextRace.Circuit.circuitName} · {localTime(nextRace.date,nextRace.time)}</span></div>}<details className="race-group"><summary>COMPLETED RACES <span>{completed.length}</span></summary>{completed.map((race)=><RaceRow key={race.round} race={race} state="done"/>)}</details><details className="race-group"><summary>UPCOMING RACES <span>{future.length}</span></summary>{future.map((race)=><RaceRow key={race.round} race={race} state="future"/>)}</details></section>
      <section className="f1-panel f1-standings" aria-labelledby="standings-title"><div className="f1-panel-head"><div><small>// CHAMPIONSHIP</small><h2 id="standings-title">LIVE STANDINGS</h2></div><span>{status==="live"?`UPDATED ${updated}`:"LOCAL SNAPSHOT"}</span></div><div className="standings-grid"><div><h3>DRIVERS</h3>{drivers.map((driver)=><div className="standing-row" key={driver.Driver.driverId}><b>{driver.position}</b><span><strong>{driverName(driver)}</strong><small style={{color:teamColors[driver.Constructors[0]?.name]}}>{driver.Constructors[0]?.name}</small></span><em>{driver.points} PTS</em></div>)}</div><div><h3>CONSTRUCTORS</h3>{constructors.map((team)=><div className="standing-row" key={team.Constructor.constructorId}><b>{team.position}</b><span><strong style={{color:teamColors[team.Constructor.name]}}>{team.Constructor.name}</strong><small>{team.wins} WINS</small></span><em>{team.points} PTS</em></div>)}</div></div>{progress.length>1&&<><h3 className="chart-title">CHAMPIONSHIP PROGRESSION</h3><PointsChart history={progress} drivers={drivers} constructors={constructors}/></>}</section>
      <section className="f1-panel f1-next" aria-labelledby="race-data-title">
        <div className="f1-panel-head"><div><small>// OFFICIAL CIRCUIT INFORMATION</small><h2 id="race-data-title">{raceDataRace?.raceName||"RACE DATA"}</h2></div><label className="race-picker"><span>SELECT RACE</span><select value={raceDataRace?.round||""} onChange={(event)=>setSelectedRound(event.target.value)}>{races.map((race)=><option value={race.round} key={race.round}>R{race.round} — {race.raceName}</option>)}</select></label></div>
        {raceDataRace&&circuitData&&<div className="next-grid"><div><div className="track-card track-card--map-only"><img src={officialTrackImage(circuitData.image)} alt={`${raceDataRace.Circuit.circuitName} official Formula 1 circuit map`}/></div><dl className="circuit-stats"><div><dt>CIRCUIT LENGTH</dt><dd>{circuitData.length}</dd></div><div><dt>FIRST GRAND PRIX</dt><dd>{circuitData.first}</dd></div><div><dt>NUMBER OF LAPS</dt><dd>{circuitData.laps}</dd></div><div><dt>FASTEST LAP TIME</dt><dd>{circuitData.fastest}</dd></div><div><dt>RACE DISTANCE</dt><dd>{circuitData.distance}</dd></div></dl><a className="circuit-source" href={`https://www.formula1.com/en/racing/2026/${circuitData.slug}`} target="_blank" rel="noreferrer">VIEW OFFICIAL RACE PAGE ↗</a></div><div className="next-schedule"><h3>WEEKEND / LOCAL TIME</h3><SessionCards race={raceDataRace}/></div></div>}
      </section>
    </div></div>
    </div>
    <button className="f1-refresh" type="button" onClick={load} disabled={status==="loading"}>↻ {status==="loading"?"UPDATING":"REFRESH"}</button>
    <a className="f1-official" href={F1_OFFICIAL} target="_blank" rel="noreferrer">F1.COM ↗</a>
    <nav ref={dockRef} className="f1-dock" aria-label="F1 sections">
      <div className="f1-dock__refraction" style={{filter:"url(#f1-dock-glass)"}} aria-hidden="true"><div className="f1-backdrop f1-backdrop--clone"/><div ref={dockContentCloneRef} className="f1-content-clone"/></div><div className="f1-dock__surface" aria-hidden="true"/>
      <div className="f1-dock__items"><div ref={selectorRef} className="f1-dock-selector" data-moving={dockMoving||undefined} style={{transform:`translate3d(${pageIndex*100}%,0,0)`}} aria-hidden="true"><div className="f1-dock-selector__optics" style={{filter:"url(#f1-selector-glass)"}}><div className="f1-backdrop f1-backdrop--clone"/><div ref={selectorContentCloneRef} className="f1-content-clone"/></div><span/></div>{nav.map((item)=><button type="button" key={item.id} data-active={view===item.id||undefined} onClick={()=>go(item.id)}><svg viewBox="0 0 24 24" aria-hidden="true">{item.icon}</svg><span>{item.label}</span></button>)}</div>
    </nav>
    <GlassFilter id="f1-dock-glass" target={dockRef}/><GlassFilter id="f1-selector-glass" target={selectorRef}/>
  </main>;
}
