/*!
 * @license FusionCharts JavaScript Library
 * Copyright FusionCharts Technologies LLP
 * License Information at <http://www.fusioncharts.com/license>
 *
 * @author FusionCharts Technologies LLP
 * @version fusioncharts/3.2.4-sr1.10100
 * @id fusionmaps.Solothurn.20.10-31-2012 09:51:12
 */
FusionCharts(["private","modules.renderer.highcharts-solothurn",function(){var p=this,k=p.hcLib,n=k.chartAPI,h=k.moduleCmdQueue,a=k.injectModuleDependency,i="M",j="L",c="Z",f="Q",b="left",q="right",t="center",v="middle",o="top",m="bottom",s="maps",l=false&&!/fusioncharts\.com$/i.test(location.hostname),r=!!n.geo,d,e,u,g;d=[{name:"Solothurn",revision:20,creditLabel:l,standaloneInit:true,baseWidth:820,baseHeight:730,baseScaleFactor:10,entities:{"CH.SO.GG":{outlines:[[i,7236,1495,j,7179,1524,7160,1584,f,7140,1584,7120,1584,7113,1584,7106,1583,7097,1582,7096,1585,j,6932,1654,6932,1739,6639,1865,f,6632,1865,6624,1864,j,6566,1805,6517,1827,6421,1711,6347,1736,6362,1824,6275,1823,6255,1871,6183,1924,6204,1979,6204,1981,f,6278,1993,6281,2035,j,6265,2104,6161,2156,6100,2129,f,6076,2164,6043,2184,j,6010,2196,5847,2233,5776,2368,f,5783,2368,5782,2373,5785,2376,5785,2377,5784,2388,5787,2398,5788,2402,5791,2402,5795,2403,5797,2405,5797,2408,5796,2417,j,5892,2471,f,5890,2482,5890,2493,5894,2496,5896,2498,5898,2504,5899,2506,5900,2510,5900,2511,5904,2508,5907,2504,5915,2503,5920,2501,5922,2501,5925,2501,5933,2500,5938,2497,5949,2490,5956,2484,5964,2483,5970,2483,5973,2482,5974,2479,6012,2478,6048,2480,6048,2486,6048,2491,6050,2488,6056,2489,6059,2490,6063,2490,6081,2491,6098,2490,6108,2488,6111,2482,6114,2479,6118,2480,6124,2483,6128,2483,6138,2483,6147,2483,6152,2482,6156,2481,6161,2482,6166,2480,6171,2477,6174,2475,6179,2474,6180,2472,6193,2468,6197,2473,6200,2476,6203,2477,6205,2480,6207,2480,6212,2481,6216,2486,6220,2492,6226,2496,6228,2498,6230,2499,6234,2501,6237,2504,6237,2507,6235,2508,6239,2519,6246,2525,6249,2528,6251,2525,6255,2520,6258,2518,6263,2515,6267,2511,6271,2507,6271,2506,6273,2503,6277,2503,6282,2498,6289,2492,6293,2490,6293,2490,6299,2486,6303,2481,6304,2480,6307,2480,6311,2476,6313,2474,6315,2472,6318,2471,6322,2465,6325,2461,6341,2461,6353,2462,6366,2462,6377,2461,6383,2460,6385,2456,6389,2451,6392,2450,6399,2448,6401,2450,6406,2452,6410,2453,6413,2453,6416,2453,6488,2485,6529,2540,6555,2534,6577,2536,6598,2538,6611,2537,6631,2467,6644,2445,6658,2423,6742,2344,6768,2420,6821,2500,6856,2528,6900,2537,6973,2530,7038,2497,7039,2497,7040,2496,7113,2536,7166,2606,7186,2623,7190,2621,7262,2599,7269,2577,7267,2566,7267,2554,7267,2549,7267,2544,7265,2515,7264,2486,7264,2457,7264,2428,7264,2399,7266,2369,7297,2369,7326,2369,7333,2369,7339,2370,7343,2372,7345,2372,7348,2372,7350,2374,7356,2380,7365,2380,7372,2383,7380,2384,7383,2389,7384,2390,7389,2393,7390,2396,7393,2402,7401,2405,7408,2406,7412,2409,7414,2411,7419,2411,7423,2411,7425,2413,7430,2416,7437,2441,7452,2441,7467,2441,7485,2441,7501,2441,7516,2442,7531,2442,7554,2442,7576,2441,7585,2440,7588,2434,7594,2424,7593,2414,7595,2407,7595,2402,7600,2389,7607,2379,7609,2376,7612,2372,7616,2366,7617,2361,7617,2358,7618,2356,7619,2350,7620,2342,7626,2333,7628,2327,7629,2323,7631,2321,7633,2319,7633,2316,7634,2311,7634,2309,7633,2303,7635,2298,7636,2296,7638,2293,7639,2291,7640,2290,7644,2286,7643,2283,7642,2277,7647,2273,7650,2270,7649,2266,7652,2258,7656,2256,7660,2248,7663,2243,7665,2240,7669,2237,7672,2233,7672,2227,7671,2215,7674,2209,7676,2204,7677,2203,7678,2199,7678,2198,7677,2194,7678,2193,7678,2184,7680,2178,7681,2175,7682,2173,7682,2171,7683,2169,7689,2160,7688,2147,7688,2140,7691,2137,7694,2134,7691,2132,7692,2128,7697,2125,7700,2121,7700,2121,7706,2115,7715,2108,7720,2105,7724,2101,7729,2097,7734,2092,7737,2089,7740,2085,7743,2081,7744,2079,7748,2076,7750,2071,7755,2068,7758,2073,7761,2077,7899,2131,7908,2065,7910,2051,7912,2036,7927,2008,7943,1980,7945,1979,7949,1975,7953,1973,7955,1972,7956,1968,7957,1963,7963,1963,7967,1959,7970,1960,7975,1960,7976,1957,7979,1955,7980,1955,j,7970,1921,f,7943,1921,7914,1921,7913,1919,7911,1915,7894,1914,7876,1914,7847,1914,7818,1914,7804,1914,7790,1914,7783,1915,7775,1915,7773,1916,7772,1914,7770,1913,7771,1910,7770,1903,7773,1896,7774,1894,7776,1889,7779,1887,7780,1881,7780,1877,7782,1871,7783,1870,7784,1865,7785,1849,7785,1834,7785,1830,7786,1826,7787,1821,7783,1821,7782,1821,7778,1818,7777,1816,7775,1814,7770,1811,7772,1804,7770,1803,7771,1795,7770,1791,7770,1788,7769,1784,7768,1780,7767,1773,7763,1770,7762,1770,7759,1766,7759,1760,7759,1754,7759,1746,7758,1739,j,7645,1668,7573,1662,7524,1615,7454,1604,7365,1526,7291,1503,c],[i,7227,896,j,7227,951,7180,951,7180,1016,7073,1129,7139,1310,7110,1338,7222,1476,7475,1363,7505,1461,7515,1373,7457,1106,7367,998,7377,966,7377,901,7292,848,c]],label:"Gösgen",shortLabel:"GG",labelPosition:[713.9,206.9],labelAlignment:[t,v]},"CH.SO.OL":{outlines:[[i,6278,2502,f,6273,2503,6272,2505,6271,2507,6268,2510,6264,2514,6258,2517,6255,2520,6252,2524,6249,2528,6247,2525,6239,2518,6235,2508,6237,2507,6238,2504,6234,2501,6230,2499,6229,2498,6227,2496,6221,2491,6216,2485,6213,2481,6208,2480,6205,2480,6204,2477,6201,2476,6198,2473,6193,2468,6180,2471,6180,2474,6174,2474,6172,2476,6166,2480,6162,2482,6156,2480,6153,2482,6148,2482,6138,2483,6129,2482,6124,2482,6119,2479,6114,2478,6112,2481,6108,2487,6099,2490,6081,2490,6064,2490,6060,2490,6056,2489,6051,2488,6049,2490,6049,2485,6049,2479,6012,2478,5974,2478,5973,2482,5970,2482,5964,2483,5957,2483,5949,2490,5939,2496,5933,2499,5925,2500,5923,2500,5920,2501,5915,2502,5907,2503,5905,2508,5900,2510,5900,2509,5900,2506,5899,2504,5897,2497,5894,2495,5891,2493,5890,2482,5893,2471,j,5796,2416,f,5798,2408,5797,2404,5795,2402,5791,2402,5789,2401,5787,2398,5785,2388,5785,2376,5785,2375,5783,2373,5784,2367,5776,2368,j,5769,2382,5653,2433,5425,2471,5332,2642,5331,2812,f,5360,2813,5390,2813,5419,2813,5448,2813,5455,2817,5457,2819,5462,2822,5461,2831,5461,2839,5460,2848,5460,2852,5465,2851,5471,2850,5470,2855,5473,2862,5478,2866,5484,2870,5487,2874,5491,2876,5492,2878,5497,2882,5503,2883,5508,2885,5510,2887,5512,2889,5514,2891,5515,2895,5518,2897,5522,2899,5524,2906,5530,2911,5532,2914,5533,2919,5535,2920,5540,2925,5543,2927,5547,2932,5549,2934,5549,2942,5553,2942,5558,2943,5562,2944,j,5563,2944,5563,2944,5573,3032,5704,3284,5743,3284,5743,3285,5849,3534,f,5709,3656,5584,3783,j,5716,4025,f,5727,4020,5736,4014,j,5739,4013,f,5838,3927,5903,3828,5904,3827,5905,3826,5905,3825,5905,3824,5905,3797,5905,3770,5905,3750,5905,3729,5905,3725,5908,3724,5911,3720,5912,3718,5915,3713,5918,3711,5919,3709,5924,3706,5973,3646,6030,3528,j,6032,3526,f,6066,3455,6071,3376,6071,3375,6071,3374,j,6232,3283,f,6259,3273,6289,3273,6297,3273,6305,3273,6312,3271,6329,3275,6345,3279,6366,3280,6387,3281,6396,3279,6405,3278,6409,3278,6462,3185,6519,3130,6520,3130,6520,3129,j,6492,3055,f,6506,2984,6544,2928,6583,2873,6622,2801,j,6764,2923,f,6779,2924,6794,2925,6794,2930,6799,2930,6803,2932,6808,2934,6836,2934,6864,2934,6894,2934,6923,2934,6936,2934,6949,2935,6950,2941,6953,2944,6957,2942,6963,2942,6971,2943,6980,2943,7003,2943,7025,2943,7050,2943,7072,2943,j,7072,3046,f,7073,3043,7080,3044,7081,3076,7081,3105,7081,3135,7081,3164,7081,3169,7084,3171,j,7393,3071,7492,2995,f,7489,3001,7490,3003,7492,3009,7498,3009,7502,3011,7503,3011,7505,3012,7505,3015,7508,3017,7511,3018,j,7555,2932,f,7583,2932,7612,2932,7715,2870,7755,2832,7756,2832,7756,2831,j,7703,2722,7703,2722,7802,2658,f,7802,2649,7802,2646,7802,2617,7802,2588,7802,2558,7799,2527,7867,2433,7965,2347,j,8023,2097,7981,1954,f,7980,1955,7977,1957,7975,1959,7971,1959,7968,1959,7963,1962,7957,1963,7956,1968,7956,1972,7953,1973,7950,1974,7945,1979,7944,1980,7928,2008,7912,2036,7910,2050,7908,2065,7899,2131,7762,2077,7758,2072,7755,2068,7750,2071,7749,2076,7744,2079,7743,2080,7740,2085,7737,2088,7734,2091,7729,2096,7725,2101,7721,2104,7716,2108,7707,2114,7701,2120,7700,2121,7697,2124,7693,2127,7692,2131,7695,2133,7692,2136,7689,2140,7689,2146,7689,2159,7684,2169,7683,2171,7682,2173,7682,2175,7681,2178,7679,2184,7679,2192,7678,2194,7678,2198,7678,2199,7677,2202,7676,2203,7675,2208,7672,2215,7672,2226,7672,2233,7669,2236,7666,2240,7664,2242,7661,2247,7656,2255,7652,2257,7650,2265,7650,2270,7647,2272,7643,2276,7644,2283,7644,2285,7641,2289,7639,2291,7638,2293,7636,2296,7636,2298,7634,2303,7634,2309,7634,2311,7633,2315,7633,2318,7632,2320,7630,2323,7628,2326,7626,2333,7621,2341,7620,2350,7618,2355,7618,2358,7617,2360,7617,2366,7612,2372,7609,2375,7607,2378,7601,2389,7596,2401,7595,2407,7594,2414,7594,2423,7588,2434,7585,2440,7577,2440,7554,2441,7532,2441,7517,2441,7502,2441,7486,2440,7468,2440,7453,2440,7438,2440,7431,2415,7425,2413,7424,2410,7419,2410,7415,2410,7412,2408,7409,2405,7402,2404,7394,2402,7391,2395,7389,2392,7385,2389,7383,2388,7380,2383,7373,2383,7365,2379,7356,2380,7350,2374,7348,2372,7345,2371,7343,2371,7339,2370,7333,2369,7327,2369,7297,2369,7266,2369,7264,2398,7264,2428,7264,2456,7265,2485,7266,2515,7267,2544,7268,2549,7268,2554,7268,2566,7270,2577,7263,2599,7190,2621,7187,2622,7167,2605,7114,2535,7041,2495,7040,2496,7038,2497,6974,2529,6900,2536,6856,2527,6822,2500,6769,2419,6743,2344,6659,2423,6645,2445,6631,2467,6612,2537,6598,2537,6578,2535,6556,2534,6529,2540,6488,2484,6416,2453,6413,2453,6410,2452,6407,2451,6401,2450,6400,2448,6393,2449,6389,2450,6386,2456,6383,2460,6378,2460,6367,2462,6354,2461,6341,2460,6326,2461,6323,2464,6319,2471,6316,2472,6314,2474,6312,2476,6308,2479,6304,2479,6303,2481,6300,2485,6294,2489,6293,2490,6289,2492,f,6283,2498,6278,2502,c]],label:"Olten",shortLabel:"OL",labelPosition:[595.6,288.4],labelAlignment:[t,v]},"CH.SO.GA":{outlines:[[i,5563,2944,j,5562,2944,f,5558,2944,5553,2943,5549,2942,5549,2935,5547,2933,5543,2928,5540,2926,5535,2920,5533,2920,5532,2915,5530,2912,5524,2906,5522,2900,5518,2897,5515,2895,5514,2892,5512,2889,5510,2887,5508,2886,5503,2884,5497,2882,5492,2879,5491,2877,5487,2874,5484,2870,5478,2866,5473,2862,5470,2856,5471,2850,5465,2852,5460,2853,5460,2848,5461,2840,5461,2832,5462,2823,5457,2819,5455,2818,5448,2813,5419,2813,5390,2813,5360,2813,5331,2813,j,5268,2843,5262,2845,f,5261,2862,5261,2878,5262,2888,5262,2897,5179,2964,5062,3013,j,4801,3045,4786,3124,4739,3138,4739,3211,4526,3378,4407,3328,4421,3422,4318,3493,4247,3493,4247,3572,4103,3573,f,4191,3676,4303,3709,4307,3711,4311,3711,4313,3711,4313,3716,4312,3720,4312,3723,4312,3743,4313,3763,4327,3762,4336,3765,4338,3766,4340,3767,4346,3770,4347,3773,4357,3773,4362,3772,j,4362,3841,4413,3893,4443,3844,4551,3960,4542,4011,4634,4128,4695,4102,4788,4169,4825,4119,f,4831,4122,4838,4123,4842,4128,4847,4130,4850,4131,4853,4132,4861,4132,4868,4132,4879,4132,4888,4134,4909,4135,4925,4133,j,5005,4014,f,5007,4014,5008,4014,5016,4015,5025,4014,5029,4011,5030,4008,5032,4006,5033,4005,5033,4002,5037,4002,5065,4002,5093,4002,5098,4000,5102,3999,5108,3998,5112,3999,5112,4024,5113,4049,5118,4051,5125,4054,5123,4059,5123,4060,5123,4072,5123,4084,j,5228,4163,5445,3965,f,5476,4043,5530,4055,5531,4056,5531,4056,j,5590,4067,f,5666,4050,5716,4025,j,5584,3783,f,5709,3657,5849,3534,j,5743,3286,5743,3284,5704,3284,5573,3033,5563,2944,c]],label:"Gäu",shortLabel:"GA",labelPosition:[515.5,349.1],labelAlignment:[t,v]},"CH.SO.SO":{outlines:[[i,2437,4790,f,2423,4791,2410,4791,2385,4791,2360,4790,2355,4790,2344,4798,2333,4806,2309,4800,2285,4794,2271,4789,2256,4785,2252,4784,2214,4782,2175,4783,2175,4802,2175,4821,2175,4843,2191,4853,2192,4860,2195,4863,2198,4866,2198,4873,2199,4875,2201,4880,2206,4888,2206,4902,2209,4905,2208,4913,2207,4927,2194,4930,j,2193,4930,f,2188,4932,2180,4937,2164,4947,2154,4995,2138,5025,2137,5074,j,2150,5156,f,2197,5164,2251,5155,2277,5134,2294,5128,2311,5123,2318,5102,2332,5074,2342,5075,2367,5079,2398,5113,2428,5146,2505,5069,2499,5039,2482,5025,2564,5015,2562,4964,2583,4939,2592,4914,2592,4904,2590,4894,2584,4869,2567,4849,2566,4848,2565,4847,j,2501,4761,f,2499,4768,2485,4770,2472,4770,2465,4776,2464,4777,2458,4780,f,2445,4781,2437,4790,c]],label:"Solothurn",shortLabel:"SO",labelPosition:[236.4,496],labelAlignment:[t,v]},"CH.SO.WA":{outlines:[[i,4024,5704,j,4000,5821,4068,5812,4153,5834,4243,5717,4189,5711,4137,5641,4070,5704,c],[i,3626,4659,j,3604,4597,3597,4586,f,3579,4606,3529,4630,3485,4639,3427,4631,j,3377,4615,3363,4592,f,3359,4598,3357,4608,3354,4612,3353,4616,3351,4620,3349,4623,3343,4632,3337,4646,3337,4660,3330,4671,3329,4672,3325,4678,3321,4678,3313,4680,3300,4681,3282,4683,3278,4683,3274,4685,3273,4678,3266,4673,3263,4663,3252,4656,3243,4650,3234,4636,3228,4630,3215,4628,3203,4626,3187,4618,3172,4616,3153,4607,3134,4598,3111,4603,3089,4609,3066,4604,3044,4600,3024,4611,3005,4622,2986,4637,2980,4643,2970,4645,2965,4646,2960,4647,2956,4648,2952,4651,2943,4657,2932,4661,2923,4664,2912,4670,2910,4671,2905,4677,2897,4679,2892,4683,2885,4690,2870,4696,2866,4701,2862,4705,2859,4707,2856,4712,2851,4717,2849,4725,2847,4727,2842,4733,2839,4736,2831,4742,2816,4750,2800,4766,2799,4768,2792,4774,2782,4780,2775,4788,2770,4796,2755,4802,2735,4803,2715,4804,2696,4805,2675,4799,2665,4798,2655,4798,2648,4798,2645,4801,2641,4807,2635,4813,2632,4813,2628,4818,2627,4827,2627,4836,2626,4861,2615,4878,2607,4890,2590,4894,2592,4904,2592,4914,2583,4939,2562,4964,2564,5015,2482,5025,2499,5039,2505,5069,2428,5146,2397,5112,2367,5079,2342,5075,2332,5074,2318,5102,2311,5123,2294,5128,2277,5134,2251,5155,2197,5164,2150,5156,j,2147,5140,f,2140,5140,2132,5140,2131,5158,2135,5172,2136,5179,2135,5186,2135,5192,2137,5194,2137,5200,2140,5203,2141,5211,2148,5212,2152,5212,2156,5213,2158,5213,2157,5217,2161,5220,2161,5224,2166,5224,2166,5227,2166,5230,2166,5233,2167,5234,2167,5235,j,2122,5356,2162,5413,f,2163,5448,2132,5483,j,2164,5522,2163,5583,2224,5625,2270,5714,f,2301,5694,2357,5672,2424,5685,2494,5726,j,2653,5604,f,2681,5604,2710,5604,j,2783,5695,2856,5670,2935,5745,2953,5874,2967,5933,3040,5853,3077,5853,3093,5863,3148,5863,3169,5851,f,3182,5857,3193,5851,j,3215,5841,f,3229,5846,3235,5841,j,3252,5835,3273,5835,3294,5823,3294,5803,3301,5781,3357,5825,3362,5834,3583,5834,3654,5904,3667,5892,3708,5884,3736,5873,3746,5864,3734,5839,3721,5801,3721,5781,3735,5760,3745,5739,3733,5714,3733,5694,3808,5612,3946,5594,f,3950,5586,3958,5582,3960,5580,3960,5575,3959,5567,3961,5561,3961,5556,3962,5553,3965,5548,3965,5541,3964,5524,3967,5508,3967,5507,3968,5505,3981,5474,4012,5438,j,4012,5405,4002,5362,3950,5322,3992,5232,3822,5062,3774,5063,3762,5053,3711,5053,3708,5043,3677,5041,3714,4982,3714,4952,3700,4927,3702,4907,3652,4813,3688,4774,3584,4712,c]],label:"Wasseramt",shortLabel:"WA",labelPosition:[304.3,521.9],labelAlignment:[t,v]},"CH.SO.BB":{outlines:[[i,1789,5198,f,1779,5202,1774,5211,1768,5222,1760,5229,1746,5237,1730,5241,j,1705,5313,f,1696,5340,1711,5375,j,1756,5504,1773,5513,1953,5566,1953,5572,f,1930,5612,1894,5638,j,1892,5672,1903,5693,1895,5701,1676,5857,1453,5776,1329,5853,1321,5927,f,1343,5960,1332,5994,j,1255,5965,1175,6019,1166,6067,1121,6116,1205,6221,f,1209,6224,1211,6221,1218,6218,1221,6216,1228,6214,1236,6214,1243,6214,1251,6215,1251,6225,1250,6233,1244,6234,1243,6238,1242,6242,1241,6244,1240,6247,1239,6250,1236,6254,1236,6255,1235,6258,1234,6261,1234,6266,1237,6267,1239,6271,1241,6271,1243,6274,1244,6275,1246,6278,1248,6281,1252,6282,1253,6284,1263,6286,1273,6286,1279,6289,1282,6290,1285,6291,1285,6295,1287,6299,1289,6300,1304,6299,1302,6310,1302,6315,1301,6319,1297,6323,1293,6327,1286,6329,1285,6337,j,1205,6312,931,6402,803,6349,f,799,6349,794,6350,789,6351,786,6354,783,6359,775,6358,773,6359,769,6360,769,6365,766,6365,760,6366,756,6364,755,6364,752,6360,752,6356,745,6355,744,6340,741,6330,738,6320,737,6316,736,6313,734,6310,733,6303,732,6294,727,6293,722,6291,711,6292,701,6292,696,6292,692,6291,674,6289,671,6305,665,6305,659,6305,651,6304,646,6308,644,6310,641,6311,635,6313,628,6315,627,6315,624,6317,619,6318,611,6318,609,6320,601,6322,594,6326,586,6326,577,6325,568,6326,562,6328,559,6335,549,6335,541,6335,541,6362,541,6389,541,6419,541,6448,541,6453,541,6458,542,6461,542,6463,j,672,6696,659,6750,f,660,6750,660,6750,689,6763,722,6750,j,770,6802,899,6802,904,6800,f,1006,6769,1100,6712,1102,6712,1104,6711,1107,6712,1112,6712,1115,6717,1117,6718,1125,6720,1128,6721,1140,6722,1139,6731,1139,6736,1143,6736,1147,6735,1150,6734,1152,6730,1157,6730,1164,6729,1168,6729,1172,6729,1174,6727,1177,6725,1182,6725,1185,6722,1188,6722,1191,6717,1197,6717,1199,6716,1200,6714,1204,6711,1207,6709,1211,6705,1211,6705,1214,6704,1217,6702,1223,6700,1227,6698,1233,6697,1236,6695,1239,6693,1246,6694,1249,6694,1251,6694,j,1294,6784,1232,6889,1242,6958,f,1273,7037,1341,7114,1368,7113,1397,7113,1427,7113,1456,7113,1468,7113,1480,7113,j,1565,7031,1604,7031,1618,7044,1656,7044,1719,6881,1584,6671,1585,6597,1595,6588,1595,6559,2046,6343,2162,6213,2201,6062,2281,6007,2284,5927,2341,5903,2354,5893,2354,5873,2232,5751,f,2231,5746,2232,5742,2235,5742,2237,5741,2238,5741,2238,5740,2239,5740,2239,5740,2240,5739,2241,5737,2250,5726,2270,5714,j,2224,5625,2163,5583,2164,5522,2132,5483,f,2163,5448,2162,5413,j,2122,5356,2167,5235,f,2167,5234,2166,5233,2166,5230,2166,5227,2166,5224,2161,5224,2161,5220,2157,5217,2158,5213,2156,5213,2152,5212,2148,5212,2141,5211,2140,5203,2137,5200,2137,5194,2135,5192,2135,5186,2136,5179,2135,5172,2131,5158,2132,5140,2113,5140,2095,5140,2073,5140,2052,5138,2049,5138,2047,5136,2046,5133,2044,5129,2044,5125,2041,5125,2037,5125,2033,5124,2027,5123,2021,5122,1968,5075,1964,5030,1961,5024,1952,5023,1939,5021,1925,5021,1915,5020,1907,5016,1900,5012,1892,5009,1882,5007,1872,5017,1871,5022,1864,5027,1861,5028,1861,5034,1862,5040,1856,5049,1850,5058,1855,5072,1860,5086,1868,5117,1890,5166,1891,5172,1892,5179,1892,5188,1863,5189,1835,5189,1822,5189,1810,5190,f,1800,5191,1789,5198,c]],label:"Bucheggberg",shortLabel:"BB",labelPosition:[163.1,621.2],labelAlignment:[t,v]},"CH.SO.LB":{outlines:[[i,2350,3963,j,2185,4167,1964,4245,1946,4238,f,1892,4248,1826,4239,j,1685,4171,1549,4207,1367,4245,1265,4322,1110,4374,1105,4378,1072,4413,964,4434,845,4542,572,4651,453,4773,361,4753,f,285,4764,192,4796,j,238,4975,369,5201,450,5192,491,5183,491,5250,498,5250,566,5265,661,5362,776,5623,702,5623,652,5650,698,5732,f,707,5732,716,5732,726,5732,735,5732,745,5732,755,5732,765,5732,774,5732,777,5732,780,5732,782,5731,783,5729,790,5722,793,5722,795,5720,795,5718,795,5717,796,5716,797,5716,797,5715,798,5715,798,5714,799,5714,799,5713,801,5713,802,5711,803,5711,803,5711,804,5710,804,5710,805,5708,806,5707,809,5706,811,5704,811,5704,812,5703,813,5702,815,5703,817,5701,818,5701,820,5701,820,5701,822,5701,823,5700,824,5700,826,5700,828,5700,830,5698,832,5696,833,5695,834,5694,835,5694,838,5692,840,5692,842,5692,842,5691,843,5691,844,5690,845,5690,846,5689,847,5689,847,5688,848,5687,850,5686,851,5684,853,5684,854,5684,854,5683,855,5682,856,5682,856,5681,857,5681,861,5680,865,5679,866,5678,867,5678,874,5677,881,5678,891,5678,900,5678,905,5678,910,5678,911,5680,913,5681,914,5682,915,5683,916,5683,917,5683,j,918,5685,f,918,5685,920,5686,920,5686,921,5687,922,5687,922,5688,925,5689,926,5690,927,5691,928,5691,929,5692,929,5692,934,5693,937,5695,938,5696,939,5696,940,5697,941,5697,947,5697,954,5697,958,5697,960,5697,962,5701,966,5701,967,5701,967,5701,968,5701,970,5701,972,5701,974,5702,977,5713,980,5714,986,5705,994,5699,1002,5695,1012,5695,1024,5690,1029,5677,1042,5670,1051,5665,1054,5634,1054,5609,1054,5601,1055,5594,1057,5581,1057,5571,1058,5566,1061,5561,1066,5556,1069,5556,1080,5556,1092,5555,1109,5553,1119,5548,1128,5539,1139,5535,1152,5531,1164,5529,1174,5521,1187,5521,1191,5520,1195,5519,1198,5514,1201,5509,1203,5506,1205,5502,1206,5494,1208,5489,1208,5486,1208,5484,1209,5469,1209,5455,1209,5451,1210,5447,1212,5444,1212,5443,1218,5436,1217,5426,1217,5418,1216,5410,1216,5405,1218,5402,1218,5394,1220,5390,1221,5384,1223,5380,1225,5375,1225,5374,1226,5367,1231,5365,1236,5364,1238,5359,1245,5344,1250,5334,1253,5328,1256,5326,1263,5320,1269,5315,1274,5311,1277,5311,1290,5313,1290,5324,1294,5336,1294,5346,1294,5352,1299,5356,1313,5368,1322,5381,1324,5385,1326,5389,1328,5395,1331,5401,1336,5406,1336,5409,1339,5414,1342,5415,1352,5408,1358,5404,1366,5400,1367,5400,1372,5399,1374,5395,1379,5393,1382,5392,1388,5389,1390,5387,1398,5381,1407,5377,1411,5375,1417,5371,1426,5366,1436,5364,1439,5349,1440,5336,1441,5323,1435,5313,1431,5307,1432,5296,1432,5291,1430,5288,1428,5264,1449,5257,1457,5254,1465,5253,1472,5252,1479,5248,1486,5245,1580,5246,1644,5248,1686,5247,1710,5247,1730,5241,1746,5237,1760,5229,1768,5222,1774,5211,1779,5202,1789,5198,1800,5191,1810,5190,1822,5189,1835,5189,1863,5189,1892,5188,1892,5179,1891,5173,1890,5166,1868,5117,1860,5086,1855,5072,1850,5058,1856,5049,1862,5040,1861,5034,1861,5028,1864,5027,1871,5022,1872,5017,1882,5007,1892,5009,1900,5012,1907,5016,1915,5020,1925,5021,1939,5021,1952,5023,1961,5024,1964,5030,1968,5075,2021,5122,2027,5123,2033,5124,2037,5125,2041,5125,2044,5125,2044,5129,2046,5133,2047,5136,2049,5138,2052,5138,2073,5140,2095,5140,2113,5140,2132,5140,2140,5140,2147,5140,j,2137,5074,f,2138,5025,2154,4995,2164,4947,2180,4937,2188,4932,2193,4930,j,2194,4930,f,2207,4927,2208,4913,2209,4905,2206,4902,2206,4888,2201,4880,2199,4875,2198,4873,2198,4866,2195,4863,2192,4860,2191,4853,2175,4843,2175,4821,2175,4802,2175,4783,2214,4782,2252,4784,2256,4785,2271,4789,2285,4794,2309,4800,2333,4806,2344,4798,2355,4790,2360,4790,2385,4791,2410,4791,2423,4791,2437,4790,2445,4781,2458,4780,2464,4777,2465,4776,2472,4770,2485,4770,2499,4768,2501,4761,j,2565,4847,f,2566,4848,2567,4849,2584,4869,2590,4894,2607,4890,2615,4878,2626,4861,2627,4836,2627,4827,2628,4818,2632,4813,2635,4813,2641,4807,2645,4801,2648,4798,2655,4798,2665,4798,2675,4799,2696,4805,2715,4804,2735,4803,2755,4802,2770,4796,2775,4788,2782,4780,2792,4774,2799,4768,2800,4766,2816,4750,2831,4742,2839,4736,2842,4733,2847,4727,2849,4725,2851,4717,2856,4712,2859,4707,2862,4705,2866,4701,2870,4696,2885,4690,2892,4683,2897,4679,2905,4677,2910,4671,2912,4670,2923,4664,2932,4661,2943,4657,2952,4651,2956,4648,2960,4647,2965,4646,2970,4645,2980,4643,2986,4637,3005,4622,3025,4611,3044,4600,3067,4605,3089,4609,3112,4603,3134,4598,3153,4607,3172,4616,3187,4618,3203,4626,3215,4628,3228,4630,3234,4636,3243,4650,3252,4656,3263,4663,3266,4673,3273,4678,3274,4685,3278,4683,3282,4683,3300,4681,3313,4680,3321,4678,3325,4678,3329,4672,3330,4671,3337,4660,3337,4646,3343,4632,3349,4623,3351,4620,3353,4616,3354,4612,3357,4608,3359,4598,3363,4592,j,3358,4583,f,3235,4422,3093,4334,3092,4333,3092,4333,j,3114,4166,3066,4017,f,2966,3939,2921,3857,j,2861,3892,2658,3914,2513,3914,2445,3949,c]],label:"Lebern",shortLabel:"LB",labelPosition:[165.7,471.5],labelAlignment:[t,v]},"CH.SO.TH":{outlines:[[i,4216,2290,j,3630,2385,f,3627,2385,3626,2385,3624,2384,3622,2384,3622,2384,3622,2383,3622,2382,3622,2381,3622,2382,3621,2383,3607,2432,3605,2519,j,3544,2523,3544,2585,3248,2707,3098,2826,2947,2839,2805,2957,2804,2958,2801,2960,2800,2961,f,2800,2988,2801,3013,j,2737,3101,2708,3100,2674,3089,f,2597,3132,2547,3191,j,2541,3201,f,2541,3229,2542,3258,2542,3264,2540,3268,2540,3269,2536,3272,2530,3272,2528,3277,2530,3278,2530,3282,2530,3311,2531,3339,2526,3342,2526,3348,2524,3351,2521,3353,2520,3363,2519,3371,2519,3374,2519,3376,j,2457,3438,f,2451,3438,2451,3445,2451,3463,2451,3481,2451,3484,2452,3487,2452,3491,2451,3492,2449,3493,2445,3498,2441,3503,2444,3506,2436,3509,2433,3515,2433,3515,2429,3516,2418,3520,2406,3523,2404,3525,2400,3525,2399,3525,2396,3528,2394,3530,2392,3532,2391,3534,2388,3536,2387,3539,2385,3540,2383,3541,2381,3544,2354,3545,2327,3545,2298,3545,2269,3545,2242,3545,2215,3545,2213,3545,2211,3545,2090,3609,1961,3648,j,1884,3719,f,1856,3728,1829,3722,j,1716,3846,1627,4029,f,1616,4027,1601,4028,1595,4030,1592,4032,1589,4034,1586,4036,1585,4037,1581,4039,1574,4040,1567,4040,1559,4040,1552,4040,1546,4041,1539,4041,1524,4041,1506,4042,1482,4042,1458,4042,1429,4042,1399,4043,1393,4043,1387,4047,1383,4048,1376,4051,1373,4052,1368,4054,1362,4056,1353,4056,1338,4056,1319,4057,1315,4057,1311,4057,j,1170,4177,f,1168,4174,1165,4177,1162,4179,1157,4181,1153,4183,1149,4183,1136,4186,1123,4192,1121,4193,1119,4193,1116,4194,1111,4196,1105,4197,1101,4203,1098,4204,1096,4204,1092,4205,1084,4205,1079,4205,1074,4208,1071,4209,1068,4209,1066,4210,1062,4211,1061,4238,1061,4265,1061,4293,1061,4322,j,1105,4378,1110,4374,1265,4322,1367,4245,1549,4207,1685,4171,1826,4239,f,1892,4248,1946,4238,j,1964,4245,2185,4167,2350,3963,2445,3949,2513,3914,2658,3914,2861,3892,2925,3854,3292,3764,3459,3764,3467,3758,f,3467,3750,3476,3752,3480,3752,3484,3752,3512,3752,3541,3752,3571,3752,3600,3752,3619,3752,3638,3752,3643,3751,3645,3749,3646,3744,3649,3743,3682,3742,3711,3742,3717,3742,3722,3743,j,3825,3668,3834,3673,f,3864,3673,3893,3673,3901,3673,3909,3672,3916,3667,3920,3664,3924,3662,3928,3662,3936,3662,3944,3661,3947,3659,3950,3656,3960,3656,3968,3655,3975,3654,3980,3653,3986,3651,3987,3649,3989,3647,3992,3645,4002,3644,4008,3644,j,4084,3573,f,4089,3572,4102,3572,4102,3572,4103,3573,j,4247,3572,4247,3493,4318,3493,4420,3422,4407,3328,4525,3378,4738,3211,4738,3138,4786,3124,4801,3045,5062,3013,f,5179,2964,5262,2897,5262,2888,5261,2878,5260,2862,5261,2845,5261,2842,5262,2838,j,5216,2810,5061,2810,5010,2763,4863,2763,4672,2558,4579,2344,4252,2289,c]],label:"Thal",shortLabel:"TH",labelPosition:[388.2,299.9],labelAlignment:[t,v]},"CH.SO.TS":{outlines:[[i,1010,1172,f,916,1187,901,1214,901,1229,901,1243,901,1248,901,1253,902,1260,896,1263,875,1263,854,1263,844,1263,834,1263,828,1262,826,1264,750,1316,674,1315,622,1450,593,1580,j,672,1645,692,1623,825,1623,892,1672,987,1672,1018,1662,1106,1661,1172,1603,1287,1643,1418,1607,1419,1607,f,1419,1606,1419,1605,1443,1486,1513,1383,j,1513,1382,1452,1333,1452,1308,1414,1246,f,1359,1207,1316,1122,j,1299,1096,1155,1134,1106,1100,c],[i,3498,1681,f,3315,1568,3159,1629,j,3153,1576,3339,1431,3304,1296,3301,1300,f,3296,1300,3290,1300,3281,1301,3275,1304,3270,1307,3268,1306,3267,1305,3266,1308,3264,1312,3261,1315,3259,1318,3254,1317,3246,1317,3238,1313,3232,1312,3228,1314,3226,1316,3223,1317,3218,1318,3213,1321,3198,1322,3184,1321,3179,1321,3177,1324,3175,1328,3173,1329,3172,1330,3168,1332,3154,1333,3141,1333,3137,1333,3134,1332,3118,1330,3104,1336,3101,1338,3098,1335,3094,1332,3089,1323,3061,1322,3034,1321,3026,1321,3019,1322,j,2956,1380,f,2936,1380,2915,1380,2914,1368,2913,1354,2911,1352,2907,1349,2904,1347,2903,1339,2901,1334,2904,1325,j,2833,1244,f,2811,1244,2789,1244,2785,1244,2781,1244,2775,1243,2776,1248,2777,1252,2772,1257,2771,1275,2771,1294,2771,1323,2771,1354,2771,1355,2771,1355,2768,1356,2769,1362,2769,1363,2767,1367,2767,1370,2765,1372,2762,1374,2762,1377,2762,1389,2762,1402,2762,1431,2761,1460,2761,1468,2764,1470,j,2808,1533,f,2835,1535,2865,1536,2869,1536,2869,1534,j,2903,1601,2897,1604,f,2876,1604,2854,1604,2824,1604,2795,1604,j,2782,1613,2646,1613,2608,1603,2542,1604,2514,1594,2496,1603,2476,1603,2457,1613,2435,1613,2413,1622,2396,1622,2375,1632,2356,1632,2336,1641,2313,1641,2299,1652,2305,1672,2360,1754,2222,2008,f,2220,2008,2219,2010,2219,2011,2219,2013,j,2118,2013,2111,2023,2084,2041,2024,2104,f,1974,2072,1960,2072,1946,2073,1935,2073,1925,2073,1915,2074,1905,2074,1895,2074,1886,2073,1876,2073,1867,2072,1862,2073,1856,2075,1855,2075,1855,2076,1853,2076,1852,2076,1852,2075,1852,2070,1851,2064,1851,2063,1849,2062,1849,2062,1848,2061,1847,2060,1844,2058,1844,2058,1843,2057,1842,2057,1842,2056,1841,2055,1841,2055,1840,2053,1839,2053,1839,2053,1837,2051,1836,2051,1835,2050,1835,2049,1834,2048,1833,2046,1833,2045,1832,2044,1832,2042,1830,2042,1829,2039,1828,2039,1828,2035,1827,2032,1827,2027,1826,2027,1825,2026,1824,2025,1823,2023,1823,2023,1822,2022,1821,2022,1821,2021,1820,2020,1820,2020,1819,2019,1818,2018,1818,2017,1817,2016,1815,2015,1813,2015,1813,2014,1812,2013,1811,2012,1810,2010,1809,2009,1808,2008,1807,2007,1806,2006,1806,2005,1805,2004,1802,2004,1800,2004,1795,2004,1790,2004,1787,2003,1783,2003,1779,2003,1773,2004,1773,2004,1772,2005,1771,2005,1770,2005,1770,2002,1768,2001,1767,2001,1766,2000,1765,1999,1763,1998,1761,1998,1761,1996,1761,1991,1761,1986,1761,1959,1761,1929,1758,1923,1759,1912,1762,1908,1767,1903,1762,1904,1754,1901,1751,1900,1752,1894,1752,1865,1753,1834,j,1644,1824,1584,1804,1575,1841,f,1517,1839,1496,1791,j,1425,1791,1440,1855,1351,1829,f,1352,1855,1352,1880,1352,1910,1352,1939,1352,1968,1352,1997,1352,2008,1353,2019,1353,2020,1353,2020,j,1284,2169,1304,2200,1341,2171,1480,2292,1574,2325,1660,2325,1671,2311,1790,2315,1850,2334,1916,2325,2041,2294,2274,2294,2284,2324,2241,2395,2371,2464,2382,2493,2462,2493,2462,2572,2410,2659,2430,2695,2470,2688,2489,2679,2641,2781,2642,2785,f,2643,2785,2645,2785,2658,2785,2670,2785,2680,2785,2693,2784,2694,2784,2695,2784,j,2801,2953,f,2798,2966,2805,2957,j,2947,2839,3098,2826,3248,2707,3544,2585,3544,2523,3605,2519,f,3607,2432,3621,2382,3622,2382,3622,2381,3622,2377,3622,2373,3622,2365,3622,2357,3622,2327,3622,2298,3622,2294,3622,2291,3624,2283,3616,2284,3615,2281,3615,2277,3615,2269,3613,2265,j,3613,2194,3604,2194,3604,2155,3533,2155,3505,2106,3566,2066,3507,1681,c]],label:"Thierstein",shortLabel:"TS",labelPosition:[290.9,218.6],labelAlignment:[t,v]},"CH.SO.DE":{outlines:[[i,1269,265,f,1263,267,1256,267,1253,271,1246,271,j,1234,278,1111,523,1206,504,1382,605,1417,654,1449,633,1499,654,1494,669,1373,834,1490,1043,1491,1043,1906,894,1959,880,1992,883,1992,883,2021,895,2135,892,2187,853,f,2213,854,2242,854,2272,854,2301,854,2319,854,2337,854,2339,850,2340,849,2342,845,2349,846,2354,845,2359,845,j,2312,720,2312,667,2324,642,2324,592,2335,570,2362,584,2384,584,2384,583,2420,474,2411,463,2411,371,2372,371,2372,264,2205,264,2113,176,2113,273,2112,273,f,2068,301,2021,306,j,2051,354,2012,394,f,1999,394,1986,394,1959,394,1932,394,j,1932,451,1870,515,1869,517,1765,544,1652,508,1579,395,1497,403,1389,325,1357,311,1335,311,1272,265,f,1271,265,1269,265,c],[i,3949,463,j,3872,366,3887,275,3848,275,3801,284,3737,264,3688,359,f,3689,365,3688,372,j,3749,372,f,3748,374,3749,378,3748,380,3748,384,3745,386,3746,392,3747,394,3742,395,3741,397,3739,397,3734,399,3733,403,3732,405,3730,408,3727,414,3721,415,3717,416,3718,422,3719,425,3724,430,3727,431,3733,433,3734,434,3739,435,3739,439,3741,442,j,3571,505,3224,397,f,3220,401,3219,403,3219,406,3218,409,3217,429,3217,453,3214,458,3214,466,3214,472,3213,479,3213,487,3216,493,3219,499,3216,509,3213,513,3209,518,3208,520,3205,521,3200,527,3201,537,3202,551,3202,566,3202,571,3203,577,3204,587,3199,594,3198,595,3197,599,3195,602,3194,604,3192,606,3192,609,3191,624,3190,639,3190,650,3189,663,3185,671,3186,681,3187,689,3185,695,j,3328,736,3421,845,3303,1106,f,3303,1133,3303,1159,3303,1189,3303,1218,3303,1247,3303,1277,3303,1286,3303,1294,j,3305,1301,3339,1432,3153,1576,3159,1629,f,3315,1568,3498,1682,j,3865,1689,4048,1539,4124,1277,f,4092,1258,4077,1211,j,4093,1080,4179,974,4250,953,4264,938,4245,866,4370,711,4233,514,4113,511,c]],label:"Dorneck",shortLabel:"DE",labelPosition:[375.1,101.3],labelAlignment:[t,v]}}}];g=d.length;if(r){while(g--){e=d[g];n(e.name.toLowerCase(),e,n.geo)}}else{while(g--){e=d[g];u=e.name.toLowerCase();a(s,u,1);h[s].unshift({cmd:"_call",obj:window,args:[function(w,x){if(!n.geo){p.raiseError(p.core,"12052314141","run","JavaScriptRenderer~Maps._call()",new Error("FusionCharts.HC.Maps.js is required in order to define vizualization"));return}n(w,x,n.geo)},[u,e],window]})}}}]);