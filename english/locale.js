import {PHRASES} from './locale-table.js';

const KEY='ilovestudy-ui-locale';
let lang='zh';
try{
  const saved=globalThis.localStorage?.getItem(KEY);
  if(saved==='en'||saved==='zh')lang=saved;
}catch{}

const textSource=new WeakMap();
const titleSource=new WeakMap();

export function locale(){return lang;}

function pad(raw,next){
  const lead=String(raw).match(/^\s*/)?.[0]||'';
  const tail=String(raw).match(/\s*$/)?.[0]||'';
  return lead+next+tail;
}

function translateSegment(segment){
  if(PHRASES[segment])return PHRASES[segment];
  let match=segment.match(/^(全部|双栈|IPv4|IPv6) (出口检测通过|服务器检测通过) (\d+) 个$/);
  if(match)return `${PHRASES[match[1]]||match[1]} ${match[2]==='出口检测通过'?'exit passed':'server passed'} ${match[3]}`;
  match=segment.match(/^(全部|双栈|IPv4|IPv6) 检测中$/);
  if(match)return `${PHRASES[match[1]]||match[1]} checking`;
  match=segment.match(/^(全部|双栈|IPv4|IPv6) 尚未有可用检测结果。$/);
  if(match)return `${PHRASES[match[1]]||match[1]} has no usable results yet.`;
  match=segment.match(/^(IPv4|IPv6) (等待检测|检测中|正常|低风险|中风险|高风险|检测未完成|检测失败|暂不可用)$/);
  if(match)return `${match[1]} ${PHRASES[match[2]]||match[2]}`;
  match=segment.match(/^已完成 (\d+) 个$/);
  if(match)return `${match[1]} finished`;
  match=segment.match(/^通过 (\d+) 个$/);
  if(match)return `${match[1]} passed`;
  match=segment.match(/^通过 (\d+)$/);
  if(match)return `${match[1]} passed`;
  match=segment.match(/^失败 (\d+)(。.+)$/);
  if(match)return `${match[1]} failed${translateCopy(match[2])}`;
  match=segment.match(/^失败 (\d+)$/);
  if(match)return `${match[1]} failed`;
  match=segment.match(/^剩余 (\d+)(。.+)$/);
  if(match)return `${match[1]} left${translateCopy(match[2])}`;
  match=segment.match(/^([A-Za-z0-9]+)验证模式$/);
  if(match)return `${match[1]} verification`;
  match=segment.match(/^未连接（(.+)）$/);
  if(match)return `not connected (${translateSegment(match[1])})`;
  if(segment==='协议检测插件：已安装')return 'Protocol plugin: installed';
  match=segment.match(/^选择第 (\d+) 个节点$/);
  if(match)return `Select node ${match[1]}`;
  match=segment.match(/^切换到 (IPv4|IPv6) 状态信息$/);
  if(match)return `Switch to ${match[1]} status`;
  match=segment.match(/^(IPv4|IPv6) 状态信息尚未取得结果，无法切换$/);
  if(match)return `${match[1]} has no result yet, so it cannot be selected`;
  match=segment.match(/^最近检查 (.+)$/);
  if(match)return `Last check ${match[1]}`;
  match=segment.match(/^下载速度未取得：(.+)$/);
  if(match)return `Download speed was not measured: ${translateSegment(match[1])}`;
  match=segment.match(/^节点出口已确认；附加资料未完整：(.+)$/);
  if(match)return `Node exit confirmed. Incomplete details: ${match[1]}`;
  match=segment.match(/^服务器 IP：(.+)$/);
  if(match)return `Server IP: ${match[1]}`;
  match=segment.match(/^(.+) 这一行结果未能显示$/);
  if(match)return `${match[1]} could not be shown on this row`;
  match=segment.match(/^插件 (.+)$/);
  if(match)return `Plugin ${match[1]}`;
  match=segment.match(/^验证模式 (.+)$/);
  if(match)return `Verification ${translateSegment(match[1])}`;
  match=segment.match(/^来源成功 (\d+)\/(\d+)$/);
  if(match)return `Sources read ${match[1]}/${match[2]}`;
  match=segment.match(/^Base64 解码 (\d+) 个$/);
  if(match)return `Base64 decoded ${match[1]}`;
  match=segment.match(/^导入已解析 (\d+) 个节点$/);
  if(match)return `Imported ${match[1]} parsed nodes`;
  match=segment.match(/^来源 (\d+)（(.+)）：(.+)$/);
  if(match)return `Source ${match[1]} (${match[2]}): ${translateSegment(match[3])}`;
  match=segment.match(/^订阅来源读取失败（HTTP (\d+)）$/);
  if(match)return `The subscription source could not be read (HTTP ${match[1]})`;
  if(segment.includes(' · ')){
    const next=segment.split(' · ').map(part=>translateSegment(part)).join(' · ');
    if(next!==segment)return next;
  }
  match=segment.match(/^失败 (\d+) 个$/);
  if(match)return `${match[1]} failed`;
  match=segment.match(/^剩余分析 (\d+) 个$/);
  if(match)return `${match[1]} remaining`;
  match=segment.match(/^剩余 (\d+)$/);
  if(match)return `${match[1]} left`;
  match=segment.match(/^仅服务器资料 (\d+) 个$/);
  if(match)return `${match[1]} server-only`;
  match=segment.match(/^资料未完整 (\d+) 个$/);
  if(match)return `${match[1]} incomplete`;
  match=segment.match(/^筛选后 (\d+) 个$/);
  if(match)return `${match[1]} after filter`;
  match=segment.match(/^已生成 (\d+) 个节点（未检测）$/);
  if(match)return `${match[1]} nodes generated (not checked)`;
  match=segment.match(/^已生成 (\d+) 个节点$/);
  if(match)return `${match[1]} nodes generated`;
  match=segment.match(/^有效至 (.+)$/);
  if(match)return `until ${match[1]}`;
  match=segment.match(/^当前 (\d+) 个检测核心$/);
  if(match)return `${match[1]} check cores`;
  match=segment.match(/^测速 (\d+) 条连接$/);
  if(match)return `speed ${match[1]} connections`;
  match=segment.match(/^自动（(\d+) 核心）$/);
  if(match)return `Auto (${match[1]} cores)`;
  match=segment.match(/^协议检测插件：已安装 · (.+)$/);
  if(match){
    const rest=translateSegment(match[1]);
    return `Protocol plugin: installed · ${rest}`;
  }
  return segment;
}

function translatePerformance(trimmed){
  let match=trimmed.match(/^已开启下载测速：延迟、出口资料、网络代理和欺诈分值按当前 (\d+) 个检测核心同时进行，不等这一批测速结束。测速仍是全局一次一个节点，每个检测核心 4 条连接，当前 (\d+) 条。失败节点排到最后再测一次。(.*)$/);
  if(match)return `Download speed is on. Latency, exit details, proxy, and fraud use ${match[1]} check cores at once and do not wait for this speed batch. Speed still runs one node at a time, 4 connections per core, ${match[2]} now. Failed nodes are tried once more at the end.${match[3]?translateCopy(match[3]):''}`;
  match=trimmed.match(/^节点出口每批 (\d+) 个；节点服务器任务最多 (\d+) 路并发；DNS 最多 (\d+) 路；外部资料画像最多 (\d+) 路并发；浏览器网络总占用最多 (\d+) 路(（移动设备）)?。(.*)$/);
  if(match)return `Node exits run ${match[1]} at a time. Node server tasks use up to ${match[2]} at once. DNS uses up to ${match[3]}. External profiles use up to ${match[4]}. The browser uses at most ${match[5]} network requests${match[6]?' on a mobile device':''}.${match[7]?translateCopy(match[7]):''}`;
  return '';
}

export function translateCopy(value){
  const raw=String(value??'');
  if(lang!=='en'||!raw||!/[\u4e00-\u9fff]/.test(raw))return raw;
  const trimmed=raw.trim();
  if(PHRASES[trimmed])return pad(raw,PHRASES[trimmed]);
  const performance=translatePerformance(trimmed);
  if(performance)return pad(raw,performance);
  let match=trimmed.match(/^当前 (\d+) 个节点 · (.+)$/);
  if(match)return pad(raw,`${match[1]} nodes now · ${translateSegment(match[2])}`);
  match=trimmed.match(/^当前 (\d+) 个节点。?$/);
  if(match)return pad(raw,`${match[1]} nodes now.`);
  match=trimmed.match(/^已勾选 (\d+) 个节点。再次开始只重新检测这些节点，其它行保留，不会整表清空。$/);
  if(match)return pad(raw,`${match[1]} nodes checked. The next start rechecks only these nodes and keeps the other rows.`);
  match=trimmed.match(/^第 (\d+)\/(\d+) 页 · 每页 100 条$/);
  if(match)return pad(raw,`Page ${match[1]}/${match[2]} · 100 per page`);
  match=trimmed.match(/^未勾选。再次开始只重新检测当前筛选结果，其它行保留。$/);
  if(match)return pad(raw,'Nothing checked. The next start rechecks only the current filter and keeps the other rows.');
  if(trimmed.includes('；')){
    const next=trimmed.split('；').map(part=>translateSegment(part.trim())).join('; ');
    if(next!==trimmed)return pad(raw,next);
  }
  if(trimmed.includes(' · ')){
    const next=trimmed.split(' · ').map(translateSegment).join(' · ');
    if(next!==trimmed)return pad(raw,next);
  }
  const segment=translateSegment(trimmed);
  return segment===trimmed?raw:pad(raw,segment);
}

function acceptText(node){
  const parent=node.parentElement;
  if(!parent)return NodeFilter.FILTER_REJECT;
  const tag=parent.tagName;
  if(tag==='SCRIPT'||tag==='STYLE'||tag==='TEXTAREA'||tag==='INPUT'||tag==='NOSCRIPT')return NodeFilter.FILTER_REJECT;
  if(parent.closest?.('.lang-switch'))return NodeFilter.FILTER_REJECT;
  return NodeFilter.FILTER_ACCEPT;
}

export function localizeDocument(doc=globalThis.document){
  if(!doc?.body||typeof doc.createTreeWalker!=='function')return;
  doc.documentElement.lang=lang==='en'?'en':'zh-CN';
  if(!titleSource.has(doc))titleSource.set(doc,doc.title);
  const title=translateCopy(titleSource.get(doc));
  if(doc.title!==title)doc.title=title;
  const walker=doc.createTreeWalker(doc.body,NodeFilter.SHOW_TEXT,{acceptNode:acceptText});
  const nodes=[];
  while(walker.nextNode())nodes.push(walker.currentNode);
  for(const node of nodes){
    const current=node.nodeValue??'';
    const parent=node.parentElement;
    const pinned=parent?.dataset?.zh;
    if(pinned)textSource.set(node,pinned);
    else if(!textSource.has(node)&&(/[\u4e00-\u9fff]/.test(current)||lang==='zh'))textSource.set(node,current);
    const source=textSource.get(node);
    if(source==null)continue;
    let next=translateCopy(source);
    if(source.trim()==='关闭'&&node.parentElement?.closest?.('dialog'))next=pad(source,'Close');
    if(node.nodeValue!==next)node.nodeValue=next;
  }
  for(const el of doc.body.querySelectorAll('[title],[aria-label],[placeholder]')){
    if(el.closest?.('.lang-switch'))continue;
    for(const attr of ['title','aria-label','placeholder']){
      const current=el.getAttribute(attr);
      if(current==null)continue;
      const key='localeSource'+attr;
      if(!el.dataset[key]&&/[\u4e00-\u9fff]/.test(current))el.dataset[key]=current;
      if(/[\u4e00-\u9fff]/.test(current))el.dataset[key]=current;
      const source=el.dataset[key];
      if(!source)continue;
      const next=translateCopy(source);
      if(current!==next)el.setAttribute(attr,next);
    }
  }
  for(const button of doc.querySelectorAll('.lang-switch [data-locale]')){
    button.setAttribute('aria-pressed',String(button.dataset.locale===lang));
  }
}

export function setLocale(next){
  lang=next==='en'?'en':'zh';
  try{globalThis.localStorage?.setItem(KEY,lang);}catch{}
  localizeDocument();
  globalThis.document?.dispatchEvent?.(new Event('ilovestudy-locale'));
}

export function mountLocaleSwitch(doc=globalThis.document){
  const root=doc?.querySelector?.('.lang-switch');
  if(!root||root.dataset.bound==='1')return;
  root.dataset.bound='1';
  root.addEventListener('click',event=>{
    const button=event.target.closest?.('[data-locale]');
    if(!button||button.dataset.locale===lang)return;
    setLocale(button.dataset.locale);
  });
  localizeDocument(doc);
}
