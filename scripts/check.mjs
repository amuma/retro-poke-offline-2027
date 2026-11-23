import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
const root = path.resolve(import.meta.dirname, '..');
const files = ['index.html','ranking/index.html','events/index.html','guidelines/index.html'];
const sandbox = { window: {} };
const data = await fs.readFile(path.join(root,'assets/data.js'),'utf8');
vm.runInNewContext(data,sandbox);
new vm.Script(await fs.readFile(path.join(root,'assets/app.js'),'utf8'));
const D = sandbox.window.RPO;
assert.equal(D.points(2,64),93,'64人大会の準優勝は93pt');
assert.equal(D.points(1,31),75,'31人と32人の境界');
assert.equal(D.points(1,32),100);
assert.equal(D.points(1,95),125,'95人と96人の境界');
assert.equal(D.points(1,96),150);
assert.equal(D.points(33,96),0);
for (const event of D.events) for (const format of D.formats) {
  const rows = D.results.filter(r=>r.eventId===event.id && r.formatId===format.id);
  assert.equal(rows.length,event.count);
  assert.equal(new Set(rows.map(r=>r.playerId)).size,event.count,'二重登録なし');
  assert.equal(new Set(rows.map(r=>r.rank)).size,event.count,'順位の重複なし');
  for (const row of rows) { assert.equal(new Set(row.party).size,6); assert.ok(Number.isInteger(row.points) && row.points>=0); }
  const kp = D.kp(event.id,format.id);
  assert.equal(kp.reduce((n,p)=>n+p.count,0),event.count*6,'KPは全パーティと一致');
  assert.ok(kp.every(p=>p.percent>=0 && p.percent<=100));
}
const rankings = ['all',...D.formats.map(f=>f.id)].map(id=>D.ranking(id));
for (const rows of rankings) {
  assert.ok(rows.every((r,i)=>i===0 || rows[i-1].points>=r.points));
  assert.ok(rows.every(r=>r.points===r.entries.reduce((n,e)=>n+e.points,0)));
}
assert.equal(rankings[0].reduce((n,r)=>n+r.points,0),D.results.reduce((n,r)=>n+r.points,0),'全体ポイントと大会別ポイントが一致');
for (const file of files) {
  const source = await fs.readFile(path.join(root,file),'utf8');
  assert.equal((source.match(/<h1\b/g)||[]).length,1,`${file}: h1は1つ`);
  const ids = [...source.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(new Set(ids).size,ids.length,`${file}: id重複なし`);
  for (const match of source.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const ref = match[1];
    if (/^(https?:|data:|mailto:)/.test(ref)) continue;
    const parsed = new URL(ref,`https://example.test/project/${file}`);
    const rel = decodeURIComponent(parsed.pathname).replace(/^\/project\//,'');
    const target = path.join(root,!rel || rel.endsWith('/') ? rel+'index.html' : rel);
    assert.ok((await fs.stat(target)).isFile(),`${file}: ${ref}`);
    if (parsed.hash) {
      const targetSource = await fs.readFile(target,'utf8');
      assert.ok(targetSource.includes(`id="${parsed.hash.slice(1)}"`),`${file}: アンカー ${ref}`);
    }
  }
}
assert.ok((await fs.stat(path.join(root,'.nojekyll'))).isFile());
console.log(`PASS: 4ページ、${D.events.length}大会・${D.formats.length}部門・${D.results.length}成績の集計、KP、リンク、スクリプト構文を確認しました。`);
