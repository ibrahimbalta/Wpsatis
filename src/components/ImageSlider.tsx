'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface ImageSliderProps {
  images: string[];
}

export function ImageSlider({ images }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 1.1
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection;
      if (nextIndex < 0) nextIndex = images.length - 1;
      if (nextIndex >= images.length) nextIndex = 0;
      return nextIndex;
    });
  };

  if (images.length === 0) return null;

  return (
    <div className="absolute inset-0 w-full h-full bg-black group select-none overflow-hidden">
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.4 },
            scale: { duration: 0.6 }
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
      </AnimatePresence>

      {/* Navigasyon Okları */}
      {images.length > 1 && (
        <>
          <button
            className="absolute left-6 top-1/2 -translate-y-1/2 z-30 p-4 bg-black/20 backdrop-blur-3xl rounded-full border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-accent active:scale-90"
            onClick={() => paginate(-1)}
          >
            <ChevronLeft size={32} />
          </button>
          <button
            className="absolute right-6 top-1/2 -translate-y-1/2 z-30 p-4 bg-black/20 backdrop-blur-3xl rounded-full border border-white/10 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-accent active:scale-90"
            onClick={() => paginate(1)}
          >
            <ChevronRight size={32} />
          </button>
        </>
      )}

      {/* Şık İndikatörler */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex gap-2">
         {images.map((_, i) => (
           <div 
            key={i} 
            className={`h-1.5 transition-all duration-500 rounded-full ${i === currentIndex ? 'w-8 bg-accent shadow-[0_0_15px_rgba(255,59,48,0.5)]' : 'w-2 bg-white/20'}`}
           />
         ))}
      </div>

      {/* Sayın Sayaç */}
      <div className="absolute top-32 right-12 z-30 px-4 py-2 bg-black/40 backdrop-blur-3xl rounded-xl border border-white/10 text-[10px] font-black text-white uppercase tracking-widest hidden md:flex items-center gap-2">
         <Maximize2 size={14} className="text-accent" />
         {currentIndex + 1} / {images.length} FOTOĞRAF
      </div>
    </div>
  );
}
