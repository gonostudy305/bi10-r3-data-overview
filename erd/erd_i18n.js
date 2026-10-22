
/* ===================== ERD i18n Dictionary ===================== */
const ERD_I18N = {
  vi: {
    head_title: "BI10 Round 3 · Sơ đồ quan hệ dữ liệu (ERD)",
    nav_dashboard: "📊 Dashboard Tổng quan",
    nav_decision: "🎯 Decision Studio (Task 6)",
    tab_bronze: "Nguồn BTC · Bronze",
    tab_clean: "Cleaning & Marts",
    btn_z_fit: "Vừa khung",
    btn_z_100: "100%",
    hint_scroll: "Kéo thanh cuộn hoặc giữ Shift + lăn chuột để di chuyển",
    h2_facts: "2. Điều cần biết trước khi join",
    h2_tables: "4. Các bảng",
    h2_rel_clean: "3. Danh sách quan hệ",
    h2_rel_bronze: "3. Danh sách quan hệ",
    sec_summary_bronze: "7 bảng nguồn; không có bảng Employee theo đính chính BTC",
    sec_summary_clean: "13 bảng trong luồng: làm sạch, phân bổ lead và mart shop_month",
    th_table: "Bảng",
    th_grain: "Mỗi dòng là",
    th_pk: "Khóa chính",
    th_cols: "Số cột",
    th_rows: "Số dòng"
  },
  en: {
    head_title: "BI10 Round 3 · Entity Relationship Diagram (ERD)",
    nav_dashboard: "📊 Data Overview",
    nav_decision: "🎯 Decision Studio (Task 6)",
    tab_bronze: "Source Bronze Data",
    tab_clean: "Cleaning & Marts",
    btn_z_fit: "Fit Screen",
    btn_z_100: "100%",
    hint_scroll: "Scroll or hold Shift + wheel to pan",
    h2_facts: "2. Key Facts Before Joining",
    h2_tables: "4. Table Catalog",
    h2_rel_clean: "3. Relationships & Attribution Rules",
    h2_rel_bronze: "3. Relationships List",
    sec_summary_bronze: "7 source tables; no Employee table per organizer correction",
    sec_summary_clean: "13 pipeline tables: cleaning, lead attribution, and shop_month mart",
    th_table: "Table",
    th_grain: "Grain (1 row represents)",
    th_pk: "Primary Key",
    th_cols: "Columns",
    th_rows: "Row Count"
  }
};

function tE(k) {
  const l = window.BI10_LANG || 'vi';
  return (ERD_I18N[l] && ERD_I18N[l][k]) || (ERD_I18N['en'] && ERD_I18N['en'][k]) || k;
}

function applyErdStaticI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.dataset.i18n;
    if (k) el.innerHTML = tE(k);
  });
}

const ERD_ADVANCED = {
  vi: {
    kind_mandatory: "Bắt buộc 1:n",
    kind_optional: "Tùy chọn 0..1:n",
    kind_logical: "Logic n:n",
    kind_key: "Nối theo mã khóa",
    kind_transform: "Biến đổi / tổng hợp",
    kind_logic: "Quy tắc nghiệp vụ",
    kind_qa: "Lineage đối soát",

    // Bronze table headers
    th_parent: "Bảng cha",
    th_parent_col: "Khóa cha",
    th_child: "Bảng con",
    th_child_col: "Khóa con",
    th_kind: "Kiểu",
    th_child_rows: "Dòng con",
    th_rows_matched: "% dòng khớp",
    th_keys_matched: "% khóa khớp",
    th_note: "Ghi chú",

    // Clean table headers
    th_code: "Mã",
    th_source_parent: "Nguồn / bảng cha",
    th_target: "Bảng đích",
    th_key_logic: "Khóa hoặc logic nối",
    th_cardinality: "Bội số / cách gộp",
    th_rel_type: "Loại quan hệ",

    // Table catalog
    th_tbl: "Bảng",
    th_grain: "Mỗi dòng là",
    th_pk: "Khóa chính",
    th_cols: "Số cột",
    th_rows: "Số dòng",

    // Grains
    grain_seller: "1 dòng / đại lý (dealer)",
    grain_salesroom: "1 dòng / điểm bán (POS)",
    grain_emp_2_salesroom: "1 dòng / lần gán nhân viên vào shop",
    grain_contract: "1 dòng / hồ sơ tín dụng",
    grain_contract_product: "1 dòng / sản phẩm trên hồ sơ",
    grain_contract_goods: "1 dòng / hàng hóa mua trả góp",
    grain_leads: "1 dòng / sự kiện lead",
    grain_clean_seller: "1 dòng / seller",
    grain_clean_emp_2_salesroom: "1 dòng / assignment SA",
    grain_dim_shop_all: "1 dòng / shop_id quan sát được",
    grain_clean_salesroom: "1 dòng / điểm bán",
    grain_clean_shop_staff_month: "1 dòng / shop × tháng",
    grain_clean_contract: "1 dòng / hợp đồng",
    grain_clean_contract_product: "1 dòng / sản phẩm hồ sơ",
    grain_clean_contract_goods: "1 dòng / mặt hàng",
    grain_lead_contract_attr: "1 dòng / hợp đồng đủ điều kiện",
    grain_clean_lead: "1 dòng / sự kiện lead",
    grain_clean_lead_finish_reason: "1 dòng / lý do kết thúc",
    grain_mart_shop_month: "1 dòng / shop × tháng (chuẩn bị cho mô hình)",
    grain_dq_reconciliation: "1 dòng / kiểm định",

    // Bronze Facts
    fact_sr_title: "83,5% hợp đồng nằm ngoài bảng salesroom",
    fact_sr_body: "Chỉ {rows_matched}% dòng contract có skp_salesroom tồn tại trong salesroom. Phân tích theo shop sẽ chỉ phủ phần nhỏ nếu không xử lý nhóm này.",
    fact_cp_title: "contract_product chỉ phủ {cov}% hồ sơ",
    fact_cp_body: "Bảng này có {dup} hồ sơ bị lặp dòng, nên join sẽ nhân dòng. Cần gộp về 1 dòng/hồ sơ trước khi nối.",
    fact_cl_title: "skp_client không có bảng khách hàng",
    fact_cl_body: "Khóa này chỉ nối contract với leads. Trong contract.csv một số mã ghi dạng float ('105071312.0'), phải chuẩn hóa trước khi join.",
    fact_emp_title: "leads.skp_employee rỗng 100%",
    fact_emp_body: "Không gán lead cho nhân viên được. Không có bảng nhân viên; mã nhân viên chỉ có ở emp_2_salesroom (lịch sử có hiệu lực theo thời gian, chỉ SA) và ở contract.skp_emp_pre_process (53,5% khớp với emp_2_salesroom).",
    fact_cc_title: "Lead nối hợp đồng bằng skp_credit_case chỉ cho {cc} lead",
    fact_cc_body: "Chiếm {pct}% trong {rows} dòng. Với phần còn lại phải dùng quy tắc của đề (cùng skp_client, cùng sản phẩm, date_assigned ≤ date_apply).",
    fact_uuid_title: "leads có {dup} dòng id_uuid trùng",
    fact_uuid_body: "{uniq} id duy nhất trong {rows} dòng. 2 triệu dòng CL còn mang sample_weight 19,66, nên mọi phép đếm lead phải nhân trọng số."
  },
  en: {
    kind_mandatory: "Mandatory 1:n",
    kind_optional: "Optional 0..1:n",
    kind_logical: "Logical n:n",
    kind_key: "Key-based Join",
    kind_transform: "Transformation / Aggregation",
    kind_logic: "Business Rule",
    kind_qa: "Reconciliation Lineage",

    // Bronze table headers
    th_parent: "Parent Table",
    th_parent_col: "Parent Key",
    th_child: "Child Table",
    th_child_col: "Child Key",
    th_kind: "Type",
    th_child_rows: "Child Rows",
    th_rows_matched: "% Rows Matched",
    th_keys_matched: "% Keys Matched",
    th_note: "Notes",

    // Clean table headers
    th_code: "Code",
    th_source_parent: "Source / Parent Table",
    th_target: "Target Table",
    th_key_logic: "Key / Join Logic",
    th_cardinality: "Cardinality / Aggregation",
    th_rel_type: "Relationship Type",

    // Table catalog
    th_tbl: "Table",
    th_grain: "Grain (1 row represents)",
    th_pk: "Primary Key",
    th_cols: "Columns",
    th_rows: "Row Count",

    // Grains
    grain_seller: "1 row / dealer (seller)",
    grain_salesroom: "1 row / point of sale (POS)",
    grain_emp_2_salesroom: "1 row / staff assignment history",
    grain_contract: "1 row / credit case application",
    grain_contract_product: "1 row / application product line",
    grain_contract_goods: "1 row / financed merchandise item",
    grain_leads: "1 row / lead event",
    grain_clean_seller: "1 row / cleaned seller",
    grain_clean_emp_2_salesroom: "1 row / SA assignment",
    grain_dim_shop_all: "1 row / observed shop_id",
    grain_clean_salesroom: "1 row / cleaned salesroom POS",
    grain_clean_shop_staff_month: "1 row / shop × month FTE",
    grain_clean_contract: "1 row / cleaned contract",
    grain_clean_contract_product: "1 row / contract product",
    grain_clean_contract_goods: "1 row / contract goods",
    grain_lead_contract_attr: "1 row / eligible attributed contract",
    grain_clean_lead: "1 row / cleaned lead event",
    grain_clean_lead_finish_reason: "1 row / finish reason lookup",
    grain_mart_shop_month: "1 row / shop × month (model feature mart)",
    grain_dq_reconciliation: "1 row / DQ reconciliation test",

    // Bronze Facts
    fact_sr_title: "83.5% of contracts fall outside the salesroom table",
    fact_sr_body: "Only {rows_matched}% of contract rows have skp_salesroom in the salesroom master. Shop-level analysis must account for unmapped channels.",
    fact_cp_title: "contract_product covers only {cov}% of contracts",
    fact_cp_body: "This table contains {dup} duplicate contract rows; direct joins will multiply rows. Must aggregate to 1 row/contract before joining.",
    fact_cl_title: "skp_client has no dedicated Customer dimension table",
    fact_cl_body: "This key only connects contract with leads. In contract.csv some IDs appear as floats ('105071312.0') and require normalization.",
    fact_emp_title: "leads.skp_employee is 100% NULL",
    fact_emp_body: "Leads cannot be linked directly to employees. Employee master is absent per organizer correction; IDs only exist in emp_2_salesroom and contract.",
    fact_cc_title: "Direct lead-to-contract link via skp_credit_case covers only {cc} leads",
    fact_cc_body: "Accounts for {pct}% of {rows} rows. The remainder requires case study business rules (same skp_client, same product, date_assigned ≤ date_apply).",
    fact_uuid_title: "leads table contains {dup} duplicate id_uuid rows",
    fact_uuid_body: "{uniq} unique UUIDs across {rows} rows. 2M cash-loan rows carry sample_weight = 19.66, requiring weighted aggregation for all analyses."
  }
};

function tAdv(k) {
  const l = window.BI10_LANG || 'vi';
  return (ERD_ADVANCED[l] && ERD_ADVANCED[l][k]) || (ERD_ADVANCED['en'] && ERD_ADVANCED['en'][k]) || k;
}

function renderErdI18nDynamic() {
  const isEn = (window.BI10_LANG === 'en');
  
  // 1. Update KIND dictionary
  if (typeof KIND !== 'undefined') {
    KIND.mandatory = tAdv('kind_mandatory');
    KIND.optional = tAdv('kind_optional');
    KIND.logical = tAdv('kind_logical');
    KIND.key = tAdv('kind_key');
    KIND.transform = tAdv('kind_transform');
    KIND.logic = tAdv('kind_logic');
    KIND.qa = tAdv('kind_qa');
  }

  // 2. Override renderRel headers
  const origRenderRel = window.renderRel;
  window.renderRel = function() {
    const rows = D.relationships;
    if (activeView === "clean") {
      document.getElementById("t-rel").innerHTML = `<thead><tr><th>${tAdv('th_code')}</th><th>${tAdv('th_source_parent')}</th><th>${tAdv('th_target')}</th><th>${tAdv('th_key_logic')}</th><th>${tAdv('th_cardinality')}</th><th>${tAdv('th_rel_type')}</th><th>${tAdv('th_note')}</th></tr></thead><tbody>` +
        rows.map(r => `<tr><td><span class="pill">${r.code}</span></td><td><code>${r.parent}</code></td><td><code>${r.child}</code></td><td><code>${r.parent_col} → ${r.child_col}</code></td><td>${r.cardinality}</td><td><span class="pill">${KIND[r.kind]}</span></td><td class="note">${r.note}</td></tr>`).join("") + "</tbody>";
      return;
    }
    document.getElementById("t-rel").innerHTML = `<thead><tr><th>${tAdv('th_parent')}</th><th>${tAdv('th_parent_col')}</th><th>${tAdv('th_child')}</th><th>${tAdv('th_child_col')}</th><th>${tAdv('th_kind')}</th>
      <th class="num">${tAdv('th_child_rows')}</th><th class="num">${tAdv('th_rows_matched')}</th><th class="num">${tAdv('th_keys_matched')}</th><th>${tAdv('th_note')}</th></tr></thead><tbody>` +
      rows.map(r => `<tr><td><code>${r.parent}</code></td><td><code>${r.parent_col}</code></td><td><code>${r.child}</code></td><td><code>${r.child_col}</code></td>
        <td><span class="pill">${KIND[r.kind]}</span></td><td class="num">${fmt(r.child_rows)}</td>
        <td class="num ${r.rows_matched != null && r.rows_matched < 50 ? "low" : ""}">${bar(r.rows_matched)}${pct(r.rows_matched)}</td>
        <td class="num ${r.keys_matched != null && r.keys_matched < 50 ? "low" : ""}">${pct(r.keys_matched)}</td><td class="note">${r.note || ""}</td></tr>`).join("") + "</tbody>";
  };

  // 3. Override renderTables
  window.renderTables = function() {
    const rows = Object.entries(D.entities).map(([name, e]) => {
      const t = D.tables.find(x => x.table === name);
      const grainText = isEn ? (tAdv('grain_' + name) || e.grain) : e.grain;
      return `<tr><td><code>${name}</code></td><td>${grainText}</td><td><code>${e.pk}</code></td><td class="num">${e.n_cols}</td>
        <td class="num">${t ? fmt(t.rows) : "–"}</td></tr>`;
    }).join("");
    document.getElementById("t-tables").innerHTML = `<thead><tr><th>${tAdv('th_tbl')}</th><th>${tAdv('th_grain')}</th><th>${tAdv('th_pk')}</th><th class="num">${tAdv('th_cols')}</th><th class="num">${tAdv('th_rows')}</th></tr></thead><tbody>${rows}</tbody>`;
  };

  // 4. Override renderFacts for Bronze
  const origRenderFacts = window.renderFacts;
  window.renderFacts = function() {
    if (activeView === "clean") {
      document.getElementById("facts").innerHTML = D.facts.map(x => `<div class="fact ${x.class}"><div class="t">${x.title}</div>${x.body}</div>`).join("");
      return;
    }
    const f = D.facts, rel = (p, c) => D.relationships.find(r => r.parent === p && r.child === c);
    const sr = rel("salesroom", "contract"), cp = rel("contract", "contract_product");
    
    let items;
    if (isEn) {
      items = [
        ["warn", tAdv('fact_sr_title'), tAdv('fact_sr_body').replace('{rows_matched}', pct(sr.rows_matched))],
        ["warn", tAdv('fact_cp_title').replace('{cov}', pct(f.contract_product_coverage_pct)), tAdv('fact_cp_body').replace('{dup}', fmt(f.contract_product_dup))],
        ["", tAdv('fact_cl_title'), tAdv('fact_cl_body')],
        ["warn", tAdv('fact_emp_title'), tAdv('fact_emp_body')],
        ["", tAdv('fact_cc_title').replace('{cc}', fmt(f.leads_with_credit_case)), tAdv('fact_cc_body').replace('{pct}', fmt(f.leads_with_credit_case / f.leads_rows * 100, 1)).replace('{rows}', fmt(f.leads_rows))],
        ["", tAdv('fact_uuid_title').replace('{dup}', fmt(f.leads_rows - f.leads_unique)), tAdv('fact_uuid_body').replace('{uniq}', fmt(f.leads_unique)).replace('{rows}', fmt(f.leads_rows))]
      ];
    } else {
      items = [
        ["warn", "83,5% hợp đồng nằm ngoài bảng salesroom", `Chỉ ${pct(sr.rows_matched)} dòng contract có skp_salesroom tồn tại trong salesroom. Phân tích theo shop sẽ chỉ phủ phần nhỏ nếu không xử lý nhóm này.`],
        ["warn", "contract_product chỉ phủ " + pct(f.contract_product_coverage_pct) + " hồ sơ", `Bảng này có ${fmt(f.contract_product_dup)} hồ sơ bị lặp dòng, nên join sẽ nhân dòng. Cần gộp về 1 dòng/hồ sơ trước khi nối.`],
        ["", "skp_client không có bảng khách hàng", "Khóa này chỉ nối contract với leads. Trong contract.csv một số mã ghi dạng float ('105071312.0'), phải chuẩn hóa trước khi join."],
        ["warn", "leads.skp_employee rỗng 100%", "Không gán lead cho nhân viên được. Không có bảng nhân viên; mã nhân viên chỉ có ở emp_2_salesroom (lịch sử có hiệu lực theo thời gian, chỉ SA) và ở contract.skp_emp_pre_process (53,5% khớp với emp_2_salesroom)."],
        ["", "Lead nối hợp đồng bằng skp_credit_case chỉ cho " + fmt(f.leads_with_credit_case) + " lead", `Chiếm ${fmt(f.leads_with_credit_case / f.leads_rows * 100, 1)}% trong ${fmt(f.leads_rows)} dòng. Với phần còn lại phải dùng quy tắc của đề (cùng skp_client, cùng sản phẩm, date_assigned ≤ date_apply).`],
        ["", "leads có " + fmt(f.leads_rows - f.leads_unique) + " dòng id_uuid trùng", `${fmt(f.leads_unique)} id duy nhất trong ${fmt(f.leads_rows)} dòng. 2 triệu dòng CL còn mang sample_weight 19,66, nên mọi phép đếm lead phải nhân trọng số.`]
      ];
    }
    document.getElementById("facts").innerHTML = items.map(([c, t, b]) => `<div class="fact ${c}"><div class="t">${t}</div>${b}</div>`).join("");
  };
}
