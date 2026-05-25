## ADDED Requirements

### Requirement: Main layout structure
The system SHALL provide a consistent main layout with sidebar, header, and content area.

#### Scenario: Render main layout
- **WHEN** user logs in and navigates to any protected page
- **THEN** system renders: left sidebar with menu, top header bar, main content area
- **THEN** layout is responsive and adapts to different screen sizes

### Requirement: Sidebar navigation
The sidebar SHALL display the full menu tree with multi-level expansion.

#### Scenario: Render hierarchical menu
- **WHEN** user expands a parent menu item
- **THEN** system shows its children with appropriate indentation
- **WHEN** user clicks a leaf menu item
- **THEN** system navigates to the corresponding route

#### Scenario: Collapse sidebar
- **WHEN** user clicks the collapse button
- **THEN** sidebar collapses to icon-only mode
- **WHEN** user hovers over collapsed sidebar
- **THEN** sidebar expands temporarily to show text labels
- **WHEN** user clicks collapse button again
- **THEN** sidebar returns to full width

#### Scenario: Active menu highlighting
- **WHEN** user navigates to a route
- **THEN** the corresponding menu item and all its ancestors are highlighted
- **THEN** parent nodes are automatically expanded to show the active child

### Requirement: Header bar
The header SHALL display breadcrumb navigation, notification placeholder, user info, fullscreen button, and theme picker.

#### Scenario: Render header
- **WHEN** layout renders
- **THEN** header shows: hamburger collapse button, breadcrumb trail, notification icon (placeholder with badge), user avatar and dropdown menu, fullscreen toggle, theme color picker

#### Scenario: User dropdown menu
- **WHEN** user clicks avatar in header
- **THEN** dropdown shows: user info (name, role), "个人设置" link, "退出登录" button

### Requirement: Multi-tab navigation
The system SHALL provide a tab bar that shows all opened pages and allows quick switching.

#### Scenario: Open new tab
- **WHEN** user navigates to a menu page
- **THEN** a new tab with the page title appears in the tab bar
- **THEN** if the tab already exists, system switches to it instead of creating a duplicate

#### Scenario: Close tab
- **WHEN** user clicks close button on a tab
- **THEN** system closes the tab and switches to the adjacent tab
- **THEN** current tab cannot be closed if it is the only tab

#### Scenario: Tab context menu
- **WHEN** user right-clicks on a tab
- **THEN** context menu shows: "关闭当前", "关闭其他", "关闭所有"

#### Scenario: Refresh current tab
- **WHEN** user clicks refresh on the active tab
- **THEN** system re-mounts the page component
- **THEN** page data is reloaded from API

### Requirement: Breadcrumb
The system SHALL show breadcrumb navigation based on the current route's menu hierarchy.

#### Scenario: Display breadcrumb
- **WHEN** user navigates to a nested route
- **THEN** breadcrumb shows the path from root menu to current page
- **THEN** each breadcrumb segment is clickable for navigation
