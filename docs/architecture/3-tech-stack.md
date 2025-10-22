# Section 3 of 18: Tech Stack

| Category | Technology | Version | Purpose | Rationale |
| :--- | :--- | :--- | :--- | :--- |
| Frontend Language | TypeScript | latest | Type safety and scalability | Industry standard for modern web development, reduces errors. |
| Frontend Framework | Next.js | latest | Core application framework | Provides a robust, performant, and scalable foundation for the UI. |
| UI Component Library | Shadcn UI, Magic UI, Aceternity UI | latest | UI components and animations | A rich ecosystem to accelerate development and achieve a high-quality, modern finish. |
| State Management | Zustand | latest | Global state management | A small, fast, and scalable solution with a simple hook-based API. |
| Backend Language | TypeScript | latest | Language for Supabase Edge Functions | To write any necessary server-side logic in a familiar language. |
| Backend Framework | Supabase | latest | Backend as a Service (BaaS) | Provides database, auth, and APIs out-of-the-box, accelerating development. |
| API Style | REST | via PostgREST | Auto-generated APIs for database interaction | Supabase provides a powerful and secure RESTful API layer automatically. |
| Database | Supabase (Postgres) | latest | Primary data store for premium vendors | A robust, open-source relational database with excellent performance. |
| Cache | N/A | N/A | Client-side caching will be used | Caching will be handled at the client level to improve perceived performance. |
| File Storage | ImageKit | N/A | Multi-account media hosting and optimization | A powerful solution for managing and serving images efficiently. |
| Authentication | Supabase Auth | latest | Secure user authentication | Provides Magic Link (passwordless) login out-of-the-box. |
| Frontend Testing | Jest & React Testing Library | latest | Unit and integration testing | Industry-standard tools for testing React applications. |
| Backend Testing | Jest | latest | Testing for Supabase Edge Functions | To ensure any custom server-side logic is reliable. |
| E2E Testing | Playwright | latest | End-to-end user flow testing | A modern and reliable choice for ensuring critical user journeys work as expected. |
| Build Tool | SWC (via Next.js) | latest | Fast code compilation | Integrated into Next.js for optimal performance. |
| CI/CD | Vercel | N/A | Continuous integration & deployment | Seamlessly integrated with the hosting platform for automated builds and deploys. |
| Monitoring | Google Analytics 4 | N/A | User behavior and funnel tracking | Provides essential product engagement KPIs. |
| Logging | Lark Webhook | N/A | Critical error alerting | A simple mechanism to alert the development team of critical failures. |
| CSS Framework | Tailwind CSS | latest | Utility-first styling | Allows for rapid UI development and easy maintenance. |

---
