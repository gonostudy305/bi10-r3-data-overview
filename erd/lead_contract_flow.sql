-- Reproduce the aggregates shown in the Cleaning & marts relationship chart.
-- Run against the read-only ClickHouse database r3_sandbox_vu.
-- Shop-master match means the lead's normalized shop_id exists in clean_salesroom;
-- it does not prove the salesroom originated the lead.

SELECT
    count() AS lead_rows,
    countIf(shop_in_master = 1) AS lead_rows_shop_master,
    countIf(shop_in_master = 0) AS lead_rows_outside_master,
    sum(w) AS weighted_leads,
    sumIf(w, shop_in_master = 1) AS weighted_leads_shop_master,
    sumIf(w, shop_in_master = 0) AS weighted_leads_outside_master,
    uniqExactIf(shop_id, shop_in_master = 1) AS master_shops_with_leads
FROM r3_sandbox_vu.clean_lead;

-- Direct reference on lead.skp_credit_case, separately from the brief's
-- client + product + assignment-time attribution rule.
SELECT
    countIf(lead_credit_case_id IS NOT NULL) AS lead_rows_with_case_id,
    countIf(lead_credit_case_id IN
        (SELECT credit_case_id FROM r3_sandbox_vu.clean_contract)
    ) AS lead_rows_with_valid_case_id,
    uniqExactIf(lead_credit_case_id, lead_credit_case_id IN
        (SELECT credit_case_id FROM r3_sandbox_vu.clean_contract)
    ) AS distinct_contracts_directly_referenced
FROM r3_sandbox_vu.clean_lead;

-- Contract-side denominator and latest-eligible-lead attribution.
-- This table uses same client + same product + date_assigned <= date_apply;
-- the tie-break and last-touch rule are team processing choices.
SELECT
    (SELECT count()
     FROM r3_sandbox_vu.clean_contract
     WHERE client_id IS NOT NULL
       AND dt_apply >= toDateTime('2025-12-31 00:00:00')
       AND dt_apply <  toDateTime('2026-10-01 00:00:00')) AS eligible_contracts,
    count() AS attributed_contracts,
    countIf(is_booked = 1) AS attributed_booked_contracts,
    countIf(days_lead_to_apply <= 90) AS attributed_within_90d,
    countIf(days_lead_to_apply > 90) AS attributed_over_90d
FROM r3_sandbox_vu.lead_contract_attr
WHERE dt_apply >= toDateTime('2025-12-31 00:00:00')
  AND dt_apply <  toDateTime('2026-10-01 00:00:00');
