import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, CheckCircle2 } from "lucide-react";
import { inquiryService } from "@/services/inquiryService";
import { Image } from "@/components/ui/image";
import PageHero from "@/components/layout/PageHero";

export default function Inquiry() {
  const [params] = useSearchParams();
  const [form, setForm] = useState({
    customer_name: "", email: "", phone: "", subject: "General Inquiry",
    message: "", interested_products: "", estimate_summary: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const summary = params.get("summary");
    if (summary) {
      setForm((f) => ({ ...f, estimate_summary: summary, subject: "Estimate Request" }));
    }
  }, [params]);

  function update(k, v) { setForm((f) => ({ ...f, [k]: v })); }

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (!form.customer_name || !form.email || !form.phone || !form.message) {
      setError("Please fill in name, email, phone and message.");
      return;
    }
    setSubmitting(true);
    try {
      await inquiryService.create({ ...form, status: "New", source: "Website" });
      setDone(true);
    } catch (err) {
      setError("Something went wrong sending your inquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="pt-32 pb-24">
        <div className="container-px max-w-2xl mx-auto text-center">
          <div className="h-16 w-16 mx-auto rounded-full bg-accent/15 grid place-items-center mb-6">
            <CheckCircle2 className="h-8 w-8 text-accent" />
          </div>
          <h1 className="font-display text-4xl text-primary font-bold">Inquiry received</h1>
          <p className="mt-3 text-muted-foreground">
            Thank you, {form.customer_name.split(" ")[0]}. Our team will reach out within one working day.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/catalog" className="inline-flex items-center justify-center bg-primary text-primary-foreground px-6 py-3 text-sm rounded-sm font-medium">Back to catalog</Link>
            <Link to="/" className="inline-flex items-center justify-center border border-border px-6 py-3 text-sm rounded-sm hover:border-accent font-medium">Return home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <PageHero
        eyebrow="Contact & Inquiries"
        title="Let's talk interiors."
        description="Send us a message and we'll get back with pricing, availability or a site visit."
        image="https://loremflickr.com/1200/800/interior,design?lock=24"
      />
      <div className="container-px max-w-7xl mx-auto pt-10">
        <div className="grid lg:grid-cols-[1fr_360px] gap-8">
          <form onSubmit={submit} className="bg-card border border-border rounded-sm p-6 sm:p-8 shadow-sm">
            {form.estimate_summary && (
              <div className="mb-6 p-4 bg-accent/10 border border-accent/30 rounded-sm">
                <p className="eyebrow text-accent mb-1">Attached estimate</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{form.estimate_summary}</p>
              </div>
            )}
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Full name *"><input value={form.customer_name} onChange={(e) => update("customer_name", e.target.value)} className="input" placeholder="Your name" /></Field>
              <Field label="Phone *"><input value={form.phone} onChange={(e) => update("phone", e.target.value)} className="input" placeholder="+91 …" /></Field>
              <Field label="Email *"><input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} className="input" placeholder="you@email.com" /></Field>
              <Field label="Subject">
                <select value={form.subject} onChange={(e) => update("subject", e.target.value)} className="input">
                  {["General Inquiry", "Estimate Request", "Stock Availability", "Custom Piece", "Site Visit"].map((s) => <option key={s}>{s}</option>)}
                </select>
              </Field>
            </div>
            <div className="mt-5">
              <Field label="Interested products (optional)"><input value={form.interested_products} onChange={(e) => update("interested_products", e.target.value)} className="input" placeholder="e.g. Royal Walnut Laminate, Brushed Brass Handles" /></Field>
            </div>
            <div className="mt-5">
              <Field label="Message *"><textarea rows={5} value={form.message} onChange={(e) => update("message", e.target.value)} className="input resize-none" placeholder="Tell us about your project…" /></Field>
            </div>
            {error && <p className="text-sm text-destructive mt-4">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="mt-6 w-full bg-primary text-primary-foreground py-3.5 text-sm font-medium rounded-sm hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50 shadow-sm"
            >
              {submitting ? "Sending…" : "Send inquiry"}
            </button>
          </form>

          <div className="space-y-4">
            <div className="bg-primary text-primary-foreground rounded-sm overflow-hidden shadow-md">
              <div className="relative h-32">
                <Image src="https://loremflickr.com/1200/800/interior,design?lock=25" alt="Showroom" className="h-full w-full object-cover" fittingType="fill" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary to-primary/40" />
              </div>
              <div className="p-6">
                <p className="eyebrow text-accent mb-4">Visit the showroom</p>
                <ul className="space-y-4 text-sm">
                  <li className="flex items-start gap-3"><MapPin className="h-4 w-4 mt-0.5 text-accent shrink-0" /><span>Station Road, Surat — Gujarat 395003</span></li>
                  <li className="flex items-center gap-3"><Phone className="h-4 w-4 text-accent shrink-0" /><span>+91 98250 12345</span></li>
                  <li className="flex items-center gap-3"><Mail className="h-4 w-4 text-accent shrink-0" /><span>contact@mangalaminterior.in</span></li>
                  <li className="flex items-start gap-3"><Clock className="h-4 w-4 mt-0.5 text-accent shrink-0" /><span>Mon–Sat · 10:00am – 8:00pm<br />Sunday by appointment</span></li>
                </ul>
              </div>
            </div>
            <div className="bg-card border border-border rounded-sm p-6 shadow-sm">
              <p className="eyebrow mb-2">Prefer to plan first?</p>
              <p className="text-sm text-muted-foreground mb-4">Get a rough estimate before you visit.</p>
              <Link to="/estimate" className="inline-flex items-center gap-2 text-sm text-accent font-medium hover:underline">Open estimate tool →</Link>
            </div>
          </div>
        </div>
      </div>

      <style>{`.input{width:100%;padding:0.65rem 0.85rem;font-size:0.875rem;background:#fff;border:1px solid hsl(var(--border));border-radius:0.125rem;}.input:focus{outline:none;border-color:hsl(var(--accent));}`}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-wide text-muted-foreground mb-2 font-medium">{label}</span>
      {children}
    </label>
  );
}
