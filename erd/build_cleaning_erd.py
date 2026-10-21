from pathlib import Path
import json, html, xml.etree.ElementTree as ET

OUT = Path(__file__).resolve().parent
# Row and column counts queried from r3_sandbox_vu on 2026-10-21.
nodes = [
 dict(id='seller',name='clean_seller',kind='dim',x=50,y=130,w=390,h=190,rows=11639,cols=8,grain='1 dòng / seller',pk='seller_id',fields=['seller_id · PK','seller_model / seller_status','seller_type / seller_product','seller_province / seller_area']),
 dict(id='salesroom',name='clean_salesroom',kind='dim',x=50,y=430,w=390,h=250,rows=14231,cols=15,grain='1 dòng / shop master',pk='shop_id',fields=['shop_id · PK','seller_id · join seller','category / model / status','dt_start / dt_end','province / area / seller_found']),
 dict(id='reason',name='clean_lead_finish_reason',kind='dim',x=50,y=830,w=390,h=180,rows=12,cols=3,grain='1 dòng / mã kết thúc lead',pk='finish_id',fields=['finish_id · mã nguồn','finish_code','finish_desc']),
 dict(id='bronze',name='r3_bronze · nguồn BTC',kind='source',x=50,y=1330,w=390,h=165,rows=None,cols=None,grain='7 bảng gốc · giữ nguyên',pk='không áp dụng',fields=['Dữ liệu thô không bị sửa','Đối soát qua dq_reconciliation']),
 dict(id='contract',name='clean_contract',kind='fact',x=600,y=120,w=390,h=300,rows=3775371,cols=31,grain='1 dòng / credit case',pk='credit_case_id',fields=['credit_case_id · PK','shop_id · join shop','client_id / product','dt_apply / dt_sign','status_group / is_booked','shop_in_master / FPD flags']),
 dict(id='lead',name='clean_lead',kind='fact',x=600,y=540,w=390,h=320,rows=6130637,cols=27,grain='1 dòng / dòng lead nguồn',pk='lead_row (surrogate)',fields=['lead_row · source row id','lead_uuid · không duy nhất','client_id / product','shop_id / dt_assigned','finish_code / lead_credit_case_id','w / is_latest_offer flags']),
 dict(id='staff',name='clean_emp_2_salesroom',kind='fact',x=600,y=980,w=390,h=260,rows=275856,cols=9,grain='1 dòng / lịch sử phân công SA',pk='không có PK được đảm bảo',fields=['employee_id / shop_id','role / status_code','valid_from / valid_to','is_open_ended','dup_rank / validity flag']),
 dict(id='product',name='clean_contract_product',kind='fact',x=1150,y=1450,w=390,h=220,rows=784902,cols=6,grain='1 dòng / dòng hàng hóa',pk='credit_case_id + line_no',fields=['credit_case_id · join contract','line_no · thứ tự nguồn','producer / goods_category','goods_type / goods_group']),
 dict(id='goods',name='clean_contract_goods',kind='derived',x=1150,y=140,w=390,h=220,rows=779941,cols=5,grain='1 dòng / credit case có hàng hóa',pk='credit_case_id',fields=['credit_case_id · PK / FK','goods_lines','goods_group_line1','goods_groups_distinct','flag_goods_group_missing']),
 dict(id='staff_month',name='clean_shop_staff_month',kind='derived',x=1150,y=470,w=390,h=220,rows=161306,cols=5,grain='1 dòng / shop × tháng',pk='shop_id + month',fields=['shop_id + month · khóa grain','sa_headcount / sa_fte','sa_dedicated','từ lịch sử SA + khoảng hiệu lực']),
 dict(id='attr',name='lead_contract_attr',kind='derived',x=1150,y=820,w=390,h=270,rows=260674,cols=20,grain='1 dòng / contract được ghép lead',pk='credit_case_id',fields=['credit_case_id · PK / contract','lead_row · lead được chọn','client_id + product','date_assigned ≤ dt_apply','last touch; tie → lead_row lớn nhất','same_shop / master-scope flags']),
 dict(id='dim_shop',name='dim_shop_all',kind='derived',x=1150,y=1170,w=390,h=250,rows=32524,cols=17,grain='1 dòng / mã shop quan sát được',pk='shop_id',fields=['shop_id · PK','in_master / category','contract & booked counts','lead rows / weighted leads','union contract ∪ leads ∪ master']),
 dict(id='mart',name='mart_shop_month',kind='mart',x=1700,y=430,w=390,h=310,rows=136093,cols=30,grain='1 dòng / shop master × tháng',pk='shop_id + month',fields=['shop_id + month · khóa grain','applications / booked','product mix / credit','lead volume (weighted)','cross-shop attributed leads','staffing FTE / FPD measures']),
 dict(id='dq',name='dq_reconciliation',kind='qa',x=1700,y=1120,w=390,h=220,rows=29,cols=6,grain='1 dòng / kiểm tra đối soát',pk='check_no',fields=['check_no · thứ tự kiểm tra','check_name / status','bronze_value / clean_value','24 PASS · 5 INFO · 0 FAIL']),
]
rels = [
 dict(code='K01',parent='clean_seller',pcol='seller_id',child='clean_salesroom',ccol='seller_id',kind='key',note='Nối seller với shop; clean_salesroom giữ cờ seller_found cho mã không khớp.'),
 dict(code='K02',parent='clean_salesroom',pcol='shop_id',child='clean_contract',ccol='shop_id',kind='key',note='Nối shop master với hồ sơ; ngoài master vẫn được giữ và gắn shop_in_master = 0.'),
 dict(code='K03',parent='clean_salesroom',pcol='shop_id',child='clean_lead',ccol='shop_id',kind='key',note='Tra cứu shop cho lead; dùng shop_in_master để giới hạn phạm vi phân tích.'),
 dict(code='K04',parent='clean_salesroom',pcol='shop_id',child='clean_emp_2_salesroom',ccol='shop_id',kind='key',note='Lịch sử phân công nhân viên theo shop; không có bảng Employee riêng.'),
 dict(code='K05',parent='clean_contract',pcol='credit_case_id',child='clean_contract_product',ccol='credit_case_id + line_no',kind='key',note='Một hồ sơ có thể có nhiều dòng hàng; tổng hợp trước khi join vào measure cấp hồ sơ.'),
 dict(code='K06',parent='clean_contract',pcol='credit_case_id',child='clean_contract_goods',ccol='credit_case_id',kind='transform',note='Tổng hợp contract_product về một dòng/hồ sơ; goods_group_line1 lấy theo line_no nhỏ nhất.'),
 dict(code='K07',parent='clean_lead_finish_reason',pcol='finish_id → finish_code',child='clean_lead',ccol='result_code → finish_code',kind='transform',note='Lý do lead ánh xạ từ result; code_lead_status không dùng làm outcome.'),
 dict(code='T01',parent='clean_emp_2_salesroom',pcol='employee_id + shop_id + thời hạn',child='clean_shop_staff_month',ccol='shop_id + month',kind='transform',note='Tính phần thời gian trong tháng; dup_rank = 1; FTE của SA chia giữa các shop được phân công.'),
 dict(code='L01',parent='clean_contract',pcol='client_id + product + dt_apply',child='lead_contract_attr',ccol='credit_case_id',kind='logic',note='Ứng viên ghép cùng client + product, date_assigned ≤ dt_apply; một dòng attribution mỗi hợp đồng.'),
 dict(code='L02',parent='clean_lead',pcol='lead_row + client_id + product + dt_assigned',child='lead_contract_attr',ccol='lead_row',kind='logic',note='Chọn lead hợp lệ mới nhất; nếu đồng thời thì lead_row lớn nhất. Tie-break là quy tắc xác định của nhóm.'),
 dict(code='T02',parent='clean_salesroom + clean_contract + clean_lead',pcol='shop_id',child='dim_shop_all',ccol='shop_id',kind='transform',note='Hợp nhất mọi mã shop nhìn thấy trong contract, leads và shop master; giữ mã ngoài master, không gán nhãn online.'),
 dict(code='T03',parent='clean_salesroom + clean_contract + clean_lead',pcol='shop_id × tháng',child='mart_shop_month',ccol='shop_id + month',kind='transform',note='Lưới theo shop master và tháng; mart chỉ bao phủ shop trong master.'),
 dict(code='T04',parent='lead_contract_attr',pcol='lead_shop_id + assigned_month',child='mart_shop_month',ccol='lead conversion / cross-shop measures',kind='transform',note='Đếm có trọng số theo tháng phân lead; cross-sell dùng shop master và cửa sổ 90 ngày.'),
 dict(code='T05',parent='clean_shop_staff_month',pcol='shop_id + month',child='mart_shop_month',ccol='sa_fte / headcount',kind='transform',note='Mart nhận FTE/headcount đã tổng hợp từ lịch sử phân công ở grain shop-tháng.'),
 dict(code='Q01',parent='r3_bronze + clean layer',pcol='row counts / totals / placeholders',child='dq_reconciliation',ccol='bronze_value ↔ clean_value',kind='qa',note='PASS/INFO/FAIL đối chiếu bronze với clean; đây là lineage kiểm tra, không phải khóa ngoại.'),
]
paths = {
 'K01':('M245 320 L245 430',(245,370)),
 'K02':('M440 500 L520 500 L520 240 L600 240',(520,385)),
 'K03':('M440 565 L520 565 L600 630',(520,585)),
 'K04':('M440 625 L520 625 L520 1100 L600 1100',(520,920)),
 'K05':('M990 310 L1060 310 L1060 1550 L1150 1550',(1060,930)),
 'K06':('M990 385 L1090 385 L1090 250 L1150 250',(1090,325)),
 'K07':('M440 900 L540 900 L540 760 L600 760',(540,840)),
 'T01':('M990 1100 L1070 1100 L1070 580 L1150 580',(1070,820)),
 'L01':('M990 400 L1110 400 L1110 900 L1150 900',(1110,650)),
 'L02':('M990 760 L1090 760 L1090 1000 L1150 1000',(1090,875)),
 'T02':('M440 650 L500 650 L500 1400 L1100 1400 L1100 1300 L1150 1300',(500,1060)),
 'T03':('M990 210 L1640 210 L1640 500 L1700 500',(1640,355)),
 'T04':('M1540 950 L1640 950 L1640 720 L1700 720',(1640,845)),
 'T05':('M1540 580 L1620 580 L1620 650 L1700 650',(1620,615)),
 'Q01':('M440 1400 L500 1400 L500 1700 L2160 1700 L2160 1220 L2090 1220',(2160,1320)),
}
colors={'key':'var(--edge)','transform':'#7961a8','logic':'#a66b12','qa':'#748091'}
def esc(s): return html.escape(str(s),quote=True)
def fmt(n): return '—' if n is None else f'{n:,}'.replace(',','.')
W,H=2260,1740
sv=[f'<svg class="erd" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" role="img" aria-label="ERD lớp cleaning Round 3, 13 bảng làm sạch và bảng dẫn xuất"><defs>']
for k,c in colors.items(): sv.append(f'<marker id="arr-{k}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0 L10 5 L0 10 z" fill="{c}"/></marker>')
sv += ['</defs>','<text x="50" y="52" font-size="22" font-weight="700" fill="var(--text)">LỚP CLEANING · TỪ DỮ LIỆU THÔ ĐẾN BẢNG PHÂN TÍCH</text>','<text x="50" y="82" font-size="13" fill="var(--muted)">Nét liền = nối theo khóa · Nét đứt = biến đổi/tổng hợp · Nét chấm = logic nghiệp vụ hoặc đối soát</text>']
for r in rels:
 p,(x,y)=paths[r['code']]; col=colors[r['kind']]; dash=' stroke-dasharray="8 6"' if r['kind']=='transform' else (' stroke-dasharray="3 6"' if r['kind'] in ('logic','qa') else '')
 sv.append(f'<g><title>{esc(r["code"]+": "+r["note"])}</title><path d="{p}" fill="none" stroke="{col}" stroke-width="2"{dash} marker-end="url(#arr-{r["kind"]})"/><rect x="{x-22}" y="{y-12}" width="44" height="22" rx="8" fill="var(--card)" stroke="{col}"/><text x="{x}" y="{y+4}" text-anchor="middle" font-size="10.5" font-weight="700" fill="var(--text)">{r["code"]}</text></g>')
for n in nodes:
 x,y,w,h=n['x'],n['y'],n['w'],n['h']; k=n['kind']; fill={'dim':'var(--hdr-dim)','fact':'var(--hdr-fact)','derived':'#7253a1','mart':'#287a64','qa':'#506174','source':'#596575'}[k]
 sv.append(f'<g><title>{esc(n["name"]+" · "+n["grain"]+" · "+fmt(n["rows"])+" dòng")}</title><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="10" fill="var(--card)" stroke="var(--ent-line)" stroke-width="1.5"/><path d="M{x},{y+38} v-28 a10,10 0 0 1 10,-10 h{w-20} a10,10 0 0 1 10,10 v28 z" fill="{fill}"/><text x="{x+14}" y="{y+25}" font-size="14" font-weight="700" fill="#fff">{esc(n["name"])}</text>')
 if n['rows'] is not None: sv.append(f'<text x="{x+w-12}" y="{y+25}" text-anchor="end" font-size="10.5" fill="#fff">{fmt(n["rows"])} dòng · {n["cols"]} cột</text>')
 sv.append(f'<text x="{x+14}" y="{y+58}" font-size="11.5" fill="var(--muted)">{esc(n["grain"])} · khóa: {esc(n["pk"])}</text>')
 for i,f in enumerate(n['fields']):
  yy=y+84+i*26; sv.append(f'<line x1="{x+10}" y1="{yy-15}" x2="{x+w-10}" y2="{yy-15}" stroke="var(--row-line)"/><text x="{x+15}" y="{yy}" font-size="11.5" font-family="ui-monospace,Consolas,monospace" fill="var(--text)">{esc(f)}</text>')
 sv.append('</g>')
sv.append('</svg>')
svg=''.join(sv)
for var, fallback in {'--card':'#ffffff','--edge':'#3d5a80','--ent-line':'#8aa4c2','--text':'#1f2933','--muted':'#616e7c','--row-line':'#e4e9ef','--hdr-dim':'#2f6fb0','--hdr-fact':'#b9651c'}.items(): svg=svg.replace(f'var({var})',f'var({var}, {fallback})')
(OUT/'R3_CLEANING_ERD.svg').write_text(svg,encoding='utf-8')
entities={n['name']:{'title':n['name'],'grain':n['grain'],'pk':n['pk'],'n_cols':n['cols']} for n in nodes if n['id']!='bronze'}
tables=[{'table':n['name'],'rows':n['rows']} for n in nodes if n['id']!='bronze']
jsrels=[{'code':r['code'],'parent':r['parent'],'parent_col':r['pcol'],'child':r['child'],'child_col':r['ccol'],'kind':r['kind'],'note':r['note']} for r in rels]
facts=[
 {'class':'warn','title':'Không xóa dòng fact khi làm sạch','body':'clean_contract giữ đủ 3.775.371 hồ sơ; clean_lead giữ đủ 6.130.637 dòng. Giá trị thiếu/sentinel được chuẩn hóa và gắn cờ để đối soát.'},
 {'class':'','title':'Lead UUID không phải khóa duy nhất','body':'Giữ các dòng lặp trong clean_lead; lead_row nhận diện dòng nguồn, còn is_latest_offer đánh dấu offer mới nhất theo UUID + product. Mọi tổng lead cần dùng trọng số w.'},
 {'class':'warn','title':'Lead → contract là quy tắc ghép nghiệp vụ','body':'lead_contract_attr ghép cùng client_id + product và date_assigned ≤ dt_apply. Mỗi hồ sơ lấy lead hợp lệ mới nhất; đồng thời thì chọn lead_row lớn nhất. Đây là tie-break, không phải FK vật lý.'},
 {'class':'','title':'Mã shop ngoài master vẫn được giữ','body':'dim_shop_all hợp nhất shop_id từ contract, leads và salesroom. in_master phân biệt phạm vi danh mục; không suy diễn mã ngoài danh mục là kênh online.'},
 {'class':'','title':'Không có bảng Employee','body':'clean_emp_2_salesroom là lịch sử phân công SA theo thời hạn. Dòng trùng được giữ và gắn dup_rank; clean_shop_staff_month quy đổi thời gian phân công thành FTE theo shop-tháng.'},
 {'class':'','title':'Sentinel ngày và khả năng quan sát FPD','body':'date_sign = 3000-01-01 được đổi thành NULL; valid_to sentinel thành NULL kèm is_open_ended. FPD chỉ observable cho hồ sơ booked nộp trước 01/08/2026.'},
 {'class':'warn','title':'Đối soát lớp clean','body':'dq_reconciliation: 29 kiểm tra, 24 PASS, 5 INFO, 0 FAIL. INFO là vấn đề đã nhận diện và giữ cờ; các nhóm có thể chồng lấn.'},
]
clean={'generated_at':'2026-10-21','tables':tables,'entities':entities,'relationships':jsrels,'facts':facts,'svg':svg}
(OUT/'cleaning_erd.js').write_text('window.D_CLEAN = '+json.dumps(clean,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')

# Editable diagrams.net (draw.io) file.
mx=ET.Element('mxfile',{'host':'app.diagrams.net','modified':'2026-10-21T10:00:00.000Z','agent':'Codex','version':'24.7.17','type':'device'})
diag=ET.SubElement(mx,'diagram',{'id':'r3-cleaning-erd','name':'R3 Cleaning ERD'})
gm=ET.SubElement(diag,'mxGraphModel',{'dx':str(W),'dy':str(H),'grid':'1','gridSize':'10','guides':'1','tooltips':'1','connect':'1','arrows':'1','fold':'1','page':'1','pageScale':'1','pageWidth':str(W),'pageHeight':str(H),'math':'0','shadow':'0'})
root=ET.SubElement(gm,'root'); ET.SubElement(root,'mxCell',{'id':'0'}); ET.SubElement(root,'mxCell',{'id':'1','parent':'0'})
for n in nodes:
 fill={'dim':'#2f6fb0','fact':'#b9651c','derived':'#7253a1','mart':'#287a64','qa':'#506174','source':'#596575'}[n['kind']]
 count=(f'<br><br><b>{fmt(n["rows"])} dòng · {n["cols"]} cột</b>' if n['rows'] is not None else '')
 label='<b>'+html.escape(n['name'])+'</b><br><font color="#667085">'+html.escape(n['grain'])+'</font><br><br>'+ '<br>'.join(html.escape(v) for v in n['fields'])+count
 style=f'rounded=1;whiteSpace=wrap;html=1;fillColor=#ffffff;strokeColor={fill};fontColor=#1f2933;align=left;verticalAlign=top;spacing=10;'
 c=ET.SubElement(root,'mxCell',{'id':n['id'],'value':label,'style':style,'vertex':'1','parent':'1'}); ET.SubElement(c,'mxGeometry',{'x':str(n['x']),'y':str(n['y']),'width':str(n['w']),'height':str(n['h']),'as':'geometry'})
edge_nodes={'K01':('seller','salesroom'),'K02':('salesroom','contract'),'K03':('salesroom','lead'),'K04':('salesroom','staff'),'K05':('contract','product'),'K06':('contract','goods'),'K07':('reason','lead'),'T01':('staff','staff_month'),'L01':('contract','attr'),'L02':('lead','attr'),'T02':('salesroom','dim_shop'),'T03':('contract','mart'),'T04':('attr','mart'),'T05':('staff_month','mart'),'Q01':('bronze','dq')}
for i,r in enumerate(rels,1):
 s,t=edge_nodes[r['code']]; style='edgeStyle=orthogonalEdgeStyle;rounded=1;orthogonalLoop=1;jettySize=auto;html=1;endArrow=block;endFill=1;strokeWidth=2;strokeColor='+colors[r['kind']]
 if r['kind'] in ('transform','logic','qa'): style+=';dashed=1'
 c=ET.SubElement(root,'mxCell',{'id':'e'+str(i),'value':r['code']+' · '+html.escape(r['pcol']+' → '+r['ccol']),'style':style,'edge':'1','parent':'1','source':s,'target':t}); ET.SubElement(c,'mxGeometry',{'relative':'1','as':'geometry'})
ET.indent(mx,space='  '); ET.ElementTree(mx).write(OUT/'R3_CLEANING_ERD.drawio',encoding='utf-8',xml_declaration=True)
print('Generated R3 cleaning ERD SVG, data module, and editable draw.io file')
