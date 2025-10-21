
import React from 'react';
import Image from 'next/image';

export const AboutSection = () => {
  return (
    <section className="py-20 bg-[#FEF3E2]">
      <div className="container mx-auto text-center max-w-2xl">
        <Image src="/placeholder.svg" alt="Yumyum Logo" width={64} height={64} className="mx-auto mb-4" />
        <p className="text-lg italic text-[#0B0B0B]">“Yumyum was built to empower the hands that feed us — local food vendors. We believe in simple technology, honest growth, and sustainable digital change. Alhamdulillah, may this platform bring barakah to every plate.”</p>
        <p className="mt-8 text-[#0B0B0B]">Made with ❤️ for Street Food.</p>
        {/* Add contact links here */}
      </div>
    </section>
  );
};
