import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, Check, Loader2 } from 'lucide-react';
import { motion, useMotionValue, useTransform } from 'motion/react';

interface SlideCommitProps {
  onCommit: () => void;
  label?: string;
  committedLabel?: string;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

/**
 * SlideCommit
 * Curated from: https://reactbits.dev/c/micro/slide-commit
 * Apple Slide-to-Confirm action button with spring physics and dark glassmorphic styling
 */
export const SlideCommit: React.FC<SlideCommitProps> = ({
  onCommit,
  label = 'Slide to Submit Application',
  committedLabel = 'Application Submitted',
  isLoading = false,
  disabled = false,
  className = '',
}) => {
  const [isCommitted, setIsCommitted] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [maxDrag, setMaxDrag] = useState(200);

  const x = useMotionValue(0);

  useEffect(() => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      // thumb is 48px, with 4px padding on each side
      setMaxDrag(Math.max(50, containerWidth - 56));
    }
  }, []);

  const progress = useTransform(x, [0, maxDrag], [0, 1]);
  const textOpacity = useTransform(x, [0, maxDrag * 0.6], [1, 0.2]);
  const thumbBg = useTransform(progress, [0, 1], ['#38BDF8', '#10B981']);

  const handleDragEnd = () => {
    if (disabled || isLoading || isCommitted) return;
    if (x.get() >= maxDrag * 0.85) {
      x.set(maxDrag);
      setIsCommitted(true);
      onCommit();
    } else {
      x.set(0);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative select-none overflow-hidden rounded-2xl p-1 bg-white/5 border border-white/10 backdrop-blur-2xl shadow-lg transition-opacity ${
        disabled ? 'opacity-50 pointer-events-none' : ''
      } ${className}`}
    >
      {/* Dynamic progress fill track */}
      <motion.div
        style={{
          width: useTransform(x, (val) => `${val + 48}px`),
        }}
        className="absolute top-1 bottom-1 left-1 rounded-xl bg-gradient-to-r from-sky-500/20 to-emerald-500/20 border-r border-sky-400/40 pointer-events-none"
      />

      {/* Background Label */}
      <div className="flex h-12 items-center justify-center pointer-events-none">
        <motion.span
          style={{ opacity: textOpacity }}
          className="text-xs sm:text-sm font-bold tracking-wide text-slate-300 flex items-center gap-1.5"
        >
          {isCommitted ? committedLabel : label}
        </motion.span>
      </div>

      {/* Draggable Thumb */}
      <motion.div
        drag={!isCommitted && !isLoading && !disabled ? 'x' : false}
        dragConstraints={{ left: 0, right: maxDrag }}
        dragElastic={0.1}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        style={{ x }}
        className="absolute top-1 left-1 bottom-1 w-12 rounded-xl flex items-center justify-center cursor-grab active:cursor-grabbing shadow-md border border-white/30 backdrop-blur-md z-10 transition-colors"
      >
        <motion.div
          style={{ backgroundColor: thumbBg }}
          className="w-full h-full rounded-xl flex items-center justify-center text-slate-950 font-bold"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
          ) : isCommitted ? (
            <Check className="w-5 h-5 text-slate-950" />
          ) : (
            <ChevronRight className="w-5 h-5 text-slate-950 animate-pulse" />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};
