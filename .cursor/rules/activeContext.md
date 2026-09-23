# Active Context

## 현재 작업 포커스

**MVP 구현 완료** — Next.js + Tailwind + Supabase 클라이언트·UI·Realtime 연동 코드 작성 완료. Supabase SQL 마이그레이션 파일 준비됨.

## 최근 변경사항

- 2026-09-23: Next.js App Router 프로젝트 스캐폴딩
- 2026-09-23: `guestbook_entries` SQL 마이그레이션 (`supabase/migrations/001_guestbook_entries.sql`)
- 2026-09-23: Supabase 클라이언트 (`lib/supabase/*`), middleware 설정
- 2026-09-23: 방명록 CRUD UI + Realtime (`GuestbookApp`, Form, List, Entry)
- 2026-09-23: README, `.env.example` 작성

## 활성 결정사항

| 결정 | 내용 | 이유 |
|------|------|------|
| 프레임워크 | Next.js App Router | RSC + 배포 용이 |
| 스타일 | Tailwind CSS | 빠른 UI, 유틸리티 기반 |
| 백엔드 | Supabase | DB + Realtime 통합 |
| 인증 | 초기 미사용 (익명) | 범위 축소, 빠른 MVP |
| 수정/삭제 | `edit_token` + RPC | anon RLS로 안전한 UPDATE/DELETE |
| Realtime | `postgres_changes` INSERT/UPDATE/DELETE | 전체 CRUD 반영 |
| 목록 조회 | `edit_token` 제외 select | 토큰 노출 최소화 |

## 다음 단계

1. Supabase SQL Editor에서 `001_guestbook_entries.sql` 실행
2. `npm run dev`로 로컬 동작 확인
3. (선택) Vercel 배포

## 주의사항

- Service Role Key 클라이언트 노출 금지
- Realtime 구독 cleanup (`useEffect` return) 적용됨
- `edit_token`은 localStorage 기반 — 브라우저 변경 시 수정/삭제 불가
