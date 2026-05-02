This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Supabase Storage Setup

After deploying, you must create the following Storage buckets in the [Supabase Dashboard](https://supabase.com/dashboard) → Storage:

### `avatars` bucket (profile images)

1. Go to **Storage** → **New bucket**
2. Name: `avatars`
3. **Public bucket**: ✅ ON (profile images must be publicly accessible)
4. Add RLS policies via **Policies** tab:

```sql
-- Allow anyone to read avatars
CREATE POLICY "Public read avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users upload own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

> Note: Since this app uses GitHub OAuth (not Supabase Auth), uploads go through a server-side API route (`/api/upload-avatar`) that uses the service role key. The signed upload URL approach means the RLS insert policy is bypassed server-side, so you only need the public SELECT policy for reads.

### `skill-images` bucket (skill listing images)

Same setup as above but name: `skill-images`.

### `skill-files` bucket (SKILL.md files)

Same setup but name: `skill-files`. Can be set to private if you handle download authorization via signed URLs.
