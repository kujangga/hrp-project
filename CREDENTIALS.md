# HRP Account Credentials

> ⚠️ **File ini hanya untuk development/testing. Jangan commit ke production.**

Semua akun test menggunakan password yang sama: **`password123`**

---

## Admin

| Field    | Value           |
|----------|-----------------|
| Email    | admin@hrp.com   |
| Password | password123     |
| Role     | ADMIN           |
| Dashboard| `/admin`        |

---

## Talent (Photographer / Videographer)

| Field    | Value           |
|----------|-----------------|
| Email    | talent@hrp.com  |
| Password | password123     |
| Role     | TALENT          |
| Dashboard| `/dashboard`    |
| Linked   | Andi Rahman (Photographer) |

---

## Vendor

| Field          | Value              |
|----------------|--------------------|
| Email          | vendor@hrp.com     |
| Password       | password123        |
| Role           | VENDOR             |
| Dashboard      | `/vendor`          |
| Company Name   | PT Demo Vendor     |
| Contact Person | Demo User          |
| Phone          | 081234567890       |

---

## Cara Re-seed Database

```bash
npx tsx prisma/seed.ts
```

> Ini akan menghapus semua data dan membuat ulang dari awal termasuk test accounts.
