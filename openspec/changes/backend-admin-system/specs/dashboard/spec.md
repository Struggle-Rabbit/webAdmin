## ADDED Requirements

### Requirement: Statistics overview
The dashboard SHALL display key system statistics in card format.

#### Scenario: Display statistics cards
- **WHEN** user visits dashboard page
- **THEN** system displays cards showing: total users, total roles, total menus, today's active users
- **THEN** each card shows a numeric value, a label, and a trend indicator (up/down)

### Requirement: Charts and visualizations
The dashboard SHALL include at least one chart for system activity visualization.

#### Scenario: Display charts
- **WHEN** user visits dashboard page
- **THEN** system displays a line chart showing user registrations over the past 7 days
- **THEN** system displays a pie chart showing user distribution by role
- **THEN** chart tooltips show detailed values on hover

### Requirement: Recent activity log
The dashboard SHALL display a list of recent system activity.

#### Scenario: View recent logs
- **WHEN** user visits dashboard page
- **THEN** system displays the 10 most recent log entries
- **THEN** each entry shows time, operator, operation type, and status
