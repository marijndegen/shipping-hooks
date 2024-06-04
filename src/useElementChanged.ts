import { useLayoutEffect, useMemo, useState } from "react";

export type UseElementChangedRect = Pick<
  DOMRectReadOnly,
  "x" | "y" | "top" | "left" | "right" | "bottom" | "height" | "width"
>;
export type UseElementChangedRef<E extends Element = Element> = (
  element: E
) => void;
export type UseElementChangedResult<E extends Element = Element> = [
  UseElementChangedRef<E>,
  UseElementChangedRect
];

const defaultState: UseElementChangedRect = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
};

export const useElementChanged = <
  E extends Element = Element
>(): UseElementChangedResult<E> => {
  const [element, ref] = useState<E | null>(null);
  const [rect, setRect] = useState<UseElementChangedRect>(defaultState);

  const observer = useMemo(
    () =>
      new ResizeObserver((entries) => {
        if (entries[0]) {
          const { x, y, width, height, top, left, bottom, right } =
            entries[0].contentRect;
          setRect({ x, y, width, height, top, left, bottom, right });
        }
      }),
    []
  );

  useLayoutEffect(() => {
    if (!element) return;
    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [element]);

  return [ref, rect];
};
