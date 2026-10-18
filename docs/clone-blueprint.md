# Vikas Enterprises Clone Blueprint

## Source and Scope

Reference: https://www.vikasenterprises.org/ and the supplied screenshots. The screenshots show Chrome zoom levels of 33%, 50%, and 100%; they are used for content and composition only, not exact CSS measurement. Live page extraction verified the routes, visible copy, public asset URLs, and form fields. Computed CSS, intrinsic image dimensions, breakpoints, slider timing, and the original form endpoint remain unknown.

## Existing-Project Audit

The workspace was empty before implementation. It contained no framework, package manifest, routes, components, styles, local images, or existing features. The clone is therefore initialized with React, Vite, and JavaScript. There is no application behavior to preserve.

The likely fidelity risks are legacy WordPress spacing and typography, the narrow centered content wrapper, small product imagery, banner cropping, alternating pale-blue rows, long footer columns, dropdown behavior, and responsive wrapping. The clone should preserve the source structure rather than modernize it into cards or a dashboard.

## Page Inventory

| Page | Route | Main content |
| --- | --- | --- |
| Home | `/` | Feature indicators, intro/hero slider, product links, channel partner overview, footer |
| About Us | `/about-us/` | Company introduction, business type, ownership/capital, legal profile, why us |
| Cable Ties | `/cable-ties/` | Ten cable-tie product sections |
| Fastening Solutions | `/fastening-solutions/` | Self Adhesive Cable Tie Mounts, Twist Lock, P Clips |
| Wire Connectors & Terminals | `/wire-connectors-terminals/` | Five connector/terminal sections |
| Cable Markers / Ferrules | `/cable-markers-ferrules/` | EC Type Cable Marker |
| Cable Protection | `/cable-protection/` | Wrapping Bands (Spiral), Heat Shrinkable Tubes |
| Tools (Cable Ties & Terminals) | `/tools-cable-ties-terminals/` | Five tools/tool groups |
| Nylon Cable Glands | `/nylon-cable-glands/` | Nylon Cable Glands |
| Channel Partners | `/channel-partners/` | Giantlok, KSS Taiwan, Foshan Shunde Kaixiang |
| Contact Us | `/contact-us/` | Contact details and Name, Contact No., Email, Message form |

The header navigation is Home, About Us, Products, Channel Partners, Contact Us. Products contains exactly the seven product routes above. The logo links to `/`. The source exposes a desktop dropdown; exact hover/click and mobile menu behavior requires browser verification.

## Shared Layout Blueprint

1. A thin cyan top strip contains the Delhi address, telephone, and email with small light icons.
2. A white navigation bar contains the Vikas Enterprises logo toward the left of the centered content area and compact uppercase navigation toward the right.
3. Products opens a compact dropdown containing the seven category links.
4. Interior pages show a wide industrial image banner with a dark overlay and a centered white page title. The banner uses the same industrial/cable imagery across pages.
5. Main content is a narrow centered wrapper with substantial white space. Product entries use small blue headings, very small dark specifications, and images placed beside copy. Some pages group two products across a row; long pages alternate white and very pale-blue horizontal bands.
6. The footer is dark charcoal and uses narrow columns for Introduction, Our Products, and Contact Details, with a larger Vikas Enterprises wordmark/title area. It repeats across pages.
7. At smaller widths, columns stack or wrap, product text and images become vertical/flowing, navigation must remain usable, and long labels must wrap without overflow. Exact source breakpoints are unknown and should be tuned against the live page at 100% zoom.

## Page-by-Page Visual Blueprint

### Home

Feature indicators appear first: Material Quality, Range Availability, Tensile Strength, Colour Availability. The intro area pairs the company heading and short introduction with a three-image industrial slider. A small learn-more link points to About Us. The product area lists seven category links with compact imagery and learn-more arrows. The channel partner area introduces Giantlok, KSS, and Foshan. The page ends with the shared footer.

### About Us

Page banner title is About Us. Main copy is long-form and left-aligned within the narrow wrapper. Verified copy describes Vikas Enterprises as a wholesaler, supplier, manufacturer, and trader of electrical, control-panel, wiring, adhesive, and abrasive products, located in Azad Market/Bhagirath Palace, New Delhi. It lists products including nylon and stainless cable ties, cable markers/ferrules, tie mounts, spiral winding, sleeves, copper tube end caps, clips, tools, fasteners, PG glands, copper lugs, glass fuse, rubber band, and panel accessories. Visible labeled sections include BUSINESS TYPE (Trader, Supplier, Distributar, Manufacturer), OWNERSHIP & CAPITAL, LEGAL PROFILE, and WHY US ?. Preserve the source wording and blank/unknown section content.

### Cable Ties

Ten compact entries in this order: Nylon Cable Ties (Length 75mm - 1500mm), Heavy Duty Cable Ties (width 7.6mm, 9.0mm), Weather Resistant Cable Ties (UV Cable Ties), Heat Resistant Cable Ties, Flame Retardant Cable Ties, Releasable Cable Ties, Push Mount Cable Ties, Marker Cable Ties, Mountable Head cable Ties, Stainless Steel Cable Ties. Entries pair a blue heading and small specification block with a small product image. Preserve exact units, material, length/width, tensile, and color values from the source. Use alternating pale-blue horizontal bands where shown in the reference.

### Fastening Solutions

Three entries: Self Adhesive Cable Tie Mounts, Twist Lock, P Clips (R-Shape Cable Clamps). The screenshots show a two-column first row and a pale-blue second row. Each entry has compact copy and a small product image.

### Wire Connectors & Terminals

Five entries in source order: Close-end Connectors (CE1, CE2, CE5, CE8), Non-Insulated Pin Terminals, Vinyl-Insulated Pin Terminals, Vinyl-Insulated Male / Female Disconnectors, Copper / Cable Lugs Copper Cable Terminals & Accessories. The first two appear together, the next two in a pale-blue band, and the final lug entry uses two product images. Preserve small text and image proportions.

### Cable Markers / Ferrules

One compact EC Type Cable Marker entry. Verified specification: Soft PVC; available sizes 0.65 sq mm, 1 sq mm, 2.5 sq mm, 4.0 sq mm, 6.0 sq mm, 10.0 sq mm, 16.0 sq mm, 25.0 sq mm, 35.0 sq mm. Image sits beside the copy with wide surrounding white space.

### Cable Protection

Two entries in one row: Wrapping Bands (Spiral) and Heat Shrinkable Tubes (HS Tubes). Specifications are PE, Natural White & Black, sizes 3, 6, 9, 12, 15, 19, 25, 38, 50; and Polyolefin Heat Shrinkable Tubing, All Colours. Images sit to the right of each compact description.

### Tools (Cable Ties & Terminals)

Five entries: Cable Ties Cramping Tools GIT-702P, GIT-702M, GIT-704, Closed End Connectors Cramping Tools, Cord end Terminals Cramping Tools. The reference shows compact two-column arrangements and a pale-blue band for one group. Preserve tool-specific wire/width ranges and image placement.

### Nylon Cable Glands

One compact entry. Verified specification: Nylon 66, UL94 V2; Neoprene for seal insert, with nut; Black, Gray, Light Gray; temperature up to 140 C (284 F) for a short time; PG-07, PG-09, PG-11, PG-13.5, PG-16, PG-21, PG-29, PG36, PG-42, PG-48. The product image sits beside the text.

### Channel Partners

Three long-form sections in order: Giantlok Co. Ltd., Giantlok India Pvt. Ltd.; Kai Suh Suh Enterprise Co. Ltd. (Taiwan); Foshan Shunde Kaixiang Electrical Co. Ltd. (China). Each has a partner logo/image and descriptive paragraphs. This is prose-led content, not a logo card grid. Preserve the source certification, manufacturing, geography, and product-capability copy where available.

### Contact Us

Two-column main content: Contact Details on the left and Contact Form on the right at desktop widths. Details show the main Delhi address, branch office address, phone, and email. Form fields are Name with First/Last inputs, Contact No., Email, Message textarea, and Submit button. Add client-side required-field validation; without an authorized backend, show a clearly labeled local/demo confirmation and never claim email delivery.

## Asset Inventory

Public assets verified under `https://www.vikasenterprises.org/wp-content/uploads/` include:

- Brand/logo marks: `2019/12/6logo.jpg`, `2019/12/2logo.jpg`, `2019/12/4logo.jpg`.
- Homepage/banner slider: `2019/12/cropped-slide-3-1.jpg`, `cropped-slide-1-3.jpg`, `cropped-slide-2-1.jpg`.
- Homepage category images: `2019/12/cropped-Self-Adhesive-Cable-Tie-Mounts-1.jpg`, `cropped-Close-end-Connectors-1.jpg`, `cropped-EC-Type-Cable-Marker-1.jpg`, `2020/01/cropped-Wrapping-Bands-Spiral-1.jpg`, `cropped-Cable-Ties-Cramping-Tools-GIT-702P.jpg`, `cropped-Nylon-Cable-Glands-1.jpg`, and `2019/12/cropped-Nylon-Cable-Ties-1.jpg`.
- Product assets: `Nylon-Cable-Ties.jpg`, `Heavy-Duty-Cable-Ties.jpg`, `Weather-Resistant-Cable-Ties.jpg`, `Flame-Retardant-Cable-Ties.jpg`, `Releasable-Cable-Ties.jpg`, `Push-Mount-Cable-Ties.jpg`, `Marker-Cable-Ties.jpg`, `Mountable-Head-cable-Ties.jpg`, `Stainless-Steel-Cable-Ties.jpg`, `Self-Adhesive-Cable-Tie-Mounts.jpg`, `Twist-Lock.jpg`, `P-Clips-R-Shape-Cable-Clamps.jpg`, `Close-end-Connectors.jpg`, `Non-Insulated-Pin-Terminals.jpg`, `Vinyl-Insulated-Pin-Terminals.jpg`, `Vinyl-Insulated-Male-Female-Disconnectors.jpg`, `Copper-Cable-Lugs-Copper-Cable-Terminals-Accessories.jpg`, `Copper-Cable-Lugs-Copper-Cable-Terminals-Accessories-1.jpg`, `EC-Type-Cable-Marker.jpg`, `Wrapping-Bands-Spiral.jpg`, `Heat-Shrinkable-Tubes-HS-Tubes.jpg`, `Cable-Ties-Cramping-Tools-GIT-702P.jpg`, `Cable-Ties-Cramping-Tools-GIT-702M.jpg`, `Cable-Ties-Cramping-Tools-GIT-704.jpg`, `Closed-End-Connectors-Cramping-Tools.jpg`, `Cord-end-Terminals-Cramping-Tools.jpg`, and `Nylon-Cable-Glands.jpg`.
- Partner logos: `2019/12/giantlok.jpg`, `kss.jpg`, `foshan.jpg`.

Asset URLs are public and retrievable at research time. Local copies require permission review. Intrinsic dimensions, theme CSS, exact logo file used by the header, and any missing decorative icons were not exposed by extraction. Failed retrievals must be recorded and receive only a neutral fallback.

## Content and Data Inventory

Public contact data: `10292, 1st Floor, Tokri Walan, Library Road, Azad Market, Delhi-110006`; branch `2096/1, 1st Floor, Chah Indara, Bhagirath Palace, Chandni Chowk, Delhi-110006`; phone `+91-9213811070`; email `info@vikasenterprises.org`.

Company introduction: Vikas Enterprises is led by professionals and supplies industrial consumables including cable ties, cable glands, closed-end connectors, terminals, wrapping bands, markers, electrical/electronic, adhesive, and abrasive items. About Us adds the Delhi location, nationwide clients, quality products, competitive pricing, on-time delivery, sourcing from India and abroad, and long-term customer relationships.

Partner data: Giantlok is associated with Hua Wei Industrial Co. Ltd. and cable ties/wiring accessories; KSS was established in 1969 and serves Taiwan and global markets; Foshan Shunde Kaixiang Electrical Co. Ltd. was established in 1995 and makes wiring products and connectors. The complete long-form source paragraphs should be preserved from the live page where available.

Form data: Name (First and Last), Contact No., Email, Message, Submit. The original validation and submission endpoint are unknown.

## Design-Token Estimates

| Token | Status | Value/assumption |
| --- | --- | --- |
| Brand cyan/blue | visual estimate | Bright cyan top strip and link accents, approximately `#05aee8` / `#008fe0`; sample live CSS before final tuning |
| Text | visual estimate | Compact sans-serif, regular body and bold headings; exact font unknown |
| Header | screenshot composition | Cyan utility strip, white navigation bar, then banner; exact CSS heights unknown |
| Banner | screenshot composition | Wide industrial image with dark overlay and centered white title; exact height/crop unknown |
| Content width | approximate | Narrow centered desktop wrapper, visually around 540-700px in supplied screenshots at mixed zoom |
| Product image | screenshot composition | Small image beside copy, generally around 120-180px visual width at 100% reference; intrinsic sizes unknown |
| Alternating row | visual estimate | Very pale blue, approximately `#f3faff` |
| Footer | visual estimate | Charcoal/near-black background around `#202020`, white/light-gray compact text |
| Spacing | visual estimate | Large vertical whitespace around compact product rows; exact margins unknown |
| Breakpoints | unknown | Must be tuned by matching live browser behavior at desktop and mobile widths |

## Visual-Fidelity Checklist

- [ ] Header utility strip contains exact address, phone, email, and compact icon treatment.
- [ ] Logo proportions and placement match the original.
- [ ] Navigation alignment, uppercase labels, active-page state, and Products dropdown links match.
- [ ] Desktop dropdown and mobile navigation remain usable without changing the information architecture.
- [ ] Banner uses the correct industrial image, dark overlay, title position, crop, and height.
- [ ] Main wrapper remains narrow and centered with original whitespace.
- [ ] Product pages preserve source order, compact headings, small specification text, image placement, and two-column groupings.
- [ ] Pale-blue alternating bands appear on the same product groups as the reference.
- [ ] Product images preserve aspect ratios and use recovered originals.
- [ ] Homepage feature indicators, hero/slider, products, and partners appear in source order.
- [ ] About Us retains long-form copy and labeled sections.
- [ ] Channel Partners retains three prose-led sections and partner images.
- [ ] Contact page retains two-column desktop arrangement, exact fields, validation, and honest demo confirmation.
- [ ] Footer columns, links, contact details, dark background, and vertical placement match.
- [ ] Desktop and mobile layouts have no overflow or overlapping text.
- [ ] Local and original pages are compared at 100% browser zoom and identical viewport sizes.
- [ ] Remaining differences are documented rather than described as pixel-perfect.

## Known Deviations and Questions

The original theme's computed CSS, exact font, breakpoints, slider timing/controls, image intrinsic dimensions, dropdown runtime behavior, and contact submission backend were not verified. The screenshots have mixed zoom and unknown viewport metadata. Asset licensing for local copies is not established by URL accessibility alone. These items must be checked during browser comparison and documented in the implementation handoff.
