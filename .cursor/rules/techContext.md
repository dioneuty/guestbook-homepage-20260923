# Tech Context

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js (App Router) |
| UI | React, Tailwind CSS |
| 백엔드·DB | Supabase (PostgreSQL, Realtime, Auth 준비) |
| 언어 | TypeScript |
| 배포 (예정) | Vercel + Supabase Cloud |

## 주요 패키지 (예정)

- `next`, `react`, `react-dom`
- `@supabase/supabase-js` — Supabase 클라이언트
- `@supabase/ssr` — Next.js App Router SSR/쿠키 연동
- `tailwindcss`, `postcss`, `autoprefixer`

## 개발 환경

- Node.js 18+
- 패키지 매니저: npm / pnpm / yarn (프로젝트 생성 시 확정)
- IDE: Cursor / VS Code

## Supabase 설정

1. Supabase 프로젝트 생성
2. `guestbook_entries` 테이블 및 RLS 정책
3. Realtime publication에 테이블 추가
4. `.env.local` 예시:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

## 제약·관례

- App Router 기본 (`app/` 디렉터리)
- TypeScript strict 권장
- ESLint + Next.js 기본 설정
- 커밋 전 `.env*`는 gitignore (`.env.example`만 커밋)

## 참고 문서

- [Next.js App Router](https://nextjs.org/docs/app)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)
- [Supabase + Next.js SSR](https://supabase.com/docs/guides/auth/server-side/nextjs)
- [Tailwind CSS](https://tailwindcss.com/docs)
