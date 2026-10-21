export default async function handler(req,res){
 if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
 if(!process.env.OPENAI_API_KEY)return res.status(503).json({error:'OPENAI_API_KEY chưa được cấu hình trên máy chủ.'});
 const {text,skill='Reading',level='B2–C1',limit=60,exclude=[]}=req.body||{};
 if(typeof text!=='string'||text.trim().length<80||text.length>35000)return res.status(400).json({error:'Cần đoạn văn 80–35.000 ký tự.'});
 const n=Math.min(60,Math.max(1,Number(limit)||20));
 const instructions=`You are an IELTS vocabulary tutor. Extract up to ${n} genuinely present B2+ vocabulary items from the source, preferring high-value items for ${skill}, level ${level}. Exclude known words: ${exclude.slice(0,300).join(', ')}. NEVER invent source quotations, vocabulary, IPA or question-to-passage paraphrase links. Return JSON object {"items":[{"word":"...","ipa":"/.../","meaning":"Vietnamese meaning","example":"exact short quote from source (max 20 words) or empty string","collocation":"natural collocation","synonym":"accurate synonym","level":"B2 or C1 or C2","explanation":"brief Vietnamese usage note"}],"notes":"Vietnamese summary"}. If fewer suitable words exist, return fewer. Do not fabricate question paraphrases if questions were not supplied.`;
 try{
 const r=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{Authorization:`Bearer ${process.env.OPENAI_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({model:process.env.OPENAI_MODEL||'gpt-4o-mini',temperature:0.15,response_format:{type:'json_object'},messages:[{role:'system',content:instructions},{role:'user',content:text}]})});
 const data=await r.json();if(!r.ok)return res.status(502).json({error:data.error?.message||'AI service error'});
 const parsed=JSON.parse(data.choices?.[0]?.message?.content||'{}');
 const items=(Array.isArray(parsed.items)?parsed.items:[]).slice(0,n).filter(x=>x.word&&x.meaning).map((x,i)=>({id:`ai-${Date.now()}-${i}`,word:String(x.word),meaning:String(x.meaning),ipa:String(x.ipa||''),example:String(x.example||''),collocation:String(x.collocation||''),synonym:String(x.synonym||''),level:String(x.level||level),explanation:String(x.explanation||'')}));
 return res.status(200).json({items,notes:String(parsed.notes||'')});
 }catch(e){return res.status(500).json({error:'Không thể xử lý kết quả phân tích.'})}
}
