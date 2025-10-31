# Section 12 of 18: Unified Project Structure

This is the target project structure for our monorepo.

```plaintext
/
├── docs/
│   ├── architecture.md
│   ├── prd.md
│   └── ...
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/
│   │   ├── (dashboard)/
│   │   │   ├── [vendor_slug]/
│   │   │   │   ├── dashboard/
│   │   │   │   └── upload/
│   │   │   └── layout.tsx
│   │   └── [vendor_slug]/
│   │       └── page.tsx      # <-- Public, server-rendered vendor page
│   ├── components/
│   ├── lib/
│   ├── services/
│   └── store/
├── supabase/
│   ├── migrations/
│   │   └── 0001_initial_schema.sql
│   └── functions/
│       └── ...
├── wiki/                 # Training materials and team onboarding docs
├── package.json
├── pnpm-lock.yaml
└── ...
```

---
