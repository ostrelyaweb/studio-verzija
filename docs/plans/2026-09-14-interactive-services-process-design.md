# Interactive Services Process

## Direction

Replace the static four-column process list with one calm-maximalist working canvas. A near-black editorial field, oversized type, and a single electric-blue trajectory create the section's visual peak while preserving Ostrelya's restrained palette.

## Interaction

The four stages behave as one coordinated control. Hover, focus, click, and arrow-key navigation update the active stage, progress label, completed nodes, and SVG path length. The second stage is the initial focal point. All controls remain semantic buttons with visible focus states and `aria-pressed` state.

## Responsive behavior

Desktop uses an asymmetric horizontal Bézier journey with one elevated paper card. At 900px and below, the path becomes a vertical timeline with full-width touch targets and the same active-state logic. Motion is implemented with CSS and small vanilla JavaScript transitions, with a no-transition fallback for `prefers-reduced-motion`.

## Constraints

No animation libraries, stock imagery, decorative gradients, glass effects, or layout-shifting interactions. The existing CTA section remains unchanged.
