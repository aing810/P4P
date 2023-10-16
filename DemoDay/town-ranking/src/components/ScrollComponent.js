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
    <div className="relative w-full overflow-hidden">
      <div
        ref={scrollRef}
        className="flex w-full overflow-x-auto scroll-snap-x-mandatory" // Ensuring full width and correct overflow settings
        style={{ scrollBehavior: "smooth" }} // Optional: for smooth scrolling
      >
        {pages.map((page, index) => (
          <animated.div
            key={index}
            className="flex-shrink-0" // Prevent flex items from shrinking
            style={{
              scrollSnapAlign: "start",
              width: "100%", // Explicit width set
              flexShrink: 0, // Ensuring it doesn’t shrink
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
