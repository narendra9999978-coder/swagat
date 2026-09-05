import React from 'react';
import { 
  Factory, 
  Laptop, 
  Car, 
  Pill, 
  HeartPulse, 
  Utensils, 
  Shirt, 
  Zap, 
  Cpu, 
  Building2, 
  Plane, 
  Hotel, 
  Sprout, 
  FlaskConical, 
  Fuel, 
  Boxes, 
  ShoppingBag, 
  Landmark, 
  Sun, 
  Leaf, 
  Radio, 
  Ship, 
  Pickaxe, 
  GraduationCap 
} from 'lucide-react';

export interface SectorItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  approvalCount: number;
  keyClearances: string[];
  popularStates: string[];
  color: string;
}

export const sectorsData: SectorItem[] = [
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    icon: Factory,
    description: 'Heavy engineering, metal fabrication, industrial machinery, and precision tools.',
    approvalCount: 42,
    keyClearances: ['Consent to Establish (CTE)', 'Factory License', 'Boiler Registration', 'Power Load Sanction'],
    popularStates: ['Gujarat', 'Maharashtra', 'Tamil Nadu', 'Haryana'],
    color: 'from-blue-600 to-indigo-700'
  },
  {
    id: 'it-technology',
    name: 'IT & Technology',
    icon: Laptop,
    description: 'Software development, SaaS platforms, AI systems, cloud data centers, and IT-BPM.',
    approvalCount: 18,
    keyClearances: ['DoT OSP Registration', 'STPI Registration', 'Data Center Power Clearance', 'Shop & Establishment'],
    popularStates: ['Karnataka', 'Telangana', 'Maharashtra', 'Delhi'],
    color: 'from-sky-500 to-blue-600'
  },
  {
    id: 'automobile',
    name: 'Automobile',
    icon: Car,
    description: 'OEM auto manufacturing, auto components, electric vehicles (EV), and battery assembly.',
    approvalCount: 38,
    keyClearances: ['ARAI / ICAT Type Approval', 'PLI Auto Certification', 'Industrial Siting Consent', 'Fire Safety NOC'],
    popularStates: ['Tamil Nadu', 'Maharashtra', 'Haryana', 'Gujarat'],
    color: 'from-amber-500 to-orange-600'
  },
  {
    id: 'pharmaceuticals',
    name: 'Pharmaceuticals',
    icon: Pill,
    description: 'Active Pharmaceutical Ingredients (APIs), formulations, biologicals, and medical formulations.',
    approvalCount: 36,
    keyClearances: ['CDSCO Drug Manufacturing License', 'WHO-GMP Certification', 'Zero Liquid Discharge (ZLD) Consent', 'Solvent Storage PESO'],
    popularStates: ['Telangana', 'Gujarat', 'Maharashtra', 'Himachal Pradesh'],
    color: 'from-emerald-600 to-teal-700'
  },
  {
    id: 'healthcare',
    name: 'Healthcare',
    icon: HeartPulse,
    description: 'Hospitals, diagnostic laboratories, medical device fabrication, and clinical establishments.',
    approvalCount: 28,
    keyClearances: ['Clinical Establishment Act Registration', 'Bio-Medical Waste Authorization', 'AERB Radiation Clearance', 'Pharmacy License'],
    popularStates: ['Delhi', 'Karnataka', 'Tamil Nadu', 'Maharashtra'],
    color: 'from-rose-500 to-pink-600'
  },
  {
    id: 'food-processing',
    name: 'Food Processing',
    icon: Utensils,
    description: 'Dairy, agro-processing, cold storage, packaged food, and beverage production.',
    approvalCount: 32,
    keyClearances: ['FSSAI Central / State License', 'Water Quality NABL NOC', 'Factory License', 'Cold Chain Subsidies'],
    popularStates: ['Punjab', 'Uttar Pradesh', 'Maharashtra', 'Andhra Pradesh'],
    color: 'from-orange-500 to-amber-600'
  },
  {
    id: 'textiles',
    name: 'Textiles',
    icon: Shirt,
    description: 'Spinning mills, garmenting, technical textiles, weaving, and PM MITRA mega apparel parks.',
    approvalCount: 29,
    keyClearances: ['Textile Commissioner Permit', 'Effluent SPCB Clearance', 'Factory Safety Approval', 'RoDTEP Export Code'],
    popularStates: ['Tamil Nadu', 'Gujarat', 'Maharashtra', 'Punjab'],
    color: 'from-indigo-500 to-purple-600'
  },
  {
    id: 'renewable-energy',
    name: 'Renewable Energy',
    icon: Zap,
    description: 'Wind farms, bio-energy, green hydrogen electrolysers, and clean tech equipment.',
    approvalCount: 34,
    keyClearances: ['Grid Connectivity Interconnection NOC', 'MNRE SIGHT Incentive', 'State Power Transmission Clearances', 'Land Revenue Conversion'],
    popularStates: ['Rajasthan', 'Gujarat', 'Tamil Nadu', 'Karnataka'],
    color: 'from-yellow-500 to-amber-600'
  },
  {
    id: 'electronics',
    name: 'Electronics & Semiconductors',
    icon: Cpu,
    description: 'Semiconductor ATMP/OSAT, display fab, PCB fabrication, and consumer electronics assembly.',
    approvalCount: 35,
    keyClearances: ['MeitY SPECS / PLI Clearance', 'BIS CRS Certification', 'Clean Room HVAC Validation', 'E-Waste EPR Registration'],
    popularStates: ['Uttar Pradesh', 'Tamil Nadu', 'Karnataka', 'Gujarat'],
    color: 'from-cyan-600 to-blue-700'
  },
  {
    id: 'construction',
    name: 'Construction & Infrastructure',
    icon: Building2,
    description: 'Real estate, industrial warehouses, bridges, expressway corridors, and urban projects.',
    approvalCount: 40,
    keyClearances: ['RERA Project Registration', 'Building Plan Sanction', 'Environmental Impact Assessment (EIA)', 'Airport Authority Height NOC'],
    popularStates: ['Delhi', 'Maharashtra', 'Karnataka', 'Uttar Pradesh'],
    color: 'from-stone-600 to-slate-700'
  },
  {
    id: 'aviation',
    name: 'Aviation',
    icon: Plane,
    description: 'Airlines, drone manufacturing, MRO facilities, and aerospace component machining.',
    approvalCount: 24,
    keyClearances: ['DGCA Airline / MRO Permit', 'MoCA Security Clearance', 'Drone Type Certificate', 'BCAS Clearance'],
    popularStates: ['Karnataka', 'Delhi', 'Maharashtra', 'Telangana'],
    color: 'from-sky-600 to-indigo-600'
  },
  {
    id: 'tourism-hospitality',
    name: 'Tourism & Hospitality',
    icon: Hotel,
    description: 'Hotels, resorts, eco-tourism units, heritage properties, and travel infrastructure.',
    approvalCount: 26,
    keyClearances: ['Ministry of Tourism Star Classification', 'Municipal Trade License', 'Police Eating House License', 'Bar & Excise NOC'],
    popularStates: ['Goa', 'Rajasthan', 'Kerala', 'Uttarakhand'],
    color: 'from-teal-500 to-emerald-600'
  },
  {
    id: 'agriculture-food',
    name: 'Agriculture & Food',
    icon: Sprout,
    description: 'Commercial organic farming, seed production, horticulture nurseries, and agro-inputs.',
    approvalCount: 22,
    keyClearances: ['Insecticides Act License', 'Seed Quality Certification', 'APMC Trader Registration', 'Organic Certification NPOP'],
    popularStates: ['Madhya Pradesh', 'Punjab', 'Haryana', 'Andhra Pradesh'],
    color: 'from-emerald-500 to-green-600'
  },
  {
    id: 'chemicals',
    name: 'Chemicals',
    icon: FlaskConical,
    description: 'Specialty chemicals, petrochemical derivatives, dyes, pigments, and industrial fertilizers.',
    approvalCount: 44,
    keyClearances: ['PESO Bulk Chemical License', 'EIA Clearance from MoEFCC', 'Hazardous Waste Authorization', 'Public Liability Insurance'],
    popularStates: ['Gujarat', 'Maharashtra', 'Andhra Pradesh', 'Tamil Nadu'],
    color: 'from-violet-600 to-purple-700'
  },
  {
    id: 'oil-gas',
    name: 'Oil & Gas',
    icon: Fuel,
    description: 'Exploration & production (E&P), city gas distribution (CGD), pipeline networks, and storage.',
    approvalCount: 39,
    keyClearances: ['PNGRB Authorization', 'Petroleum Storage License (PESO)', 'Forest Clearance (FC)', 'Directorate of Hydrocarbons Clearances'],
    popularStates: ['Assam', 'Gujarat', 'Rajasthan', 'Andhra Pradesh'],
    color: 'from-amber-600 to-red-600'
  },
  {
    id: 'logistics',
    name: 'Logistics',
    icon: Boxes,
    description: 'Multi-modal logistics parks (MMLP), freight forwarding, container depots, and 3PL.',
    approvalCount: 25,
    keyClearances: ['Warehouse Registration under WDRA', 'Customs Bonded Warehouse License', 'Transport Fleet Permits', 'Fire & Structural NOC'],
    popularStates: ['Maharashtra', 'Haryana', 'Gujarat', 'Uttar Pradesh'],
    color: 'from-blue-700 to-slate-800'
  },
  {
    id: 'retail',
    name: 'Retail & E-commerce',
    icon: ShoppingBag,
    description: 'Large retail chains, multi-brand retail, e-commerce fulfillment hubs, and dark stores.',
    approvalCount: 21,
    keyClearances: ['Legal Metrology Registration', 'Shop & Commercial Establishment Act', 'Plastic Waste EPR Registration', 'Trade License'],
    popularStates: ['Delhi', 'Maharashtra', 'Karnataka', 'West Bengal'],
    color: 'from-pink-500 to-rose-600'
  },
  {
    id: 'financial-services',
    name: 'Financial Services',
    icon: Landmark,
    description: 'FinTech platforms, NBFCs, payment gateways, micro-finance institutions, and GIFT City units.',
    approvalCount: 20,
    keyClearances: ['RBI NBFC Certificate of Registration', 'SEBI Investment Intermediary License', 'IFSCA GIFT City In-Principle Approval', 'FIU-IND Anti-Money Laundering Registration'],
    popularStates: ['Gujarat', 'Maharashtra', 'Karnataka', 'Delhi'],
    color: 'from-emerald-700 to-teal-800'
  },
  {
    id: 'solar-energy',
    name: 'Solar Energy',
    icon: Sun,
    description: 'Utility-scale solar power plants, rooftop solar, solar cells & wafer manufacturing.',
    approvalCount: 31,
    keyClearances: ['MNRE ALMM Approved Vendor Listing', 'CEIG Electrical Inspectorate Safety Clearance', 'Transmission Utility Wheeling Agreement', 'Solar Park Land Allocation'],
    popularStates: ['Rajasthan', 'Gujarat', 'Karnataka', 'Madhya Pradesh'],
    color: 'from-amber-400 to-yellow-500'
  },
  {
    id: 'environment',
    name: 'Environment',
    icon: Leaf,
    description: 'Solid waste management, sewage recycling, e-waste dismantling, and carbon credit projects.',
    approvalCount: 27,
    keyClearances: ['CPCB Central EPR Registration', 'Common Effluent Treatment Plant (CETP) Hook-Up', 'Hazardous Recycling Authorization', 'Green Credits Scheme Validation'],
    popularStates: ['Maharashtra', 'Gujarat', 'Tamil Nadu', 'Delhi'],
    color: 'from-green-600 to-emerald-700'
  },
  {
    id: 'telecom',
    name: 'Telecom',
    icon: Radio,
    description: 'Telecom infrastructure providers (IP-1), optical fiber cable laying, 5G towers, and ISPs.',
    approvalCount: 23,
    keyClearances: ['DoT Unified License (UL)', 'Right of Way (RoW) Portal Approvals', 'SACFA Wireless Frequency Clearance', 'WPC Equipment Type Approval'],
    popularStates: ['Delhi', 'Maharashtra', 'Karnataka', 'Telangana'],
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'ports-shipping',
    name: 'Ports & Shipping',
    icon: Ship,
    description: 'Major and non-major port terminals, coastal shipping, ship repair yards, and maritime services.',
    approvalCount: 30,
    keyClearances: ['Directorate General of Shipping (DGS) NOC', 'Coastal Regulation Zone (CRZ) Clearance', 'Tariff Authority for Major Ports Registration', 'Customs Notified Port Area License'],
    popularStates: ['Gujarat', 'Maharashtra', 'Andhra Pradesh', 'Tamil Nadu', 'Odisha', 'Kerala'],
    color: 'from-cyan-700 to-blue-800'
  },
  {
    id: 'mining',
    name: 'Mining',
    icon: Pickaxe,
    description: 'Major & minor minerals, iron ore, coal blocks, bauxite quarrying, and limestone leases.',
    approvalCount: 37,
    keyClearances: ['Mining Lease Grant by State Govt', 'Indian Bureau of Mines (IBM) Approved Mining Plan', 'Forest Clearance Stage I & II', 'National Board for Wildlife (NBWL) NOC'],
    popularStates: ['Odisha', 'Chhattisgarh', 'Jharkhand', 'Rajasthan', 'Karnataka'],
    color: 'from-neutral-700 to-stone-800'
  },
  {
    id: 'education',
    name: 'Education',
    icon: GraduationCap,
    description: 'Higher educational universities, private vocational institutions, and medical / technical colleges.',
    approvalCount: 22,
    keyClearances: ['UGC Autonomous University Act Approval', 'AICTE Technical Institute Clearance', 'National Medical Commission (NMC) Letter of Permission', 'Local Town Planning Land Sanction'],
    popularStates: ['Uttar Pradesh', 'Maharashtra', 'Karnataka', 'Tamil Nadu'],
    color: 'from-indigo-600 to-violet-700'
  }
];
