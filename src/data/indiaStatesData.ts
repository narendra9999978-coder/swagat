import { StateData } from '../types/swagat';

export interface StateItemSimple {
  code: string;
  name: string;
  type: 'State' | 'UT';
  zone: 'North' | 'South' | 'West' | 'East' | 'Central' | 'North East';
  approvalCount: number;
}

export const allIndianStatesList: StateItemSimple[] = [
  // 28 States
  { code: 'AP', name: 'Andhra Pradesh', type: 'State', zone: 'South', approvalCount: 134 },
  { code: 'AR', name: 'Arunachal Pradesh', type: 'State', zone: 'North East', approvalCount: 88 },
  { code: 'AS', name: 'Assam', type: 'State', zone: 'North East', approvalCount: 112 },
  { code: 'BR', name: 'Bihar', type: 'State', zone: 'East', approvalCount: 118 },
  { code: 'CG', name: 'Chhattisgarh', type: 'State', zone: 'Central', approvalCount: 122 },
  { code: 'GA', name: 'Goa', type: 'State', zone: 'West', approvalCount: 96 },
  { code: 'GJ', name: 'Gujarat', type: 'State', zone: 'West', approvalCount: 146 },
  { code: 'HR', name: 'Haryana', type: 'State', zone: 'North', approvalCount: 138 },
  { code: 'HP', name: 'Himachal Pradesh', type: 'State', zone: 'North', approvalCount: 104 },
  { code: 'JH', name: 'Jharkhand', type: 'State', zone: 'East', approvalCount: 116 },
  { code: 'KA', name: 'Karnataka', type: 'State', zone: 'South', approvalCount: 142 },
  { code: 'KL', name: 'Kerala', type: 'State', zone: 'South', approvalCount: 118 },
  { code: 'MP', name: 'Madhya Pradesh', type: 'State', zone: 'Central', approvalCount: 130 },
  { code: 'MH', name: 'Maharashtra', type: 'State', zone: 'West', approvalCount: 148 },
  { code: 'MN', name: 'Manipur', type: 'State', zone: 'North East', approvalCount: 82 },
  { code: 'ML', name: 'Meghalaya', type: 'State', zone: 'North East', approvalCount: 86 },
  { code: 'MZ', name: 'Mizoram', type: 'State', zone: 'North East', approvalCount: 80 },
  { code: 'NL', name: 'Nagaland', type: 'State', zone: 'North East', approvalCount: 78 },
  { code: 'OD', name: 'Odisha', type: 'State', zone: 'East', approvalCount: 126 },
  { code: 'PB', name: 'Punjab', type: 'State', zone: 'North', approvalCount: 124 },
  { code: 'RJ', name: 'Rajasthan', type: 'State', zone: 'North', approvalCount: 132 },
  { code: 'SK', name: 'Sikkim', type: 'State', zone: 'North East', approvalCount: 84 },
  { code: 'TN', name: 'Tamil Nadu', type: 'State', zone: 'South', approvalCount: 145 },
  { code: 'TS', name: 'Telangana', type: 'State', zone: 'South', approvalCount: 139 },
  { code: 'TR', name: 'Tripura', type: 'State', zone: 'North East', approvalCount: 85 },
  { code: 'UP', name: 'Uttar Pradesh', type: 'State', zone: 'North', approvalCount: 152 },
  { code: 'UK', name: 'Uttarakhand', type: 'State', zone: 'North', approvalCount: 108 },
  { code: 'WB', name: 'West Bengal', type: 'State', zone: 'East', approvalCount: 128 },

  // 8 Union Territories
  { code: 'AN', name: 'Andaman and Nicobar Islands', type: 'UT', zone: 'South', approvalCount: 68 },
  { code: 'CH', name: 'Chandigarh', type: 'UT', zone: 'North', approvalCount: 92 },
  { code: 'DN', name: 'Dadra and Nagar Haveli and Daman and Diu', type: 'UT', zone: 'West', approvalCount: 98 },
  { code: 'DL', name: 'Delhi', type: 'UT', zone: 'North', approvalCount: 135 },
  { code: 'JK', name: 'Jammu and Kashmir', type: 'UT', zone: 'North', approvalCount: 110 },
  { code: 'LA', name: 'Ladakh', type: 'UT', zone: 'North', approvalCount: 65 },
  { code: 'LD', name: 'Lakshadweep', type: 'UT', zone: 'South', approvalCount: 55 },
  { code: 'PY', name: 'Puducherry', type: 'UT', zone: 'South', approvalCount: 89 }
];

export const indiaStatesData: StateData[] = [
  {
    code: 'KA',
    name: 'Karnataka',
    nodalAgency: 'Karnataka Udyog Mitra (KUM)',
    portalName: 'eBiz Karnataka Single Window',
    easeOfDoingBusinessRank: 3,
    clearanceDaysAvg: 19,
    topIndustries: ['IT & Technology', 'Biotechnology', 'Aerospace & Defence', 'Electronics & Semiconductors', 'Automobile (EV)'],
    description: 'Premier innovation powerhouse and Silicon Valley of India, leading the nation in software exports, aerospace research, electronics manufacturing, and deep-tech startup ecosystems.',
    totalApprovals: 142,
    integrationStatus: 'Fully Integrated',
    helpline: '080-22282392',
    categories: [
      { name: 'KIADB Industrial Land', count: 18, description: 'Industrial plot allotment, tech park leases in Electronic City & Whitefield' },
      { name: 'Factories & Labour Inspection', count: 22, description: 'Statutory factory licenses, 24x7 women shift permissions' },
      { name: 'Pollution Control (KSPCB)', count: 16, description: 'Green, Orange & Red category Consent to Establish and Operate' },
      { name: 'Fire Safety Clearance (KSFES)', count: 14, description: 'High-rise commercial IT campuses & factory fire NOCs' },
      { name: 'BESCOM Power & Grid Sanction', count: 15, description: 'Dedicated feeder line sanctions and renewable open-access' },
      { name: 'Town Planning & BBMP Sanctions', count: 20, description: 'Building plan permits, occupancy certificates' },
      { name: 'Commercial & Trade Licenses', count: 16, description: 'Shop and commercial establishment registrations' },
      { name: 'Biotech & Semiconductor Subsidies', count: 15, description: 'Incentive disbursement certificates under Karnataka Policies' }
    ]
  },
  {
    code: 'GJ',
    name: 'Gujarat',
    nodalAgency: 'iNDEXTb (Industrial Extension Bureau)',
    portalName: 'IFP (Investor Facilitation Portal)',
    easeOfDoingBusinessRank: 2,
    clearanceDaysAvg: 16,
    topIndustries: ['Petrochemicals & Chemicals', 'Automobile', 'Ceramics', 'Renewable Energy', 'Textiles', 'GIFT City FinTech'],
    description: 'India’s premier manufacturing and maritime export hub with world-class deep-water ports (Mundra, Kandla), GIFT City International Financial Services Centre, and Dholera SIR.',
    totalApprovals: 146,
    integrationStatus: 'Fully Integrated',
    helpline: '1800-233-0555',
    categories: [
      { name: 'GIDC Industrial Land Allotment', count: 22, description: 'Chemical estate plot leases and plug-and-play factory sheds' },
      { name: 'Factory & Labour Inspection (DISH)', count: 24, description: 'Statutory factory registration and safety inspectorate' },
      { name: 'Pollution Control (GPCB)', count: 20, description: 'Hazardous waste authorization and CTE/CTO clearances' },
      { name: 'Fire & Disaster Mitigation', count: 14, description: 'Industrial zone automated sprinkler and hydrant NOC' },
      { name: 'Power Connection (UGVCL/DGVCL)', count: 16, description: 'HT industrial connection release and captive solar wheeling' },
      { name: 'Port & Coastal Clearances', count: 18, description: 'Gujarat Maritime Board port boundary and jetty permissions' },
      { name: 'Trade & Commercial Licenses', count: 16, description: 'Commercial business registrations and shop permits' },
      { name: 'Renewable Park Clearances', count: 16, description: 'Khavda hybrid renewable energy park grid tie-in approvals' }
    ]
  },
  {
    code: 'TN',
    name: 'Tamil Nadu',
    nodalAgency: 'Guidance Tamil Nadu',
    portalName: 'TN Single Window Portal (SWP 2.0)',
    easeOfDoingBusinessRank: 3,
    clearanceDaysAvg: 17,
    topIndustries: ['Automobile & EV', 'Electronics & Hardware', 'Textiles & Apparel', 'Renewable Energy', 'Leather & Footwear'],
    description: 'The industrial heartland of South India producing over 35% of India’s electric vehicles, leader in wind energy, textile processing hubs in Coimbatore/Tirupur, and advanced hardware manufacturing.',
    totalApprovals: 145,
    integrationStatus: 'Fully Integrated',
    helpline: '044-28553118',
    categories: [
      { name: 'SIPCOT Industrial Parks', count: 20, description: 'Land leasing in Sriperumbudur, Hosur, and Oragadam auto corridors' },
      { name: 'Industrial Safety & Health', count: 22, description: 'Factory blueprint validation and boiler inspection' },
      { name: 'Pollution Control (TNPCB)', count: 19, description: 'CTE/CTO for auto assembly, electroplating, and dyeing units' },
      { name: 'Fire & Rescue Services', count: 14, description: 'Industrial structural fire security certification' },
      { name: 'TANGEDCO Electricity Sanction', count: 16, description: 'High-voltage industrial power load release' },
      { name: 'DTCP & CMDA Building Sanctions', count: 20, description: 'Chennai Metropolitan town planning and construction permits' },
      { name: 'Municipal Trade Permits', count: 17, description: 'Local authority trade and commercial licensing' },
      { name: 'EV & Electronics Capital Subsidies', count: 15, description: 'Special package capital incentive clearances' }
    ]
  },
  {
    code: 'UP',
    name: 'Uttar Pradesh',
    nodalAgency: 'Invest UP',
    portalName: 'Nivesh Mitra Single Window',
    easeOfDoingBusinessRank: 2,
    clearanceDaysAvg: 21,
    topIndustries: ['Electronics & Semiconductors', 'Defense Industrial Corridor', 'Food Processing', 'IT & Data Centers', 'Textiles & Leather'],
    description: 'Rapidly transforming economic titan with 5 operational expressways, the upcoming Noida International Airport (Jewar), sprawling electronic clusters, and a dedicated multi-city Defense Corridor.',
    totalApprovals: 152,
    integrationStatus: 'Fully Integrated',
    helpline: '0522-2238902',
    categories: [
      { name: 'UPSIDA & YEIDA Land Allocation', count: 24, description: 'Expressway industrial plots, Jewar airport cluster plots' },
      { name: 'Labour & Factory Approvals', count: 26, description: 'Online factory licenses, labour contract clearances' },
      { name: 'UPPCB Environmental Consents', count: 19, description: 'Air, water, and hazardous waste permissions' },
      { name: 'Fire Services NOC', count: 16, description: 'State Fire Department safety certifications' },
      { name: 'UPPCL Power Load Release', count: 18, description: 'Heavy industrial power energization clearances' },
      { name: 'Development Authority Sanctions', count: 23, description: 'NOIDA, Greater Noida, and Yamuna Expressway building sanctions' },
      { name: 'Trade & Food Processing Licenses', count: 18, description: 'Municipal licenses, agro-processing unit clearances' },
      { name: 'Defense Corridor & Subsidies', count: 15, description: 'Incentive claim certifications under UP Industrial Policy' }
    ]
  },
  {
    code: 'TS',
    name: 'Telangana',
    nodalAgency: 'TSIIC (Telangana State Industrial Infrastructure Corp)',
    portalName: 'TS-iPASS Single Window System',
    easeOfDoingBusinessRank: 1,
    clearanceDaysAvg: 14,
    topIndustries: ['Pharmaceuticals & Life Sciences', 'IT & Artificial Intelligence', 'Aerospace & Defense', 'Textiles', 'Food Processing'],
    description: 'Pioneered statutory right to timely clearances with penalty clauses under TS-iPASS. Home to Genome Valley pharma cluster, Hyderabad HITEC city, and massive international tech R&D headquarters.',
    totalApprovals: 139,
    integrationStatus: 'Fully Integrated',
    helpline: '040-23441666',
    categories: [
      { name: 'TSIIC Land & Infrastructure', count: 18, description: 'Genome Valley and Pharma City industrial plot allotments' },
      { name: 'Factory & Boilers Department', count: 21, description: 'Online statutory factory registration and safety tests' },
      { name: 'TSPCB Environmental Clearances', count: 18, description: 'Fast-track environmental consents under green channel' },
      { name: 'State Disaster Response & Fire NOC', count: 13, description: 'Single-window fire safety verifications' },
      { name: 'TSSPDCL Power Load Sanction', count: 15, description: 'Dedicated industrial feeder connections' },
      { name: 'GHMC & HMDA Town Planning', count: 20, description: 'Hyderabad metropolitan building plan approvals' },
      { name: 'Commercial & Trade Licenses', count: 16, description: 'Municipal trade permits and shop act licenses' },
      { name: 'Pharma & Life Science Subsidies', count: 14, description: 'Innovation grants and biotechnology policy clearances' }
    ]
  },
  {
    code: 'MH',
    name: 'Maharashtra',
    nodalAgency: 'MAITRI Cell',
    portalName: 'MAITRI Single Window Portal',
    easeOfDoingBusinessRank: 1,
    clearanceDaysAvg: 18,
    topIndustries: ['Automobile & Engineering', 'Pharmaceuticals', 'IT & FinTech', 'Chemicals', 'Textiles & Ports'],
    description: 'Major industrial powerhouse contributing significantly to national GDP with robust infrastructure, dedicated MIDC clusters, JNPT port connectivity, and progressive industrial policies.',
    totalApprovals: 148,
    integrationStatus: 'Fully Integrated',
    helpline: '1800-222-108',
    categories: [
      { name: 'MIDC Industrial Land', count: 20, description: 'MIDC land allotment, Stamp duty exemption, NA order' },
      { name: 'Factory & Labour (DISH)', count: 25, description: 'Factory license, Boilers inspection, Labour welfare' },
      { name: 'Pollution Control (MPCB)', count: 18, description: 'Consent to Establish (CTE), Consent to Operate (CTO)' },
      { name: 'Fire Safety & Civil Works', count: 15, description: 'Provisional & Final Fire NOC from Fire Services' },
      { name: 'Electricity (MSEDCL)', count: 14, description: 'HT/LT power load release, Transformer installation' },
      { name: 'Town Planning & MMRDA', count: 22, description: 'Building plan sanctions from MMRDA, CIDCO, PMC' },
      { name: 'Trade & Local Clearances', count: 20, description: 'Municipal trade license, Gumasta registration' },
      { name: 'Water & Irrigation NOC', count: 14, description: 'Industrial water tap allocation and minor minerals lease' }
    ]
  },
  {
    code: 'HR',
    name: 'Haryana',
    nodalAgency: 'HEPC (Haryana Enterprise Promotion Centre)',
    portalName: 'HEPC Single Window Portal',
    easeOfDoingBusinessRank: 3,
    clearanceDaysAvg: 20,
    topIndustries: ['Automobile & Auto Parts', 'IT & Services', 'Textiles & Garments', 'Footwear', 'Agro-processing'],
    description: 'Leading industrial state adjacent to National Capital with auto hubs in Gurugram-Manesar, footwear cluster in Bahadurgarh, and handloom center in Panipat.',
    totalApprovals: 138,
    integrationStatus: 'Fully Integrated',
    helpline: '0172-2580718',
    categories: [
      { name: 'HSIIDC Industrial Estates', count: 18, description: 'Plot allocations across IMT Manesar, Kundli, and Bawal' },
      { name: 'Labour & Factory Clearances', count: 22, description: 'Factory licensing, compliance self-certifications' },
      { name: 'Pollution Control (HSPCB)', count: 17, description: 'Consent to establish and operate industrial plants' },
      { name: 'Fire Services NOC', count: 13, description: 'Fire hazard safety compliance certifications' },
      { name: 'DHBVN / UHBVN Electricity', count: 15, description: 'Industrial load sanction and substation testing' },
      { name: 'Town & Country Planning Approvals', count: 19, description: 'Change of land use (CLU) and building sanctions' },
      { name: 'Municipal Licenses & Gumasta', count: 16, description: 'Commercial trade licenses and shop act registration' },
      { name: 'Automotive & MSME Subsidies', count: 14, description: 'Incentive claim clearance under Haryana Enterprise Policy' }
    ]
  },
  {
    code: 'RJ',
    name: 'Rajasthan',
    nodalAgency: 'Bureau of Investment Promotion (BIP)',
    portalName: 'RajNivesh Single Window System',
    easeOfDoingBusinessRank: 4,
    clearanceDaysAvg: 22,
    topIndustries: ['Solar & Green Energy', 'Minerals & Mining', 'Textiles & Handicrafts', 'Cement & Ceramics', 'Tourism & Hospitality'],
    description: 'National leader in solar and renewable energy generation hosting Bhadla Solar Park, richest repository of non-ferrous minerals, marble, and world-renowned heritage hospitality.',
    totalApprovals: 132,
    integrationStatus: 'Fully Integrated',
    helpline: '0141-2227718',
    categories: [
      { name: 'RIICO Industrial Land', count: 20, description: 'Industrial plot allotment and transfer across RIICO zones' },
      { name: 'Mines & Geology Clearances', count: 24, description: 'Mining leases, quarry licenses, mineral transit passes' },
      { name: 'Pollution Control (RSPCB)', count: 17, description: 'Air and water pollution control board consents' },
      { name: 'Fire Safety NOC', count: 13, description: 'Hospitality and industrial building fire clearances' },
      { name: 'Discom Power & Solar Interconnect', count: 18, description: 'Solar farm transmission and industrial load release' },
      { name: 'Urban Development & JDA', count: 18, description: 'Jaipur Development Authority building plan sanctions' },
      { name: 'Tourism & Heritage Permits', count: 15, description: 'Heritage hotel approvals and commercial trade permits' },
      { name: 'RIPS Subsidies & Tax Exemption', count: 14, description: 'Rajasthan Investment Promotion Scheme clearances' }
    ]
  },
  {
    code: 'DL',
    name: 'Delhi',
    nodalAgency: 'DSIIDC (Delhi State Industrial Infrastructure Development)',
    portalName: 'Delhi Single Window Clearances',
    easeOfDoingBusinessRank: 3,
    clearanceDaysAvg: 15,
    topIndustries: ['IT & Software Services', 'FinTech & Banking', 'E-Commerce & Logistics', 'Healthcare & Diagnostics', 'Media & Entertainment'],
    description: 'National Capital Territory serving as the corporate headquarters, financial center, and startup corridor with high-speed digital infrastructure and massive consumer market.',
    totalApprovals: 135,
    integrationStatus: 'Fully Integrated',
    helpline: '011-23314231',
    categories: [
      { name: 'DSIIDC Industrial Plot Services', count: 16, description: 'Bawana, Narela, and Okhla industrial estate leasing' },
      { name: 'DPCC Environmental Clearances', count: 18, description: 'Delhi Pollution Control Committee green approvals' },
      { name: 'Delhi Fire Services (DFS) NOC', count: 15, description: 'High-rise commercial building fire security clearances' },
      { name: 'Power Load (BSES / TPDDL)', count: 16, description: 'Commercial high-voltage electricity sanctions' },
      { name: 'MCD Municipal Trade Licensing', count: 22, description: 'General trade license, health trade license, storage NOC' },
      { name: 'Labour Department Clearances', count: 18, description: 'Delhi Shops and Establishments Act registrations' },
      { name: 'DDA Land & Building Sanctions', count: 18, description: 'Delhi Development Authority architectural sanctions' },
      { name: 'Startup & Innovation Subsidies', count: 12, description: 'Delhi Startup Policy financial assistance grants' }
    ]
  },
  {
    code: 'AP',
    name: 'Andhra Pradesh',
    nodalAgency: 'APIIC (Andhra Pradesh Industrial Infrastructure Corp)',
    portalName: 'AP Single Window Portal',
    easeOfDoingBusinessRank: 1,
    clearanceDaysAvg: 16,
    topIndustries: ['Pharmaceuticals (APIs)', 'Automobile Manufacturing', 'Food Processing & Aquaculture', 'Electronics', 'Textiles'],
    description: 'Consistently ranked #1 in Ease of Doing Business with a 974 km coastline, Visakhapatnam port, Sri City industrial hub, and aggressive green energy and electronics corridors.',
    totalApprovals: 134,
    integrationStatus: 'Fully Integrated',
    helpline: '1800-425-2425',
    categories: [
      { name: 'APIIC Industrial Land', count: 18, description: 'Allotment in mega clusters and coastal economic zones' },
      { name: 'Factory & Boilers Department', count: 20, description: 'Industrial safety licenses and factory plan approvals' },
      { name: 'APPCB Environmental Consents', count: 18, description: 'CTE/CTO clearances for bulk drugs and manufacturing' },
      { name: 'State Fire Services NOC', count: 13, description: 'Fire safety compliance certification' },
      { name: 'APCPDCL / APEPDCL Electricity', count: 15, description: 'Power load sanctions for heavy industrial units' },
      { name: 'CRDA & Municipal Town Planning', count: 18, description: 'Urban authority building plan approvals' },
      { name: 'Aquaculture & Food Processing Clearances', count: 16, description: 'Marine products export and agro processing permits' },
      { name: 'Industrial Policy Subsidies', count: 16, description: 'Power tariff and capital subsidy claim disbursements' }
    ]
  },
  {
    code: 'WB',
    name: 'West Bengal',
    nodalAgency: 'WBIDC (West Bengal Industrial Development Corporation)',
    portalName: 'Shilpa Sathi Single Window',
    easeOfDoingBusinessRank: 4,
    clearanceDaysAvg: 21,
    topIndustries: ['Steel & Metallurgy', 'Textiles & Leather', 'Food Processing', 'Chemicals & Petrochemicals', 'IT & Data Centers'],
    description: 'Gateway to Eastern and North-Eastern India, neighboring ASEAN trade routes, with prominent industrial parks in Kharagpur, Haldia, Panagarh, and Silicon Valley New Town Kolkata.',
    totalApprovals: 128,
    integrationStatus: 'Fully Integrated',
    helpline: '033-22553700',
    categories: [
      { name: 'WBSIDC Land Allotment', count: 17, description: 'Plot leases in Haldia, Panagarh, and Kharagpur industrial parks' },
      { name: 'Labour & Factory Inspectorate', count: 21, description: 'Statutory factory licenses and worker welfare compliance' },
      { name: 'WBPCB Environmental Consents', count: 17, description: 'Pollution control consents for steel, cement, and chemical plants' },
      { name: 'Fire & Emergency Services NOC', count: 13, description: 'State fire service clearances and life safety validation' },
      { name: 'WBSEDCL / CESC Power Sanctions', count: 15, description: 'Industrial power load approvals and grid tie-ins' },
      { name: 'NKDA & KMC Building Approvals', count: 18, description: 'Kolkata Metropolitan architectural and town planning sanctions' },
      { name: 'Municipal Trade Licenses', count: 15, description: 'Local municipal trade certificates' },
      { name: 'Industrial Incentive Subsidies', count: 12, description: 'State incentive claim clearances under WB Industrial Policy' }
    ]
  },
  {
    code: 'MP',
    name: 'Madhya Pradesh',
    nodalAgency: 'MPIDC (Madhya Pradesh Industrial Development Corporation)',
    portalName: 'MP Single Window System',
    easeOfDoingBusinessRank: 3,
    clearanceDaysAvg: 19,
    topIndustries: ['Automobiles & Components', 'Textiles & Garments', 'Pharmaceuticals', 'Agro-processing', 'Renewable Energy'],
    description: 'The heart of India offering central geographical transit advantages, massive industrial corridors in Pithampur (Detroit of MP), Mandideep, and Dewas, and surplus green energy.',
    totalApprovals: 130,
    integrationStatus: 'Fully Integrated',
    helpline: '0755-2575618',
    categories: [
      { name: 'MPIDC Industrial Land', count: 18, description: 'Pithampur, Mandideep, and Dewas plot allocations' },
      { name: 'Factory & Boilers Department', count: 20, description: 'Industrial safety approvals and boiler inspection' },
      { name: 'MPPCB Pollution Consents', count: 17, description: 'Consent to Establish and Operate for manufacturing' },
      { name: 'Fire Safety NOC', count: 12, description: 'Fire hazard safety compliance certifications' },
      { name: 'Discom Power Sanction', count: 15, description: 'Industrial power load releases and transformer inspection' },
      { name: 'Town Planning & Municipal NOC', count: 18, description: 'Building plan permissions and change of land use' },
      { name: 'Agro & Food Processing Permits', count: 16, description: 'Mandii trader registration and food safety approvals' },
      { name: 'Industrial Promotion Subsidies', count: 14, description: 'Capital investment and interest subvention claims' }
    ]
  },
  {
    code: 'PB',
    name: 'Punjab',
    nodalAgency: 'Punjab Bureau of Investment Promotion (PBIP)',
    portalName: 'Invest Punjab Single Window',
    easeOfDoingBusinessRank: 4,
    clearanceDaysAvg: 20,
    topIndustries: ['Textiles & Hosiery', 'Agro & Food Processing', 'Auto Components & Cycles', 'Pharmaceuticals', 'Light Engineering'],
    description: 'Home to vibrant entrepreneurship, Ludhiana engineering and cycle manufacturing hub, agro-processing clusters, and direct freight corridor access.',
    totalApprovals: 124,
    integrationStatus: 'Fully Integrated',
    helpline: '0172-2776001',
    categories: [
      { name: 'PSIEC Industrial Land', count: 17, description: 'Focal points land allocation across Ludhiana, Mohali, and Bathinda' },
      { name: 'Labour & Factory Clearances', count: 20, description: 'Factory licensing, worker safety clearances' },
      { name: 'PPCB Environmental NOCs', count: 16, description: 'Air and water pollution control board consents' },
      { name: 'Fire Services NOC', count: 12, description: 'Fire hazard safety compliance certifications' },
      { name: 'PSPCL Electricity Sanction', count: 15, description: 'High-tension industrial power load approvals' },
      { name: 'Town Planning & Municipal Approvals', count: 17, description: 'Change of land use and building plan sanctions' },
      { name: 'Agro-Business Licenses', count: 14, description: 'Grain processing and cold storage permits' },
      { name: 'Industrial Policy Incentives', count: 13, description: 'Punjab Industrial Business Development subsidies' }
    ]
  },
  {
    code: 'OD',
    name: 'Odisha',
    nodalAgency: 'IPICOL (Industrial Promotion & Investment Corp of Odisha)',
    portalName: 'GO-SWIFT Single Window Portal',
    easeOfDoingBusinessRank: 2,
    clearanceDaysAvg: 18,
    topIndustries: ['Metals & Steel', 'Aluminium Smelting', 'Petrochemicals (PCPIR Paradip)', 'Mining', 'IT & Data Centers'],
    description: 'Mineral capital of India producing over 50% of the nation’s aluminium and 25% of steel, with deep-water Paradip port, massive green hydrogen investments, and state-of-the-art GO-SWIFT single window.',
    totalApprovals: 126,
    integrationStatus: 'Fully Integrated',
    helpline: '1800-345-7111',
    categories: [
      { name: 'IDCO Industrial Land', count: 18, description: 'Paradip, Kalinganagar, and Jharsuguda industrial plot leases' },
      { name: 'Directorate of Factories & Boilers', count: 20, description: 'Heavy industrial safety and boiler inspection' },
      { name: 'OSPCB Environmental Clearances', count: 17, description: 'Consents for metallurgical, chemical, and mineral units' },
      { name: 'Fire Safety Clearances', count: 12, description: 'Industrial complex fire security certification' },
      { name: 'GRIDCO / Discom Power Sanction', count: 15, description: 'Heavy industrial high-tension grid connections' },
      { name: 'Town Planning & Port NOC', count: 17, description: 'Paradip Port boundaries and building permissions' },
      { name: 'Mining Lease Clearances', count: 15, description: 'Mineral excavation and transport permits' },
      { name: 'IPR 2022 Industrial Subsidies', count: 12, description: 'Capital investment and employment incentives' }
    ]
  },
  {
    code: 'KL',
    name: 'Kerala',
    nodalAgency: 'KSIDC (Kerala State Industrial Development Corp)',
    portalName: 'K-SWIFT Single Window Portal',
    easeOfDoingBusinessRank: 4,
    clearanceDaysAvg: 19,
    topIndustries: ['Tourism & Hospitality', 'Information Technology', 'Food Processing & Spices', 'Biotechnology & Healthcare', 'Ayurveda & Wellness'],
    description: 'God’s Own Country boasting the highest literacy, Cochin International Airport (100% solar powered), Kochi Infopark & Technopark Trivandrum, and world-class tourism infrastructure.',
    totalApprovals: 118,
    integrationStatus: 'Fully Integrated',
    helpline: '1800-425-5020',
    categories: [
      { name: 'KINFRA Industrial Parks', count: 16, description: 'Theme-based industrial park land allotment across Kerala' },
      { name: 'Labour & Factory Inspection', count: 19, description: 'Statutory factory licenses and worker welfare compliance' },
      { name: 'PCB Environmental Consents', count: 15, description: 'Pollution control consents for hospitality and green industries' },
      { name: 'Fire and Rescue Services NOC', count: 12, description: 'Hospitality and commercial building fire safety' },
      { name: 'KSEB Power Load Sanction', count: 14, description: 'Dedicated industrial and commercial electricity connections' },
      { name: 'LSGD Municipal Building Permits', count: 18, description: 'Local self government town planning and construction permits' },
      { name: 'Tourism & Ayurvedic Licenses', count: 13, description: 'Eco-tourism accreditation and wellness center permits' },
      { name: 'Industrial Subsidies & MSME Grants', count: 11, description: 'Incentive disbursement clearances under Kerala Policy' }
    ]
  }
];

// Helper to get state data safely for all 36 states and UTs
export const getStateDataByCode = (code: string): StateData => {
  const found = indiaStatesData.find(s => s.code === code);
  if (found) return found;

  const simple = allIndianStatesList.find(s => s.code === code) || allIndianStatesList[0];
  return {
    code: simple.code,
    name: simple.name,
    nodalAgency: `${simple.name} Industrial Development Corporation`,
    portalName: `${simple.name} Single Window Clearance Portal`,
    easeOfDoingBusinessRank: 3,
    clearanceDaysAvg: 20,
    topIndustries: ['Manufacturing', 'IT & Technology', 'Agro & Food Processing', 'Renewable Energy'],
    description: `Comprehensive single-window statutory approval and regulatory clearance hub for businesses and investors operating in ${simple.name}.`,
    totalApprovals: simple.approvalCount,
    integrationStatus: 'Fully Integrated',
    helpline: '1800-11-8005',
    categories: [
      { name: 'Industrial Land Allotment', count: Math.round(simple.approvalCount * 0.15), description: `State industrial plot allocation in ${simple.name}` },
      { name: 'Factories & Labour Inspection', count: Math.round(simple.approvalCount * 0.18), description: 'Statutory factory licenses and safety inspection' },
      { name: 'Pollution & Environmental Consents', count: Math.round(simple.approvalCount * 0.15), description: 'Consent to Establish (CTE) & Operate (CTO)' },
      { name: 'Fire Safety NOC', count: Math.round(simple.approvalCount * 0.12), description: 'Fire and rescue services compliance certification' },
      { name: 'Electricity Load Sanction', count: Math.round(simple.approvalCount * 0.13), description: 'Industrial power energization clearances' },
      { name: 'Town Planning & Building Sanctions', count: Math.round(simple.approvalCount * 0.15), description: 'Local municipal construction and architectural approvals' },
      { name: 'Commercial & Trade Licenses', count: Math.round(simple.approvalCount * 0.12), description: 'Shop and commercial trade establishment permits' }
    ]
  };
};
