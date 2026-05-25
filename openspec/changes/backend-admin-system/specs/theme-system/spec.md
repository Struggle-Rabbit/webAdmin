## ADDED Requirements

### Requirement: Theme color switching
The system SHALL allow users to switch between multiple preset theme colors.

#### Scenario: Switch theme color
- **WHEN** user opens the theme picker in Header
- **THEN** system shows 5+ color swatches (default blue, green, orange, purple, red)
- **WHEN** user clicks a color swatch
- **THEN** system applies the new primary color to all Element Plus components and custom styled elements
- **THEN** system saves the preference to localStorage
- **THEN** preference persists across page reloads

### Requirement: Dark mode
The system SHALL support dark mode switching.

#### Scenario: Toggle dark mode
- **WHEN** user clicks the dark mode toggle button
- **THEN** system switches between light and dark themes
- **THEN** all components and custom layouts adapt to the dark color scheme
- **THEN** system saves the preference to localStorage
- **THEN** preference persists across page reloads

#### Scenario: System preference detection
- **WHEN** user visits for the first time and has no saved preference
- **THEN** system detects prefers-color-scheme from OS/browser
- **THEN** system applies the corresponding theme

### Requirement: Layout preference persistence
The system SHALL persist user's layout preferences (sidebar collapsed state, etc.).

#### Scenario: Sidebar state persistence
- **WHEN** user collapses or expands the sidebar
- **THEN** the state is saved to localStorage
- **WHEN** user refreshes the page
- **THEN** sidebar maintains its collapsed/expanded state
