import React from 'react';

export default function ContactForm({ onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(new FormData(e.currentTarget));
  };
  return (
    <section className="py-16 bg-gray-50">
      <div className="mx-auto w-full max-w-[800px] px-4 md:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-8 text-center">Send us a message</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <input name="name" placeholder="Your name" className="px-4 py-3 border rounded-lg" />
          <input name="email" placeholder="Your email" type="email" className="px-4 py-3 border rounded-lg" />
          <textarea name="message" placeholder="Your message" rows={5} className="px-4 py-3 border rounded-lg" />
          <button type="submit" className="button-l self-center">Submit</button>
        </form>
      </div>
    </section>
  );
}

