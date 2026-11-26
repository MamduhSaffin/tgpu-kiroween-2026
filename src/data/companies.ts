export type Role = 'exporter' | 'distributor' | 'buyer' | 'both';
export type Sector =
  | 'Food & Beverage'
  | 'Palm Oil & Oleochemicals'
  | 'Rubber & Plastics'
  | 'Electronics & Electrical'
  | 'Medical Devices'
  | 'Halal Cosmetics'
  | 'Machinery & Equipment'
  | 'Timber & Furniture'
  | 'Textiles & Apparel'
  | 'Chemicals';

export type Country =
  | 'Malaysia'
  | 'UAE'
  | 'Saudi Arabia'
  | 'Qatar'
  | 'Kuwait'
  | 'Bahrain'
  | 'Oman';

export type PartnershipType =
  | 'Distribution Agreement'
  | 'Joint Venture'
  | 'OEM Supply'
  | 'Agency Representation'
  | 'Strategic Investment'
  | 'Franchise'
  | 'Direct Import';

export type ExportReadiness = 'Planning' | 'Exporting' | 'Established exporter';
export type MarketObjective =
  | 'Distributor Search'
  | 'Direct Buyers'
  | 'Joint Venture'
  | 'OEM / Private Label'
  | 'Market Research';

export interface Company {
  id: string;
  name: string;
  tagline: string;
  role: Role;
  sector: Sector;
  products: string[];
  country: Country;
  city: string;
  partnershipTypes: PartnershipType[];
  targetMarkets: Country[];
  annualRevenue: string;
  employees: string;
  established: number;
  certifications: string[];
  description: string;
  contactName: string;
  contactEmail: string;
  logoInitials: string;
  logoColor: string;
  featured: boolean;
  exportReadiness?: ExportReadiness;
  marketObjectives?: MarketObjective[];
  commercialCapacity?: string;
}

export const COMPANIES: Company[] = [
  // ── Malaysian Exporters ──────────────────────────────────────────────────
  {
    id: 'my-001',
    name: 'NusaPure Foods Sdn Bhd',
    tagline: 'Premium halal-certified Malaysian food products for global markets',
    role: 'exporter',
    sector: 'Food & Beverage',
    products: ['Frozen ready meals', 'Sambal paste', 'Instant noodles', 'Biscuits & confectionery'],
    country: 'Malaysia',
    city: 'Shah Alam, Selangor',
    partnershipTypes: ['Distribution Agreement', 'Agency Representation'],
    targetMarkets: ['UAE', 'Saudi Arabia', 'Qatar', 'Kuwait'],
    annualRevenue: 'RM 45M',
    employees: '280',
    established: 2009,
    certifications: ['JAKIM Halal', 'HACCP', 'ISO 22000', 'BRC Grade A'],
    description:
      'NusaPure Foods produces a wide range of halal-certified packaged food products. Our manufacturing facility in Shah Alam meets international food safety standards, and we have been exporting to Southeast Asia since 2012. We are now actively seeking GCC distributors to expand our Middle East presence.',
    contactName: 'Demo Partnerships Team',
    contactEmail: 'partnerships@example.invalid',
    logoInitials: 'NP',
    logoColor: '#1E6B4F',
    exportReadiness: 'Established exporter',
    featured: true,
  },
  {
    id: 'my-002',
    name: 'GoldenPalm Oleochem Bhd',
    tagline: 'Sustainable palm oil derivatives and specialty oleochemicals',
    role: 'exporter',
    sector: 'Palm Oil & Oleochemicals',
    products: ['Fatty acids', 'Glycerine', 'Palm stearin', 'Soap noodles'],
    country: 'Malaysia',
    city: 'Pasir Gudang, Johor',
    partnershipTypes: ['Distribution Agreement', 'Direct Import', 'OEM Supply'],
    targetMarkets: ['UAE', 'Saudi Arabia', 'Bahrain', 'Oman'],
    annualRevenue: 'RM 210M',
    employees: '650',
    established: 1998,
    certifications: ['RSPO', 'ISO 14001', 'ISCC', 'GreenPalm'],
    description:
      'GoldenPalm is one of Malaysia\'s leading oleochemical producers, supplying raw materials to the personal care, food, and industrial sectors globally. We hold RSPO certification and actively pursue sustainable sourcing along our supply chain.',
    contactName: 'Demo Partnerships Team',
    contactEmail: 'partnerships@example.invalid',
    logoInitials: 'GP',
    logoColor: '#C9A84C',
    featured: true,
  },
  {
    id: 'my-003',
    name: 'MedVance Technologies Sdn Bhd',
    tagline: 'Innovative medical devices engineered in Malaysia',
    role: 'exporter',
    sector: 'Medical Devices',
    products: ['Surgical gloves', 'Wound-care dressings', 'Diagnostic kits', 'Infusion sets'],
    country: 'Malaysia',
    city: 'Cyberjaya, Selangor',
    partnershipTypes: ['Distribution Agreement', 'Agency Representation', 'Joint Venture'],
    targetMarkets: ['UAE', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Bahrain'],
    annualRevenue: 'RM 85M',
    employees: '420',
    established: 2004,
    certifications: ['ISO 13485', 'CE Mark', 'MDA Malaysia', 'FDA Listed'],
    description:
      'MedVance designs and manufactures Class I and II medical devices exported to over 30 countries. Our GCC expansion strategy targets hospital procurement networks and national health programs. We offer full regulatory support for local market registration.',
    contactName: 'Demo Partnerships Team',
    contactEmail: 'partnerships@example.invalid',
    logoInitials: 'MV',
    logoColor: '#1565C0',
    featured: false,
  },
  {
    id: 'my-004',
    name: 'ElectroNex Systems Bhd',
    tagline: 'Smart electronics and IoT modules for industrial applications',
    role: 'exporter',
    sector: 'Electronics & Electrical',
    products: ['PCB assemblies', 'IoT gateway modules', 'Power supplies', 'LED lighting systems'],
    country: 'Malaysia',
    city: 'Penang',
    partnershipTypes: ['OEM Supply', 'Distribution Agreement', 'Joint Venture'],
    targetMarkets: ['UAE', 'Saudi Arabia', 'Qatar'],
    annualRevenue: 'RM 130M',
    employees: '900',
    established: 2001,
    certifications: ['ISO 9001', 'UL Listed', 'CE Mark', 'RoHS'],
    description:
      'ElectroNex is a Penang-based EMS provider and product company supplying smart industrial electronics to global OEMs. We are seeking GCC system integrators and distributors to support Saudi Vision 2030 and UAE industrial automation projects.',
    contactName: 'Demo Partnerships Team',
    contactEmail: 'partnerships@example.invalid',
    logoInitials: 'EN',
    logoColor: '#6A1B9A',
    featured: false,
  },
  {
    id: 'my-005',
    name: 'RadianceGlow Cosmetics Sdn Bhd',
    tagline: 'Halal-certified luxury cosmetics inspired by Malaysian botanicals',
    role: 'exporter',
    sector: 'Halal Cosmetics',
    products: ['Skincare serums', 'BB creams', 'Lipsticks', 'Body lotions'],
    country: 'Malaysia',
    city: 'Kuala Lumpur',
    partnershipTypes: ['Distribution Agreement', 'Agency Representation', 'Franchise'],
    targetMarkets: ['UAE', 'Saudi Arabia', 'Kuwait', 'Bahrain', 'Qatar'],
    annualRevenue: 'RM 32M',
    employees: '160',
    established: 2014,
    certifications: ['JAKIM Halal', 'COSMOS Organic', 'GMP WHO', 'Cruelty-Free Intl'],
    description:
      'RadianceGlow produces premium halal cosmetics and personal care products using natural Malaysian botanicals. Our brand appeals to millennial Muslim consumers across Southeast Asia and we are building a GCC retail and e-commerce distribution network.',
    contactName: 'Demo Partnerships Team',
    contactEmail: 'partnerships@example.invalid',
    logoInitials: 'RG',
    logoColor: '#AD1457',
    featured: true,
  },
  {
    id: 'my-006',
    name: 'TimberCraft Industries Sdn Bhd',
    tagline: 'Sustainable certified timber and bespoke furniture for hospitality',
    role: 'exporter',
    sector: 'Timber & Furniture',
    products: ['Engineered wood panels', 'Hotel furniture sets', 'Office workstations', 'Outdoor decking'],
    country: 'Malaysia',
    city: 'Muar, Johor',
    partnershipTypes: ['Direct Import', 'Distribution Agreement', 'OEM Supply'],
    targetMarkets: ['UAE', 'Saudi Arabia', 'Qatar', 'Oman'],
    annualRevenue: 'RM 67M',
    employees: '350',
    established: 1992,
    certifications: ['FSC Certified', 'PEFC', 'ISO 9001', 'SIRIM QAS'],
    description:
      'TimberCraft is a heritage furniture manufacturer supplying five-star hotels, residential developers, and corporate offices across Asia. We are targeting the GCC hospitality boom – Saudi NEOM, UAE luxury resort projects – with customised contract furniture solutions.',
    contactName: 'Demo Partnerships Team',
    contactEmail: 'partnerships@example.invalid',
    logoInitials: 'TC',
    logoColor: '#4E342E',
    featured: false,
  },
  {
    id: 'my-007',
    name: 'PolyFlex Rubber Solutions Bhd',
    tagline: 'Technical rubber compounds and precision moulded components',
    role: 'exporter',
    sector: 'Rubber & Plastics',
    products: ['Automotive seals', 'Industrial hoses', 'Vibration dampers', 'Medical-grade tubing'],
    country: 'Malaysia',
    city: 'Klang, Selangor',
    partnershipTypes: ['OEM Supply', 'Direct Import', 'Distribution Agreement'],
    targetMarkets: ['UAE', 'Saudi Arabia', 'Kuwait'],
    annualRevenue: 'RM 54M',
    employees: '310',
    established: 2000,
    certifications: ['IATF 16949', 'ISO 9001', 'REACH', 'RoHS'],
    description:
      'PolyFlex manufactures high-performance rubber and plastic components for automotive, oil & gas, and medical industries. We supply Tier-1 automotive OEMs globally and are exploring GCC partnerships to serve the regional oil & gas sector.',
    contactName: 'Demo Partnerships Team',
    contactEmail: 'partnerships@example.invalid',
    logoInitials: 'PF',
    logoColor: '#00695C',
    featured: false,
  },
  {
    id: 'my-008',
    name: 'TechWeave Apparel Sdn Bhd',
    tagline: 'Technical and modest fashion textiles manufactured in Malaysia',
    role: 'exporter',
    sector: 'Textiles & Apparel',
    products: ['Modest sportswear', 'Corporate uniforms', 'Technical fabrics', 'Islamic fashion wear'],
    country: 'Malaysia',
    city: 'Ipoh, Perak',
    partnershipTypes: ['Distribution Agreement', 'Agency Representation', 'Franchise'],
    targetMarkets: ['UAE', 'Saudi Arabia', 'Kuwait', 'Qatar', 'Bahrain'],
    annualRevenue: 'RM 28M',
    employees: '220',
    established: 2011,
    certifications: ['OEKO-TEX Standard 100', 'JAKIM Halal', 'ISO 9001'],
    description:
      'TechWeave specialises in modest fashion and technical sportswear made from performance fabrics. Our collections blend Malaysian cultural aesthetics with international sports and corporate wear standards, targeting the growing GCC modest fashion market.',
    contactName: 'Demo Partnerships Team',
    contactEmail: 'partnerships@example.invalid',
    logoInitials: 'TW',
    logoColor: '#1565C0',
    featured: false,
  },

  // ── GCC Distributors & Buyers ────────────────────────────────────────────
  {
    id: 'uae-001',
    name: 'Al Nakheel Trading LLC',
    tagline: 'UAE\'s premier FMCG distributor serving hypermarkets and retail chains',
    role: 'distributor',
    sector: 'Food & Beverage',
    products: ['Packaged foods', 'Beverages', 'Halal frozen products', 'Confectionery'],
    country: 'UAE',
    city: 'Dubai',
    partnershipTypes: ['Distribution Agreement', 'Agency Representation', 'Direct Import'],
    targetMarkets: ['UAE', 'Bahrain', 'Oman'],
    annualRevenue: 'AED 320M',
    employees: '480',
    established: 2000,
    certifications: ['ISO 9001', 'HACCP', 'UAE Food Safety'],
    description:
      'Al Nakheel Trading is a leading FMCG distributor with over two decades of experience in UAE retail. We supply LuLu Hypermarket, Carrefour UAE, Spinneys, and over 2,000 independent grocery outlets. We actively seek halal-certified Asian food brands for private-label and branded distribution.',
    contactName: 'Demo Partnerships Team',
    contactEmail: 'partnerships@example.invalid',
    logoInitials: 'AN',
    logoColor: '#1B5E20',
    featured: true,
  },
  {
    id: 'sa-001',
    name: 'Riyadh Health Solutions Co',
    tagline: 'Medical supply distribution and healthcare procurement for Saudi hospitals',
    role: 'distributor',
    sector: 'Medical Devices',
    products: ['Surgical consumables', 'Diagnostic equipment', 'Hospital furniture', 'PPE'],
    country: 'Saudi Arabia',
    city: 'Riyadh',
    partnershipTypes: ['Distribution Agreement', 'Agency Representation', 'Joint Venture'],
    targetMarkets: ['Saudi Arabia', 'Kuwait', 'Bahrain'],
    annualRevenue: 'SAR 180M',
    employees: '310',
    established: 2005,
    certifications: ['SFDA Registered', 'ISO 13485', 'GMP WHO'],
    description:
      'Riyadh Health Solutions is a licensed medical device distributor with direct contracts with the Ministry of Health, Saudi Aramco Medical, and over 40 private hospital groups. We provide full regulatory registration support for imported medical devices in Saudi Arabia.',
    contactName: 'Demo Partnerships Team',
    contactEmail: 'partnerships@example.invalid',
    logoInitials: 'RH',
    logoColor: '#1565C0',
    featured: true,
  },
  {
    id: 'uae-002',
    name: 'Emirates Beauty Hub LLC',
    tagline: 'Gulf region distributor of premium halal beauty and personal care brands',
    role: 'distributor',
    sector: 'Halal Cosmetics',
    products: ['Halal skincare', 'Colour cosmetics', 'Fragrances', 'Hair care'],
    country: 'UAE',
    city: 'Abu Dhabi',
    partnershipTypes: ['Distribution Agreement', 'Franchise', 'Agency Representation'],
    targetMarkets: ['UAE', 'Saudi Arabia', 'Kuwait', 'Bahrain', 'Qatar'],
    annualRevenue: 'AED 95M',
    employees: '185',
    established: 2010,
    certifications: ['Dubai Municipality Approved', 'ESMA', 'Halal Certified UAE'],
    description:
      'Emirates Beauty Hub distributes halal-certified and natural beauty brands across the GCC through department stores, pharmacies, and beauty specialty chains. We have strong relationships with Sephora Middle East, Boots UAE, and regional e-commerce platforms.',
    contactName: 'Demo Partnerships Team',
    contactEmail: 'partnerships@example.invalid',
    logoInitials: 'EB',
    logoColor: '#AD1457',
    featured: false,
  },
  {
    id: 'qa-001',
    name: 'Doha Industrial Supply WLL',
    tagline: 'Qatar\'s specialist in industrial components and technical rubber products',
    role: 'buyer',
    sector: 'Rubber & Plastics',
    products: ['Industrial seals', 'Hoses & fittings', 'Conveyor belts', 'O-rings'],
    country: 'Qatar',
    city: 'Doha',
    partnershipTypes: ['Direct Import', 'OEM Supply', 'Distribution Agreement'],
    targetMarkets: ['Qatar', 'Kuwait'],
    annualRevenue: 'QAR 85M',
    employees: '140',
    established: 2008,
    certifications: ['ISO 9001', 'Qatar Chamber of Commerce'],
    description:
      'Doha Industrial Supply sources and stocks industrial rubber, plastic, and sealing products for Qatar\'s oil & gas, construction, and water infrastructure sectors. We hold approved vendor status with Qatar Petroleum, KAHRAMAA, and Ashghal.',
    contactName: 'Demo Partnerships Team',
    contactEmail: 'partnerships@example.invalid',
    logoInitials: 'DI',
    logoColor: '#6A1B9A',
    featured: false,
  },
  {
    id: 'kw-001',
    name: 'Gulf Smart Technologies Co',
    tagline: 'Kuwait distributor of industrial electronics and smart building systems',
    role: 'distributor',
    sector: 'Electronics & Electrical',
    products: ['Building automation', 'Industrial IoT', 'Solar inverters', 'LED lighting'],
    country: 'Kuwait',
    city: 'Kuwait City',
    partnershipTypes: ['Distribution Agreement', 'Joint Venture', 'OEM Supply'],
    targetMarkets: ['Kuwait', 'Bahrain', 'Qatar'],
    annualRevenue: 'KWD 12M',
    employees: '210',
    established: 2007,
    certifications: ['ISO 9001', 'Kuwait Municipal License', 'CE Mark'],
    description:
      'Gulf Smart Technologies distributes and integrates smart electronics for Kuwait\'s construction and industrial sectors. We are the exclusive distributor for three European automation brands and actively seek Asian OEM partners for LED and IoT product lines.',
    contactName: 'Demo Partnerships Team',
    contactEmail: 'partnerships@example.invalid',
    logoInitials: 'GS',
    logoColor: '#1B5E20',
    featured: false,
  },
  {
    id: 'bh-001',
    name: 'Manama Hospitality Trading BSC',
    tagline: 'Bahrain\'s leading hospitality procurement and FF&E specialist',
    role: 'buyer',
    sector: 'Timber & Furniture',
    products: ['Hotel FF&E', 'Restaurant furniture', 'Office interiors', 'Outdoor furniture'],
    country: 'Bahrain',
    city: 'Manama',
    partnershipTypes: ['Direct Import', 'OEM Supply', 'Distribution Agreement'],
    targetMarkets: ['Bahrain', 'Saudi Arabia', 'UAE'],
    annualRevenue: 'BHD 8M',
    employees: '95',
    established: 2012,
    certifications: ['Bahrain Chamber of Commerce', 'ISO 9001'],
    description:
      'Manama Hospitality Trading procures furniture, fixtures, and equipment for hotel and resort projects across Bahrain and the Eastern Province of Saudi Arabia. Current pipeline includes three five-star hotel refurbishments and a new resort development in Muharraq.',
    contactName: 'Demo Partnerships Team',
    contactEmail: 'partnerships@example.invalid',
    logoInitials: 'MH',
    logoColor: '#4E342E',
    featured: false,
  },
  {
    id: 'om-001',
    name: 'Muscat Foods International LLC',
    tagline: 'Oman\'s specialist importer of Asian halal foods and specialty groceries',
    role: 'distributor',
    sector: 'Food & Beverage',
    products: ['Asian packaged foods', 'Halal frozen meals', 'Spices & condiments', 'Health foods'],
    country: 'Oman',
    city: 'Muscat',
    partnershipTypes: ['Distribution Agreement', 'Direct Import', 'Agency Representation'],
    targetMarkets: ['Oman', 'UAE'],
    annualRevenue: 'OMR 6M',
    employees: '120',
    established: 2006,
    certifications: ['MOCI Oman', 'HACCP', 'Halal Oman'],
    description:
      'Muscat Foods International imports and distributes Asian food brands across Oman\'s supermarket chains, hypermarkets, and food service channels. We hold distribution agreements with eight Southeast Asian food brands and are actively looking for new Malaysian halal food partners.',
    contactName: 'Demo Partnerships Team',
    contactEmail: 'partnerships@example.invalid',
    logoInitials: 'MF',
    logoColor: '#1E6B4F',
    featured: false,
  },
  {
    id: 'sa-002',
    name: 'Saudi Vision Chemicals Co',
    tagline: 'Industrial chemicals and oleochemical raw material importer for Saudi industry',
    role: 'buyer',
    sector: 'Palm Oil & Oleochemicals',
    products: ['Fatty acids', 'Surfactants', 'Glycerine', 'Lubricant base stocks'],
    country: 'Saudi Arabia',
    city: 'Jeddah',
    partnershipTypes: ['Direct Import', 'Strategic Investment', 'Distribution Agreement'],
    targetMarkets: ['Saudi Arabia', 'Kuwait', 'Bahrain'],
    annualRevenue: 'SAR 240M',
    employees: '380',
    established: 2003,
    certifications: ['SASO', 'ISO 14001', 'REACH Compliant'],
    description:
      'Saudi Vision Chemicals imports oleochemical feedstocks for Saudi Arabia\'s detergent, personal care, and industrial lubricant manufacturers. Following Vision 2030 localisation mandates, we are actively developing partnerships with RSPO-certified Asian producers.',
    contactName: 'Demo Partnerships Team',
    contactEmail: 'partnerships@example.invalid',
    logoInitials: 'SV',
    logoColor: '#C9A84C',
    featured: true,
  },
]

// Companies added via the registration form are stored in localStorage.
export const LOCALSTORAGE_KEY_COMPANIES = 'tgpu_gcc_match_custom_companies'
export const LOCALSTORAGE_KEY_SHORTLIST = 'tgpu_gcc_match_shortlist'
export const LOCALSTORAGE_KEY_INQUIRIES = 'tgpu_gcc_match_inquiries'
