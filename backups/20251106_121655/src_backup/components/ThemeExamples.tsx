// ============================================
// THEME IMPLEMENTATION EXAMPLES
// Copy these patterns to your React components
// ============================================

import React from 'react';

// Example 1: Elegant Primary Button Component
export const ButtonElegant = ({ 
  children, 
  variant = 'primary',
  className = '',
  ...props 
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'accent' }) => {
  const baseStyles = 'px-6 py-2 rounded-lg font-medium transition-all duration-200 active:scale-95 focus:ring-2 focus:outline-none';
  
  const variantStyles = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-active focus:ring-ring',
    accent: 'bg-accent text-accent-foreground hover:bg-accent-hover focus:ring-accent'
  };

  return (
    <button 
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Example 2: Elegant Card Component
export const CardElegant = ({ 
  children, 
  className = '',
  elevated = false 
}: { 
  children: React.ReactNode; 
  className?: string;
  elevated?: boolean;
}) => {
  return (
    <div 
      className={`bg-card text-card-foreground border border-border rounded-lg transition-all duration-300 ${
        elevated ? 'shadow-lg' : 'shadow-sm'
      } hover:shadow-lg ${className}`}
    >
      {children}
    </div>
  );
};

// Example 3: Elegant Input Component
export const InputElegant = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { accentRing?: boolean }
>(({ className = '', accentRing = false, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`
        bg-input border border-border text-foreground placeholder:text-muted-foreground
        rounded-lg px-4 py-2
        transition-all duration-200
        focus:ring-2 focus:outline-none
        ${accentRing ? 'focus:ring-accent' : 'focus:ring-ring'}
        ${className}
      `}
      {...props}
    />
  );
});

InputElegant.displayName = 'InputElegant';

// Example 4: Elegant Link with Underline Animation
export const LinkElegant = ({ 
  href, 
  children, 
  className = '' 
}: { 
  href: string; 
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <a 
      href={href}
      className={`
        relative inline-block text-primary hover:text-primary-hover 
        transition-colors duration-200 pb-1 group
        ${className}
      `}
    >
      {children}
      <span 
        className="
          absolute bottom-0 left-0 w-0 h-0.5 bg-accent 
          transition-all duration-300 group-hover:w-full
        "
      />
    </a>
  );
};

// Example 5: Section with Elegant Divider
export const SectionWithDivider = ({ 
  title, 
  children, 
  className = '' 
}: { 
  title?: string; 
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <section className={className}>
      {title && <h2 className="text-2xl font-semibold mb-6">{title}</h2>}
      {children}
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent my-8" />
    </section>
  );
};

// Example 6: Product Card with Texture
export const ProductCard = ({ 
  image, 
  title, 
  price, 
  onAddCart 
}: { 
  image: string; 
  title: string; 
  price: string;
  onAddCart: () => void;
}) => {
  return (
    <CardElegant className="overflow-hidden hover:-translate-y-1">
      <img 
        src={image} 
        alt={title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4">{price}</p>
        <ButtonElegant 
          variant="primary"
          onClick={onAddCart}
          className="w-full"
        >
          Add to Cart
        </ButtonElegant>
      </div>
    </CardElegant>
  );
};

// Example 7: Form with Elegant Styling
export const FormElegant = ({ onSubmit }: { onSubmit: (data: FormData) => void }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          Full Name
        </label>
        <InputElegant 
          id="name"
          name="name"
          placeholder="Enter your name"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          Email Address
        </label>
        <InputElegant 
          id="email"
          name="email"
          type="email"
          placeholder="your.email@example.com"
          accentRing
          required
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-2">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          placeholder="Your message here..."
          className={`
            w-full bg-input border border-border text-foreground
            placeholder:text-muted-foreground rounded-lg px-4 py-2
            transition-all duration-200
            focus:ring-2 focus:ring-accent focus:outline-none
            resize-none
          `}
          rows={4}
        />
      </div>

      <ButtonElegant variant="accent" className="w-full">
        Send Message
      </ButtonElegant>
    </form>
  );
};

// Example 8: Status Badge with Theme Colors
export const BadgeStatus = ({ 
  status 
}: { 
  status: 'confirmed' | 'pending' | 'declined' 
}) => {
  const statusStyles = {
    confirmed: 'bg-accent/10 text-accent border border-accent/30',
    pending: 'bg-muted text-muted-foreground border border-border',
    declined: 'bg-destructive/10 text-destructive border border-destructive/30'
  };

  const statusText = {
    confirmed: 'Confirmed',
    pending: 'Pending',
    declined: 'Declined'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[status]}`}>
      {statusText[status]}
    </span>
  );
};

// ============================================
// USAGE IN COMPONENTS
// ============================================

/*

// In a React component:

import {
  ButtonElegant,
  CardElegant,
  InputElegant,
  LinkElegant,
  SectionWithDivider,
  ProductCard,
  FormElegant,
  BadgeStatus
} from '@/components/theme-examples';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      
      {/* Header with elegant styling */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto py-6">
          <h1 className="text-4xl font-bold text-primary">Dua Insan</h1>
          <p className="text-muted-foreground">Elegant Online Invitations</p>
        </div>
      </header>

      <main className="container mx-auto py-12">
        
        {/* Hero Section */}
        <SectionWithDivider title="Welcome to Your Celebration">
          <CardElegant elevated className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Plan Your Perfect Event</h2>
            <p className="text-muted-foreground mb-6">
              Create elegant digital invitations that leave a lasting impression
            </p>
            <ButtonElegant variant="accent">
              Get Started
            </ButtonElegant>
          </CardElegant>
        </SectionWithDivider>

        {/* Products Grid */}
        <SectionWithDivider title="Browse Our Collections">
          <div className="grid md:grid-cols-3 gap-6">
            <ProductCard
              image="/product-1.jpg"
              title="Classic Elegance"
              price="$29.99"
              onAddCart={() => console.log('Added to cart')}
            />
            <ProductCard
              image="/product-2.jpg"
              title="Modern Minimalist"
              price="$39.99"
              onAddCart={() => console.log('Added to cart')}
            />
            <ProductCard
              image="/product-3.jpg"
              title="Luxury Premium"
              price="$49.99"
              onAddCart={() => console.log('Added to cart')}
            />
          </div>
        </SectionWithDivider>

        {/* Contact Form */}
        <SectionWithDivider title="Get in Touch">
          <CardElegant className="p-8 max-w-md mx-auto">
            <FormElegant onSubmit={(data) => console.log(data)} />
          </CardElegant>
        </SectionWithDivider>

        {/* Navigation with Links */}
        <div className="text-center space-x-4">
          <LinkElegant href="/gallery">View Gallery</LinkElegant>
          <span className="text-border">•</span>
          <LinkElegant href="/faq">FAQ</LinkElegant>
          <span className="text-border">•</span>
          <LinkElegant href="/contact">Contact</LinkElegant>
        </div>

      </main>

    </div>
  );
}

*/
