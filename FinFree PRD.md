# **Product Requirements Document: "FreedomPath" PWA**

## **1\. Executive Summary**

**FreedomPath** is a personal financial independence (FIRE) tracking application built as a Next.js PWA. Its primary purpose is to help the user visualize their progress toward financial freedom by tracking Net Worth, Savings Rate, and the "Freedom %" (Passive Income / Monthly Expenses).

## **2\. Target Audience**

* Primarily for personal use (The User).  
* Mobile-first users who want to log data on the go.

## **3\. Key Features**

### **Phase 1: Core Foundation**

* **PWA Integration:** Installable on iOS/Android with offline manifest.  
* **Net Worth Tracker:** Manual entry for Assets (Cash, Stocks, Real Estate) and Liabilities.  
* **FIRE Calculator:** Dynamic dashboard showing "Years to Freedom" based on current savings rate and 4% rule.  
* **Freedom Score:** A percentage-based progress bar (0% to 100%) toward covering monthly expenses with investment returns.

### **Phase 2: Monthly Dynamics**

* **Cash Flow Logging:** Simple interface to log monthly Income vs. Expenses.  
* **Savings Rate Visualization:** Monthly charts showing what percentage of income was saved.  
* **Target Milestones:** Gamified targets (e.g., "Lean FIRE", "Coast FIRE", "Fat FIRE").

### **Phase 3: Automation & Forecasting**

* **Compound Interest Simulator:** Forecast future net worth based on historical performance.  
* **Local-First Storage:** Use IndexedDB or a simple Supabase/Firebase backend for persistence.

## **4\. Technical Stack**

* **Framework:** Next.js 15 (App Router).  
* **Styling:** Tailwind CSS \+ Shadcn UI (optimized for mobile touch targets).  
* **Icons:** Lucide React.  
* **Charts:** Recharts or Tremor.  
* **PWA:** next-pwa or serwist.  
* **State Management:** Zustand (for simple, lightweight global state).

## **5\. User Experience (Mobile Focus)**

* Bottom navigation bar for easy thumb access.  
* Haptic-like feedback on button presses.  
* Minimalist data entry (no complex forms).  
* Dark mode by default to reduce eye strain.

## **6\. Success Metrics**

* Reaching "Freedom Day" (User's specific financial goal).  
* Weekly engagement (updating balances).