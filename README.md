# She Rises - Safe Haven for Empowerment

A comprehensive nonprofit website for She Rises organization, dedicated to empowering women through transitional housing, supportive services, and reentry resources.

## 🌟 Features

- **Complete Website**: 10+ fully functional pages
- **E-commerce System**: Product catalog, cart, and checkout
- **Event Management**: Event listings with registration modal
- **Donation System**: Comprehensive donation forms and payment processing
- **Volunteer Portal**: Application forms and opportunity matching
- **Contact System**: Multi-channel contact forms and crisis resources
- **Responsive Design**: Mobile-first approach with beautiful UI

## 🏗️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom brand colors
- **UI Components**: shadcn/ui component library
- **State Management**: React Context API
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Forms**: React Hook Form with validation

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd she-rises-next-chapter
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── cards/           # Card components (Product, Event, etc.)
│   ├── layout/          # Layout components (Header, Footer)
│   ├── modals/          # Modal components
│   ├── sections/        # Section components (Hero, SectionHeader)
│   └── ui/              # shadcn/ui components
├── contexts/            # React Context providers
├── content/             # Static content (JSON data)
├── pages/               # Page components
├── assets/              # Static assets (images, etc.)
└── lib/                 # Utility functions

scripts/                 # Automation scripts
├── auto-commit.sh       # Auto-commit with error checking
├── watch-and-commit.sh  # Watch mode for auto-commits
└── README.md           # Scripts documentation
```

## 🎨 Brand Colors

- **Royal Plum**: `#4B2E6D` - Primary brand color
- **Crown Gold**: `#D4AF37` - Accent color for CTAs
- **Lotus Rose**: `#E67E80` - Secondary accent
- **Sage Green**: `#87A96B` - Supporting color
- **Warm Cream**: `#FDF6E3` - Light background

## 📄 Available Scripts

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript compiler

### Auto-Commit (New!)
- `npm run commit` - Auto-commit with error checking
- `npm run watch-commit` - Watch for changes and auto-commit
- `npm run check` - Run type checking and linting

See [scripts/README.md](scripts/README.md) for detailed information about auto-commit functionality.

## 🌐 Pages

1. **Home** (`/`) - Hero, pillars, stats, newsletter
2. **About** (`/about`) - Mission, founder, team, impact
3. **Programs** (`/programs`) - 6 detailed programs with images
4. **Events** (`/events`) - Event calendar with registration modal
5. **Get Involved** (`/get-involved`) - Volunteer and partnership forms
6. **Contact** (`/contact`) - Contact forms, directory, emergency resources
7. **Donate** (`/donate`) - Comprehensive donation system
8. **Shop** (`/shop`) - Product catalog with filtering
9. **Cart** (`/cart`) - Shopping cart functionality
10. **Checkout** (`/checkout`) - Multi-step checkout process

## 🛠️ Key Features

### Event Registration System
- Professional registration modal
- Form validation and error handling
- Capacity tracking and waitlist
- Payment integration for paid events
- Email confirmation system

### E-commerce System
- Product catalog with categories
- Shopping cart with React Context
- Multi-step checkout process
- Real-time inventory tracking
- Mission-aligned product descriptions

### Donation System
- Multiple donation amounts
- Recurring giving options
- Tribute and memorial gifts
- Secure payment processing
- Tax-deductible receipts

### Contact System
- Department-specific contact forms
- 24/7 crisis hotline information
- Emergency resource directory
- FAQ section with common questions

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Use `npm run commit` to auto-commit with error checking
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📝 Auto-Commit Workflow

This project includes intelligent auto-commit scripts that:
- ✅ Check for TypeScript errors before committing
- ✅ Run ESLint for code quality
- ✅ Generate descriptive commit messages
- ✅ Automatically push to GitHub
- ✅ Provide detailed feedback

Use `npm run commit` after making changes for a smooth workflow!

## 🎯 Mission Alignment

Every aspect of this website is designed to support She Rises' mission:
- **Accessibility**: WCAG compliant design
- **Trauma-Informed**: Gentle, supportive messaging
- **Empowerment**: Positive, strength-based language
- **Community**: Social proof and testimonials
- **Transparency**: Clear impact metrics and financials

## 📞 Support

For technical issues or questions:
- Create an issue in this repository
- Contact the development team
- Check the [scripts documentation](scripts/README.md) for auto-commit help

## 📄 License

This project is created for She Rises - Safe Haven for Empowerment.

---

**Built with ❤️ for empowering women and transforming communities**

---

## 🔗 Original Lovable Project

**Lovable URL**: https://lovable.dev/projects/0a1bb02d-6d1f-438d-b449-8c7a32cf9c38

This project was originally built with Lovable and enhanced with custom auto-commit functionality.
