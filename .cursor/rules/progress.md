# Progress

## 완료된 작업

- [x] Memory Bank 초기화
- [x] Next.js + TypeScript + Tailwind 프로젝트 생성
- [x] `@supabase/supabase-js`, `@supabase/ssr` 설치
- [x] `guestbook_entries` SQL 마이그레이션 파일 작성
- [x] Supabase 클라이언트 (`lib/supabase/client.ts`, `server.ts`, `middleware.ts`)
- [x] 루트 `middleware.ts`, `.env.local`, `.env.example`
- [x] `lib/types.ts`, `lib/edit-token-store.ts`
- [x] 방명록 UI 컴포넌트 (Form, List, Entry, App)
- [x] Realtime INSERT/UPDATE/DELETE 구독
- [x] CRUD RPC 연동 (update/delete)
- [x] 로딩·에러·빈 상태 UI
- [x] README 작성
- [x] `npm run build` 성공

## 진행 중

- [ ] (없음)

## 남은 작업

- [x] Supabase MCP로 `001_guestbook_entries.sql` 마이그레이션 적용 (test-guestbook)
- [x] 테스트 데이터 3건 INSERT (MCP)
- [ ] 로컬/프로덕션 end-to-end 테스트
- [x] Vercel Production 배포 (https://guestbook-homepage-20260923.vercel.app)
- [x] GitHub 저장소 연동 (dioneuty/guestbook-homepage-20260923)

## 알려진 이슈

- Next.js 16에서 `middleware` 파일 convention deprecated 경고 (proxy 마이그레이션은 후속)
- (없음) — Supabase 마이그레이션 MCP로 적용 완료

## 기술 부채

- rate limiting 미구현
- `edit_token` 보안은 MVP 수준 (README에 문서화)
