import { useEffect, useRef } from 'react'
import './Scanner.css'

const hexToRgb = hex => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return [1, 1, 1]
  return [parseInt(result[1], 16) / 255, parseInt(result[2], 16) / 255, parseInt(result[3], 16) / 255]
}

const directionToFloat = dir => (dir === 'horizontal' ? 1.0 : dir === 'diagonal' ? 2.0 : 0.0)

const vertex = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uSpeed;
uniform float uSweepSpeed;
uniform float uSweepWidth;
uniform float uSweepFalloff;
uniform float uScale;
uniform float uFrequency;
uniform float uRipple;
uniform float uBandDensity;
uniform float uLineSharpness;
uniform float uGlow;
uniform float uColorSpread;
uniform float uBrightness;
uniform float uContrast;
uniform float uSoftness;
uniform float uVignette;
uniform float uOpacity;
uniform float uScanline;
uniform float uGrain;
uniform float uGrainIntensity;
uniform float uDirection;
uniform vec2 uMouse;
uniform float uMouseEnabled;
uniform float uMouseRadius;
uniform float uMouseStrength;
uniform float uMouseActive;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
out vec4 fragColor;

const float TAU = 6.2831853;

float signalField(vec2 p, float t) {
  float w = sin(p.x * 1.3 + t * 0.7);
  w += sin(p.y * 1.7 - t * 0.52) * 0.8;
  w += sin((p.x + p.y) * 0.9 + t * 0.91) * 0.6;
  w += sin((p.x - p.y) * 1.53 - t * 0.63) * 0.42;
  return w * 0.35;
}

vec3 palette(float f) {
  f = clamp(f, 0.0, 1.0);
  f = pow(f, uContrast);
  vec3 c = mix(uColor1, uColor2, smoothstep(0.08, 0.6, f));
  return mix(c, uColor3, smoothstep(0.68, 1.0, f));
}

float scanBand(float x, float aa, float sharp) {
  float v = mix(0.5, 0.5 + 0.5 * cos(x * TAU), aa);
  return pow(v, sharp);
}

void main() {
  float aspect = iResolution.x / iResolution.y;
  vec2 uv0 = (gl_FragCoord.xy * 2.0 - iResolution.xy) / iResolution.y;
  vec2 p = uv0 / max(uScale, 0.001);

  float t = iTime * uSpeed;

  float mouseBoost = 0.0;
  if (uMouseEnabled > 0.5) {
    vec2 mUv = vec2((uMouse.x * 2.0 - 1.0) * aspect, uMouse.y * 2.0 - 1.0);
    vec2 md = uv0 - mUv;
    float r = max(uMouseRadius, 0.001);
    mouseBoost = exp(-dot(md, md) / (r * r)) * uMouseStrength * uMouseActive;
  }

  float axis;
  if (uDirection < 0.5) axis = p.y;
  else if (uDirection < 1.5) axis = p.x;
  else axis = (p.x + p.y) * 0.70710678;

  float sig = signalField(p * uFrequency, t);
  float coord = axis + sig * uRipple;

  float phase = coord / max(uSweepWidth, 0.05) - t * uSweepSpeed;
  float sweep = pow(0.5 + 0.5 * cos(phase * TAU), max(uSweepFalloff, 0.1));

  float lc = coord * uBandDensity;
  float aa = 1.0 / (1.0 + uSoftness * fwidth(lc) * 3.0);
  aa = clamp(aa * (1.0 + mouseBoost * 0.6), 0.0, 1.0);

  float bodyBase = clamp(0.5 + 0.5 * sig, 0.0, 1.0);
  float body = bodyBase * bodyBase * uGlow * sweep;

  float sharp = max(uLineSharpness, 0.1);
  float split = uColorSpread * 0.16;
  float fr = clamp(scanBand(lc + split, aa, sharp) * sweep + body, 0.0, 1.0);
  float fg = clamp(scanBand(lc, aa, sharp) * sweep + body, 0.0, 1.0);
  float fb = clamp(scanBand(lc - split, aa, sharp) * sweep + body, 0.0, 1.0);

  vec3 col = vec3(palette(fr).r, palette(fg).g, palette(fb).b);

  float inten = (fr + fg + fb) * 0.3333333 * uBrightness;
  inten *= 1.0 + mouseBoost * 0.9;

  if (uScanline > 0.5) {
    inten *= 1.0 - 0.18 * (0.5 + 0.5 * cos(gl_FragCoord.y * 1.7));
  }

  if (uGrain > 0.5) {
    float g = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)) + iTime) * 43758.5453);
    inten += (g - 0.5) * uGrainIntensity;
  }

  inten *= clamp(1.0 - uVignette * smoothstep(0.55, 1.65, length(uv0)), 0.0, 1.0);
  inten = clamp(inten, 0.0, 1.0);

  float a = clamp(inten * uOpacity, 0.0, 1.0);
  fragColor = vec4(clamp(col, 0.0, 1.0) * a, a);
}
`

const compileShader = (gl, type, src) => {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, src)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    throw new Error(log || 'shader compile error')
  }
  return shader
}

const createProgram = (gl, vertexSrc, fragmentSrc) => {
  const program = gl.createProgram()
  const vs = compileShader(gl, gl.VERTEX_SHADER, vertexSrc)
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSrc)
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program)
    gl.deleteProgram(program)
    throw new Error(log || 'program link error')
  }
  gl.deleteShader(vs)
  gl.deleteShader(fs)
  return program
}

const ctxMap = new WeakMap()

const Scanner = ({
  color1 = '#5227FF',
  color2 = '#FF9FFC',
  color3 = '#FFFFFF',
  speed = 0.5,
  sweepSpeed = 0.25,
  sweepWidth = 1.6,
  sweepFalloff = 6,
  scale = 1.5,
  frequency = 2,
  ripple = 0.22,
  bandDensity = 11,
  lineSharpness = 5.5,
  glow = 0.22,
  scanDirection = 'vertical',
  colorSpread = 0.7,
  brightness = 1.0,
  contrast = 1.15,
  softness = 1.4,
  vignette = 0.45,
  scanline = true,
  grain = true,
  grainIntensity = 0.05,
  opacity = 1.0,
  mouseInteraction = true,
  mouseRadius = 0.5,
  mouseStrength = 0.5,
  className = ''
}) => {
  const containerRef = useRef(null)
  const mouseEnabledRef = useRef(mouseInteraction)
  const settingsRef = useRef({})

  settingsRef.current = {
    speed,
    sweepSpeed,
    sweepWidth,
    sweepFalloff,
    scale,
    frequency,
    ripple,
    bandDensity,
    lineSharpness,
    glow,
    colorSpread,
    brightness,
    contrast,
    softness,
    vignette,
    opacity,
    scanline,
    grain,
    grainIntensity,
    direction: directionToFloat(scanDirection),
    mouseEnabled: mouseInteraction,
    mouseRadius,
    mouseStrength,
    color1: hexToRgb(color1),
    color2: hexToRgb(color2),
    color3: hexToRgb(color3)
  }

  useEffect(() => {
    mouseEnabledRef.current = mouseInteraction
  }, [mouseInteraction])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const canvas = document.createElement('canvas')
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    canvas.style.display = 'block'
    container.appendChild(canvas)

    const gl = canvas.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false
    })
    if (!gl) return

    gl.clearColor(0, 0, 0, 0)

    const program = createProgram(gl, vertex, fragment)
    gl.useProgram(program)

    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const positionLoc = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(positionLoc)
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0)

    const uniformLoc = name => gl.getUniformLocation(program, name)
    const locations = {
      iTime: uniformLoc('iTime'),
      iResolution: uniformLoc('iResolution'),
      uSpeed: uniformLoc('uSpeed'),
      uSweepSpeed: uniformLoc('uSweepSpeed'),
      uSweepWidth: uniformLoc('uSweepWidth'),
      uSweepFalloff: uniformLoc('uSweepFalloff'),
      uScale: uniformLoc('uScale'),
      uFrequency: uniformLoc('uFrequency'),
      uRipple: uniformLoc('uRipple'),
      uBandDensity: uniformLoc('uBandDensity'),
      uLineSharpness: uniformLoc('uLineSharpness'),
      uGlow: uniformLoc('uGlow'),
      uColorSpread: uniformLoc('uColorSpread'),
      uBrightness: uniformLoc('uBrightness'),
      uContrast: uniformLoc('uContrast'),
      uSoftness: uniformLoc('uSoftness'),
      uVignette: uniformLoc('uVignette'),
      uOpacity: uniformLoc('uOpacity'),
      uScanline: uniformLoc('uScanline'),
      uGrain: uniformLoc('uGrain'),
      uGrainIntensity: uniformLoc('uGrainIntensity'),
      uDirection: uniformLoc('uDirection'),
      uMouse: uniformLoc('uMouse'),
      uMouseEnabled: uniformLoc('uMouseEnabled'),
      uMouseRadius: uniformLoc('uMouseRadius'),
      uMouseStrength: uniformLoc('uMouseStrength'),
      uMouseActive: uniformLoc('uMouseActive'),
      uColor1: uniformLoc('uColor1'),
      uColor2: uniformLoc('uColor2'),
      uColor3: uniformLoc('uColor3')
    }

    ctxMap.set(container, { gl, canvas })

    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const setSize = () => {
      const rect = container.getBoundingClientRect()
      const w = Math.max(1, Math.floor(rect.width * dpr))
      const h = Math.max(1, Math.floor(rect.height * dpr))
      canvas.width = w
      canvas.height = h
      gl.viewport(0, 0, w, h)
    }

    const ro = new ResizeObserver(setSize)
    ro.observe(container)
    setSize()

    let currentMouse = [0.5, 0.5]
    let targetMouse = [0.5, 0.5]
    let mouseActive = 0
    let targetMouseActive = 0

    const onMouseMove = e => {
      const rect = canvas.getBoundingClientRect()
      targetMouse = [(e.clientX - rect.left) / rect.width, 1.0 - (e.clientY - rect.top) / rect.height]
      targetMouseActive = 1
    }
    const onMouseLeave = () => {
      targetMouseActive = 0
    }
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseleave', onMouseLeave)

    let raf = 0
    let isVisible = true
    let isPageVisible = !document.hidden
    const t0 = performance.now()

    const loop = t => {
      const s = settingsRef.current

      if (!mouseEnabledRef.current) {
        targetMouseActive = 0
      }
      currentMouse[0] += 0.05 * (targetMouse[0] - currentMouse[0])
      currentMouse[1] += 0.05 * (targetMouse[1] - currentMouse[1])
      mouseActive += 0.05 * (targetMouseActive - mouseActive)

      gl.useProgram(program)
      gl.uniform1f(locations.iTime, (t - t0) * 0.001)
      gl.uniform2f(locations.iResolution, gl.drawingBufferWidth, gl.drawingBufferHeight)
      gl.uniform1f(locations.uSpeed, s.speed)
      gl.uniform1f(locations.uSweepSpeed, s.sweepSpeed)
      gl.uniform1f(locations.uSweepWidth, s.sweepWidth)
      gl.uniform1f(locations.uSweepFalloff, s.sweepFalloff)
      gl.uniform1f(locations.uScale, s.scale)
      gl.uniform1f(locations.uFrequency, s.frequency)
      gl.uniform1f(locations.uRipple, s.ripple)
      gl.uniform1f(locations.uBandDensity, s.bandDensity)
      gl.uniform1f(locations.uLineSharpness, s.lineSharpness)
      gl.uniform1f(locations.uGlow, s.glow)
      gl.uniform1f(locations.uColorSpread, s.colorSpread)
      gl.uniform1f(locations.uBrightness, s.brightness)
      gl.uniform1f(locations.uContrast, s.contrast)
      gl.uniform1f(locations.uSoftness, s.softness)
      gl.uniform1f(locations.uVignette, s.vignette)
      gl.uniform1f(locations.uOpacity, s.opacity)
      gl.uniform1f(locations.uScanline, s.scanline ? 1.0 : 0.0)
      gl.uniform1f(locations.uGrain, s.grain ? 1.0 : 0.0)
      gl.uniform1f(locations.uGrainIntensity, s.grainIntensity)
      gl.uniform1f(locations.uDirection, s.direction)
      gl.uniform2f(locations.uMouse, currentMouse[0], currentMouse[1])
      gl.uniform1f(locations.uMouseEnabled, s.mouseEnabled ? 1.0 : 0.0)
      gl.uniform1f(locations.uMouseRadius, s.mouseRadius)
      gl.uniform1f(locations.uMouseStrength, s.mouseStrength)
      gl.uniform1f(locations.uMouseActive, mouseActive)
      gl.uniform3f(locations.uColor1, s.color1[0], s.color1[1], s.color1[2])
      gl.uniform3f(locations.uColor2, s.color2[0], s.color2[1], s.color2[2])
      gl.uniform3f(locations.uColor3, s.color3[0], s.color3[1], s.color3[2])

      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.drawArrays(gl.TRIANGLES, 0, 3)

      raf = requestAnimationFrame(loop)
    }

    const tryStart = () => {
      if (isVisible && isPageVisible && raf === 0) raf = requestAnimationFrame(loop)
    }
    const tryStop = () => {
      if (raf !== 0) {
        cancelAnimationFrame(raf)
        raf = 0
      }
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting
        isVisible ? tryStart() : tryStop()
      },
      { threshold: 0 }
    )
    io.observe(container)

    const onVisibility = () => {
      isPageVisible = !document.hidden
      isPageVisible ? tryStart() : tryStop()
    }
    document.addEventListener('visibilitychange', onVisibility)

    tryStart()

    return () => {
      tryStop()
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseleave', onMouseLeave)
      ctxMap.delete(container)
      try {
        container.removeChild(canvas)
      } catch {}
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [])

  return <div ref={containerRef} className={`scanner-container ${className}`.trim()} />
}

export default Scanner
