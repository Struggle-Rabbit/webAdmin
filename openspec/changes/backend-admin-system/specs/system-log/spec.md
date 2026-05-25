## ADDED Requirements

### Requirement: Log list with tabs
The system log page SHALL display operation logs and login logs in two tabs.

#### Scenario: View operation logs
- **WHEN** user navigates to system log page
- **THEN** system shows "操作日志" tab as active by default
- **THEN** table displays columns: time, operator, operation type, request path, request method, status, IP address, duration, actions

#### Scenario: View login logs
- **WHEN** user clicks "登录日志" tab
- **THEN** system displays login log entries with columns: time, username, IP address, login status (success/fail), browser, OS

### Requirement: Log search and filtering
The system SHALL allow filtering logs by time range, operator, operation type, and status.

#### Scenario: Filter by time range
- **WHEN** user selects a date range
- **THEN** system filters logs within that range

#### Scenario: Filter by operation type
- **WHEN** user selects an operation type from the dropdown
- **THEN** system filters logs by that type

#### Scenario: Filter by keyword
- **WHEN** user types keywords in the search box
- **THEN** system filters logs matching the keyword in operator name or content

### Requirement: Log detail view
The system SHALL allow viewing the full detail of a log entry.

#### Scenario: View log detail
- **WHEN** user clicks "详情" button on a log row
- **THEN** system opens a detail drawer showing: all fields, request parameters, response data, error message (if any)

### Requirement: Log export
The system SHALL allow administrators to export filtered logs.

#### Scenario: Export logs
- **WHEN** user clicks "导出" button
- **THEN** system downloads the current filtered log list as a CSV file
