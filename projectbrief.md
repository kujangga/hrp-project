# HRP - Human Resource Photographer
## Project Brief

---

## 📋 Executive Summary

**HRP (Human Resource Photographer)** is a comprehensive full-stack marketplace platform that connects clients with professional photographers and videographers while offering integrated equipment rental and transportation booking services. The platform features an intelligent grade-based matching system (A-E tiers), automated replacement functionality, and real-time availability management to deliver seamless booking experiences.

**Project Status**: Active Development  
**Version**: 0.1.0  
**Last Updated**: January 27, 2026

---

## 🎯 Business Objectives

### Primary Goals
1. **Talent Marketplace**: Create a trusted platform connecting clients with vetted photographers and videographers
2. **Smart Matching**: Implement intelligent grade-based filtering and automated replacement system
3. **All-in-One Solution**: Provide comprehensive production services (talent + equipment + transport)
4. **Revenue Growth**: Enable streamlined booking flow to maximize conversion rates

### Target Users
- **Clients/Customers**: Individuals and businesses seeking photography/videography services
- **Photographers/Videographers**: Professional talent seeking consistent work opportunities
- **Admin/HRP Team**: Platform managers overseeing operations, talent recruitment, and quality control

### Key Metrics
- 1,200+ Talents in Network
- 4,500+ Successful Bookings
- 98% Smart Replacement Success Rate
- Multi-country Coverage (Indonesia + International)

---

## 🏗️ Technology Stack

### Frontend
- **Framework**: Next.js 15.5.2 (App Router)
- **UI Library**: React 19.1.0
- **Styling**: Tailwind CSS v4 + Custom CSS
- **Animations**: Framer Motion, Anime.js, AOS
- **Type Safety**: TypeScript 5

### Backend
- **API**: Next.js API Routes
- **Authentication**: NextAuth.js v4
- **Database ORM**: Prisma 6.15.0
- **Database**: SQLite (Development) / PostgreSQL (Production)

### Additional Services
- **Image/Video Storage**: Cloudinary, AWS S3 (via aws-sdk + multer-s3)
- **Maps**: Leaflet + React Leaflet
- **Date Management**: date-fns
- **UI Components**: Lucide React (icons), CVA (component variants)

### Development Tools
- **Linter**: ESLint 9
- **Build Tool**: Next.js built-in (Turbopack/Webpack)
- **Package Manager**: npm

---

## 🎨 Core Features & Functionality

### 1. Multi-Role Authentication System
**Roles**:
- `ADMIN` - Platform administrators
- `PHOTOGRAPHER` - Talent (photographers/videographers)  
- `CUSTOMER` - Clients booking services

**Features**:
- Secure registration and login
- Role-based access control
- Session management via NextAuth
- Guest checkout capability

---

### 2. Grade-Based Talent System

**Grade Classification (A-E)**:
- **Grade A**: Premium professionals (highest pricing tier)
- **Grade B-D**: Mid-tier experienced talent (tiered pricing)
- **Grade E**: Entry-level professionals (lowest pricing tier)

**Benefits**:
- Transparent quality indicators
- Price predictability
- Smart replacement with grade consistency
- Simplified filtering for clients

---

### 3. Simplified Booking System

**Direct Access Booking Flow**:
Users can directly access any service page and browse items with integrated filters. The simplified flow provides maximum flexibility and ease of use.

**Booking Flow**:
```
Service Page → Select Location & Date (Optional Filter) → 
Browse Available Items → Add to Cart → 
Cart Review → Checkout & Payment → Confirmation
```

**Service Pages**:
1. **Photographers**: Browse and book professional photographers by grade
2. **Videographers**: Browse and book professional videographers  
3. **Equipment**: Rent photography/videography equipment
4. **Transport**: Book team transportation and logistics

**Key Features**:
- **Direct Page Access**: Users can go straight to any service page from navigation
- **Integrated Filters**: Location, date, grade, and price filters on each page
- **Individual Add-to-Cart**: Each item has its own "Add to Cart" button
- **Flexible Filtering**: Location and date are optional filters, not required steps
- **Multi-Service Cart**: Cart can contain items from different service categories
- **Persistent State**: Cart persists across page navigation and browser sessions
- **Real-Time Availability**: Items filtered based on location and date availability
- **Quantity Management**: Adjust quantities for equipment and transport
- **Bundle Support**: Mix photographers, equipment, and transport in one booking

---

### 4. Checkout & Payment Process

**Checkout Flow**:
After reviewing items in the cart, users proceed to checkout where they complete their booking.

**Checkout Steps**:
```
Cart Review → Customer Information Form → Payment Processing → 
Booking Confirmation → Email Notification
```

**Customer Information Required**:
- Full Name
- Email Address
- Phone Number
- Event/Shoot Details
- Location & Date (if not already specified)
- Special Requirements/Notes (optional)

**Payment Methods**:
- Credit/Debit Card
- Bank Transfer
- E-Wallet (GoPay, OVO, Dana)
- Virtual Account

**Order Confirmation**:
- **Booking Code Generation**: Unique booking ID generated (e.g., HRP-2026-XXXXX)
- **Email Notification**: Automated email sent to customer containing:
  - Booking code
  - Order summary (items, quantities, prices)
  - Event details (location, date, duration)
  - Total amount paid
  - Payment receipt
  - Next steps and contact information
- **Order Status**: Booking status set to "Pending" awaiting admin/photographer confirmation

**Post-Booking**:
- Customer receives booking code via email
- Admin and assigned photographers notified
- Customer can track booking status via booking code
- Photographers can view and manage incoming bookings in their dashboard

---

### 5. Smart Replacement System


**Scenario**: When selected photographer/videographer becomes unavailable

**User Options**:
1. **Automatic Replacement**: System auto-replaces with same grade talent
2. **Manual Confirmation**: HRP team contacts customer for approval

**Grade Consistency Guarantee**: Replacement talent always matches original grade level

---

### 5. Availability Management

**For Talent**:
- Calendar blocking for unavailable dates
- Real-time availability updates
- Conflict detection and prevention
- Booking history dashboard

**For Clients**:
- Live availability filtering
- Date/location-based search
- Instant confirmation for available dates

---

### 6. Photographer/Videographer Profile Management

**Profile Components**:
- Personal information (name, bio, location, contact)
- Professional grade (A-E)
- Portfolio gallery (max 5 photos/videos)
- Social media links (Instagram)
- Pricing structure (hourly/daily rates)
- Bank account details for payments
- Profile status (Draft/Published)

**Self-Service Features**:
- Complete profile editing
- Portfolio upload via Cloudinary
- Availability calendar management
- Pricing updates

---

### 7. Equipment Rental System

**Features**:
- Comprehensive equipment inventory
- Search and filtering capabilities
- Quantity management
- Daily rate pricing
- Availability tracking
- Bundle packages with talent services

**Equipment Categories**: Cameras, lenses, lighting, drones, accessories

---

### 8. Transportation Booking

**Features**:
- Team logistics coordination
- Vehicle type selection (van, SUV, etc.)
- Capacity planning
- Location-based availability
- Cost calculator
- Integration with full booking flow

---

### 9. Location Intelligence

**Coverage**:
- **Indonesia**: City-level selection (Jakarta, Bali, Surabaya, etc.)
- **International**: Country-level selection with flexible city options

**Location Features**:
- Hierarchical location data (country → city)
- Real-time talent count per location
- Interactive map visualization
- Location-based pricing variations

---

### 10. Admin Dashboard

**Admin Capabilities**:
- Talent recruitment and onboarding
- Grade assignment and management
- Booking oversight and manual confirmations
- Analytics and reporting
- Master data management (locations, equipment, transport)
- User management
- Profile status control (Draft/Publish)

---

## 📊 Database Schema Overview

### Core Models

**User**
- Authentication and profile data
- Role assignment
- Relationships to bookings and notifications

**Photographer**
- Extended profile for talent
- Grade classification
- Pricing structure
- Portfolio and availability relations

**Booking**
- Main reservation entity
- Customer, location, and date information
- Status tracking (Pending/Confirmed/Cancelled/Completed)
- Total pricing

**BookingItem**
- Line items for bookings
- Polymorphic relations (photographer OR equipment OR transport)
- Quantity and pricing details

**BookingPhotographer**
- Junction table for booking-photographer many-to-many
- Replacement tracking

**Availability**
- Date-based calendar blocking
- Per-photographer availability management
- Booking status flag

**Location**
- Hierarchical location tree (country → city)
- Self-referential parent-child relationship

**Equipment & Transport**
- Service inventory
- Quantity and rate management

**Replacement**
- Replacement request tracking
- Grade consistency enforcement
- Status workflow (Pending/Accepted/Rejected)

**Notification**
- Multi-channel notifications (Email/SMS/In-App)
- User-specific messaging
- Read/unread status

---

## 🔄 System Architecture

### Frontend Architecture
```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard routes
│   ├── auth/              # Authentication pages
│   ├── booking/           # Booking flow pages
│   ├── customer/          # Customer dashboard
│   ├── photographer/      # Photographer management
│   ├── equipment/         # Equipment browsing
│   ├── transport/         # Transport booking
│   └── videographer/      # Videographer browsing
├── components/            # Reusable UI components
│   ├── landing/          # Landing page sections
│   └── ui/               # Base UI components
├── contexts/              # React Context providers
│   └── BookingContext    # Global booking state
├── lib/                   # Utilities and helpers
└── pages/api/            # API routes (NextAuth)
```

### Key Architectural Patterns
- **Context API**: Global state management for booking flow
- **Server Components**: Optimize performance with RSC
- **API Routes**: Serverless functions for backend logic
- **Prisma ORM**: Type-safe database access
- **Component Composition**: Modular, reusable UI components

---

## 🚀 Unique Value Propositions

1. **Grade-Based Transparency**: Clear quality tiers with consistent pricing
2. **Smart Replacement Guarantee**: 98% success rate maintaining quality standards
3. **Real-Time Availability**: Prevent double-booking with live calendar sync
4. **Multi-Selection Booking**: Add multiple services in single transaction
5. **All-in-One Platform**: Talent + Equipment + Transport in one marketplace
6. **Professional Verification**: Vetted talent with portfolio showcase
7. **Flexible Booking Types**: From individual services to full production packages
8. **Location Intelligence**: Geo-specific filtering and coverage visualization

---

## 📈 Development Roadmap

### Phase 1: Core Functionality ✅
- [x] Authentication system (multi-role)
- [x] Database schema and migrations
- [x] Basic booking flow
- [x] Photographer profile management
- [x] Landing page with service showcase

### Phase 2: Advanced Features (In Progress)
- [x] Dynamic booking context system
- [x] Multi-type booking flows
- [x] Cart management
- [ ] Payment integration
- [ ] Smart replacement automation
- [ ] Notification system

### Phase 3: Enhancement (Planned)
- [ ] Video testimonials
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] AI-powered talent matching
- [ ] Multi-language support
- [ ] Review and rating system

### Phase 4: Scale & Optimization
- [ ] Performance optimization
- [ ] CDN integration
- [ ] Database migration to PostgreSQL
- [ ] Advanced caching strategies
- [ ] Load testing and scaling

---

## 🎨 Design Philosophy

### Visual Identity
- **Primary Colors**: Purple/Indigo gradient (premium, professional)
- **Design Style**: Modern, clean, high-conversion focused
- **Typography**: Professional, readable fonts
- **Imagery**: High-quality portfolio showcases

### User Experience Principles
1. **Clarity**: Clear navigation and booking steps
2. **Trust**: Verified profiles, transparent pricing, testimonials
3. **Efficiency**: Streamlined booking flow, smart defaults
4. **Flexibility**: Multiple entry points, optional services
5. **Responsiveness**: Mobile-first, cross-device compatibility

---

## 🔐 Security & Compliance

- **Authentication**: Secure password hashing with bcryptjs
- **Authorization**: Role-based access control (RBAC)
- **Data Protection**: Environment variables for sensitive credentials
- **Session Management**: JWT-based via NextAuth
- **Input Validation**: Server-side validation for all user inputs
- **File Upload Security**: Cloudinary/S3 managed uploads with validation

---

## 📦 Deployment Strategy

### Development
- **Environment**: Local SQLite database
- **Server**: `npm run dev` on localhost:3000
- **Hot Reload**: Enabled for rapid development

### Production (Planned)
- **Platform**: Vercel (recommended) or AWS
- **Database**: PostgreSQL (managed instance)
- **CDN**: Cloudinary for media, Vercel Edge for static assets
- **Monitoring**: Error tracking, performance analytics
- **Backups**: Automated database backups

---

## 👥 Team & Stakeholders

### Current Team
- **Developer**: Full-stack development
- **Product Owner**: Business requirements and roadmap
- **Designer**: UI/UX design and branding

### Stakeholders
- **Clients**: End customers booking services
- **Talent**: Photographers and videographers
- **Admin Team**: Platform operations and support

---

## 📞 Support & Contact

### For Development Issues
- Repository: `/Users/jojo/Documents/Kuj/hrp-app`
- Documentation: See `hrp.md`, `BOOKING_SYSTEM.md`, `lp-design.md`

### For Business Inquiries
- Platform URL: `http://localhost:3000` (development)
- Admin Dashboard: `/admin`
- Photographer Portal: `/photographer`

---

## 📝 Additional Resources

- **Booking System Design**: [BOOKING_SYSTEM.md](./BOOKING_SYSTEM.md)
- **Landing Page Strategy**: [lp-design.md](./lp-design.md)
- **Application Overview**: [hrp.md](./hrp.md)
- **Database Schema**: [prisma/schema.prisma](./prisma/schema.prisma)
- **API Documentation**: Next.js API Routes in `src/pages/api/`

---

## 🏆 Success Indicators

### Technical Metrics
- Page load time < 2 seconds
- 99.9% uptime
- Zero critical security vulnerabilities
- Mobile-responsive across all devices

### Business Metrics
- Booking conversion rate > 15%
- Photographer registration rate growth
- Customer satisfaction score > 4.5/5
- Smart replacement success rate > 98%

---

**HRP - Connecting talented photographers with clients through intelligent matching and comprehensive service management.**
