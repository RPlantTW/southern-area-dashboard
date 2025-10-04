import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, ReferenceLine, ScatterChart, Scatter, ZAxis } from 'recharts';

// ====================================================================
// BATTLE OF THE AREAS DATA
// ====================================================================

// Data provided for S1, S2, S3 and Overall South comparison
const battleOfTheAreasSourceData = [
    { region: 'South 1', revenueVsTarget: 91.30, atv: 17.19, ncVsTGT: 65.20, raf: 8.90, vltz: 73.90, wrc: 59.70, unregisteredTransations: 6.70, appAdoption: 37.90, retention: 32.00 },
    { region: 'South 2', revenueVsTarget: 84.00, atv: 18.76, ncVsTGT: 62.60, raf: 13.10, vltz: 57.10, wrc: 57.10, unregisteredTransations: 9.30, appAdoption: 37.80, retention: 39.30 },
    { region: 'South 3', revenueVsTarget: 84.90, atv: 17.82, ncVsTGT: 48.60, raf: 4.60, vltz: 68.70, wrc: 56.60, unregisteredTransations: 8.20, appAdoption: 44.00, retention: 36.60 },
    { region: 'South', revenueVsTarget: 86.90, atv: 17.84, ncVsTGT: 59.80, raf: 8.70, vltz: 67.30, wrc: 58.40, unregisteredTransations: 7.90, appAdoption: 39.80, retention: 34.80 },
];

// Definition of KPIs and whether higher values are better
const Kpis = [
    { key: 'revenueVsTarget', label: 'Rev vs TGT', format: (v) => v.toFixed(1) + '%', higherIsBetter: true },
    { key: 'atv', label: 'ATV (£)', format: (v) => '£' + v.toFixed(2), higherIsBetter: true },
    { key: 'ncVsTGT', label: 'NC vs TGT %', format: (v) => v.toFixed(1) + '%', higherIsBetter: true },
    { key: 'raf', label: 'RAF %', format: (v) => v.toFixed(1) + '%', higherIsBetter: true },
    { key: 'vltz', label: 'VLTZ %', format: (v) => v.toFixed(1) + '%', higherIsBetter: true },
    { key: 'wrc', label: 'WRC %', format: (v) => v.toFixed(1) + '%', higherIsBetter: true },
    { key: 'unregisteredTransations', label: 'Unreg %', format: (v) => v.toFixed(1) + '%', higherIsBetter: false }, // LOWER IS BETTER
    { key: 'appAdoption', label: 'App Adop %', format: (v) => v.toFixed(1) + '%', higherIsBetter: true },
    { key: 'retention', label: 'RET %', format: (v) => v.toFixed(1) + '%', higherIsBetter: true },
];

// Helper function to calculate ranks for S1, S2, S3
const calculateBattleRanks = (data) => {
    const regionalData = data.filter(d => d.region !== 'South');
    const rankedData = data.map(d => ({ ...d }));

    Kpis.forEach(kpi => {
        const values = regionalData.map(d => d[kpi.key]);
        
        // Sort values to determine ranks (higherIsBetter toggles sorting order)
        const sortedValues = [...values].sort((a, b) => kpi.higherIsBetter ? b - a : a - b);
        
        // Assign rank to each region (1, 2, or 3)
        rankedData.forEach(item => {
            if (item.region === 'South') {
                item[`${kpi.key}Rank`] = null; // Overall row has no rank
                return;
            }
            // Find the rank (1-indexed)
            const rank = sortedValues.indexOf(item[kpi.key]) + 1;
            item[`${kpi.key}Rank`] = rank;
        });
    });
    return rankedData;
};

const battleOfTheAreasData = calculateBattleRanks(battleOfTheAreasSourceData);


// ====================================================================
// NEW Q2/SEPTEMBER DATA
// ====================================================================

// Raw September KPI Data (Store Level) - Used for Cluster Aggregation
const rawSeptemberKpiData = [
    { store: 'Bristol', cluster: 'S1-1-B', Sales: 22516.48, SalesTarget: 23500.00, SalesVsTGT: 95.80, Transacrions: 1441, ATV: 15.63, NC: 276, NCTGT: 378, NCVsTGT: 73.00, NCS_BUYING_LIQUID: 18, NCS_Buying_LIQUID_non_eligible: 3, NCS_BUYING_LIQUID_WRC_FIRST: 0, WRC: 71.00, NC_Emails_Captured: 26, NC_Email_Capture_percent: 94.90, NC_Phone_Numbers_captured: 238, NC_Phone_Number_capture_percent: 86.20, Unresgistered_Transactions: 11, Unregistered_percent: 4.90, NCs_from_RAF: 28, RAF_percent: 10.10, TOTAL_NUBER_OF_TRADE_IN_KITS: 20, Trade_in_Revenue_Kits_and_Flex_Pro_batteries: 386.25, Open_Tank_Kits_Sales_inc_Flex_pro_batteries: 2535.24, Trade_in_Vs_Kit_Sales: 15.20, TOTAL_3rd_Party_and_VLTZ_Revenue: 14873.28, TOTAL_3rd_Party_and_VLTZ_R_of_TOTAL_REVENUES: 66.10, Party_pound: 2475.67, VLTZ_pound: 12397.62, VLTZ_percent: 83.40, Sales_This_Year_if_LFL_store: 22516.48, Last_Year_Full_Month: 26248.29, percent_currently_achieved_of_LY: 85.80, Prev_Months_NCs: 196, Number_of_One_offs: 149, Number_of_Returning_Customers: 472, Retention: 24.00 },
    { store: 'Gloucester', cluster: 'S1-1-G', Sales: 13154.74, SalesTarget: 15400.00, SalesVsTGT: 85.40, Transacrions: 683, ATV: 19.26, NC: 28, NCTGT: 72, NCVsTGT: 39.20, NCS_BUYING_LIQUID: 16, NCS_Buying_LIQUID_non_eligible: 0, NCS_BUYING_LIQUID_WRC_FIRST: 12, WRC: 75.00, NC_Emails_Captured: 27, NC_Email_Capture_percent: 96.40, NC_Phone_Numbers_captured: 27, NC_Phone_Number_capture_percent: 96.40, Unresgistered_Transactions: 2, Unregistered_percent: 2.90, NCs_from_RAF: 5, RAF_percent: 17.90, TOTAL_NUBER_OF_TRADE_IN_KITS: 10, Trade_in_Revenue_Kits_and_Flex_Pro_batteries: 187.76, Open_Tank_Kits_Sales_inc_Flex_pro_batteries: 1389.74, Trade_in_Vs_Kit_Sales: 13.50, TOTAL_3rd_Party_and_VLTZ_Revenue: 7390.39, TOTAL_3rd_Party_and_VLTZ_R_of_TOTAL_REVENUES: 56.20, Party_pound: 1537.89, VLTZ_pound: 5852.49, VLTZ_percent: 79.20, Sales_This_Year_if_LFL_store: 13154.74, Last_Year_Full_Month: 14158.48, percent_currently_achieved_of_LY: 92.90, Prev_Months_NCs: 26, Number_of_One_offs: 18, Number_of_Returning_Customers: 83, Retention: 30.80 },
    { store: 'Nottingham', cluster: 'S1-1-N', Sales: 10700.66, SalesTarget: 15000.00, SalesVsTGT: 71.30, Transacrions: 713, ATV: 15.01, NC: 75, NCTGT: 140, NCVsTGT: 53.60, NCS_BUYING_LIQUID: 42, NCS_Buying_LIQUID_non_eligible: 0, NCS_BUYING_LIQUID_WRC_FIRST: 10, WRC: 23.80, NC_Emails_Captured: 62, NC_Email_Capture_percent: 82.70, NC_Phone_Numbers_captured: 91, NC_Phone_Number_capture_percent: 121.50, Unresgistered_Transactions: 10, Unregistered_percent: 14.30, NCs_from_RAF: 7, RAF_percent: 9.30, TOTAL_NUBER_OF_TRADE_IN_KITS: 2, Trade_in_Revenue_Kits_and_Flex_Pro_batteries: 96.20, Open_Tank_Kits_Sales_inc_Flex_pro_batteries: 1164.16, Trade_in_Vs_Kit_Sales: 8.30, TOTAL_3rd_Party_and_VLTZ_Revenue: 6616.84, TOTAL_3rd_Party_and_VLTZ_R_of_TOTAL_REVENUES: 61.80, Party_pound: 2197.78, VLTZ_pound: 4419.06, VLTZ_percent: 66.80, Sales_This_Year_if_LFL_store: 10700.66, Last_Year_Full_Month: 16177.12, percent_currently_achieved_of_LY: 66.10, Prev_Months_NCs: 76, Number_of_One_offs: 64, Number_of_Returning_Customers: 121, Retention: 15.80 },
    { store: 'Rugby', cluster: 'S1-1-R', Sales: 10026.11, SalesTarget: 10400.00, SalesVsTGT: 96.40, Transacrions: 500, ATV: 20.05, NC: 35, NCTGT: 77, NCVsTGT: 45.40, NCS_BUYING_LIQUID: 21, NCS_Buying_LIQUID_non_eligible: 0, NCS_BUYING_LIQUID_WRC_FIRST: 3, WRC: 66.70, NC_Emails_Captured: 31, NC_Email_Capture_percent: 88.60, NC_Phone_Numbers_captured: 30, NC_Phone_Number_capture_percent: 85.70, Unresgistered_Transactions: 6, Unregistered_percent: 1.20, NCs_from_RAF: 3, RAF_percent: 8.60, TOTAL_NUBER_OF_TRADE_IN_KITS: 8, Trade_in_Revenue_Kits_and_Flex_Pro_batteries: 172.66, Open_Tank_Kits_Sales_inc_Flex_pro_batteries: 1036.89, Trade_in_Vs_Kit_Sales: 16.70, TOTAL_3rd_Party_and_VLTZ_Revenue: 5279.47, TOTAL_3rd_Party_and_VLTZ_R_of_TOTAL_REVENUES: 52.70, Party_pound: 1869.15, VLTZ_pound: 3410.33, VLTZ_percent: 64.60, Sales_This_Year_if_LFL_store: 10026.11, Last_Year_Full_Month: 10035.87, percent_currently_achieved_of_LY: 99.90, Prev_Months_NCs: 33, Number_of_One_offs: 18, Number_of_Returning_Customers: 154, Retention: 45.50 },
    { store: 'Barnstaple', cluster: 'S1-2-BE', Sales: 16192.75, SalesTarget: 16100.00, SalesVsTGT: 100.60, Transacrions: 896, ATV: 18.07, NC: 38, NCTGT: 49, NCVsTGT: 77.60, NCS_BUYING_LIQUID: 24, NCS_Buying_LIQUID_non_eligible: 0, NCS_BUYING_LIQUID_WRC_FIRST: 3, WRC: 50.00, NC_Emails_Captured: 35, NC_Email_Capture_percent: 92.10, NC_Phone_Numbers_captured: 35, NC_Phone_Number_capture_percent: 92.10, Unresgistered_Transactions: 9, Unregistered_percent: 11.00, NCs_from_RAF: 5, RAF_percent: 13.20, TOTAL_NUBER_OF_TRADE_IN_KITS: 15, Trade_in_Revenue_Kits_and_Flex_Pro_batteries: 336.24, Open_Tank_Kits_Sales_inc_Flex_pro_batteries: 1969.59, Trade_in_Vs_Kit_Sales: 17.10, TOTAL_3rd_Party_and_VLTZ_Revenue: 9262.75, TOTAL_3rd_Party_and_VLTZ_R_of_TOTAL_REVENUES: 57.20, Party_pound: 2463.50, VLTZ_pound: 6799.25, VLTZ_percent: 73.40, Sales_This_Year_if_LFL_store: 16192.75, Last_Year_Full_Month: 15390.22, percent_currently_achieved_of_LY: 105.20, Prev_Months_NCs: 41, Number_of_One_offs: 21, Number_of_Returning_Customers: 120, Retention: 48.80 },
    { store: 'Exeter', cluster: 'S1-2-BE', Sales: 23744.81, SalesTarget: 27700.00, SalesVsTGT: 85.70, Transacrions: 1623, ATV: 14.63, NC: 162, NCTGT: 230, NCVsTGT: 70.40, NCS_BUYING_LIQUID: 111, NCS_BUYING_LIQUID_non_eligible: 0, NCS_BUYING_LIQUID_WRC_FIRST: 14, WRC: 59.50, NC_Emails_Captured: 142, NC_Email_Capture_percent: 87.70, NC_Phone_Numbers_captured: 142, NC_Phone_Number_capture_percent: 87.70, Unresgistered_Transactions: 236, Unregistered_percent: 14.50, NCs_from_RAF: 11, RAF_percent: 6.80, TOTAL_NUBER_OF_TRADE_IN_KITS: 13, Trade_in_Revenue_Kits_and_Flex_Pro_batteries: 394.52, Open_Tank_Kits_Sales_inc_Flex_pro_batteries: 3318.32, Trade_in_Vs_Kit_Sales: 11.90, TOTAL_3rd_Party_and_VLTZ_Revenue: 15210.88, TOTAL_3rd_Party_and_VLTZ_R_of_TOTAL_REVENUES: 64.10, Party_pound: 6246.24, VLTZ_pound: 8964.63, VLTZ_percent: 58.90, Sales_This_Year_if_LFL_store: 23744.81, Last_Year_Full_Month: 29557.06, percent_currently_achieved_of_LY: 80.30, Prev_Months_NCs: 135, Number_of_One_offs: 90, Number_of_Returning_Customers: 453, Retention: 33.30 },
    { store: 'Birmingham', cluster: 'S1-2-BT', Sales: 8117.31, SalesTarget: 11000.00, SalesVsTGT: 73.80, Transacrions: 559, ATV: 14.52, NC: 58, NCTGT: 76, NCVsTGT: 76.50, NCS_BUYING_LIQUID: 41, NCS_Buying_LIQUID_non_eligible: 0, NCS_BUYING_LIQUID_WRC_FIRST: 4, WRC: 73.20, NC_Emails_Captured: 44, NC_Email_Capture_percent: 75.90, NC_Phone_Numbers_captured: 43, NC_Phone_Number_capture_percent: 74.10, Unresgistered_Transactions: 87, Unregistered_percent: 15.60, NCs_from_RAF: 1, RAF_percent: 1.70, TOTAL_NUBER_OF_TRADE_IN_KITS: 0, Trade_in_Revenue_Kits_and_Flex_Pro_batteries: 0.00, Open_Tank_Kits_Sales_inc_Flex_pro_batteries: 808.32, Trade_in_Vs_Kit_Sales: 0.00, TOTAL_3rd_Party_and_VLTZ_Revenue: 5430.90, TOTAL_3rd_Party_and_VLTZ_R_of_TOTAL_REVENUES: 66.90, Party_pound: 2234.44, VLTZ_pound: 3196.46, VLTZ_percent: 58.90, Sales_This_Year_if_LFL_store: 8117.31, Last_Year_Full_Month: 11330.88, percent_currently_achieved_of_LY: 71.60, Prev_Months_NCs: 44, Number_of_One_offs: 32, Number_of_Returning_Customers: 122, Retention: 27.30 },
    { store: 'Tyburn', cluster: 'S1-2-BT', Sales: 9661.74, SalesTarget: 10800.00, SalesVsTGT: 89.50, Transacrions: 432, ATV: 22.37, NC: 12, NCTGT: 35, NCVsTGT: 34.30, NCS_BUYING_LIQUID: 5, NCS_Buying_LIQUID_non_eligible: 0, NCS_BUYING_LIQUID_WRC_FIRST: 0, WRC: 60.00, NC_Emails_Captured: 7, NC_Email_Capture_percent: 58.30, NC_Phone_Numbers_captured: 8, NC_Phone_Number_capture_percent: 66.70, Unresgistered_Transactions: 32, Unregistered_percent: 7.40, NCs_from_RAF: 0, RAF_percent: 0.00, TOTAL_NUBER_OF_TRADE_IN_KITS: 8, Trade_in_Revenue_Kits_and_Flex_Pro_batteries: 194.57, Open_Tank_Kits_Sales_inc_Flex_pro_batteries: 788.37, Trade_in_Vs_Kit_Sales: 24.70, TOTAL_3rd_Party_and_VLTZ_Revenue: 3120.27, TOTAL_3rd_Party_and_VLTZ_R_of_TOTAL_REVENUES: 32.30, Party_pound: 1494.65, VLTZ_pound: 1625.62, VLTZ_percent: 52.10, Sales_This_Year_if_LFL_store: 9661.74, Last_Year_Full_Month: 10740.10, percent_currently_achieved_of_LY: 90.00, Prev_Months_NCs: 15, Number_of_One_offs: 8, Number_of_Returning_Customers: 74, Retention: 46.70 },
    { store: 'Wolves Chapel Ash', cluster: 'S1-2-CP', Sales: 10800.08, SalesTarget: 10600.00, SalesVsTGT: 101.90, Transacrions: 481, ATV: 22.45, NC: 22, NCTGT: 37, NCVsTGT: 59.50, NCS_BUYING_LIQUID: 16, NCS_Buying_LIQUID_non_eligible: 0, NCS_BUYING_LIQUID_WRC_FIRST: 2, WRC: 72.70, NC_Emails_Captured: 22, NC_Email_Capture_percent: 100.00, NC_Phone_Numbers_captured: 16, NC_Phone_Number_capture_percent: 72.70, Unresgistered_Transactions: 20, Unregistered_percent: 4.20, NCs_from_RAF: 9, RAF_percent: 40.90, TOTAL_NUBER_OF_TRADE_IN_KITS: 9, Trade_in_Revenue_Kits_and_Flex_Pro_batteries: 276.86, Open_Tank_Kits_Sales_inc_Flex_pro_batteries: 1133.00, Trade_in_Vs_Kit_Sales: 24.40, TOTAL_3rd_Party_and_VLTZ_Revenue: 4092.98, TOTAL_3rd_Party_and_VLTZ_R_of_TOTAL_REVENUES: 37.90, Party_pound: 927.00, VLTZ_pound: 3165.98, VLTZ_percent: 77.40, Sales_This_Year_if_LFL_store: 10800.08, Last_Year_Full_Month: 10724.27, percent_currently_achieved_of_LY: 100.70, Prev_Months_NCs: 18, Number_of_One_offs: 15, Number_of_Returning_Customers: 31, Retention: 16.70 },
    { store: 'Wolves Penn Road', cluster: 'S1-2-CP', Sales: 8305.73, SalesTarget: 8600.00, SalesVsTGT: 96.60, Transacrions: 427, ATV: 19.45, NC: 21, NCTGT: 41, NCVsTGT: 51.20, NCS_BUYING_LIQUID: 19, NCS_Buying_LIQUID_non_eligible: 0, NCS_BUYING_LIQUID_WRC_FIRST: 2, WRC: 90.50, NC_Emails_Captured: 21, NC_Email_Capture_percent: 100.00, NC_Phone_Numbers_captured: 17, NC_Phone_Number_capture_percent: 81.00, Unresgistered_Transactions: 21, Unregistered_percent: 4.90, NCs_from_RAF: 5, RAF_percent: 23.80, TOTAL_NUBER_OF_TRADE_IN_KITS: 12, Trade_in_Revenue_Kits_and_Flex_Pro_batteries: 292.68, Open_Tank_Kits_Sales_inc_Flex_pro_batteries: 771.69, Trade_in_Vs_Kit_Sales: 37.90, TOTAL_3rd_Party_and_VLTZ_Revenue: 4102.70, TOTAL_3rd_Party_and_VLTZ_R_of_TOTAL_REVENUES: 49.40, Party_pound: 1490.26, VLTZ_pound: 2612.44, VLTZ_percent: 63.70, Sales_This_Year_if_LFL_store: 8305.73, Last_Year_Full_Month: 8729.40, percent_currently_achieved_of_LY: 95.10, Prev_Months_NCs: 27, Number_of_One_offs: 17, Number_of_Returning_Customers: 103, Retention: 37.00 },
    { store: 'Bridgend', cluster: 'S1-3-BMR', Sales: 14103.19, SalesTarget: 15100.00, SalesVsTGT: 93.40, Transacrions: 900, ATV: 15.67, NC: 67, NCTGT: 85, NCVsTGT: 78.80, NCS_BUYING_LIQUID: 47, NCS_Buying_LIQUID_non_eligible: 0, NCS_BUYING_LIQUID_WRC_FIRST: 4, WRC: 70.10, NC_Emails_Captured: 47, NC_Email_Capture_percent: 70.10, NC_Phone_Numbers_captured: 50, NC_Phone_Number_capture_percent: 74.60, Unresgistered_Transactions: 36, Unregistered_percent: 4.00, NCs_from_RAF: 5, RAF_percent: 7.50, TOTAL_NUBER_OF_TRADE_IN_KITS: 4, Trade_in_Revenue_Kits_and_Flex_Pro_batteries: 107.96, Open_Tank_Kits_Sales_inc_Flex_pro_batteries: 1490.37, Trade_in_Vs_Kit_Sales: 7.20, TOTAL_3rd_Party_and_VLTZ_Revenue: 10162.42, TOTAL_3rd_Party_and_VLTZ_R_of_TOTAL_REVENUES: 72.10, Party_pound: 2435.25, VLTZ_pound: 7727.16, VLTZ_percent: 76.00, Sales_This_Year_if_LFL_store: 14103.19, Last_Year_Full_Month: 14611.50, percent_currently_achieved_of_LY: 96.50, Prev_Months_NCs: 45, Number_of_One_offs: 27, Number_of_Returning_Customers: 184, Retention: 40.00 },
    { store: 'Merthyr', cluster: 'S1-3-BMR', Sales: 14105.79, SalesTarget: 16600.00, SalesVsTGT: 85.00, Transacrions: 897, ATV: 15.73, NC: 58, NCTGT: 127, NCVsTGT: 45.70, NCS_BUYING_LIQUID: 40, NCS_Buying_LIQUID_non_eligible: 0, NCS_BUYING_LIQUID_WRC_FIRST: 5, WRC: 69.00, NC_Emails_Captured: 50, NC_Email_Capture_percent: 86.20, NC_Phone_Numbers_captured: 56, NC_Phone_Number_capture_percent: 96.60, Unresgistered_Transactions: 41, Unregistered_percent: 4.60, NCs_from_RAF: 6, RAF_percent: 10.30, TOTAL_NUBER_OF_TRADE_IN_KITS: 5, Trade_in_Revenue_Kits_and_Flex_Pro_batteries: 167.15, Open_Tank_Kits_Sales_inc_Flex_pro_batteries: 2048.98, Trade_in_Vs_Kit_Sales: 8.20, TOTAL_3rd_Party_and_VLTZ_Revenue: 10796.73, TOTAL_3rd_Party_and_VLTZ_R_of_TOTAL_REVENUES: 76.50, Party_pound: 2631.69, VLTZ_pound: 8165.04, VLTZ_percent: 75.60, Sales_This_Year_if_LFL_store: 14105.79, Last_Year_Full_Month: 18412.70, percent_currently_achieved_of_LY: 76.60, Prev_Months_NCs: 45, Number_of_One_offs: 33, Number_of_Returning_Customers: 122, Retention: 26.70 },
    { store: 'Rumney', cluster: 'S1-3-BMR', Sales: 19610.38, SalesTarget: 24800.00, SalesVsTGT: 79.10, Transacrions: 1099, ATV: 17.84, NC: 51, NCTGT: 85, NCVsTGT: 60.00, NCS_BUYING_LIQUID: 35, NCS_Buying_LIQUID_non_eligible: 0, NCS_BUYING_LIQUID_WRC_FIRST: 4, WRC: 68.60, NC_Emails_Captured: 45, NC_Email_Capture_percent: 88.20, NC_Phone_Numbers_captured: 46, NC_Phone_Number_capture_percent: 90.20, Unresgistered_Transactions: 63, Unregistered_percent: 5.70, NCs_from_RAF: 7, RAF_percent: 13.70, TOTAL_NUBER_OF_TRADE_IN_KITS: 11, Trade_in_Revenue_Kits_and_Flex_Pro_batteries: 319.37, Open_Tank_Kits_Sales_inc_Flex_pro_batteries: 2113.62, Trade_in_Vs_Kit_Sales: 15.10, TOTAL_3rd_Party_and_VLTZ_Revenue: 11576.61, TOTAL_3rd_Party_and_VLTZ_R_of_TOTAL_REVENUES: 59.00, Party_pound: 2246.01, VLTZ_pound: 9330.60, VLTZ_percent: 80.60, Sales_This_Year_if_LFL_store: 19610.38, Last_Year_Full_Month: 24266.20, percent_currently_achieved_of_LY: 80.80, Prev_Months_NCs: 33, Number_of_One_offs: 21, Number_of_Returning_Customers: 123, Retention: 36.40 },
    { store: 'Madeley', cluster: 'S1-3-MSW', Sales: 22962.59, SalesTarget: 22400.00, SalesVsTGT: 102.50, Transacrions: 1301, ATV: 17.65, NC: 104, NCTGT: 157, NCVsTGT: 66.20, NCS_BUYING_LIQUID: 74, NCS_Buying_LIQUID_non_eligible: 0, NCS_BUYING_LIQUID_WRC_FIRST: 9, WRC: 71.20, NC_Emails_Captured: 92, NC_Email_Capture_percent: 88.50, NC_Phone_Numbers_captured: 89, NC_Phone_Number_capture_percent: 85.60, Unresgistered_Transactions: 0, Unregistered_percent: 0.00, NCs_from_RAF: 13, RAF_percent: 12.50, TOTAL_NUBER_OF_TRADE_IN_KITS: 20, Trade_in_Revenue_Kits_and_Flex_Pro_batteries: 448.67, Open_Tank_Kits_Sales_inc_Flex_pro_batteries: 2082.56, Trade_in_Vs_Kit_Sales: 21.50, TOTAL_3rd_Party_and_VLTZ_Revenue: 12495.34, TOTAL_3rd_Party_and_VLTZ_R_of_TOTAL_REVENUES: 54.40, Party_pound: 1336.66, VLTZ_pound: 11158.68, VLTZ_percent: 89.30, Sales_This_Year_if_LFL_store: 22962.59, Last_Year_Full_Month: 19748.59, percent_currently_achieved_of_LY: 116.30, Prev_Months_NCs: 132, Number_of_One_offs: 76, Number_of_Returning_Customers: 564, Retention: 42.40 },
    { store: 'Shrewsbury', cluster: 'S1-3-MSW', Sales: 15717.32, SalesTarget: 15400.00, SalesVsTGT: 102.10, Transacrions: 848, ATV: 18.53, NC: 84, NCTGT: 112, NCVsTGT: 75.00, NCS_BUYING_LIQUID: 36, NCS_Buying_LIQUID_non_eligible: 0, NCS_BUYING_LIQUID_WRC_FIRST: 6, WRC: 36.10, NC_Emails_Captured: 64, NC_Email_Capture_percent: 76.20, NC_Phone_Numbers_captured: 58, NC_Phone_Number_capture_percent: 69.00, Unresgistered_Transactions: 17, Unregistered_percent: 2.00, NCs_from_RAF: 2, RAF_percent: 2.40, TOTAL_NUBER_OF_TRADE_IN_KITS: 15, Trade_in_Revenue_Kits_and_Flex_Pro_batteries: 350.88, Open_Tank_Kits_Sales_inc_Flex_pro_batteries: 1958.82, Trade_in_Vs_Kit_Sales: 17.90, TOTAL_3rd_Party_and_VLTZ_Revenue: 6328.24, TOTAL_3rd_Party_and_VLTZ_R_of_TOTAL_REVENUES: 40.30, Party_pound: 1644.82, VLTZ_pound: 4683.42, VLTZ_percent: 74.00, Sales_This_Year_if_LFL_store: 15717.32, Last_Year_Full_Month: 15642.12, percent_currently_achieved_of_LY: 100.50, Prev_Months_NCs: 121, Number_of_One_offs: 84, Number_of_Returning_Customers: 373, Retention: 30.60 },
    { store: 'Wellington', cluster: 'S1-3-MSW', Sales: 11972.04, SalesTarget: 10500.00, SalesVsTGT: 114.00, Transacrions: 680, ATV: 17.61, NC: 70, NCTGT: 93, NCVsTGT: 75.30, NCS_BUYING_LIQUID: 44, NCS_Buying_LIQUID_non_eligible: 0, NCS_BUYING_LIQUID_WRC_FIRST: 5, WRC: 52.30, NC_Emails_Captured: 54, NC_Email_Capture_percent: 77.10, NC_Phone_Numbers_captured: 48, NC_Phone_Number_capture_percent: 68.60, Unresgistered_Transactions: 11, Unregistered_percent: 1.60, NCs_from_RAF: 9, RAF_percent: 12.90, TOTAL_NUBER_OF_TRADE_IN_KITS: 9, Trade_in_Revenue_Kits_and_Flex_Pro_batteries: 233.51, Open_Tank_Kits_Sales_inc_Flex_pro_batteries: 1538.49, Trade_in_Vs_Kit_Sales: 15.20, TOTAL_3rd_Party_and_VLTZ_Revenue: 4821.80, TOTAL_3rd_Party_and_VLTZ_R_of_TOTAL_REVENUES: 40.30, Party_pound: 1064.23, VLTZ_pound: 3757.58, VLTZ_percent: 77.90, Sales_This_Year_if_LFL_store: 11972.04, Last_Year_Full_Month: 9587.01, percent_currently_achieved_of_LY: 124.90, Prev_Months_NCs: 63, Number_of_One_offs: 41, Number_of_Returning_Customers: 223, Retention: 34.90 },
];

// Define which KPIs are used in the detailed table and whether high is good
const detailedKpiDefinitions = [
    { key: 'store', label: 'Store', format: (v) => v, higherIsBetter: true },
    { key: 'cluster', label: 'Cluster', format: (v) => v, higherIsBetter: true },

    { key: 'SalesVsTGT', label: 'Sales vs TGT %', format: (v) => v.toFixed(1) + '%', higherIsBetter: true },
    { key: 'NCVsTGT', label: 'NC vs TGT %', format: (v) => v.toFixed(1) + '%', higherIsBetter: true },
    { key: 'ATV', label: 'ATV', format: (v) => '£' + v.toFixed(2), higherIsBetter: true },
    { key: 'Retention', label: 'RET %', format: (v) => v.toFixed(1) + '%', higherIsBetter: true }, // CHANGED HERE
    { key: 'WRC', label: 'WRC %', format: (v) => v.toFixed(1) + '%', higherIsBetter: true },
    { key: 'VLTZ_percent', label: 'VLTZ %', format: (v) => v.toFixed(1) + '%', higherIsBetter: true },
    { key: 'Unregistered_percent', label: 'Unreg %', format: (v) => v.toFixed(1) + '%', higherIsBetter: false },
    { key: 'Trade_in_Vs_Kit_Sales', label: 'Trade-In %', format: (v) => v.toFixed(1) + '%', higherIsBetter: true },
    { key: 'RAF_percent', label: 'RAF %', format: (v) => v.toFixed(1) + '%', higherIsBetter: true },
    { key: 'NC_Email_Capture_percent', label: 'Email Cap %', format: (v) => v.toFixed(1) + '%', higherIsBetter: true },
    { key: 'NC_Phone_Number_capture_percent', label: 'Phone Cap %', format: (v) => v.toFixed(1) + '%', higherIsBetter: true },
];

function calculateSouthAreaAverages(data) {
    const totals = {};
    let count = 0;

    data.forEach(store => {
        count++;
        // NOTE: Only calculate averages for the actual numerical KPIs used for comparison (excluding store/cluster names)
        detailedKpiDefinitions.filter(kpi => kpi.key !== 'store' && kpi.key !== 'cluster').forEach(kpi => {
            const value = store[kpi.key];
            if (!totals[kpi.key]) {
                totals[kpi.key] = 0;
            }
            totals[kpi.key] += value;
        });
    });

    const averages = {};
    detailedKpiDefinitions.filter(kpi => kpi.key !== 'store' && kpi.key !== 'cluster').forEach(kpi => {
        averages[kpi.key] = totals[kpi.key] / count;
    });

    return averages;
}

const southAreaAverages = calculateSouthAreaAverages(rawSeptemberKpiData);

function aggregateDataByCluster(data) {
    const aggregated = {};

    data.forEach(store => {
        const cluster = store.cluster;
        if (!aggregated[cluster]) {
            aggregated[cluster] = {
                count: 0,
                SalesSum: 0,
                SalesTargetSum: 0,
                NCSum: 0,
                NCTargetSum: 0,
                WRCSum: 0,
                UnregisteredSum: 0,
                TradeInSum: 0,
                VLTZSum: 0,
                RetentionSum: 0,
            };
        }

        aggregated[cluster].count++;
        aggregated[cluster].SalesSum += store.Sales;
        aggregated[cluster].SalesTargetSum += store.SalesTarget;
        aggregated[cluster].NCSum += store.NC;
        aggregated[cluster].NCTargetSum += store.NCTGT;
        
        // Use direct percentages for averaging metrics
        aggregated[cluster].WRCSum += store.WRC;
        aggregated[cluster].UnregisteredSum += store.Unregistered_percent;
        aggregated[cluster].VLTZSum += store.VLTZ_percent;
        aggregated[cluster].TradeInSum += store.Trade_in_Vs_Kit_Sales;
        aggregated[cluster].RetentionSum += store.Retention; // September Retention
    });

    const result = [];
    for (const cluster in aggregated) {
        const agg = aggregated[cluster];
        const salesVsTarget = (agg.SalesSum / agg.SalesTargetSum) * 100;
        const ncVsTarget = (agg.NCSum / agg.NCTargetSum) * 100;
        
        result.push({
            cluster,
            // Sales/NC Totals (for first two charts)
            salesQ3: agg.SalesSum,
            salesTargetQ3: agg.SalesTargetSum,
            salesVsTarget: salesVsTarget,
            ncQ3: agg.NCSum,
            ncTargetQ3: agg.NCTargetSum,
            ncVsTarget: ncVsTarget,
            
            // Key Metric Snapshot (September - for highlights/correlation)
            salesVsTargetSep: salesVsTarget,
            ncVsTargetSep: ncVsTarget,
            wrc: agg.WRCSum / agg.count, // Average WRC %
            unregisteredTransaction: agg.UnregisteredSum / agg.count, // Average Unregistered %
            tradeInVsKitSales: agg.TradeInSum / agg.count, // Average Trade In %
            vltz: agg.VLTZSum / agg.count, // Average VLTZ %
            septemberRetention: agg.RetentionSum / agg.count, // Average Retention %
        });
    }

    return result;
}

const clusterKpiMetrics = aggregateDataByCluster(rawSeptemberKpiData);


// 1. CLUSTER SALES / NC DATA (September)
const q3SalesNcData = clusterKpiMetrics.map(item => ({
    cluster: item.cluster,
    salesQ3: item.salesQ3,
    salesTargetQ3: item.salesTargetQ3,
    salesVsTarget: item.salesVsTarget,
    ncQ3: item.ncQ3,
    ncTargetQ3: item.ncTargetQ3,
    ncVsTarget: item.ncVsTarget,
}));

// 2. CLUSTER KEY METRICS SNAPSHOT (September)
const newQ3KeyMetricsWithRetention = clusterKpiMetrics.map(item => ({
    cluster: item.cluster,
    salesVsTargetSep: item.salesVsTargetSep,
    ncVsTargetSep: item.ncVsTargetSep,
    wrc: item.wrc,
    unregisteredTransaction: item.unregisteredTransaction,
    tradeInVsKitSales: item.tradeInVsKitSales,
    vltz: item.vltz,
    septemberRetention: item.septemberRetention,
}));


// Q2 Monthly Retention Data (July, Aug, Sep)
const storeRetentionData = [
    { store: 'Bristol', cluster: 'S1-1-B', July: 34.10, August: 37.60, September: 24.00 },
    { store: 'Gloucester', cluster: 'S1-1-G', July: 40.00, August: 44.40, September: 30.80 },
    { store: 'Nottingham', cluster: 'S1-1-N', July: 28.60, August: 22.60, September: 15.80 },
    { store: 'Rugby', cluster: 'S1-1-R', July: 30.00, August: 38.20, September: 45.50 },
    { store: 'Barnstaple', cluster: 'S1-2-BE', July: 39.50, August: 56.10, September: 48.80 },
    { store: 'Exeter', cluster: 'S1-2-BE', July: 37.50, August: 28.50, September: 33.30 },
    { store: 'Birmingham', cluster: 'S1-2-BT', July: 50.00, August: 43.60, September: 27.30 },
    { store: 'Tyburn', cluster: 'S1-2-BT', July: 41.20, August: 30.80, September: 46.70 },
    { store: 'Wolves Chapel Ash', cluster: 'S1-2-CP', July: 38.10, August: 35.70, September: 16.70 },
    { store: 'Wolves Penn Road', cluster: 'S1-2-CP', July: 43.20, August: 53.30, September: 37.00 },
    { store: 'Bridgend', cluster: 'S1-3-BMR', July: 55.90, August: 40.90, September: 40.00 },
    { store: 'Merthyr', cluster: 'S1-3-BMR', July: 39.10, August: 40.60, September: 26.70 },
    { store: 'Rumney', cluster: 'S1-3-BMR', July: 42.40, August: 40.00, September: 36.40 },
    { store: 'Madeley', cluster: 'S1-3-MSW', July: 48.80, August: 33.80, September: 42.40 },
    { store: 'Shrewsbury', cluster: 'S1-3-MSW', July: 40.50, August: 32.20, September: 30.60 },
    { store: 'Wellington', cluster: 'S1-3-MSW', July: 35.10, August: 37.10, September: 34.90 },
];

// FIX: Moving calculateClusterRetention to global scope
const calculateClusterRetention = (month) => {
    const clusterValues = {};
    const clusterCounts = {};
    storeRetentionData.forEach(item => {
        const cluster = item.cluster;
        const value = item[month];
        if (!clusterValues[cluster]) {
            clusterValues[cluster] = 0;
            clusterCounts[cluster] = 0;
        }
        clusterValues[cluster] += value;
        clusterCounts[cluster] += 1;
    });

    const clusterAverages = {};
    for (const cluster in clusterValues) {
        clusterAverages[cluster] = clusterValues[cluster] / clusterCounts[cluster];
    }
    return clusterAverages;
};

const q2RetentionData = clusterKpiMetrics.map(item => ({
    cluster: item.cluster,
    julyRetention: calculateClusterRetention('July')[item.cluster] || 0,
    augustRetention: calculateClusterRetention('August')[item.cluster] || 0,
    septemberRetention: calculateClusterRetention('September')[item.cluster] || 0,
}));


// Q2 Monthly ACB Data (July, Aug, Sep)
const storeAcbData = [
    { store: 'Bristol', cluster: 'S1-1-B', July: 944, August: 894, September: 963 },
    { store: 'Gloucester', cluster: 'S1-1-G', July: 388, August: 375, September: 367 },
    { store: 'Nottingham', cluster: 'S1-1-N', July: 403, August: 433, September: 407 },
    { store: 'Rugby', cluster: 'S1-1-R', July: 280, August: 285, September: 284 },
    { store: 'Barnstaple', cluster: 'S1-2-BE', July: 450, August: 430, September: 438 },
    { store: 'Exeter', cluster: 'S1-2-BE', July: 847, August: 872, September: 951 },
    { store: 'Birmingham', cluster: 'S1-2-BT', July: 321, August: 313, September: 332 },
    { store: 'Tyburn', cluster: 'S1-2-BT', July: 240, August: 221, September: 235 },
    { store: 'Wolves Chapel Ash', cluster: 'S1-2-CP', July: 286, August: 295, September: 273 },
    { store: 'Wolves Penn Road', cluster: 'S1-2-CP', July: 251, August: 241, September: 232 },
    { store: 'Bridgend', cluster: 'S1-3-BMR', July: 409, August: 422, September: 448 },
    { store: 'Merthyr', cluster: 'S1-3-BMR', July: 451, August: 445, September: 433 },
    { store: 'Rumney', cluster: 'S1-3-BMR', July: 609, August: 584, September: 569 },
    { store: 'Madeley', cluster: 'S1-3-MSW', July: 723, August: 690, September: 680 },
    { store: 'Shrewsbury', cluster: 'S1-3-MSW', July: 492, August: 552, September: 496 },
    { store: 'Wellington', cluster: 'S1-3-MSW', July: 393, August: 411, September: 388 },
];

const calculateClusterAcb = (month) => {
    const clusterTotals = {};
    storeAcbData.forEach(item => {
        const cluster = item.cluster;
        const value = item[month];
        if (!clusterTotals[cluster]) {
            clusterTotals[cluster] = 0;
        }
        clusterTotals[cluster] += value;
    });
    return clusterTotals;
};

const julyAcbTotals = calculateClusterAcb('July');
const augustAcbTotals = calculateClusterAcb('August');
const septemberAcbTotals = calculateClusterAcb('September');

const q2AcbData = q3SalesNcData.map(item => ({
    cluster: item.cluster,
    julyACB: julyAcbTotals[item.cluster] || 0,
    augustACB: augustAcbTotals[item.cluster] || 0,
    septemberACB: septemberAcbTotals[item.cluster] || 0,
}));

// NEW DATA: H1 Audit Results (MWW and Compliance)
const storeAuditData = [
    { store: 'Bristol', cluster: 'S1-1-B', MWW: 98.00, Compliance: 93.72 },
    { store: 'Gloucester', cluster: 'S1-1-G', MWW: 88.00, Compliance: 95.71 },
    { store: 'Nottingham', cluster: 'S1-1-N', MWW: 90.00, Compliance: 94.95 },
    { store: 'Rugby', cluster: 'S1-1-R', MWW: 100.00, Compliance: 98.99 },
    { store: 'Barnstaple', cluster: 'S1-2-BE', MWW: 96.00, Compliance: 96.44 },
    { store: 'Exeter', cluster: 'S1-2-BE', MWW: 99.00, Compliance: 93.04 },
    { store: 'Birmingham', cluster: 'S1-2-BT', MWW: 84.00, Compliance: 96.63 },
    { store: 'Tyburn', cluster: 'S1-2-BT', MWW: 90.00, Compliance: 99.50 },
    { store: 'Wolves Chapel Ash', cluster: 'S1-2-CP', MWW: 97.00, Compliance: 97.96 },
    { store: 'Wolves Penn Road', cluster: 'S1-2-CP', MWW: 100.00, Compliance: 97.96 },
    { store: 'Bridgend', cluster: 'S1-3-BMR', MWW: 83.00, Compliance: 94.28 },
    { store: 'Merthyr', cluster: 'S1-3-BMR', MWW: 98.00, Compliance: 97.14 },
    { store: 'Rumney', cluster: 'S1-3-BMR', MWW: 97.00, Compliance: 90.15 },
    { store: 'Madeley', cluster: 'S1-3-MSW', MWW: 98.00, Compliance: 94.57 },
    { store: 'Shrewsbury', cluster: 'S1-3-MSW', MWW: 79.00, Compliance: 96.94 },
    { store: 'Wellington', cluster: 'S1-3-MSW', MWW: 100.00, Compliance: 99.15 },
];

function aggregateAuditData(data) {
    const aggregated = {};

    data.forEach(store => {
        const cluster = store.cluster;
        if (!aggregated[cluster]) {
            aggregated[cluster] = {
                count: 0,
                MWWSum: 0,
                ComplianceSum: 0,
            };
        }
        aggregated[cluster].count++;
        aggregated[cluster].MWWSum += store.MWW;
        aggregated[cluster].ComplianceSum += store.Compliance;
    });

    const mwwResults = [];
    const complianceResults = [];

    for (const cluster in aggregated) {
        mwwResults.push({
            cluster,
            result: aggregated[cluster].MWWSum / aggregated[cluster].count,
        });
        complianceResults.push({
            cluster,
            result: aggregated[cluster].ComplianceSum / aggregated[cluster].count,
        });
    }

    return { mwwResults, complianceResults };
}

const { mwwResults: q3MwwAuditData, complianceResults: q3ComplianceAuditData } = aggregateAuditData(storeAuditData);

// Updated Data: Google Reviews (September)
const q3GoogleReviewsData = [
    { store: 'Barnstaple', reviews: 0, lastRank: 2, currentRank: 2, change: 0 },
    { store: 'Birmingham', reviews: 3, lastRank: 3, currentRank: 4, change: -1 },
    { store: 'Bridgend', reviews: 0, lastRank: 5, currentRank: 6, change: -1 },
    { store: 'Bristol', reviews: 24, lastRank: 5, currentRank: 5, change: 0 },
    { store: 'Exeter', reviews: 3, lastRank: 2, currentRank: 3, change: -1 },
    { store: 'Gloucester', reviews: 0, lastRank: 3, currentRank: 6, change: -3 },
    { store: 'Madeley', reviews: 41, lastRank: 1, currentRank: 1, change: 0 },
    { store: 'Merthyr Tydfil', reviews: 0, lastRank: 2, currentRank: 3, change: -1 },
    { store: 'Nottingham', reviews: 3, lastRank: 6, currentRank: 4, change: 2 },
    { store: 'Rugby', reviews: 2, lastRank: 2, currentRank: 6, change: -4 },
    { store: 'Rumney', reviews: 0, lastRank: 2, currentRank: 1, change: 1 },
    { store: 'Shrewsbury', reviews: 4, lastRank: 1, currentRank: 2, change: -1 },
    { store: 'Tyburn', reviews: 0, lastRank: 2, currentRank: 2, change: 0 },
    { store: 'Wellington', reviews: 17, lastRank: 3, currentRank: 2, change: 1 },
    { store: 'Wolves Chapel Ash', reviews: 4, lastRank: 1, currentRank: 6, change: -5 },
    { store: 'Wolves Penn Road', reviews: 8, lastRank: 1, currentRank: 1, change: 0 },
];

// TW App Signups - Restructured for monthly progress visualisation
const appAdoptionProgressData = [
    { store: 'Bristol', cluster: 'S1-1-B', July: 36.70, August: 50.60, September: 53.40 },
    { store: 'Gloucester', cluster: 'S1-1-G', July: 22.00, August: 29.90, September: 40.20 },
    { store: 'Nottingham', cluster: 'S1-1-N', July: 16.90, August: 19.50, September: 19.20 },
    { store: 'Rugby', cluster: 'S1-1-R', July: 22.70, August: 33.20, September: 36.50 },
    { store: 'Barnstaple', cluster: 'S1-2-BE', July: 11.10, August: 17.10, September: 27.50 },
    { store: 'Exeter', cluster: 'S1-2-BE', July: 11.20, August: 17.60, September: 27.70 },
    { store: 'Birmingham', cluster: 'S1-2-BT', July: 17.50, August: 19.30, September: 23.50 },
    { store: 'Tyburn', cluster: 'S1-2-BT', July: 19.20, August: 21.90, September: 23.70 },
    { store: 'Wolves Chapel Ash', cluster: 'S1-2-CP', July: 18.10, August: 29.90, September: 41.50 },
    { store: 'Wolves Penn Road', cluster: 'S1-2-CP', July: 21.30, August: 32.00, September: 38.20 },
    { store: 'Bridgend', cluster: 'S1-3-BMR', July: 17.50, August: 28.70, September: 33.90 },
    // Merthyr is used here
    { store: 'Merthyr', cluster: 'S1-3-BMR', July: 16.80, August: 33.00, September: 47.60 }, 
    { store: 'Rumney', cluster: 'S1-3-BMR', July: 9.60, August: 22.80, September: 29.20 },
    { store: 'Madeley', cluster: 'S1-3-MSW', July: 20.80, August: 45.60, September: 58.10 },
    { store: 'Shrewsbury', cluster: 'S1-3-MSW', July: 13.30, August: 32.10, September: 30.50 },
    { store: 'Wellington', cluster: 'S1-3-MSW', July: 20.20, August: 33.50, September: 46.00 },
];

// Data for September App Adoption Snapshot (derived from monthly data)
const twAppSignupSeptData = appAdoptionProgressData.map(d => ({
    store: d.store,
    cluster: d.cluster,
    percentHaveApp: d.September,
}));

// Area Average for September
const septemberAreaAverage = 37.9;

// NEW DATA: October Targets
const octoberTargetsData = [
    { store: 'Bristol', cluster: 'S1-1-B', monthTarget: '£11,100.00', clusterSalesTarget: '£11,100.00', ncTarget: 71, clusterNCTarget: 71 },
    { store: 'Gloucester', cluster: 'S1-1-G', monthTarget: '£23,600.00', clusterSalesTarget: '£23,600.00', ncTarget: 367, clusterNCTarget: 367 },
    { store: 'Nottingham', cluster: 'S1-1-N', monthTarget: '£15,500.00', clusterSalesTarget: '£15,500.00', ncTarget: 63, clusterNCTarget: 63 },
    { store: 'Rugby', cluster: 'S1-1-R', monthTarget: '£15,100.00', clusterSalesTarget: '£15,100.00', ncTarget: 134, clusterNCTarget: 134 },
    { store: 'Barnstaple', cluster: 'S1-2-BE', monthTarget: '£10,400.00', clusterSalesTarget: '£21,300.00', ncTarget: 69, clusterNCTarget: 100 },
    { store: 'Exeter', cluster: 'S1-2-BE', monthTarget: '£10,900.00', clusterSalesTarget: '£21,300.00', ncTarget: 31, clusterNCTarget: 100 },
    { store: 'Birmingham', cluster: 'S1-2-BT', monthTarget: '£10,700.00', clusterSalesTarget: '£19,200.00', ncTarget: 34, clusterNCTarget: 87 },
    { store: 'Tyburn', cluster: 'S1-2-BT', monthTarget: '£8,500.00', clusterSalesTarget: '£19,200.00', ncTarget: 53, clusterNCTarget: 87 },
    { store: 'Wolves Chapel Ash', cluster: 'S1-2-CP', monthTarget: '£24,800.00', clusterSalesTarget: '£39,900.00', ncTarget: 78, clusterNCTarget: 176 },
    { store: 'Wolves Penn Road', cluster: 'S1-2-CP', monthTarget: '£15,100.00', clusterSalesTarget: '£39,900.00', ncTarget: 98, clusterNCTarget: 176 },
    { store: 'Bridgend', cluster: 'S1-3-BMR', monthTarget: '£16,600.00', clusterSalesTarget: '£60,600.00', ncTarget: 111, clusterNCTarget: 390 },
    { store: 'Merthyr', cluster: 'S1-3-BMR', monthTarget: '£16,200.00', clusterSalesTarget: '£60,600.00', ncTarget: 51, clusterNCTarget: 390 }, // Merthyr (App data/Targets)
    { store: 'Rumney', cluster: 'S1-3-BMR', monthTarget: '£27,800.00', clusterSalesTarget: '£60,600.00', ncTarget: 228, clusterNCTarget: 390 },
    { store: 'Madeley', cluster: 'S1-3-MSW', monthTarget: '£22,600.00', clusterSalesTarget: '£48,500.00', ncTarget: 166, clusterNCTarget: 383 },
    { store: 'Shrewsbury', cluster: 'S1-3-MSW', monthTarget: '£15,400.00', clusterSalesTarget: '£48,500.00', ncTarget: 125, clusterNCTarget: 383 },
    { store: 'Wellington', cluster: 'S1-3-MSW', monthTarget: '£10,500.00', clusterSalesTarget: '£48,500.00', ncTarget: 92, clusterNCTarget: 383 },
];

// QUIZ DATA based on the generated report content
const QUIZ_DATA = [
    {
        question: "Based on the Battle of the Areas (Southern Region) table, which region is currently leading in the key sustainable growth metric of RET % (Retention)?",
        options: ["South 1", "South 2", "South 3"],
        correctAnswer: "South 2",
    },
    {
        question: "According to the App Adoption Snapshot chart, which store recorded the highest App Adoption Rate in September?",
        options: ["Bristol", "Madeley", "Wolves Chapel Ash"],
        correctAnswer: "Madeley",
    },
    {
        question: "The narrative on the Retention Strategy suggests that the primary focus to improve retention should be:",
        options: [
            "Stopping the conversation once a customer accepts a single incentive.",
            "Providing layered, comprehensive value through multiple relevant incentives.",
            "Increasing product discounts across all transactions.",
        ],
        correctAnswer: "Providing layered, comprehensive value through multiple relevant incentives.",
    },
    {
        question: "The overall Area Average for App Adoption in September was closest to which figure?",
        options: ["25.5%", "37.9%", "50.0%"],
        correctAnswer: "37.9%",
    },
    {
        question: "According to the ACB Trends chart, which cluster maintained the highest total Active Customer Base (ACB) in September?",
        options: ["S1-1-B", "S1-2-BE", "S1-3-MSW"],
        correctAnswer: "S1-3-MSW",
    },
];


// ====================================================================
// MAIN APP COMPONENT
// ====================================================================

const App = () => {
    // State for interactive cluster selection
    const allClusters = [...new Set(q3SalesNcData.map(d => d.cluster))];
    const [selectedCluster, setSelectedCluster] = useState('All'); // Default to 'All'
    
    // State for the Quiz
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState(Array(QUIZ_DATA.length).fill(null));
    const [quizPassed, setQuizPassed] = useState(false);
    const [message, setMessage] = useState('');
    
    // State for KPI Detail Table Hovering
    const [hoveredStore, setHoveredStore] = useState(null); 

    // Colours and constants (UK spelling for consistency)
    const barColors = ['#4A90E2', '#8BC34A', '#FFC107', '#E91E63', '#9C27B0', '#00BCD4', '#FF9800', '#795548', '#607D8B'];
    const lineColors = ['#0077B6', '#FCA311', '#5B5F97']; // Dark Blue, Orange, Muted Purple
    const appBarColor = '#8BC34A'; // Green for "App Adoption" bars
    const averageLineColor = '#E91E63'; // Pink/Red for Average Reference Line


    // --- QUIZ LOGIC FUNCTIONS ---
    
    const handleAnswerSelect = (answer) => {
        const newAnswers = [...userAnswers];
        newAnswers[currentQuestionIndex] = answer;
        setUserAnswers(newAnswers);
    };

    const handleNextQuestion = () => {
        const currentQuestion = QUIZ_DATA[currentQuestionIndex];
        const selectedAnswer = userAnswers[currentQuestionIndex];

        if (selectedAnswer === null) {
            setMessage('Please select an answer before moving on.');
            return;
        }

        if (selectedAnswer !== currentQuestion.correctAnswer) {
            setMessage('Incorrect answer. Please review the report before trying again.');
            // Reset quiz on incorrect answer
            setTimeout(() => {
                setCurrentQuestionIndex(0);
                setUserAnswers(Array(QUIZ_DATA.length).fill(null));
                setMessage('Quiz reset. Start from the beginning!');
            }, 1500);
            return;
        }

        setMessage('Correct! Moving to the next question...');
        
        const nextIndex = currentQuestionIndex + 1;
        if (nextIndex < QUIZ_DATA.length) {
            setCurrentQuestionIndex(nextIndex);
        } else {
            // Quiz complete - Check if all answers were correct (already checked sequentially)
            setQuizPassed(true);
            setMessage('Congratulations! You have successfully completed the Knowledge Check.');
        }
        
        // Clear message after a short delay for feedback
        setTimeout(() => setMessage(''), 1000);
    };

    // --- Data Mapping & Preparation (Placed inside App component for functional updates) ---

    // 1. Build a map for easy store-to-cluster lookup (handling naming discrepancies)
    const storeClusterMap = octoberTargetsData.reduce((acc, item) => {
        acc[item.store] = item.cluster;
        return acc;
    }, {});
    storeClusterMap['Merthyr Tydfil'] = 'S1-3-BMR'; // For Google Reviews data
    storeClusterMap['Merthyr'] = 'S1-3-BMR';

    // 2. Enrich Google Reviews data with the Cluster
    const q3GoogleReviewsDataEnriched = q3GoogleReviewsData.map(d => ({
        ...d,
        cluster: storeClusterMap[d.store] || 'Unknown',
    }));
    
    // 3. Filter Audit data for charts
    const filteredMwwAuditData = selectedCluster === 'All'
        ? q3MwwAuditData
        : q3MwwAuditData.filter(d => d.cluster === selectedCluster);

    const filteredComplianceAuditData = selectedCluster === 'All'
        ? q3ComplianceAuditData
        : q3ComplianceAuditData.filter(d => d.cluster === selectedCluster);


    // --- Data Filtering based on Selection ---
    
    // 1. Filter main cluster data for charts
    const filteredData = selectedCluster === 'All'
        ? q3SalesNcData
        : q3SalesNcData.filter(d => d.cluster === selectedCluster);

    const filteredRetentionData = selectedCluster === 'All'
        ? q2RetentionData
        : q2RetentionData.filter(d => d.cluster === selectedCluster);

    const filteredAcbData = selectedCluster === 'All'
        ? q2AcbData
        : q2AcbData.filter(d => d.cluster === selectedCluster);
    
    // 2. Filter Store-level data for charts/tables

    const filteredGoogleReviews = selectedCluster === 'All'
        ? q3GoogleReviewsDataEnriched
        : q3GoogleReviewsDataEnriched.filter(d => d.cluster === selectedCluster);

    const filteredTwAppSignupSeptData = selectedCluster === 'All'
        ? twAppSignupSeptData
        : twAppSignupSeptData.filter(d => d.cluster === selectedCluster);

    const filteredAppAdoptionProgressData = selectedCluster === 'All'
        ? appAdoptionProgressData
        : appAdoptionProgressData.filter(d => d.cluster === selectedCluster);

    // 3. Combine all relevant data for deeper analysis blocks (e.g. Trade-in Correlation)
    const combinedData = q3SalesNcData.map(q3 => {
        const retention = q2RetentionData.find(r => r.cluster === q3.cluster);
        const acb = q2AcbData.find(a => a.cluster === q3.cluster);
        const additional = newQ3KeyMetricsWithRetention.find(ad => ad.cluster === q3.cluster);
        return { ...q3, ...retention, ...acb, ...additional };
    });

    // Determine the focus data for the Trade-in box
    const tradeInFocusData = selectedCluster === 'All'
        ? combinedData.sort((a, b) => b.tradeInVsKitSales - a.tradeInVsKitSales).slice(0, 2)
        : combinedData.filter(d => d.cluster === selectedCluster); // Show only the selected cluster

  // Calculate September highlights with criteria and limit to 5
  const septemberHighlights = combinedData
    .filter(d =>
      d.salesVsTargetSep > 100 ||
      d.ncVsTargetSep > 100 ||
      d.septemberRetention > 40 ||
      d.vltz > 70 ||
      d.wrc > 70 ||
      d.unregisteredTransaction < 5
    )
    .sort((a, b) => {
      // Scoring logic for highlights (using September data)
      let aScore = 0;
      if (a.salesVsTargetSep > 100) aScore += (a.salesVsTargetSep - 100);
      if (a.ncVsTargetSep > 100) aScore += (a.ncVsTargetSep - 100);
      if (a.septemberRetention > 40) aScore += (a.septemberRetention - 40);
      if (a.vltz > 70) aScore += (a.vltz - 70);
      if (a.wrc > 70) aScore += (a.wrc - 70);
      if (a.unregisteredTransaction < 5) aScore += (5 - a.unregisteredTransaction) * 10;

      let bScore = 0;
      if (b.salesVsTargetSep > 100) bScore += (b.salesVsTargetSep - 100);
      if (b.ncVsTargetSep > 100) bScore += (b.ncVsTargetSep - 100);
      if (b.septemberRetention > 40) bScore += (b.septemberRetention - 40);
      if (b.vltz > 70) bScore += (b.vltz - 70);
      if (b.wrc > 70) bScore += (b.wrc - 70);
      if (b.unregisteredTransaction < 5) bScore += (5 - b.unregisteredTransaction) * 10;

      return bScore - aScore;
    })
    .slice(0, 5); // Limit to a maximum of 5 shout-outs


    // Sort Google Reviews by Current Rank (lowest is best)
    // NOTE: Sorting applied to the filtered data source
    const sortedGoogleReviews = filteredGoogleReviews.sort((a, b) => a.currentRank - b.currentRank);


    // --- HELPER COMPONENTS (Defined inside App component for state access) ---

    // Component for the Quiz Interface
    const QuizComponent = () => {
        if (quizPassed) {
            return (
                <div className="text-centre p-6 bg-green-100 rounded-xl shadow-lg border-2 border-green-500">
                    <h3 className="text-3xl font-extrabold text-green-700 mb-4">Knowledge Check Complete!</h3>
                    <p className="text-xl text-green-800">You've demonstrated a strong understanding of the Q2 performance review.</p>
                    <p className="text-xl mt-4 font-bold text-green-900">Your October Targets are now visible below!</p>
                </div>
            );
        }

        const questionData = QUIZ_DATA[currentQuestionIndex];
        const selectedAnswer = userAnswers[currentQuestionIndex];

        return (
            <div className="p-6 bg-white rounded-xl shadow-lg border-2 border-indigo-300">
                <h3 className="text-2xl font-bold text-indigo-700 mb-4">Question {currentQuestionIndex + 1} of {QUIZ_DATA.length}</h3>
                
                <p className="text-xl text-gray-800 mb-6 font-medium">{questionData.question}</p>
                
                <div className="space-y-3">
                    {questionData.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswerSelect(option)}
                            className={`w-full text-left p-3 rounded-lg border-2 transition duration-200 
                                ${selectedAnswer === option
                                    ? 'bg-indigo-500 text-white border-indigo-600 shadow-md'
                                    : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-indigo-100'
                                }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>

                <div className="mt-6 flex justify-between items-centre">
                    <button
                        onClick={handleNextQuestion}
                        className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition duration-200 disabled:opacity-50"
                        disabled={selectedAnswer === null}
                    >
                        {currentQuestionIndex < QUIZ_DATA.length - 1 ? 'Submit & Next Question' : 'Finish Quiz & Reveal Targets'}
                    </button>
                    {message && (
                        <p className={`text-sm font-semibold p-2 rounded ${message.includes('Correct') ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                            {message}
                        </p>
                    )}
                </div>
            </div>
        );
    };


    // Helper component for rank change display
    const RankChangeIcon = ({ change }) => {
        if (change > 0) return <span className="text-green-600 font-bold ml-1">▲ {change}</span>;
        if (change < 0) return <span className="text-red-600 font-bold ml-1">▼ {Math.abs(change)}</span>;
        return <span className="text-gray-500 ml-1">—</span>;
    };

    // Component for the Google Review Ranking Table
    const GoogleReviewTable = () => (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 shadow-md rounded-lg">
                <thead className="bg-teal-700 text-white">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider rounded-tl-lg">Store</th>
                        <th className="px-6 py-3 text-centre text-xs font-medium uppercase tracking-wider">Current Rank</th>
                        <th className="px-6 py-3 text-centre text-xs font-medium uppercase tracking-wider">Change (vs. Last Month)</th>
                        <th className="px-6 py-3 text-centre text-xs font-medium uppercase tracking-wider rounded-tr-lg">New Reviews (Sept)</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {sortedGoogleReviews.map((data, index) => (
                        <tr key={data.store} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{data.store}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-centre font-bold text-teal-800">{data.currentRank}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-centre">
                                <RankChangeIcon change={data.change} />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-centre text-indigo-600 font-semibold">{data.reviews}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    // Component for the Battle of the Areas Table
    const BattleOfTheAreasTable = () => {
        // New function to get the class for background fill (Green=1, Yellow=2, Red=3)
        const getRankColourClass = (rank) => {
            if (rank === 1) return 'bg-green-200'; // Light green for first place
            if (rank === 2) return 'bg-yellow-200'; // Light yellow for second place
            if (rank === 3) return 'bg-red-200'; // Light red for third place
            return 'bg-white'; // Default background for unranked (like 'South')
        };
        
        // Content is just the formatted value
        const getCellContent = (item, kpi) => {
            const value = item[kpi.key];
            return <span className="text-gray-900 font-semibold">{kpi.format(value)}</span>;
        };

        return (
            <section className="mb-12">
                <div className="p-6 bg-white rounded-xl shadow-xl overflow-x-auto border-4 border-indigo-200">
                    <h2 className="text-3xl font-bold text-indigo-800 mb-6 border-b-2 border-indigo-200 pb-2">Battle of the Areas (Southern Region)</h2>
                    
                    <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
                        <h4 className="text-xl font-semibold text-indigo-700 mb-2">Overview</h4>
                        <p className="text-lg text-gray-700 leading-relaxed">
                            Now the dust has firmly settled from the September Battle, South 1 walks out of the arena in a strong position, topping <span className="font-bold">five out of nine metrics</span> for the month. <span className="font-bold">ATV</span> and <span className="font-bold">Retention</span> continue to be the weaker points for the area, and with many of the other KPIs having a photo finish last month, there is no space to rest on their laurels. South 2 is putting up a tremendous defensive effort, leading the way with ATV, Retention, and <span className="font-bold">RAF</span>. Meanwhile, South 3 is running an aggressive digital game, leading in <span className="font-bold">App Adoption</span> rates. With plenty to learn from their comrades & competitors, what can be implemented to pull away from the tie breakers and bolster the weaknesses?
                        </p>
                        <p className="text-lg text-gray-700 font-bold mt-4">
                            The detail below will assist you in unlocking this opportunity.
                        </p>
                    </div>

                    {/* NEW KEY: Colour Key explanation */}
                    <div className="text-centre text-sm font-semibold mb-4 flex justify-centre space-x-4">
                        <div className="flex items-centre">
                            <span className="w-4 h-4 bg-green-200 border border-green-500 mr-2 rounded"></span>
                            <span>1st Place</span>
                        </div>
                        <div className="flex items-centre">
                            <span className="w-4 h-4 bg-yellow-200 border border-yellow-500 mr-2 rounded"></span>
                            <span>2nd Place</span>
                        </div>
                        <div className="flex items-centre">
                            <span className="w-4 h-4 bg-red-200 border border-red-500 mr-2 rounded"></span>
                            <span>3rd Place</span>
                        </div>
                        <div className="flex items-centre">
                            <span className="w-4 h-4 bg-indigo-100 border border-gray-500 mr-2 rounded"></span>
                            <span>Regional Total (South)</span>
                        </div>
                    </div>
                    
                    {/* FIX: Apply explicit sizing to table columns to remove the gap */}
                    <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-lg table-fixed">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                                <th className="w-1/12 px-2 py-3 text-left text-xs font-medium uppercase tracking-wider sticky left-0 z-10 bg-gray-800 min-w-[100px] rounded-tl-lg">Region</th>
                                {Kpis.map(kpi => (
                                    <th key={kpi.key} className="w-1/12 px-2 py-3 text-centre text-xs font-medium uppercase tracking-wider">
                                        {kpi.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {battleOfTheAreasData.map((item, index) => (
                                <tr key={item.region} className={item.region === 'South' ? 'bg-indigo-100 font-bold' : (index % 2 === 0 ? 'bg-white' : 'bg-gray-50')}>
                                    <td className={`w-1/12 px-2 py-3 whitespace-nowrap text-sm font-medium sticky left-0 z-10 ${item.region === 'South' ? 'bg-indigo-100 text-indigo-900' : 'bg-inherit text-gray-900'}`}>{item.region}</td>
                                    {Kpis.map(kpi => {
                                        const rank = item[`${kpi.key}Rank`];
                                        const rankClass = getRankColourClass(rank);
                                        const isRegionalTotal = item.region === 'South';

                                        return (
                                            <td key={kpi.key} className={`w-1/12 px-2 py-3 whitespace-nowrap text-sm text-centre ${isRegionalTotal ? 'bg-indigo-100' : rankClass}`}>
                                                {getCellContent(item, kpi)}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        );
    };

    // Component for the new September Raw KPI Data Table
    const SeptemberKpiDetailTable = () => {
        
        // Filter raw data by cluster
        const filteredRawData = selectedCluster === 'All'
            ? rawSeptemberKpiData
            : rawSeptemberKpiData.filter(d => d.cluster === selectedCluster);

        // Helper function to determine cell background colour
        const getKpiCellClass = (kpi, value, store) => {
            if (store !== hoveredStore) return ''; // Only highlight on hover

            // We only apply colour formatting to the numerical KPI columns, not 'store' or 'cluster'
            if (kpi.key === 'store' || kpi.key === 'cluster') return ''; 

            const average = southAreaAverages[kpi.key];
            if (average === undefined) return '';

            let isBetter;
            if (kpi.higherIsBetter) {
                isBetter = value >= average;
            } else {
                isBetter = value <= average; // Lower is better
            }

            return isBetter ? 'bg-green-200/70' : 'bg-red-200/70';
        };

        return (
            <>
                <div className="mb-4 p-3 bg-indigo-100 rounded-lg shadow-inner">
                    <h4 className="text-xl font-semibold text-indigo-700 mb-1">Interactive Diagnostic Tool:</h4>
                    <p className="text-lg text-gray-700">
                        Hover over any store row to instantly highlight performance against the South Area Average: 
                        <span className="font-bold text-green-700 ml-2">Green = Above Average</span> and 
                        <span className="font-bold text-red-700 ml-2">Red = Below Average</span>.
                    </p>
                </div>
                <div className="overflow-x-auto border border-gray-300 rounded-xl shadow-inner bg-white">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100 sticky top-0 z-20">
                            <tr>
                                {detailedKpiDefinitions.map(col => (
                                    <th 
                                        key={col.key} 
                                        className={`px-3 py-3 text-xs font-bold uppercase tracking-wider text-gray-700 text-centre 
                                            ${col.key === 'store' ? 'sticky left-0 bg-gray-100 z-10 text-left' : ''}
                                            ${col.key === 'cluster' ? 'sticky left-0 bg-gray-100 z-10 text-centre' : ''}`}
                                    >
                                        {col.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredRawData.map((data, index) => (
                                <tr 
                                    key={data.store} 
                                    className={`transition duration-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                    onMouseEnter={() => setHoveredStore(data.store)}
                                    onMouseLeave={() => setHoveredStore(null)}
                                >
                                    {detailedKpiDefinitions.map(col => {
                                        const value = data[col.key];
                                        const cellClass = getKpiCellClass(col, value, data.store);

                                        return (
                                            <td 
                                                key={col.key} 
                                                className={`px-3 py-3 whitespace-nowrap text-sm text-centre ${cellClass}
                                                    ${col.key === 'store' ? 'font-semibold sticky left-0 z-10 text-left' : (col.key === 'cluster' ? 'sticky left-0 z-10 text-centre' : '')}
                                                    ${index % 2 === 0 && col.key === 'store' ? 'bg-white' : (index % 2 !== 0 && col.key === 'store' ? 'bg-gray-50' : '')}
                                                    ${index % 2 === 0 && col.key === 'cluster' ? 'bg-white' : (index % 2 !== 0 && col.key === 'cluster' ? 'bg-gray-50' : '')}
                                                    `}
                                            >
                                                {col.format(value)}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>
        );
    };


    // Component for October Targets Table (Conditionally Rendered)
    const OctoberTargetsTable = () => (
        <div className="overflow-x-auto mt-12 p-6 bg-green-50 rounded-xl shadow-lg border-t-4 border-green-600">
            <h2 className="text-3xl font-bold text-green-700 mb-6 border-b-2 border-green-200 pb-2 text-centre">Your OCTOBER Targets: Driving Q4 Success</h2>
            <table className="min-w-full divide-y divide-gray-200 shadow-md rounded-lg">
                <thead className="bg-green-600 text-white">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider rounded-tl-lg">Store</th>
                        <th className="px-4 py-3 text-centre text-xs font-medium uppercase tracking-wider">Cluster</th>
                        <th className="px-4 py-3 text-centre text-xs font-medium uppercase tracking-wider">Sales Target (Store)</th>
                        <th className="px-4 py-3 text-centre text-xs font-medium uppercase tracking-wider">Sales Target (Cluster)</th>
                        <th className="px-4 py-3 text-centre text-xs font-medium uppercase tracking-wider">NC Target (Store)</th>
                        <th className="px-4 py-3 text-centre text-xs font-medium uppercase tracking-wider rounded-tr-lg">NC Target (Cluster)</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {octoberTargetsData.map((data, index) => (
                        <tr key={data.store} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{data.store}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-centre text-gray-600">{data.cluster}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-centre font-bold text-indigo-700">{data.monthTarget}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-centre">{data.clusterSalesTarget}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-centre font-bold text-indigo-700">{data.ncTarget}</td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-centre">{data.clusterNCTarget}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <p className="text-sm text-gray-700 mt-6 text-centre">
                These targets set the foundation for a successful start to Q4. Focus on collaboration within your clusters to hit both individual and shared goals!
            </p>
        </div>
    );
    
    // Custom Tooltip component for the Scatter Chart
    const CustomScatterTooltip = ({ active, payload }) => {
      if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
          <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-300 text-sm font-medium">
            <p className="text-indigo-700 font-bold mb-1">{data.store}</p>
            <p className="text-gray-600">NC vs TGT: <span className="font-semibold text-pink-600">{data.ncVsTGT.toFixed(1)}%</span></p>
            <p className="text-gray-600">Retention: <span className="font-semibold text-pink-600">{data.retention.toFixed(1)}%</span></p>
            <p className="text-gray-600">Raw NC Count: <span className="font-semibold text-pink-600">{data.size}</span></p>
          </div>
        );
      }
      return null;
    };


    // Data for Scatter Plot (NC vs Retention)
    // NOTE: This data pulls from the raw store level KPI data for NC and Retention
    const storeKpiDataForScatter = rawSeptemberKpiData.map(d => ({
        store: d.store,
        cluster: d.cluster,
        // New Y-Axis: Retention %
        retention: d.Retention, 
        // New X-Axis: NC vs TGT %
        ncVsTGT: d.NCVsTGT,
        // Size of the dot based on raw NC count
        size: d.NC, 
    }));
    
    // Filter scatter data
    const filteredScatterData = selectedCluster === 'All'
        ? storeKpiDataForScatter
        : storeKpiDataForScatter.filter(d => d.cluster === selectedCluster);


    // --- Custom Highlights Data Structure (based on image design) ---
    // NOTE: Reworking this structure to fit the new card design exactly.
    const HighlightCard = ({ title, content, isAchievement }) => (
        <div className={`p-4 rounded-lg shadow-md mb-3 ${isAchievement ? 'bg-yellow-100 border border-yellow-300' : 'bg-green-50 border border-green-200'}`}>
            <h4 className={`text-lg font-bold mb-2 ${isAchievement ? 'text-yellow-700' : 'text-green-700'}`}>
                {isAchievement ? (
                    <span className="text-yellow-600 font-semibold mr-2">&#9733;</span>
                ) : (
                    <span className="text-green-600 font-semibold mr-2">✓</span>
                )}
                {title}
            </h4>
            <p className="text-base text-gray-700 leading-relaxed pl-6">{content}</p>
        </div>
    );

    // Consolidated Highlight Data for easier rendering
    const highlightsData = [
        // --- Q2 Achievements (IsAchievement = true) ---
        { 
            title: "H1 MWW Audit Excellence", 
            content: "Huge credit to Rugby, Wolves Penn Road, and Wellington for achieving a perfect 100% score in their Mr Wicked Way (MWW) Audits.", 
            isAchievement: true 
        },
        { 
            title: "H1 Compliance Leader", 
            content: "Shout-out to Tyburn for delivering the highest Compliance Audit score in the area (99.50%).", 
            isAchievement: true 
        },
        { 
            title: "Sustainable LFL Growth", 
            content: "The Telford cluster (S1-3-MSW: Madeley, Shrewsbury, Wellington) leads the area in Like-for-Like (LFL) growth, with all stores in the cluster seeing positive growth in September.", 
            isAchievement: true 
        },
        
        // --- September Performance Highlights (IsAchievement = false / Default) ---
        { 
            title: "S1-3-MSW Cluster Dominance", 
            content: `Exceeded Sales Target (${clusterKpiMetrics.find(c => c.cluster === 'S1-3-MSW').salesVsTargetSep.toFixed(2)}%), Exceeded NC Target (${clusterKpiMetrics.find(c => c.cluster === 'S1-3-MSW').ncVsTargetSep.toFixed(2)}%), Achieved High VLTZ (${clusterKpiMetrics.find(c => c.cluster === 'S1-3-MSW').vltz.toFixed(2)}%), and maintained the Lowest Unregistered Transactions (${clusterKpiMetrics.find(c => c.cluster === 'S1-3-MSW').unregisteredTransaction.toFixed(2)}%).`,
            isAchievement: false
        },
        { 
            title: "S1-2-CP Sales & Trade-in Strength", 
            content: `Wolves Chapel Ash Exceeded Sales Target (101.90%). The cluster achieved the Highest Trade-in % (${clusterKpiMetrics.find(c => c.cluster === 'S1-2-CP').tradeInVsKitSales.toFixed(2)}%) and strong NC Email Capture (Wolves Chapel Ash: 100.00%).`,
            isAchievement: false
        },
        {
            title: "S1-2-BE High Retention & NC Volume",
            content: `Barnstaple Exceeded Sales Target (100.60%) and achieved the Highest Area Retention (48.80%). Exeter drove High NC volume (162 NCs).`,
            isAchievement: false
        },
        {
            title: "S1-1-B Acquisition & WRC Leader",
            content: `Bristol drove the Highest Area NC Acquisition (276 NCs) and achieved the Highest WRC % (71.00%).`,
            isAchievement: false
        }
    ];

    
  return (
    <div className="min-h-screen bg-gray-100 p-6 font-inter text-gray-800">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-8">
        
        {/* Main Title updated for Q2 Review and Sept Month End */}
        <h1 className="text-4xl font-extrabold text-centre text-indigo-800 mb-6">Performance Review: Q2 Review & September Month-End Highlights</h1>
        
        {/* INTERACTIVE CLUSTER FILTER */}
        <div className="flex justify-centre items-centre mb-10 p-4 bg-indigo-100 rounded-lg shadow-inner">
            <label htmlFor="cluster-filter" className="text-lg font-semibold text-indigo-800 mr-4">
                View Performance For:
            </label>
            <select
                id="cluster-filter"
                value={selectedCluster}
                onChange={(e) => setSelectedCluster(e.target.value)}
                className="p-2 border border-indigo-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white transition duration-150 ease-in-out font-bold text-indigo-700"
            >
                <option value="All">All Clusters (Overview)</option>
                {allClusters.map(cluster => (
                    <option key={cluster} value={cluster}>{cluster}</option>
                ))}
            </select>
        </div>

        {/* ========================================================= */}
        {/* 1. NARRATIVE FLOW START */}
        {/* ========================================================= */}
        
        {/* NEW INTRODUCTORY SECTION - COMBINED CONTEXT & CALL TO ACTION */}
        <section className="mb-12 p-8 bg-gray-100 rounded-xl shadow-inner border-l-4 border-indigo-500">
            <h2 className="text-3xl font-bold text-indigo-700 mb-4">Welcome to Your Performance Dashboard</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
                This report provides a complete, interactive breakdown of our <strong>Q2 performance, culminating in the critical September Month-End figures</strong>. Whether you are a long-standing manager or new to the team, this dashboard is designed to be your primary coaching and planning tool. Use the filters, tables, and infographics to quickly identify <strong>Areas of Excellence</strong> to celebrate and <strong>Areas for Focus</strong> where a strategic change in approach is needed. The goal is clear: understand our data, apply the insights, and hit the ground running for Q3.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mt-4 font-bold">
                Reviewing the final results for September is a key initial step in gaining an understanding of where your approach may need to differ or be maintained based on the results.
            </p>
        </section>


        {/* NEW SECTION: Battle of the Areas */}
        {selectedCluster === 'All' && <BattleOfTheAreasTable />}


        {/* Section 1: September Cluster Performance - Renamed from Q2 */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-indigo-700 mb-6 border-b-2 border-indigo-200 pb-2">September Cluster Performance Trends</h2>
          
          {/* Sales vs Target - NOW LABELLED CORRECTLY */}
          <div className="mb-8 p-6 bg-blue-50 rounded-lg shadow-sm">
            <h3 className="text-2xl font-semibold text-blue-800 mb-4">Sales vs Target (September Total) {selectedCluster !== 'All' ? `— ${selectedCluster}` : ''}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="cluster" tick={{ fill: '#4a5568' }} />
                <YAxis
                  tickFormatter={(value) => `${value}%`}
                  tick={{ fill: '#4a5568' }}
                  ticks={[0, 25, 50, 75, 100, 125, 150]}
                />
                {/* TARGET LINE ADDED */}
                <ReferenceLine y={100} stroke="#E91E63" strokeDasharray="3 3" label={{ value: 'Target', position: 'top', fill: '#E91E63' }} />
                <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                <Legend />
                <Bar dataKey="salesVsTarget" name="Sales vs Target %" fill={barColors[0]} radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-600 mt-4">This chart displays the percentage of sales achieved against the target for each cluster in September. The red line at 100% represents the target achievement line.</p>
          </div>

          {/* NC vs Target - NOW LABELLED CORRECTLY */}
          <div className="mb-8 p-6 bg-green-50 rounded-lg shadow-sm">
            <h3 className="text-2xl font-semibold text-green-800 mb-4">New Customers (NC) vs Target (September Total) {selectedCluster !== 'All' ? `— ${selectedCluster}` : ''}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="cluster" tick={{ fill: '#4a5568' }} />
                <YAxis
                  tickFormatter={(value) => `${value}%`}
                  tick={{ fill: '#4a5568' }}
                  ticks={[0, 25, 50, 75, 100, 125, 150]}
                />
                {/* TARGET LINE ADDED */}
                <ReferenceLine y={100} stroke="#E91E63" strokeDasharray="3 3" label={{ value: 'Target', position: 'top', fill: '#E91E63' }} />
                <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                <Legend />
                <Bar dataKey="ncVsTarget" name="NC vs Target %" fill={barColors[1]} radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-600 mt-4">This chart illustrates the percentage of New Customer (NC) acquisition achieved against target for each cluster in September. The target line is set at 100%.</p>
          </div>
            
            {/* ACB Trends (Q2) */}
          <div className="mb-8 p-6 bg-purple-50 rounded-lg shadow-sm">
            <h3 className="text-2xl font-semibold text-purple-800 mb-4">Active Customer Base (ACB) Trends (July - September) {selectedCluster !== 'All' ? `— ${selectedCluster}` : ''}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredAcbData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="cluster" tick={{ fill: '#4a5568' }} />
                <YAxis tick={{ fill: '#4a5568' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="julyACB" stroke="#dc3545" name="July ACB" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="augustACB" stroke="#ffc107" name="August ACB" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="septemberACB" stroke="#6f42c1" name="September ACB" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-600 mt-4">This line chart tracks the combined total number of Active Customer Base (ACB) for each cluster across the full Q2 period (July to September).</p>
          </div>

          {/* Retention Trends (Q2) */}
          <div className="mb-8 p-6 bg-red-50 rounded-lg shadow-sm">
            <h3 className="text-2xl font-semibold text-red-800 mb-4">Retention Trends (July - September) {selectedCluster !== 'All' ? `— ${selectedCluster}` : ''}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={filteredRetentionData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="cluster" tick={{ fill: '#4a5568' }} />
                <YAxis tickFormatter={(value) => `${value}%`} domain={[0, 60]} tick={{ fill: '#4a5568' }} />
                <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                <Legend />
                <Line type="monotone" dataKey="julyRetention" stroke="#dc3545" name="July Retention" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="augustRetention" stroke="#ffc107" name="August Retention" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="septemberRetention" stroke="#6f42c1" name="September Retention" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-sm text-gray-600 mt-4">This chart tracks the average customer retention percentage across clusters for each month of Q2.</p>
          </div>
        </section>


        {/* ========================================================= */}
        {/* 2. DEEP DIVE & RAW DETAIL (INCLUDING SCATTER CHART) */}
        {/* ========================================================= */}


        {/* Section 2: September Highlights - RENAMED AND CONTENT ADJUSTED */}
        <section className="mb-12 p-8 bg-yellow-50 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-yellow-800 mb-6 border-b-2 border-yellow-300 pb-2">Q2 Achievements and September Highlights</h2>
          {selectedCluster === 'All' ? (
                // All Clusters View
                <>
                    {/* 1. Q2 Achievements Header */}
                    <h4 className="text-xl font-bold text-yellow-700 mb-3 border-b border-yellow-200 pb-1">Q2 Audit & LFL Growth Achievements:</h4>
                    
                    {/* H1 MWW Audit Excellence */}
                    <HighlightCard 
                        title="H1 MWW Audit Excellence" 
                        content="Huge credit to Rugby, Wolves Penn Road, and Wellington for achieving a perfect 100% score in their Mr Wicked Way (MWW) Audits." 
                        isAchievement={true}
                    />
                    
                    {/* H1 Compliance Leader */}
                    <HighlightCard 
                        title="H1 Compliance Leader" 
                        content="Shout-out to Tyburn for delivering the highest Compliance Audit score in the area (99.50%)." 
                        isAchievement={true}
                    />
                    
                    {/* Sustainable LFL Growth */}
                    <HighlightCard 
                        title="Sustainable LFL Growth" 
                        content="The Telford cluster (S1-3-MSW: Madeley, Shrewsbury, Wellington) leads the area in Like-for-Like (LFL) growth, with all stores in the cluster seeing positive growth in September." 
                        isAchievement={true}
                    />

                    {/* 2. September Highlights Header */}
                    <h4 className="text-xl font-bold text-yellow-700 mt-6 mb-3 border-b border-yellow-200 pb-1">September Performance Highlights:</h4>

                    {/* S1-3-MSW Cluster Dominance */}
                    <HighlightCard
                        title="S1-3-MSW Cluster Dominance"
                        content={`Exceeded Sales Target (${clusterKpiMetrics.find(c => c.cluster === 'S1-3-MSW').salesVsTargetSep.toFixed(2)}%), Exceeded NC Target (${clusterKpiMetrics.find(c => c.cluster === 'S1-3-MSW').ncVsTargetSep.toFixed(2)}%), Achieved High VLTZ (${clusterKpiMetrics.find(c => c.cluster === 'S1-3-MSW').vltz.toFixed(2)}%), and maintained the Lowest Unregistered Transactions (${clusterKpiMetrics.find(c => c.cluster === 'S1-3-MSW').unregisteredTransaction.toFixed(2)}%).`}
                        isAchievement={false}
                    />
                    
                    {/* S1-2-CP Sales & Trade-in Strength */}
                    <HighlightCard
                        title="S1-2-CP Sales & Trade-in Strength"
                        content={`Wolves Chapel Ash Exceeded Sales Target (101.90%). The cluster achieved the Highest Trade-in % (${clusterKpiMetrics.find(c => c.cluster === 'S1-2-CP').tradeInVsKitSales.toFixed(2)}%) and strong NC Email Capture (Wolves Chapel Ash: 100.00%).`}
                        isAchievement={false}
                    />

                    {/* S1-2-BE High Retention & NC Volume */}
                    <HighlightCard
                        title="S1-2-BE High Retention & NC Volume"
                        content={`Barnstaple Exceeded Sales Target (100.60%) and achieved the Highest Area Retention (48.80%). Exeter drove High NC volume (162 NCs).`}
                        isAchievement={false}
                    />

                    {/* S1-1-B Acquisition & WRC Leader */}
                    <HighlightCard
                        title="S1-1-B Acquisition & WRC Leader"
                        content={`Bristol drove the Highest Area NC Acquisition (276 NCs) and achieved the Highest WRC % (71.00%).`}
                        isAchievement={false}
                    />

                    <p className="text-sm text-gray-600 mt-4">This list showcases the top cluster and store achievements across Q2 and September key metrics.</p>
                </>
            ) : (
                // FALSE BRANCH: Show "Select All" message
                <p className="text-lg text-gray-600">Select <strong>"All Clusters"</strong> in the filter above to view the Q2 Achievements and September Highlights.</p>
            )}
        </section>

        {/* Section 3: Reworked Retention Deep Dive & Incentives Strategy */}
        <section className="mb-12 p-8 bg-gray-50 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-gray-700 mb-6 border-b-2 border-gray-200 pb-2">Retention & ATV Strategy: The Power of Layered Value</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Our overall retention rate still indicates a gap compared to our southern counterparts. This is not a deficiency in effort; it is an opportunity to <strong>optimise</strong> our sales approach to <strong>maximise</strong> long-term customer value.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            We have consistently seen that customers who accept <strong>more than one relevant incentive</strong> during their onboarding process show significantly higher retention rates. This is not about giving away more discounts, but about providing layered, comprehensive value that locks them into the ecosystem.
          </p>
          <div className="bg-white p-5 rounded-lg shadow-inner border border-indigo-200 mb-6">
            <h4 className="text-xl font-semibold text-indigo-700 mb-3">Think Beyond the Single Incentive: Layered Examples</h4>
            <ul className="list-disc list-inside text-lg text-gray-700 space-y-2 ml-4">
              <li><strong>App Welcome Offer + Refer a Friend + WRC:</strong> Introducing the App's welcome offer with a Refer-a-Friend incentive and a Wicked Reward Card (WRC) delivers outstanding value and gives the customer the "wow factor" within their initial transaction.</li>
              <li><strong>Trade-In + WRC:</strong> The Trade-In solves their immediate need, and the Reward Card creates the incentive for their next purchase.</li>
              </ul>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed mb-6 font-bold text-indigo-600">
            Do not stop the conversation after one accepted incentive. Listen for secondary needs, and layer value where it makes sense. This smarter, consultative approach is how we close the retention gap.
          </p>

          <div className="bg-blue-100 p-5 rounded-lg shadow-inner mt-8">
            <h3 className="text-2xl font-semibold text-blue-800 mb-3">Incentive Consistency in Turbulent Times</h3>
            <p className="text-lg text-blue-700 leading-relaxed mb-4">
              We observe that the clusters and stores seeing the best results in this turbulent time for our industry are the ones who are consistently performing well across <strong>multiple incentives</strong>. This dedication to driving both acquisition and loyalty through incentives is the single most reliable predictor of success.
            </p>
          </div>
        </section>

        {/* New Section: NC Acquisition vs Retention Deep Dive (Chart + Narrative) */}
        <section className="mb-12 p-8 bg-pink-50 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-pink-700 mb-6 border-b-2 border-pink-200 pb-2">NC Acquisition vs. Retention: The Core of Sustainable Growth</h2>
            <div className="p-6 bg-white rounded-lg shadow-inner">
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    The Active Customer Base (ACB) represents a store's true growth trajectory: if ACB is consistently increasing, the store is in a growth phase; conversely, a decline signals a critical loss of customer momentum. Outside of reducing churn, the main two fundamental ways of positively influencing the ACB are <strong>New Customer Acquisition (NC)</strong> and <strong>Retention</strong>, with both being reliant on the other for meaningful growth.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mb-6">
                    A flaw in one area severely limits the potential of the other. For example, executing a flawless local initiative that generates 100+ new customers is excellent, but if only 10 of them return (poor retention), that effort is largely wasted. Likewise, if we achieve high retention rates but are only attracting a minimal number of new customers, our growth is stagnant. Sustainable success requires high performance in <strong>both acquisition and retention</strong>—a balance where efforts in one area amplify the results in the other.
                </p>
                
                {/* SCATTER CHART INTEGRATION - Adjusting Margins for better display */}
                <h4 className="text-2xl font-bold text-pink-800 mt-6 pt-4 border-t border-pink-200">Visual Diagnostic Tool (Store-Level)</h4>
                <p className="text-sm text-gray-600 mb-6">
                    This chart plots every store's NC Acquisition (X-axis) against its Retention (Y-axis). The size of the bubble reflects the absolute NC count. Stores should aim to move their performance bubble into the <strong>Top Right Quadrant</strong> (High Acquisition & High Retention). Hover over a bubble to see the store name.
                </p>
                <ResponsiveContainer width="100%" height={400}>
                    <ScatterChart margin={{ top: 30, right: 30, bottom: 50, left: 30 }}> {/* Increased margin for axes */}
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            type="number"
                            dataKey="ncVsTGT"
                            name="NC vs TGT %"
                            unit="%"
                            domain={[30, 85]} // Reduced domain for better fit
                            label={{ value: 'NC vs TGT %', position: 'bottom', offset: 30, fill: '#4a5568' }}
                            tick={{ fill: '#4a5568' }}
                        />
                        <YAxis
                            type="number"
                            dataKey="retention"
                            name="Retention %"
                            unit="%"
                            domain={[15, 55]} // Reduced domain for better fit
                            label={{ value: 'Retention %', position: 'left', angle: -90, offset: -20, fill: '#4a5568' }}
                            tick={{ fill: '#4a5568' }}
                        />
                        <ZAxis dataKey="size" name="NC Count" range={[100, 800]} />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomScatterTooltip/>} /> 
                        <Legend />
                        {/* Target lines adjusted */}
                        <ReferenceLine y={50} stroke="#E91E63" strokeDasharray="3 3" label={{ value: 'Target Retention (50%)', position: 'left', fill: '#E91E63' }}/>
                        <Scatter data={filteredScatterData} fill="#E91E63" name="Store Performance" line shape="circle" />
                    </ScatterChart>
                </ResponsiveContainer>


                <h4 className="text-2xl font-bold text-pink-800 mt-6 pt-4 border-t border-pink-200">Driving New Customer Traffic</h4>
                <p className="text-lg text-gray-700 leading-relaxed mt-3">
                    Our data clearly identifies the challenge: we need more new customers coming through the door. This isn't just a marketing problem—it's a local engagement opportunity.
                </p>
                <p className="text-xl font-extrabold text-pink-700 mt-4">
                    What local, non-traditional ideas can your store and cluster start brainstorming now to dramatically increase the footfall of first-time customers this month?
                </p>
            </div>
        </section>


        {/* Raw Data Table Section - NOW INTERACTIVE ON HOVER */}
        <section className="mb-12 p-8 bg-gray-50 rounded-xl shadow-lg">
            <h2 className="text-3xl font-bold text-gray-700 mb-6 border-b-2 border-gray-200 pb-2">September Store-Level KPI Detail</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6 font-semibold">
                <strong>For Your Action Plan:</strong> This table provides the full, store-specific KPI breakdown required to drive your individual coaching and improvement plans for October. Use the Cluster filter above to focus on your team's numbers.
            </p>
            <SeptemberKpiDetailTable />
        </section>


        {/* ========================================================= */}
        {/* 3. ENGAGEMENT & COMPLIANCE */}
        {/* ========================================================= */}


        {/* Section 5: Google Reviews & TW App Signups */}
        <section className="mb-12 p-8 bg-teal-50 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-teal-700 mb-6 border-b-2 border-teal-200 pb-2">Customer Engagement: Google Reviews Ranking & TW App Adoption {selectedCluster !== 'All' ? `— ${selectedCluster}` : ''}</h2>

          {/* Google Reviews - NOW A RANKING TABLE */}
          <div className="mb-8 p-6 bg-white rounded-lg shadow-xl">
            <h3 className="text-2xl font-semibold text-teal-800 mb-4">Google Local Ranking Performance (September)</h3>
                <GoogleReviewTable />
            <p className="text-sm text-gray-600 mt-4">Shout-outs to <strong>Madeley</strong>, <strong>Rumney</strong>, and <strong>Wolves Penn Road</strong> for achieving Rank 1 status! Maintaining Rank 1 is key to being seen by local searchers. Focus on stores with falling ranks (red arrows) to implement immediate recovery strategies.</p>
                <p className="text-sm text-gray-600 mt-2">Special commendation goes to <strong>Bristol</strong>, <strong>Madeley</strong>, and <strong>Wellington</strong> for their tremendous focus and performance in obtaining a high volume of new Google reviews this month.</p>
          </div>

            {/* New Section on Google Ranking Importance */}
            <div className="mb-8 p-6 bg-teal-100 rounded-lg shadow-inner">
                <h3 className="text-2xl font-semibold text-teal-800 mb-4">Why Google Ranking Matters (Local SEO)</h3>
                <p className="text-lg text-gray-700 leading-relaxed mb-4">
                    Your Google ranking determines whether your store appears in the <strong>Google Map Pack</strong>—the top 3 local businesses shown when a customer searches for "vape shop near me." These top 3 spots receive approximately <strong>80% of all local search clicks and calls.</strong> Achieving and maintaining Rank 1 is crucial because it makes your store the default choice for new, nearby customers.
                </p>
                <h4 className="text-xl font-semibold text-teal-700 mt-6 mb-3">Best Ways to Influence Your Ranking:</h4>
                <ul className="list-disc list-inside text-lg text-gray-700 space-y-2 ml-4">
                    <li><strong>Review Volume & Velocity:</strong> Consistently asking every satisfied customer for a review is the single biggest factor. The more new reviews you get <strong>each month</strong>, the better.</li>
                    <li><strong>Keyword Optimisation:</strong> Ensure your Google Business Profile describes what you do (e.g., include "vape shop" or "ecigarette store").</li>
                    <li><strong>Profile Completeness:</strong> Keep hours, address, and contact details 100% accurate and up to date.</li>
                    <li><strong>Review Responses:</strong> Always respond to <strong>every</strong> review (good and bad). This shows Google you are an active, engaged business.</li>
                </ul>
                <p className="text-lg text-gray-800 leading-relaxed mt-4 font-semibold">
                    With the other three areas largely managed and maintained for you by <strong>Head Office</strong>, your primary focus should be on obtaining frequent, quality customer reviews!
                </p>
            </div>

          {/* TW App Signups - ACTUAL DATA (Sept Snapshot vs Average) - NOW FILTERED */}
          <div className="mb-8 p-6 bg-white rounded-lg shadow-sm">
            <h3 className="text-2xl font-semibold text-teal-800 mb-4">TW App Adoption: September Snapshot vs Area Average</h3>
            <p className="text-sm text-gray-600 mb-4">This chart compares each store's September <strong>App Adoption Rate</strong> against the Area Average of <strong>{septemberAreaAverage.toFixed(1)}%</strong>. Stores exceeding the red line are leading the way in digital engagement.</p>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={filteredTwAppSignupSeptData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="store" angle={-45} textAnchor="end" height={100} interval={0} tick={{ fill: '#4a5568', fontSize: 12 }} />
                <YAxis tickFormatter={(value) => `${value}%`} domain={[0, 60]} tick={{ fill: '#4a5568' }} />
                <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="percentHaveApp" name="% Customer App Adoption (Sept)" fill={appBarColor} radius={[8, 8, 0, 0]} />
                {/* Reference Line for Area Average */}
                <ReferenceLine y={septemberAreaAverage} stroke={averageLineColor} strokeDasharray="3 3" label={{ value: `Area Average: ${septemberAreaAverage.toFixed(1)}%`, position: 'top', fill: averageLineColor }} />
              </BarChart>
            </ResponsiveContainer>
          </div>

            {/* TW App Signups - PROGRESS OVER TIME - NOW FILTERED */}
          <div className="mb-8 p-6 bg-indigo-50 rounded-lg shadow-sm">
            <h3 className="text-2xl font-semibold text-indigo-800 mb-4">App Adoption Rate Over Time (Q2 Progress by Store)</h3>
            <p className="text-sm text-gray-600 mb-4">This Line Chart tracks the <strong>App Adoption</strong> rate progress for all stores from July through September. Look for steep upward trends to identify stores with the most momentum!</p>
            <ResponsiveContainer width="100%" height={450}>
              <LineChart data={filteredAppAdoptionProgressData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="store" angle={-45} textAnchor="end" height={100} interval={0} tick={{ fill: '#4a5568', fontSize: 12 }} />
                <YAxis tickFormatter={(value) => `${value}%`} domain={[0, 60]} tick={{ fill: '#4a5568' }} />
                <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                
                {/* Lines for the three months */}
                <Line type="monotone" dataKey="July" stroke="#4A90E2" strokeWidth={2} dot={false} name="July Adoption %" />
                <Line type="monotone" dataKey="August" stroke="#FFC107" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} name="August Adoption %" />
                <Line type="monotone" dataKey="September" stroke="#8BC34A" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} name="September Adoption %" />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-lg text-gray-800 leading-relaxed mt-4 font-semibold text-centre">
                <strong>Key to Success:</strong> The App Adoption rate is most heavily influenced by successful sign-ups with new customers (NC). Using the App as the standard approach for every NC conversation is the fastest way to drive this metric up!
            </p>
          </div>

        </section>


        {/* Section 4: Audit Results - NOW COMPLETE AND CLEANED */}
        <section className="mb-12 p-8 bg-indigo-50 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold text-indigo-700 mb-6 border-b-2 border-indigo-200 pb-2">H1 Audit Results: Ensuring Excellence {selectedCluster !== 'All' ? `— ${selectedCluster}` : ''}</h2>
          <p className="text-md text-green-700 font-semibold mb-6">Review your H1 Audit performance below. Note that the Audit scores shown are the cluster averages of the store scores listed in your data.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* MWW Audit Result */}
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-2xl font-semibold text-indigo-800 mb-4">Mr Wicked Way (MWW) Audit Results (Cluster Average)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={filteredMwwAuditData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="cluster" tick={{ fill: '#4a5568' }} />
                  <YAxis tickFormatter={(value) => `${value.toFixed(1)}%`} domain={[80, 100]} tick={{ fill: '#4a5568' }} />
                  <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                  <Legend />
                  <Bar dataKey="result" name="Audit Result %" fill="#6a0dad" radius={[10, 10, 0, 0]} />
              </BarChart>
              </ResponsiveContainer>
              <p className="text-sm text-gray-600 mt-4">MWW Audits ensure operational excellence and store standards are consistently high. These scores are a direct reflection of team discipline.</p>
            </div>

            {/* Compliance Results */}
            <div className="p-6 bg-white rounded-lg shadow-sm">
              <h3 className="text-2xl font-semibold text-indigo-800 mb-4">Compliance Audit Results (Cluster Average)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={filteredComplianceAuditData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="cluster" tick={{ fill: '#4a5568' }} />
                  <YAxis tickFormatter={(value) => `${value.toFixed(1)}%`} domain={[90, 100]} tick={{ fill: '#4a5568' }} />
                  <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                  <Legend />
                  <Bar dataKey="result" name="Audit Result %" fill="#FF4500" radius={[10, 10, 0, 0]} />
              </BarChart>
              </ResponsiveContainer>
              <p className="text-sm text-gray-600 mt-4">Compliance Audits are mandatory for secure and responsible operations. Striving for 100% is non-negotiable.</p>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* 4. TARGETS (HIDDEN BY QUIZ) */}
        {/* ========================================================= */}

        
        {/* Section 6: Knowledge Check / October Targets (CONDITIONAL) */}
        <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b-2 border-gray-400 pb-2 text-centre">Knowledge Check: Unlock October Targets</h2>
            
            <div className="flex justify-centre mb-8">
                <QuizComponent />
            </div>

            {/* October Targets are only rendered if the quiz is passed */}
            {quizPassed ? (
                <OctoberTargetsTable />
            ) : (
                <div className="mt-12 p-6 bg-red-50 rounded-xl shadow-lg border-t-4 border-red-600 text-centre">
                    <h3 className="text-2xl font-bold text-red-700">October Targets Hidden</h3>
                    <p className="text-lg text-red-800 mt-2">Complete the Knowledge Check above to review your forward-looking goals!</p>
                </div>
            )}
        </section>

      </div>
        </div>
  );
};

export default App;
