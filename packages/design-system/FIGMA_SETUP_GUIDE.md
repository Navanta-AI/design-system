# Figma + Code Connect Setup Guide

Step-by-step process to connect your Navanta Design System to Figma.

---

## Step 1: Create a Figma File

1. Open [figma.com](https://figma.com) and log in
2. Create a new Design File — name it **"Navanta Design System"**
3. Create pages inside it:
   - `Components` — where your component library will live
   - `Tokens` — for visualizing your design tokens (optional)

---

## Step 2: Install Tokens Studio Plugin

1. In your Figma file, go to **Plugins > Search** and find **"Tokens Studio for Figma"**
2. Install it and open it
3. It will appear as a panel on the right side

---

## Step 3: Sync Tokens from Your Repo

1. In Tokens Studio, click the **Settings** icon (gear)
2. Under **Sync Providers**, click **Add new > GitHub**
3. Fill in:
   - **Name:** Navanta Tokens
   - **Personal Access Token:** Generate one at [github.com/settings/tokens](https://github.com/settings/tokens) with `repo` scope
   - **Repository:** `your-username/navanta` (your repo name)
   - **Branch:** `main` (or your default branch)
   - **File Path:** `packages/design-system/tokens` (the folder with your JSON files)
4. Click **Save** and then **Pull from GitHub**
5. You should see all your tokens loaded:
   - Spacing (2xs through 4xl)
   - Radius (sm, md, lg, pill, full, input, button, container)
   - Typography (font families, sizes, weights, line heights)
   - Colors — light set and dark set
   - Shadows, transitions, z-index

---

## Step 4: Create Figma Variables from Tokens

1. In Tokens Studio, select **all token sets** (base, color-light, color-dark)
2. Click **"Create Variables"** (or **Styles > Create**)
3. This will generate Figma Variables for:
   - Color variables (primary, error, success, text colors, bg colors, borders)
   - Number variables (spacing, radius, sizing)
4. You can now use these variables when building components

---

## Step 5: Build Figma Components

Build each component in Figma using the synced variables. Start with the most used:

### Priority 1 — Form Inputs
- [ ] **Text Input** — label, input field, helper text, states (default, error, disabled)
- [ ] **Email Input** — same as text + validation icon
- [ ] **Password Input** — same as text + show/hide toggle
- [ ] **Text Area** — multi-line version

### Priority 2 — Buttons
- [ ] **Primary Button** — default, hover, disabled states
- [ ] **Secondary Button** — default, hover, disabled states
- [ ] **Icon Button variants** — primary + secondary with prefix icon

### Priority 3 — Form Controls
- [ ] **Checkbox** — checked, unchecked, disabled, error
- [ ] **Radio** — selected, unselected, disabled
- [ ] **Toggle** — on, off, disabled

### Priority 4 — Data Display
- [ ] **Avatar** — sizes (sm, md, lg, xl), shapes (circle, square), with image / initials
- [ ] **Progress** — linear bar + circular variant
- [ ] **Skeleton** — loading placeholder

### Priority 5 — Containers
- [ ] **Card** — default + image variant
- [ ] **Modal** — default + confirm variant
- [ ] **Accordion** — default + nested

### Priority 6 — Navigation
- [ ] **Tabs** — default + badges variant
- [ ] **Pagination** — default + compact

### Priority 7 — Pickers
- [ ] **Date Picker** — trigger input + calendar dropdown
- [ ] **Dropdown** — default, multi-select, prefix icon, prefix text
- [ ] **Slider** — single value + range

### Priority 8 — Feedback
- [ ] **Tooltip** — all sides (top, right, bottom, left)
- [ ] **Toast** — default + container
- [ ] **Validation Message** — error, success, warning, info
- [ ] **Form Error Summary** — list of errors

### Tips for building components:
- Use **Auto Layout** for all components (matches CSS flexbox)
- Use **Figma Variables** for all colors, spacing, radius (from Step 4)
- Create **variants** using Figma's component properties:
  - State: Default / Error / Disabled
  - Size: sm / md / lg (if applicable)
- Name components clearly: `Input/Text`, `Button/Primary`, `Card/Default`
- Keep the same prop names as the React components (label, disabled, error)

---

## Step 6: Get Figma Node URLs

Once your components are built:

1. Select a component in Figma
2. Right-click > **Copy link to selection**
3. The URL looks like: `https://figma.com/design/ABC123/Navanta?node-id=1:234`
4. Save these URLs — you'll need one per component for Code Connect

---

## Step 7: Set Up Code Connect

Back in your terminal:

```bash
cd packages/design-system

# Install Code Connect
npm install --save-dev @figma/code-connect

# Create a figma.config.json
```

Create `figma.config.json` in the package root:
```json
{
  "codeConnect": {
    "parser": "react",
    "include": ["figma/**/*.figma.js"]
  }
}
```

---

## Step 8: Create Code Connect Mapping Files

For each component, create a mapping file in `figma/` directory.

Example — `figma/text-input.figma.js`:
```jsx
import figma from '@figma/code-connect';
import { TextInput } from '../src/index';

figma.connect(TextInput, 'PASTE_FIGMA_URL_HERE', {
  props: {
    label: figma.string('Label'),
    disabled: figma.boolean('Disabled'),
    error: figma.boolean('Error'),
  },
  example: (props) => (
    <TextInput
      label={props.label}
      disable={props.disabled}
      inputState={props.error ? 'inputField_error' : 'inputField'}
      helperState={props.error ? 'helper_text_error' : 'helper_text'}
    />
  ),
});
```

Replace `PASTE_FIGMA_URL_HERE` with the URL you copied in Step 6.

---

## Step 9: Generate a Figma Access Token

1. Go to [figma.com/developers/api#access-tokens](https://www.figma.com/developers/api#access-tokens)
2. Click **"Create a personal access token"**
3. Give it a name like "Navanta Code Connect"
4. Scopes needed: **File content (Read)**, **Code Connect (Write)**
5. Copy the token

---

## Step 10: Publish Code Connect

```bash
# Set your Figma token
export FIGMA_ACCESS_TOKEN="your-token-here"

# Publish all mappings
npx figma connect publish
```

---

## Step 11: Verify in Figma

1. Open your Figma file
2. Select any component you mapped (e.g., Text Input)
3. In the right panel, look for the **"Code"** tab (or Dev Mode)
4. You should see real React code:

```jsx
import { TextInput } from '@navanta/design-system';

<TextInput label="Full Name" />
```

Instead of raw CSS values, developers now see the exact import and usage from your npm package.

---

## Keeping Everything in Sync

### When tokens change:
1. Edit `tokens/base.json`, `color-light.json`, or `color-dark.json`
2. Run `npm run build:tokens` to regenerate CSS/JS
3. Push to GitHub
4. In Figma: Tokens Studio > Pull from GitHub — variables auto-update

### When components change:
1. Update the React component code
2. Run `npm run build` to rebuild the package
3. Update the Code Connect mapping if props changed
4. Run `npx figma connect publish`

### When Figma components change:
1. If node IDs change, update the URL in the mapping file
2. Re-publish with `npx figma connect publish`
