import { useState } from 'react';
import { Check, ChevronDown, Clock, Mail, MapPin } from 'lucide-react';
import { FAQS } from '../data/content';
import { useStore } from '../context/StoreContext';
import { useSEO } from '../utils/seo';

export function ContactPage() {
  const { pushToast } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Routine Question');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  useSEO({
    title: 'Contact Us & Customer Care',
    description:
      'Reach the LUMÉRA SKIN support team with routine questions, ingredient inquiries, or demo storefront feedback. Browse our frequently asked questions.',
    canonicalPath: '/contact',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (name.trim().length < 2) nextErrors.name = 'Please enter your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (message.trim().length < 10) {
      nextErrors.message = 'Please share at least 10 characters so we can help.';
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitted(true);
    setName('');
    setEmail('');
    setMessage('');
    pushToast({
      title: 'Demo message received',
      description: 'In a live backend, this routes to our customer care inbox.',
      variant: 'success',
    });
  };

  return (
    <div className="bg-[#F8F5EF]">
      <section className="border-b border-[#E8DED2]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
          <p className="text-xs font-semibold tracking-[0.1em] text-[#294D3B] mb-2">
            Customer Care
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl text-[#252525]">
            Here to Help With Your Routine.
          </h1>
          <p className="mt-3 text-base text-[#57534E] max-w-2xl">
            Have a question about layering formulas, ingredient transparency, or demonstration
            orders? Send us a note below.
          </p>
        </div>
      </section>

      <section className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#E8DED2] p-6 sm:p-8">
            <h2 className="font-serif text-2xl text-[#252525]">Send a Message</h2>
            <p className="text-xs text-[#57534E] mt-1">
              Demonstration form — validates inputs client-side without external email dispatch.
            </p>

            {submitted ? (
              <div className="mt-6 p-6 rounded-xl bg-[#F8F5EF] border border-[#294D3B]/30 space-y-3">
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-[#294D3B]">
                  <Check className="w-4 h-4" /> Message recorded (Demo Mode)
                </p>
                <p className="text-sm text-[#57534E] leading-relaxed">
                  Thank you for reaching out to LUMÉRA SKIN. In a production deployment connected to
                  a helpdesk or Supabase Edge Function, our team replies within 1 business day.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="text-xs font-semibold text-[#294D3B] hover:underline"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-xs font-semibold text-[#252525] mb-1.5"
                    >
                      Full Name
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jordan Patel"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#F8F5EF] border border-[#E8DED2] rounded-md focus:outline-none focus:border-[#294D3B]"
                    />
                    {errors.name && <p className="mt-1 text-xs text-[#8B3A2B]">{errors.name}</p>}
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-xs font-semibold text-[#252525] mb-1.5"
                    >
                      Email Address
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-3.5 py-2.5 text-sm bg-[#F8F5EF] border border-[#E8DED2] rounded-md focus:outline-none focus:border-[#294D3B]"
                    />
                    {errors.email && <p className="mt-1 text-xs text-[#8B3A2B]">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-topic"
                    className="block text-xs font-semibold text-[#252525] mb-1.5"
                  >
                    Topic
                  </label>
                  <select
                    id="contact-topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F8F5EF] border border-[#E8DED2] rounded-md focus:outline-none focus:border-[#294D3B]"
                  >
                    <option value="Routine Question">Routine & Layering Question</option>
                    <option value="Ingredients">Ingredient Transparency Inquiry</option>
                    <option value="Demo Order">Demo Order & Shipping</option>
                    <option value="Partnerships">Wholesale & Brand Partnerships</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-semibold text-[#252525] mb-1.5"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your skin goals or question..."
                    className="w-full px-3.5 py-2.5 text-sm bg-[#F8F5EF] border border-[#E8DED2] rounded-md focus:outline-none focus:border-[#294D3B]"
                  />
                  {errors.message && (
                    <p className="mt-1 text-xs text-[#8B3A2B]">{errors.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-[#294D3B] hover:bg-[#1E3A2C] text-[#F8F5EF] text-sm font-semibold rounded-md transition-colors"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>

          {/* Support Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-[#E8DED2] p-6 sm:p-7 space-y-5">
              <h2 className="font-serif text-2xl text-[#252525]">Support Details</h2>
              <div className="space-y-4 text-sm text-[#57534E]">
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-[#294D3B] shrink-0 mt-1" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-[#252525]">Email (Placeholder)</p>
                    <p>care@lumeraskin.example</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#294D3B] shrink-0 mt-1" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-[#252525]">Support Hours</p>
                    <p>Monday – Friday, 9:00 AM – 6:00 PM EST</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#294D3B] shrink-0 mt-1" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-[#252525]">US Studio (Demo)</p>
                    <p>New York, NY · United States</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#F1ECE3]">
                <p className="text-xs font-semibold text-[#252525] mb-2">Community Channels</p>
                <p className="text-xs text-[#57534E]">
                  Instagram @lumeraskin · TikTok @lumeraskin · Pinterest @lumeraskin
                </p>
              </div>
            </div>

            {/* Compact FAQ Accordion */}
            <div className="bg-white rounded-2xl border border-[#E8DED2] p-6 sm:p-7">
              <h2 className="font-serif text-2xl text-[#252525] mb-4">Quick Answers</h2>
              <div className="divide-y divide-[#F1ECE3]">
                {FAQS.slice(0, 4).map((faq, idx) => {
                  const isOpen = openFaqIdx === idx;
                  return (
                    <div key={faq.question} className="py-3.5 first:pt-0 last:pb-0">
                      <button
                        type="button"
                        onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                        aria-expanded={isOpen}
                        className="w-full flex items-center justify-between gap-3 text-left text-sm font-semibold text-[#252525] hover:text-[#294D3B]"
                      >
                        <span>{faq.question}</span>
                        <ChevronDown
                          className={`w-4 h-4 shrink-0 transition-transform duration-150 ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      {isOpen && (
                        <p className="mt-2.5 text-xs text-[#57534E] leading-relaxed">
                          {faq.answer}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
