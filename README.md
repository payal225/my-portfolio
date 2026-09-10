# Payal | 3D Developer Portfolio (Next.js)

A cinematic, modern developer portfolio built with **Next.js (App Router)**, **React**, **Three.js**, and **Vanilla CSS** featuring interactive 3D particle animations, glassmorphism, responsive design, and modular architecture.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **UI Library**: [React](https://react.dev/)
- **3D Graphics**: [Three.js](https://threejs.org/)
- **Typography**: [Google Poppins](https://fonts.google.com/specimen/Poppins) via `next/font/google`
- **Styling**: Modern Vanilla CSS with CSS Variables & Glassmorphism

---

## 📁 Project Structure

```
my-portfolio/
├── app/
│   ├── globals.css         # Design system, glassmorphic tokens & responsive styling
│   ├── layout.jsx          # Root layout with zero-CLS Poppins font & SEO metadata
│   └── page.jsx            # Main page assembling sections
├── components/
│   ├── Starfield.jsx       # Client-side 3D Three.js interactive starfield
│   ├── Navbar.jsx          # Glassmorphic floating navigation
│   ├── Hero.jsx            # Hero presentation with CTA buttons
│   ├── Skills.jsx          # Categorized skills grid
│   ├── Certifications.jsx  # Verified certificates
│   ├── Projects.jsx        # Project showcases with tech pills & live links
│   ├── Connect.jsx         # Social connection cards
│   └── Footer.jsx          # Footer with back-to-top action
├── data/
│   └── portfolioData.js    # Centralized portfolio data (skills, projects, certs)
├── legacy/                 # Preserved original HTML, CSS, and JS files
├── package.json
└── next.config.mjs
```

---

## 🛠️ Getting Started

### 1. Install Dependencies

Using `pnpm`:
```bash
pnpm install
```

Or using `npm`:
```bash
npm install
```

### 2. Run the Development Server

```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the portfolio.

### 3. Build for Production

```bash
pnpm build
# or
npm run build
```

Then run the production server:
```bash
pnpm start
# or
npm run start
```
