import Layout from '@/components/Layout';

export default function AboutPage() {
  return (
    <Layout>
  <section className="section-padding bg-white">
        <h1 className="text-4xl font-bold mb-6">Our Mission</h1>
        <p className="max-w-3xl text-white/80 mb-10">B3U exists to amplify authentic stories of resilience, service, and personal reinvention. We believe every voice is a catalyst for change and that community is forged in shared struggle and purpose.</p>
        <div className="grid md:grid-cols-3 gap-10">
          {[1,2,3].map(n => (
            <div key={n} className="card">
              <h3 className="font-semibold mb-2">Core Pillar {n}</h3>
              <p className="text-sm text-white/70">Placeholder description explaining a guiding principle and how it shapes our work.</p>
            </div>
          ))}
        </div>
      </section>
  <section className="section-padding bg-[#F4F8FB]">
        <h2 className="text-3xl font-bold mb-6">Meet the Team</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[1,2,3,4].map(m => (
            <div key={m} className="card text-center">
              <div className="h-32 w-32 mx-auto rounded-full bg-[url('https://picsum.photos/200/200?u=${m}')] bg-cover bg-center mb-4" />
              <h4 className="font-semibold">Team Member {m}</h4>
              <p className="text-xs text-white/60">Role / Title</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
