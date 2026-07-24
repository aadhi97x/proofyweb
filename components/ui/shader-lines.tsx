"use client"

import { useEffect, useRef } from "react"

export function ShaderAnimation() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const gl = canvas.getContext("webgl", { antialias: true })
        if (!gl) return

        const vertexShaderSrc = `
      attribute vec2 position;
      void main() {
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `

        const fragmentShaderSrc = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;
        
      float random (in float x) {
          return fract(sin(x)*1e4);
      }
      
      void main(void) {
        vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
        
        // Correct mosaic logic from original prompt
        vec2 fMosaicScal = vec2(4.0, 2.0);
        vec2 vScreenSize = vec2(256.0, 256.0);
        uv.x = floor(uv.x * vScreenSize.x / fMosaicScal.x) / (vScreenSize.x / fMosaicScal.x);
        uv.y = floor(uv.y * vScreenSize.y / fMosaicScal.y) / (vScreenSize.y / fMosaicScal.y);       
          
        float t = time * 0.05 + random(uv.x) * 0.4;
        float lineWidth = 0.001; // Balanced luminosity

        vec3 color = vec3(0.0);
        float len = length(uv);
        
        for(int j = 0; j < 3; j++){
          for(int i=0; i < 5; i++){
            float pulse = fract(t - 0.01 * float(j) + float(i) * 0.01);
            float dist = abs(pulse * 1.5 - len);
            color[j] += lineWidth * float(i * i) / max(dist, 0.001);
          }
        }

        vec3 finalColor = vec3(color.z, color.y, color.x);
        vec3 tint = vec3(0.0, 1.0, 0.6); // Neon green tint
        
        // Add green hue while preserving some luminosity for the white core
        vec3 greenHue = mix(finalColor, finalColor * tint, 0.8) + finalColor * 0.2;
        
        gl_FragColor = vec4(greenHue, 1.0);
      }
    `

        const createShader = (gl: WebGLRenderingContext, type: number, source: string) => {
            const shader = gl.createShader(type)
            if (!shader) return null
            gl.shaderSource(shader, source)
            gl.compileShader(shader)
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error(gl.getShaderInfoLog(shader))
                gl.deleteShader(shader)
                return null
            }
            return shader
        }

        const vs = createShader(gl, gl.VERTEX_SHADER, vertexShaderSrc)
        const fs = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSrc)
        if (!vs || !fs) return

        const program = gl.createProgram()
        if (!program) return
        gl.attachShader(program, vs)
        gl.attachShader(program, fs)
        gl.linkProgram(program)
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error(gl.getProgramInfoLog(program))
            return
        }
        gl.useProgram(program)

        const buffer = gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW)

        const positionLoc = gl.getAttribLocation(program, "position")
        gl.enableVertexAttribArray(positionLoc)
        gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0)

        const resolutionLoc = gl.getUniformLocation(program, "resolution")
        const timeLoc = gl.getUniformLocation(program, "time")

        let animationId: number
        const render = (now: number) => {
            const parent = canvas.parentElement
            if (!parent) return

            const width = parent.clientWidth
            const height = parent.clientHeight

            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width
                canvas.height = height
                gl.viewport(0, 0, width, height)
            }

            gl.uniform2f(resolutionLoc, canvas.width, canvas.height)
            gl.uniform1f(timeLoc, now * 0.001)

            gl.drawArrays(gl.TRIANGLES, 0, 6)
            animationId = requestAnimationFrame(render)
        }
        animationId = requestAnimationFrame(render)

        return () => {
            cancelAnimationFrame(animationId)
            gl.deleteBuffer(buffer)
            gl.deleteProgram(program)
            gl.deleteShader(vs)
            gl.deleteShader(fs)
        }
    }, [])

    return (
        <div className="absolute inset-0 z-0 pointer-events-none w-full h-full bg-black">
            <canvas ref={canvasRef} className="w-full h-full block" />
        </div>
    )
}
