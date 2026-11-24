export const textRulesPrompt = `
    TEXT RULES:
    ═══════════════════════════════════════════
PROPER NOUN & SCRIPT PRESERVATION (ABSOLUTE — NEVER VIOLATE)
═══════════════════════════════════════════

THE GOLDEN RULE: Preserve every proper noun exactly as the user wrote it.

WHAT MUST NEVER BE TRANSLITERATED OR TRANSLATED:
  - Geographic names: country names, city names, regions, landmarks, seas, mountains
    ✅ Keep: "Musandam", "Dibba"
    ❌ Never: "မူဆန်ဒမ်", "ဩမန်", (unless the user wrote it this way)
  - Brand names and product names (including competitor brands the user mentions)
  - Tour/package names written by the user in English
  - Vessel, transport, or service type names (e.g., "Dhow Cruise", "Day Trip")
  - Numeric codes, model numbers, reference codes
  - Hashtags and social media handles exactly as written
  - Phone numbers, URLs, email addresses — copy verbatim, never reformat
  - Country flags and labels with phone numbers — if user writes preserve the EXACT flag/label + number pairing. NEVER:
    - Drop or change the flag emoji
    - Merge multiple labeled numbers into one unlabeled line
    - Swap which number belongs to which country
    - Remove the country label

SCRIPT MIXING IS INTENTIONAL AND CORRECT:
  Myanmar travel/lifestyle content frequently mixes Burmese and English in the same sentence.
  This is not an error — it is how the audience reads.

HOW TO IDENTIFY A PROPER NOUN:
  - It was written in Latin/English script by the user, inside an otherwise Burmese sentence
  - It is a named place, named product, named service, or named organization
  - It uses bold Unicode (𝐋𝐢𝐤𝐞 𝐭𝐡𝐢𝐬) or standard Latin — preserve the meaning, you may normalize bold Unicode to regular Latin on the design

WHAT YOU MAY TRANSLATE / REWRITE:
  - Descriptive phrases in Burmese (benefit statements, calls to action, marketing copy)
  - Generic common nouns that appear in Burmese context
  - Supporting sentences where the user has written full Burmese prose

🚨 FACEBOOK POST HEADLINE EXTRACTION (CRITICAL):
  When the user's input is a Facebook post (long-form narrative with mixed content):

  1. IDENTIFY THE MAIN OFFER/HEADLINE, NOT RHETORICAL QUESTIONS:
     - ❌ BAD: Picking "ED Visa အခက်အခဲလား?" (rhetorical question from body)
     - ✅ GOOD: "Free Visa & Education Consulting Session" (the actual offer)
     - Look for: Free offers, service names, main benefits, event titles
     - Avoid: Questions, problem statements, opening hooks, filler text

  2. HEADLINE HIERARCHY (pick in this order):
     - Priority 1: Explicit headline/offer stated clearly 
     - Priority 2: Main service/event being promoted
     - Priority 3: Key benefit statement
     - NEVER: Rhetorical questions, problem framing, casual opening lines

  3. IF CUSTOM HEADLINE PROVIDED BY USER:
     - ALWAYS prioritize user-provided headline from Advanced Settings
     - Override any extracted text with user's explicit headline choice

🚨 FACEBOOK POST CTA EXTRACTION (CRITICAL):
  When the user's input is a Facebook post with a call-to-action at the end:

  1. IDENTIFY THE CTA - Look for these patterns:
     - Contact instructions: "💌 ဆက်သွယ်ရန်", "📩 Message ပို့ရန်"
     - Purchase instructions: "ဝယ်ယူရန်", "မှာယူရန်",
     - Messenger/Page references: "Page Messenger", "Chat Box", "Inbox"
  
  2. CTA EXTRACTION RULES:
     - ✅ INCLUDE the contact method (Messenger, phone, visit)
     - ✅ INCLUDE the action (buy, contact, inquire)
     - ✅ Shorten if too long but keep the core message
  
  3. CTA PLACEMENT:
     - Put extracted CTA in typography_specifications.footer_or_contact
     - Style it as a clear call-to-action button or highlighted text
     - Make it visually distinct (different color, weight, or background)
  
  4. IF CUSTOM CTA PROVIDED IN ADVANCED SETTINGS:
     - ALWAYS use the custom CTA from settings
     - Ignore extracted CTA from prompt text

🚨 BURMESE SEMANTIC PRESERVATION (CRITICAL):
  When summarizing or shortening Burmese text for a design, you MUST:

  1. UNDERSTAND THE FULL MEANING before summarizing.
     - Read the ENTIRE user prompt in context before picking headline/tagline text.
     - Do not take isolated phrases out of context.

  2. PRESERVE POLARITY (positive vs negative meaning).
     - If the user says something POSITIVE (e.g. "100% success"), keep it positive.
     - If the user says something is GUARANTEED NOT to happen, do NOT flip it to sound like you're guaranteeing it WILL happen.
     - Burmese negation particles are critical. Dropping them reverses meaning.

  3. WHEN IN DOUBT, USE POSITIVE FRAMING.
     - Instead of complex negated sentences, rephrase as a simple positive claim.

  4. NEVER INVENT CLAIMS the user didn't make.
     - Only include claims/guarantees that the user's prompt explicitly states.
     - Do not exaggerate or add marketing claims beyond what was written.

DETECTION CHECKLIST — before writing any text element, ask:
  □ Is this a place name? → Keep in original script
  □ Is this a brand/product/service name? → Keep in original script
  □ Did the user write this in English even inside a Burmese sentence? → Keep in original script
  □ Is this descriptive marketing copy? → May summarize/rewrite in Burmese

    - Use the user's content as the source of truth, but you may rewrite/summarize to reduce text.
    - Never invent new facts (prices, dates, locations, phone numbers).
    - Extract and keep only key facts when present:
      - Offer / benefit
      - Price / cashback / discount
      - Deadline / date
      - CTA
      - Contact info (only if provided)
    - Burmese text: exact Unicode spelling, zero errors.
    - If both Burmese and English exist, Burmese can be primary; keep English minimal.
    - Describe Burmese text style visually (e.g., "bold rounded Burmese sans-serif, white with soft drop shadow").

    LAYOUT INTELLIGENCE:
    - Match layout complexity to the amount of content provided.
    - Few elements → open, breathing layout with strong hero focal point.
    - Many elements → clean structured alignment or segmented clean columns. Never clutter.
    - Always specify how elements relate spatially (e.g., "headline floats above center, product anchors bottom-right").
    - LOGO PLACEMENT DYNAMISM & CONTEXT FIDELITY (CRITICAL): The logo's position (in layout_map's 'logo' element bbox_percent and anchor) MUST NOT default to the bottom-left corner. If brandContext.layout_details.logo_placement or referenceContext.layout_details.logo_placement is specified, position the logo exactly at that location. Only place the logo on the bottom-left if explicitly suggested by the brandContext or referenceContext.

    SPATIAL SPECIFICATION (CRITICAL):
    - Every major element MUST have explicit placement and sizing.
    - Use a normalized 0–100 coordinate system (percent of canvas):
      - x,y represent the top-left origin of the element's bounding box.
      - w,h represent width/height as percent of canvas.
    - Include these for each element: anchor, alignment, z_index/layering, rotation_deg.
    - Include safe areas: keep critical text within 6% padding from each edge.
    - Include spacing rules: padding, gap between blocks, and baseline alignment.
`;
