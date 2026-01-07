# FreedomPath

A personal financial independence (FIRE) tracking Progressive Web App built with Next.js. Track your Net Worth, Savings Rate, and "Freedom Score" (Passive Income / Monthly Expenses) on your journey to financial freedom.

## Features

### Dashboard
- **Freedom Score**: A percentage showing how much of your monthly expenses are covered by passive income (based on 4% rule)
- **Net Worth Overview**: Quick glance at your total net worth
- **Years to FIRE**: Estimated time until you reach financial independence
- **Savings Rate**: Average percentage of income saved
- **FIRE Milestones**: Track progress toward Coast FIRE, Lean FIRE, Regular FIRE, and Fat FIRE

### Net Worth Tracker
- Track **Assets**: Cash, Stocks/Funds, Real Estate, Bonds, Crypto, Other
- Track **Liabilities**: Mortgage, Car Loan, Student Loan, Credit Card, Other
- Edit and delete entries with tap interactions
- Visual breakdown of total assets vs liabilities

### Cash Flow
- Log monthly **Income** and **Expenses**
- Automatic **Savings Rate** calculation
- Visual bar chart showing income vs expenses trends
- Monthly history with easy editing

### Forecast
- **Compound Interest Simulator**: Project your net worth over 30 years
- Adjustable parameters (return rate, monthly contribution)
- **What-If Scenarios**: Conservative, Moderate, Aggressive, Boost Savings
- Projected milestones ($100K, $250K, $500K, $1M)

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Data Persistence**: IndexedDB via [idb](https://github.com/jakearchibald/idb)
- **PWA**: [Serwist](https://serwist.pages.dev/) (Service Worker)

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm

### Installation

```bash
# Install dependencies
npm install

# Generate PWA icons
npm run generate-icons

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm run start
```

## PWA Installation

### iOS
1. Open the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"

### Android
1. Open the app in Chrome
2. Tap the menu (three dots)
3. Select "Add to Home Screen" or "Install App"

### Desktop
1. Open the app in Chrome/Edge
2. Click the install icon in the address bar

## Financial Calculations

All financial math is centralized in `src/lib/finances.ts`:

- **Net Worth**: Total Assets - Total Liabilities
- **Savings Rate**: (Income - Expenses) / Income × 100
- **Freedom Score**: (Passive Income / Monthly Expenses) × 100
- **Passive Income**: Invested Assets × Withdrawal Rate / 12
- **FIRE Number**: Monthly Expenses × 12 × 25 (based on 4% rule)
- **Years to FIRE**: Compound growth calculation with monthly contributions

## Data Storage

All data is stored locally in your browser using IndexedDB. Your financial data never leaves your device. Data persists across browser sessions and is available offline.

## License

MIT
