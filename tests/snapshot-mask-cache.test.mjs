import test from 'node:test';
import assert from 'node:assert/strict';
import { addShade } from '../snapshot-viewer.js';
test('zoom and pan reuse the union mask; overlay visibility rebuilds it',()=>{
 const saved=globalThis.document,savedWindow=globalThis.window;let reads=0;globalThis.window={devicePixelRatio:1};
 const context=()=>new Proxy({}, {get:(_,key)=>key==='getImageData'?()=>{reads++;return {data:new Uint8ClampedArray(16)};}:key==='createLinearGradient'?()=>({addColorStop(){}}):()=>{}});
 globalThis.document={createElement:()=>({width:0,height:0,setAttribute(){},getContext:()=>context()})};
 try {
  const panel={dataset:{}},viewport={clientWidth:300,clientHeight:400,append(){},closest:()=>panel};
  const pose={joints:['golf_club_head'],pred:[[[10,10,1]],[[20,20,1]]]};
  const entry={width:100,height:100,range:[0,1],joints:pose.joints,trajectories:{before:pose,after:pose}};
  const update=addShade(viewport,entry,'before');
  update({zoom:1,x:0,y:0});assert.equal(reads,1);
  for(let i=0;i<20;i++)update({zoom:2+i*.1,x:.1,y:0});
  assert.equal(reads,1,'pixel union must not run on each gesture update');
  panel.dataset.hideBefore='true';update({zoom:3,x:0,y:0});assert.equal(reads,2);
 } finally {globalThis.document=saved;globalThis.window=savedWindow;}
});
