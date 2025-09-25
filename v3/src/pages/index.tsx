import Layout from '@/components/Layout';
import Hero from '@/components/Hero';
import Link from 'next/link';

export default function HomePage() {
  return (
    <Layout>
      <Hero />
      {/* About Section */}
  <section id="about" className="section-padding bg-white">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">About <span className="text-brandOrange">B3U</span></h2>
            <p className="text-white/80 leading-relaxed mb-6">We are a veteran-led media and community platform championing resilience, purpose, and transformation. Our conversations highlight voices that push through adversity and give back.</p>
            <Link href="/about" className="btn-outline">Learn More</Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-40 rounded-lg bg-[url('https://picsum.photos/300/300?1')] bg-cover bg-center" />
            <div className="h-40 rounded-lg bg-[url('https://picsum.photos/300/300?2')] bg-cover bg-center" />
            <div className="h-40 rounded-lg bg-[url('https://picsum.photos/300/300?3')] bg-cover bg-center" />
            <div className="h-40 rounded-lg bg-[url('https://picsum.photos/300/300?4')] bg-cover bg-center" />
          </div>
        </div>
      </section>
      {/* Podcast Preview */}
  <section id="podcast" className="section-padding bg-[#F4F8FB]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-10 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest Episodes</h2>
            <p className="text-white/70 max-w-xl">Catch a glimpse of recent conversations featuring veterans, innovators, and community builders making an impact.</p>
          </div>
          <div className="w-full md:w-[420px] aspect-video bg-black/40 rounded-lg flex items-center justify-center text-white/40 text-sm">Embedded Player Placeholder</div>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[1,2,3,4,5,6].map(n => (
            <div key={n} className="card">
              <div className="h-40 rounded-md bg-[url('https://picsum.photos/400/300?random=${n}')] bg-cover bg-center mb-4" />
              <h3 className="font-semibold mb-2">Episode Title {n}</h3>
              <p className="text-sm text-white/70 mb-4">Short teaser summary that hooks the audience and communicates value.</p>
              <Link href="/podcast" className="text-brandOrange hover:underline text-sm font-medium">Listen →</Link>
            </div>
          ))}
        </div>
      </section>
      {/* Community / Testimonials */}
  <section id="community" className="section-padding alt-band">
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Community Voices</h2>
          <p className="text-white/90">Stories from listeners and members who embody resilience and service.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[1,2,3].map(t => (
            <div key={t} className="card">
              <p className="italic text-sm mb-4">“B3U reignited my drive to serve and lead. Each episode is a reminder that our stories matter.”</p>
              <div className="flex items-center gap-3">
                <span className="h-10 w-10 rounded-full bg-[url('https://picsum.photos/100/100?portrait=${t}')] bg-cover bg-center" />
                <div>
                  <p className="font-semibold text-sm">Member {t}</p>
                  <p className="text-xs text-white/50">Veteran Advocate</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Shop Teaser */}
  <section id="shop" className="section-padding bg-[#FFF5EE]">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Gear Up & Give Back</h2>
            <p className="text-white/80 mb-6">Every purchase fuels programming and veteran community initiatives. Fresh drops and timeless essentials.</p>
            <Link href="/shop" className="btn-primary">Visit the Shop</Link>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-4">
            {[1,2,3,4].map(p => (
              <div key={p} className="relative group h-48 rounded-lg overflow-hidden bg-[url('https://picsum.photos/400/400?product=${p}')] bg-cover bg-center">
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <span className="text-sm font-semibold tracking-wide">View</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Newsletter */}
  <section id="newsletter" className="section-padding bg-[#F4F8FB]">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay in the Loop</h2>
          <p className="text-navy/70 mb-6">Get new episodes, events, and community opportunities delivered.</p>
          <form className="flex flex-col sm:flex-row gap-4 justify-center">
            <input type="email" required placeholder="Email address" className="flex-1 px-5 py-3 rounded-md bg-white border border-black/10 focus:outline-none focus:ring-2 focus:ring-brandBlue" />
            <button className="btn-primary" type="submit">Subscribe</button>
          </form>
        </div>
      </section>
    </Layout>
  );
}
