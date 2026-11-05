// Build expected edit boundaries for short_qa.py from the actual source inputs.
// Run from the repository root. Does not execute the scene or change its timing.
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const source=ts.createSourceFile('world.ts',fs.readFileSync('src/videos/data-centres/world.ts','utf8'),ts.ScriptTarget.Latest,true);
const timeline=JSON.parse(fs.readFileSync('production/data-centres-natural/timeline.json','utf8'));
const subtitles=JSON.parse(fs.readFileSync('production/data-centres-natural/subtitles.json','utf8'));
function numeric(node){
  if(ts.isNumericLiteral(node))return Number(node.text);
  if(ts.isParenthesizedExpression(node))return numeric(node.expression);
  if(ts.isBinaryExpression(node)){
    const a=numeric(node.left),b=numeric(node.right);
    if(node.operatorToken.kind===ts.SyntaxKind.SlashToken)return a/b;
    if(node.operatorToken.kind===ts.SyntaxKind.AsteriskToken)return a*b;
    if(node.operatorToken.kind===ts.SyntaxKind.PlusToken)return a+b;
    if(node.operatorToken.kind===ts.SyntaxKind.MinusToken)return a-b;
  }
  throw new Error(`Unsupported camera time expression: ${node.getText(source)}`);
}
let tracks;
for(const statement of source.statements){
  if(ts.isVariableStatement(statement))for(const declaration of statement.declarationList.declarations){
    if(declaration.name.getText(source)==='CAMERA_TRACKS')tracks=declaration.initializer;
  }
}
if(!tracks||!ts.isObjectLiteralExpression(tracks))throw new Error('CAMERA_TRACKS literal was not found');
const cuts=[];
for(const entry of tracks.properties){
  const id=Number(entry.name.getText(source));
  const shot=timeline.segments.find(s=>s.id===id);
  if(!shot||!ts.isArrayLiteralExpression(entry.initializer))throw new Error(`Invalid camera track ${id}`);
  for(const beat of entry.initializer.elements.slice(1)){
    const field=beat.properties.find(p=>p.name.getText(source)==='at');
    const u=numeric(field.initializer);
    if(!Number.isFinite(u)||u<=0||u>=1)throw new Error(`Invalid internal cut in shot ${id}`);
    cuts.push(Math.ceil(shot.a+u*(shot.b-shot.a)-1e-8));
  }
}
const planned=[
  ...cuts.map(f=>[f-1,f+1]),
  ...subtitles.cues.flatMap(c=>[[c.from-1,c.from+7],[c.to-1,c.to+1]]),
  ...subtitles.wordStarts.map(f=>[f-1,f+1]),
];
const output=process.argv[2]||'out/data-centres/punchy-qa-meta.json';
fs.mkdirSync(path.dirname(output),{recursive:true});
fs.writeFileSync(output,JSON.stringify({
  shots:timeline.segments.map(({id,a,b})=>({id,a,b})),internalCameraCuts:cuts,planned,
},null,2)+'\n');
console.log(`Saved ${cuts.length} internal camera cuts and expected caption transitions to ${output}`);
