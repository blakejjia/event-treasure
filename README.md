# Event Treasure 🧭

**Event Treasure** is a centralized, intelligent event and community-post aggregator purpose-built for the UWaterloo student community. 

In a campus environment buzzing with activity, information overload is a real problem. Students often miss out on valuable networking opportunities, free food, and social gatherings simply because the information is scattered across dozens of disconnected social media pages, newsletters, and bulletin boards. Event Treasure solves this by acting as the ultimate single source of truth for campus happenings.

## 🌟 Value Proposition

- **AI-Powered Summarization & Annotations:** We don't just scrape data; we understand it. All aggregated posts and events undergo AI processing to generate concise summaries, assign relevant tags (e.g., "Free Food", "Social", "Career"), and extract critical metadata like start times and locations.
- **Smart Temporal Ranking:** Discovery is effortless. Events are strictly ranked chronologically based on their actual `start time`, not just when they were posted. Community announcements naturally decay with a dedicated algorithm, ensuring the feed is always fresh, relevant, and actionable.
- **Bento & Masonry Hybrid Interface:** We deliver a premium, visually engaging discovery experience. Utilizing a highly optimized gapless Masonry grid, Event Treasure provides a beautiful "Bento Box" aesthetic that is fully dynamic, retaining original media aspect ratios while keeping the layout impeccably clean.
- **Effortless Readability:** Information is parsed and presented specifically for skimmability, allowing students to map out their weeks in seconds.

## 🛠️ Technology Stack

Event Treasure is built for performance, scale, and extremely fluid UX:

- **Framework:** Next.js (App Router) for hybrid SSR/client-side rendering.
- **Styling:** Tailwind CSS integrated with Framer Motion for kinetic, Awwwards-inspired typography and micro-interactions.
- **Layout Engine:** `masonic` for high-performance, gapless algorithmic masonry grid rendering.
- **Database:** MongoDB for flexible, scalable aggregation of unstructured AI-processed event schemas.
- **Date/Time Handling:** `dayjs` for robust relative time formatting and local timezone rendering.

## 📋 Product Roadmap
- [x] Initial full-stack scaffolding and database integration.
- [x] Dynamic Bento / Masonry event grid.
- [x] Time-based intelligent ranking and Day.js relative formatting.
- [ ] Native calendar exports (.ics generation).
- [ ] Advanced map-based location view.

## 🤝 Contributing
As an open initiative for the Waterloo community, contributions are highly welcomed! Please see our contribution guidelines before opening a pull request.

*Built with ❤️ for the UWaterloo community.*
