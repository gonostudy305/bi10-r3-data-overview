
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

    // KPI labels
    kpi_apps: "Hồ sơ nộp",
    kpi_booked: "Hồ sơ booked proxy*",
    kpi_credit: "credit_amount proxy*",
    kpi_fpd: "Tỷ lệ cờ trễ kỳ 1 (dpd_1pd)*",
    kpi_unmapped: "Hồ sơ thiếu mã salesroom",
    kpi_leads: "Lead có trọng số (sample_weight)",
    kpi_match: "Lead ghép được contract*",

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
    th_n_prods: "Số SP"
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

    // KPI labels
    kpi_apps: "Total Applications",
    kpi_booked: "Booked Proxy Contracts*",
    kpi_credit: "credit_amount proxy*",
    kpi_fpd: "First-Payment Default Rate*",
    kpi_unmapped: "Unmapped Salesroom Contracts",
    kpi_leads: "Weighted Leads (sample_weight)",
    kpi_match: "Leads Matched to Contract*",

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
    th_n_prods: "Prod Count"
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
