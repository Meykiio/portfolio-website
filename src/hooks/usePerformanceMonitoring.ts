import { useEffect, useCallback } from 'react';

interface PerformanceEntry {
  name: string;
  duration: number;
  startTime: number;
  entryType: string;
}

interface WebVitalsMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

export const usePerformanceMonitoring = () => {
  const reportMetric = useCallback((metric: WebVitalsMetric) => {
    // In production, send to analytics service
    if (import.meta.env.PROD) {
      // Example: Send to Google Analytics, DataDog, etc.
      console.log('Performance metric:', metric);
    } else {
      console.log('Performance metric:', metric);
    }
  }, []);

  const measureWebVitals = useCallback(() => {
    // Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      const rating = lastEntry.startTime <= 2500 ? 'good' : 
                    lastEntry.startTime <= 4000 ? 'needs-improvement' : 'poor';
      
      reportMetric({
        name: 'LCP',
        value: lastEntry.startTime,
        rating
      });
    });

    // First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        const fid = entry.processingStart - entry.startTime;
        const rating = fid <= 100 ? 'good' : 
                      fid <= 300 ? 'needs-improvement' : 'poor';
        
        reportMetric({
          name: 'FID',
          value: fid,
          rating
        });
      });
    });

    // Cumulative Layout Shift (CLS)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });

      const rating = clsValue <= 0.1 ? 'good' : 
                    clsValue <= 0.25 ? 'needs-improvement' : 'poor';
      
      reportMetric({
        name: 'CLS',
        value: clsValue,
        rating
      });
    });

    try {
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      fidObserver.observe({ entryTypes: ['first-input'] });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.warn('Performance Observer not supported');
    }

    return () => {
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
    };
  }, [reportMetric]);

  const measureResourceTiming = useCallback(() => {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      
      entries.forEach((entry: PerformanceEntry) => {
        // Report slow resources
        if (entry.duration > 1000) {
          console.warn(`Slow resource: ${entry.name} took ${entry.duration}ms`);
        }
      });
    });

    try {
      observer.observe({ entryTypes: ['resource'] });
    } catch (e) {
      console.warn('Resource timing not supported');
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const cleanupWebVitals = measureWebVitals();
    const cleanupResourceTiming = measureResourceTiming();

    return () => {
      cleanupWebVitals();
      cleanupResourceTiming();
    };
  }, [measureWebVitals, measureResourceTiming]);

  return {
    reportMetric
  };
};