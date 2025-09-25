import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/podcast', label: 'Podcast' },
  { href: '/community', label: 'Community' },
  { href: '/shop', label: 'Shop' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const { pathname } = useRouter();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition backdrop-blur ${scrolled ? 'bg-navy/90 shadow-lg' : 'bg-transparent'}`}>
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 h-20">
        <Link href="/" className="flex items-center gap-2 font-display text-2xl tracking-wide">
          <span className="inline-block h-10 w-10 rounded-full bg-gradient-to-br from-brandBlue to-brandOrange"></span>
          <span>B3U</span>
        </Link>
        <ul className="hidden md:flex items-center gap-8 font-semibold">
          {navItems.map(item => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`relative py-2 after:absolute after:left-0 after:bottom-0 after:h-0.5 after:bg-brandOrange after:transition-all after:duration-300 ${
                  pathname === item.href ? 'text-brandOrange after:w-full' : 'after:w-0 hover:after:w-full'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="md:hidden">
          {/* Mobile menu placeholder - implement drawer later */}
          <button className="btn-light text-sm">Menu</button>
        </div>
      </nav>
    </header>
  );
}
