import React from "react";
import PageHero from "@/components/layout/PageHero";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Shield, Users, Clock, Zap } from "lucide-react";

export default function About() {
  const VALUES = [
    { icon: <Shield className="h-6 w-6 text-accent" />, title: "Quality First", desc: "We use only premium materials backed by industry-leading warranties." },
    { icon: <Users className="h-6 w-6 text-accent" />, title: "Client Centric", desc: "Your vision is our priority. We collaborate closely at every step." },
    { icon: <Clock className="h-6 w-6 text-accent" />, title: "On-Time Delivery", desc: "We respect your time and strictly adhere to project schedules." },
    { icon: <Zap className="h-6 w-6 text-accent" />, title: "Innovation", desc: "Embracing modern designs and smart home technologies." }
  ];

  return (
    <div className="pb-24">
      <PageHero
        title="About Shree Mangalam"
        subtitle="Crafting beautiful, functional spaces since 2010"
        image="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop"
      />

      <div className="container mx-auto px-4 md:px-8 mt-16 max-w-5xl">
        {/* Story Section */}
        <section className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="space-y-6">
            <h2 className="font-display text-3xl md:text-4xl text-primary font-bold">Our Story</h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-sm md:text-base">
              <p>
                Founded in 2010, Shree Mangalam began with a simple mission: to make premium interior design accessible, transparent, and hassle-free. What started as a small local workshop has grown into a full-service interior design and execution studio.
              </p>
              <p>
                We believe that a well-designed space has the power to transform lives. Whether it's a cozy apartment, a sprawling villa, or a modern corporate office, our team approaches every project with the same level of passion and attention to detail.
              </p>
              <p>
                Our end-to-end approach means you don't have to juggle multiple contractors. From the initial 3D visualization to the final coat of paint, we handle it all.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-sm overflow-hidden">
              <img src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1000&auto=format&fit=crop" alt="Interior designer at work" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-card border border-border p-6 rounded-sm shadow-xl max-w-[240px]">
              <p className="font-display text-4xl font-bold text-accent mb-1">10+</p>
              <p className="text-sm font-medium text-primary">Years of Excellence</p>
              <p className="text-xs text-muted-foreground mt-2">Delivering dream spaces across the city.</p>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="mb-24">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-primary mb-4">Why Choose Us</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">We don't just build interiors; we build trust. Here is what sets us apart from the rest.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <div key={i} className="bg-card border border-border rounded-sm p-6 space-y-4 hover:border-accent/50 transition-colors">
                <div className="h-12 w-12 bg-accent/10 rounded-full flex items-center justify-center">
                  {v.icon}
                </div>
                <h3 className="font-display text-lg font-bold text-primary">{v.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team Section (Optional) */}
        <section className="mb-24 text-center">
          <h2 className="font-display text-3xl font-bold text-primary mb-4">Our Expertise</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-12">A dedicated team of architects, interior designers, and master craftsmen working in harmony.</p>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            {[
              { role: "Design Consultation", items: ["Space Planning", "Material Selection", "3D Visualization", "Color Consultation"] },
              { role: "Execution", items: ["Civil Work", "Custom Furniture", "False Ceiling", "Painting & Polish"] },
              { role: "Services", items: ["Electrical", "Plumbing", "Smart Home Automation", "Deep Cleaning"] }
            ].map((expertise, i) => (
              <div key={i} className="bg-secondary/30 p-6 rounded-sm border border-border">
                <h3 className="font-display text-xl font-bold text-primary mb-4">{expertise.role}</h3>
                <ul className="space-y-3">
                  {expertise.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-accent" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary text-primary-foreground rounded-sm p-8 md:p-12 text-center">
          <h2 className="font-display text-3xl font-bold mb-4">Ready to transform your space?</h2>
          <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Book a free consultation today and let's start planning your dream interior.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/inquiry" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-8 py-3 rounded-sm font-medium hover:bg-accent/90 transition-colors shadow-sm">
              Contact Us <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/gallery" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-transparent text-primary-foreground border border-primary-foreground/30 px-8 py-3 rounded-sm font-medium hover:bg-primary-foreground/10 transition-colors">
              View Gallery
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
