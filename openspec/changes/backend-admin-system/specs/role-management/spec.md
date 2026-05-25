## ADDED Requirements

### Requirement: Role list with search
The role management page SHALL display a table of roles with search capability.

#### Scenario: View role list
- **WHEN** user navigates to role management page
- **THEN** system displays a table with columns: role name, role code, status, user count, created time, actions

#### Scenario: Search roles
- **WHEN** user types in the search box
- **THEN** system filters roles by name or code

### Requirement: Create role
The system SHALL allow administrators to create new roles with a name, code, and status.

#### Scenario: Create role successfully
- **WHEN** user clicks "新增角色" button, fills in name, code, status, and submits
- **THEN** system creates the role and refreshes the list

#### Scenario: Duplicate role code
- **WHEN** user submits a form with an existing role code
- **THEN** system displays error "角色编码已存在"

### Requirement: Edit role
The system SHALL allow administrators to edit role name, code, and status.

#### Scenario: Edit role successfully
- **WHEN** user clicks edit button on a role row
- **THEN** system opens an edit dialog with current data
- **THEN** user modifies fields and submits
- **THEN** system updates the role

### Requirement: Delete role
The system SHALL allow administrators to delete roles with confirmation. Roles that have associated users cannot be deleted.

#### Scenario: Delete empty role
- **WHEN** user deletes a role with 0 users
- **THEN** system deletes the role and refreshes the list

#### Scenario: Delete role with users
- **WHEN** user attempts to delete a role that has assigned users
- **THEN** system shows error "该角色下存在用户，无法删除"

### Requirement: Assign permissions to role
The system SHALL allow administrators to assign menu permissions and button permissions to a role via a tree selector.

#### Scenario: Open permission assignment
- **WHEN** user clicks "分配权限" button on a role row
- **THEN** system opens a dialog with a tree of menus and permission checkboxes

#### Scenario: Assign permissions
- **WHEN** user checks menus and permission items in the tree
- **WHEN** user clicks save
- **THEN** system updates the role's permission set

#### Scenario: Tree cascading
- **WHEN** user checks a parent menu node
- **THEN** all child menus and button permissions under that node are automatically checked
- **WHEN** user unchecks a parent menu node
- **THEN** all children are unchecked
- **WHEN** some children are checked and some are not
- **THEN** the parent node shows a half-checked state
