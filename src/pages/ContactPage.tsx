import React, { useState } from 'react';
import { CheckCircle2, Mail, MapPin, Phone } from 'lucide-react';
import { ContactSubmissionResponse } from '../types';
import { MagneticButton } from '../components/MagneticButton';

const TOPICS = [
  'Private Listening Session',
  'Sovereign Series Concierge',
  'Chronos Watch Allocation',
  'Warranty & Acoustic Calibration',
  'Press & Media Relations',
];

export function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState(TOPICS[0]);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<ContactSubmissionResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, topic, message }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Unable to submit inquiry. Please verify your details.');
        return;
      }
      setConfirmation(data as ContactSubmissionResponse);
      setName('');
      setEmail('');
      setMessage('');
    } catch {
      setError('Connection error while contacting AUREON Concierge. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F0] pt-28 pb-24 text-[#11291F] atelier-grid-bg">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10">
        <div className="max-w-2xl space-y-4 border-b border-[#11291F]/10 pb-8">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#A8833B] uppercase">
            Concierge & Support
          </p>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-[#11291F] sm:text-5xl">
            Speak With Our Acoustic Engineers
          </h1>
          <p className="text-sm leading-relaxed text-[#11291F]/75 sm:text-base">
            Arrange a private listening appointment in Geneva or Zurich, reserve a Sovereign Series
            allocation, or request studio calibration assistance.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Functional Contact Form */}
          <div className="rounded-2xl border border-[#11291F]/10 bg-white p-6 sm:p-8 shadow-sm lg:col-span-7">
            {confirmation ? (
              <div className="space-y-6 py-8">
                <div className="inline-flex items-center gap-2 text-[#1B4332]">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider">
                    Reference {confirmation.referenceId}
                  </span>
                </div>
                <h2 className="font-display text-3xl font-semibold text-[#11291F]">
                  Inquiry Received by AUREON Atelier
                </h2>
                <p className="text-sm leading-relaxed text-[#11291F]/75">
                  {confirmation.message} A specialist acoustic advisor will respond within one
                  business day.
                </p>
                <button
                  type="button"
                  onClick={() => setConfirmation(null)}
                  className="rounded-lg border border-[#11291F]/20 px-5 py-2.5 text-xs font-semibold text-[#11291F] hover:border-[#C49B4B] transition-colors"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="font-display text-2xl font-semibold text-[#11291F]">
                  Direct Concierge Message
                </h2>

                {error && (
                  <div
                    role="alert"
                    className="rounded-lg border border-rose-500/40 bg-rose-50 px-4 py-3 text-xs text-rose-800"
                  >
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-xs font-medium text-[#11291F]/80 mb-2"
                    >
                      Full Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Julian Mercer"
                      className="w-full rounded-lg border border-[#11291F]/15 bg-[#F7F6F0] px-4 py-3 text-sm text-[#11291F] placeholder:text-[#11291F]/35 focus:border-[#1B4332] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-xs font-medium text-[#11291F]/80 mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="julian@studio-mercer.ch"
                      className="w-full rounded-lg border border-[#11291F]/15 bg-[#F7F6F0] px-4 py-3 text-sm text-[#11291F] placeholder:text-[#11291F]/35 focus:border-[#1B4332] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-topic"
                    className="block text-xs font-medium text-[#11291F]/80 mb-2"
                  >
                    Inquiry Topic
                  </label>
                  <select
                    id="contact-topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full rounded-lg border border-[#11291F]/15 bg-[#F7F6F0] px-4 py-3 text-sm text-[#11291F] focus:border-[#1B4332] focus:outline-none"
                  >
                    {TOPICS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-medium text-[#11291F]/80 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share your preferred listening dates, studio equipment, or technical questions..."
                    className="w-full rounded-lg border border-[#11291F]/15 bg-[#F7F6F0] px-4 py-3 text-sm text-[#11291F] placeholder:text-[#11291F]/35 focus:border-[#1B4332] focus:outline-none"
                  />
                </div>

                <MagneticButton
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-[#122B21] px-6 py-3.5 text-sm font-semibold text-[#DFBE74] hover:bg-[#1B4332] disabled:opacity-50 transition-colors"
                >
                  {submitting ? 'Routing Inquiry...' : 'Submit Inquiry'}
                </MagneticButton>
              </form>
            )}
          </div>

          {/* Support & Flagship Locations */}
          <div className="space-y-6 lg:col-span-5">
            <div className="rounded-2xl border border-[#11291F]/15 bg-[#0B2017] p-7 text-[#F7F6F0] space-y-5">
              <h2 className="font-display text-2xl font-semibold text-white">
                Global Listening Salons
              </h2>

              <div className="space-y-4 text-sm text-[#F7F6F0]/80">
                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-[#DFBE74] mt-1 shrink-0" />
                  <div>
                    <div className="font-semibold text-white">Geneva Flagship Atelier</div>
                    <div className="text-xs text-[#F7F6F0]/65 mt-0.5">
                      Rue du Rhône 42, 1204 Genève · Tue–Sat 10:00–19:00 CET
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 text-[#DFBE74] mt-1 shrink-0" />
                  <div>
                    <div className="font-semibold text-white">Zurich Acoustic Laboratory</div>
                    <div className="text-xs text-[#F7F6F0]/65 mt-0.5">
                      Bahnhofstrasse 42, 8001 Zürich · By Appointment
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-4 w-4 text-[#DFBE74] mt-1 shrink-0" />
                  <div>
                    <div className="font-semibold text-white">Direct Concierge Desk</div>
                    <div className="text-xs text-[#F7F6F0]/65 mt-0.5">
                      concierge@aureon-audio.example
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-4 w-4 text-[#DFBE74] mt-1 shrink-0" />
                  <div>
                    <div className="font-semibold text-white">Client Support Line</div>
                    <div className="font-mono text-xs tabular-nums text-[#F7F6F0]/65 mt-0.5">
                      +41 22 580 29 10 · Mon–Fri 08:30–18:00 CET
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#11291F]/10 bg-white p-7 shadow-sm space-y-3">
              <h3 className="font-display text-xl font-semibold text-[#11291F]">
                Five-Year Acoustic Warranty
              </h3>
              <p className="text-sm leading-relaxed text-[#11291F]/70">
                Every AUREON instrument carries serialized driver-matching documentation, five-year
                transducer coverage, and complimentary annual lambskin cushion conditioning.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
