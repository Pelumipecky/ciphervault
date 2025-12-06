Use this file to provide workspace-specific custom instructions to Copilot.

- [x] Verify that the copilot-instructions.md file in the .github directory is created.

- [x] Clarify Project Requirements
  - Project: Convert the legacy Binance clone (HTML/CSS/JS) into a React + Vite app with routing and a theme toggle.

- [x] Scaffold the Project
  - Installed React, Vite, TypeScript, and React Router. Added src/main.tsx, src/App.tsx, and the base components directory.

- [x] Customize the Project
  - Converted Home, Signup, and Login experiences into React pages with shared layout, navigation, and theme toggle state.

- [x] Customize the Project
  - Planned and applied all required modifications using user references; verified previous steps before proceeding.

- [x] Install Required Extensions
  - ONLY install extensions mentioned in get_project_setup_info. Skip otherwise and mark complete.

- [x] Compile the Project
  - Verify prerequisites, install missing dependencies, and run diagnostics before marking complete.

- [x] Create and Run Task
  - Only if the project requires a VS Code task per https://code.visualstudio.com/docs/debugtest/tasks.

- [x] Launch the Project
  - Confirm all prerequisites, ask the user about debug mode, then launch if approved.

- [x] Ensure Documentation is Complete
  - Confirm README and this instruction file are current; remove outdated details when closing the project.

- [x] Style Modal Popups to Match Profile & KYC Theme
  - Updated confirmation modal and alert modal styling in both UserDashboard.tsx and AdminDashboard.tsx to match profile card theme (linear-gradient background, consistent border, padding, and border-radius)

- [x] Implement Role-Based Access Control (RBAC)
  - Added user roles: 'user', 'admin', 'superadmin'
  - Created src/utils/roles.ts with permissions, role hierarchy, and utility functions
  - Updated AuthContext to support role-based authentication and redirect
  - Created RoleProtectedRoute component with AdminRoute, SuperAdminRoute, and UserRoute helpers
  - Updated App.tsx with protected admin routes (/admin, /admin/users-management, /admin/transactions, /admin/investment-plans, /admin/system-settings)
  - Updated AdminDashboard with route-based tab navigation and superadmin-only System Settings panel
  - Updated database schema to use 'role' column instead of 'admin' boolean
  - Login now redirects users to appropriate dashboard based on their role

- [x] Debug Blank Blue Screen Issue
  - Identified that app-layout and body backgrounds were set to var(--bg) = #0f172a (blue) in dark theme
  - Added debugging console.log and test message to Home component
  - Changed backgrounds to white to test if content was hidden behind blue
  - Added try-catch error handling to Home component rendering
  - FIXED: Root cause was null/NaN values in crypto API data causing toLocaleString() errors
  - Added null/NaN checks to formatPrice() and formatMarketCap() functions
  - Added null checks in Home component for crypto data access
  - Restored proper blue background styling

Execution Guidelines
PROGRESS TRACKING:
- If any tools are available to manage the above todo list, use them to track progress.
- After completing each step, mark it complete and add a summary.
- Read the current todo status before starting new work.

COMMUNICATION RULES:
- Avoid verbose explanations or printing full command outputs.
- If a step is skipped, state that briefly (e.g. "No extensions needed").
- Do not explain project structure unless asked.
- Keep explanations concise and focused.

DEVELOPMENT RULES:
- Use '.' as the working directory unless the user specifies otherwise.
- Avoid adding media or external links unless explicitly requested.
- Use placeholders only with a note that they should be replaced.
- Use the VS Code API tool only for VS Code extension projects.
- Once the project is created, treat it as already opened in VS Code; do not suggest reopening steps.
- Follow any additional rules provided by project setup information.

FOLDER CREATION RULES:
- Use the current directory as the project root.
- When running terminal commands, include the '.' argument so the current directory is used.
- Do not create new folders unless explicitly requested (besides .vscode/tasks.json when needed).
- If scaffolding commands complain about folder names, tell the user to create the correct folder and reopen it.

EXTENSION INSTALLATION RULES:
- Only install extensions specified by the get_project_setup_info tool.

PROJECT CONTENT RULES:
- If the user has not specified project details, assume they want a "Hello World" starting point.
- Avoid adding links or integrations that are not required.
- Avoid generating media files unless explicitly requested.
- When using placeholder assets, note that they should be replaced later.
- Ensure all components serve a clear purpose for the requested workflow.
- Ask for clarification before adding unconfirmed features.
- Use the VS Code API tool when working on VS Code extensions to reference relevant docs.

TASK COMPLETION RULES:
- The task is complete when:
  - The project is scaffolded and compiles without errors.
  - This instruction file exists and reflects the current project.
  - README.md is up to date.
  - The user has clear instructions to debug/launch the project.

- Work through each checklist item systematically.
- Keep communication concise and focused.
- Follow development best practices.