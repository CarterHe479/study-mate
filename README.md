# 📚 StudyMate

**StudyMate** is a full-stack note-taking application built with Next.js 15. It allows users to create, edit, manage, and securely share notes with others via unique public links.

## 🚀 Features

* ✅ **User Authentication** (GitHub OAuth via NextAuth)
* 📝 **Note Management**

  * Create, edit, delete, and search notes
  * Tag notes for easy filtering
* 🔒 **Private by Default**

  * Notes are accessible only to the owner
* 🌐 **Public Sharing**

  * Generate a **public link** to share a note externally
* 🖋️ **Markdown Support**

  * Live markdown preview for rich content
* 💅 **Responsive UI**

  * Tailwind CSS with hover effects, transitions, and polished card layouts
* ✅ **Production Ready**

  * Deployed via Vercel + Supabase (PostgreSQL)
* 📦 **CI/CD**

  * Automatic deployment on each push

---

## 🛠️ Tech Stack

| Layer              | Technology                                           |
| ------------------ | ---------------------------------------------------- |
| **Frontend**       | Next.js 15 (App Router), Tailwind CSS, ReactMarkdown |
| **Backend**        | Next.js API Routes & Server Actions, Prisma ORM      |
| **Database**       | PostgreSQL (Supabase)                                |
| **Authentication** | NextAuth.js (GitHub Provider)                        |
| **Deployment**     | Vercel + Prisma Migrate                              |

---

## ✨ Getting Started

### 1️⃣ Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/study-mate.git
cd study-mate
npm install
```

### 2️⃣ Setup Environment

Create a `.env` file:

```env
DATABASE_URL=postgresql://<USER>:<PASSWORD>@<HOST>:<PORT>/<DB>
NEXTAUTH_SECRET=your-random-secret
NEXTAUTH_URL=http://localhost:3000
GITHUB_ID=your-github-oauth-client-id
GITHUB_SECRET=your-github-oauth-client-secret
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3️⃣ Set Up Database

Run Prisma migrations:

```bash
npx prisma migrate dev --name init
```

(Optional) Generate Prisma client:

```bash
npx prisma generate
```

### 4️⃣ Run Locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) 🚀

---

## 🗄️ Database Schema (Highlights)

```prisma
model Note {
  id         String   @id @default(cuid())
  title      String
  content    String
  tags       String
  status     String   @default("active")
  isPublic   Boolean  @default(false)
  publicId   String?  @unique
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
  user       User     @relation(fields: [userId], references: [id])
  userId     String
}
```

---

## ✅ Project Highlights

* **Authentication & Access Control**: Notes are tied to authenticated users and are private by default.
* **Advanced Logic**: Public link generation with unique `publicId` (using `nanoid`), and content moderation field (`status`).
* **User Experience**: Clean responsive UI, animated interactions, markdown rendering, and live preview.
* **Deployment**: Full CI/CD with migrations and Prisma client generation via Vercel.

---

## 💡 Future Ideas

* Collaborative editing
* Rich media (file uploads)
* Role-based permissions (viewer, editor)
* Stats on note views


---

## 📜 License

MIT

