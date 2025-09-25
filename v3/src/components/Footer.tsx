import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-navy border-t border-white/10 mt-32">
      <div className="section-padding grid md:grid-cols-4 gap-12">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="h-10 w-10 rounded-full bg-gradient-to-br from-brandBlue to-brandOrange"></span>
            <span className="font-display text-xl">B3U</span>
          </div>
          <p className="text-sm text-white/70 max-w-xs">B3U: Be Bold. Be Resilient. Be You. Empowering voices and building a mission-driven community.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-brandOrange">Explore</h4>
          <ul className="space-y-2 text-sm">
            {['Home','About','Podcast','Community','Shop','Contact'].map(item => (
              <li key={item}><Link className="hover:text-brandOrange" href={`/${item === 'Home' ? '' : item.toLowerCase()}`}>{item}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-brandOrange">Connect</h4>
          <ul className="space-y-2 text-sm">
            <li><a className="hover:text-brandOrange" href="#">Instagram</a></li>
            <li><a className="hover:text-brandOrange" href="#">YouTube</a></li>
            <li><a className="hover:text-brandOrange" href="#">TikTok</a></li>
            <li><a className="hover:text-brandOrange" href="#">LinkedIn</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-brandOrange">Newsletter</h4>
          <form className="space-y-3">
            <input type="email" placeholder="Email address" className="w-full px-4 py-2 rounded-md bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-brandBlue" />
            <button className="btn-primary w-full" type="submit">Subscribe</button>
          </form>
        </div>
      </div>
      <div className="text-center py-6 text-xs text-white/50">© {new Date().getFullYear()} B3U. All rights reserved.</div>
    </footer>
  );
}
