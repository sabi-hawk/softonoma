# Dynamic CMS Website

A fully dynamic Next.js website with an admin panel that allows you to manage navigation items and pages without touching code.

## Features

- 🎯 **Dynamic Navigation**: Add, edit, delete, and reorder navigation items through the admin panel
- 📄 **Dynamic Pages**: Create and customize pages that are automatically routed
- 🎨 **Tailwind CSS**: Beautiful, responsive UI with Tailwind CSS
- 🗄️ **MongoDB**: Persistent data storage with MongoDB
- 🔧 **Admin Panel**: Full-featured admin interface for content management

## Prerequisites

- Node.js 18+ installed
- MongoDB installed locally or MongoDB Atlas account

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up MongoDB

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/xyz-cms
```

For MongoDB Atlas, use:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/xyz-cms
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 4. Access Admin Panel

Navigate to [http://localhost:3000/admin](http://localhost:3000/admin) to start managing your website.

## How to Use

### Managing Navigation

1. Go to the Admin Panel
2. Click on the "Navigation" tab
3. Click "Add Navigation Item"
4. Enter a label (e.g., "About", "Services") and slug (e.g., "about", "services")
5. Use the up/down arrows to reorder items
6. Edit or delete items as needed

### Creating Pages

1. Go to the Admin Panel
2. Click on the "Pages" tab
3. Click "Add Page"
4. Enter a title, slug (should match navigation slug if linking), and content
5. The page will be automatically accessible at `/{slug}`

### Linking Navigation to Pages

When you create a navigation item with a slug (e.g., "about"), create a corresponding page with the same slug. The page will be automatically accessible when users click the navigation item.

## Project Structure

```
src/
├── app/
│   ├── admin/          # Admin panel UI
│   ├── api/            # API routes for CRUD operations
│   ├── [...slug]/      # Dynamic page route
│   └── page.tsx        # Home page
├── components/          # React components (Navbar, etc.)
├── lib/                # Database connection
└── models/             # MongoDB models
```

## API Endpoints

### Navigation

- `GET /api/navigation` - Get all navigation items
- `POST /api/navigation` - Create navigation item
- `PUT /api/navigation/[id]` - Update navigation item
- `DELETE /api/navigation/[id]` - Delete navigation item
- `POST /api/navigation/reorder` - Reorder navigation items

### Pages

- `GET /api/pages` - Get all pages
- `POST /api/pages` - Create page
- `GET /api/pages/[slug]` - Get page by slug
- `PUT /api/pages/id/[id]` - Update page
- `DELETE /api/pages/id/[id]` - Delete page

## Technologies Used

- **Next.js 16** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **MongoDB** - Database
- **Mongoose** - MongoDB ODM

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Make sure to set the `MONGODB_URI` environment variable in your Vercel project settings.
