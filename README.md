# 실시간 방명록

Next.js App Router + Tailwind CSS + Supabase Realtime 기반 방명록 웹사이트입니다.

## 기능

- 방명록 작성, 조회, 수정, 삭제 (CRUD)
- Supabase Realtime으로 다른 사용자 화면에 즉시 반영
- 익명 작성 (`edit_token` + localStorage로 본인 글만 수정/삭제)

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수

`.env.local` 파일을 생성하고 Supabase 값을 설정합니다.

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

`.env.example`을 참고할 수 있습니다.

### 3. Supabase 스키마 적용

Supabase Dashboard → SQL Editor에서 [`supabase/migrations/001_guestbook_entries.sql`](supabase/migrations/001_guestbook_entries.sql) 내용을 실행합니다.

이 스크립트는 다음을 설정합니다.

- `guestbook_entries` 테이블
- anon SELECT/INSERT RLS 정책
- `edit_token` 검증 RPC (`update_guestbook_entry`, `delete_guestbook_entry`)
- Realtime publication

### 4. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인합니다.

## 보안 참고

- `edit_token`은 글 작성 시 INSERT 응답으로만 받아 `localStorage`에 저장합니다. 목록 조회에서는 `edit_token`을 선택하지 않습니다.
- `edit_token`은 브라우저/기기에 묶여 있어 다른 환경에서는 수정·삭제가 불가합니다.
- 토큰이 유출되면 해당 글을 수정·삭제할 수 있습니다. MVP 수준의 제한입니다.
- Service Role Key는 클라이언트에 노출하지 마세요.

## 배포

### Vercel (Production)

- **URL**: https://guestbook-homepage-20260923.vercel.app
- **GitHub**: https://github.com/dioneuty/guestbook-homepage-20260923
- **Dashboard**: https://vercel.com/dioneutys-projects/guestbook-homepage-20260923

환경 변수 (Vercel Project Settings):

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

`main` 브랜치 push 시 GitHub 연동으로 자동 재배포됩니다.
