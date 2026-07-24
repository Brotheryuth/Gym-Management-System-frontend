# Gym Management System - Front-End Terminal

A cashier terminal portal for managing gym memberships, subscriber registrations, plans, and payments.

## Table of Contents
- [Overview](#overview)
- [Getting Started](#getting-started)
- [Backend & Cold-Start Note](#backend--cold-start-note)
- [Quick Demo Bypass](#quick-demo-bypass)
- [Tech Stack](#tech-stack)
- [AI Use Declaration](#ai-use-declaration)

---

## Overview

This front-end web application serves as the cashier terminal interface for the Gym Management System. It allows cashiers to register members, manage subscription plans, record payments, and view real-time billing ledgers.

---

## Getting Started

### Requirement 
- Node.js (v18 or higher)
- npm

### Installation & Run

1. Clone the repository and navigate to the directory:
   ```bash
   cd Gym-Management-frontEnd
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

4. Build for production:
   ```bash
   npm run build
   ```

---

## Backend & Cold-Start Note

The backend REST API is hosted on Render's free tier.

- Render free web services spin down after inactivity and take ~30 to 50 seconds to wake up (cold start).
- The login screen includes an automated health check mascot that polls the server until connected.
- Once connected, the status sign updates automatically to confirm the backend is ready.

---

## Quick Demo Bypass

For fast evaluation without waiting for backend authentication:
- Click **Bypass Admin** or **Bypass Staff** on the login screen to access full dashboard views immediately.

---

## Tech Stack

- **Framework**: React + Vite
- **Styling**: Pure CSS
- **State & API**: Custom React Hooks & Fetch API

---

## AI Use Declaration

| Category | Details & Purpose |
| :--- | :--- |
| **AI Agent Type** | **Antigravity AI** (Google DeepMind, Gemini 3.6 Flash model) |
| **UI & Mobile Layouts** | Transformed user design ideas into React UI components,  (~99% AI-generated from my ideas and refinements). |
| **Code Organization** | Refactored React hooks (`useGymApi`, `useAppWorkflow`) and API services following DRY and single-responsibility principles. |
| **Error Handling & Sync** | Fixed error message parsing for Javalin backend responses, added optimistic UI state updates, and configured automatic server pings to keep the backend alive. |
| **Pair Programming** | Assisted with code generation, debugging, refactoring, and verifying project builds. |
