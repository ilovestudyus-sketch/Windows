import test from 'node:test';
import assert from 'node:assert/strict';
import {COPY} from './locale-table.js';
import {locale,setLocale,translateCopy} from './locale.js';

test('the language table has one English line for every Chinese line',()=>{
  const seen=new Set();
  for(const [zh,en] of COPY){
    assert.equal(typeof zh,'string');
    assert.equal(typeof en,'string');
    assert.ok(zh.trim());
    assert.ok(en.trim());
    assert.equal(seen.has(zh),false,zh);
    seen.add(zh);
  }
  assert.ok(seen.has('云计算'));
  assert.ok(seen.has('原生'));
  assert.ok(seen.has('按当前筛选结果生成订阅'));
});

test('English is display-only and Chinese stays the stored value',()=>{
  assert.equal(locale(),'zh');
  assert.equal(translateCopy('云计算'),'云计算');
  assert.equal(translateCopy('当前 10 个节点 · 按勾选和当前筛选'),'当前 10 个节点 · 按勾选和当前筛选');
  setLocale('en');
  try{
    assert.equal(translateCopy('云计算'),'Cloud');
    assert.equal(translateCopy('原生'),'Native');
    assert.equal(translateCopy('当前 10 个节点 · 按勾选和当前筛选'),'10 nodes now · By checks and the current filter');
    assert.equal(translateCopy('全部 出口检测通过 8 个 · 失败 4 个'),'All exit passed 8 · 4 failed');
    assert.equal(translateCopy('延迟检测 · 通过 3 · 失败 1 · 剩余 2'),'Latency check · 3 passed · 1 failed · 2 left');
    assert.equal(translateCopy('已停止 · 通过 1 · 失败 2。插件已断开，这次出口检测停在这里。下次开始继续检测剩余节点。'),'Stopped · 1 passed · 2 failed. The plugin disconnected, so this exit check stopped here. The next start continues with the remaining nodes.');
    assert.equal(translateCopy('协议检测插件：已安装 · VMESS验证模式 · 已开启'),'Protocol plugin: installed · VMESS verification · On');
    assert.equal(translateCopy('插件 1.6.6；验证模式 VMESS · 仅限 R9；点击开启节点检测'),'Plugin 1.6.6; Verification VMESS · R9 only; Press to turn node checking on');
    assert.equal(translateCopy('来源成功 2/3 · 导入已解析 8 个节点 · 来源 2（example.com）：未识别到有效节点'),'Sources read 2/3 · Imported 8 parsed nodes · Source 2 (example.com): No valid node was recognized');
    assert.equal(translateCopy('选择第 4 个节点'),'Select node 4');
    assert.equal(translateCopy('请先粘贴订阅或节点链接'),'Paste a subscription or node link first');
    assert.equal(translateCopy('香港'),'香港');
  }finally{
    setLocale('zh');
  }
  assert.equal(translateCopy('云计算'),'云计算');
  assert.equal(translateCopy('原生'),'原生');
});
