import { CTAButton } from './CTAButton';

export function Footer() {
  return (
    <footer className="w-full border-t border-neutral-200 bg-white py-6 mt-auto">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-4">
        <div className="text-neutral-500 text-sm font-medium">
          Built by MhStudio
        </div>
      </div>
    </footer>
  );
}
