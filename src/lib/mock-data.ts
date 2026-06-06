import type {
  DepartmentResult,
  Opportunity,
  PackagingOutput,
  PackagingTab,
  SellerBrief,
  ShopeeListing,
} from "./types";

export const DEMO_BRIEF: SellerBrief = {
  targetMarket: "Singapore",
  targetPlatform: "Shopee",
  sellerType: "Solo seller",
  productMode: "have_product",
  categories: ["Home Appliances", "Electronics accessories"],
  keywords: "mini desk vacuum",
  budgetRange: "SGD 500 – 2,000",
  expectedMargin: "30%",
  maxFulfillmentDays: 14,
  riskPreference: "balanced",
  language: "English",
};

export const DEPARTMENTS: DepartmentResult[] = [
  {
    id: "market",
    department: "Market Department",
    shortName: "Market",
    agent: "Market Agent",
    question: "Which products actually have demand?",
    status: "complete",
    keyFinding:
      "Mini desk vacuum has visible demand in Shopee Singapore — office and student desk scenarios.",
    score: 82,
    evidence: [
      "Steady search interest for 'desk vacuum' and 'keyboard cleaner'.",
      "Medium competitor density — room for a differentiated listing.",
      "Strong review counts on adjacent desk-cleaning tools.",
    ],
    outputPreview: [
      { label: "market_heat", value: "Medium-high" },
      { label: "competitor_density", value: "Medium" },
      { label: "price_band", value: "SGD 8.90 – 19.90" },
    ],
    mission:
      "Judge market heat, search trends, competitor landscape, price band and platform opportunity.",
    inputUsed: ["keyword: mini desk vacuum", "market: Singapore", "platform: Shopee"],
    reasoning:
      "Sampled Shopee SG search results and adjacent categories; estimated demand from competitor review velocity and price clustering.",
    warnings: [],
    impactOnCommittee: "Raises overall confidence — demand is the strongest signal.",
  },
  {
    id: "sourcing",
    department: "Sourcing Department",
    shortName: "Sourcing",
    agent: "Sourcing Agent",
    question: "Can we find stable, low-cost suppliers?",
    status: "complete",
    keyFinding: "3 viable suppliers found. MOQ from 50 units. Fulfillment 10–14 days.",
    score: 76,
    evidence: [
      "3 suppliers with consistent stock history.",
      "Unit cost SGD 3.20–4.50 depending on MOQ.",
      "Two suppliers offer SG-friendly shipping.",
    ],
    outputPreview: [
      { label: "source_price", value: "SGD 3.20 – 4.50" },
      { label: "MOQ", value: "50 units" },
      { label: "reliability", value: "Medium-high" },
    ],
    mission:
      "Find usable supply; judge suppliers, stock, MOQ, fulfillment stability and feasibility.",
    inputUsed: ["product: mini desk vacuum", "budget: SGD 500–2,000"],
    reasoning:
      "Matched product against supplier catalogues; ranked by stock consistency and landed cost.",
    warnings: ["One supplier has inconsistent lead times — avoid for first run."],
    impactOnCommittee: "Supports Go — supply is feasible within budget.",
  },
  {
    id: "margin",
    department: "Margin Department",
    shortName: "Margin",
    agent: "Margin Agent",
    question: "Does it still profit after every fee?",
    status: "running",
    keyFinding:
      "Base scenario nets 31% margin after platform fees, shipping and return reserve.",
    score: 78,
    evidence: [
      "Suggested price SGD 14.90 vs SGD 3.80 landed cost.",
      "Platform + payment fees ~ SGD 1.60.",
      "Return reserve and packaging modeled at SGD 0.90.",
    ],
    outputPreview: [
      { label: "suggested_price", value: "SGD 14.90" },
      { label: "net_margin", value: "31%" },
      { label: "scenario", value: "low 22% · base 31% · high 38%" },
    ],
    mission:
      "Compute real profit: price, cost, platform fees, logistics, ad room, and low/base/high scenarios.",
    inputUsed: ["source_price: SGD 3.80", "price_band: SGD 8.90–19.90"],
    reasoning:
      "Modeled net margin across low/base/high price and return assumptions; included Shopee SG fee schedule.",
    warnings: [],
    impactOnCommittee: "Base margin clears the 30% target — supports Go.",
  },
  {
    id: "risk",
    department: "Risk Department",
    shortName: "Risk",
    agent: "Risk Agent",
    question: "Is it safe to sell under Shopee rules?",
    status: "waiting",
    keyFinding: "Low risk overall; avoid exaggerated suction/medical claims.",
    score: 71,
    evidence: [
      "No battery-shipping red flags for USB-rechargeable unit.",
      "No trademark conflicts on generic naming.",
      "Claim language must avoid 'medical-grade' wording.",
    ],
    outputPreview: [
      { label: "risk_level", value: "Low" },
      { label: "violation_flags", value: "None hard" },
      { label: "note", value: "Avoid exaggerated claims" },
    ],
    mission:
      "Judge platform rules, compliance, infringement, exaggerated claims, battery/electronic safety.",
    inputUsed: ["product specs", "listing draft"],
    reasoning:
      "Checked Shopee SG prohibited/claim rules and battery shipping guidance.",
    warnings: ["Exaggerated suction claims would trigger review."],
    impactOnCommittee: "No blockers — Watch only if claims are aggressive.",
  },
  {
    id: "listing",
    department: "Listing Department",
    shortName: "Listing",
    agent: "Listing Agent",
    question: "How do we turn it into a Shopee page?",
    status: "waiting",
    keyFinding: "All Shopee fields can be generated; title and attributes ready.",
    score: 80,
    evidence: [
      "Category maps to Home Appliances › Vacuum Cleaners.",
      "Title fits Shopee length with primary keywords.",
      "Required attributes available from specs.",
    ],
    outputPreview: [
      { label: "category", value: "Home Appliances › Vacuum" },
      { label: "fields", value: "Complete" },
      { label: "title_len", value: "74 chars" },
    ],
    mission:
      "Generate title, selling points, keywords, image prompts, description and Shopee fields.",
    inputUsed: ["packaging output", "category attributes"],
    reasoning: "Mapped product to Shopee taxonomy and required field set.",
    warnings: [],
    impactOnCommittee: "Listing readiness supports Go.",
  },
  {
    id: "committee",
    department: "Committee Department",
    shortName: "Committee",
    agent: "Committee Agent",
    question: "Go / Watch / Reject — the final call.",
    status: "waiting",
    keyFinding: "Go. Demand, supply and margin align; risk is manageable.",
    score: 82,
    evidence: [
      "Profit viability strong (weight 30%).",
      "Market demand visible (weight 25%).",
      "Compliance risk low (weight 20%).",
    ],
    outputPreview: [
      { label: "decision", value: "Go" },
      { label: "confidence", value: "82%" },
      { label: "next", value: "Select for Packaging Studio" },
    ],
    mission:
      "Aggregate all departments, resolve conflicts, and output Go / Watch / Reject.",
    inputUsed: ["all department scores"],
    reasoning:
      "Weighted profit 30% · demand 25% · risk 20% · fulfillment 15% · listing 10%.",
    warnings: [],
    impactOnCommittee: "This is the Committee.",
  },
];

export const OPPORTUNITIES: Opportunity[] = [
  {
    id: "mini-desk-vacuum",
    productName: "Mini Desk Vacuum",
    productDirection: "Office · Student desk · HDB home",
    sourcePrice: "SGD 3.80",
    suggestedSellingPrice: "SGD 14.90",
    grossMargin: "60%",
    netProfit: "SGD 4.60",
    netMargin: "31%",
    availableStock: "In stock",
    fulfillmentTime: "10–14 days",
    marketHeat: "Medium-high",
    riskLevel: "Low",
    confidenceScore: 82,
    decision: "go",
    keyReason: "Clear scenario, good visuals, manageable risk.",
  },
  {
    id: "cable-organizer",
    productName: "Cable Organizer Set",
    productDirection: "WFH · Travel · Desk setup",
    sourcePrice: "SGD 1.20",
    suggestedSellingPrice: "SGD 8.90",
    grossMargin: "65%",
    netProfit: "SGD 2.50",
    netMargin: "28%",
    availableStock: "In stock",
    fulfillmentTime: "7–12 days",
    marketHeat: "Medium",
    riskLevel: "Low",
    confidenceScore: 79,
    decision: "go",
    keyReason: "Low risk, lightweight, easy fulfillment.",
  },
  {
    id: "portable-dehumidifier",
    productName: "Portable Dehumidifier",
    productDirection: "HDB bedroom · Wardrobe",
    sourcePrice: "SGD 6.50",
    suggestedSellingPrice: "SGD 22.90",
    grossMargin: "55%",
    netProfit: "SGD 5.50",
    netMargin: "24%",
    availableStock: "Low stock",
    fulfillmentTime: "14–21 days",
    marketHeat: "High",
    riskLevel: "Medium",
    confidenceScore: 66,
    decision: "watch",
    keyReason: "Strong humid-climate demand, but electronics + after-sales risk.",
  },
  {
    id: "compact-steamer",
    productName: "Compact Garment Steamer",
    productDirection: "Travel · Clothing care",
    sourcePrice: "SGD 7.20",
    suggestedSellingPrice: "SGD 24.90",
    grossMargin: "54%",
    netProfit: "SGD 5.40",
    netMargin: "22%",
    availableStock: "In stock",
    fulfillmentTime: "14–21 days",
    marketHeat: "Medium",
    riskLevel: "Medium",
    confidenceScore: 61,
    decision: "watch",
    keyReason: "Clear use case, but electrical safety and leak risk.",
  },
];

export const PACKAGING_TABS: PackagingTab[] = [
  { id: "brief", label: "Product Brief", status: "complete" },
  { id: "title", label: "Shopee Title", status: "running" },
  { id: "points", label: "Selling Points", status: "complete" },
  { id: "positioning", label: "Positioning", status: "waiting" },
  { id: "bundle", label: "Bundle Strategy", status: "waiting" },
  { id: "gift", label: "Gift Strategy", status: "waiting" },
  { id: "prompts", label: "Image Prompts", status: "waiting" },
  { id: "main", label: "Main Image", status: "waiting" },
  { id: "lifestyle", label: "Lifestyle Image", status: "waiting" },
  { id: "feature", label: "Feature Image", status: "waiting" },
  { id: "preview", label: "Listing Preview", status: "waiting" },
  { id: "compliance", label: "Compliance Notes", status: "waiting" },
];

export const PACKAGING_OUTPUT: PackagingOutput = {
  productId: "mini-desk-vacuum",
  localizedShopeeTitle:
    "Mini Desk Vacuum Cleaner USB Rechargeable Portable Keyboard Dust Cleaner for Home Office HDB",
  titleCharCount: 92,
  sellingPoints: [
    "USB rechargeable — no battery replacement, office-friendly",
    "Compact design fits any HDB desk or student dorm",
    "Keyboard crevice nozzle — removes crumbs and dust effectively",
  ],
  productDescription:
    "Keep your desk spotless with this compact USB rechargeable mini vacuum. Perfect for keyboards, crumbs and fine dust in small home-office and student spaces.",
  positioningAngle:
    "From a single cleaning gadget into a complete desk cleaning kit for HDB home offices.",
  bundleStrategy: "Desk vacuum + cleaning brush + small storage pouch.",
  giftStrategy: "Free mini brush / replacement nozzle.",
  imagePrompts: [
    "Clean desk with mini vacuum picking up keyboard crumbs, soft daylight",
    "HDB home office desk, laptop and mini vacuum, lifestyle scene",
    "Close-up of crevice nozzle cleaning a mechanical keyboard",
  ],
  heroImageDirection: "Clean desk scene with the vacuum and keyboard crumbs.",
  lifestyleImageDirection: "HDB home office / student dorm context.",
  featureImageDirection: "Keyboard cleaning close-up with feature callouts.",
  complianceNotes: [
    "Avoid 'medical-grade' or exaggerated suction claims.",
    "State USB rechargeable clearly; no separate battery shipping.",
  ],
  priceUpliftReasoning:
    "Packaged as a desk cleaning kit, the listing supports SGD 14.90 vs SGD 8–10 for a bare tool.",
};

export const LISTING: ShopeeListing = {
  productId: "mini-desk-vacuum",
  fields: [
    {
      key: "item_name",
      value:
        "Mini Desk Vacuum Cleaner USB Rechargeable Portable Keyboard Dust Cleaner for Home Office HDB",
      editable: true,
    },
    { key: "price", value: "SGD 14.90", editable: true },
    { key: "stock", value: "100", editable: true },
    { key: "category", value: "Home Appliances › Vacuum Cleaners", editable: false },
    { key: "brand", value: "No Brand", editable: true },
    { key: "condition", value: "New", editable: false },
    {
      key: "description",
      value:
        "Keep your desk spotless with this compact USB rechargeable mini vacuum. Ideal for keyboards, crumbs and fine dust.",
      editable: true,
    },
    { key: "sku", value: "SL-MDV-001", editable: true },
    { key: "variation", value: "White / Pink", editable: true },
    { key: "package_weight", value: "0.35 kg", editable: true },
    { key: "package_dimensions", value: "18 × 8 × 8 cm", editable: true },
  ],
  preview: {
    image: "",
    title:
      "Mini Desk Vacuum Cleaner USB Rechargeable Portable Keyboard Dust Cleaner",
    price: "SGD 14.90",
    bullets: [
      "USB rechargeable, no battery needed",
      "Compact for HDB desk and student dorm",
      "Keyboard crevice nozzle included",
    ],
  },
};

export const HOMEPAGE_STATS = [
  { value: 5, suffix: " products", label: "validated per run", sub: "market · margin · risk" },
  { prefix: "SGD ", value: 14.9, decimals: 2, label: "avg suggested price", sub: "from SGD 3.80 cost" },
  { value: 31, suffix: "%", label: "net margin after", sub: "fees · shipping · returns" },
  { value: 11, suffix: " min", label: "brief to Shopee-ready", sub: "launch pack" },
];

export const BOARD_SUMMARY = {
  found: OPPORTUNITIES.length,
  go: OPPORTUNITIES.filter((o) => o.decision === "go").length,
  watch: OPPORTUNITIES.filter((o) => o.decision === "watch").length,
  reject: OPPORTUNITIES.filter((o) => o.decision === "reject").length,
  avgMargin: "28%",
  riskFlags: 1,
};
