# UI Changes Guide - Design Generation Improvements

## Generate Page - Advanced Settings Section

### Before
```
┌─────────────────────────────────────────┐
│ Advanced                          ▼     │
├─────────────────────────────────────────┤
│                                         │
│ Character/Product Image Upload          │
│ [Upload Area]                           │
│                                         │
│ Reference Images Upload                 │
│ [Upload Area]                           │
│                                         │
│ Custom Headline                         │
│ [Input Field]                           │
│                                         │
│ CTA Text                                │
│ [Input Field]                           │
│                                         │
│ Style Intensity                         │
│ [Minimal] [Balanced] [Bold]             │
│                                         │
└─────────────────────────────────────────┘
```

### After
```
┌─────────────────────────────────────────┐
│ Advanced                          ▼     │
├─────────────────────────────────────────┤
│                                         │
│ Character/Product Image Upload          │
│ [Upload Area]                           │
│                                         │
│ Reference Images Upload                 │
│ [Upload Area]                           │
│                                         │
│ Custom Headline                         │
│ [Input Field]                           │
│                                         │
│ CTA Text                                │
│ [Input Field]                           │
│                                         │
│ Style Intensity                         │
│ [Minimal] [Balanced] [Bold]             │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ ✨ Creative Mode          [○──]    │ │ ← NEW
│ │ Add rich decorative elements,       │ │
│ │ floating props, dynamic effects     │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ 🎯 Reference Influence                  │ ← NEW
│ [Low] [Medium] [High]                   │   (Only when
│ Balance reference with brand identity   │    refs uploaded)
│                                         │
└─────────────────────────────────────────┘
```

## Creative Mode Toggle - Detailed View

### Visual Design
```
┌───────────────────────────────────────────────────┐
│  Purple gradient background (purple-50/30)        │
│  Border: purple-200                               │
│                                                   │
│  ✨ Creative Mode                    [──○]       │
│  Add rich decorative elements,                    │
│  floating props, dynamic effects                  │
│                                                   │
└───────────────────────────────────────────────────┘

When ON:
┌───────────────────────────────────────────────────┐
│  Purple gradient background (purple-50/30)        │
│  Border: purple-200                               │
│                                                   │
│  ✨ Creative Mode                    [○──]       │
│  Add rich decorative elements,        ↑           │
│  floating props, dynamic effects   Purple-600     │
│                                                   │
└───────────────────────────────────────────────────┘
```

### States
- **OFF**: Gray toggle (bg-gray-300), switch on left
- **ON**: Purple toggle (bg-purple-600), switch on right
- **Hover**: Focus ring appears (ring-purple-500)
- **Disabled**: Opacity reduced, cursor not-allowed

## Reference Influence Selector - Detailed View

### Visual Design
```
┌───────────────────────────────────────────────────┐
│  🎯 REFERENCE INFLUENCE                           │
│                                                   │
│  ┌─────────┬─────────┬─────────┐                 │
│  │   Low   │ Medium  │  High   │                 │
│  └─────────┴─────────┴─────────┘                 │
│                                                   │
│  Balance reference with brand identity            │
│                                                   │
└───────────────────────────────────────────────────┘

Selected State (Medium):
┌───────────────────────────────────────────────────┐
│  🎯 REFERENCE INFLUENCE                           │
│                                                   │
│  ┌─────────┬─────────┬─────────┐                 │
│  │   Low   │ Medium  │  High   │                 │
│  │         │   ✓     │         │                 │
│  │  gray   │  white  │  gray   │                 │
│  │         │ shadow  │         │                 │
│  └─────────┴─────────┴─────────┘                 │
│                                                   │
│  Balance reference with brand identity            │
│                                                   │
└───────────────────────────────────────────────────┘
```

### Button States
- **Unselected**: Gray text (text-gray-500), no background
- **Selected**: White background (bg-white), shadow, dark text (text-gray-900)
- **Hover**: Darker text (text-gray-700)

### Helper Text by Selection
- **Low**: "Use reference as loose inspiration"
- **Medium**: "Balance reference with brand identity"
- **High**: "Closely replicate reference layout & style"

## Mobile Responsive Behavior

### Portrait (< 768px)
```
┌─────────────────────┐
│ Advanced      ▼     │
├─────────────────────┤
│                     │
│ [Full width inputs] │
│                     │
│ ┌─────────────────┐ │
│ │ ✨ Creative     │ │
│ │ Mode      [○──] │ │
│ │ Description...  │ │
│ └─────────────────┘ │
│                     │
│ Reference Influence │
│ [Low][Med][High]    │
│ Helper text...      │
│                     │
└─────────────────────┘
```

### Landscape (≥ 768px)
```
┌─────────────────────────────────────┐
│ Advanced                      ▼     │
├─────────────────────────────────────┤
│                                     │
│ [Inputs in grid layout]             │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ✨ Creative Mode        [○──]  │ │
│ │ Add rich decorative elements... │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Reference Influence                 │
│ [Low] [Medium] [High]               │
│ Balance reference with brand...     │
│                                     │
└─────────────────────────────────────┘
```

## Color Scheme

### Creative Mode Section
- Background: `bg-purple-50/30` (light purple with transparency)
- Border: `border-purple-200` (soft purple)
- Text: `text-purple-900` (dark purple for title)
- Description: `text-purple-700` (medium purple)
- Toggle ON: `bg-purple-600` (vibrant purple)
- Toggle OFF: `bg-gray-300` (neutral gray)
- Focus Ring: `ring-purple-500` (purple accent)

### Reference Influence Section
- Label Icon: `text-gray-500` (neutral)
- Badge (when refs uploaded): `bg-indigo-50`, `border-indigo-200`, `text-indigo-600`
- Buttons Background: `bg-gray-100` (light gray container)
- Selected Button: `bg-white` with `shadow-sm`
- Helper Text: `text-gray-500` (subtle)

## Interaction Flow

### 1. User Opens Advanced Settings
```
Click "Advanced" → Section expands
↓
Creative Mode toggle visible (OFF by default)
↓
Reference Influence hidden (no refs uploaded yet)
```

### 2. User Uploads Reference Images
```
Upload reference images
↓
Reference Influence selector appears
↓
Default: Medium selected
↓
Helper text shows: "Balance reference with brand identity"
```

### 3. User Enables Creative Mode
```
Click Creative Mode toggle
↓
Toggle animates to ON position
↓
Background changes to purple-600
↓
Switch moves to right side
```

### 4. User Adjusts Reference Influence
```
Click "High" button
↓
Button gets white background + shadow
↓
Helper text updates: "Closely replicate reference layout & style"
↓
Other buttons return to gray state
```

### 5. User Generates Design
```
Click "Generate" button
↓
Settings passed to generation function:
  - creativeMode: true
  - referenceInfluence: "high"
↓
Enhanced prompt created with special instructions
↓
AI generates design with creative elements + high reference influence
```

## Accessibility Features

### Keyboard Navigation
- Tab through all interactive elements
- Space/Enter to toggle Creative Mode
- Arrow keys to navigate Reference Influence buttons
- Focus indicators visible on all elements

### Screen Reader Support
- Descriptive labels for all controls
- State announcements (ON/OFF for toggle)
- Helper text associated with controls
- Semantic HTML structure

### Visual Indicators
- Clear selected states
- Color + shape + text for all states (not color alone)
- Sufficient contrast ratios (WCAG AA compliant)
- Focus rings for keyboard users

## Animation & Transitions

### Creative Mode Toggle
```css
transition: all 200ms ease
- Background color fade
- Switch position slide
- Focus ring appearance
```

### Reference Influence Buttons
```css
transition: all 200ms ease
- Background color fade
- Shadow appearance
- Text color change
```

### Section Expansion
```css
animate-in slide-in-from-top-2 duration-200
- Smooth slide down animation
- Fade in effect
```

## Error States

### Insufficient Credits
```
┌─────────────────────────────────────┐
│ ⚠️ Credit မလုံလောက်ပါ               │
│ (need 10, have 5)                   │
│ Recharge လုပ်ရန် →                  │
└─────────────────────────────────────┘
[Generate] button disabled
```

### No Internet Connection
```
┌─────────────────────────────────────┐
│ 🔴 No internet connection.          │
└─────────────────────────────────────┘
[Generate] button disabled
```

### No Reference Images (Influence selector hidden)
```
Reference Influence section not displayed
Only Creative Mode toggle visible
```

## Loading States

### During Generation
```
[Generate] button shows:
┌─────────────────────────────────────┐
│  ⟳ Generating...                    │
└─────────────────────────────────────┘
- Spinner animation
- Button disabled
- All inputs disabled
```

## Success States

### After Generation
```
- Advanced section auto-collapses (mobile)
- Focus moves to generated image
- Toast notification: "✨ Image generated successfully!"
- Settings preserved for next generation
```

## Tips for Users

### Displayed in UI
1. "Creative Mode adds rich visual elements - great for social media!"
2. "High reference influence closely matches your reference images"
3. "Combine Creative Mode + High Influence for maximum impact"
4. "Use Low influence to maintain your brand's unique style"

### Keyboard Shortcuts
- `⌘/Ctrl + Enter`: Generate design
- `Esc`: Clear result (when viewing generated image)
- `Tab`: Navigate through settings
- `Space`: Toggle Creative Mode

## Implementation Notes

### Component Structure
```
GenerateSidebar
├── Brand Selector
├── Format Selector
├── Prompt Input
└── Advanced Section (collapsible)
    ├── Character Image Upload
    ├── Reference Images Upload
    ├── Custom Headline Input
    ├── CTA Text Input
    ├── Style Intensity Selector
    ├── Creative Mode Toggle ← NEW
    └── Reference Influence Selector ← NEW (conditional)
```

### State Management
```typescript
const [advancedSettings, setAdvancedSettings] = useState({
  customHeadline: "",
  ctaText: "",
  styleIntensity: "balanced",
  textPosition: "center",
  creativeMode: false,           // NEW
  referenceInfluence: "medium",  // NEW
});
```

### Conditional Rendering
```typescript
{referenceImages.length > 0 && (
  <ReferenceInfluenceSelector />
)}
```

This ensures Reference Influence only appears when relevant.
