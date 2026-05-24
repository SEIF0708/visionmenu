"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { 
  motion, 
  useScroll, 
  useTransform, 
  useSpring, 
  useMotionValue 
} from "framer-motion";
import { 
  Upload, 
  QrCode, 
  Eye, 
  Compass, 
  Sparkles, 
  BarChart3, 
  Smartphone, 
  ArrowRight, 
  Play, 
  Check, 
  ChevronRight, 
  Zap,
  Flame,
  Maximize2
} from "lucide-react";

// Depth-of-Field Premium Custom SVG Floating Ingredients
// Layer 1: Foreground (Huge scale, High blur, High response)
// Layer 2: Midground (Sharp, Normal scale, Standard response)
// Layer 3: Background (Small, Soft blur, Gentle reverse response)

const BasilLeaf = ({ className, style, filter }: { className?: string, style?: any, filter?: string }) => (
  <motion.svg style={{ ...style, filter }} className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 10C20 40 25 80 50 90C75 80 80 40 50 10Z" fill="url(#basil-grad-new)" />
    <path d="M50 10Q50 50 50 90" stroke="#86efac" strokeWidth="2.5" opacity="0.7" />
    <path d="M50 30Q35 45 28 40" stroke="#86efac" strokeWidth="1.8" opacity="0.5" />
    <path d="M50 50Q65 65 72 60" stroke="#86efac" strokeWidth="1.8" opacity="0.5" />
    <defs>
      <linearGradient id="basil-grad-new" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#15803d" />
        <stop offset="60%" stopColor="#166534" />
        <stop offset="100%" stopColor="#14532d" />
      </linearGradient>
    </defs>
  </motion.svg>
);

const TomatoSlice = ({ className, style, filter }: { className?: string, style?: any, filter?: string }) => (
  <motion.svg style={{ ...style, filter }} className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="42" fill="url(#tomato-base-new)" />
    <circle cx="50" cy="50" r="34" stroke="#f43f5e" strokeWidth="4.5" fill="none" opacity="0.9" />
    {/* Inner seed pockets */}
    <path d="M38 38Q32 50 38 62Q50 68 62 62Q68 50 62 38Q50 32 38 38Z" fill="#7f1d1d" opacity="0.6" />
    <circle cx="44" cy="44" r="3.5" fill="#fde047" />
    <circle cx="56" cy="48" r="4" fill="#fde047" />
    <circle cx="47" cy="56" r="3.5" fill="#fde047" />
    <defs>
      <radialGradient id="tomato-base-new">
        <stop offset="65%" stopColor="#e11d48" />
        <stop offset="90%" stopColor="#be123c" />
        <stop offset="100%" stopColor="#881337" />
      </radialGradient>
    </defs>
  </motion.svg>
);

const PepperoniSlice = ({ className, style, filter }: { className?: string, style?: any, filter?: string }) => (
  <motion.svg style={{ ...style, filter }} className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="38" fill="url(#pep-grad-new)" />
    <circle cx="40" cy="45" r="4.5" fill="#450a0a" opacity="0.7" />
    <circle cx="58" cy="36" r="3.5" fill="#450a0a" opacity="0.7" />
    <circle cx="48" cy="62" r="5" fill="#450a0a" opacity="0.7" />
    <defs>
      <radialGradient id="pep-grad-new">
        <stop offset="50%" stopColor="#dc2626" />
        <stop offset="85%" stopColor="#b91c1c" />
        <stop offset="100%" stopColor="#7f1d1d" />
      </radialGradient>
    </defs>
  </motion.svg>
);

const CheeseFlake = ({ className, style, filter }: { className?: string, style?: any, filter?: string }) => (
  <motion.svg style={{ ...style, filter }} className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M25 25L75 40L65 85L15 70Z" fill="url(#cheese-grad-new)" />
    <circle cx="42" cy="48" r="4.5" fill="#ca8a04" opacity="0.5" />
    <circle cx="52" cy="62" r="4" fill="#ca8a04" opacity="0.5" />
    <defs>
      <linearGradient id="cheese-grad-new" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="40%" stopColor="#facc15" />
        <stop offset="100%" stopColor="#eab308" />
      </linearGradient>
    </defs>
  </motion.svg>
);

const VolumetricSteam = ({ className, delay }: { className?: string; delay: number }) => (
  <motion.div
    className={`absolute w-8 h-36 bg-gradient-to-t from-white/6 via-white/3 to-transparent rounded-full blur-2xl ${className}`}
    initial={{ y: 120, opacity: 0, scale: 0.6 }}
    animate={{
      y: -300,
      opacity: [0, 0.5, 0.5, 0],
      scale: [0.6, 1.4, 2.0, 2.8],
      x: [0, 25, -25, 0],
      rotate: [0, 15, -15, 0]
    }}
    transition={{
      duration: 6,
      repeat: Infinity,
      delay: delay,
      ease: "easeOut",
    }}
  />
);
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

export default function LandingPage() {
  const ModelViewer: any = 'model-viewer';
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parallax Scroll-linked states
  const { scrollY, scrollYProgress } = useScroll();
  const heroTextY = useTransform(scrollY, [0, 600], [0, 120]);
  const heroPizzaY = useTransform(scrollY, [0, 600], [0, 180]);
  const heroPizzaScale = useTransform(scrollY, [0, 600], [1, 0.85]);
  const bgOpacity = useTransform(scrollY, [0, 900], [1, 0.2]);

  // Smooth Y-Rotation and Zoom linked to Scroll position (Luxury Reveal)
  const [cameraOrbit, setCameraOrbit] = useState("0deg 70deg 100%");

  useEffect(() => {
    return scrollYProgress.onChange((latest) => {
      // 0 to 1 scroll mapping
      const rotY = latest * 160;         // Pizza slowly rotates Y on scroll
      const rotX = 70 - latest * 10;      // Camera slightly tilts
      const zoom = 100 - latest * 15;     // Pizza zooms closer to the frame
      setCameraOrbit(`${rotY}deg ${rotX}deg ${zoom}%`);
    });
  }, [scrollYProgress]);

  // Mouse coordinate springs for Parallax drift
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 30, stiffness: 100 };

  // Foreground Springs (Strong responsive movement)
  const fgX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-70, 70]), springConfig);
  const fgY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-70, 70]), springConfig);

  // Midground Springs (Standard movement)
  const mgX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-35, 35]), springConfig);
  const mgY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-35, 35]), springConfig);

  // Background Springs (Subtle reverse movement for deep parallax)
  const bgX = useSpring(useTransform(mouseX, [-0.5, 0.5], [20, -20]), springConfig);
  const bgY = useSpring(useTransform(mouseY, [-0.5, 0.5], [20, -20]), springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    const relX = (e.clientX - rect.left) / width - 0.5;
    const relY = (e.clientY - rect.top) / height - 0.5;

    mouseX.set(relX);
    mouseY.set(relY);
  };

  const [demoState, setDemoState] = useState<"scan" | "placed">("scan");

  useEffect(() => {
    if (demoState === "scan") {
      const timer = setTimeout(() => {
        setDemoState("placed");
      }, 4500);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setDemoState("scan");
      }, 7500);
      return () => clearTimeout(timer);
    }
  }, [demoState]);

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen selection:bg-rose-500 selection:text-white"
    >
      {/* High-End Cinematic Grain Overlay */}
      <div 
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      {/* Global Background Glow Spotlights */}
      <motion.div 
        style={{ opacity: bgOpacity }}
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute top-[-15%] right-[-10%] w-[70vw] h-[70vw] rounded-full bg-gradient-to-br from-rose-500/12 to-amber-500/6 blur-[160px]" />
        <div className="absolute top-[25%] left-[-25%] w-[60vw] h-[60vw] rounded-full bg-rose-500/4 blur-[130px]" />
        <div className="absolute bottom-[5%] right-[5%] w-[50vw] h-[50vw] rounded-full bg-amber-500/4 blur-[140px]" />
      </motion.div>

      {/* Header */}
      <header className="fixed top-0 inset-x-0 z-40 bg-neutral-950/50 backdrop-blur-xl border-b border-neutral-900/80">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2.5"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center font-black text-white shadow-lg shadow-rose-500/25">
              V
            </div>
            <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-neutral-50 via-neutral-100 to-neutral-400 bg-clip-text text-transparent">
              VisionMenu
            </span>
          </motion.div>

          <nav className="hidden md:flex items-center gap-9">
            {["Features", "How It Works", "Demo", "Pricing"].map((link, idx) => (
              <motion.a
                key={link}
                href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.08 }}
                className="text-xs font-semibold uppercase tracking-widest text-neutral-400 hover:text-neutral-50 transition-colors"
              >
                {link}
              </motion.a>
            ))}
          </nav>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-5"
          >
            <Link 
              href="http://localhost:3001/login"
              className="text-sm font-semibold text-neutral-400 hover:text-neutral-50 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="#pricing"
              className="relative group overflow-hidden px-5 py-2.5 rounded-xl bg-neutral-50 text-neutral-950 text-xs font-bold uppercase tracking-wider transition-all hover:shadow-xl hover:shadow-white/10"
            >
              <span className="relative z-10">Start Free</span>
              <div className="absolute inset-0 translate-y-[100%] group-hover:translate-y-0 bg-gradient-to-r from-rose-500 to-amber-500 transition-transform duration-300 -z-0" />
            </Link>
          </motion.div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-28 pb-20 px-6 overflow-hidden">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left Cinematic Content */}
          <motion.div 
            style={{ y: heroTextY }}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="lg:col-span-5 z-10 text-left"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.8 rounded-full bg-rose-500/10 border border-rose-500/20 text-[10px] font-bold uppercase tracking-widest text-rose-400 mb-6 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              <span>Next Generation WebXR Framework</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.05] mb-6">
              Bring Your <br />
              <span className="bg-gradient-to-r from-rose-500 via-rose-400 to-amber-500 bg-clip-text text-transparent">
                Menu To Life
              </span>
            </h1>

            <p className="text-base sm:text-lg text-neutral-400 leading-relaxed max-w-lg">
              Transform restaurant dishes into immersive AR experiences customers can view directly on their tables. Elevate culinary visual storytelling to the Apple-era.
            </p>

            <div className="mt-10 flex flex-wrap gap-4 items-center">
              <Link 
                href="#pricing"
                className="inline-flex items-center gap-2.5 px-8 py-4.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 text-white font-bold text-sm shadow-xl shadow-rose-500/20 hover:shadow-rose-500/35 transition-all hover:scale-[1.02]"
              >
                <span>Start Free Trial</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a 
                href="#demo"
                className="inline-flex items-center gap-2 px-7 py-4.5 rounded-xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800/80 text-white font-bold text-sm transition-all backdrop-blur-md"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Watch Demo</span>
              </a>
            </div>

            {/* Micro stats */}
            <div className="mt-16 pt-8 border-t border-neutral-900/80 grid grid-cols-3 gap-8">
              {[
                { val: "30%+", desc: "Order Increase" },
                { val: "< 3.0s", desc: "Edge Delivery" },
                { val: "15s+", desc: "AR Retention" }
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-3xl font-black text-white tracking-tight">{stat.val}</div>
                  <div className="text-[10px] uppercase tracking-wider font-bold text-neutral-500 mt-1.5">{stat.desc}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Giant Cinematic Interactive 3D Model */}
          <motion.div 
            style={{ y: heroPizzaY, scale: heroPizzaScale }}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="lg:col-span-7 relative aspect-square w-full max-w-[650px] mx-auto lg:max-w-none flex items-center justify-center"
          >
            {/* Volumetric Radial Lighting Backglow */}
            <div className="absolute w-[90%] h-[90%] rounded-full bg-gradient-to-tr from-rose-500/18 via-amber-500/8 to-transparent blur-[100px] -z-10" />

            {/* VOLUMETRIC STEAM SYSTEM */}
            <VolumetricSteam className="left-[48%] top-[5%]" delay={0} />
            <VolumetricSteam className="left-[32%] top-[20%]" delay={1.8} />
            <VolumetricSteam className="left-[60%] top-[15%]" delay={3.6} />

            {/* MULTI-LAYER DEPTH OF FIELD FLOATING PARTICLES */}
            
            {/* Layer 1: Foreground (Huge scale, High blur, High response) */}
            <TomatoSlice 
              className="absolute top-[8%] left-[8%] w-24 h-24 z-30 pointer-events-none" 
              style={{ x: fgX, y: fgY, rotate: 20 }}
              filter="blur(5px)"
            />
            <BasilLeaf 
              className="absolute bottom-[10%] right-[5%] w-24 h-24 z-30 pointer-events-none" 
              style={{ x: fgX, y: fgY, rotate: -40 }}
              filter="blur(6px)"
            />

            {/* Layer 2: Midground (Sharp, Normal scale, Standard response) */}
            <PepperoniSlice 
              className="absolute top-[12%] right-[10%] w-16 h-16 z-20 pointer-events-none filter drop-shadow-[0_12px_24px_rgba(220,38,38,0.45)]" 
              style={{ x: mgX, y: mgY, rotate: -15 }}
            />
            <CheeseFlake 
              className="absolute bottom-[20%] left-[6%] w-16 h-16 z-20 pointer-events-none filter drop-shadow-[0_10px_20px_rgba(234,179,8,0.35)]" 
              style={{ x: mgX, y: mgY, rotate: 50 }}
            />
            <BasilLeaf 
              className="absolute top-[50%] left-[2%] w-14 h-14 z-20 pointer-events-none filter drop-shadow-[0_8px_16px_rgba(22,101,52,0.35)]" 
              style={{ x: mgX, y: mgY, rotate: 80 }}
            />

            {/* Layer 3: Background (Small, Soft blur, Gentle reverse response) */}
            <PepperoniSlice 
              className="absolute bottom-[40%] right-[3%] w-9 h-9 z-10 pointer-events-none" 
              style={{ x: bgX, y: bgY, rotate: 110 }}
              filter="blur(3px)"
            />
            <TomatoSlice 
              className="absolute top-[3%] right-[35%] w-10 h-10 z-10 pointer-events-none" 
              style={{ x: bgX, y: bgY, rotate: -65 }}
              filter="blur(2.5px)"
            />
            <CheeseFlake 
              className="absolute bottom-[6%] left-[40%] w-9 h-9 z-10 pointer-events-none" 
              style={{ x: bgX, y: bgY, rotate: 15 }}
              filter="blur(3.5px)"
            />

            {/* Giant Luxury 3D Full Pizza canvas */}
            <div className="w-full h-full p-6 rounded-full border border-white/5 bg-neutral-950/15 backdrop-blur-[2px] relative overflow-hidden group shadow-3xl shadow-black/80">
              <ModelViewer
                src="/pizza.glb"
                alt="VisionMenu Luxury 3D Pizza"
                auto-rotate
                camera-controls
                shadow-intensity="2.2"
                shadow-softness="0.4"
                exposure="1.45"
                interaction-prompt="none"
                camera-orbit={cameraOrbit}
                style={{ width: "100%", height: "100%", outline: "none" }}
              />
              
              {/* Luxury Detail Overlay */}
              <div className="absolute inset-x-0 bottom-12 flex flex-col items-center justify-center pointer-events-none z-20">
                <div className="px-5 py-2.5 rounded-full bg-neutral-950/70 border border-white/10 text-xs font-semibold text-neutral-300 backdrop-blur-md group-hover:opacity-0 transition-opacity duration-300 flex items-center gap-2 shadow-2xl">
                  <Compass className="w-4 h-4 text-rose-500 animate-spin" style={{ animationDuration: "8s" }} />
                  <span>Interactive 3D Preview • Drag to Spin</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-6 border-t border-neutral-900/60 bg-neutral-950">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-xs uppercase tracking-widest font-bold text-rose-500 mb-3">Immersive Workflow</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Create and Deploy in Minutes
            </h3>
            <p className="text-neutral-400 mt-4">
              Our enterprise architecture streamlines asset onboarding, instant custom QR creation, and device optimization pipelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: Upload,
                color: "from-rose-500 to-rose-700",
                title: "Upload Food Asset",
                desc: "Drag & drop standard 3D models (GLB or GLTF) directly. Our server-side edge optimization pipelines generate responsive sizes instantly."
              },
              {
                step: "02",
                icon: QrCode,
                color: "from-amber-500 to-amber-700",
                title: "Generate Smart QR",
                desc: "Download high-definition vector QR codes tied dynamically to database endpoints. Easily print and place them directly on tables."
              },
              {
                step: "03",
                icon: Eye,
                color: "from-rose-500 to-amber-500",
                title: "Immersive View in AR",
                desc: "Customers scan instantly with any mobile device. Food models render elegantly directly onto physical table surfaces."
              }
            ].map((step, idx) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="relative rounded-2xl p-8 bg-neutral-900/30 border border-neutral-800/80 backdrop-blur-md group hover:border-neutral-700/60 transition-all hover:translate-y-[-4px]"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${step.color} flex items-center justify-center text-white mb-6 shadow-lg shadow-rose-500/10`}>
                  <step.icon className="w-5 h-5" />
                </div>
                <div className="absolute top-6 right-8 text-4xl font-extrabold text-neutral-800/30 font-mono">
                  {step.step}
                </div>
                <h4 className="text-xl font-bold text-white mb-3">{step.title}</h4>
                <p className="text-sm text-neutral-400 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section id="demo" className="py-24 px-6 border-t border-neutral-900/60 bg-gradient-to-b from-neutral-950 to-black relative">
        <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-[500px] h-[500px] rounded-full bg-rose-500/5 blur-[120px] pointer-events-none" />

        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5 text-left">
              <h2 className="text-xs uppercase tracking-widest font-bold text-rose-500 mb-3">Live Simulation</h2>
              <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Scan, Place, & Experience
              </h3>
              <p className="text-neutral-400 mt-4 leading-relaxed">
                Interact with the mobile screen simulation on the right. See how scanning a custom table QR code seamlessly transitions into a realistic, table-top 3D augmented reality experience.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  { title: "No App Store Installs Needed", desc: "Runs directly inside WebXR-capable native browsers." },
                  { title: "Zero Latency Model Upgrade", desc: "Cached assets serve lightning-fast rendering states." },
                  { title: "Interactive Pricing Integrations", desc: "Add options, nutritional charts, and buy instantly." }
                ].map((point, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mt-1">
                      <Check className="w-3 h-3 text-rose-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{point.title}</h4>
                      <p className="text-xs text-neutral-400 mt-0.5">{point.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Mockup */}
            <div className="lg:col-span-7 flex justify-center">
              <div className="relative w-full max-w-[340px] aspect-[9/18.5] rounded-[48px] border-[8px] border-neutral-800 bg-neutral-950 shadow-3xl shadow-rose-500/5 flex flex-col overflow-hidden">
                {demoState === "scan" ? (
                  <motion.div 
                    key="scan"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col justify-between p-6 relative bg-gradient-to-b from-neutral-950 to-neutral-900 text-center"
                  >
                    <div className="absolute top-1 left-1/2 -translate-x-1/2 w-28 h-4 rounded-full bg-neutral-800" />

                    <div className="mt-8">
                      <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">Scan Menu Item</span>
                      <h4 className="text-lg font-bold text-white mt-1">VisionMenu Reader</h4>
                    </div>

                    <div className="relative w-44 h-44 mx-auto my-auto bg-neutral-900 border border-neutral-800 rounded-2xl flex items-center justify-center p-4">
                      <motion.div 
                        animate={{ y: [-70, 70, -70] }}
                        transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                        className="absolute left-0 right-0 h-0.5 bg-rose-500 shadow-[0_0_10px_#f43f5e] z-10"
                      />
                      <QrCode className="w-full h-full text-white" />
                    </div>

                    <div className="mb-4">
                      <p className="text-xs text-neutral-400">Position the table QR code in the frame to place the dish in 3D AR.</p>
                      <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-rose-400 font-semibold animate-pulse">
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>Initializing Camera Link...</span>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="placed"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex-1 flex flex-col relative text-left bg-black"
                  >
                    <div className="absolute top-1 left-1/2 -translate-x-1/2 w-28 h-4 rounded-full bg-neutral-800 z-30" />
                    
                    {/* Camera view background (wooden tabletop) */}
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581428982868-e410dd047a90')] bg-cover bg-center opacity-85 z-0 filter saturate-60 brightness-95" />
                    
                    {/* Shadow overlay to integrate camera view */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50 z-0 pointer-events-none" />

                    {/* Premium iOS AR HUD Top Notification Bar */}
                    <div className="absolute top-8 inset-x-4 py-2.5 px-4 rounded-2xl bg-neutral-950/85 border border-white/10 backdrop-blur-md z-30 flex items-center justify-between shadow-2xl">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                        <div>
                          <h5 className="text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            <span>AR Active</span>
                          </h5>
                          <p className="text-[9px] text-neutral-400">Margherita Pizza (12&quot;)</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-md bg-neutral-900 border border-white/5 text-[8px] font-mono uppercase tracking-wider text-neutral-400">
                        1:1 Scale
                      </span>
                    </div>

                    {/* Back Button */}
                    <button 
                      onClick={() => setDemoState("scan")}
                      className="absolute bottom-6 left-6 w-10 h-10 rounded-full bg-black/75 border border-white/10 flex items-center justify-center text-white z-30 backdrop-blur-md hover:bg-black transition-all shadow-xl"
                    >
                      ←
                    </button>

                    {/* Interactive Reset Scan Hint */}
                    <button 
                      onClick={() => setDemoState("scan")}
                      className="absolute bottom-6 right-6 px-4 py-2.5 rounded-full bg-rose-500 text-white font-bold text-[9px] uppercase tracking-wider z-30 shadow-lg shadow-rose-500/20 hover:scale-[1.02] transition-transform"
                    >
                      Reset Scan
                    </button>

                    {/* Table Surface integration elements */}
                    {/* Plate Ambient shadow on wooden table */}
                    <div className="absolute bottom-[20%] left-[8%] w-[84%] h-[20%] rounded-full bg-black/85 blur-xl z-10 transform scale-y-[0.4] pointer-events-none" />

                    {/* Luxurious Slate/Ceramic Plate resting in perspective on table */}
                    <div className="absolute bottom-[22%] left-[12%] w-[76%] h-[16%] rounded-full bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-900 border border-neutral-800 shadow-2xl z-10 transform scale-y-[0.4] flex items-center justify-center pointer-events-none">
                      {/* Plate inner ring */}
                      <div className="w-[88%] h-[88%] rounded-full border border-neutral-800/80 bg-neutral-950/60 shadow-inner" />
                    </div>

                    {/* Placed 3D Pizza rendering naturally on the Plate */}
                    <div className="absolute bottom-[10%] left-0 right-0 h-[42%] z-20 flex items-center justify-center">
                      <ModelViewer
                        src="/pizza.glb"
                        alt="3D Pizza Simulation"
                        auto-rotate
                        camera-controls
                        interaction-prompt="none"
                        shadow-intensity="2.0"
                        shadow-softness="0.4"
                        exposure="1.45"
                        camera-orbit="0deg 75deg 110%"
                        style={{ width: "95%", height: "95%", outline: "none" }}
                      />
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 border-t border-neutral-900/60 bg-neutral-950">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-xs uppercase tracking-widest font-bold text-rose-500 mb-3">Enterprise Suite</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              State-of-the-Art AR Features
            </h3>
            <p className="text-neutral-400 mt-4">
              VisionMenu comes equipped with a comprehensive suite of developer and business utilities built to scale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-8 rounded-3xl p-8 bg-neutral-900/30 border border-neutral-800/80 backdrop-blur-md relative overflow-hidden group">
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl group-hover:bg-rose-500/10 transition-colors" />
              <Compass className="w-8 h-8 text-rose-400 mb-6" />
              <h4 className="text-xl font-bold text-white mb-2">Accurate AR Placement</h4>
              <p className="text-sm text-neutral-400 leading-relaxed max-w-lg">
                Utilize WebXR and Apple Quick Look capabilities. Food is dynamically scaled and positioned onto real table surfaces with high-precision physics matching real-world plates.
              </p>
            </div>

            <div className="md:col-span-4 rounded-3xl p-8 bg-neutral-900/30 border border-neutral-800/80 backdrop-blur-md relative overflow-hidden group">
              <Sparkles className="w-8 h-8 text-amber-400 mb-6" />
              <h4 className="text-xl font-bold text-white mb-2">Ultra-Realistic Food Render</h4>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Supports PBR materials, detailed bump mapping, and custom lighting reflections. Digital representations look hot and ready to serve.
              </p>
            </div>

            <div className="md:col-span-4 rounded-3xl p-8 bg-neutral-900/30 border border-neutral-800/80 backdrop-blur-md relative overflow-hidden group">
              <QrCode className="w-8 h-8 text-rose-400 mb-6" />
              <h4 className="text-xl font-bold text-white mb-2">Dynamic QR Generation</h4>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Instantly map database entities to high-contrast printable table vectors. Updates on admin backend sync immediately to dynamic tables.
              </p>
            </div>

            <div className="md:col-span-8 rounded-3xl p-8 bg-neutral-900/30 border border-neutral-800/80 backdrop-blur-md relative overflow-hidden group">
              <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-colors" />
              <BarChart3 className="w-8 h-8 text-amber-400 mb-6" />
              <h4 className="text-xl font-bold text-white mb-2">Deep Customer Analytics</h4>
              <p className="text-sm text-neutral-400 leading-relaxed max-w-lg">
                Track view retention rates, AR activation success metrics, device configurations, and pricing model conversions directly through a robust real-time admin portal.
              </p>
            </div>

            <div className="md:col-span-12 rounded-3xl p-8 bg-neutral-900/30 border border-neutral-800/80 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden group">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <Smartphone className="w-8 h-8 text-rose-400" />
                  <span className="text-[10px] uppercase tracking-widest font-mono text-neutral-500">Universal Availability</span>
                </div>
                <h4 className="text-xl font-bold text-white mb-2">Full iOS & Android Mobile Support</h4>
                <p className="text-sm text-neutral-400 leading-relaxed max-w-2xl">
                  Built on responsive HTML5 and lightweight GLTF standard formats. Automatically downgrades rendering strategies on older devices to maintain high frame-rates and responsive feedback.
                </p>
              </div>
              <div className="flex gap-3">
                <span className="px-3.5 py-2 rounded-full border border-neutral-800 bg-neutral-950 text-xs font-mono text-neutral-400">iOS Quick Look</span>
                <span className="px-3.5 py-2 rounded-full border border-neutral-800 bg-neutral-950 text-xs font-mono text-neutral-400">Android WebXR</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Pricing Section */}
      <section id="pricing" className="py-24 px-6 border-t border-neutral-900/60 bg-gradient-to-b from-neutral-950 to-black relative">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-xs uppercase tracking-widest font-bold text-rose-500 mb-3">Transparent Cost</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              A Plan for Every Restaurant Size
            </h3>
            <p className="text-neutral-400 mt-4">
              Get started with free features, then upgrade seamlessly as your traffic scale, locations, and menus grow.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { 
                name: "Free", 
                price: "$0", 
                features: ["5 menu items", "500 scans / month", "Standard AR viewing", "Universal mobile support"], 
                color: "border-neutral-900/80", 
                btn: "border border-neutral-800 hover:bg-neutral-900 text-white" 
              },
              { 
                name: "Basic", 
                price: "$29", 
                features: ["25 menu items", "5,000 scans / month", "Standard AR viewing", "Basic dashboard statistics", "Dynamic QR customization"], 
                color: "border-neutral-800 bg-neutral-900/10", 
                popular: false,
                btn: "border border-neutral-700 hover:bg-neutral-800 text-white" 
              },
              { 
                name: "Premium", 
                price: "$99", 
                features: ["100 menu items", "25,000 scans / month", "High-fidelity PBR rendering", "Full real-time analytics suite", "Custom white-label branding", "Priority SLA email support"], 
                color: "border-rose-500/50 bg-rose-500/[0.02]", 
                popular: true, 
                btn: "bg-gradient-to-r from-rose-500 to-amber-500 text-white hover:opacity-90 shadow-md shadow-rose-500/10" 
              },
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl border p-8 flex flex-col justify-between relative backdrop-blur-md ${plan.color} ${plan.popular ? "scale-[1.02] shadow-2xl shadow-rose-500/5" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-[10px] font-bold uppercase tracking-wider text-white">
                    Most Popular Choice
                  </div>
                )}
                <div>
                  <h4 className="text-xl font-bold text-white">{plan.name}</h4>
                  <div className="flex items-baseline mt-4 mb-6">
                    <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                    <span className="text-neutral-500 ml-1 text-sm">/ month</span>
                  </div>
                  <ul className="space-y-3.5">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex gap-2.5 text-sm text-neutral-400 items-start">
                        <Check className="w-4 h-4 text-rose-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button className={`w-full mt-8 py-3.5 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all ${plan.btn}`}>
                  Get Started Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium CTA Section */}
      <section className="py-32 px-6 border-t border-neutral-900/60 bg-neutral-950 relative overflow-hidden">
        <div className="absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-[600px] h-[300px] rounded-full bg-rose-500/10 blur-[150px] pointer-events-none" />

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
              Create Your <br />
              <span className="bg-gradient-to-r from-rose-500 via-rose-400 to-amber-500 bg-clip-text text-transparent">
                AR Menu Today
              </span>
            </h2>
            <p className="text-neutral-400 mt-6 text-lg max-w-lg mx-auto leading-relaxed">
              Transform your physical menu cards into high-conversion 3D dining experiences. Join over 1,500 premium establishments already upgrading.
            </p>
            <div className="mt-10 flex flex-wrap gap-4 justify-center">
              <Link 
                href="#pricing"
                className="px-8 py-4.5 rounded-xl bg-white text-neutral-950 font-bold shadow-lg shadow-white/5 hover:scale-[1.02] transition-transform text-sm"
              >
                Start Free Trial
              </Link>
              <Link 
                href="#how-it-works"
                className="px-8 py-4.5 rounded-xl border border-neutral-800 bg-neutral-900/40 text-white font-bold backdrop-blur-md flex items-center gap-1 hover:bg-neutral-900 transition-all text-sm"
              >
                <span>Read Architecture</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-900/60 py-16 px-6 bg-black text-xs text-neutral-500">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center font-black text-white text-xs">
              V
            </div>
            <span className="text-sm font-bold tracking-tight text-neutral-300">
              VisionMenu
            </span>
          </div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-neutral-400">Privacy Policy</a>
            <a href="#" className="hover:text-neutral-400">Terms of Service</a>
            <a href="#" className="hover:text-neutral-400">Security Architecture</a>
            <a href="#" className="hover:text-neutral-400">Developer API</a>
          </div>
          <div>
            <p>&copy; {new Date().getFullYear()} VisionMenu Inc. Designed in California. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
