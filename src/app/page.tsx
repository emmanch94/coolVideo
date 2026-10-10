import { Show, SignUpButton } from "@clerk/nextjs";
import { ArrowRight, Link2, Sparkles, Wand2, Clapperboard } from "lucide-react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { STYLES } from "@/lib/styles";

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

function PrimaryCta({ label }: { label: string }) {
  const className =
    "group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-medium text-black shadow-[0_0_40px_-8px_rgba(244,114,182,0.6)] transition hover:scale-[1.02]";
  return (
    <Show
      when="signed-in"
      fallback={
        <SignUpButton>
          <button className={className}>
            {label}
            <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
          </button>
        </SignUpButton>
      }
    >
      <Link href="/dashboard" className={className}>
        {label}
        <ArrowRight className="size-4 transition group-hover:translate-x-0.5" />
      </Link>
    </Show>
  );
}

export default function Home() {
  return (
    <div className="relative overflow-x-clip">
      <div className="bg-grid pointer-events-none absolute inset-x-0 top-0 h-[900px]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-600/30 via-fuchsia-500/20 to-orange-400/20 blur-3xl" />

      <SiteHeader />

      <main className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* Hero */}
        <section className="flex flex-col items-center pt-20 pb-16 text-center sm:pt-28">
          <span className="glass inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs text-muted">
            <Sparkles className="size-3.5 text-fuchsia-400" />
            Impulsado por Higgsfield AI
          </span>
          <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight text-balance sm:text-7xl">
            De una URL a <span className="text-gradient">videos promo</span> que detienen el scroll
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted text-pretty">
            Pega el link de tu app o producto y genera imágenes y videos en estilos motion graphics,
            Vox, 3D, cinemático y más. Sin editor, sin diseñador.
          </p>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <PrimaryCta label="Crear mi primer video" />
            <a href="#estilos" className="rounded-full px-6 py-3 text-muted transition hover:text-foreground">
              Ver estilos
            </a>
          </div>

          {/* Fake input preview */}
          <div className="glass mt-16 w-full max-w-2xl rounded-2xl p-2 text-left shadow-2xl shadow-black/40">
            <div className="flex items-center gap-3 rounded-xl bg-black/40 px-4 py-3">
              <Link2 className="size-4 shrink-0 text-muted" />
              <span className="truncate font-mono text-sm text-muted">https://tu-app.com</span>
              <span className="ml-auto shrink-0 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 px-3 py-1.5 text-xs font-medium">
                Generar
              </span>
            </div>
          </div>
        </section>

        {/* Floating style cards */}
        <section className="relative mx-auto grid max-w-5xl grid-cols-2 gap-4 pb-24 sm:grid-cols-4">
          {STYLES.slice(0, 4).map((s, i) => (
            <div
              key={s.id}
              style={{ ["--r" as string]: `${[-3, 2, -2, 3][i]}deg`, animationDelay: `${i * 0.6}s` }}
              className="animate-float"
            >
              <div className={`relative aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br ${s.gradient} p-[1px]`}>
                <div className="flex h-full flex-col justify-between rounded-2xl bg-black/30 p-4 backdrop-blur-sm">
                  <span className="text-3xl">{s.emoji}</span>
                  <div>
                    <p className="font-semibold">{s.name}</p>
                    <p className="text-xs text-white/70">{s.tagline}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* How it works */}
        <section className="pb-24">
          <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">Cómo funciona</h2>
          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <div key={step.title} className="glass rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <step.icon className="size-6 text-fuchsia-400" />
                  <span className="font-mono text-xs text-muted">0{i + 1}</span>
                </div>
                <h3 className="mt-6 text-lg font-medium">{step.title}</h3>
                <p className="mt-2 text-sm text-muted">{step.body}</p>
              </div>
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
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STYLES.map((s) => (
              <div key={s.id} className="glass group overflow-hidden rounded-2xl">
                <div className={`h-28 bg-gradient-to-br ${s.gradient} opacity-80 transition group-hover:opacity-100`} />
                <div className="p-5">
                  <p className="font-medium">
                    <span className="mr-2">{s.emoji}</span>
                    {s.name}
                  </p>
                  <p className="mt-1 text-sm text-muted">{s.tagline}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="pb-24">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-fuchsia-600 to-orange-500 p-10 text-center sm:p-16">
            <div className="bg-grid absolute inset-0 opacity-40" />
            <h2 className="relative text-3xl font-semibold tracking-tight sm:text-5xl">
              Tu próxima campaña empieza con un link
            </h2>
            <div className="relative mt-8 flex justify-center">
              <PrimaryCta label="Empezar ahora" />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/5 py-8 text-center text-sm text-muted">
        © {new Date().getFullYear()} CoolVideo
      </footer>
    </div>
  );
}
