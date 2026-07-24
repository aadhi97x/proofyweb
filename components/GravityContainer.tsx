
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface GravityContainerProps {
  isActive: boolean;
  children: React.ReactNode;
}

interface PhysicalObject {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  vr: number;
  width: number;
  height: number;
  ref: React.RefObject<HTMLDivElement>;
}

const GravityContainer: React.FC<GravityContainerProps> = ({ isActive, children }) => {
  const [objects, setObjects] = useState<PhysicalObject[]>([]);
  const requestRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize physical objects when active
  useEffect(() => {
    if (isActive && containerRef.current) {
      // We find all direct children and some sub-elements that we want to "fall"
      // specifically targeting the main components
      const targetSelectors = [
        '#hero-flow > div', 
        '#upload-zone', 
        '.bento-card', 
        'section > div:not(.absolute)', 
        'h2', 
        'h1'
      ];
      
      const elements = Array.from(containerRef.current.querySelectorAll(targetSelectors.join(', ')));
      
      const newObjects: PhysicalObject[] = elements.map((item, i) => {
        // Fix: cast el to HTMLElement to access getBoundingClientRect and resolve unknown type error
        const el = item as HTMLElement;
        const rect = el.getBoundingClientRect();
        return {
          id: i,
          x: rect.left,
          y: rect.top + window.scrollY,
          vx: (Math.random() - 0.5) * 10,
          vy: (Math.random() - 0.5) * 5,
          rotation: 0,
          vr: (Math.random() - 0.5) * 4,
          width: rect.width,
          height: rect.height,
          ref: { current: el as HTMLDivElement }
        };
      });
      
      setObjects(newObjects);
    } else {
      setObjects([]);
    }
  }, [isActive]);

  // Physics loop
  const updatePhysics = () => {
    if (!isActive) return;

    setObjects((prev) => prev.map((obj) => {
      let { x, y, vx, vy, rotation, vr, width, height } = obj;

      const gravity = 0.6;
      const friction = 0.98;
      const bounce = 0.7;
      
      // Update velocities
      vy += gravity;
      vx *= friction;
      vy *= friction;
      vr *= friction;

      // Update positions
      x += vx;
      y += vy;
      rotation += vr;

      // Bound checks
      const winW = window.innerWidth;
      const winH = window.innerHeight;

      if (y + height > winH) {
        y = winH - height;
        vy *= -bounce;
        vx *= bounce;
        vr *= bounce;
      }
      if (x + width > winW) {
        x = winW - width;
        vx *= -bounce;
      }
      if (x < 0) {
        x = 0;
        vx *= -bounce;
      }

      return { ...obj, x, y, vx, vy, rotation, vr };
    }));

    requestRef.current = requestAnimationFrame(updatePhysics);
  };

  useEffect(() => {
    if (isActive) {
      requestRef.current = requestAnimationFrame(updatePhysics);
    } else {
      cancelAnimationFrame(requestRef.current);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [isActive]);

  if (!isActive) {
    return <div ref={containerRef} className="contents">{children}</div>;
  }

  return (
    <div ref={containerRef} className="fixed inset-0 z-50 pointer-events-none select-none overflow-hidden">
      {objects.map((obj) => (
        <motion.div
          key={obj.id}
          drag
          dragMomentum={true}
          onDragStart={() => {
            // Pause individual physics for dragged object? 
            // For now, let's keep it simple
          }}
          onDragEnd={(_, info) => {
             // Inject velocity from drag
             setObjects(prev => prev.map(o => o.id === obj.id ? {
               ...o,
               vx: info.velocity.x / 40,
               vy: info.velocity.y / 40
             } : o));
          }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: obj.width,
            height: obj.height,
            x: obj.x,
            y: obj.y,
            rotate: obj.rotation,
            pointerEvents: 'auto',
          }}
          className="cursor-grab active:cursor-grabbing"
        >
          {/* We clone the original HTML to preserve styles without the original layout constraints */}
          <div 
            dangerouslySetInnerHTML={{ __html: obj.ref.current?.innerHTML || '' }}
            className={obj.ref.current?.className}
            style={{ margin: 0, width: '100%', height: '100%' }}
          />
        </motion.div>
      ))}
      
      {/* Hidden container to keep the original content logic alive if needed, 
          though the clones do the visual work here */}
      <div className="opacity-0 pointer-events-none absolute invisible">
        {children}
      </div>
    </div>
  );
};

export default GravityContainer;
