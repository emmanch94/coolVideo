import { ArrowRight, Clapperboard, Link2, Sparkles, Wand2 } from "lucide-react";
import { PageBackground } from "@/components/page-background";
import { PrimaryCta } from "@/components/primary-cta";
import { SiteHeader } from "@/components/site-header";
import { StyleTile } from "@/components/style-tile";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { AuroraText } from "@/components/ui/aurora-text";
import { BlurFade } from "@/components/ui/blur-fade";
import { BorderBeam } from "@/components/ui/border-beam";
import { DotPattern } from "@/components/ui/dot-pattern";
import { MagicCard } from "@/components/ui/magic-card";
import { Marquee } from "@/components/ui/marquee";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Particles } from "@/components/ui/particles";
import { WordRotate } from "@/components/ui/word-rotate";
import { STYLES } from "@/lib/styles";

const BRAND = ["#a78bfa", "#f472b6", "#fb923c", "#a78bfa"];

const STEPS = [
  {
    icon: Link2,
    title: "Pega tu URL",
    body: "Leemos tu landing: nombre, propuesta de valor, titulares y colores de marca.",
  },
  {
    icon: Wand2,
    title: "Elige estilos",
    body: "Motion graphics, Vox, 3D isométrico, cinemático, retro… hasta 4 a la vez.",
  },
  {
    icon: Clapperboard,
    title: "Recibe imágenes y videos",
    body: "Higgsfield genera las imágenes y las anima en clips listos para redes.",
  },
];

const STATS = [
  { value: STYLES.length, label: "estilos visuales" },
  { value: 3, label: "formatos: 16:9, 9:16 y 1:1" },
  { value: 4, label: "estilos por proyecto" },
];

export default function Home() {
  const half = Math.ceil(STYLES.length / 2);

  return (
    <div className="relative overflow-x-clip">
      <PageBackground className="h-[960px]" />
      <Particles className="pointer-events-none absolute inset-x-0 top-0 h-[900px]" quantity={90} ease={70} color="#f5d0fe" />

      <SiteHeader />

      <main className="relative">
        {/* Hero */}
        <section className="mx-auto flex max-w-6xl flex-col items-center px-4 pt-20 pb-16 text-center sm:px-6 sm:pt-28">
          <BlurFade delay={0.05}>
            <div className="group rounded-full border border-white/10 bg-white/5 backdrop-blur transition hover:bg-white/10">
              <AnimatedShinyText className="inline-flex items-center gap-2 px-4 py-1 text-xs transition ease-out hover:duration-300">
                <Sparkles className="size-3.5 text-fuchsia-400" />
                Impulsado por Higgsfield AI
                <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
              </AnimatedShinyText>
            </div>
          </BlurFade>

          <BlurFade delay={0.15}>
            <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight text-balance sm:text-7xl">
              De una URL a <AuroraText colors={BRAND}>videos promo</AuroraText> que detienen el scroll
            </h1>
          </BlurFade>

          <BlurFade delay={0.25} className="mt-4 flex items-center gap-2 text-lg text-muted sm:text-xl">
            <span>en estilo</span>
            <WordRotate
              words={STYLES.map((s) => s.name)}
              className="font-medium whitespace-nowrap text-foreground"
            />
          </BlurFade>

          <BlurFade delay={0.35}>
            <p className="mt-4 max-w-2xl text-lg text-muted text-pretty">
              Pega el link de tu app o producto y genera imágenes y videos listos para redes. Sin
              editor, sin diseñador.
            </p>
          </BlurFade>

          <BlurFade delay={0.45} className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <PrimaryCta label="Crear mi primer video" />
            <a href="#estilos" className="rounded-full px-6 py-3 text-muted transition hover:text-foreground">
              Ver estilos
            </a>
          </BlurFade>

          {/* Input preview */}
          <BlurFade delay={0.55} className="mt-16 w-full max-w-2xl">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-2 text-left shadow-2xl shadow-black/50 backdrop-blur">
              <div className="flex items-center gap-3 rounded-xl bg-white/[0.03] px-4 py-3">
                <Link2 className="size-4 shrink-0 text-muted" />
                <span className="truncate font-mono text-sm text-muted">https://tu-app.com</span>
                <span className="ml-auto shrink-0 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 px-3 py-1.5 text-xs font-medium">
                  Generar
                </span>
              </div>
              <BorderBeam size={120} duration={8} colorFrom="#f472b6" colorTo="#a78bfa" />
              <BorderBeam size={120} duration={8} delay={4} colorFrom="#fb923c" colorTo="#f472b6" />
            </div>
          </BlurFade>
        </section>

        {/* Style marquee */}
        <section className="relative pb-20">
          <Marquee pauseOnHover className="[--duration:45s]">
            {STYLES.slice(0, half).map((s) => (
              <StyleTile key={s.id} style={s} />
            ))}
          </Marquee>
          <Marquee reverse pauseOnHover className="[--duration:45s]">
            {STYLES.slice(half).map((s) => (
              <StyleTile key={s.id} style={s} />
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/5 bg-gradient-to-r from-background" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/5 bg-gradient-to-l from-background" />
        </section>

        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Stats */}
          <section className="grid gap-4 pb-24 sm:grid-cols-3">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <NumberTicker value={s.value} className="text-5xl font-semibold text-white" />
                <p className="mt-1 text-sm text-muted">{s.label}</p>
              </div>
            ))}
          </section>

          {/* How it works */}
          <section className="pb-24">
            <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">Cómo funciona</h2>
            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {STEPS.map((step, i) => (
                <BlurFade key={step.title} inView delay={i * 0.1}>
                  <MagicCard className="h-full rounded-2xl" gradientColor="#2a1838">
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <step.icon className="size-6 text-fuchsia-400" />
                        <span className="font-mono text-xs text-muted">0{i + 1}</span>
                      </div>
                      <h3 className="mt-6 text-lg font-medium">{step.title}</h3>
                      <p className="mt-2 text-sm text-muted">{step.body}</p>
                    </div>
                  </MagicCard>
                </BlurFade>
              ))}
            </div>
          </section>

          {/* Styles */}
          <section id="estilos" className="scroll-mt-24 pb-24">
            <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
              {STYLES.length} estilos visuales
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-muted">
              Cada estilo tiene su propio lenguaje visual y de movimiento, ajustado a tu marca.
            </p>
            <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {STYLES.map((s, i) => (
                <BlurFade key={s.id} inView delay={(i % 4) * 0.08}>
                  <MagicCard className="h-full rounded-2xl" gradientColor="#2a1838">
                    <div className={`m-2 h-24 rounded-xl bg-gradient-to-br ${s.gradient}`} />
                    <div className="px-5 pt-2 pb-5">
                      <p className="font-medium">
                        <span className="mr-2">{s.emoji}</span>
                        {s.name}
                      </p>
                      <p className="mt-1 text-sm text-muted">{s.tagline}</p>
                    </div>
                  </MagicCard>
                </BlurFade>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="pb-24">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-950 via-fuchsia-950 to-orange-950 p-10 text-center sm:p-16">
              <DotPattern
                width={18}
                height={18}
                glow
                className="text-fuchsia-300/40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
              />
              <h2 className="relative text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
                Tu próxima campaña empieza con <AuroraText colors={BRAND}>un link</AuroraText>
              </h2>
              <div className="relative mt-8 flex justify-center">
                <PrimaryCta label="Empezar ahora" />
              </div>
              <BorderBeam size={200} duration={10} colorFrom="#f472b6" colorTo="#fb923c" />
            </div>
          </section>
        </div>
      </main>

      <footer className="border-t border-white/5 py-8 text-center text-sm text-muted">
        © {new Date().getFullYear()} CoolVideo
      </footer>
    </div>
  );
}
