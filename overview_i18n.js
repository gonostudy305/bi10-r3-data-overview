
/* ===================== Data Overview i18n Dictionary ===================== */
const OVERVIEW_I18N = {
  vi: {
    head_title: "BI10 Round 3 · Tổng quan bộ dữ liệu",
    filter_product: "Sản phẩm",
    filter_area: "Vùng (shop)",
    filter_category: "Loại shop",
    opt_all: "Tất cả",
    link_decision: "🎯 Decision Studio (Task 6)",
    link_erd: "🏛️ ERD Dữ liệu",
    tab_overview: "Tổng quan",
    tab_cleaning: "Data Cleaning",
    tab_correlation: "Tương quan",

    theme_dark: "Tối",
    theme_light: "Sáng",

    sec1_title: "1. Hợp đồng theo thời gian",
    sec1_sub: "contract · 01/2025 – 09/2026 · lọc theo Sản phẩm",
    c_monthly_h3: "Hồ sơ nộp và hồ sơ booked proxy theo tháng",
    c_monthly_cap: "Cột: hồ sơ theo date_apply · Đường: tỷ lệ hồ sơ thuộc nhóm booked proxy / hồ sơ nộp",
    c_mix_h3: "Cơ cấu hồ sơ thuộc nhóm booked proxy theo sản phẩm",
    c_mix_cap: "Toàn kỳ 21 tháng",
    c_status_h3: "Trạng thái hồ sơ theo sản phẩm",
    c_status_cap: "% số hồ sơ của từng sản phẩm",
    c_fpd_h3: "Tỷ lệ cờ trễ kỳ 1 (dpd_1pd) theo tháng nộp",
    c_fpd_cap: "Hồ sơ thuộc nhóm booked proxy, nộp trước 06/2026 để có thời gian quan sát dpd_1pd",

    sec2_title: "2. Mạng lưới shop",
    sec2_sub: "salesroom × contract · 12 tháng gần nhất (10/2025 – 09/2026)",
    c_cat_h3: "Hồ sơ theo danh mục shop",
    c_cat_cap: '"Not in salesroom table" = mã shop không khớp salesroom · không đủ căn cứ kết luận là kênh online · lọc theo Sản phẩm',
    c_pareto_h3: "Mức độ tập trung (Pareto)",
    c_pareto_cap: "% hồ sơ booked proxy L12M do x% shop đứng đầu tạo ra · shop có ≥1 hồ sơ thuộc nhóm này",
    c_size_h3: "Phân bố quy mô shop (shop có trong salesroom)",
    c_size_cap: "Cột: số shop theo số hồ sơ booked proxy L12M · Đường: số SA trung bình được gán/shop tại 30/09/2026",
    c_area_h3: "Shop và hồ sơ theo vùng",
    c_area_cap: "Cột: số shop theo loại · Đường: hồ sơ booked proxy L12M · lọc theo Vùng/Loại shop",

    sec3_title: "3. Lead và liên kết ứng viên với contract",
    sec3_sub: "leads · 31/12/2025 – 17/10/2026 · số liệu lead có nhân sample_weight",
    c_leads_h3: "Lead theo tháng gán (date_assigned)",
    c_leads_cap: "Lead có trọng số theo sản phẩm · lọc theo Sản phẩm",
    c_match_h3: "Lead ghép với contract ứng viên (quy tắc đề)",
    c_match_cap: "Cùng khách đã chuẩn hóa + cùng sản phẩm + date_assigned ≤ date_apply · mỗi lead chọn một contract ASOF gần nhất · đây là liên kết ứng viên, chưa phải conversion chính thức",
    c_cross_h3: "Contract ứng viên được ghép với lead ở shop nào?",
    c_cross_cap: "Trong các lead có trọng số đã ghép được, toàn kỳ lead 31/12/2025–17/10/2026 · mẫu số là lead ứng viên đã ghép theo nhóm shop nguồn",
    c_outcome_h3: "Kết quả lead (cột result)",
    c_outcome_cap: "Ánh xạ result → cl_lead_fin_reason.id_source (giả định, xem ghi chú)",
    c_source_h3: "Nguồn lead",
    c_source_cap: "id_lead_source · lead có trọng số",

    sec4_title: "4. Top 300 shop theo hồ sơ booked proxy L12M",
    sec4_sub: "chỉ shop có trong salesroom · bấm tiêu đề cột để sắp xếp · lọc theo Vùng/Loại shop",
    sec5_title: "5. Kiểm tra chất lượng dữ liệu",
    sec6_title: "6. Độ phủ, khóa nối và giới hạn dữ liệu",
    sec6_sub: "đối soát ClickHouse ngày 21/10/2026 · biểu đồ phía trên là snapshot 20/10/2026 22:07",
    sec7_title: "7. Tách bạch bốn lớp tiềm năng theo đề Round 3",

    // Subtitle
    sub_text: "Nguồn: ClickHouse r3_bronze · tạo lúc {gen} · {rows} dòng trên {tables} bảng",

    // Number unit suffixes
    unit_trillion: " nghìn tỷ",
    unit_billion: " tỷ",
    unit_million: " tr",
    unit_thousand: " k",
    currency: " ₫",

    // KPI Titles and Subtitles
    kpi_apps_l: "Hồ sơ nộp",
    kpi_apps_s: "{apps} hồ sơ · 21 tháng",
    kpi_booked_l: "Hồ sơ booked proxy*",
    kpi_booked_s: "Tỷ lệ proxy {pct}",
    kpi_credit_l: "credit_amount proxy*",
    kpi_credit_s: "Tổng credit_amount trên hồ sơ booked proxy; không phải dư nợ xác nhận",
    kpi_unmapped_l: "Hợp đồng chưa khớp salesroom",
    kpi_unmapped_s: "{rows} hồ sơ · không suy ra kênh",
    kpi_fpd_l: "Cờ trễ kỳ 1",
    kpi_fpd_s: "Hồ sơ booked proxy nộp trước 06/2026",
    kpi_leads_l: "Lead (có trọng số)",
    kpi_leads_s: "{rate} ghép candidate theo ASOF · không phải conversion chính thức",

    // Insights Cards
    ins_warn_unmapped_t: "Hợp đồng thiếu mapping salesroom, chưa xác định được kênh",
    ins_warn_unmapped_b: "{pct} hồ sơ ({unmapped}/{total}) ở {shops} mã shop không khớp salesroom. Thiếu mapping không chứng minh đây là online hay đối tác; tỷ lệ khớp khác nhiều theo sản phẩm.",
    ins_pareto_t: "Booked proxy tập trung ở một nhóm shop",
    ins_pareto_b: "Top 1% shop có {p1}% hồ sơ booked proxy L12M; top 10% có {p10}% trên {shops} shop có booking proxy.",
    ins_cross_t: "Liên kết khác shop chỉ là ứng viên cross-sell",
    ins_cross_b: "Toàn kỳ lead 31/12/2025–17/10/2026, trong lead có trọng số đã ghép từ POS vật lý, tỷ trọng contract ở mã shop ngoài salesroom là {cross}. Mẫu số là lead ứng viên đã ghép theo nhóm shop nguồn; biểu đồ dùng một phép gán ASOF, không phải conversion chính thức hay bằng chứng nhân quả.",
    ins_match_t: "Không đọc match rate như conversion",
    ins_match_b: "{rate} lead có trọng số được ghép với contract ứng viên trong snapshot. UUID lặp, sample_weight và right-censoring cần được xử lý trước khi công bố conversion.",

    // Chart labels
    chart_booked_proxy_rate: "Tỷ lệ booked proxy (%)",
    chart_apps: "Hồ sơ",
    chart_booked_proxy: "Booked proxy",
    chart_shop_count: "Số shop",
    chart_cum_booked: "Tích lũy % booked proxy",
    chart_even_dist: "Phân bổ đều",
    chart_avg_sa: "SA trung bình/shop",
    chart_booked_l12: "Booked proxy L12M",
    chart_match_asof: "% lead ghép candidate contract (ASOF)",
    chart_match_booked: "% ghép candidate và booked proxy",
    chart_match_30d: "% ghép candidate trong 30 ngày",
    chart_subtitle_censor: "Các tháng cuối thấp một phần do kiểm duyệt phải (contract dừng ở 30/09/2026)",

    // Table Column Headers
    th_shop: "Shop",
    th_category: "Loại",
    th_model: "Model",
    th_area: "Vùng",
    th_province: "Tỉnh",
    th_prod: "SP chính",
    th_status: "Trạng thái",
    th_age: "Tuổi (tháng)",
    th_sa: "SA gán",
    th_booked_l12: "Booked proxy L12M",
    th_book_rate: "% booked proxy",
    th_q3_yoy: "Q3 YoY %",
    th_fpd: "Trễ kỳ 1 %",
    th_n_prods: "Số SP",
    th_dq_check: "Kiểm tra",
    th_dq_value: "Giá trị",
    th_table_bronze: "Bảng r3_bronze",
    th_rows: "Số dòng",
    tbl_no_shop: "Không có shop nào trong top 300 khớp bộ lọc."
  },
  en: {
    head_title: "BI10 Round 3 · Dataset Overview",
    filter_product: "Product",
    filter_area: "Area (shop)",
    filter_category: "Shop category",
    opt_all: "All",
    link_decision: "🎯 Decision Studio (Task 6)",
    link_erd: "🏛️ Data ERD",
    tab_overview: "Overview",
    tab_cleaning: "Data Cleaning",
    tab_correlation: "Correlation",

    theme_dark: "Dark",
    theme_light: "Light",

    sec1_title: "1. Contracts Over Time",
    sec1_sub: "contract · 01/2025 – 09/2026 · filtered by Product",
    c_monthly_h3: "Applications and Booked Proxy Contracts by Month",
    c_monthly_cap: "Bar: applications by date_apply · Line: booked proxy rate / applications",
    c_mix_h3: "Booked Proxy Contract Mix by Product",
    c_mix_cap: "Full 21-month period",
    c_status_h3: "Application Status by Product",
    c_status_cap: "% share of applications for each product",
    c_fpd_h3: "First-Payment Default (dpd_1pd) by Application Month",
    c_fpd_cap: "Booked proxy contracts applied before 06/2026 to ensure observable window",

    sec2_title: "2. Shop Network",
    sec2_sub: "salesroom × contract · Last 12 months (10/2025 – 09/2026)",
    c_cat_h3: "Contracts by Shop Category",
    c_cat_cap: '"Not in salesroom table" = shop code unmatched · cannot infer as online channel · filtered by Product',
    c_pareto_h3: "Concentration Level (Pareto)",
    c_pareto_cap: "% of L12M booked proxy contracts generated by top x% shops · shops with ≥ 1 booking",
    c_size_h3: "Shop Size Distribution (shops in salesroom)",
    c_size_cap: "Bar: shops by L12M booked proxy contracts · Line: average SA assigned/shop at 2026-09-30",
    c_area_h3: "Shops and Contracts by Area",
    c_area_cap: "Bar: shops by category · Line: L12M booked proxy contracts · filtered by Area/Category",

    sec3_title: "3. Leads and Candidate Contract Attribution",
    sec3_sub: "leads · 2025-12-31 – 2026-10-17 · weighted by sample_weight",
    c_leads_h3: "Leads by Assigned Month (date_assigned)",
    c_leads_cap: "Weighted leads by product · filtered by Product",
    c_match_h3: "Leads Matched to Candidate Contracts (case rule)",
    c_match_cap: "Same normalized client + same product + date_assigned ≤ date_apply · ASOF nearest contract · candidate link, not formal conversion",
    c_cross_h3: "Where Were Candidate Contracts Signed by Lead Shop Category?",
    c_cross_cap: "Among weighted matched leads, 2025-12-31 to 2026-10-17 · denominator = matched candidate leads by source shop category",
    c_outcome_h3: "Lead Outcome Distribution (result column)",
    c_outcome_cap: "Mapping result → cl_lead_fin_reason.id_source (assumed, see notes)",
    c_source_h3: "Lead Source",
    c_source_cap: "id_lead_source · weighted leads",

    sec4_title: "4. Top 300 Representative Shops by L12M Booked Proxy",
    sec4_sub: "only shops present in salesroom · click column header to sort · filtered by Area/Category",
    sec5_title: "5. Data Quality Checks",
    sec6_title: "6. Coverage, Keys, and Data Limitations",
    sec6_sub: "ClickHouse reconciliation 2026-10-21 · charts above reflect snapshot 2026-10-20 22:07",
    sec7_title: "7. Separation of Four Potential Layers per Round 3 Brief",

    // Subtitle
    sub_text: "Source: ClickHouse r3_bronze · generated {gen} · {rows} rows across {tables} tables",

    // Number unit suffixes
    unit_trillion: "T VND",
    unit_billion: "B VND",
    unit_million: "M",
    unit_thousand: "k",
    currency: " ₫",

    // KPI Titles and Subtitles
    kpi_apps_l: "Applications",
    kpi_apps_s: "{apps} applications · 21 months",
    kpi_booked_l: "Booked Proxy Contracts*",
    kpi_booked_s: "Proxy conversion rate {pct}",
    kpi_credit_l: "credit_amount proxy*",
    kpi_credit_s: "Total credit_amount of booked proxy contracts; not confirmed outstanding",
    kpi_unmapped_l: "Unmapped Salesroom Contracts",
    kpi_unmapped_s: "{rows} applications · unclassified channel",
    kpi_fpd_l: "First-Payment Default (FPD)",
    kpi_fpd_s: "Booked proxy contracts applied before 06/2026",
    kpi_leads_l: "Weighted Leads",
    kpi_leads_s: "{rate} matched candidate via ASOF · not formal conversion",

    // Insights Cards
    ins_warn_unmapped_t: "Unmapped salesroom contracts, channel unconfirmed",
    ins_warn_unmapped_b: "{pct} of applications ({unmapped}/{total}) at {shops} shop codes not in salesroom master. Missing mapping does not prove online or partner; match rate varies widely by product.",
    ins_pareto_t: "Booked proxy contracts heavily concentrated",
    ins_pareto_b: "Top 1% shops generate {p1}% of L12M booked proxy contracts; top 10% generate {p10}% across {shops} shops with booking proxy.",
    ins_cross_t: "Cross-shop links are candidate cross-sells",
    ins_cross_b: "Across 2025-12-31 to 2026-10-17, among weighted leads matched from physical POS, share of contracts at unmatched shop codes is {cross}. Denominator is candidate matched leads by source shop category; chart uses ASOF nearest assignment, not formal conversion or causal proof.",
    ins_match_t: "Do not read candidate match rate as conversion",
    ins_match_b: "{rate} of weighted leads matched to a candidate contract in this snapshot. Repeated UUIDs, sample_weight, and right-censoring must be resolved before publishing conversion.",

    // Chart labels
    chart_booked_proxy_rate: "Booked proxy rate (%)",
    chart_apps: "Applications",
    chart_booked_proxy: "Booked proxy",
    chart_shop_count: "Shops",
    chart_cum_booked: "Cumulative % booked proxy",
    chart_even_dist: "Even distribution",
    chart_avg_sa: "Average SA/shop",
    chart_booked_l12: "L12M Booked proxy",
    chart_match_asof: "% leads matched candidate contract (ASOF)",
    chart_match_booked: "% matched candidate & booked proxy",
    chart_match_30d: "% matched candidate within 30 days",
    chart_subtitle_censor: "Later months lower partly due to right-censoring (contracts end 2026-09-30)",

    // Table Column Headers
    th_shop: "Shop",
    th_category: "Category",
    th_model: "Model",
    th_area: "Area",
    th_province: "Province",
    th_prod: "Primary Prod",
    th_status: "Status",
    th_age: "Age (mos)",
    th_sa: "SA FTE",
    th_booked_l12: "L12M Booked Proxy",
    th_book_rate: "% Booked Proxy",
    th_q3_yoy: "Q3 YoY %",
    th_fpd: "FPD %",
    th_n_prods: "Prod Count",
    th_dq_check: "Check Item",
    th_dq_value: "Value",
    th_table_bronze: "r3_bronze Table",
    th_rows: "Rows",
    tbl_no_shop: "No shops in top 300 match current filters."
  }
};

function tO(k) {
  const l = window.BI10_LANG || 'vi';
  return (OVERVIEW_I18N[l] && OVERVIEW_I18N[l][k]) || (OVERVIEW_I18N['en'] && OVERVIEW_I18N['en'][k]) || k;
}

function applyOverviewStaticI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.dataset.i18n;
    if (k) el.innerHTML = tO(k);
  });
}
