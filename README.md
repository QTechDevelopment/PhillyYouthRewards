PhillyYouthRewards
A mobile-friendly web app that encourages Philadelphia youth to engage with community resources. Users check in at community farms, recycling centers, libraries, museums, and volunteer sites to earn points and redeem rewards like movie tickets, Amazon/Spotify gift cards, V-Bucks, 2K coins, and local attractions (Franklin Institute, Art Museum, Indego bike sharing).
Overview
•	Check in at verified locations to earn points
•	Redeem points for rewards
•	Share experiences and photos in the Community tab
•	Track standings on the Leaderboard
•	Mobile-first design for smooth use on phones
Key Features
•	Check-ins: One-tap check-in with daily duplicate prevention
•	Rewards Store: Redeem prizes; points balance updates instantly
•	Leaderboard: City-wide ranking with badges/achievements
•	Profile: User stats, recent activity, redemptions
•	Community: Photo posts, likes, comments
•	Persistence: Offline-friendly localStorage (upgradeable to a backend)
Tech Stack
•	Frontend: HTML, CSS, JavaScript (vanilla; easily adaptable to React/Vite)
•	State: localStorage for MVP
•	Optional backend (future): Node/Express + Supabase/Firebase for auth, data, and media uploads
Data Model (MVP)
•	user: { id, name, points, avatar }
•	checkIns: [{ id, locationId, name, time }]
•	redemptions: [{ id, rewardId, name, cost, time }]
•	posts: [{ id, userId, userName, text, imageDataUrl, createdAt, likes, comments: [{ id, userName, text, time }] }]
•	locations: farms, recycling centers, libraries, museums, bikeshare
•	rewards: movie tickets, gift cards, V-Bucks, 2K coins, local passes
How It Works
1.	Earn points by checking in at approved locations.
2.	Redeem points in the Rewards tab.
3.	Share progress and photos in the Community tab.
4.	Climb the Leaderboard as you participate.
Screens/Navigation
•	Home: Quick stats, recent check-ins, shortcuts
•	Locations: Browse and check in at sites
•	Rewards: Shop and redeem rewards
•	Leaderboard: Top contributors and badges
•	Profile: Activity history and settings
•	Community: Posts with photos, likes, and comments
Getting Started
•	Download or clone the repository.
•	Open with a local server to enable routing and asset loading.
Quick start (static dev server options):
# Option 1: Node http-server
npm install -g http-server
http-server -p 5173

# Option 2: Python
# Python 3
python -m http.server 5173

# Option 3: Live Server (VS Code extension)
# Right-click index.html -> "Open with Live Server"

Then visit:
•	http://localhost:5173
On Replit:
•	Use the default web server template or run a simple static server in the Shell as above.
Configuration
No environment variables are required for the MVP. For future backend integrations, add a .env file and a client-side loader (dotenv for Node or inject via build).
Mobile-Friendly
•	Viewport meta for proper scaling
•	Responsive layout and images
•	Large touch targets (44px+) for buttons and nav
Roadmap
•	Authentication (email/SSO) and multi-user data
•	Secure check-in (QR codes and/or geofencing)
•	Media uploads to S3/Cloudinary with size limits
•	Admin dashboard for locations, rewards, moderation
•	Anti-cheat rules and content reporting
•	PWA installability, offline caching, push notifications
Development Notes
•	MVP uses localStorage. Consider migrating to a real database for multi-user:
o	Auth: Supabase/Firebase
o	Data: Postgres (Supabase) or Firestore
o	Media: Cloudinary/S3 with signed uploads
•	Move point logic server-side to prevent tampering
•	Add rate limits and validation for check-ins and posts
Contributing
•	Fork the repo and create feature branches from main
•	Use conventional commit messages (feat:, fix:, docs:, chore:)
•	Open a PR with screenshots for UI changes and a short test plan
License
•	MIT (or update to your preferred license)
Attribution
•	Philadelphia locations are examples and can be expanded in data files
•	Brand names (AMC, Amazon, Spotify, V-Bucks, 2K, Indego, Franklin Institute, PMA) are illustrative; establish partnerships as needed
