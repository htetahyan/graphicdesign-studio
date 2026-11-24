# Feature Flow Diagram

## Complete User Journey with New Features

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER STARTS                              │
│                     (Generate Page)                             │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                   SELECT BRAND & FORMAT                         │
│  • Choose brand from horizontal scroll                          │
│  • Select aspect ratio (1:1, 9:16, 16:9, 4:3, 3:2)             │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ENTER PROMPT                                 │
│  • Describe desired design                                      │
│  • Can include Burmese text                                     │
│  • Can include specific details (prices, dates, etc.)           │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              EXPAND ADVANCED SETTINGS (Optional)                │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Character/Product Image Upload                            │ │
│  │ • Upload person or product photo                          │ │
│  │ • Becomes primary foreground subject                      │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Reference Images Upload                                   │ │
│  │ • Upload 1-5 style reference images                       │ │
│  │ • Used for composition/layout guidance                    │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Custom Headline & CTA                                     │ │
│  │ • Override default text                                   │ │
│  │ • Specify exact wording                                   │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ Style Intensity                                           │ │
│  │ • Minimal / Balanced / Bold                               │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ ✨ CREATIVE MODE (NEW)                          [○──]    │ │
│  │ • Toggle ON for rich decorative elements                 │ │
│  │ • Adds floating props, lighting effects                  │ │
│  │ • Creates dynamic, layered compositions                  │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ 🎯 REFERENCE INFLUENCE (NEW)                             │ │
│  │ • Only appears if reference images uploaded              │ │
│  │ • [Low] [Medium] [High]                                  │ │
│  │ • Controls how closely to match references               │ │
│  └───────────────────────────────────────────────────────────┘ │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    CLICK GENERATE                               │
│  • Button disabled if insufficient credits                      │
│  • Button disabled if offline                                   │
│  • Keyboard shortcut: Cmd/Ctrl + Enter                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  SETTINGS PROCESSING                            │
│                                                                 │
│  1. Extract Burmese content from prompt                         │
│  2. Add custom headline/CTA if provided                         │
│  3. Add style intensity instructions                            │
│  4. Add Creative Mode instructions (if enabled)                 │
│  5. Add Reference Influence instructions (if refs uploaded)     │
│  6. Compress images for upload                                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              CALL GENERATION ACTION                             │
│                                                                 │
│  If references OR character image:                              │
│    → generateActionWithRefs(formData)                           │
│  Else:                                                          │
│    → generateAction(brandId, prompt, aspectRatio, creativeMode) │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                SERVER-SIDE PROCESSING                           │
│                                                                 │
│  1. Verify user authentication                                  │
│  2. Check credits (need 10)                                     │
│  3. Fetch brand context from database                           │
│  4. Upload reference/character images (if any)                  │
│  5. Convert images to base64 for Gemini                         │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              BRAND CONTEXT ANALYSIS                             │
│                                                                 │
│  If brand has persisted style_context:                          │
│    → Use cached analysis                                        │
│  Else:                                                          │
│    → Analyze brand images with Gemini                           │
│    → Extract 11 design dimensions                               │
│    → Cache for future use                                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│           REFERENCE CONTEXT ANALYSIS (if applicable)            │
│                                                                 │
│  If inspiration templates selected:                             │
│    → Analyze template images (style only, no colors)            │
│  If user uploaded reference images:                             │
│    → Analyze reference images                                   │
│    → Extract composition, layout, structure                     │
│    → Apply influence level (low/medium/high)                    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  PROMPT MERGING (Gemini)                        │
│                                                                 │
│  mergePrompt(                                                   │
│    brandContext,                                                │
│    userPrompt,                                                  │
│    referenceContext,                                            │
│    imageInputs,                                                 │
│    creativeMode,        ← NEW                                   │
│    referenceInfluence   ← NEW                                   │
│  )                                                              │
│                                                                 │
│  Generates detailed JSON prompt with:                           │
│  • Generation settings (aspect ratio, safe areas)               │
│  • Design composition (style, complexity, layout)               │
│  • Layout map (element positioning)                             │
│  • Visual elements (background, foreground, decorative)         │
│  • Typography specifications                                    │
│  • Color and gradient details                                   │
│  • Raw data transcription                                       │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ CREATIVE MODE LOGIC (if enabled)                        │   │
│  │ • Add visual richness instructions                      │   │
│  │ • Specify composition complexity                        │   │
│  │ • Define dimensional quality preferences                │   │
│  │ • Set balance requirements                              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ REFERENCE INFLUENCE LOGIC (if refs uploaded)            │   │
│  │                                                          │   │
│  │ LOW:                                                     │   │
│  │ • 20% reference, 80% brand                              │   │
│  │ • Loose inspiration only                                │   │
│  │ • Brand style dominates                                 │   │
│  │                                                          │   │
│  │ MEDIUM:                                                  │   │
│  │ • 50% reference, 50% brand                              │   │
│  │ • Balanced guidance                                     │   │
│  │ • Blend reference with brand                            │   │
│  │                                                          │   │
│  │ HIGH:                                                    │   │
│  │ • 70% reference, 30% brand                              │   │
│  │ • Close replication                                     │   │
│  │ • Match structure precisely                             │   │
│  └─────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              IMAGE GENERATION (Nano Banana)                     │
│                                                                 │
│  Call Replicate API with:                                       │
│  • Generated JSON prompt                                        │
│  • Brand logo image                                             │
│  • Character image (if uploaded)                                │
│  • Reference images (if uploaded)                               │
│  • Aspect ratio                                                 │
│                                                                 │
│  Model processes:                                               │
│  • Interprets JSON instructions                                 │
│  • Applies brand colors from logo                               │
│  • Follows composition from references (if applicable)          │
│  • Adds creative elements (if Creative Mode enabled)            │
│  • Matches influence level (if references provided)             │
│  • Generates final image                                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                IMAGE PERSISTENCE                                │
│                                                                 │
│  1. Download generated image from Replicate                     │
│  2. Upload to Supabase storage (permanent)                      │
│  3. Get public URL                                              │
│  4. Fallback to Replicate URL if storage fails                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              CREDITS & HISTORY                                  │
│                                                                 │
│  1. Deduct 10 credits from user                                 │
│  2. Save generation record to database:                         │
│     • User ID                                                   │
│     • Brand ID                                                  │
│     • Prompt                                                    │
│     • Result URL                                                │
│     • Parameters (including creative mode & influence)          │
│  3. Revalidate profile and gallery pages                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  RETURN TO CLIENT                               │
│                                                                 │
│  Success response with:                                         │
│  • Generation ID                                                │
│  • Result URL                                                   │
│  • Timestamp                                                    │
│  • All parameters                                               │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  DISPLAY RESULT                                 │
│                                                                 │
│  1. Show success toast                                          │
│  2. Display generated image                                     │
│  3. Collapse Advanced section (mobile)                          │
│  4. Scroll to top to show result                                │
│  5. Enable download button                                      │
│  6. Preserve settings for next generation                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    USER ACTIONS                                 │
│                                                                 │
│  Options:                                                       │
│  • Download image                                               │
│  • View in gallery                                              │
│  • Generate another (settings preserved)                        │
│  • Adjust settings and regenerate                              │
│  • Clear result (Esc key)                                       │
└─────────────────────────────────────────────────────────────────┘
```

## Decision Tree: When Settings Apply

```
User Clicks Generate
│
├─ Creative Mode = ON?
│  ├─ YES → Add creative instructions to prompt
│  │        • Visual richness
│  │        • Composition complexity
│  │        • Dimensional quality
│  │        • Decorative elements
│  │
│  └─ NO → Use brand's natural complexity level
│
├─ Reference Images Uploaded?
│  ├─ YES → Apply Reference Influence
│  │        │
│  │        ├─ LOW → 20% reference, 80% brand
│  │        │        • Loose inspiration
│  │        │        • Brand style dominates
│  │        │
│  │        ├─ MEDIUM → 50% reference, 50% brand
│  │        │           • Balanced approach
│  │        │           • Blend styles
│  │        │
│  │        └─ HIGH → 70% reference, 30% brand
│  │                  • Close replication
│  │                  • Match structure
│  │
│  └─ NO → Use brand context only
│
└─ Generate with combined settings
```

## Data Flow Architecture

```
┌──────────────┐
│   Browser    │
│  (Client)    │
└──────┬───────┘
       │
       │ 1. User Input + Settings
       │    • Prompt
       │    • Creative Mode
       │    • Reference Influence
       │    • Images
       │
       ▼
┌──────────────────────┐
│   Next.js Server     │
│  (Server Actions)    │
└──────┬───────────────┘
       │
       │ 2. Process & Validate
       │    • Check credits
       │    • Compress images
       │    • Fetch brand context
       │
       ▼
┌──────────────────────┐
│   Gemini API         │
│  (via Replicate)     │
└──────┬───────────────┘
       │
       │ 3. Generate JSON Prompt
       │    • Merge contexts
       │    • Apply settings
       │    • Create instructions
       │
       ▼
┌──────────────────────┐
│   Nano Banana        │
│  (Image Model)       │
└──────┬───────────────┘
       │
       │ 4. Generate Image
       │    • Follow JSON prompt
       │    • Apply brand colors
       │    • Match references
       │    • Add creative elements
       │
       ▼
┌──────────────────────┐
│   Supabase Storage   │
│  (Persistence)       │
└──────┬───────────────┘
       │
       │ 5. Store & Return
       │    • Save image
       │    • Update credits
       │    • Save history
       │
       ▼
┌──────────────────────┐
│   Browser            │
│  (Display Result)    │
└──────────────────────┘
```

## Settings Impact Matrix

| Setting | Impact on Prompt | Impact on Output | Token Cost |
|---------|------------------|------------------|------------|
| Creative Mode OFF | Minimal instructions | Respects brand complexity | Baseline |
| Creative Mode ON | +300 tokens | Rich decorative elements | +12% |
| Ref Influence: Low | +150 tokens | Loose inspiration | +6% |
| Ref Influence: Medium | +200 tokens | Balanced blend | +8% |
| Ref Influence: High | +250 tokens | Close replication | +10% |
| Both ON + High | +550 tokens | Maximum impact | +22% |

## Error Handling Flow

```
Generation Request
│
├─ Insufficient Credits?
│  └─ YES → Show error toast
│           Disable generate button
│           Prompt to recharge
│
├─ Offline?
│  └─ YES → Show offline banner
│           Disable generate button
│           Wait for reconnection
│
├─ Invalid Brand?
│  └─ YES → Show error toast
│           Redirect to brand creation
│
├─ Gemini API Error?
│  └─ YES → Retry with backoff (3x)
│           If still fails → Show error
│           Don't deduct credits
│
├─ Replicate API Error?
│  └─ YES → Show provider error
│           Don't deduct credits
│           Suggest retry
│
├─ Storage Error?
│  └─ YES → Fallback to provider URL
│           Still save generation
│           Log warning
│
└─ Success → Display result
```

## Performance Optimization Points

1. **Image Compression** (before upload)
   - Reduces upload time
   - Saves bandwidth
   - Faster processing

2. **Context Caching** (brand analysis)
   - Reuse persisted analysis
   - Skip redundant Gemini calls
   - Faster generation

3. **Conditional Rendering** (UI)
   - Only show relevant controls
   - Reduce DOM complexity
   - Better mobile performance

4. **Lazy Loading** (images)
   - Load previews on demand
   - Reduce initial load time
   - Better UX

5. **State Optimization** (React)
   - Minimal re-renders
   - Efficient updates
   - Smooth interactions

## Summary

The new features integrate seamlessly into the existing flow:

1. **User configures settings** (Creative Mode, Reference Influence)
2. **Settings enhance prompt** (conditional instructions added)
3. **AI generates better output** (follows enhanced instructions)
4. **User gets predictable results** (settings work as expected)

All while maintaining:
- Brand identity
- Performance
- User experience
- Backward compatibility
