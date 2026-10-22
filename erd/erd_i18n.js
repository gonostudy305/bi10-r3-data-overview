
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
