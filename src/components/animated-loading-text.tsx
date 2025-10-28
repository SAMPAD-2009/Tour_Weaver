'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

const loadingTexts = [
  "Tailoring your tour...",
  "Gathering destination secrets...",
  "Good things take time...",
  "Finding the best hotels...",
  "Weaving your perfect journey...",
  "Generating awesome activities...",
];

export default function AnimatedLoadingText() {
  const [index, setIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setIndex((prevIndex) => (prevIndex + 1) % loadingTexts.length);
        setIsFading(false);
      }, 500); // Corresponds to the fade-out duration
    }, 2500); // Total time each text is visible (2s) + fade duration (0.5s)

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center">
      <p
        className={cn(
          "text-lg text-muted-foreground transition-opacity duration-500 ease-in-out",
          isFading ? "opacity-0" : "opacity-100"
        )}
      >
        {loadingTexts[index]}
      </p>
    </div>
  );
}
