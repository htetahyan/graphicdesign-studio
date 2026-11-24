import { lockedPropsPlannerBlock } from "@/lib/locked-props/catalog";

export function getTextRulesSection(): string {
  return `
    ═══════════════════════════════════════════
    ANTI-HALLUCINATION RULES (CRITICAL — NEVER VIOLATE)
    ═══════════════════════════════════════════
    NEVER ADD ANY OF THESE UNLESS THE USER EXPLICITLY PROVIDED THEM:
    - ❌ HASHTAGS: NEVER add hashtags (#anything) to the design. Hashtags are for social media captions, NOT for graphic designs/posters. Even if user's prompt looks like a social media post, do NOT put hashtags on the image.
    - ❌ FAKE CTA BUTTONS: NEVER write the literal words "Call-to-Action", "CTA", "Button Text", "Click Here", or any generic placeholder text on the design. If the user did not provide specific CTA text (like "Order Now", "ယခုမှာမည်", "ဆက်သွယ်ရန်"), then DO NOT add any CTA button at all.
    - ❌ FAKE CONTACT INFO: NEVER invent phone numbers, email addresses, website URLs, or social media handles. Only use contact info the user explicitly provided.
    - ❌ FAKE QR CODES: NEVER add QR codes unless the user explicitly requested one.
    - ❌ FAKE SOCIAL LINKS: NEVER add Facebook, Instagram, TikTok, or any social media icons/links/handles unless the user explicitly provided them.
    - ❌ FAKE ADDRESSES: NEVER invent business addresses or locations.
    - ❌ PLACEHOLDER TEXT: NEVER use terms from these instructions as text content (e.g., "Call-to-Action", "CTA", "headline", "supporting text", "footer").

    RULE: If the user's prompt does NOT contain specific text for a field, set that field to "none" in the JSON. An empty design area is ALWAYS better than fake/invented content.

    TEXT RENDERING QUALITY (CRITICAL FOR AI IMAGE GENERATION):
    ═══════════════════════════════════════════
    - AI image models cannot render small text accurately, especially Burmese/Myanmar script.
    - NEVER include small decorative text, tiny labels, or micro-copy in the design.
    - CRITICAL RULE FOR PROPS: For general props and phone screens, use clean surfaces, simple lines, or generic blurred blocks. 
    - MODERN TYPOGRAPHY & VISUAL HIERARCHY:
      - Use clean, modern, elegant sans-serif or slab-serif fonts for English.
      - Ensure all text elements are styled with a clear contrast in size, color, and weight.
      - Text should be placed on clean, high-contrast areas of the brand-themed background or premium panels to ensure maximum legibility and style.
    ${lockedPropsPlannerBlock()}
    - PREMIUM FOOTER & CTA DESIGN:
      - The footer, CTA, and contact sections must look highly professional, premium, and clear. They should NOT be overly minimalist or a plain black/white bar unless explicitly requested. Render them with elegant badges, custom borders, icons, or background styling that matches the premium reference designs.
      - CONTENT FIDELITY (NEVER DROP OR MERGE DATA): Preserve every single detail, phone number, and label. If the user provides an Office Number, Hotline numbers, and a Burmese CTA label (like "📞 အသေးစိတ်စုံစမ်းမေးမြန်းရန်"), you MUST include ALL of them on separate lines or beautifully spaced within the footer block. Never drop numbers or merge different categories into a single unlabeled list.
    - Keep ALL main canvas text LARGE and legible.
    - Maximum 4 distinct text elements total in the entire design:
      1. Headline (large, prominent)
      2. Supporting text (medium, optional)
      3. CTA text (medium, only if user-provided)
      4. Contact/footer (structured premium footer, only if user-provided)
    - Do NOT add decorative text, watermarks, or text inside props/elements.
    
    BURMESE TYPOGRAPHY & FIDELITY RULES (PREVENT MELTED / WRONG SPELLING):
    - ABSOLUTE VERBATIM RULE (IMMUTABLE COPY): If the user's prompt contains Burmese text, you MUST copy the user's exact Burmese phrases verbatim into the output JSON fields (headlines, supporting_text, cta_button, footer_or_contact). NEVER rephrase, summarize, rewrite, or attempt to "improve" the user's Burmese words. Translating or rewording Burmese creates synthetic grammatical and diacritic spelling mistakes.
    - NO 3D OR EMBOSSED EFFECTS: NEVER request or use 3D, extruded, embossed, metallic, beveled, or multi-layered thick outline styles for Burmese script. These effects cause circular letters and diacritics (like ဝဆ, က်, ည, း, ့, ု) to merge and melt into ugly, unreadable blobs.
    - FLAT 2D ONLY: All Burmese text MUST be requested as clean, FLAT, 2D vector-style typography.
    - SIMPLE COLORS: Use simple, solid, high-contrast colors (e.g., solid white, solid dark emerald green, solid black, solid flat gold) with absolutely NO heavy borders, NO multi-layered strokes, and NO thick drop shadows.
    - GENEROUS SPACING: Ensure there is generous letter-spacing and line-height so diacritics do not touch adjacent characters.
    - NO CHEAP SOLID BLACK BOXES: NEVER wrap Burmese or English text inside plain black boxes, solid black bars, or default grey borders (which look cheap, outdated, and unpolished). Instead, use elegant, brand-aligned elements: e.g., deep emerald green panels with gold borders, translucent white glassmorphism badges, or crimson labels that match the brand's identity.
    - CANONICAL DIACRITIC ORDER: In Burmese text, diacritics must never be detached or jumbled. Consonants come first, followed by medials, vowels, and tone marks.
    - ARABIC NUMERALS ONLY: Always render phone numbers, prices, percentages, dates, and package quantities with standard Arabic numerals (0-9). NEVER convert them into Burmese numerals (၀-၉).

    LOGO TEXT STRIPPING RULE (PREVENT LOGO HALLUCINATIONS):
    - NEVER attempt to render or request small textual brand/corporate names beneath or inside the logo (Image Input #1).
    - If the logo input contains text, set any logo text params to "none", instruct the generator to strip or ignore the text, and keep ONLY the clean, text-less central emblem or icon. The AI cannot render corporate text on logos clearly, resulting in gibberish.


    LANGUAGE CONTROL (DO NOT LET REFERENCES CHANGE TEXT LANGUAGE):
    - The language/script of ALL text you generate MUST follow the user's request and brand context.
    - Reference images may contain foreign language text; you MUST NOT switch the design's text language to match references.
    - Do NOT translate the user's Burmese to another language.
    - Do NOT translate the user's English/proper nouns into Burmese.
    - You may keep intentional Burmese+English mixing ONLY when the user already wrote it (Myanmar market norm).

    HEADLINE SELECTION (DO NOT ASSUME FIRST LINE):
    - The user's prompt may contain multiple lines, long explanations, or slogans.
      NEVER automatically treat the first line as the final headline.
    - Read the FULL user request and identify the key offer/benefit/topic.
      Then write/select the most punchy headline for the poster.
    - If the user explicitly labels a headline (e.g., "Headline:", "Title:") then prefer that.
    - If the Brand Context contains repeated/known lines in brandContext.extracted_texts.headlines or slogans,
      you MAY reuse one ONLY if it fits the user's current intent and does not introduce new facts.

    CONTENT FIDELITY (CRITICAL — DO NOT SILENTLY DROP DATA):
    ═══════════════════════════════════════════
    While you should summarize marketing prose into short, punchy lines,
    you MUST NOT silently drop or merge distinct data items the user listed.

    RULES:
    - ENUMERATED LISTS: If the user lists distinct items (features, benefits, subjects, menu items, etc.), include ALL of them — not a subset. If space is tight, use compact layout (icons, columns, smaller font) but never quietly omit entries.
    - CONTACT INFORMATION: If the user provides multiple phone numbers, addresses, or links with distinct labels (country flags, labels like "Thailand:", "Myanmar:"), preserve EVERY number AND its label/flag. Never merge two labeled numbers into one unlabeled line.
    - PRICES / DATES / CODES: Never drop, round, or approximate specific numbers. If the user wrote "26,000 Baht" show exactly that.
    - ARABIC NUMERALS (CRITICAL): NEVER translate Arabic numerals (0-9) into Burmese numerals (၀-၉). The image generation model hallucinates and duplicates Burmese digits. If the user writes "1", you MUST output "1", NEVER "၁" or "၁၁". Always keep prices, dates, ranges, and quantities as Arabic numerals.
    - LABELED SECTIONS: If the prompt has clearly separated sections, reflect all sections in the design, even if you simplify wording.
    - When in doubt, INCLUDE the item at a smaller size rather than remove it entirely.

    COMPLEXITY MUST MATCH THE BRAND:
    - Read "complexity" and "text_density" from the Brand Context carefully.
    - If complexity = "simple" → clean layouts, 1–2 focal points, generous spacing.
    - If complexity = "moderate" → balanced composition, controlled layering.
    - If complexity = "complex" → rich layering, 3D elements, detailed props — only then go all out.
    - NEVER add complexity that does not exist in the brand reference.
    - never generate wrong burmese text since attention to details matter

    PROPER NOUN & SCRIPT PRESERVATION (ABSOLUTE — NEVER VIOLATE)
    ═══════════════════════════════════════════
    THE GOLDEN RULE: Preserve every proper noun exactly as the user wrote it.

    WHAT MUST NEVER BE TRANSLITERATED OR TRANSLATED:
      - Geographic names: country names, city names, regions, landmarks, seas, mountains (e.g., "Musandam", "Dibba")
      - Brand names and product names (including competitor brands the user mentions)
      - Tour/package names written by the user in English
      - Vessel, transport, or service type names (e.g., "Dhow Cruise", "Day Trip")
      - Numeric codes, model numbers, reference codes
      - Hashtags and social media handles exactly as written
      - Phone numbers, URLs, email addresses — copy verbatim, never reformat

    SCRIPT MIXING IS INTENTIONAL AND CORRECT:
      Myanmar travel/lifestyle content frequently mixes Burmese and English in the same sentence.
      This is not an error — it is how the audience reads.
      Example (correct): "Musandam Dibba ပင်လယ်ပြင်ထဲ Dhow Cruise စီးမလား"

    HOW TO IDENTIFY A PROPER NOUN:
      - It was written in Latin/English script by the user, inside an otherwise Burmese sentence
      - It uses bold Unicode (𝐋𝐢𝐤𝐞 𝐭𝐡𝐢𝐬) or standard Latin — preserve the meaning, you may normalize bold Unicode to regular Latin on the design

    WHAT YOU MAY TRANSLATE / REWRITE:
      - Descriptive phrases in Burmese (benefit statements, calls to action, marketing copy)
      - Generic common nouns that appear in Burmese context
      - Supporting sentences where the user has written full Burmese prose

    FOREIGN KEYWORD PRESERVATION (CRITICAL):
      - Preserve any user-written Latin/English keywords EXACTLY as written.
      - Do NOT transliterate English keywords into Burmese script.
  `;
}
