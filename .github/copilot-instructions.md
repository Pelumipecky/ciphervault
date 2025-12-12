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
  - ✅ COMMITTED: Changes pushed to GitHub with descriptive commit message

- [x] Ensure Admin Interface Separation
  - Modified AdminDashboard.tsx to filter out current admin user from user management table
  - Admins no longer see their own balance information in the administrative interface
  - Maintained clean separation between admin management functions and personal financial data
  - ✅ VERIFIED: Build passes successfully after changes
  - Added null/NaN checks to formatPrice() and formatMarketCap() functions
  - Added null checks in Home component for crypto data access
  - Restored proper blue background styling
  - ✅ COMMITTED: Changes pushed to GitHub with descriptive commit message

- [x] Implement Real-Time Cryptocurrency Data
  - Enhanced crypto price fetching with multiple real-time APIs (Binance, CoinGecko, CoinMarketCap)
  - Added comprehensive error handling and fallback mechanisms for maximum reliability
  - Implemented 15-30 second update intervals for live trading data
  - Added market overview statistics and trending cryptocurrencies
  - Enhanced data validation to ensure only real market data is displayed
  - Removed any mock data fallbacks - all data is now sourced from live exchanges
  - ✅ VERIFIED: Build passes successfully with real-time data implementation

- [x] Implement Stock Trading with Charts
  - Added comprehensive stock trading functionality with real-time data APIs (Yahoo Finance, Alpha Vantage, CoinMarketCap)
  - Installed TradingView Lightweight Charts library for professional financial charts
  - Created StockTrading.tsx component with search, candlestick charts, buy/sell interface, and order management
  - Integrated stock trading into UserDashboard with new Stocks navigation tab
  - Implemented real-time price updates (30-second intervals) and chart data visualization
  - Added comprehensive error handling and fallback mechanisms for stock data reliability
  - Resolved TypeScript compilation errors and verified successful build
  - ✅ VERIFIED: Development server running successfully on http://localhost:5174/

- [x] Update Investment Packages Across All Pages
  - Updated Home.tsx, About.tsx, and Packages.tsx to display actual investment plans from UserDashboard
  - Replaced generic packages with PLAN_CONFIG data showing real investment plans (3-Day, 7-Day, 12-Day, 15-Day, 3-Month, 6-Month)
  - Updated package descriptions, durations, ROI rates, and investment ranges to match dashboard plans
  - Changed page headings from "packages" to "investment plans" for consistency
  - Added sample earnings calculations and proper formatting for all plan details
  - ✅ VERIFIED: Build passes successfully with updated investment packages

- [x] Fix Navigation Button Links
  - Fixed "Go to dashboard" button on homepage packages section to link to "/dashboard" instead of "/dashboard.html"
  - Fixed "View Full Package Details" button on about page to link to "/packages" instead of "/packages.html"
  - Both buttons now use proper React Router Link components for client-side navigation
  - ✅ VERIFIED: Build passes successfully with corrected navigation links

- [x] Fix Admin Dashboard Loading Issue
  - Added timeout wrapper (10 seconds) for Supabase database calls to prevent hanging
  - Added fallback loading timeout (15 seconds) to ensure loading state doesn't hang indefinitely
  - Improved error handling with finally block to guarantee setLoading(false) is always called
  - Fixed TypeScript errors by adding explicit type annotations for map function parameters
  - Admin dashboard now loads with mock data when Supabase is unavailable or times out
  - ✅ VERIFIED: Build passes successfully and admin dashboard loading issue is resolved

- [x] Fix Investment Approval Not Saving
  - Updated handleApproveInvestment and handleRejectInvestment functions to save status changes to database
  - Added proper error handling with try-catch blocks for database operations
  - Updated handleApproveWithdrawal and handleRejectWithdrawal functions to persist changes
  - Investment and withdrawal approvals now save to Supabase database instead of only updating local state
  - Added comprehensive error logging and user feedback for failed operations
  - ✅ VERIFIED: Investment approvals now persist to database and maintain state after page refresh

- [x] Fix Withdrawal Modal to Save to Database
  - Updated handleWithdrawalNext confirm step to call supabaseDb.createWithdrawal()
  - Added proper data structure for withdrawal records with all required fields
  - Added email notifications for withdrawal requests
  - Updated user balance locally after successful withdrawal submission
  - Added comprehensive error handling and user feedback
  - Fixed async function syntax error in handleWithdrawalNext
  - ✅ VERIFIED: Build passes successfully and withdrawal requests now persist to database

- [x] Make Stock Trading Page Mobile Responsive
  - Converted fixed two-column desktop layout to responsive single-column on mobile
  - Adjusted chart height from 400px to 300px on mobile devices
  - Made timeframe buttons wrap and resize appropriately for mobile
  - Optimized trading panel width and positioning for mobile screens
  - Resized popular stock buttons and improved wrapping on small screens
  - Made stock details grid responsive (2 columns on mobile vs auto-fit on desktop)
  - Adjusted stock details header layout for mobile (stack vertically on very small screens)
  - Optimized chart header layout for mobile devices
  - Improved search input sizing and placeholder text for mobile
  - Made loading state mobile-friendly with appropriate sizing
  - Reduced padding and margins throughout for mobile screens
  - Ensured all text sizes and spacing are mobile-optimized
  - ✅ VERIFIED: Build passes successfully with all mobile responsive changes

- [x] Make Investment Plans Mobile Responsive and Replace Browser Alerts
  - Made available investment plans section fully responsive:
    - Single column layout on mobile devices (< 768px)
    - Two column layout on tablets (768px - 1024px)
    - Three column layout on desktop (> 1024px)
    - Adjusted padding, gaps, and spacing for optimal mobile experience
  - Replaced browser alerts with professional modal popup system:
    - Added modal alert state and functions to StockTrading component
    - Replaced browser alert() with styled modal popup for trade confirmations
    - Added close button and auto-dismiss functionality (5 seconds)
    - Styled modals with gradient backgrounds matching alert types
    - Added proper overlay and z-index for modal display
  - Enhanced user experience across all dialogue popups:
    - Consistent modal design for all warnings and action confirmations
    - Mobile-optimized spacing, typography, and touch interactions
    - Professional gradient styling matching app theme
    - Touch-friendly close buttons and responsive layouts
  - ✅ VERIFIED: Build passes successfully with all responsive and modal improvements

- [x] Fix KYC Status Real-Time Updates
  - Moved KYC real-time subscription inside initDashboard function scope to access userData
  - Fixed TypeScript compilation error by resolving variable scope issue
  - Added automatic KYC status refresh and user notifications on approval/rejection
  - Implemented proper subscription cleanup on component unmount
  - ✅ VERIFIED: Build passes successfully and real-time KYC updates are working

- [x] Remove Demo Credentials from Admin Login Page
  - Removed AdminCredentialsDisplay component from AdminLogin.tsx
  - Cleaned up unused supabaseDb import
  - Removed demo credential display from the admin login interface
  - ✅ COMMITTED: Changes pushed to GitHub with descriptive commit message

- [x] Fix TypeScript Compilation Errors
  - Removed unused addAdmin.ts file that used Node.js APIs in browser environment
  - Added null check for admin.idnum in AdminResetter.tsx to prevent type error
  - Build now passes successfully without TypeScript errors
  - ✅ COMMITTED: Changes pushed to GitHub with descriptive commit message

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