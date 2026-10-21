from pathlib import Path
import html, json, xml.etree.ElementTree as ET

OUT = Path(__file__).resolve().parent
# Catalog counts from r3_sandbox_vu on 2026-10-21. Fields shown are the ERD keys and analysis columns.
N = [
 dict(id='seller',name='clean_seller',kind='dim',x=50,y=90,rows=11639,cols=8,grain='1 dòng / seller',fields=[('seller_id','Int64','PK'),('seller_model','String',''),('seller_status','String',''),('seller_type','String',''),('seller_product','String','')]),
 dict(id='staff',name='clean_emp_2_salesroom',kind='fact',x=50,y=410,rows=275856,cols=9,grain='1 dòng / assignment SA',fields=[('shop_id','Int64','FK → shop'),('employee_id','Int64','không có dim Employee'),('role','String',''),('valid_from','DateTime',''),('valid_to','Nullable(DateTime)','NULL = open-ended'),('dup_rank','UInt16','bản sao được gắn cờ')]),
 dict(id='dim_shop',name='dim_shop_all',kind='derived',x=50,y=710,rows=32524,cols=17,grain='1 dòng / shop_id quan sát được',fields=[('shop_id','Int64','PK logic'),('in_master','UInt8',''),('category','String',''),('contracts / booked','UInt64',''),('lead_rows / leads_w','UInt64 / Float64',''),('province / area','String','')]),
 dict(id='salesroom',name='clean_salesroom',kind='dim',x=540,y=160,rows=14231,cols=15,grain='1 dòng / shop master',fields=[('shop_id','Int64','PK'),('seller_id','Nullable(Int64)','FK logic → seller'),('manager_emp_id','Nullable(Int64)','SA assignment'),('category / model','String',''),('dt_start / dt_end','DateTime',''),('province / area','String',''),('seller_found','UInt8','')]),
 dict(id='staff_month',name='clean_shop_staff_month',kind='derived',x=540,y=690,rows=161306,cols=5,grain='1 dòng / shop × month',fields=[('shop_id','Int64','grain key'),('month','Date','grain key'),('sa_headcount','UInt64',''),('sa_fte','Float64',''),('sa_dedicated','UInt64','')]),
 dict(id='contract',name='clean_contract',kind='fact',x=1030,y=75,rows=3775371,cols=31,grain='1 dòng / credit case',fields=[('credit_case_id','Int64','PK logic'),('shop_id','Int64','FK logic → shop'),('client_id','Nullable(Int64)',''),('product','String',''),('dt_apply','DateTime',''),('dt_sign','Nullable(DateTime)','sentinel → NULL'),('emp_pre_process_id','Nullable(Int64)',''),('is_booked / FPD flags','UInt8','')]),
 dict(id='product',name='clean_contract_product',kind='fact',x=1030,y=420,rows=784902,cols=6,grain='1 dòng / goods line',fields=[('credit_case_id','Int64','FK logic → contract'),('line_no','UInt64','thứ tự trong hồ sơ'),('producer','Nullable(String)',''),('goods_category','Nullable(String)',''),('goods_type','Nullable(String)',''),('goods_group','Nullable(String)','')]),
 dict(id='goods',name='clean_contract_goods',kind='derived',x=1030,y=700,rows=779941,cols=5,grain='1 dòng / credit case có hàng hóa',fields=[('credit_case_id','Int64','PK / FK logic'),('goods_lines','UInt64',''),('goods_group_line1','Nullable(String)','line_no nhỏ nhất'),('goods_groups_distinct','UInt64',''),('flag_goods_group_missing','UInt8','')]),
 dict(id='attr',name='lead_contract_attr',kind='derived',x=1520,y=700,rows=260674,cols=20,grain='1 dòng / contract được ghép lead',fields=[('credit_case_id','Int64','PK logic → contract'),('lead_row','UInt64','lead được chọn'),('client_id + product','key pair',''),('dt_assigned','DateTime','≤ dt_apply'),('dt_apply','DateTime',''),('lead_shop_id','Nullable(Int64)',''),('same_shop / days','UInt8 / Int64',''),('n_candidates','UInt64','')]),
 dict(id='lead',name='clean_lead',kind='fact',x=1580,y=75,rows=6130637,cols=27,grain='1 dòng / source lead row',fields=[('lead_row','UInt64','row surrogate'),('lead_uuid','String','không duy nhất'),('client_id','Nullable(Int64)',''),('product','String',''),('dt_assigned','Nullable(DateTime)',''),('shop_id','Nullable(Int64)','FK logic → shop'),('finish_code','String','từ result_code'),('lead_credit_case_id','Nullable(Int64)','FK logic → contract'),('w','Float64','sample weight'),('is_latest_offer','UInt8','cờ, không xóa dòng')]),
 dict(id='reason',name='clean_lead_finish_reason',kind='dim',x=2070,y=500,rows=12,cols=3,grain='1 dòng / finish reason',fields=[('finish_id','Int32','mã nguồn'),('finish_code','String','lookup key'),('finish_desc','String','')]),
 dict(id='mart',name='mart_shop_month',kind='mart',x=2070,y=100,rows=136093,cols=30,grain='1 dòng / master shop × month',fields=[('shop_id + month','Int64 + Date','grain key'),('applications / booked','UInt64',''),('leads_w','Float64','weighted'),('cross-shop measures','Float64',''),('sa_fte / headcount','Float64 / UInt64',''),('fpd_num / fpd_den','UInt64','apply trước 01/08/2026'),('product mix / credit','metrics','')]),
 dict(id='dq',name='dq_reconciliation',kind='qa',x=2070,y=700,rows=29,cols=6,grain='1 dòng / kiểm tra',fields=[('check_no','UInt64',''),('check_name','String',''),('status','String','24 PASS · 5 INFO'),('bronze_value','String',''),('clean_value','String',''),('note','String','')]),
 dict(id='bronze',name='r3_bronze · BTC',kind='source',x=50,y=1010,rows=None,cols=None,grain='7 bảng nguồn · giữ nguyên',fields=[('raw source','—','không sửa'),('row counts / totals','—','đối soát qua DQ')]),
]
W,H=2620,1135; CARD_W=430; ROW_H=22; HEAD_H=32; META_H=25
for n in N:
 n['w']=CARD_W; n['h']=HEAD_H+META_H+len(n['fields'])*ROW_H+10

# Relationship summary shown below the diagram. These are logical joins/lineage, not enforced FKs.
R=[
 ('K01','clean_seller','seller_id','clean_salesroom','seller_id','key','1 → 0..n','Seller-to-shop key lookup; unmatched ids remain flagged by seller_found.'),
 ('K02','clean_salesroom','shop_id','clean_contract','shop_id','key','1 → 0..n','Shop master match; non-master contract shop ids are retained and flagged.'),
 ('K03','clean_salesroom','shop_id','clean_lead','shop_id','key','1 → 0..n','Shop lookup on leads; use shop_in_master to scope analysis.'),
 ('K04','clean_salesroom','shop_id','clean_emp_2_salesroom','shop_id','key','1 → 0..n','Assignment history by shop; no Employee dimension exists.'),
 ('K05','clean_contract','credit_case_id','clean_contract_product','credit_case_id','key','1 → 0..n','A contract can have multiple goods rows; aggregate before joining case-level measures.'),
 ('K06','clean_contract','credit_case_id','clean_contract_goods','credit_case_id','key','1 → 0..1','One-row-per-case goods summary; line 1 chosen by the smallest line_no.'),
 ('K07','clean_lead_finish_reason','finish_code','clean_lead','finish_code','transform','1 → 0..n','clean_lead.finish_code is mapped from result_code; code_lead_status is not the outcome.'),
 ('K08','clean_contract','credit_case_id','clean_lead','lead_credit_case_id','key','1 → 0..n','Sparse direct contract id on converted leads; not the general attribution rule.'),
 ('T01','clean_emp_2_salesroom','shop_id + valid_from/valid_to','clean_shop_staff_month','shop_id + month','transform','many → one/month','Assignment time is allocated to shop-months; dup_rank > 1 is retained but excluded from FTE.'),
 ('L01','clean_contract','client_id + product + dt_apply','lead_contract_attr','credit_case_id','logic','1 → 0..1','Candidate rule: same client, same product, date_assigned ≤ dt_apply; choose the latest eligible lead.'),
 ('L02','clean_lead','lead_row + dt_assigned','lead_contract_attr','lead_row','logic','1 → 0..n','Ties use the largest lead_row. This is the team’s deterministic tie-break, not an FK constraint.'),
 ('T02a','clean_salesroom','shop_id','dim_shop_all','shop_id + in_master','transform','union / lookup','Shop-id union source; in_master distinguishes ids present in the master.'),
 ('T02b','clean_contract','shop_id','dim_shop_all','contracts / booked','transform','union / aggregate','Adds every shop id observed in contracts and contract activity totals.'),
 ('T02c','clean_lead','shop_id','dim_shop_all','lead_rows / leads_w','transform','union / aggregate','Adds every non-null shop id observed in leads and weighted lead totals.'),
 ('T03a','clean_salesroom','shop_id + operating months','mart_shop_month','shop_id + month','transform','grid','Builds the master-shop monthly grid.'),
 ('T03b','clean_contract','shop_id + apply_month','mart_shop_month','applications / booked','transform','aggregate','Contract measures grouped by shop and application month.'),
 ('T03c','clean_lead','shop_id + assigned_month','mart_shop_month','leads_w','transform','weighted aggregate','Lead counts use sample weight and lead-assigned month.'),
 ('T04','lead_contract_attr','lead_shop_id + assigned_month','mart_shop_month','cross-shop measures','transform','weighted aggregate','Cross-sell measures use master-shop scope and a 90-day lead-to-apply window.'),
 ('T05','clean_shop_staff_month','shop_id + month','mart_shop_month','sa_fte / headcount','transform','shop-month join','Adds staffing measures at shop-month grain.'),
 ('Q01','r3_bronze + clean layer','row counts / totals / placeholders','dq_reconciliation','bronze_value ↔ clean_value','qa','comparison','29 checks: 24 PASS, 5 INFO, 0 FAIL. This is QA lineage, not a foreign key.'),
]
# Field-level routes. Each path begins/ends at the exact row port; lanes keep lines outside table bodies.
E=[
  dict(code='K01',src='seller',sf='seller_id',tgt='salesroom',tf='seller_id',kind='key',mode='lr',channel=500,card=True,child='many0',label=(500,130)),
  dict(code='K02',src='salesroom',sf='shop_id',tgt='contract',tf='shop_id',kind='key',mode='lr',channel=1000,card=True,child='many0',label=(1000,178)),
  dict(code='K03',src='salesroom',sf='shop_id',tgt='lead',tf='shop_id',kind='key',mode='top',lane=38,left=1000,right=1560,card=True,child='many0',label=(1280,38)),
  dict(code='K04',src='salesroom',sf='shop_id',tgt='staff',tf='shop_id',kind='key',mode='reverse_lr',channel=500,card=True,child='many0',label=(500,505)),
  dict(code='K05',src='contract',sf='credit_case_id',tgt='product',tf='credit_case_id',kind='key',mode='same_right',channel=1490,card=True,child='many0',label=(1490,365)),
  dict(code='K06',src='contract',sf='credit_case_id',tgt='goods',tf='credit_case_id',kind='key',mode='same_right',channel=1505,card=True,child='one0',label=(1505,610)),
  dict(code='K07',src='reason',sf='finish_code',tgt='lead',tf='finish_code',kind='transform',mode='same_left_reverse',channel=1500,label=(1540,450)),
  dict(code='K08',src='contract',sf='credit_case_id',tgt='lead',tf='lead_credit_case_id',kind='key',mode='lr',channel=1490,card=True,child='many0',label=(1490,260)),
  dict(code='T01',src='staff',sf='shop_id',tgt='staff_month',tf='shop_id',kind='transform',mode='lr',channel=500,label=(500,650)),
  dict(code='L01',src='contract',sf='credit_case_id',tgt='attr',tf='credit_case_id',kind='logic',mode='lr',channel=1490,label=(1490,655)),
  dict(code='L02',src='lead',sf='lead_row',tgt='attr',tf='lead_row',kind='logic',mode='same_right',channel=2040,label=(2040,600)),
  dict(code='T02a',src='salesroom',sf='shop_id',tgt='dim_shop',tf='in_master',kind='transform',mode='bottom_left',left=500,lane=930,label=(500,910)),
  dict(code='T02b',src='contract',sf='shop_id',tgt='dim_shop',tf='contracts / booked',kind='transform',mode='bottom_right_left',channel=1490,left=500,lane=950,label=(1000,945)),
  dict(code='T02c',src='lead',sf='shop_id',tgt='dim_shop',tf='lead_rows / leads_w',kind='transform',mode='bottom_right_left',channel=2040,left=500,lane=970,label=(1500,965)),
  dict(code='T03a',src='salesroom',sf='shop_id',tgt='mart',tf='shop_id + month',kind='transform',mode='top_to_left',channel=1000,lane=28,approach=2060,label=(900,28)),
  dict(code='T03b',src='contract',sf='shop_id',tgt='mart',tf='applications / booked',kind='transform',mode='top_to_left',channel=1505,lane=48,approach=2060,label=(1770,48)),
  dict(code='T03c',src='lead',sf='shop_id',tgt='mart',tf='leads_w',kind='transform',mode='lr',channel=2040,label=(2040,305)),
  dict(code='T04',src='attr',sf='lead_shop_id',tgt='mart',tf='cross-shop measures',kind='transform',mode='top_from_left',channel=1500,lane=63,approach=2060,label=(1850,63)),
  dict(code='T05',src='staff_month',sf='sa_fte',tgt='mart',tf='sa_fte / headcount',kind='transform',mode='top_from_left',channel=500,lane=68,approach=2060,label=(1300,68)),
  dict(code='Q01',src='bronze',sf='raw source',tgt='dq',tf='bronze_value',kind='qa',mode='same_right_reverse',channel=2560,label=(2560,920)),
 ]
byid={n['id']:n for n in N}
def esc(v): return html.escape(str(v),quote=True)
def fmt(v): return '—' if v is None else f'{v:,}'.replace(',','.')
def row_y(n,field):
 i=next(i for i,f in enumerate(n['fields']) if f[0]==field)
 return n['y']+HEAD_H+META_H+17+i*ROW_H
def port(node_id,field,side):
 n=byid[node_id]; return (n['x'] if side=='left' else n['x']+n['w'],row_y(n,field))
def route(e):
 src,tgt=byid[e['src']],byid[e['tgt']]
 mode=e['mode']; sy=row_y(src,e['sf']); ty=row_y(tgt,e['tf'])
 if mode=='lr': return [port(e['src'],e['sf'],'right'),(e['channel'],sy),(e['channel'],ty),port(e['tgt'],e['tf'],'left')], 'right','left'
 if mode=='top': return [port(e['src'],e['sf'],'right'),(e['left'],sy),(e['left'],e['lane']),(e['right'],e['lane']),(e['right'],ty),port(e['tgt'],e['tf'],'left')], 'right','left'
 if mode in ('same_right','same_right_reverse'):
  if mode=='same_right_reverse':
   return [port(e['src'],e['sf'],'right'),(e['channel'],sy),(e['channel'],ty),port(e['tgt'],e['tf'],'right')], 'right','right'
  return [port(e['src'],e['sf'],'right'),(e['channel'],sy),(e['channel'],ty),port(e['tgt'],e['tf'],'right')], 'right','right'
 if mode=='reverse_lr': return [port(e['src'],e['sf'],'left'),(e['channel'],sy),(e['channel'],ty),port(e['tgt'],e['tf'],'right')], 'left','right'
 if mode=='same_left_reverse': return [port(e['src'],e['sf'],'left'),(e['channel'],sy),(e['channel'],ty),port(e['tgt'],e['tf'],'left')], 'left','left'
 if mode=='top_to_left':
  return [port(e['src'],e['sf'],'right'),(e['channel'],sy),(e['channel'],e['lane']),(e['approach'],e['lane']),(e['approach'],ty),port(e['tgt'],e['tf'],'left')], 'right','left'
 if mode=='top_from_left':
  return [port(e['src'],e['sf'],'left'),(e['channel'],sy),(e['channel'],e['lane']),(e['approach'],e['lane']),(e['approach'],ty),port(e['tgt'],e['tf'],'left')], 'left','left'
 if mode=='bottom_left':
   approach=e.get('approach',e['left'])
   return [port(e['src'],e['sf'],'left'),(e['left'],sy),(e['left'],e['lane']),(approach,e['lane']),(approach,ty),port(e['tgt'],e['tf'],'right')], 'left','right'
 if mode=='bottom_right':
  return [port(e['src'],e['sf'],'right'),(e['channel'],sy),(e['channel'],e['lane']),(2590,e['lane']),(2590,ty),port(e['tgt'],e['tf'],'left')], 'right','left'
 if mode=='bottom_right_left':
  return [port(e['src'],e['sf'],'right'),(e['channel'],sy),(e['channel'],e['lane']),(e['left'],e['lane']),(e['left'],ty),port(e['tgt'],e['tf'],'right')], 'right','right'
 raise ValueError(mode)
# SVG diagram: field rows are rendered before entity cards; all line terminals align with source/target fields.
colors={'key':'#3d5a80','transform':'#7961a8','logic':'#a66b12','qa':'#748091'}
S=[f'<svg class="erd" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" role="img" aria-label="ERD lớp cleaning, đường nối gắn đúng field và ký hiệu bội số">', '<defs></defs>']
for e in E:
 pts,ss,ts=route(e); col=colors[e['kind']]; dash=' stroke-dasharray="8 5"' if e['kind'] in ('transform','logic') else (' stroke-dasharray="2 6"' if e['kind']=='qa' else '')
 d='M '+' L '.join(f'{x},{y}' for x,y in pts)
 note=next(r[7] for r in R if r[0]==e['code'])
 S.append(f'<g><title>{esc(e["code"]+" · "+note)}</title><path d="{d}" fill="none" stroke="{col}" stroke-width="1.8"{dash}/>')
 # ER cardinality ticks at the parent end, crow-foot/circle at the child end for key relationships.
 if e.get('card'):
  x,y=pts[0]; sign=1 if ss=='right' else -1
  S.append(f'<path d="M{x+sign*4},{y-6} v12 M{x+sign*9},{y-6} v12" stroke="{col}" stroke-width="1.6"/>')
 if e.get('child'):
  x,y=pts[-1]; sign=-1 if ts=='left' else 1
  if e['child']=='many0':
   root=x+sign*16; tip=x+sign*5
   S.append(f'<path d="M{root},{y} L{tip},{y} M{root},{y} L{tip},{y-7} M{root},{y} L{tip},{y+7}" fill="none" stroke="{col}" stroke-width="1.6"/>')
   circx=x+sign*23; S.append(f'<circle cx="{circx}" cy="{y}" r="3.5" fill="var(--card, #fff)" stroke="{col}" stroke-width="1.4"/>')
  else:
   barx=x+sign*5; S.append(f'<circle cx="{x+sign*15}" cy="{y}" r="3.5" fill="var(--card, #fff)" stroke="{col}" stroke-width="1.4"/><path d="M{barx},{y-7} v14" stroke="{col}" stroke-width="1.6"/>')
 else:
  # Arrow only for derived/logic flow; terminate just before the target field row.
  x,y=pts[-1]; px,py=pts[-2]; dx=0 if x==px else (1 if x>px else -1); dy=0 if y==py else (1 if y>py else -1)
  S.append(f'<path d="M{x-dx*8-4*dy},{y-dy*8+4*dx} L{x},{y} L{x-dx*8+4*dy},{y-dy*8-4*dx}" fill="none" stroke="{col}" stroke-width="1.8"/>')
 lx,ly=e['label']; S.append(f'<rect x="{lx-21}" y="{ly-10}" width="42" height="18" rx="8" fill="var(--card, #fff)" stroke="{col}"/><text x="{lx}" y="{ly+3}" text-anchor="middle" font-size="9.5" font-weight="700" fill="var(--text, #1f2933)">{e["code"]}</text></g>')
# Entity cards
for n in N:
 x,y,w,h=n['x'],n['y'],n['w'],n['h']; kind=n['kind']; fill={'dim':'#2f6fb0','fact':'#b9651c','derived':'#7253a1','mart':'#287a64','qa':'#506174','source':'#596575'}[kind]
 S.append(f'<g class="entity entity-{kind}" data-entity="{n["id"]}"><title>{esc(n["name"]+" · "+n["grain"]+" · "+fmt(n["rows"])+" dòng")}</title><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="5" fill="var(--card, #fff)" stroke="var(--ent-line, #8aa4c2)" stroke-width="1.3"/><path d="M{x},{y+34} v-29 a5,5 0 0 1 5,-5 h{w-10} a5,5 0 0 1 5,5 v29 z" fill="{fill}"/><text x="{x+12}" y="{y+22}" font-size="12.5" font-weight="700" fill="#fff">{esc(n["name"])}</text>')
 if n['rows'] is not None: S.append(f'<text x="{x+w-10}" y="{y+22}" text-anchor="end" font-size="10" fill="#fff">{fmt(n["rows"])} · {n["cols"]} cột</text>')
 S.append(f'<text x="{x+10}" y="{y+52}" font-size="10.5" fill="var(--muted, #616e7c)">{esc(n["grain"])}</text>')
 for i,(name,typ,badge) in enumerate(n['fields']):
  yy=y+HEAD_H+META_H+17+i*ROW_H; iskey=bool(badge and ('PK' in badge or 'FK' in badge or 'key' in badge))
  if iskey: S.append(f'<rect x="{x+1}" y="{yy-16}" width="{w-2}" height="22" fill="var(--key-bg, #f1f6fc)"/>')
  S.append(f'<line x1="{x+1}" y1="{yy+6}" x2="{x+w-1}" y2="{yy+6}" stroke="var(--row-line, #e4e9ef)" stroke-width=".8"/>')
  S.append(f'<text x="{x+9}" y="{yy}" font-size="9.8" fill="var(--muted, #616e7c)">{esc(typ)}</text><text x="{x+83}" y="{yy}" font-size="10.2" font-weight="{"700" if iskey else "400"}" fill="{"var(--accent, #2f6fb0)" if iskey else "var(--text, #1f2933)"}" font-family="ui-monospace,Consolas,monospace">{esc(name)}</text><text x="{x+w-9}" y="{yy}" text-anchor="end" font-size="9.3" fill="var(--muted, #616e7c)">{esc(badge)}</text>')
 S.append('</g>')
S.append('</svg>'); svg=''.join(S)
(OUT/'R3_CLEANING_ERD.svg').write_text(svg,encoding='utf-8')

# Data used by the web page detail table.
entities={n['name']:{'title':n['name'],'grain':n['grain'],'pk':next((f[0] for f in n['fields'] if 'PK' in f[2]),'composite / no guaranteed PK'),'n_cols':n['cols']} for n in N if n['id']!='bronze'}
tables=[{'table':n['name'],'rows':n['rows']} for n in N if n['id']!='bronze']
rels=[{'code':r[0],'parent':r[1],'parent_col':r[2],'child':r[3],'child_col':r[4],'kind':r[5],'cardinality':r[6],'note':r[7]} for r in R]
facts=[
 {'class':'warn','title':'Không xóa dòng fact khi làm sạch','body':'clean_contract giữ đủ 3.775.371 hồ sơ; clean_lead giữ đủ 6.130.637 dòng. Giá trị thiếu/sentinel được chuẩn hóa và gắn cờ.'},
 {'class':'','title':'Lead UUID không phải khóa duy nhất','body':'lead_row nhận diện dòng nguồn; is_latest_offer đánh dấu offer mới nhất theo UUID + product nhưng không xóa dòng. Tổng lead dùng trọng số w.'},
 {'class':'warn','title':'Lead → contract là quy tắc ghép nghiệp vụ','body':'Cùng client_id + product, date_assigned ≤ dt_apply; chọn lead mới nhất và tie-break bằng lead_row lớn nhất. Đây không phải FK vật lý.'},
 {'class':'','title':'Mã shop ngoài master vẫn được giữ','body':'dim_shop_all hợp nhất mã từ contract, leads và salesroom. in_master đánh dấu phạm vi; không suy diễn shop ngoài danh mục là online.'},
 {'class':'','title':'Không có bảng Employee','body':'clean_emp_2_salesroom là lịch sử phân công SA theo thời hạn. Dòng trùng được giữ và gắn dup_rank; bảng tháng tính FTE theo shop.'},
 {'class':'','title':'Sentinel ngày và khả năng quan sát FPD','body':'date_sign = 3000-01-01 đổi thành NULL; valid_to sentinel thành NULL kèm is_open_ended. FPD chỉ observable cho hồ sơ booked nộp trước 01/08/2026.'},
 {'class':'warn','title':'Đối soát lớp clean','body':'dq_reconciliation: 29 kiểm tra, 24 PASS, 5 INFO, 0 FAIL. INFO được giữ lại để giải thích vấn đề; các nhóm có thể chồng lấn.'},
]
D={'generated_at':'2026-10-21','tables':tables,'entities':entities,'relationships':rels,'facts':facts,'svg':svg}
(OUT/'cleaning_erd.js').write_text('window.D_CLEAN = '+json.dumps(D,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')

# Editable diagrams.net file with nodes anchored by field-row coordinates and routed orthogonal edges.
mx=ET.Element('mxfile',{'host':'app.diagrams.net','modified':'2026-10-21T10:00:00.000Z','agent':'Codex','version':'24.7.17','type':'device'})
diag=ET.SubElement(mx,'diagram',{'id':'r3-cleaning-erd','name':'R3 Cleaning ERD'})
gm=ET.SubElement(diag,'mxGraphModel',{'dx':str(W),'dy':str(H),'grid':'1','gridSize':'10','guides':'1','tooltips':'1','connect':'1','arrows':'1','fold':'1','page':'1','pageScale':'1','pageWidth':str(W),'pageHeight':str(H),'math':'0','shadow':'0'})
root=ET.SubElement(gm,'root'); ET.SubElement(root,'mxCell',{'id':'0'}); ET.SubElement(root,'mxCell',{'id':'1','parent':'0'})
for n in N:
 fill={'dim':'#2f6fb0','fact':'#b9651c','derived':'#7253a1','mart':'#287a64','qa':'#506174','source':'#596575'}[n['kind']]
 rows='<br>'.join(f'{esc(t):10s}  <font face="monospace">{esc(f)}</font>  <font color="#667085">{esc(b)}</font>' for f,t,b in n['fields'])
 count=f'<br><br><b>{fmt(n["rows"])} rows · {n["cols"]} cols</b>' if n['rows'] is not None else ''
 label=f'<b><font color="white">{esc(n["name"])}</font></b><br><font color="#667085">{esc(n["grain"])}</font><br>{rows}{count}'
 style=f'rounded=0;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor={fill};fontColor=#1f2933;align=left;verticalAlign=top;spacing=8;'
 c=ET.SubElement(root,'mxCell',{'id':n['id'],'value':label,'style':style,'vertex':'1','parent':'1'}); ET.SubElement(c,'mxGeometry',{'x':str(n['x']),'y':str(n['y']),'width':str(n['w']),'height':str(n['h']),'as':'geometry'})
for i,e in enumerate(E,1):
 pts,ss,ts=route(e); src,tgt=byid[e['src']],byid[e['tgt']]
 sc=e['kind']=='key'; color=colors[e['kind']]; style=f'edgeStyle=orthogonalEdgeStyle;rounded=0;orthogonalLoop=1;jettySize=auto;html=1;strokeWidth=1.5;strokeColor={color};exitX={1 if ss=="right" else 0};exitY={(pts[0][1]-src["y"])/src["h"]:.4f};entryX={0 if ts=="left" else 1};entryY={(pts[-1][1]-tgt["y"])/tgt["h"]:.4f};'
 if sc: style+='startArrow=ERone;endArrow='+('ERzeroToMany;' if e.get('child')=='many0' else 'ERzeroToOne;')
 else: style+='endArrow=block;endFill=1;'
 if e['kind'] in ('transform','logic','qa'): style+='dashed=1;'
 c=ET.SubElement(root,'mxCell',{'id':'e'+str(i),'value':e['code'],'style':style,'edge':'1','parent':'1','source':e['src'],'target':e['tgt']})
 geo=ET.SubElement(c,'mxGeometry',{'relative':'1','as':'geometry'}); arr=ET.SubElement(geo,'Array',{'as':'points'})
 for x,y in pts[1:-1]: ET.SubElement(arr,'mxPoint',{'x':str(x),'y':str(y)})
ET.indent(mx,space='  '); ET.ElementTree(mx).write(OUT/'R3_CLEANING_ERD.drawio',encoding='utf-8',xml_declaration=True)
print('Generated field-anchored ERD SVG, dashboard data and editable draw.io source.')
