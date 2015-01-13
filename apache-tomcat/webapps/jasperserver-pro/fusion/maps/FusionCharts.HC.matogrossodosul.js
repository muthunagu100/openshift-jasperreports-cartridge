/*!
 * @license FusionCharts JavaScript Library
 * Copyright FusionCharts Technologies LLP
 * License Information at <http://www.fusioncharts.com/license>
 *
 * @author FusionCharts Technologies LLP
 * @version fusioncharts/3.2.4-sr1.10100
 * @id fusionmaps.MatoGrossodoSul.20.10-30-2012 08:20:48
 */
FusionCharts(["private","modules.renderer.highcharts-matogrossodosul",function(){var p=this,k=p.hcLib,n=k.chartAPI,h=k.moduleCmdQueue,a=k.injectModuleDependency,i="M",j="L",c="Z",f="Q",b="left",q="right",t="center",v="middle",o="top",m="bottom",s="maps",l=false&&!/fusioncharts\.com$/i.test(location.hostname),r=!!n.geo,d,e,u,g;d=[{name:"MatoGrossodoSul",revision:20,creditLabel:l,standaloneInit:true,baseWidth:340,baseHeight:350,baseScaleFactor:10,entities:{"BR.MS":{outlines:[[i,2156,57,f,2152,57,2151,61,2151,66,2150,67,2132,74,2125,80,j,2120,111,f,2109,126,2103,137,2101,159,2090,168,j,2078,178,f,2072,186,2070,187,2046,198,2041,198,2002,197,1990,199,1985,211,1953,208,j,1678,208,f,1656,207,1636,207,1622,207,1616,211,1610,214,1602,214,1594,214,1579,212,j,1578,212,f,1572,212,1563,221,1550,225,1539,225,1529,229,1523,239,j,1503,239,f,1499,239,1489,236,1477,236,1474,238,1471,248,1470,249,1466,253,1460,253,j,1433,254,f,1432,254,1432,254,1408,254,1393,252,1388,251,1358,251,1352,247,1334,241,1329,238,1327,224,1300,224,1285,222,1275,221,1272,217,1270,214,1262,202,j,1234,201,f,1224,202,1218,195,1214,192,1204,179,j,1180,167,f,1176,163,1175,153,1175,145,1165,139,1117,111,1064,70,1049,60,1033,54,1008,44,981,44,924,44,856,99,824,127,812,137,793,154,785,154,773,154,767,149,760,144,747,142,746,141,743,141,741,139,737,138,j,728,138,f,718,138,681,142,674,143,666,163,658,182,656,199,653,224,618,232,564,246,563,247,j,562,283,f,560,299,556,302,550,303,544,309,522,333,518,336,508,343,484,346,472,348,444,346,423,349,432,380,415,448,383,448,374,448,374,436,374,429,375,412,374,401,365,362,360,341,335,318,313,299,288,284,290,290,290,295,290,302,284,314,275,331,276,333,280,347,281,354,290,380,292,386,301,412,301,413,316,485,316,487,j,316,506,f,319,519,338,534,355,547,355,558,355,571,350,582,347,586,344,591,330,608,327,628,327,633,316,652,313,659,306,679,297,697,295,714,290,744,288,751,287,774,287,780,282,798,280,810,279,835,278,849,266,859,266,888,j,266,892,f,266,901,259,910,254,918,243,941,223,977,220,982,209,997,207,1001,200,1027,199,1029,194,1050,179,1070,168,1085,155,1112,128,1149,128,1159,j,128,1159,f,128,1167,118,1183,110,1196,94,1206,93,1208,94,1221,94,1234,90,1241,79,1264,75,1295,73,1315,73,1325,73,1335,93,1371,108,1397,109,1397,123,1410,135,1417,170,1435,173,1437,180,1447,180,1449,180,1453,143,1497,135,1510,131,1513,121,1520,80,1537,j,80,1547,f,88,1561,89,1567,101,1598,102,1602,120,1625,122,1627,133,1647,140,1677,157,1713,161,1745,j,165,1772,f,166,1776,173,1781,180,1787,184,1787,196,1789,202,1794,j,210,1804,f,222,1816,223,1818,224,1821,229,1841,235,1850,240,1859,247,1869,247,1878,247,1901,240,1932,j,240,1953,f,242,1966,246,1971,249,1975,249,1982,249,2003,221,2023,205,2033,208,2048,208,2050,201,2055,193,2061,193,2072,193,2084,201,2089,219,2101,223,2105,j,223,2107,f,230,2111,232,2112,237,2115,236,2125,236,2136,239,2169,239,2193,233,2202,j,233,2212,f,236,2231,241,2239,j,244,2293,f,244,2307,238,2310,220,2318,222,2327,226,2330,226,2336,226,2343,212,2350,198,2357,198,2365,198,2371,219,2390,240,2409,240,2431,240,2441,238,2442,235,2443,225,2448,225,2450,225,2456,225,2466,223,2475,223,2482,236,2494,251,2507,264,2507,282,2507,310,2485,338,2462,343,2462,355,2462,363,2474,375,2491,385,2497,405,2500,413,2502,429,2506,448,2512,457,2508,464,2509,467,2510,468,2510,468,2510,469,2510,482,2510,484,2511,485,2511,488,2517,496,2526,507,2526,511,2526,521,2519,531,2512,539,2512,553,2512,560,2514,569,2519,577,2520,582,2521,587,2527,591,2533,606,2533,620,2533,625,2537,639,2548,641,2549,661,2563,669,2563,679,2563,685,2557,j,693,2546,f,703,2540,706,2533,704,2531,704,2530,704,2524,717,2515,731,2505,741,2506,757,2508,769,2500,792,2479,796,2476,807,2474,809,2473,817,2467,819,2465,827,2458,854,2458,865,2458,865,2452,j,866,2446,f,869,2445,893,2445,909,2441,925,2441,931,2441,935,2447,939,2454,944,2455,953,2461,959,2463,964,2463,965,2467,973,2473,1007,2473,1007,2479,1017,2486,1027,2493,1034,2493,1056,2481,1081,2481,1090,2483,1111,2486,1129,2498,1137,2503,1174,2525,1174,2542,1174,2551,1161,2554,1162,2559,1163,2579,1164,2587,1179,2606,1193,2641,1194,2649,1198,2691,1204,2721,j,1204,2723,f,1209,2736,1208,2767,1208,2771,1216,2791,1224,2811,1224,2821,1224,2827,1222,2843,1222,2857,1235,2888,1237,2893,1243,2905,1247,2913,1248,2929,1248,2942,1259,2961,1259,2967,1261,3009,1266,3012,1274,3052,1284,3075,1289,3084,1289,3085,1299,3119,1303,3134,1302,3165,1302,3166,1302,3168,1301,3175,1299,3188,1299,3200,1310,3238,1311,3241,1328,3284,1335,3300,1337,3302,1341,3308,1354,3311,1420,3324,1453,3326,1480,3326,1496,3326,1524,3326,1534,3313,1560,3293,1569,3285,1587,3270,1624,3270,1652,3270,1683,3278,1712,3284,1721,3291,1736,3303,1773,3356,1803,3382,1812,3386,1818,3389,1833,3406,1849,3423,1851,3432,1855,3445,1864,3445,j,1873,3445,1873,3440,f,1879,3435,1879,3426,1876,3422,1876,3419,1876,3418,1883,3402,1889,3383,1889,3382,j,1890,3321,f,1887,3274,1899,3267,1914,3258,1924,3239,1928,3230,1940,3221,1953,3212,1956,3209,1976,3187,1976,3177,1976,3176,1973,3172,j,1972,3162,f,1972,3154,1978,3143,1989,3122,1990,3120,1995,3106,2019,3076,2024,3069,2029,3060,2041,3042,2045,3036,2074,2999,2076,2985,2074,2984,2074,2981,2085,2962,2085,2959,j,2086,2926,f,2086,2919,2079,2915,2073,2911,2073,2895,2073,2869,2090,2848,2100,2832,2101,2831,2103,2829,2104,2822,2105,2818,2110,2819,j,2111,2816,2109,2814,2110,2810,f,2117,2800,2119,2797,2123,2793,2131,2792,2144,2791,2160,2775,2169,2772,2184,2761,2194,2757,2203,2759,2221,2753,2230,2748,2301,2705,2308,2688,j,2315,2688,f,2333,2684,2338,2678,2356,2673,2367,2664,2391,2641,2406,2629,2435,2613,2446,2605,2454,2597,2463,2591,2469,2582,2472,2581,2477,2582,2491,2574,2503,2566,2507,2562,2518,2545,2529,2539,2537,2534,2546,2521,2556,2509,2559,2509,2564,2509,2572,2513,2581,2513,2595,2500,2606,2494,2622,2488,2639,2481,2641,2481,2643,2481,2653,2474,j,2784,2315,2783,2308,f,2783,2299,2793,2294,2799,2291,2808,2288,2811,2285,2822,2263,2823,2258,2839,2234,2845,2225,2845,2223,2844,2211,2862,2191,2867,2185,2893,2150,2896,2146,2905,2139,2911,2134,2914,2130,2932,2111,2934,2105,2935,2101,2935,2078,j,2935,2052,f,2935,2049,2940,2035,2946,2014,2957,2000,2959,1998,2962,1990,2963,1986,2968,1985,2972,1984,2974,1978,2978,1978,2978,1977,2991,1974,2991,1967,2990,1959,2991,1959,2997,1956,3003,1950,3003,1924,3003,1922,3008,1908,3027,1868,3027,1862,3033,1859,3035,1857,3046,1853,3046,1844,3047,1838,3049,1821,3053,1811,3053,1807,3050,1802,j,3048,1788,f,3044,1775,3041,1772,3030,1764,3030,1761,3030,1754,3017,1751,j,2983,1751,f,2982,1751,2975,1744,2970,1740,2970,1732,2970,1725,2983,1712,2984,1711,2988,1705,2993,1699,3001,1696,3004,1695,3015,1685,3025,1677,3033,1677,3038,1677,3048,1670,j,3051,1670,f,3066,1675,3070,1682,j,3078,1683,f,3085,1687,3082,1700,3094,1697,3094,1713,3094,1721,3107,1721,3120,1721,3119,1712,3129,1701,3129,1699,j,3128,1691,f,3128,1684,3140,1679,3144,1670,3143,1663,3143,1659,3144,1644,3144,1641,3150,1639,3156,1637,3156,1633,3156,1629,3153,1626,3154,1622,3154,1615,3154,1600,3153,1592,3153,1571,3163,1571,3159,1567,3159,1558,3159,1547,3168,1547,j,3197,1549,f,3213,1549,3217,1542,3218,1538,3224,1533,3224,1532,3224,1518,3226,1513,3232,1511,3230,1499,3236,1492,3237,1490,3243,1487,j,3241,1476,f,3241,1467,3249,1466,3250,1466,3251,1466,3260,1466,3273,1467,3276,1501,3280,1501,3291,1501,3296,1492,3298,1488,3299,1482,3303,1465,3314,1452,j,3313,1439,f,3313,1430,3327,1421,3331,1417,3336,1403,3337,1398,3343,1384,3345,1380,3348,1379,3351,1379,3351,1374,j,3351,1325,f,3347,1326,3347,1323,3344,1313,3344,1313,j,3342,1296,f,3342,1286,3345,1267,j,3344,1234,3343,1231,3344,1224,3341,1210,f,3341,1199,3349,1194,3357,1189,3357,1185,3357,1182,3353,1171,3330,1171,3328,1169,3325,1167,3325,1164,3326,1162,3316,1162,j,3298,1163,f,3294,1164,3289,1159,j,3278,1152,f,3265,1152,3261,1148,3244,1125,3237,1124,3208,1124,3206,1119,3202,1112,3200,1112,j,3176,1109,f,3170,1110,3150,1102,3145,1100,3142,1092,3139,1084,3138,1083,3122,1080,3117,1067,j,3104,1061,f,3099,1059,3095,1055,3093,1053,3067,1043,j,3054,1034,f,3051,1034,3046,1030,3040,1023,3036,1019,3032,1016,3025,1002,3009,993,2998,985,2973,964,2961,955,2942,941,2914,941,2908,941,2901,934,2891,927,2886,925,2879,923,2877,916,2876,912,2869,899,2869,891,2858,880,2847,869,2847,858,2846,854,2825,841,2803,838,2798,830,2791,820,2778,820,2765,810,2763,804,2761,798,2752,798,2741,799,2736,798,2707,800,2686,797,j,2682,797,f,2681,792,2672,786,2655,777,2654,777,2636,765,2617,763,2605,762,2604,762,2580,752,2579,752,2566,752,2560,751,2544,748,2543,746,2542,745,2543,740,2532,738,2530,732,2530,730,2530,714,j,2530,706,f,2530,695,2530,694,2534,684,2540,682,2542,681,2548,671,j,2562,653,f,2567,646,2581,631,2592,615,2592,601,2592,588,2588,577,2586,567,2547,572,2545,562,2530,562,j,2513,566,f,2490,565,2475,562,2467,561,2452,561,2430,556,2428,555,2418,553,2418,541,2418,537,2411,529,2409,526,2409,507,j,2410,491,f,2410,484,2411,475,2411,464,2411,457,2411,451,2401,427,2400,426,2395,411,2384,396,2385,391,2386,376,2348,377,2335,368,2330,367,2318,367,2310,365,2294,362,2289,350,2288,345,2282,337,2276,328,2275,323,2271,295,2271,276,2271,267,2273,254,2273,239,2266,224,j,2258,169,f,2254,155,2248,147,2247,142,2246,128,2246,125,2239,114,2236,110,2223,79,2204,60,2195,57,c]],label:"Mato Grosso do Sul",shortLabel:"MS",labelPosition:[161.5,154.5],labelAlignment:[t,v]}}}];g=d.length;if(r){while(g--){e=d[g];n(e.name.toLowerCase(),e,n.geo)}}else{while(g--){e=d[g];u=e.name.toLowerCase();a(s,u,1);h[s].unshift({cmd:"_call",obj:window,args:[function(w,x){if(!n.geo){p.raiseError(p.core,"12052314141","run","JavaScriptRenderer~Maps._call()",new Error("FusionCharts.HC.Maps.js is required in order to define vizualization"));return}n(w,x,n.geo)},[u,e],window]})}}}]);