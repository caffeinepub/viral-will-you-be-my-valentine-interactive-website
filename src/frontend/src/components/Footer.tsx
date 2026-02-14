import { Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = typeof window !== 'undefined' 
    ? encodeURIComponent(window.location.hostname)
    : 'valentine-app';

  return (
    <footer className="w-full py-8 px-4 relative z-20 border-t border-rose-200 dark:border-rose-900/30">
      <div className="container mx-auto text-center space-y-2">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          © {currentYear} Valentine's Day Experience
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 flex items-center justify-center gap-1">
          Built with{' '}
          <Heart className="h-3 w-3 text-rose-500 fill-rose-500 inline" />{' '}
          using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-rose-500 hover:text-rose-600 dark:text-rose-400 dark:hover:text-rose-300 font-medium transition-colors"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}
