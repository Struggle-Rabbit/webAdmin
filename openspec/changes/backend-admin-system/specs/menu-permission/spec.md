## ADDED Requirements

### Requirement: Menu tree display
The menu management page SHALL display all menus and permissions in a tree structure.

#### Scenario: View menu tree
- **WHEN** user navigates to menu management page
- **THEN** system displays a tree table with columns: menu name, icon, type (menu/button), path, permission code, sort order, status, visible, actions
- **THEN** the tree is expandable/collapsible
- **THEN** root nodes and their children are visible in hierarchical indentation

### Requirement: Create menu node
The system SHALL allow administrators to create new menu or button nodes at any level.

#### Scenario: Create root menu
- **WHEN** user clicks "新增菜单" button at root level
- **THEN** system opens a form dialog with fields: type (默认菜单), name, icon, path, component, sort order, visible, status
- **THEN** upon submission, the new menu node appears in the tree

#### Scenario: Create child menu
- **WHEN** user clicks "新增" button on an existing menu node
- **THEN** system opens a form with the parentId pre-filled to the selected node
- **THEN** upon submission, the new child appears under the selected parent

#### Scenario: Create button permission
- **WHEN** user selects type "按钮" in the form
- **THEN** icon, path, and component fields are hidden
- **THEN** permission code field becomes required
- **THEN** upon submission, the button permission appears as a leaf node under the parent menu

### Requirement: Edit menu node
The system SHALL allow editing of any menu or button node.

#### Scenario: Edit menu
- **WHEN** user clicks edit button on a menu node
- **THEN** system opens a form pre-filled with current data
- **THEN** user modifies fields and submits
- **THEN** tree updates accordingly

### Requirement: Delete menu node
The system SHALL allow deletion of menu nodes. Deleting a parent node also removes all children.

#### Scenario: Delete with confirmation
- **WHEN** user clicks delete button on a node
- **THEN** system shows confirmation with the node name and warns about children if any
- **THEN** upon confirmation, system deletes the node and all descendants
- **THEN** tree refreshes

### Requirement: Toggle menu visibility
The system SHALL allow administrators to show or hide menu items in the sidebar without deleting them.

#### Scenario: Toggle visibility
- **WHEN** user clicks visibility switch on a menu node
- **THEN** system toggles whether this menu appears in the sidebar

### Requirement: Menu sorting
The system SHALL allow administrators to control the display order of menu items.

#### Scenario: Sort by order value
- **WHEN** user changes the sort order number of a menu node and saves
- **THEN** the menu appears at the new position relative to siblings
