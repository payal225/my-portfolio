import './globals.css';

export const metadata = {
  title: 'Payal Ghosh | Full Stack Developer & B.Tech CSE Student',
  description:
    "Explore Payal Ghosh's portfolio featuring full-stack applications (HabitFlow, TripNest, Mini ERP), 4x Google Cloud AI certifications, and modern web systems.",
  keywords: [
    'Payal Ghosh',
    'Full Stack Developer',
    'B.Tech CSE',
    'Sister Nivedita University',
    'React',
    'Next.js',
    'Node.js',
    'Express.js',
    'FastAPI',
    'MySQL',
    'MongoDB',
    'TripNest',
    'HabitFlow'
  ],
  authors: [{ name: 'Payal Ghosh' }],
  openGraph: {
    title: 'Payal Ghosh | Full Stack Developer & B.Tech CSE Student',
    description:
      "Explore Payal Ghosh's portfolio featuring full-stack applications (HabitFlow, TripNest, Mini ERP), 4x Google Cloud AI certifications, and modern web systems.",
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
