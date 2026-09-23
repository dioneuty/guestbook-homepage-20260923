# Active Context

## 현재 작업 포커스

**프로젝트 초기화 단계** — Memory Bank 생성 완료. 다음은 Next.js + Tailwind 보일러플레이트 및 Supabase 연동 착수.

## 최근 변경사항

- 2026-09-23: Memory Bank 6개 핵심 파일 초기화
- 2026-09-23: 프로젝트 방향 확정 — Supabase 실시간 방명록, Next.js + Tailwind CSS

## 활성 결정사항

| 결정 | 내용 | 이유 |
|------|------|------|
| 프레임워크 | Next.js App Router | RSC + 배포 용이 |
| 스타일 | Tailwind CSS | 빠른 UI, 유틸리티 기반 |
| 백엔드 | Supabase | DB + Realtime 통합, 서버리스 |
| 인증 | 초기 미사용 (익명) | 범위 축소, 빠른 MVP |
| Realtime | `postgres_changes` INSERT 구독 | 새 방명록 즉시 반영 |

## 다음 단계

1. `create-next-app`으로 Next.js + TypeScript + Tailwind 프로젝트 스캐폴딩
2. Supabase 프로젝트 생성 및 `guestbook_entries` 테이블·RLS·Realtime 설정
3. `@supabase/supabase-js`, `@supabase/ssr` 설치 및 클라이언트 유틸 작성
4. 방명록 폼·목록 UI 및 Realtime 연동
5. `.env.example` 및 README 정리

## 주의사항

- Service Role Key 클라이언트 노출 금지
- Realtime 구독 cleanup (`useEffect` return) 필수
- RLS 없이 anon key만으로는 보안 위험 — 테이블 생성 시 정책 함께 정의
