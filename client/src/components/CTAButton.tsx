import { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';

export function CTAButton() {
  const [showForm, setShowForm] = useState(false);

  if (!showForm) {
    return (
      <button 
        onClick={() => setShowForm(true)}
        className="flex items-center gap-2 bg-neutral-900 text-white px-6 py-3 rounded-full font-medium hover:bg-neutral-800 transition-colors"
      >
        Want this AI receptionist for your business? <ArrowRight size={16} />
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <a 
        href="mailto:contact@example.com?subject=AI Receptionist Inquiry" 
        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors"
      >
        <Mail size={16} /> Email me
      </a>
      <button 
        onClick={() => setShowForm(false)}
        className="px-4 py-3 text-neutral-500 hover:text-neutral-900 font-medium"
      >
        Cancel
      </button>
    </div>
  );
}
