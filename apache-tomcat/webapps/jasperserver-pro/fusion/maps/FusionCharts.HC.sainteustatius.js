/*!
 * @license FusionCharts JavaScript Library
 * Copyright FusionCharts Technologies LLP
 * License Information at <http://www.fusioncharts.com/license>
 *
 * @author FusionCharts Technologies LLP
 * @version fusioncharts/3.2.4-sr1.10100
 * @id fusionmaps.SaintEustatius.20.10-30-2012 08:25:26
 */
FusionCharts(["private","modules.renderer.highcharts-sainteustatius",function(){var p=this,k=p.hcLib,n=k.chartAPI,h=k.moduleCmdQueue,a=k.injectModuleDependency,i="M",j="L",c="Z",f="Q",b="left",q="right",t="center",v="middle",o="top",m="bottom",s="maps",l=false&&!/fusioncharts\.com$/i.test(location.hostname),r=!!n.geo,d,e,u,g;d=[{name:"SaintEustatius",revision:20,creditLabel:l,standaloneInit:true,baseWidth:470,baseHeight:490,baseScaleFactor:10,entities:{"CA.ES":{outlines:[[i,2175,1854,f,2163,1835,2132,1814,2106,1796,2100,1774,2096,1761,2060,1744,2042,1725,2000,1704,1977,1702,1967,1676,1961,1662,1953,1634,1947,1623,1924,1592,1905,1563,1905,1552,1905,1539,1920,1527,1939,1512,1943,1507,1953,1490,1993,1489,1993,1489,1994,1488,2026,1453,2023,1399,2021,1374,2031,1354,2043,1333,2046,1323,j,2045,1324,f,2046,1323,2047,1321,2055,1309,2089,1262,2125,1212,2125,1204,2125,1194,2120,1185,2116,1176,2115,1154,j,2085,1154,2085,1022,f,2088,1019,2090,1012,j,2090,982,f,2078,981,1990,1001,1989,1001,1987,1001,1952,995,1937,967,1927,948,1924,907,1921,863,1916,850,1906,824,1877,824,1859,824,1850,838,1840,853,1823,857,1805,860,1790,878,1776,894,1770,894,j,1729,879,f,1722,879,1704,897,1687,914,1682,914,1675,914,1652,899,1629,884,1623,884,1612,884,1600,902,1589,919,1560,917,1533,914,1480,917,1455,916,1393,924,1386,924,1355,937,1324,949,1300,949,1255,949,1255,879,1255,861,1259,856,1260,854,1283,837,1321,757,1323,752,j,1323,737,f,1315,737,1302,734,1293,734,1269,747,1243,762,1230,764,j,1228,764,f,1205,755,1205,734,1205,730,1230,632,j,1230,612,1220,612,f,1220,609,1219,607,1209,582,1187,582,1163,582,1128,584,1105,581,1105,548,1105,522,1170,456,1235,389,1235,383,1235,357,1159,359,1083,361,1083,334,1083,319,1097,271,1110,223,1110,202,1110,189,1085,167,1060,144,1043,144,1042,144,972,157,969,157,943,138,918,119,907,119,894,119,888,138,881,157,854,157,830,157,801,122,773,87,732,87,660,87,633,109,610,140,593,157,564,182,551,195,527,219,523,234,520,306,500,339,495,349,469,379,449,402,439,417,437,421,435,424,420,455,420,484,428,600,428,617,j,425,617,f,412,657,400,682,380,717,374,729,365,746,365,774,365,833,393,883,420,933,420,988,420,1009,373,1070,350,1101,325,1129,336,1175,309,1208,293,1229,241,1278,179,1329,103,1360,79,1375,69,1397,58,1422,58,1472,58,1522,97,1566,135,1611,135,1620,135,1634,125,1658,115,1683,115,1710,115,1753,134,1772,179,1821,183,1827,j,183,1829,f,194,1849,212,1871,237,1899,242,1905,273,1948,273,2024,240,2196,240,2197,240,2218,254,2250,268,2282,268,2312,268,2334,264,2346,260,2358,260,2371,260,2388,266,2399,277,2421,282,2436,j,285,2437,f,313,2474,310,2502,309,2513,318,2538,327,2562,328,2567,327,2617,330,2639,332,2650,352,2664,385,2687,395,2697,428,2727,496,2818,556,2897,605,2934,694,2946,714,2962,736,2996,788,3032,806,3044,843,3062,886,3084,915,3102,952,3124,978,3159,1001,3190,1003,3214,1006,3255,1040,3283,1082,3316,1090,3328,1107,3333,1120,3337,1174,3352,1185,3382,1187,3385,1187,3413,1187,3437,1195,3449,1233,3498,1233,3517,1233,3532,1228,3551,1223,3570,1223,3587,1223,3640,1208,3669,1208,3682,1210,3707,1210,3729,1205,3742,1201,3753,1180,3762,1168,3767,1143,3777,1138,3777,1131,3777,1124,3777,1119,3777,1114,3777,1111,3779,1108,3781,1102,3782,1097,3784,1097,3788,1098,3792,1098,3794,j,1173,3794,f,1175,3784,1193,3784,1212,3784,1239,3796,1264,3807,1265,3812,1270,3824,1276,3855,1281,3877,1297,3913,1311,3945,1360,4046,1361,4049,1362,4052,1363,4066,1377,4087,1392,4109,1411,4118,1414,4120,1418,4121,1430,4139,1439,4162,1440,4162,1458,4214,1468,4243,1478,4257,1488,4271,1525,4271,1563,4271,1575,4284,1602,4312,1638,4367,1647,4379,1665,4408,1684,4434,1708,4447,1730,4459,1823,4459,1850,4459,1898,4512,1926,4541,1980,4604,2022,4646,2062,4651,2066,4652,2068,4652,2070,4652,2072,4653,2125,4673,2195,4669,2229,4666,2276,4677,2316,4687,2353,4704,2381,4718,2431,4736,2467,4749,2480,4759,2516,4759,2639,4777,2657,4777,2674,4768,2691,4759,2706,4759,2759,4759,2825,4834,2845,4819,2869,4804,2918,4774,2943,4774,2952,4774,2998,4797,3045,4819,3108,4819,3136,4819,3181,4769,3229,4716,3265,4709,3273,4708,3319,4709,3355,4710,3373,4699,3381,4694,3399,4668,3412,4649,3438,4649,3460,4649,3492,4662,3525,4674,3534,4674,3535,4674,3538,4672,3538,4668,3543,4662,3554,4653,3583,4639,3655,4606,3655,4627,j,3655,4628,f,3726,4640,3752,4664,3766,4677,3768,4678,3779,4684,3800,4684,3833,4684,3853,4673,3857,4671,3880,4650,3915,4620,4005,4629,4045,4634,4057,4619,4067,4597,4083,4584,j,4130,4549,f,4136,4545,4148,4517,j,4150,4517,f,4159,4515,4177,4505,4192,4498,4200,4504,j,4223,4504,f,4226,4468,4250,4435,4260,4422,4299,4382,4331,4351,4342,4327,4359,4292,4350,4249,4342,4211,4383,4179,4393,4172,4408,4152,4409,4151,4424,4150,4436,4148,4443,4139,4447,4134,4448,4106,4450,4077,4461,4064,4477,4046,4505,4007,4492,3953,4529,3900,4549,3871,4583,3832,4585,3828,4587,3787,4588,3757,4613,3749,4641,3741,4668,3687,4634,3674,4634,3651,4624,3644,4621,3622,4620,3596,4618,3589,4596,3541,4596,3534,4596,3520,4603,3498,4610,3475,4611,3462,4621,3419,4621,3369,4621,3333,4616,3326,4603,3306,4548,3317,4530,3320,4519,3296,4502,3258,4501,3257,4496,3251,4488,3214,4480,3178,4458,3152,4457,3150,4436,3134,4420,3123,4411,3102,4409,3097,4396,3087,4382,3077,4374,3077,4347,3082,4340,3082,4318,3082,4312,3069,4307,3051,4298,3039,4277,3012,4266,3004,4234,2984,4218,2971,4217,2970,4215,2969,4090,2965,4000,2957,3961,2953,3933,2908,3903,2862,3910,2807,3918,2746,3852,2740,3816,2739,3800,2737,3773,2734,3765,2719,3758,2706,3731,2681,3701,2654,3698,2649,3664,2602,3650,2586,3649,2586,3647,2586,3639,2585,3628,2586,3626,2587,3625,2587,3610,2587,3591,2591,3575,2595,3549,2594,3489,2620,3458,2564,3428,2520,3423,2504,3404,2445,3405,2412,3406,2388,3365,2357,3355,2349,3315,2349,3311,2329,3289,2310,3263,2287,3255,2274,3219,2213,3178,2219,3124,2228,3089,2197,3072,2179,3063,2172,3046,2159,3028,2157,j,3005,2157,f,3004,2156,3003,2156,2987,2148,2954,2140,2918,2132,2898,2132,2839,2132,2807,2173,2789,2195,2780,2201,2762,2214,2734,2214,2688,2214,2654,2179,2599,2122,2555,2097,2553,2096,2515,2074,2504,2066,2495,2047,2452,2004,2430,1994,2428,1993,2426,1992,2371,1967,2345,1965,2307,1967,2255,1962,2224,1958,2207,1923,2198,1904,2180,1864,f,2178,1859,2175,1854,c]],label:"Saint Eustatius",shortLabel:"ES",labelPosition:[216.3,286],labelAlignment:[t,v]}}}];g=d.length;if(r){while(g--){e=d[g];n(e.name.toLowerCase(),e,n.geo)}}else{while(g--){e=d[g];u=e.name.toLowerCase();a(s,u,1);h[s].unshift({cmd:"_call",obj:window,args:[function(w,x){if(!n.geo){p.raiseError(p.core,"12052314141","run","JavaScriptRenderer~Maps._call()",new Error("FusionCharts.HC.Maps.js is required in order to define vizualization"));return}n(w,x,n.geo)},[u,e],window]})}}}]);