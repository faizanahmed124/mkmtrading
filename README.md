# My Motors — Car Dealership Website

Next.js 16 + Tailwind v4 + Framer Motion (animated/3D UI) + Supabase (database, auth, storage).

Customer koi bhi ho, website open karte hi cars, unki details aur price dekh sakta hai.
Jo car pasand aaye us par click karke poori detail aur **shop ka address / map** mil jata hai,
taake wo waha ja kar car buy kar sake. Admin ek alag secure login se apni saari cars
(details + pictures) aur shop ka address khud manage kar sakta hai — koi coding ki
zaroorat nahi.

---

## 1. Kya kya hai is project mein

- **Home page** — animated hero + saari cars ki listing (grid), price ke sath.
- **Car detail page** — photos gallery, full specs (year, mileage, fuel, transmission,
  color, condition), price, aur "Get directions" button jo shop ka Google Maps location
  khol deta hai.
- **Admin panel** (`/admin/login`) — login ke baad `/admin/dashboard` par:
  - Cars add / edit / delete karna (pictures upload karna bhi isi mein hai)
  - Kisi car ko "Featured" mark karna (home page par bada dikhega)
  - Shop ka naam, address, phone, WhatsApp aur map link update karna
- Poora data **Supabase** mein store hota hai (database + image storage + login),
  is liye admin jo bhi update kare, website turant reflect kar deti hai.

---

## 2. Supabase set up karna (5 minute ka kaam)

1. [supabase.com](https://supabase.com) par free account banayein aur **New Project**
   create karein.
2. Project ke andar **SQL Editor** kholein, is repo ki file `supabase/schema.sql`
   ka poora content copy karein, paste karein, aur **Run** dabayein. Ye automatically:
   - `cars` table banayega (RLS ke sath — sab log dekh sakte hain, sirf admin edit kar sakta hai)
   - `site_settings` table banayega (shop address waghera ke liye)
   - `car-images` naam ka public storage bucket banayega (pictures ke liye)
3. **Project Settings → API** mein jayein aur ye do values copy karein:
   - `Project URL`
   - `anon public` key
4. Is repo mein `.env.local.example` file ko `.env.local` naam se copy karein aur
   dono values paste kar dein:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   ```
5. Admin ka login banane ke liye: Supabase Dashboard → **Authentication → Users →
   Add user** → apna email/password daal kar admin account bana lein. (Jaan-boojh
   kar website par koi public "sign up" form nahi rakha — sirf aap khud admin
   bana sakte hain, taake koi aur admin panel mein na ghus sake.)

---

## 3. Website chalana (local pe)

```bash
npm install
npm run dev
```

Browser mein `http://localhost:3000` kholein. Admin panel: `http://localhost:3000/admin/login`.

---

## 4. Deploy karna (online dalna)

Sab se aasan tareeqa **Vercel** hai (free hai):

1. Is code ko GitHub par push karein.
2. [vercel.com](https://vercel.com) par jayein → **New Project** → apni GitHub repo select karein.
3. Environment Variables mein wahi do values daal dein jo `.env.local` mein thi.
4. **Deploy** dabayein — 1-2 minute mein live link mil jayega.

---

## 5. Roz mara istemal (Admin)

- `/admin/login` par jayein, email/password se login karein.
- **Cars** tab mein "Add car" se nayi car daalein: brand, model, year, price,
  mileage, fuel type, transmission, color, condition, description, aur photos
  (multiple upload kar sakte hain).
- **Shop settings** tab mein apni dukaan ka naam, address, phone, WhatsApp number
  aur Google Maps link update karein — ye customer ko har car ke page par nazar
  aata hai.
- "Featured" checkbox on karne se wo car home page par bade card mein highlight ho jati hai.

---

## 6. Tech stack (reference ke liye)

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4**
- **Framer Motion** — hero animation, 3D tilt car cards, page transitions
- **Supabase** — Postgres database, Auth (admin login), Storage (car photos)
- **lucide-react** — icons

## 7. Aage jo changes chahiye

Jaisa aap ne kaha, agle changes hum baad mein discuss kar lenge — structure
modular hai (har section apna component hai), is liye naye features (jaise
filters, financing calculator, multiple admins, waghera) aasani se add ho sakte hain.
