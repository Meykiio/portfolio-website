import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity, Zap, Clock, Eye } from 'lucide-react';

interface PerformanceMetrics {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint
  ttfb: number; // Time to First Byte
}

interface PerformanceMonitorProps {
  className?: string;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ className }) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development or for admin users
    const isDev = import.meta.env.DEV;
    const isAdmin = localStorage.getItem('user_role') === 'admin';
    setIsVisible(isDev || isAdmin);

    if (!isVisible) return;

    const measurePerformance = () => {
      // Web Vitals measurement
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const newMetrics: Partial<PerformanceMetrics> = {};

        entries.forEach((entry) => {
          switch (entry.entryType) {
            case 'largest-contentful-paint':
              newMetrics.lcp = entry.startTime;
              break;
            case 'first-input':
              newMetrics.fid = (entry as any).processingStart - entry.startTime;
              break;
            case 'layout-shift':
              if (!(entry as any).hadRecentInput) {
                newMetrics.cls = (newMetrics.cls || 0) + (entry as any).value;
              }
              break;
          }
        });

        // Navigation timing metrics
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          newMetrics.fcp = navigation.responseStart - navigation.fetchStart;
          newMetrics.ttfb = navigation.responseStart - navigation.requestStart;
        }

        setMetrics(prev => ({ ...prev, ...newMetrics } as PerformanceMetrics));
      });

      // Observe Web Vitals
      try {
        observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
      } catch (e) {
        console.warn('Performance Observer not supported');
      }

      return () => observer.disconnect();
    };

    const cleanup = measurePerformance();
    return cleanup;
  }, [isVisible]);

  const getScoreColor = (value: number, thresholds: [number, number]) => {
    if (value <= thresholds[0]) return 'text-green-400';
    if (value <= thresholds[1]) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreLabel = (value: number, thresholds: [number, number]) => {
    if (value <= thresholds[0]) return 'Good';
    if (value <= thresholds[1]) return 'Needs Improvement';
    return 'Poor';
  };

  if (!isVisible || !metrics) return null;

  return (
    <Card className={`bg-gray-900 border-gray-800 ${className}`}>
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Performance Metrics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Core Web Vitals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">LCP</span>
              <Badge className={getScoreColor(metrics.lcp, [2500, 4000])}>
                {getScoreLabel(metrics.lcp, [2500, 4000])}
              </Badge>
            </div>
            <div className="text-lg font-mono text-white">
              {(metrics.lcp / 1000).toFixed(2)}s
            </div>
            <Progress 
              value={Math.min((metrics.lcp / 4000) * 100, 100)} 
              className="h-2"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">FID</span>
              <Badge className={getScoreColor(metrics.fid, [100, 300])}>
                {getScoreLabel(metrics.fid, [100, 300])}
              </Badge>
            </div>
            <div className="text-lg font-mono text-white">
              {metrics.fid.toFixed(0)}ms
            </div>
            <Progress 
              value={Math.min((metrics.fid / 300) * 100, 100)} 
              className="h-2"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">CLS</span>
              <Badge className={getScoreColor(metrics.cls, [0.1, 0.25])}>
                {getScoreLabel(metrics.cls, [0.1, 0.25])}
              </Badge>
            </div>
            <div className="text-lg font-mono text-white">
              {metrics.cls.toFixed(3)}
            </div>
            <Progress 
              value={Math.min((metrics.cls / 0.25) * 100, 100)} 
              className="h-2"
            />
          </div>
        </div>

        {/* Additional Metrics */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-700">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-electric-cyan" />
            <span className="text-sm text-gray-300">FCP:</span>
            <span className="text-sm font-mono text-white">
              {(metrics.fcp / 1000).toFixed(2)}s
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-electric-cyan" />
            <span className="text-sm text-gray-300">TTFB:</span>
            <span className="text-sm font-mono text-white">
              {(metrics.ttfb / 1000).toFixed(2)}s
            </span>
          </div>
        </div>

        <div className="text-xs text-gray-500 pt-2">
          <p>LCP: Largest Contentful Paint | FID: First Input Delay | CLS: Cumulative Layout Shift</p>
          <p>Green: Good | Yellow: Needs Improvement | Red: Poor</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMonitor;