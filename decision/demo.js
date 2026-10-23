/* Business demo layer. Uses the existing v4 engine and data without changing either. */
(() => {
  'use strict';
  const q = selector => document.querySelector(selector);
  const txt = (en, vi) => (window.BI10_LANG || document.documentElement.lang) === 'vi' ? vi : en;
  const safe = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const number = (value, digits = 1, minimumDigits = 0) => new Intl.NumberFormat((window.BI10_LANG || document.documentElement.lang) === 'vi' ? 'vi-VN' : 'en-US', {maximumFractionDigits: digits, minimumFractionDigits: minimumDigits}).format(Number(value) || 0);
  const total = (rows, key) => rows.reduce((acc, row) => acc + (Number(row[key]) || 0), 0);
  const badge = kind => `<span class="demo-badge" data-kind="${kind.toLowerCase()}">${txt(kind, {Observed:'Quan sát',Modelled:'Mô hình',Assumed:'Giả định',Proposed:'Đề xuất'}[kind])}</span>`;
  const button = (label, attributes = '') => `<button ${/\btype=/.test(attributes)?'':'type="button"'} ${/\bclass=/.test(attributes)?'':'class="demo-button"'} ${attributes}>${label}</button>`;
  const wave = SHOPS.filter(s => s.team_rank != null && s.team_rank <= 500);
  const reference = run(wave, 0, 500, {}, params());
  let current = typeof LAST !== 'undefined' && LAST ? {k: LAST.k, ke: LAST.R.ke, p: LAST.p, rows: LAST.rows} : {k:reference.k,ke:reference.ke,p:params(),rows:wave};
  let ranking = 'booking';
  let activeChallenge = 'programme';
  let pilotChoice = 'scale';
  const economics = {contribution:'',programme:'',fte:''};
  let returnFocus = null;

  const page = document.createElement('section');
  page.id = 'page-executive';
  page.className = 'page';
  q('main').prepend(page);
  const toolbarHost = document.createElement('div');
  toolbarHost.className = 'demo-shell';
  q('main').prepend(toolbarHost);
  const nav = document.createElement('button');
  nav.type = 'button';
  nav.dataset.page = 'executive';
  q('nav').prepend(nav);
  nav.onclick = () => showPage('executive');

  function showPage(name) {
    if (name !== 'executive') {
      const target = q(`nav button[data-page="${name}"]`);
      if (target) target.click();
      return;
    }
    document.querySelectorAll('nav button[data-page]').forEach(b => b.classList.toggle('on', b.dataset.page === name));
    document.querySelectorAll('section.page').forEach(s => s.classList.toggle('on', s.id === `page-${name}`));
    q('#filters').style.display = 'none';
  }

  function decisionLabel(verdict) {
    return verdict === 'APPROVE' ? txt('Recommended for pilot', 'Khuyến nghị thử nghiệm') : verdict === 'REVISE' ? txt('Revise the plan', 'Điều chỉnh kế hoạch') : txt('Guardrail breached', 'Vi phạm điều kiện bảo vệ');
  }

  function render() {
    nav.textContent = txt('0 · Decision briefing', '0 · Đề xuất quyết định');
    const r = reference.k;
    const metrics = [
      [txt('Current run-rate','Doanh số hiện tại'), total(SHOPS,'actual'), 'Observed'],
      [txt('Baseline · BAU','Kịch bản cơ sở · BAU'), total(SHOPS,'bau'), 'Modelled'],
      [txt('Attainable · peer P75','Năng lực khả thi · P75'), total(SHOPS,'attainable'), 'Modelled'],
      [txt('Macro addressable ceiling','Trần dung lượng vĩ mô'), total(SHOPS,'ceiling'), 'Modelled']
    ];
    const closing = r.byLever.APPROVAL?.uplift || 0;
    const quality = r.byLever.QUALITY_FIX?.uplift || 0;
    const tested = closing + quality;
    const gap = total(wave,'gap');
    page.innerHTML = `<div class="demo-shell">
      <div class="demo-toolbar"><span>${txt('A three-minute decision briefing','Luồng quyết định trong ba phút')}</span><div class="demo-actions">
        ${button(txt('1 · Decide','1 · Quyết định'),'data-demo-scroll="demo-decision"')}
        ${button(txt('2 · Challenge','2 · Thử thách'),'data-demo-scroll="demo-challenge"')}
        ${button(txt('3 · Prove','3 · Kiểm chứng'),'data-demo-scroll="demo-pilot"')}
        ${button(txt('Presenter mode','Chế độ trình chiếu'),`id="demo-presenter" aria-pressed="${document.body.classList.contains('demo-presenter')}"`)}
        ${button(txt('Reset demo','Đặt lại demo'),'data-demo-reset')}</div></div>
      <div class="demo-hero" id="demo-decision"><div class="demo-eyebrow">${txt('THE DECISION TODAY','QUYẾT ĐỊNH HÔM NAY')}</div>
        <h2>${txt('Start with a closing-quality pilot.','Bắt đầu bằng thử nghiệm cải thiện chất lượng hoàn tất hồ sơ.')}</h2>
        <p>${txt('Give priority shops a measurable next action. Test incremental growth before committing to a network rollout.','Giao hành động cụ thể cho shop ưu tiên. Kiểm chứng tăng trưởng tăng thêm trước khi triển khai toàn mạng lưới.')}</p>
        <div class="demo-actions">${button(txt('Challenge this decision →','Thử thách quyết định →'),'class="demo-button primary" data-demo-scroll="demo-challenge"')}${button(txt('Explore the evidence','Xem bằng chứng'),'data-demo-page="network"')}</div>
      </div>
      <div class="demo-grid">${metrics.map(([label,value,kind])=>`<article class="demo-card demo-kpi">${badge(kind)}<div>${label}</div><strong>${number(value/1000,1,1)}k</strong><small>${txt('contracts / month · all scored shops','hợp đồng / tháng · toàn bộ shop có điểm')}</small></article>`).join('')}</div>
      <p class="demo-muted">${txt('Levels are summed from the v4 shop data; rounded values can make the displayed difference differ from the exact gap. The macro ceiling is context, not a sales target.','Các mức được cộng từ dữ liệu shop v4; số làm tròn có thể khiến chênh lệch hiển thị khác dư địa chính xác. Trần vĩ mô là bối cảnh, không phải chỉ tiêu bán hàng.')}</p>
      <div class="demo-split"><article class="demo-card"><div class="demo-eyebrow">${txt('PROPOSED FIRST MOVE','BƯỚC ĐẦU ĐỀ XUẤT')}</div><h3>${txt('What would we authorise?','Chúng ta sẽ phê duyệt việc gì?')}</h3>
        <dl class="demo-story"><dt>${txt('Where','Phạm vi')}</dt><dd>${txt('Wave 1 · top 500 priority shops','Wave 1 · 500 shop ưu tiên đầu tiên')} (${number(wave.length,0)} ${txt('in the data','shop trong dữ liệu')}).</dd>
        <dt>${txt('Resources','Nguồn lực')}</dt><dd>${txt('Up to 500 programme slots, no additional FTE.','Tối đa 500 suất chương trình, không bổ sung FTE.')} ${number(r.slotsUsed,0)} ${txt('slots allocated by eligibility.','suất được phân bổ theo điều kiện phù hợp.')}</dd>
        <dt>${txt('Expected outcome','Kỳ vọng')}</dt><dd>${badge('Modelled')} +${number(r.uplift)} ${txt('contracts / month; conservative case','hợp đồng / tháng; trường hợp bảo thủ')} +${number(r.uplift05)}.</dd></dl>
        <p class="demo-muted">${txt('Model outputs describe a scenario. They are not measured intervention effects.','Kết quả mô hình mô tả một kịch bản; chưa phải tác động can thiệp được đo lường.')}</p></article>
      <article class="demo-card"><div class="demo-eyebrow">${txt('APPROVAL CONDITIONS','ĐIỀU KIỆN TRIỂN KHAI')}</div><h3>${txt('Release learning budget first.','Ưu tiên ngân sách để học hỏi.')}</h3>
        <ul><li>${txt('Confirm shop-level operational issues and assign an owner.','Xác minh vướng mắc vận hành tại shop và giao người phụ trách.')}</li><li>${txt('Pre-register the comparison, costs and quality guardrails.','Chốt trước nhóm so sánh, chi phí và điều kiện chất lượng.')}</li><li>${txt('Scale after incremental impact and mature credit quality are demonstrated.','Mở rộng sau khi chứng minh tác động tăng thêm và chất lượng khoản vay đủ thời gian quan sát.')}</li></ul>
        ${button(txt('Open the pilot design','Mở thiết kế thử nghiệm'),'data-demo-page="valid"')}</article></div>
      <section class="demo-card" id="demo-challenge"><div class="demo-eyebrow">${txt('JUDGES’ CHALLENGE','THỬ THÁCH TỪ BGK')}</div><h3>${txt('Choose a management decision. See the trade-off.','Chọn quyết định quản trị. Xem sự đánh đổi.')}</h3><p>${txt('Each preset resets geography/product filters and uses Wave 1, six months, base staffing response, no reserved reactivation slots.','Mỗi kịch bản đặt lại bộ lọc địa bàn/sản phẩm và dùng Wave 1, sáu tháng, đáp ứng nhân sự cơ sở, không giữ suất riêng cho tái kích hoạt.')}</p>
        <div class="demo-actions">${[
          ['programme',txt('Programmes first · 0 FTE / 500 slots','Ưu tiên chương trình · 0 FTE / 500 suất')],
          ['staffing',txt('Hire more · +5 FTE / 500 slots','Tuyển thêm · +5 FTE / 500 suất')],
          ['constrained',txt('Limited budget · 0 FTE / 100 slots','Nguồn lực hạn chế · 0 FTE / 100 suất')],
          ['quality',txt('Stricter quality · High confidence / FPD ≤ 10%','Chặt hơn về chất lượng · tin cậy cao / FPD ≤ 10%')]
        ].map(([key,label])=>button(label,`data-demo-challenge="${key}" aria-pressed="${activeChallenge===key}"`)).join('')}</div><div id="demo-challenge-result" class="demo-result" aria-live="polite"></div>
        <div class="demo-actions">${button(txt('Adjust the full allocation','Điều chỉnh phân bổ chi tiết'),'data-demo-page="sim"')}${button(txt('Check the economics ↓','Kiểm tra hiệu quả kinh tế ↓'),'data-demo-scroll="demo-cost"')}</div></section>
      <section class="demo-card"><div class="demo-eyebrow">${txt('GROWTH WE CAN ACT ON / GROWTH WE MUST TEST','DƯ ĐỊA CÓ THỂ TÁC ĐỘNG / DƯ ĐỊA CẦN THỬ NGHIỆM')}</div><h3>${txt('Turn the unexplained gap into a learning agenda.','Biến dư địa chưa giải thích thành chương trình học hỏi.')}</h3>
        <div class="demo-grid"><div class="demo-stat">+${number(gap)}<small>${txt('Wave 1 attainable − BAU / month','Năng lực khả thi − BAU / tháng · Wave 1')}</small></div><div class="demo-stat">+${number(tested)}<small>${txt('Modelled closing + quality-fix levers / month','Đòn bẩy hoàn tất + cải thiện chất lượng theo mô hình / tháng')}</small></div><div class="demo-stat">${number(gap?100*tested/gap:0)}%<small>${txt('of the Wave 1 gap associated with those levers','dư địa Wave 1 gắn với hai đòn bẩy trên')}</small></div><div class="demo-stat">${badge('Proposed')}<small>${txt('Remaining gap requires diagnosis and experiments','Dư địa còn lại cần chẩn đoán và thử nghiệm')}</small></div></div>
        <progress class="demo-progress" max="100" value="${Math.min(100,gap?100*tested/gap:0)}" aria-label="${txt('Wave 1 gap associated with modelled closing levers','Tỷ lệ dư địa Wave 1 gắn với đòn bẩy hoàn tất theo mô hình')}"></progress>
        <p class="demo-muted">${txt('Reference: Wave 1, 0 FTE, 500 slots. Association and the assumed closable share support a test; they do not establish causal impact.','Tham chiếu: Wave 1, 0 FTE, 500 suất. Mối liên hệ và giả định tỷ lệ cải thiện là cơ sở để thử nghiệm, chưa chứng minh tác động nhân quả.')}</p>
        <div class="demo-grid">${[
          [txt('Missed interested customers','Bỏ lỡ khách quan tâm'),txt('Test consent-based follow-up; measure extra applications and booked contracts versus control.','Thử theo dõi khách đồng ý nhận liên hệ; đo hồ sơ và hợp đồng tăng thêm so với đối chứng.')],
          [txt('Friction during completion','Vướng mắc khi hoàn tất'),txt('Test document guidance and completion support; track completion, cancellations and credit quality.','Thử hướng dẫn hồ sơ và hỗ trợ hoàn tất; theo dõi hoàn tất, hủy và chất lượng tín dụng.')],
          [txt('Dormant shop barriers','Rào cản ở shop ngừng hoạt động'),txt('Diagnose operations before reactivation; measure sustained activity after support.','Chẩn đoán vận hành trước khi tái kích hoạt; đo duy trì hoạt động sau hỗ trợ.')]
        ].map(([title,body])=>`<article class="demo-card">${badge('Proposed')}<h4>${title}</h4><p>${body}</p><small>${txt('Hypothesis to test · no impact claim yet','Giả thuyết cần thử nghiệm · chưa khẳng định tác động')}</small></article>`).join('')}</div></section>
      <section class="demo-card"><div class="demo-eyebrow">${txt('RECOGNISE NETWORK CONTRIBUTION','NHÌN NHẬN ĐÓNG GÓP CHO MẠNG LƯỚI')}</div><h3>${txt('Who books — and who brings the customer?','Ai ký hợp đồng — ai mang khách đến?')}</h3>
        <p>${txt('Compare shop rankings within all scored shops, Jul–Sep 2026 monthly averages. Sourcing contribution proxy = own bookings + linked contracts booked elsewhere.','So sánh thứ hạng trong toàn bộ shop có điểm, bình quân tháng 07–09/2026. Chỉ báo đóng góp nguồn khách = hợp đồng ký tại shop + hợp đồng liên kết ký ở nơi khác.')}</p>
        <div class="demo-tabs" role="group" aria-label="${txt('Ranking basis','Cơ sở xếp hạng')}">${button(txt('Booked at the shop','Ký tại shop'),`data-demo-rank="booking" aria-pressed="${ranking==='booking'}"`)}${button(txt('Sourcing contribution proxy','Chỉ báo đóng góp nguồn khách'),`data-demo-rank="sourcing" aria-pressed="${ranking==='sourcing'}"`)}</div>
        <div id="demo-ranking" class="demo-table"></div><p class="demo-muted">${txt('Confirmed = contract-ID link. Inferred = same-client, same-product last touch within 90 days, cross-shop ties dropped. The proxy overlaps bookings elsewhere: never sum it as network contracts or use it directly for rewards.','Xác nhận = liên kết ID hợp đồng. Suy luận = cùng khách, cùng sản phẩm, chạm cuối trong 90 ngày, bỏ trường hợp hòa giữa các shop. Chỉ báo trùng với hợp đồng ký nơi khác: không cộng thành tổng hợp đồng mạng lưới hoặc dùng trực tiếp để thưởng.')}</p></section>
      <section class="demo-card" id="demo-cost"><div class="demo-eyebrow">${txt('HOW MUCH CAN WE AFFORD TO SPEND?','CHÚNG TA CÓ THỂ CHI BAO NHIÊU?')}</div><h3>${txt('Make the economics explicit.','Làm rõ hiệu quả kinh tế.')}</h3><p>${badge('Assumed')} ${txt('Enter your own costs in VND. Values start blank; no cost or profit assumptions are supplied. Uses the current allocation.','Nhập chi phí của bạn theo VND. Các ô để trống; không có giả định chi phí hay lợi nhuận mặc định. Áp dụng phân bổ hiện tại.')}</p>
        <div class="demo-grid">${[
          ['contribution',txt('Net contribution per incremental contract, after funding, credit loss and variable servicing','Đóng góp ròng mỗi hợp đồng tăng thêm, sau vốn, tổn thất tín dụng và phục vụ biến đổi')],
          ['programme',txt('One-off programme cost per allocated slot / shop','Chi phí chương trình một lần mỗi suất / shop được phân bổ')],
          ['fte',txt('Monthly cost per additional FTE','Chi phí tháng cho mỗi FTE bổ sung')]
        ].map(([key,label])=>`<label class="demo-field">${label}<input type="number" min="0" step="any" inputmode="decimal" data-demo-cost="${key}" value="${safe(economics[key])}" placeholder="${txt('Enter VND','Nhập VND')}"></label>`).join('')}</div>
        <div id="demo-economics" class="demo-result" aria-live="polite"></div></section>
      <section class="demo-card"><div class="demo-eyebrow">${txt('MONDAY MORNING ACTION','HÀNH ĐỘNG SÁNG THỨ HAI')}</div><h3>${txt('Give each shop a next action.','Giao bước tiếp theo cho từng shop.')}</h3><p>${txt('Open any shop ID in the priority or allocation table, or search here.','Bấm ID shop trong bảng ưu tiên hoặc phân bổ, hoặc tìm ở đây.')}</p>
        <form id="demo-shop-search" class="demo-actions"><label class="demo-field">${txt('Shop ID','Mã shop')}<input id="demo-shop-id" type="text" inputmode="numeric" pattern="[0-9]+" required autocomplete="off"></label>${button(txt('Open action card','Mở thẻ hành động'),'type="submit"')}<span id="demo-shop-error" role="status"></span></form></section>
      <section class="demo-card demo-pilot" id="demo-pilot"><div class="demo-eyebrow">${txt('PROVE BEFORE SCALING','KIỂM CHỨNG TRƯỚC KHI MỞ RỘNG')}</div><h3>${txt('A pilot ends with a decision.','Thử nghiệm kết thúc bằng một quyết định.')}</h3><p>${badge('Proposed')} ${txt('Choose shops → randomise within comparable groups → measure versus control → update the assumptions → scale or revise.','Chọn shop → phân nhóm ngẫu nhiên trong các nhóm tương đồng → đo so với đối chứng → cập nhật giả định → mở rộng hoặc điều chỉnh.')}</p>
        <p>${txt('Illustrative outcomes below explain the decision rule. They are not pilot results.','Các tình huống dưới đây minh họa quy tắc quyết định, chưa phải kết quả thử nghiệm.')}</p><div class="demo-tabs" role="group" aria-label="${txt('Illustrative pilot outcomes','Tình huống thử nghiệm minh họa')}">${[
          ['scale',txt('Impact + quality hold','Có tác động + chất lượng đạt')],['revise',txt('Growth, quality deteriorates','Tăng trưởng, chất lượng xấu đi')],['inconclusive',txt('Evidence inconclusive','Chưa đủ bằng chứng')]
        ].map(([key,label])=>button(label,`data-demo-pilot="${key}" aria-pressed="${pilotChoice===key}"`)).join('')}</div><div id="demo-pilot-result" class="demo-callout" aria-live="polite"></div>
        <p class="demo-muted">${txt('Evaluate FPD only for contracts that have reached the first-payment observation point. Report the mature denominator; do not treat unobserved new loans as good loans. Keep credit underwriting and approval standards unchanged.','Chỉ đánh giá FPD cho hợp đồng đã đến thời điểm quan sát kỳ thanh toán đầu. Công bố mẫu đủ thời gian quan sát; không coi khoản vay mới chưa quan sát là khoản vay tốt. Giữ nguyên tiêu chuẩn thẩm định và phê duyệt tín dụng.')}</p>${button(txt('Review pilot design & evidence','Xem thiết kế & bằng chứng thử nghiệm'),'data-demo-page="valid"')}</section>
      <p class="demo-muted">${txt('Source: v4 model and Task 6 outputs bundled with this site. Scope: shop-level, ≥ 3 months of history; observed run-rate and sourcing are Jul–Sep 2026 monthly averages. Decisions support shop operations; financial wellbeing scores are not credit approval rules.','Nguồn: mô hình v4 và kết quả Task 6 đi kèm website. Phạm vi: cấp shop, ≥ 3 tháng lịch sử; doanh số quan sát và nguồn khách là bình quân tháng 07–09/2026. Quyết định hỗ trợ vận hành shop; điểm sức khỏe tài chính không phải quy tắc phê duyệt tín dụng.')}</p>
    </div>`;
    toolbarHost.replaceChildren(page.querySelector('.demo-toolbar'));
    renderChallenge(); renderRanking(); renderEconomics(); renderPilot();
  }

  function renderChallenge() {
    const {k,p} = current;
    const names = {programme:txt('Programmes first','Ưu tiên chương trình'),staffing:txt('Hire more','Tuyển thêm'),constrained:txt('Limited budget','Nguồn lực hạn chế'),quality:txt('Stricter quality','Chặt hơn về chất lượng')};
    const difference = k.uplift-reference.k.uplift;
    const failedChecks = k.checks.filter(check=>!check[2]);
    const reasons = {beats_even_spread:txt('Resource allocation gains do not meet the improvement threshold.','Lợi ích phân bổ chưa đạt ngưỡng cải thiện.'),fpd_guardrail:txt('FTE recipients exceed the agreed peer quality threshold.','Shop nhận FTE vượt ngưỡng chất lượng so với nhóm.'),no_fte_to_risk_shops:txt('The plan assigns FTE to risk-flagged shops.','Kế hoạch phân bổ FTE cho shop được gắn cờ chất lượng.'),not_over_concentrated:txt('Too much uplift is concentrated in the largest contributors.','Uplift tập trung quá nhiều vào các shop đóng góp lớn nhất.'),robust_downside:txt('The conservative scenario retains too little of the base uplift.','Kịch bản bảo thủ giữ lại quá ít uplift cơ sở.'),marginal_fte_productive:txt('Extra staffing yields less than the network productivity benchmark.','Nhân sự bổ sung có năng suất thấp hơn chuẩn toàn mạng lưới.')};
    q('#demo-challenge-result').innerHTML = `<div class="demo-eyebrow">${activeChallenge ? names[activeChallenge] : txt('Custom allocation · manually adjusted','Phân bổ tùy chỉnh · đã điều chỉnh')} · ${decisionLabel(k.verdict)}</div><div class="demo-grid">
      <div class="demo-stat">+${number(k.uplift)}<small>${txt('modelled contracts / month','hợp đồng / tháng theo mô hình')}</small></div>
      <div class="demo-stat">+${number(k.uplift05)}<small>${txt('conservative case / month','trường hợp bảo thủ / tháng')}</small></div>
      <div class="demo-stat">${number(k.shopsSelected,0)}<small>${txt('shops selected','shop được chọn')}</small></div>
      <div class="demo-stat">${number(k.fteUsed,2)} / ${number(k.slotsUsed,0)}<small>${txt('FTE / programme slots used','FTE / suất chương trình được dùng')}</small></div></div>
      ${activeChallenge ? `<p><strong>${txt('Change versus programmes-first reference','Thay đổi so với tham chiếu ưu tiên chương trình')}: ${difference>=0?'+':'−'}${number(Math.abs(difference))} ${txt('contracts / month','hợp đồng / tháng')}.</strong></p>` : ''}
      <p><strong>${txt('Decision reason','Lý do quyết định')}:</strong> ${failedChecks.length?failedChecks.map(check=>safe(reasons[check[0]] || check[1])).join(' '):txt('The applicable model checks pass. Validate intervention costs and outcomes in a controlled pilot.','Các kiểm tra mô hình áp dụng đều đạt. Kiểm chứng chi phí và kết quả can thiệp bằng thử nghiệm đối chứng.')}</p>
      <p>${badge('Modelled')} ${txt('Current scope after eligibility filters','Phạm vi hiện tại sau bộ lọc điều kiện')}: ${number(k.shopsInScope,0)} ${txt('shops','shop')}; ${p.horizon} ${txt('months','tháng')}. ${txt('Scenario uplift needs a controlled pilot; a productivity check does not prove financial payback.','Uplift kịch bản cần thử nghiệm đối chứng; kiểm tra năng suất chưa chứng minh hoàn vốn tài chính.')}</p>
      <p>${txt('Trade-off: staffing spends recurring resources; programmes use shop slots. Eligibility, downside, concentration and quality checks determine whether the plan needs revision.','Đánh đổi: nhân sự dùng nguồn lực định kỳ; chương trình dùng suất cho shop. Điều kiện phù hợp, trường hợp bảo thủ, tập trung và chất lượng quyết định kế hoạch có cần điều chỉnh.')}</p>`;
  }

  function renderRanking() {
    const rows = [...SHOPS].sort((a,b) => (b.actual + (ranking==='sourcing' ? b.xs_out_pm||0:0)) - (a.actual + (ranking==='sourcing' ? a.xs_out_pm||0:0)) || a.shop_id-b.shop_id).slice(0,8);
    const heads = [txt('Shop','Shop'),txt('Province','Tỉnh'),txt('Own booked / mo','Ký tại shop / tháng'),txt('Linked elsewhere / mo','Liên kết ký nơi khác / tháng'),txt('Confirmed / inferred','Xác nhận / suy luận'),txt('Contribution proxy','Chỉ báo đóng góp')];
    q('#demo-ranking').innerHTML = `<table><caption>${ranking==='sourcing'?txt('Top eight by contribution proxy','Tám shop đứng đầu theo chỉ báo đóng góp'):txt('Top eight by own bookings','Tám shop đứng đầu theo hợp đồng ký tại shop')}</caption><thead><tr>${heads.map(h=>`<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr><td>${button(safe(r.shop_id),`data-demo-shop="${safe(r.shop_id)}"`)}</td><td>${safe(r.province)}</td><td>${number(r.actual)}</td><td>${number(r.xs_out_pm)}</td><td>${number(r.xs_out_proven_pm)} / ${number(Math.max(0,(r.xs_out_pm||0)-(r.xs_out_proven_pm||0)))}</td><td>${number(r.actual+(r.xs_out_pm||0))}</td></tr>`).join('')}</tbody></table>`;
  }

  function renderEconomics() {
    const {k,p} = current;
    const read = key => economics[key].trim()==='' ? null : Number(economics[key]);
    const contribution = read('contribution'), programme = read('programme'), fte = read('fte');
    const values = [contribution,programme,fte];
    if (values.some(v=>v!=null&&(!Number.isFinite(v)||v<0))) {
      q('#demo-economics').textContent = txt('Enter finite, non-negative amounts.','Nhập số hữu hạn không âm.'); return;
    }
    const scope = `${txt('Current modelled allocation','Phân bổ mô hình hiện tại')}: +${number(k.upliftH)} ${txt('contracts over','hợp đồng trong')} ${p.horizon} ${txt('months, linear ramp assumed','tháng, giả định tăng tuyến tính')}; ${number(k.slotsUsed,0)} ${txt('slots','suất')}, ${number(k.fteUsed,2)} FTE.`;
    if (contribution===null || (k.slotsUsed>0&&programme===null) || (k.fteUsed>0&&fte===null)) {
      q('#demo-economics').textContent = `${scope} ${txt('Enter net contribution and each applicable cost to calculate. Blank costs are not treated as zero.','Nhập đóng góp ròng và từng chi phí áp dụng để tính. Chi phí trống không được coi là 0.')}`; return;
    }
    const cost = (programme||0)*k.slotsUsed + (fte||0)*k.fteUsed*p.horizon;
    const gross = contribution*k.upliftH;
    const downsideContracts = k.uplift05*p.horizon*p.ramp;
    const derived = [cost,gross,downsideContracts,gross-cost,contribution*downsideContracts-cost];
    if (k.upliftH>0) derived.push(cost/k.upliftH);
    if (derived.some(value=>!Number.isFinite(value))) {
      q('#demo-economics').textContent = txt('Amounts exceed the supported calculation range. Enter smaller finite amounts.','Số tiền vượt phạm vi tính toán. Hãy nhập số hữu hạn nhỏ hơn.'); return;
    }
    q('#demo-economics').innerHTML = `<p>${safe(scope)}</p><div class="demo-grid"><div class="demo-stat">${number(gross,0)}<small>${txt('Modelled contribution before intervention cost · VND','Đóng góp mô hình trước chi phí can thiệp · VND')}</small></div><div class="demo-stat">${number(cost,0)}<small>${txt('Intervention cost over horizon · VND','Chi phí can thiệp trong kỳ · VND')}</small></div><div class="demo-stat">${number(gross-cost,0)}<small>${txt('Scenario net contribution · VND','Đóng góp ròng kịch bản · VND')}</small></div><div class="demo-stat">${k.upliftH>0?number(cost/k.upliftH,0):'—'}<small>${txt('Break-even contribution per extra contract · VND','Đóng góp hòa vốn mỗi hợp đồng tăng thêm · VND')}</small></div></div>
      <p>${txt('Sensitivity: at conservative model uplift, net contribution =','Độ nhạy: với uplift bảo thủ của mô hình, đóng góp ròng =')} ${number(contribution*downsideContracts-cost,0)} VND. ${txt('Maximum break-even intervention budget at base uplift =','Ngân sách can thiệp hòa vốn tối đa với uplift cơ sở =')} ${number(gross,0)} VND.</p><p class="demo-muted">${txt('Formula: contribution × modelled extra contracts − slots used × one-off slot cost − FTE used × monthly FTE cost × months. Credit disbursement is not profit. These are conditional scenarios, not realised returns.','Công thức: đóng góp × hợp đồng tăng thêm theo mô hình − suất dùng × chi phí một lần mỗi suất − FTE dùng × chi phí FTE tháng × số tháng. Giải ngân không phải lợi nhuận. Đây là kịch bản có điều kiện, chưa phải kết quả thực tế.')}</p>`;
  }

  function renderPilot() {
    const content = {
      scale: [txt('Scale in the next wave','Mở rộng sang làn sóng tiếp theo'),txt('Only when the pre-registered incremental effect clears the success threshold, economics are acceptable, and mature FPD plus cancellations meet the agreed guardrails. Replace model assumptions with measured effects.','Chỉ khi tác động tăng thêm vượt ngưỡng thành công đã chốt trước, hiệu quả kinh tế chấp nhận được và FPD đủ quan sát cùng tỷ lệ hủy đạt điều kiện. Thay giả định mô hình bằng tác động đã đo.')],
      revise: [txt('Pause expansion and diagnose','Dừng mở rộng và chẩn đoán'),txt('Investigate application quality, completion practices and customer outcomes. Adjust the operational intervention and retest. Growth alone does not justify rollout or weaker underwriting.','Điều tra chất lượng hồ sơ, thực hành hoàn tất và kết quả khách hàng. Điều chỉnh can thiệp vận hành rồi thử lại. Tăng trưởng riêng lẻ chưa đủ để triển khai hoặc nới thẩm định.')],
      inconclusive: [txt('Do not declare a win or failure','Chưa kết luận thành công hay thất bại'),txt('Review sample size, execution, contamination and observation maturity. Follow a pre-agreed extension or redesign rule, then repeat the controlled comparison.','Rà soát cỡ mẫu, thực thi, ảnh hưởng chéo và thời gian quan sát. Theo quy tắc kéo dài hoặc thiết kế lại đã thống nhất, rồi lặp lại so sánh đối chứng.')]
    }[pilotChoice];
    q('#demo-pilot-result').innerHTML = `<strong>${content[0]}</strong><p>${content[1]}</p>`;
  }

  function applyChallenge(key) {
    activeChallenge = key;
    Object.keys(F).forEach(k=>F[k]=''); FW=''; q('#fWave').value='';
    const inputs = {inScope:'500',inFte:key==='staffing'?'5':'0',inSlots:key==='constrained'?'100':'500',inHorizon:'6',inFpd:key==='quality'?'0.10':'0.40',inConf:key==='quality'?'h':'',inReact:'0',inElas:'base'};
    Object.entries(inputs).forEach(([id,value])=>{q(`#${id}`).value=value;});
    refresh();
    document.querySelectorAll('[data-demo-challenge]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.demoChallenge===key)));
  }

  const dialog = document.createElement('dialog');
  dialog.id = 'demo-shop-dialog'; dialog.className = 'demo-dialog';
  dialog.setAttribute('aria-labelledby','demo-shop-title');
  document.body.append(dialog);

  function openShop(id, opener) {
    const shop = SHOPS.find(r=>String(r.shop_id)===String(id));
    if (!shop) {const error=q('#demo-shop-error');if(error)error.textContent=txt('Shop ID not found in the scored dataset.','Không tìm thấy mã shop trong dữ liệu có điểm.');return;}
    returnFocus = opener;
    const selected = current.k.ups.find(([,r])=>r.shop_id===shop.shop_id)?.[0];
    const constraintVi = {'Demand capture (applications)':'Khai thác nhu cầu (hồ sơ)', 'Activation (no applications in 3 months)':'Tái kích hoạt (không có hồ sơ trong 3 tháng)', 'Approval / closing':'Hoàn tất hồ sơ', 'Demand capture (risk-capped)':'Khai thác nhu cầu (giới hạn theo chất lượng)', 'None (at peer frontier)':'Đang ở biên nhóm tương đồng', 'Local market capacity':'Dung lượng thị trường địa phương'};
    const constraint = txt(shop.main_constraint,constraintVi[shop.main_constraint] || shop.main_constraint);
    const action = shop.shop_status !== 'Active' ? [txt('Verify operating status first','Xác minh trạng thái vận hành trước'),txt('This shop is not Active in the snapshot. Confirm its status and the local reason with the area manager; do not allocate a new resource lever under the current model.','Shop chưa ở trạng thái Active trong bản dữ liệu. Xác minh trạng thái và nguyên nhân với quản lý vùng; không phân bổ đòn bẩy nguồn lực mới theo mô hình hiện tại.')] : shop.market_constrained ? [txt('Verify local market capacity','Xác minh dung lượng thị trường địa phương'),txt('The model flags a market constraint. Review local demand, overlap and sourcing contribution before considering additional resources. No new capacity is recommended from this flag alone.','Mô hình ghi nhận giới hạn thị trường. Rà soát nhu cầu địa phương, vùng chồng lấn và đóng góp nguồn khách trước khi cân nhắc nguồn lực. Cờ này chưa đủ để khuyến nghị thêm năng lực.')] : shop.attainable <= shop.bau || /^At frontier/i.test(shop.track) ? [txt('Sustain performance and verify the frontier','Duy trì hiệu quả và xác minh mức khả thi'),txt('The shop is at its modelled frontier. Confirm service quality and network contribution locally; no incremental capacity lever is indicated.','Shop đang ở mức khả thi theo mô hình. Xác minh chất lượng phục vụ và đóng góp mạng lưới tại địa phương; chưa có cơ sở thêm năng lực.')] : shop.risk_flag ? [txt('Fix quality before adding capacity','Cải thiện chất lượng trước khi thêm năng lực'),txt('Review completion quality, cancellations and customer outcomes with the shop manager.','Cùng quản lý shop rà soát chất lượng hoàn tất, tỷ lệ hủy và kết quả khách hàng.')] : shop.elig_approval ? [txt('Remove completion friction','Gỡ vướng khi hoàn tất hồ sơ'),txt('Map drop-off steps; test document guidance and completion support against comparable shops.','Xác định bước rơi rụng; thử hướng dẫn và hỗ trợ hồ sơ so với shop tương đồng.')] : shop.elig_react ? [txt('Diagnose before reactivation','Chẩn đoán trước khi tái kích hoạt'),txt('Contact the shop manager to verify operating status and the reason for inactivity before choosing support.','Xác minh trạng thái vận hành và lý do ngừng hoạt động với quản lý shop trước khi chọn hỗ trợ.')] : shop.elig_fte ? [txt('Validate demand capture','Kiểm chứng khai thác nhu cầu'),txt('Check missed customer demand and staffing coverage; add capacity only if incremental productivity and quality hold.','Kiểm tra nhu cầu bị bỏ lỡ và bố trí nhân sự; chỉ thêm năng lực khi năng suất tăng thêm và chất lượng đạt điều kiện.')] : [txt('Diagnose and sustain','Chẩn đoán và duy trì'),txt('Verify the reported constraint with the shop manager. No additional resource lever is eligible in the current model.','Xác minh điểm nghẽn với quản lý shop. Mô hình hiện tại chưa có đòn bẩy thêm nguồn lực đủ điều kiện.')];
    dialog.innerHTML = `<form method="dialog"><button class="demo-button" aria-label="${txt('Close shop action','Đóng thẻ hành động')}">${txt('Close ×','Đóng ×')}</button></form><div class="demo-eyebrow">${badge('Proposed')} ${txt('NEXT ACTION','BƯỚC TIẾP THEO')}</div><h2 id="demo-shop-title">${txt('Shop','Shop')} ${safe(shop.shop_id)}</h2><p>${safe(shop.province)} · ${safe(shop.model)} · ${safe(shop.category)}</p><h3>${action[0]}</h3><p>${action[1]}</p>
      <dl class="demo-story"><dt>${txt('Observed issue / model constraint','Vấn đề quan sát / điểm nghẽn mô hình')}</dt><dd>${safe(constraint)}; ${txt('booking rate / peer','tỷ lệ ký / nhóm tương đồng')} ${number(100*shop.book_rate)}% / ${number(100*shop.peer_book_rate)}%.</dd><dt>${txt('Owner & review','Phụ trách & rà soát')}</dt><dd>${txt('Proposed: area manager + shop lead. Assign named owners and a review date before launch.','Đề xuất: quản lý vùng + trưởng shop. Chốt người phụ trách và ngày rà soát trước khi triển khai.')}</dd><dt>${txt('Current allocation','Phân bổ hiện tại')}</dt><dd>${selected?safe(LEVER_NAME[selected.lever]||selected.lever):txt('Not selected; budget and eligibility may constrain the allocation.','Chưa được chọn; ngân sách và điều kiện có thể giới hạn phân bổ.')}</dd><dt>${txt('Track success','Theo dõi thành công')}</dt><dd>${txt('Incremental booked contracts versus control, cancellations, mature FPD, cost per incremental contract.','Hợp đồng tăng thêm so với đối chứng, tỷ lệ hủy, FPD đủ quan sát, chi phí mỗi hợp đồng tăng thêm.')}</dd></dl><p class="demo-muted">${txt('Action proposal requires local confirmation. No changes to underwriting or credit approval standards.','Đề xuất hành động cần xác minh tại địa phương. Không thay đổi tiêu chuẩn thẩm định hoặc phê duyệt tín dụng.')}</p>`;
    if(!dialog.open)dialog.showModal();
  }
  dialog.addEventListener('close',()=>returnFocus?.focus());
  dialog.addEventListener('click',event=>{if(event.target===dialog){const bounds=dialog.getBoundingClientRect();if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)dialog.close();}});

  function linkShopCells() {
    ['tblTop','tblPlan'].forEach(id=>{
      const root=q(`#${id}`); if(!root)return;
      const heads=[...root.querySelectorAll('th')];
      const index=heads.findIndex(h=>/^(Shop|Mã shop|Cửa hàng)$/i.test(h.textContent.trim()));
      if(index<0)return;
      root.querySelectorAll('tbody tr, table > tr').forEach(row=>{
        const cell=row.querySelectorAll('td')[index];if(!cell||cell.querySelector('button'))return;
        const shopId=cell.textContent.trim();if(!/^\d+$/.test(shopId))return;
        const b=document.createElement('button');b.className='demo-button';b.type='button';b.dataset.demoShop=shopId;b.textContent=shopId;b.setAttribute('aria-label',`${txt('Open action for shop','Mở hành động cho shop')} ${shopId}`);cell.replaceChildren(b);
      });
    });
  }
  let shopLinksQueued=false;
  const shopObserver=new MutationObserver(()=>{if(shopLinksQueued)return;shopLinksQueued=true;requestAnimationFrame(()=>{shopLinksQueued=false;linkShopCells();});});
  ['tblTop','tblPlan'].forEach(id=>{const el=q(`#${id}`);if(el)shopObserver.observe(el,{childList:true,subtree:true});});

  document.addEventListener('click',event=>{
    const b=event.target.closest('button');if(!b)return;
    if(b.dataset.demoPage)showPage(b.dataset.demoPage);
    if(b.dataset.demoScroll){showPage('executive');q(`#${b.dataset.demoScroll}`)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});}
    if(b.dataset.demoChallenge)applyChallenge(b.dataset.demoChallenge);
    if(b.dataset.demoRank){ranking=b.dataset.demoRank;document.querySelectorAll('[data-demo-rank]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));renderRanking();}
    if(b.dataset.demoPilot){pilotChoice=b.dataset.demoPilot;document.querySelectorAll('[data-demo-pilot]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));renderPilot();}
    if(b.dataset.demoShop)openShop(b.dataset.demoShop,b);
    if(b.id==='demo-presenter'){const on=document.body.classList.toggle('demo-presenter');b.setAttribute('aria-pressed',String(on));}
    if(b.hasAttribute('data-demo-reset')){document.body.classList.remove('demo-presenter');Object.keys(economics).forEach(k=>economics[k]='');ranking='booking';pilotChoice='scale';applyChallenge('programme');render();showPage('executive');window.scrollTo({top:0,behavior:'auto'});}
  });
  page.addEventListener('input',event=>{const key=event.target.dataset.demoCost;if(key){economics[key]=event.target.value;renderEconomics();}});
  function markCustom(event) {
    if(!event.target.matches('#filters select, #page-sim .inputs select, #page-sim .inputs input'))return;
    activeChallenge=null;
    document.querySelectorAll('[data-demo-challenge]').forEach(b=>b.setAttribute('aria-pressed','false'));
    renderChallenge();
  }
  document.addEventListener('input',markCustom);
  document.addEventListener('change',markCustom);
  page.addEventListener('submit',event=>{if(event.target.id==='demo-shop-search'){event.preventDefault();q('#demo-shop-error').textContent='';openShop(q('#demo-shop-id').value.trim(),q('#demo-shop-id'));}});
  window.addEventListener('r3:simulation',event=>{if(!event.detail?.k)return;current=event.detail;renderChallenge();renderEconomics();linkShopCells();});
  window.addEventListener('bi10-lang-changed',()=>{if(dialog.open)dialog.close();render();linkShopCells();});
  render(); linkShopCells(); showPage('executive');
})();
