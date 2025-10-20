
import React from 'react';
import { MessageSquare, Mail, Instagram } from 'lucide-react';

export const FooterSection = () => {
  return (
    <footer className="py-8 bg-gray-800 text-white">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <p>&copy; 2025 Yumyum. Made with ❤️ for Street Food Vendors.</p>
        </div>
        <div className="flex gap-4">
          <a href="#" aria-label="WhatsApp"><MessageSquare /></a>
          <a href="#" aria-label="Email"><Mail /></a>
          <a href="#" aria-label="Instagram"><Instagram /></a>
        </div>
      </div>
      <div className="container mx-auto text-center mt-4 text-sm text-gray-400">
        <a href="#" className="mr-4">Terms of Service</a>
        <a href="#">Privacy Policy</a>
      </div>
    </footer>
  );
};
