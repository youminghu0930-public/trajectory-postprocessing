import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { prepareData } from '../scripts/prepare-data.mjs';
test('snapshot images use their highlight index and regenerate when missing',()=>{
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'trajectory-snapshots-'));
 try {
  for (const directory of ['vidoes/face-on','poses/before/face-on','poses/after/face-on']) fs.mkdirSync(path.join(root,'materials/data',directory),{recursive:true});
  fs.writeFileSync(path.join(root,'materials/data/vidoes/face-on/0001.MP4'),'source');
  const pose={joints:['golf_club_head'],pred:Array.from({length:4},(_,i)=>[[i+1,10,1]])};
  for(const side of ['before','after'])fs.writeFileSync(path.join(root,`materials/data/poses/${side}/face-on/0001.json`),JSON.stringify(pose));
  fs.writeFileSync(path.join(root,'materials/data/snapshot.json'),JSON.stringify({'0001':[{range:[0,3],joint:'golf_club_head',highlight_index:2}]}));
  const writes=[];
  const options={probe:()=>({width:720,height:1280,times:[0,.1,.2,.3]}),preview:(_,destination,frame)=>{writes.push(frame);fs.writeFileSync(destination,'image');}};
  const catalog=prepareData(root,options);
  const image='materials/data/snapshots/face-on/0001/2.jpg';
  assert.equal(catalog.snapshots[0].image,image);
  assert.equal(catalog.snapshots[0].trajectories.before.pred.length,4);
  const lite=JSON.parse(fs.readFileSync(path.join(root,'materials/data/snapshot-catalog.json')));
  assert.equal(lite.clips[0].video,undefined);assert.equal(lite.clips[0].times,undefined);
  fs.unlinkSync(path.join(root,image));prepareData(root,options);
  assert.ok(fs.existsSync(path.join(root,image)));assert.equal(writes.filter(frame=>frame===2).length,2);
 } finally {fs.rmSync(root,{recursive:true,force:true});}
});
