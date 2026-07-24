/*
  Single-file Wave component using @react-three/fiber and @react-three/drei.
  - Full screen coverage
  - Follows cursor smoothly
*/

"use client"

import type React from "react"
import { useRef, useState, Suspense, useEffect } from "react"
import * as THREE from "three"
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber"
import { shaderMaterial } from "@react-three/drei"

// Wave shader material
const WaveMaterial = shaderMaterial(
    {
        time: 0,
        resolution: new THREE.Vector2(1, 1),
        pointer: new THREE.Vector2(0.0, 0.0),
        tiles: 1.5,
    },
  /* glsl */ `
    varying vec2 vUv;
    void main() {
      gl_Position = vec4(position.xy, 0.0, 1.0);
      vUv = uv;
    }
  `,
  /* glsl */ `
    uniform float time;
    uniform vec2 resolution;
    uniform vec2 pointer;
    uniform float tiles;
    varying vec2 vUv;

    vec3 palette(float t) {
      vec3 a = vec3(0.0, 0.7, 0.4);
      vec3 b = vec3(0.2, 0.5, 0.3);
      vec3 c = vec3(1.0, 1.0, 1.0);
      vec3 d = vec3(0.0, 0.25, 0.1);
      return a + b * cos(6.28318 * (c * t + d));
    }

    void main() {
      vec2 uv = vUv * 2.0 - 1.0;
      vec2 uv0 = uv;
      vec3 finalColor = vec3(0.0);

      uv = uv * tiles - pointer;

      float d = length(uv) * exp(-length(uv0));
      vec3 col = palette(length(uv0) + time * 0.4);
      d = sin(d * 8.0 + time) / 8.0;
      d = abs(d);
      d = pow(0.02 / d, 2.0);
      finalColor += col * d;

      float alpha = clamp(length(finalColor), 0.0, 1.0);
      gl_FragColor = vec4(finalColor, alpha);
    }
  `,
)

extend({ WaveMaterial })

export type WaveProps = {
    speed?: number
    tiles?: number
    className?: string
    style?: React.CSSProperties
}

function FullScreenQuad({
    speed = 1,
    tiles = 1.5,
    mousePos,
}: {
    speed?: number
    tiles?: number
    mousePos: React.MutableRefObject<{ x: number; y: number }>
}) {
    const matRef = useRef<THREE.ShaderMaterial>(null)
    const smoothPointer = useRef({ x: 0, y: 0 })

    useFrame((state, delta) => {
        if (!matRef.current) return
        matRef.current.uniforms.time.value += delta * speed
        matRef.current.uniforms.resolution.value.set(state.size.width, state.size.height)

        // Smooth follow cursor (slower = more elegant)
        const lerpSpeed = 1.5
        smoothPointer.current.x += (mousePos.current.x - smoothPointer.current.x) * delta * lerpSpeed
        smoothPointer.current.y += (mousePos.current.y - smoothPointer.current.y) * delta * lerpSpeed

        matRef.current.uniforms.pointer.value.set(smoothPointer.current.x, smoothPointer.current.y)
        matRef.current.uniforms.tiles.value = tiles
    })

    return (
        <mesh>
            <planeGeometry args={[2, 2]} />
            {/* @ts-expect-error - intrinsic element added via extend */}
            <waveMaterial ref={matRef} transparent depthTest={false} depthWrite={false} />
        </mesh>
    )
}

export function Wave({
    speed = 1,
    tiles = 1.5,
    className,
    style,
}: WaveProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const mousePos = useRef({ x: 0, y: 0 })

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return
            const rect = containerRef.current.getBoundingClientRect()
            mousePos.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
            mousePos.current.y = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
        }

        window.addEventListener("mousemove", handleMouseMove)
        return () => window.removeEventListener("mousemove", handleMouseMove)
    }, [])

    return (
        <div
            ref={containerRef}
            className={className}
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: "100%",
                height: "100%",
                overflow: "hidden",
                pointerEvents: "none",
                ...style,
            }}
        >
            <Canvas
                dpr={[1, 2]}
                frameloop="always"
                gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
                style={{
                    background: "transparent",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                }}
            >
                <Suspense fallback={null}>
                    <FullScreenQuad speed={speed} tiles={tiles} mousePos={mousePos} />
                </Suspense>
            </Canvas>
        </div>
    )
}
