'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { CommandPalette } from '@/components/CommandPalette';
import { Footer } from './Footer';

const KONAMI = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith('/admin/blog') ?? false;
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [easterEgg, setEasterEgg] = useState(false);

  useEffect(() => {
    let buffer: string[] = [];

    function handleKey(e: KeyboardEvent) {
      const isMeta = e.metaKey || e.ctrlKey;
      if (isMeta && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPaletteOpen((v) => !v);
        return;
      }

      buffer = [...buffer, e.key].slice(-KONAMI.length);
      if (buffer.join(',') === KONAMI.join(',')) {
        setEasterEgg(true);
        buffer = [];
        window.setTimeout(() => setEasterEgg(false), 3200);
      }
    }

    if (!isStudio) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isStudio]);

  return (
    <>
      {!isStudio && <Navbar onOpenPalette={() => setPaletteOpen(true)} />}
      {!isStudio && (
        <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      )}
      {!isStudio && easterEgg && (
        <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
          <div className="rounded-lg border border-accent/40 bg-surface px-4 py-2.5 font-mono text-sm text-accent shadow-xl">
            konami accepted — you found it 🎮
          </div>
        </div>
      )}
      {children}
      {!isStudio && <Footer />}
    </>
  );
}
