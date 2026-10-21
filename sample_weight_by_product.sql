-- Reproduce the sample_weight comparison shown in the Data Cleaning tab.
-- Source: ClickHouse r3_bronze.leads (raw layer; no rows filtered out).
-- COUNT() is the physical row count. SUM(sample_weight) is a weighted total;
-- it does not, by itself, prove the source-frame size or unique lead count.

WITH parsed AS
(
    SELECT
        code_product_type,
        code_product_type_original,
        id_lead_source,
        toFloat64OrNull(nullIf(trimBoth(sample_weight), '')) AS weight_num
    FROM r3_bronze.leads
),
product_totals AS
(
    SELECT
        ifNull(nullIf(code_product_type, ''), '(empty)') AS product,
        count() AS raw_rows,
        sum(toInt64(round(ifNull(weight_num, 0) * 1000000))) AS weighted_micros,
        countIf(isNull(weight_num) OR weight_num <= 0) AS invalid_weight_rows
    FROM parsed
    GROUP BY product
)
SELECT
    product,
    raw_rows,
    round(100.0 * raw_rows / sum(raw_rows) OVER (), 2) AS raw_row_share_pct,
    weighted_micros / 1000000.0 AS weighted_total,
    round(100.0 * weighted_micros / sum(weighted_micros) OVER (), 2) AS weighted_share_pct,
    invalid_weight_rows
FROM product_totals
ORDER BY weighted_total DESC;


-- Inspect the non-unit weight slice by product, source, original product code,
-- and weight. The micro-unit sum avoids floating-point display drift at 6 dp.
WITH parsed AS
(
    SELECT
        code_product_type,
        code_product_type_original,
        id_lead_source,
        toFloat64OrNull(nullIf(trimBoth(sample_weight), '')) AS weight_num
    FROM r3_bronze.leads
)
SELECT
    code_product_type,
    id_lead_source,
    code_product_type_original,
    weight_num AS sample_weight,
    count() AS raw_rows,
    sum(toInt64(round(ifNull(weight_num, 0) * 1000000))) / 1000000.0 AS weighted_total
FROM parsed
WHERE isNotNull(weight_num)
  AND weight_num != 1
GROUP BY
    code_product_type,
    id_lead_source,
    code_product_type_original,
    weight_num
ORDER BY raw_rows DESC;
