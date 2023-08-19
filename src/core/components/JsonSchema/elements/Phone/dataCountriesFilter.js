/*
 * Country model:
 * [
 *    Country name,
 *    Regions,
 *    iso2 code,
 *    International dial code,
 *    Format (if available),
 *    Order (if >1 country with same dial code),
 *    Area codes (if >1 country with same dial code)
 *    max length of number
 * ]
 *
 * Regions:
 * ['america', 'europe', 'asia', 'oceania', 'africa']
 *
 * Sub-regions:
 * ['north-america', 'south-america', 'central-america', 'carribean',
 *  'european-union', 'ex-ussr', 'middle-east', 'north-africa']
 */

const rawAllCountries = [
  ['Afghanistan', ['asia'], 'af', '93', '', '', '', 11],
  ['Albania', ['europe'], 'al', '355', '', '', '', 12],
  ['Algeria', ['africa', 'north-africa'], 'dz', '213', '', '', '', 12],
  ['American Samoa', ['oceania'], 'as', '1684', '', '', '', 9],
  ['Andorra', ['europe'], 'ad', '376', '', '', '', 9],
  ['Angola', ['africa'], 'ao', '244', '', '', '', 12],
  ['Anguilla', ['america', 'carribean'], 'ai', '1264', '', '', '', 11],
  [
    'Antigua and Barbuda',
    ['america', 'carribean'],
    'ag',
    '1268',
    '',
    '',
    '',
    11,
  ],
  [
    'Argentina',
    ['america', 'south-america'],
    'ar',
    '54',
    '+.. (..) ........',
    '',
    '',
    13,
  ],
  ['Armenia', ['asia', 'ex-ussr'], 'am', '374', '', '', '', 11],
  ['Aruba', ['america', 'carribean'], 'aw', '297', '', '', '', 10],
  ['Australia', ['oceania'], 'au', '61', '+.. ... ... ...', '', '', 11],
  ['Austria', ['europe', 'european-union'], 'at', '43', '', '', '', 12],
  ['Azerbaijan', ['asia', 'ex-ussr'], 'az', '994', '', '', '', 12],
  ['Bahamas', ['america', 'carribean'], 'bs', '1242', '', '', '', 11],
  ['Bahrain', ['middle-east'], 'bh', '973', '', '', '', 11],
  ['Bangladesh', ['asia'], 'bd', '880', '', '', '', 13],
  ['Barbados', ['america', 'carribean'], 'bb', '1246', '', '', '', 11],
  [
    'Belarus',
    ['europe', 'ex-ussr'],
    'by',
    '375',
    '+... (..) ... .. ..',
    '',
    '',
    12,
  ],
  [
    'Belgium',
    ['europe', 'european-union'],
    'be',
    '32',
    '+.. ... .. .. ..',
    '',
    '',
    11,
  ],
  ['Belize', ['america', 'central-america'], 'bz', '501', '', '', '', 10],
  ['Benin', ['africa'], 'bj', '229', '', '', '', 11],
  ['Bermuda', ['america', 'north-america'], 'bm', '1441', '', '', '', 11],
  ['Bhutan', ['asia'], 'bt', '975', '', '', '', 11],
  ['Bolivia', ['america', 'south-america'], 'bo', '591', '', '', '', 11],
  ['Bosnia and Herzegovina', ['europe'], 'ba', '387', '', '', '', 11],
  ['Botswana', ['africa'], 'bw', '267', '', '', '', 11],
  [
    'Brazil',
    ['america', 'south-america'],
    'br',
    '55',
    '+.. (..) .........',
    '',
    '',
    12,
  ],
  ['British Indian Ocean Territory', ['asia'], 'io', '246', '', '', '', 11],
  [
    'British Virgin Islands',
    ['america', 'carribean'],
    'vg',
    '1284',
    '',
    '',
    '',
    11,
  ],
  ['Brunei', ['asia'], 'bn', '673', '', '', '', 10],
  ['Bulgaria', ['europe', 'european-union'], 'bg', '359', '', '', '', 12],
  ['Burkina Faso', ['africa'], 'bf', '226', '', '', '', 11],
  ['Burundi', ['africa'], 'bi', '257', '', '', '', 11],
  ['Cambodia', ['asia'], 'kh', '855', '', '', '', 11],
  ['Cameroon', ['africa'], 'cm', '237', '', '', '', 11],
  [
    'Canada',
    ['america', 'north-america'],
    'ca',
    '1',
    '+. (...) ...-....',
    1,
    [
      '204',
      '236',
      '249',
      '250',
      '289',
      '306',
      '343',
      '365',
      '387',
      '403',
      '416',
      '418',
      '431',
      '437',
      '438',
      '450',
      '506',
      '514',
      '519',
      '548',
      '579',
      '581',
      '587',
      '604',
      '613',
      '639',
      '647',
      '672',
      '705',
      '709',
      '742',
      '778',
      '780',
      '782',
      '807',
      '819',
      '825',
      '867',
      '873',
      '902',
      '905',
    ],
    11,
  ],
  ['Cape Verde', ['africa'], 'cv', '238', '', '', '', 10],
  [
    'Caribbean Netherlands',
    ['america', 'carribean'],
    'bq',
    '599',
    '',
    1,
    '',
    11,
  ],
  ['Cayman Islands', ['america', 'carribean'], 'ky', '1345', '', '', '', 11],
  ['Central African Republic', ['africa'], 'cf', '236', '', '', '', 11],
  ['Chad', ['africa'], 'td', '235', '', '', '', 11],
  ['Chile', ['america', 'south-america'], 'cl', '56', '', '', '', 11],
  ['China', ['asia'], 'cn', '86', '+.. ..-.........', '', '', 13],
  ['Colombia', ['america', 'south-america'], 'co', '57', '', '', '', 12],
  ['Comoros', ['africa'], 'km', '269', '', '', '', 10],
  ['Congo', ['africa'], 'cd', '243', '', '', '', 12],
  ['Congo', ['africa'], 'cg', '242', '', '', '', 12],
  ['Cook Islands', ['oceania'], 'ck', '682', '', '', '', 8],
  [
    'Costa Rica',
    ['america', 'central-america'],
    'cr',
    '506',
    '+... ....-....',
    '',
    '',
    11,
  ],
  ['Côte d’Ivoire', ['africa'], 'ci', '225', '', '', '', 11],
  ['Croatia', ['europe', 'european-union'], 'hr', '385', '', '', '', 11],
  ['Cuba', ['america', 'carribean'], 'cu', '53', '', '', '', 10],
  ['Curaçao', ['america', 'carribean'], 'cw', '599', '', 0, '', 11],
  [
    'Cyprus',
    ['europe', 'european-union'],
    'cy',
    '357',
    '+... .. ......',
    '',
    '',
    11,
  ],
  ['Czech Republic', ['europe', 'european-union'], 'cz', '420', '', '', '', 12],
  [
    'Denmark',
    ['europe', 'european-union'],
    'dk',
    '45',
    '+.. .. .. .. ..',
    '',
    '',
    10,
  ],
  ['Djibouti', ['africa'], 'dj', '253'],
  ['Dominica', ['america', 'carribean'], 'dm', '1767', '', '', '', 11],
  [
    'Dominican Republic',
    ['america', 'carribean'],
    'do',
    '1',
    '',
    2,
    ['809', '829', '849'],
    11,
  ],
  ['Ecuador', ['america', 'south-america'], 'ec', '593', '', '', '', 12],
  ['Egypt', ['africa', 'north-africa'], 'eg', '20', '', '', '', 12],
  [
    'El Salvador',
    ['america', 'central-america'],
    'sv',
    '503',
    '+... ....-....',
    '',
    '',
    11,
  ],
  ['Equatorial Guinea', ['africa'], 'gq', '240', '', '', '', 12],
  [
    'Eritrea',
    ['africa'],
    'er',
    '291',
    '',
    '',
    '',
    11, // ????
  ],
  [
    'Estonia',
    ['europe', 'european-union', 'ex-ussr'],
    'ee',
    '372',
    '+... .... ......',
    '',
    '',
    11,
  ],
  ['Ethiopia', ['africa'], 'et', '251', '', '', '', 12],
  [
    'Falkland Islands',
    ['america', 'south-america'],
    'fk',
    '500',
    '',
    '',
    '',
    12, // ???
  ],
  ['Faroe Islands', ['europe'], 'fo', '298', '', '', '', 9],
  ['Fiji', ['oceania'], 'fj', '679', '', '', '', 10],
  [
    'Finland',
    ['europe', 'european-union'],
    'fi',
    '358',
    '+... .. ... .. ..',
    '',
    '',
    12,
  ],
  [
    'France',
    ['europe', 'european-union'],
    'fr',
    '33',
    '+.. . .. .. .. ..',
    '',
    '',
    11,
  ],
  ['French Guiana', ['america', 'south-america'], 'gf', '594', '', '', '', 12],
  ['French Polynesia', ['oceania'], 'pf', '689', '', '', '', 9],
  ['Gabon', ['africa'], 'ga', '241', '', '', '', 11],
  ['Gambia', ['africa'], 'gm', '220', '', '', '', 10],
  ['Georgia', ['asia', 'ex-ussr'], 'ge', '995', '', '', '', 12],
  [
    'Germany',
    ['europe', 'european-union'],
    'de',
    '49',
    '+.. .... ........',
    '',
    '',
    12,
  ],
  ['Ghana', ['africa'], 'gh', '233', '', '', '', 12],
  ['Gibraltar', ['europe'], 'gi', '350', '', '', '', 11],
  ['Greece', ['europe', 'european-union'], 'gr', '30', '', '', '', 12],
  ['Greenland', ['america'], 'gl', '299', '', '', '', 9],
  ['Grenada', ['america', 'carribean'], 'gd', '1473', '', '', '', 11],
  ['Guadeloupe', ['america', 'carribean'], 'gp', '590', '', 0, '', 12],
  ['Guam', ['oceania'], 'gu', '1671', '', '', '', 11],
  [
    'Guatemala',
    ['america', 'central-america'],
    'gt',
    '502',
    '+... ....-....',
    '',
    '',
    11,
  ],
  ['Guinea', ['africa'], 'gn', '224', '', '', '', 11],
  ['Guinea-Bissau', ['africa'], 'gw', '245', '', '', '', 10],
  [
    'Guyana',
    ['america', 'south-america'],
    'gy',
    '592',
    '',
    '',
    '',
    11, // ???
  ],
  [
    'Haiti',
    ['america', 'carribean'],
    'ht',
    '509',
    '+... ....-....',
    '',
    '',
    11,
  ],
  ['Honduras', ['america', 'central-america'], 'hn', '504', '', '', '', 11],
  ['Hong Kong', ['asia'], 'hk', '852', '+... .... ....', '', '', 11],
  ['Hungary', ['europe', 'european-union'], 'hu', '36', '', '', '', 11],
  ['Iceland', ['europe'], 'is', '354', '+... ... ....', '', '', 10],
  ['India', ['asia'], 'in', '91', '+.. .....-.....', '', '', 12],
  ['Indonesia', ['asia'], 'id', '62', '', '', '', 11],
  ['Iran', ['middle-east'], 'ir', '98', '', '', '', 12],
  ['Iraq', ['middle-east'], 'iq', '964', '', '', '', 13],
  [
    'Ireland',
    ['europe', 'european-union'],
    'ie',
    '353',
    '+... .. .......',
    '',
    '',
    12,
  ],
  ['Israel', ['middle-east'], 'il', '972', '+... ... ... ....', '', '', 12],
  [
    'Italy',
    ['europe', 'european-union'],
    'it',
    '39',
    '+.. ... .......',
    0,
    '',
    12,
  ],
  ['Jamaica', ['america', 'carribean'], 'jm', '1876', '', '', '', 11],
  ['Japan', ['asia'], 'jp', '81', '+.. .. .... ....', '', '', 12],
  ['Jordan', ['middle-east'], 'jo', '962', '', '', '', 12],
  [
    'Kazakhstan',
    ['asia', 'ex-ussr'],
    'kz',
    '7',
    '+. ... ...-..-..',
    1,
    [
      '313',
      '327',
      '7172',
      '312',
      '73622',
      '321',
      '324',
      '336',
      '318',
      '315',
      '325',
      '311',
      '326',
      '310',
    ],
    11,
  ],
  ['Kenya', ['africa'], 'ke', '254', '', '', '', 12],
  [
    'Kiribati',
    ['oceania'],
    'ki',
    '686',
    '',
    '',
    '',
    11, // ???
  ],
  ['Kuwait', ['middle-east'], 'kw', '965', '', '', '', 11],
  ['Kyrgyzstan', ['asia', 'ex-ussr'], 'kg', '996', '', '', '', 12],
  [
    'Laos',
    ['asia'],
    'la',
    '856',
    '',
    '',
    '',
    11, // ???
  ],
  [
    'Latvia',
    ['europe', 'european-union', 'ex-ussr'],
    'lv',
    '371',
    '',
    '',
    '',
    11,
  ],
  ['Lebanon', ['middle-east'], 'lb', '961', '', '', '', 11],
  ['Lesotho', ['africa'], 'ls', '266', '', '', '', 11],
  ['Liberia', ['africa'], 'lr', '231', '', '', '', 10],
  ['Libya', ['africa', 'north-africa'], 'ly', '218', '', '', '', 12],
  ['Liechtenstein', ['europe'], 'li', '423', '', '', '', 12],
  [
    'Lithuania',
    ['europe', 'european-union', 'ex-ussr'],
    'lt',
    '370',
    '',
    '',
    '',
    11,
  ],
  ['Luxembourg', ['europe', 'european-union'], 'lu', '352', '', '', '', 12],
  ['Macau', ['asia'], 'mo', '853', '', '', '', 11],
  ['Macedonia', ['europe'], 'mk', '389', '', '', '', 11],
  ['Madagascar', ['africa'], 'mg', '261', '', '', '', 12],
  ['Malawi', ['africa'], 'mw', '265', '', '', '', 12],
  ['Malaysia', ['asia'], 'my', '60', '+.. ..-....-....', '', '', 11],
  ['Maldives', ['asia'], 'mv', '960', '', '', '', 10],
  ['Mali', ['africa'], 'ml', '223', '', '', '', 11],
  ['Malta', ['europe', 'european-union'], 'mt', '356', '', '', '', 11],
  [
    'Marshall Islands',
    ['oceania'],
    'mh',
    '692',
    '',
    '',
    '',
    11, // ???
  ],
  ['Martinique', ['america', 'carribean'], 'mq', '596', '', '', '', 12],
  ['Mauritania', ['africa'], 'mr', '222', '', '', '', 11],
  ['Mauritius', ['africa'], 'mu', '230', '', '', '', 10],
  ['Mexico', ['america', 'central-america'], 'mx', '52', '', '', '', 13],
  [
    'Micronesia',
    ['oceania'],
    'fm',
    '691',
    '',
    '',
    '',
    11, // ???
  ],
  ['Moldova', ['europe'], 'md', '373', '+... (..) ..-..-..', '', '', 11],
  ['Monaco', ['europe'], 'mc', '377', '', '', '', 12],
  ['Mongolia', ['asia'], 'mn', '976', '', '', '', 11],
  ['Montenegro', ['europe'], 'me', '382', '', '', '', 11],
  [
    'Montserrat',
    ['america', 'carribean'],
    'ms',
    '1664',
    '',
    '',
    '',
    11, // ???
  ],
  ['Morocco', ['africa', 'north-africa'], 'ma', '212', '', '', '', 12],
  ['Mozambique', ['africa'], 'mz', '258', '', '', '', 12],
  [
    'Myanmar',
    ['asia'],
    'mm',
    '95',
    '',
    '',
    '',
    11, // ???
  ],
  ['Namibia', ['africa'], 'na', '264', '', '', '', 12],
  ['Nauru', ['africa'], 'nr', '674', '', '', '', 10],
  ['Nepal', ['asia'], 'np', '977', '', '', '', 13],
  [
    'Netherlands',
    ['europe', 'european-union'],
    'nl',
    '31',
    '+.. .. ........',
    '',
    '',
    11,
  ],
  ['New Caledonia', ['oceania'], 'nc', '687', '', '', '', 9],
  ['New Zealand', ['oceania'], 'nz', '64', '+.. ...-...-....', '', '', 11],
  ['Nicaragua', ['america', 'central-america'], 'ni', '505', '', '', '', 11],
  ['Niger', ['africa'], 'ne', '227', '', '', '', 11],
  ['Nigeria', ['africa'], 'ng', '234', '', '', '', 13],
  [
    'Niue',
    ['asia'],
    'nu',
    '683',
    '',
    '',
    '',
    11, // ???
  ],
  [
    'Norfolk Island',
    ['oceania'],
    'nf',
    '672',
    '',
    '',
    '',
    11, // ???
  ],
  ['North Korea', ['asia'], 'kp', '850', '', '', '', 13],
  ['Northern Mariana Islands', ['oceania'], 'mp', '1670', '', '', '', 11],
  ['Norway', ['europe'], 'no', '47', '+.. ... .. ...', '', '', 10],
  ['Oman', ['middle-east'], 'om', '968', '', '', '', 11],
  ['Pakistan', ['asia'], 'pk', '92', '+.. ...-.......', '', '', 12],
  [
    'Palau',
    ['oceania'],
    'pw',
    '680',
    '',
    '',
    '',
    11, // ???
  ],
  ['Palestine', ['middle-east'], 'ps', '970', '', '', '', 12],
  ['Panama', ['america', 'central-america'], 'pa', '507', '', '', '', 11],
  ['Papua New Guinea', ['oceania'], 'pg', '675', '', '', '', 10],
  ['Paraguay', ['america', 'south-america'], 'py', '595', '', '', '', 12],
  ['Peru', ['america', 'south-america'], 'pe', '51', '', '', '', 11],
  ['Philippines', ['asia'], 'ph', '63', '+.. .... .......', '', '', 12],
  [
    'Poland',
    ['europe', 'european-union'],
    'pl',
    '48',
    '+.. ...-...-...',
    '',
    '',
    11,
  ],
  ['Portugal', ['europe', 'european-union'], 'pt', '351', '', '', '', 12],
  [
    'Puerto Rico',
    ['america', 'carribean'],
    'pr',
    '1',
    '',
    3,
    ['787', '939'],
    11,
  ],
  ['Qatar', ['middle-east'], 'qa', '974', '', '', '', 11],
  ['Réunion', ['africa'], 're', '262', '', '', '', 12],
  ['Romania', ['europe', 'european-union'], 'ro', '40', '', '', '', 11],
  [
    'Russia',
    ['europe', 'asia', 'ex-ussr'],
    'ru',
    '7',
    '+. (...) ...-..-..',
    0,
    '',
    11,
  ],
  ['Rwanda', ['africa'], 'rw', '250', '', '', '', 12],
  [
    'Saint Barthélemy',
    ['america', 'carribean'],
    'bl',
    '590',
    '',
    1,
    '',
    11, // ???
  ],
  [
    'Saint Helena',
    ['africa'],
    'sh',
    '290',
    '',
    '',
    '',
    11, // ???
  ],
  [
    'Saint Kitts and Nevis',
    ['america', 'carribean'],
    'kn',
    '1869',
    '',
    '',
    '',
    11,
  ],
  ['Saint Lucia', ['america', 'carribean'], 'lc', '1758', '', '', '', 11],
  [
    'Saint Martin',
    ['america', 'carribean'],
    'mf',
    '590',
    '',
    2,
    '',
    11, // ???
  ],
  [
    'Saint Pierre and Miquelon',
    ['america', 'north-america'],
    'pm',
    '508',
    '',
    '',
    '',
    11, // ???
  ],
  [
    'Saint Vincent and the Grenadines',
    ['america', 'carribean'],
    'vc',
    '1784',
    '',
    '',
    '',
    11,
  ],
  ['Samoa', ['oceania'], 'ws', '685', '', '', '', 9],
  ['San Marino', ['europe'], 'sm', '378', '', '', '', 11],
  [
    'São Tomé and Príncipe',
    ['africa'],
    'st',
    '239',
    '',
    '',
    '',
    11, // ???
  ],
  ['Saudi Arabia', ['middle-east'], 'sa', '966', '', '', '', 12],
  ['Senegal', ['africa'], 'sn', '221', '', '', '', 12],
  ['Serbia', ['europe'], 'rs', '381', '', '', '', 11],
  ['Seychelles', ['africa'], 'sc', '248', '', '', '', 10],
  ['Sierra Leone', ['africa'], 'sl', '232', '', '', '', 11],
  ['Singapore', ['asia'], 'sg', '65', '+.. ....-....', '', '', 10],
  [
    'Sint Maarten',
    ['america', 'carribean'],
    'sx',
    '1721',
    '',
    '',
    '',
    11, // ???
  ],
  ['Slovakia', ['europe', 'european-union'], 'sk', '421', '', '', '', 12],
  ['Slovenia', ['europe', 'european-union'], 'si', '386', '', '', '', 11],
  ['Solomon Islands', ['oceania'], 'sb', '677', '', '', '', 10],
  [
    'Somalia',
    ['africa'],
    'so',
    '252',
    '',
    '',
    '',
    11, // ???
  ],
  ['South Africa', ['africa'], 'za', '27', '', '', '', 11],
  ['South Korea', ['asia'], 'kr', '82', '+.. ... .... ....', '', '', 12],
  [
    'South Sudan',
    ['africa', 'north-africa'],
    'ss',
    '211',
    '',
    '',
    '',
    11, // ???
  ],
  [
    'Spain',
    ['europe', 'european-union'],
    'es',
    '34',
    '+.. ... ... ...',
    '',
    '',
    11,
  ],
  ['Sri Lanka', ['asia'], 'lk', '94', '', '', '', 11],
  ['Sudan', ['africa'], 'sd', '249', '', '', '', 12],
  ['Suriname', ['america', 'south-america'], 'sr', '597', '', '', '', 10],
  [
    'Swaziland',
    ['africa'],
    'sz',
    '268',
    '',
    '',
    '',
    11, // ???
  ],
  [
    'Sweden',
    ['europe', 'european-union'],
    'se',
    '46',
    '+.. (..) ...-..-..',
    '',
    '',
    11,
  ],
  ['Switzerland', ['europe'], 'ch', '41', '+.. .. ... .. ..', '', '', 11],
  ['Syria', ['middle-east'], 'sy', '963', '', '', '', 12],
  ['Taiwan', ['asia'], 'tw', '886', '', '', '', 12],
  ['Tajikistan', ['asia', 'ex-ussr'], 'tj', '992', '', '', '', 12],
  ['Tanzania', ['africa'], 'tz', '255', '', '', '', 12],
  ['Thailand', ['asia'], 'th', '66', '', '', '', 11],
  ['Timor-Leste', ['asia'], 'tl', '670', '', '', '', 11],
  ['Togo', ['africa'], 'tg', '228', '', '', '', 11],
  [
    'Tokelau',
    ['oceania'],
    'tk',
    '690',
    '',
    '',
    '',
    11, // ???
  ],
  ['Tonga', ['oceania'], 'to', '676', '', '', '', 10],
  [
    'Trinidad and Tobago',
    ['america', 'carribean'],
    'tt',
    '1868',
    '',
    '',
    '',
    11,
  ],
  ['Tunisia', ['africa', 'north-africa'], 'tn', '216', '', '', '', 11],
  ['Turkey', ['europe'], 'tr', '90', '+.. ... ... .. ..', '', '', 12],
  ['Turkmenistan', ['asia', 'ex-ussr'], 'tm', '993', '', '', '', 11],
  [
    'Turks and Caicos Islands',
    ['america', 'carribean'],
    'tc',
    '1649',
    '',
    '',
    '',
    11, // ???
  ],
  [
    'Tuvalu',
    ['asia'],
    'tv',
    '688',
    '',
    '',
    '',
    11, // ???
  ],
  [
    'U.S. Virgin Islands',
    ['america', 'carribean'],
    'vi',
    '1340',
    '',
    '',
    '',
    11, // ???
  ],
  ['Uganda', ['africa'], 'ug', '256', '', '', '', 12],
  [
    'Ukraine',
    ['europe', 'ex-ussr'],
    'ua',
    '380',
    '+... (..) ... .. ..',
    '',
    '',
    12,
  ],
  ['United Arab Emirates', ['middle-east'], 'ae', '971', '', '', '', 12],
  [
    'United Kingdom',
    ['europe', 'european-union'],
    'gb',
    '44',
    '+.. .... ......',
    '',
    '',
    12,
  ],
  [
    'United States',
    ['america', 'north-america'],
    'us',
    '1',
    '+. (...) ...-....',
    0,
    [
      '907',
      '205',
      '251',
      '256',
      '334',
      '479',
      '501',
      '870',
      '480',
      '520',
      '602',
      '623',
      '928',
      '209',
      '213',
      '310',
      '323',
      '408',
      '415',
      '510',
      '530',
      '559',
      '562',
      '619',
      '626',
      '650',
      '661',
      '707',
      '714',
      '760',
      '805',
      '818',
      '831',
      '858',
      '909',
      '916',
      '925',
      '949',
      '951',
      '303',
      '719',
      '970',
      '203',
      '860',
      '202',
      '302',
      '239',
      '305',
      '321',
      '352',
      '386',
      '407',
      '561',
      '727',
      '772',
      '813',
      '850',
      '863',
      '904',
      '941',
      '954',
      '229',
      '404',
      '478',
      '706',
      '770',
      '912',
      '808',
      '319',
      '515',
      '563',
      '641',
      '712',
      '208',
      '217',
      '309',
      '312',
      '618',
      '630',
      '708',
      '773',
      '815',
      '847',
      '219',
      '260',
      '317',
      '574',
      '765',
      '812',
      '316',
      '620',
      '785',
      '913',
      '270',
      '502',
      '606',
      '859',
      '225',
      '318',
      '337',
      '504',
      '985',
      '413',
      '508',
      '617',
      '781',
      '978',
      '301',
      '410',
      '207',
      '231',
      '248',
      '269',
      '313',
      '517',
      '586',
      '616',
      '734',
      '810',
      '906',
      '989',
      '218',
      '320',
      '507',
      '612',
      '651',
      '763',
      '952',
      '314',
      '417',
      '573',
      '636',
      '660',
      '816',
      '228',
      '601',
      '662',
      '406',
      '252',
      '336',
      '704',
      '828',
      '910',
      '919',
      '701',
      '308',
      '402',
      '603',
      '201',
      '609',
      '732',
      '856',
      '908',
      '973',
      '505',
      '575',
      '702',
      '775',
      '212',
      '315',
      '516',
      '518',
      '585',
      '607',
      '631',
      '716',
      '718',
      '845',
      '914',
      '216',
      '330',
      '419',
      '440',
      '513',
      '614',
      '740',
      '937',
      '405',
      '580',
      '918',
      '503',
      '541',
      '215',
      '412',
      '570',
      '610',
      '717',
      '724',
      '814',
      '401',
      '803',
      '843',
      '864',
      '605',
      '423',
      '615',
      '731',
      '865',
      '901',
      '931',
      '210',
      '214',
      '254',
      '281',
      '325',
      '361',
      '409',
      '432',
      '512',
      '713',
      '806',
      '817',
      '830',
      '903',
      '915',
      '936',
      '940',
      '956',
      '972',
      '979',
      '435',
      '801',
      '276',
      '434',
      '540',
      '703',
      '757',
      '804',
      '802',
      '206',
      '253',
      '360',
      '425',
      '509',
      '262',
      '414',
      '608',
      '715',
      '920',
      '304',
      '307',
    ],
    11,
  ],
  ['Uruguay', ['america', 'south-america'], 'uy', '598', '', '', '', 11],
  ['Uzbekistan', ['asia', 'ex-ussr'], 'uz', '998', '', '', '', 12],
  ['Vanuatu', ['oceania'], 'vu', '678', '', '', '', 10],
  [
    'Vatican City',
    ['europe'],
    'va',
    '39',
    '+.. .. .... ....',
    1,
    '',
    11, // ???
  ],
  ['Venezuela', ['america', 'south-america'], 've', '58', '', '', '', 12],
  ['Vietnam', ['asia'], 'vn', '84', '', '', '', 11],
  [
    'Wallis and Futuna',
    ['oceania'],
    'wf',
    '681',
    '',
    '',
    '',
    11, // ???
  ],
  ['Yemen', ['middle-east'], 'ye', '967', '', '', '', 12],
  ['Zambia', ['africa'], 'zm', '260', '', '', '', 12],
  ['Zimbabwe', ['africa'], 'zw', '263', '', '', '', 12],
];
const countries = {};
const allCountryCodes = {};

function addCountryCode(iso2, dialCode, priority) {
  if (!(dialCode in allCountryCodes)) {
    allCountryCodes[dialCode] = [];
  }
  const index = priority || 0;
  allCountryCodes[dialCode][index] = iso2;
}

const allCountries = [].concat(
  ...rawAllCountries.map((country) => {
    const [name, regions, iso2, dialCode, format, priority, areaCodes, length] =
      country;

    countries[dialCode] = {
      iso2,
      name,
      dialCode,
      format,
    };

    const countryItem = {
      name,
      regions,
      iso2,
      dialCode,
      priority,
      format: format || undefined,
      hasAreaCodes: areaCodes,
      length,
    };

    const areaItems = [];

    if (countryItem.hasAreaCodes) {
      areaCodes.forEach((areaCode) => {
        const areaItem = {
          ...countryItem,
          regions,
          dialCode: `${dialCode}${areaCode}`,
          isAreaCode: true,
        };

        areaItems.push(areaItem);

        addCountryCode(iso2, areaItem.dialCode);
      });
    }

    addCountryCode(
      countryItem.iso2,
      countryItem.dialCode,
      countryItem.hasAreaCodes
    );

    return areaItems.length > 0 ? [countryItem, ...areaItems] : [countryItem];
  })
);

export { allCountries, allCountryCodes, countries };
