## ADDED Requirements

### Requirement: User registration
The system SHALL allow new users to register with username, password, nickname, and email.
After successful registration, the system SHALL automatically log in the user.

#### Scenario: Successful registration
- **WHEN** user submits registration form with valid username, password, nickname, and email
- **THEN** system creates the account, returns a token, and redirects to dashboard

#### Scenario: Duplicate username
- **WHEN** user submits registration with an existing username
- **THEN** system displays error message "用户名已存在"
- **THEN** system stays on registration page

#### Scenario: Validation failure
- **WHEN** user submits registration with invalid email format or password shorter than 6 characters
- **THEN** system displays inline validation errors
- **THEN** form is not submitted

### Requirement: User login
The system SHALL authenticate users by username and password, and return a JWT token.

#### Scenario: Successful login
- **WHEN** user submits valid credentials
- **THEN** system returns a token, user info, and permission data
- **THEN** system redirects to the dashboard

#### Scenario: Invalid credentials
- **WHEN** user submits wrong username or password
- **THEN** system displays error message "用户名或密码错误"

#### Scenario: Disabled account
- **WHEN** user submits credentials for a disabled account
- **THEN** system displays error message "账户已被禁用，请联系管理员"

### Requirement: Token persistence and auto-login
The system SHALL persist the token in localStorage, and auto-restore session on page refresh.

#### Scenario: Refresh with valid token
- **WHEN** user refreshes the page with a stored valid token
- **THEN** system reads token from storage
- **THEN** system fetches user info and permissions
- **THEN** system restores the session and stays on current page

#### Scenario: Refresh with expired token
- **WHEN** user refreshes the page with an expired token
- **THEN** system clears the token
- **THEN** system redirects to login page

### Requirement: Logout
The system SHALL allow users to log out, clearing all session data.

#### Scenario: Successful logout
- **WHEN** user clicks logout button in Header
- **THEN** system clears token, user info, permissions, and tabs
- **THEN** system redirects to login page

### Requirement: Route guard
The system SHALL protect all routes except login and register from unauthenticated access.

#### Scenario: Unauthenticated access to protected route
- **WHEN** unauthenticated user navigates to /dashboard
- **THEN** system redirects to /login

#### Scenario: Authenticated access to login page
- **WHEN** authenticated user navigates to /login
- **THEN** system redirects to /dashboard

### Requirement: Dynamic route registration
The system SHALL generate Vue Router routes dynamically from backend menu tree after login.

#### Scenario: Permission loading flow
- **WHEN** user logs in successfully
- **THEN** system calls permission API
- **THEN** system traverses menu tree and registers routes via router.addRoute()
- **THEN** system navigates to the target page
