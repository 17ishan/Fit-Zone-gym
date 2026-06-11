import { Suspense, useEffect, useRef, useState } from 'react';

export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center w-full min-h-[300px] bg-black/5">
      <div className="flex flex-col items-center gap-2">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-red-600 font-medium">Loading...</p>
      </div>
    </div>
  );
};

export const LazyLoadingSection = ({ children }: { children: React.ReactNode }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); 
        }
      },
      {
        root: null, 
        rootMargin: '100px', 
        threshold: 0.1, 
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={sectionRef}>
      {isVisible ? (
        <Suspense fallback={<LoadingSpinner />}>
          {children}
        </Suspense>
      ) : (
        <LoadingSpinner />
      )}
    </div>
  );
};