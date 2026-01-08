# FinFree - Your Financial Freedom Journey

A personalized PWA for tracking your financial recovery and goals, built based on your Financial Recovery Plan 2026-2027.

## 🎯 Features

### Dashboard
- **Freedom Score** - Track your overall progress (0-100%)
- **Net Worth Tracker** - Real-time assets vs liabilities
- **OD Tracker** - Axis Ready Credit payoff progress with schedule
- **Monthly Budget** - Category-wise spending with daily limits
- **Quick Actions** - Fast access to common transactions

### Goals
- **Phase 1**: Debt Elimination (Feb-Jul 2026) - Clear ₹2.48L OD
- **Phase 2**: Emergency Fund (Aug-Oct 2026) - Build ₹1.35L reserve
- **Phase 3**: Goal Saving (Nov 2026+) - Bangalore Land & Wedding funds

### Progress
- Charts showing OD payoff progress
- Net Worth trend visualization
- Monthly income vs expenses breakdown
- Transaction history by month

### Transaction Logging
- Log income, expenses, OD payments, EMI, and savings
- Quick amount buttons for common values
- Category-based expense tracking

## 💰 Your Numbers (Hardcoded)

| Item | Amount |
|------|--------|
| Monthly Net Income | ₹1,09,000 |
| Debit Card EMI | ₹18,000/month |
| Lifestyle Cap | ₹45,000/month |
| Target OD Payment | ₹46,000/month |
| Initial OD Balance | ₹2,48,989 |

### Lifestyle Budget Breakdown
- Food & Groceries: ₹15,000
- Rent/Accommodation: ₹15,000
- Transport/Fuel: ₹5,000
- Utilities & Subscriptions: ₹3,000
- Phone/Internet: ₹1,500
- Miscellaneous: ₹5,500

### Goal Targets
- Emergency Fund: ₹1,35,000 (3 months expenses)
- Bangalore Land: ₹25,00,000
- Wedding Fund: ₹15,00,000

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### PWA Installation

1. Open the app in Chrome (mobile or desktop)
2. Click "Install" in the address bar or menu
3. The app will be added to your home screen

## 📱 Mobile-First Design

- Touch-optimized UI with 44px minimum touch targets
- Bottom navigation for easy thumb access
- Dark mode by default
- Pull-to-refresh support
- Offline capable (PWA)

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui
- **State**: Zustand (persisted to localStorage)
- **Charts**: Recharts
- **Icons**: Lucide React
- **PWA**: Custom service worker

## 📊 Data Persistence

All your financial data is stored locally in your browser using localStorage via Zustand persist middleware. This means:

- ✅ Your data stays on your device
- ✅ Works offline
- ✅ No server/database needed
- ⚠️ Clearing browser data will reset your progress
- 💡 Use Settings > Export Data to backup

## 🎨 Customization

To update your financial numbers, edit:
- `src/lib/constants.ts` - All financial values and targets
- `src/lib/types.ts` - Data type definitions

## 📋 Payoff Schedule

| Month | Start Balance | Payment | End Balance |
|-------|---------------|---------|-------------|
| Feb 2026 | ₹2,48,989 | ₹46,000 | ₹2,06,072 |
| Mar 2026 | ₹2,06,072 | ₹46,000 | ₹1,62,624 |
| Apr 2026 | ₹1,62,624 | ₹46,000 | ₹1,18,638 |
| May 2026 | ₹1,18,638 | ₹46,000 | ₹74,108 |
| Jun 2026 | ₹74,108 | ₹46,000 | ₹29,025 |
| Jul 2026 | ₹29,025 | ₹46,000 | ₹0 ✅ |

Total interest saved by following this plan: ~₹10,395

## 🔐 Privacy

This app runs entirely in your browser. No data is sent to any server. Your financial information never leaves your device.

## 📝 License

MIT - Feel free to customize for your own financial journey!

---

Built with ❤️ for financial freedom
