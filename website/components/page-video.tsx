"use client";

import type { Element } from "hast";
import type { ComponentProps } from "react";
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { twJoin } from "tailwind-merge";

export interface PageVideoProps extends ComponentProps<"video"> {
  node?: Element;
  gif?: boolean | "true" | "false";
  lazy?: boolean;
  playbackrate?: string | number;
}

export function PageVideo({
  node,
  gif,
  lazy,
  src,
  playbackrate = 1,
  ...props
}: PageVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [source, setSource] = useState(lazy ? undefined : src);
  gif = gif === "true" || gif === true;
  lazy = lazy ?? gif;
  const playbackRate = Number.parseFloat(playbackrate.toString());

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    element.playbackRate = playbackRate;
  }, [playbackRate]);

  useEffect(() => {
    if (!lazy) return;
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          flushSync(() => {
            setSource(src);
          });
          if (entry.intersectionRatio === 1) {
            element.play();
          }
        } else {
          element.pause();
          element.currentTime = 0;
        }
      },
      { threshold: [0, 1] },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [src, lazy]);

  return (
    <video
      ref={ref}
      playsInline={gif}
      loop={gif}
      muted={gif}
      src={source}
      {...props}
      className={twJoin(
        "overflow-hidden rounded-lg data-[large]:max-w-[--size-lg] data-[wide]:max-w-[--size-xl] md:rounded-xl data-[wide]:md:rounded-2xl",
        props.className,
      )}
    />
  );
}
