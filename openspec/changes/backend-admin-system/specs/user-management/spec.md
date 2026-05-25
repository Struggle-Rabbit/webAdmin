## ADDED Requirements

### Requirement: User list with search and pagination
The user management page SHALL display a paginated table of users with search and filter capabilities.

#### Scenario: View user list
- **WHEN** user navigates to user management page
- **THEN** system displays a table with columns: username, nickname, email, avatar, roles, status, created time, actions

#### Scenario: Search users
- **WHEN** user types in the search box and presses enter
- **THEN** system filters users by username or nickname (case-insensitive, fuzzy match)

#### Scenario: Filter by role
- **WHEN** user selects a role from the dropdown filter
- **THEN** system filters users belonging to that role

#### Scenario: Filter by status
- **WHEN** user selects a status filter (all/active/disabled)
- **THEN** system filters users by their account status

#### Scenario: Pagination
- **WHEN** user clicks a page number or changes page size
- **THEN** system loads the corresponding page of data

### Requirement: Create user
The system SHALL allow administrators to create new users.

#### Scenario: Open create form
- **WHEN** user clicks "新增用户" button
- **THEN** system opens a dialog/form with fields: username, password, nickname, email, roles, status

#### Scenario: Submit create form successfully
- **WHEN** user fills in all required fields and submits
- **THEN** system validates the data
- **THEN** system creates the user
- **THEN** system closes the dialog
- **THEN** system refreshes the user list

#### Scenario: Submit create form with existing username
- **WHEN** user submits a form with an existing username
- **THEN** system displays error "用户名已存在"

### Requirement: Edit user
The system SHALL allow administrators to edit existing users. Password field is optional; if left blank, the password remains unchanged.

#### Scenario: Open edit form
- **WHEN** user clicks edit button on a user row
- **THEN** system opens a dialog pre-filled with the user's current data

#### Scenario: Submit edit form successfully
- **WHEN** user modifies fields and submits
- **THEN** system updates the user

### Requirement: Delete user
The system SHALL allow administrators to delete users with confirmation.

#### Scenario: Delete user with confirmation
- **WHEN** user clicks delete button
- **THEN** system shows a confirmation dialog with user's name
- **THEN** upon confirmation, system deletes the user and refreshes the list

#### Scenario: Prevent self-deletion
- **WHEN** user attempts to delete their own account
- **THEN** system shows error "不能删除自己"

### Requirement: Toggle user status
The system SHALL allow administrators to enable or disable user accounts.

#### Scenario: Toggle status
- **WHEN** user clicks the status switch on a user row
- **THEN** system toggles the user's account status
- **THEN** system updates the display
