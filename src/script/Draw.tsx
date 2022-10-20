import React, { createRef, useState } from "react";
import type { CSSProperties } from "react";
import { Vector } from "./lib/Vector";

type Props = {
  dotSpacing?: number;
  style?: CSSProperties;
};

const fallbackDotSpacing = () =>
  Math.min(window.innerWidth, window.innerHeight) / 2000;

export const Draw = (props: Props) => {
  const [dots, setDots] = useState(new Array<Array<Vector>>());
  let [drawing, setDrawing] = useState(false);
  const svgEl = createRef<SVGSVGElement>();

  const onMove = (ev: { pageX: number; pageY: number }) => {
    if (svgEl.current) {
      const svgRect = svgEl.current.getBoundingClientRect();
      const x = ((ev.pageX - svgRect.left) / svgRect.width) * 100;
      const y = ((ev.pageY - svgRect.top) / svgRect.height) * 100;
      addDot(new Vector(x, y));
    }
  };

  const addDot = (vec: Vector) => {
    dots[dots.length - 1].push(vec);
    setDots([...dots]);
  };

  return (
    <svg
      ref={svgEl}
      height="100"
      width="100"
      viewBox="0 0 100 100"
      onMouseDown={() => {
        setDrawing(true);
        dots.push(new Array<Vector>());
      }}
      onTouchStart={() => {
        setDrawing(true);
        dots.push(new Array<Vector>());
      }}
      onMouseUp={() => {
        setDrawing(false);
      }}
      onTouchEnd={() => {
        setDrawing(false);
      }}
      onMouseMove={(ev) => {
        if (drawing && svgEl.current) {
          onMove(ev);
        }
      }}
      onTouchMove={(ev) => {
        if (drawing && svgEl.current) {
          for (let i = 0; i < ev.touches.length; i++) {
            onMove(ev.touches[i]);
          }
        }
      }}
      style={props.style}
    >
      {dots.flatMap((arr, i) => (
        <path
          key={i}
          d={pathDFromVectors(
            filterVectors(arr, props.dotSpacing || fallbackDotSpacing())
          )}
          id={`line-${i}`}
          stroke="black"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          style={{
            strokeWidth: `${props.dotSpacing ?? fallbackDotSpacing()}%`,
          }}
        />
      ))}
    </svg>
  );
};

const filterVectors = (
  arr: Array<Vector>,
  minDistance: number
): Array<Vector> => {
  let filtered = new Array<Vector>();
  let [closestPoint, distanceFromClosestPoint] = [-1, Number.MAX_VALUE];
  for (let i = 0; i < arr.length; i++) {
    const point = arr[i];
    if (closestPoint !== -1) {
      distanceFromClosestPoint = filtered[closestPoint].distanceTo(point);
    }
    if (distanceFromClosestPoint > minDistance) {
      filtered.push(point);
      closestPoint = filtered.length - 1;
      distanceFromClosestPoint = 0.0;
    }
  }
  return filtered;
};

/**
 * Generates a moveto path from an array of Vector values
 */
const pathDFromVectors = (arr: Vector[]): string => {
  // If the arr has < 2 or undefined, we can't make a path, so return nothing
  if (arr.length < 2 || arr[0] === undefined) {
    return "";
  }
  // 'M' starts the drawing in absolute coordinates
  let path = `M${arr[0].x},${arr[0].y} `;
  for (let i = 1; i < arr.length; i++) {
    let cur = arr[i];
    // Then, continue drawing the path with 'l'- relative
    // Draw a line from the last point to the current
    // position.
    path += `l${cur.x - arr[i - 1].x},${cur.y - arr[i - 1].y}`;
  }
  return path;
};
