# System Patterns

## 아키텍처 개요

```
[Browser / Next.js Client]
        │
        ├─ Server Components (초기 데이터 fetch, SEO)
        │
        └─ Client Components (폼, Realtime 구독)
                │
                ▼
        [Supabase Client]
                │
                ├─ REST / PostgREST (CRUD)
                └─ Realtime (postgres_changes)
                        │
                        ▼
                [Supabase PostgreSQL]
```

## Next.js 구조 (예정)

```
app/
  layout.tsx          # 루트 레이아웃, Tailwind, 메타
  page.tsx            # 방명록 메인 페이지
  globals.css
components/
  GuestbookForm.tsx   # 작성 폼 (client)
  GuestbookList.tsx   # 목록 + Realtime (client)
  GuestbookEntry.tsx  # 단일 항목
lib/
  supabase/
    client.ts         # 브라우저용 createBrowserClient
    server.ts         # 서버용 createServerClient (RSC)
  types.ts            # GuestbookEntry 타입
```

## 데이터 모델 (초안)

**테이블: `guestbook_entries`**

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid (PK) | 기본 키 |
| name | text | 작성자 이름 |
| message | text | 방명록 내용 |
| created_at | timestamptz | 작성 시각 (default now()) |

## Supabase 패턴

- **클라이언트 분리**: `client.ts`(Client Component), `server.ts`(Server Component/Route Handler)
- **Realtime**: `INSERT` 이벤트 구독 후 로컬 state에 merge (중복 방지)
- **RLS**: 익명 `anon` 역할 — SELECT/INSERT 허용, UPDATE/DELETE는 초기에 차단
- **환경 변수**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

## UI 패턴

- Tailwind utility-first, 컴포넌트 단위 스타일
- Client Component는 `'use client'` 최소 범위에만 사용
- 폼: controlled input + submit 시 optimistic UI (선택)

## 보안·운영

- Service Role Key는 서버 전용, 클라이언트에 노출 금지
- 입력 길이 제한 (DB constraint + 프론트 validation)
- Rate limiting은 Supabase Edge Function 또는 RLS 확장 시 검토
