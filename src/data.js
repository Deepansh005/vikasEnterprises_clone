const asset = (name) => `/assets/${name}`;

export const contact = {
  address: '10292, 1st Floor, Tokri Walan, Library Road, Azad Market, Delhi-110006',
  branch: '2096/1, 1st Floor, Chah Indara, Bhagirath Palace, Chandni Chowk, Delhi-110006',
  phone: '+91-9213811070',
  email: 'info@vikasenterprises.org',
};

export const productLinks = [
  { label: 'Cable Ties', path: '/cable-ties/' },
  { label: 'Fastening Solutions', path: '/fastening-solutions/' },
  { label: 'Wire Connectors & Terminals', path: '/wire-connectors-terminals/' },
  { label: 'Cable Markers / Ferrules', path: '/cable-markers-ferrules/' },
  { label: 'Cable Protection', path: '/cable-protection/' },
  { label: 'Tools (Cable Ties & Terminals)', path: '/tools-cable-ties-terminals/' },
  { label: 'Nylon Cable Glands', path: '/nylon-cable-glands/' },
];

const specs = (...lines) => lines;

export const products = {
  '/cable-ties/': {
    title: 'Cable Ties',
    sections: [
      ['Nylon Cable Ties (Length 75mm - 1500mm)', specs('Material: Internationally Approved Nylon 66, UL94 V2', 'Range Availability: Length 75mm - 1500mm, Width 2.5mm - 9.0mm', 'Tensile Strength: 8.1 kg.(18 lbs.) - 79.4 kg.(175 lbs.)', 'Colour Availability: Natural White & Black'), 'Nylon-Cable-Ties.jpg'],
      ['Heavy Duty Cable Ties (width 7.6mm, 9.0mm)', specs('Material: Internationally Approved Nylon 66, UL94 V2', 'Range Availability: Length 200mm - 1020mm, Width 7.6mm - 9.0mm', 'Tensile Strength: 8.1 kg.(18 lbs.) - 79.4 kg.(175 lbs.)', 'Colour Availability: Natural White & Black'), 'Heavy-Duty-Cable-Ties.jpg'],
      ['Weather Resistant Cable Ties (UV Cable Ties)', specs('Material: Internationally Approved Nylon 66 UV, UL94 V2', 'Range Availability: Length 100mm - 450mm, Width 2.5mm - 4.8mm', 'Tensile Strength: 8.1 kg.(18 lbs.) - 22.2 kg.(50 lbs.)', 'Colour Availability: Black'), 'Weather-Resistant-Cable-Ties.jpg'],
      ['Heat Resistant Cable Ties', specs('Material: Internationally Approved Nylon 66 heat-resistant, UL94 V2', 'Range Availability: Length 100mm - 1220mm, Width 2.5mm - 9.0mm', 'Tensile Strength: 8.1 kg.(18 lbs.) - 79.4 kg.(175 lbs.)', 'Colour Availability: Natural White & Black'), 'Heat-Resistant-Cable-Ties.jpg'],
      ['Flame Retardant Cable Ties', specs('Material: Internationally Approved Nylon 66 flame retardant, UL94 V0', 'Range Availability: Length 100mm - 200mm, Width 2.5mm - 4.8mm', 'Tensile Strength: 8.1 kg.(18 lbs.) - 22.2 kg.(50 lbs.)', 'Colour Availability: Natural White & Black'), 'Flame-Retardant-Cable-Ties.jpg'],
      ['Releasable Cable Ties', specs('Material: Internationally Approved Nylon 66, UL94 V2', 'Range Availability: Length 200mm - 300mm, Width 4.8mm', 'Tensile Strength: 22.2 kg.(50 lbs.)', 'Colour Availability: Natural White & Black'), 'Releasable-Cable-Ties.jpg'],
      ['Push Mount Cable Ties', specs('Material: Internationally Approved Nylon 66, UL94 V2', 'Range Availability: Length 130mm - 200mm, Width 2.5mm - 4.8mm', 'Tensile Strength: 8.1 kg.(18 lbs.) - 22.2 kg.(50 lbs.)', 'Colour Availability: Natural White & Black'), 'Push-Mount-Cable-Ties.jpg'],
      ['Marker Cable Ties', specs('Material: Internationally Approved Nylon 66, UL94 V2', 'Range Availability: Length 100mm - 200mm, Width 2.5mm', 'Tensile Strength: 8.1 kg.(18 lbs.) - 22.2 kg.(50 lbs.)', 'Colour Availability: Natural White'), 'Marker-Cable-Ties.jpg'],
      ['Mountable Head cable Ties', specs('Material: Internationally Approved Nylon 66, UL94 V2', 'Range Availability: Length 200mm, Width 4.8mm', 'Tensile Strength: 22.2 kg.(50 lbs.)', 'Colour Availability: Natural White'), 'Mountable-Head-cable-Ties.jpg'],
      ['Stainless Steel Cable Ties', specs('Material: Internationally Approved Stainless steel type: #304 & #316', 'Range Availability: Length 130mm - 1020mm, Width 4.8mm - 7.6mm', 'Tensile Strength: 46 kg.(101.2 lbs.) - 114 kg.(250.8 lbs.)', 'Colour Availability: Steel'), 'Stainless-Steel-Cable-Ties.jpg'],
    ],
  },
  '/fastening-solutions/': {
    title: 'Fastening Solutions',
    sections: [
      ['Self Adhesive Cable Tie Mounts', specs('Material: Nylon 66, UL94 V2', 'Colour: Natural White & Black Colour'), 'Self-Adhesive-Cable-Tie-Mounts.jpg'],
      ['Twist Lock', specs('Material: Nylon 66, UL94 V2', 'Colour: Natural White'), 'Twist-Lock.jpg'],
      ['P Clips (R-Shape Cable Clamps)', specs('Material: Nylon 66, UL94 V2', 'Colour: Natural White'), 'P-Clips-R-Shape-Cable-Clamps.jpg'],
    ],
  },
  '/wire-connectors-terminals/': {
    title: 'Wire Connectors & Terminals',
    sections: [
      ['Close-end Connectors (CE1, CE2, CE5, CE8)', specs('Material: UL approved Nylon PA66. UL, CSA, CQC, CE approved.', 'Colour: Natural White & Milky White'), 'Close-end-Connectors.jpg'],
      ['Non-Insulated Pin Terminals', specs('Material: Copper Tubes'), 'Non-Insulated-Pin-Terminals.jpg'],
      ['Vinyl-Insulated Pin Terminals', specs('Material: UL Approved Copper tube with tin plated end sleeves with insulation PVC', 'Colour: Red, Blue, Yellow'), 'Vinyl-Insulated-Pin-Terminals.jpg'],
      ['Vinyl-Insulated Male / Female Disconnectors', specs('Material: Copper tube with tin plated end sleeves with insulation PVC', 'Colour: Red, Blue, Yellow'), 'Vinyl-Insulated-Male-Female-Disconnectors.jpg'],
      ['Copper / Cable Lugs Copper Cable Terminals & Accessories', [], ['Copper-Cable-Lugs-Copper-Cable-Terminals-Accessories.jpg', 'Copper-Cable-Lugs-Copper-Cable-Terminals-Accessories-1.jpg']],
    ],
  },
  '/cable-markers-ferrules/': {
    title: 'Cable Markers / Ferrules',
    sections: [['EC Type Cable Marker', specs('Material Specification: Soft PVC', 'Available size: 0.65 sq mm, 1 sq mm, 2.5 sq mm, 4.0 sq mm, 6.0 sq mm, 10.0 sq mm, 16.0 sq mm, 25.0 sq mm, 35.0 sq mm'), 'EC-Type-Cable-Marker.jpg']],
  },
  '/cable-protection/': {
    title: 'Cable Protection',
    sections: [
      ['Wrapping Bands (Spiral)', specs('Material: PE', 'Colour: Natural White & Black', 'Available size: 3, 6, 9, 12, 15, 19, 25, 38, 50'), 'Wrapping-Bands-Spiral.jpg'],
      ['Heat Shrinkable Tubes (HS Tubes)', specs('Material: Polyolefin Heat Shrinkable Tubing', 'Colour: All Colours'), 'Heat-Shrinkable-Tubes-HS-Tubes.jpg'],
    ],
  },
  '/tools-cable-ties-terminals/': {
    title: 'Tools (Cable Ties & Terminals)',
    sections: [
      ['Cable Ties Cramping Tools GIT-702P', specs('For fast, safe tensioning and cut off cable tie from width 2.4mm to 4.8mm'), 'Cable-Ties-Cramping-Tools-GIT-702P.jpg'],
      ['Cable Ties Cramping Tools GIT-702M', specs('For fast, safe tensioning and cut off of cable tie from width 2.4mm to 4.8mm'), 'Cable-Ties-Cramping-Tools-GIT-702M.jpg'],
      ['Cable Ties Cramping Tools GIT-704', specs('For cable tie thickness 1.3mm~2.3mm and width 3.6mm~9.5mm'), 'Cable-Ties-Cramping-Tools-GIT-704.jpg'],
      ['Closed End Connectors Cramping Tools', specs('Suitable Wire Range: 1 - 5mm2 (AWG 22-12)', 'Suitable Wire Range: 4 - 10mm2 (AWG 12-8)'), 'Closed-End-Connectors-Cramping-Tools.jpg'],
      ['Cord end Terminals Cramping Tools', specs('For terminals with wire range: 0.5~4mm2 (AWG 12-22)', 'For terminals with wire range: 6~16mm2 (AWG 6-10)', 'Suitable wire range: 10~25mm2 (AWG 4-8)', 'For terminals with wire range: 25~50mm2 (AWG 1-4)'), 'Cord-end-Terminals-Cramping-Tools.jpg'],
    ],
  },
  '/nylon-cable-glands/': {
    title: 'Nylon Cable Glands',
    sections: [['Nylon Cable Glands', specs('Material: Nylon 66, UL94 V2. Neoprene for seal insert, with nut', 'Colour: Black, Gray, Light Gray', 'Specification: The gland can stand the temp. Up to 140ºC (284°F) in short time.', 'Availability: PG-07, PG-09, PG-11, PG-13.5, PG-16, PG-21, PG-29, PG36, PG-42, PG-48'), 'Nylon-Cable-Glands.jpg']],
  },
};

export const partners = [
  { name: 'Giantlok Co. Ltd., Giantlok India Pvt. Ltd.', image: 'giantlok.jpg', text: 'Giantlok® is one of the brands of Hua Wei Industrial Co., Ltd., the leading manufacturer of cable ties and wiring accessories. Its products serve customers in more than 75 countries with world-class quality. Giantlok® is certified to ISO9001, ISO14001, and ISO/TS16949 and offers cable ties, stainless steel ties, security ties, markers, clamps, fasteners, clips, connectors, terminals, and cable protection.' },
  { name: 'Kai Suh Suh Enterprise Co. Ltd. (Taiwan)', image: 'kss.jpg', text: 'KSS, KAI SUH SUH ENTERPRISE CO., LTD. was established in 1969 as a leading manufacturer of cable ties and wiring accessories in Asia. It serves accounts in Taiwan and more than 110 countries, and its products are approved by UL, CSA, VDE, DNV, GL, LLOYD, CE, ABS, IP68 and other standards.' },
  { name: 'Foshan Shunde Kaixiang Electrical Co. Ltd. (China)', image: 'foshan.jpg', text: 'Established in 1995, Foshan Shunde Kaixiang Electrical Co. Ltd. is a leading manufacturer of high quality wiring products. Its wire connectors are designed according to international safety requirements and certified by CQC, CE, UL, CUL (CSA), VDE and other European institutions.' },
];

export const homeSlides = ['cropped-slide-3-1.jpg', 'cropped-slide-1-3.jpg', 'cropped-slide-2-1.jpg'];
export const homeProducts = [
  ['Cable Ties', 'cropped-Nylon-Cable-Ties-1.jpg', '/cable-ties/'],
  ['Fastening Solutions', 'cropped-Self-Adhesive-Cable-Tie-Mounts-1.jpg', '/fastening-solutions/'],
  ['Wire Connectors & Terminals', 'cropped-Close-end-Connectors-1.jpg', '/wire-connectors-terminals/'],
  ['Cable Markers / Ferrules', 'cropped-EC-Type-Cable-Marker-1.jpg', '/cable-markers-ferrules/'],
  ['Cable Protection', 'cropped-Wrapping-Bands-Spiral-1.jpg', '/cable-protection/'],
  ['Tools (Cable Ties & Terminals)', 'cropped-Cable-Ties-Cramping-Tools-GIT-702P.jpg', '/tools-cable-ties-terminals/'],
  ['Nylon Cable Glands', 'cropped-Nylon-Cable-Glands-1.jpg', '/nylon-cable-glands/'],
].map(([label, image, path]) => ({ label, image: asset(image), path }));
