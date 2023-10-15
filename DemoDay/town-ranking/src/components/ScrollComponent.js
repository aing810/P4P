// ScrollComponent.js
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { animated, useSpring } from "react-spring";

const ScrollComponent = forwardRef(({ pages }, ref) => {
  const scrollRef = useRef(null);

  // Spring animation setup
  const [{ offset }, setOffset] = useSpring(() => ({ offset: 0 }));

  const scrollLeft = () => {
    // Logic for scrolling left
    if (scrollRef.current) {
      setOffset({ offset: offset.value + window.innerWidth });
      scrollRef.current.scrollBy({
        left: -window.innerWidth,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    // Logic for scrolling right
    if (scrollRef.current) {
      setOffset({ offset: offset.value - window.innerWidth });
      scrollRef.current.scrollBy({
        left: window.innerWidth,
        behavior: "smooth",
      });
    }
  };

  useImperativeHandle(ref, () => ({
    scrollLeft,
    scrollRight,
  }));
  return (
    <div className="relative overflow-hidden">
      <div
        ref={scrollRef}
        className="flex overflow-x-hidden scroll-snap-x-mandatory w-full" // Tailwind classes and some existing styles
      >
        {pages.map((page, index) => (
          <animated.div
            key={index}
            style={{
              scrollSnapAlign: "start",
              width: "100vw",
              flexShrink: 0,
              transform: offset.to((o) => `translateX(${o}px)`),
            }}
          >
            {page}
          </animated.div>
        ))}
      </div>
    </div>
  );
});

export default ScrollComponent;
