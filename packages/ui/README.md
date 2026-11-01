# @edunesia/ui

Shared shadcn/ui components and the Tailwind theme used by Edunesia apps.

```tsx
import { Button } from "@edunesia/ui/components/button";
import { Card } from "@edunesia/ui/components/card";
import { Dialog, DropdownMenu, Popover, Tooltip } from "@edunesia/ui/components/overlays";
```

Import `@edunesia/ui/styles/globals.css` once in the app root stylesheet. Add shadcn components here so apps can reuse them.

The shared overlay export exposes Radix primitives for dialogs, dropdown menus, popovers, and tooltips. Compose these primitives with the app's semantic color tokens and accessible labels.
