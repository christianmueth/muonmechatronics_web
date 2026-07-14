"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type ProductionPlan = {
  title: string;
  format: string;
  audience: string;
  objective: string;
  hook: string;
  runtimeTarget: string;
  visualStyle: string;
  deliveryNotes: string;
  scenes: Array<{
    sceneTitle: string;
    objective: string;
    narrationBeat: string;
    visualPlan: string;
    editCue: string;
  }>;
  productionChecklist: string[];
  repurposingAssets: string[];
  exportMarkdown: string;
};

const formatOptions = [
  "YouTube explainer",
  "Short-form reel",
  "Customer story",
  "Course lesson",
  "Product launch video",
  "Interview cutdown",
];

async function safeJson(response: Response) {
  try {
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

export default function VideoProductionStudio() {
  const [projectTitle, setProjectTitle] = useState("");
  const [format, setFormat] = useState(formatOptions[0]);
  const [audience, setAudience] = useState("");
  const [productionGoal, setProductionGoal] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [sourceText, setSourceText] = useState("");
  const [transcriptLoading, setTranscriptLoading] = useState(false);
  const [planLoading, setPlanLoading] = useState(false);
  const [exportingPptx, setExportingPptx] = useState(false);
  const [plan, setPlan] = useState<ProductionPlan | null>(null);

  const canGenerate = sourceText.trim().length > 0;
  const sceneCount = useMemo(() => plan?.scenes.length ?? 0, [plan]);

  async function fetchTranscript() {
    if (!youtubeUrl.trim() || transcriptLoading) return;

    setTranscriptLoading(true);
    try {
      const response = await fetch("/api/youtube-transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ youtubeUrl: youtubeUrl.trim() }),
      });

      const data = await safeJson(response);
      if (!response.ok || !data?.transcript) {
        throw new Error(data?.error || "Transcript fetch failed.");
      }

      setSourceText(String(data.transcript).trim());
      toast.success("Transcript loaded into the production brief.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Transcript fetch failed.");
    } finally {
      setTranscriptLoading(false);
    }
  }

  async function generatePlan() {
    if (!canGenerate || planLoading) return;

    setPlanLoading(true);
    try {
      const response = await fetch("/api/video/production-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectTitle,
          format,
          audience,
          productionGoal,
          sourceText,
        }),
      });

      const data = await safeJson(response);
      if (!response.ok || !data?.ok || !data?.plan) {
        throw new Error(data?.error || "Production planning is unavailable right now.");
      }

      setPlan(data.plan as ProductionPlan);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Production planning is unavailable right now.");
    } finally {
      setPlanLoading(false);
    }
  }

  function downloadMarkdown() {
    if (!plan) return;
    const blob = new Blob([plan.exportMarkdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${slugify(plan.title || projectTitle || "video-production-plan")}.md`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function exportPptx() {
    if (!plan || exportingPptx) return;

    setExportingPptx(true);
    try {
      const response = await fetch("/api/workspace/presentation-export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: {
            title: plan.title,
            audience: plan.audience,
            objective: plan.objective,
            outline: plan.scenes.map((scene) => ({
              slideTitle: scene.sceneTitle,
              purpose: scene.objective,
              bullets: [scene.narrationBeat, scene.visualPlan],
              speakerGuidance: plan.deliveryNotes,
              suggestedVisual: scene.editCue,
            })),
            presenterChecklist: plan.productionChecklist,
          },
        }),
      });

      if (!response.ok) {
        const data = await safeJson(response);
        throw new Error(data?.error || "PPTX export is unavailable right now.");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${slugify(plan.title || projectTitle || "video-production-plan")}.pptx`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "PPTX export is unavailable right now.");
    } finally {
      setExportingPptx(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 md:px-6 md:py-10">
      <section className="overflow-hidden rounded-[2rem] border border-cyan-200 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.22),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(251,191,36,0.16),_transparent_26%),linear-gradient(135deg,_#04131d_0%,_#0f2532_45%,_#f8fafc_150%)] p-7 text-white shadow-[0_24px_90px_rgba(8,47,73,0.26)] md:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="space-y-5">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">SmartMove Studio</p>
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white md:text-5xl">AI planning for scripts, scenes, transcripts, and edit-ready production flow.</h1>
            <p className="max-w-3xl text-sm leading-7 text-slate-200 md:text-base">
              Turn a YouTube transcript, rough brief, or source notes into a production plan with a hook, scene sequence, narration beats, visual direction, and handoff assets.
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-slate-100">
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5">Transcript ingestion</span>
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5">Scene-by-scene structure</span>
              <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5">PPTX and markdown export</span>
            </div>
          </div>

          <div className="grid gap-3 rounded-[1.75rem] border border-white/15 bg-white/10 p-5 backdrop-blur">
            <div className="overflow-hidden rounded-[1.5rem] border border-white/20 bg-white/90 p-3 shadow-[0_20px_60px_rgba(15,23,42,0.24)]">
              <Image src="/smartmove-e_logo.png" alt="SmartMove-e video production logo" width={900} height={900} className="h-auto w-full rounded-[1.1rem] object-contain" priority />
            </div>
            <div className="rounded-2xl border border-cyan-200/30 bg-slate-950/30 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">What it builds</p>
              <p className="mt-2 text-sm leading-6 text-slate-100">Hooks, narrative beats, visual treatment, editor cues, repurposing assets, and a concrete production checklist.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Source intake</p>
            <div className="mt-4 space-y-4">
              <label className="block text-sm font-medium text-slate-800">
                Project title
                <input value={projectTitle} onChange={(event) => setProjectTitle(event.target.value)} placeholder="For example: Q3 launch explainer" className="mt-2 w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-950" />
              </label>

              <label className="block text-sm font-medium text-slate-800">
                Format
                <select value={format} onChange={(event) => setFormat(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-950">
                  {formatOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>

              <label className="block text-sm font-medium text-slate-800">
                Audience
                <input value={audience} onChange={(event) => setAudience(event.target.value)} placeholder="For example: B2B buyers evaluating automation tools" className="mt-2 w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-950" />
              </label>

              <label className="block text-sm font-medium text-slate-800">
                Production goal
                <textarea value={productionGoal} onChange={(event) => setProductionGoal(event.target.value)} placeholder="What should viewers understand, feel, or do after watching?" className="mt-2 min-h-[96px] w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-950" />
              </label>

              <div className="rounded-3xl border border-cyan-200 bg-cyan-50 p-4">
                <label className="block text-sm font-medium text-slate-800">
                  YouTube URL
                  <input value={youtubeUrl} onChange={(event) => setYoutubeUrl(event.target.value)} placeholder="Paste a public YouTube URL to import its transcript" className="mt-2 w-full rounded-2xl border border-cyan-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-cyan-700" />
                </label>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="text-xs leading-5 text-slate-600">If transcript retrieval is configured, the imported transcript will replace the source material below.</p>
                  <button type="button" onClick={() => void fetchTranscript()} disabled={!youtubeUrl.trim() || transcriptLoading} className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
                    {transcriptLoading ? "Importing..." : "Import transcript"}
                  </button>
                </div>
              </div>

              <label className="block text-sm font-medium text-slate-800">
                Source material
                <textarea value={sourceText} onChange={(event) => setSourceText(event.target.value)} placeholder="Paste a transcript, script draft, interview notes, webinar summary, or production brief." className="mt-2 min-h-[260px] w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-950" />
              </label>

              <div className="flex items-center justify-between gap-3">
                <p className="text-xs leading-5 text-slate-500">The planner proposes structure and editor-facing outputs without pretending to replace human production decisions.</p>
                <button type="button" onClick={() => void generatePlan()} disabled={!canGenerate || planLoading} className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white disabled:opacity-60">
                  {planLoading ? "Planning..." : "Generate production plan"}
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Narrative hook",
                body: "Lead with why the viewer should care before outlining the rest of the sequence.",
              },
              {
                title: "Visual strategy",
                body: "Map each scene to b-roll, overlays, camera treatment, or graphics so editing is concrete.",
              },
              {
                title: "Repurposing",
                body: "Break long-form material into reusable cuts, social assets, and thumbnail or caption hooks.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-slate-950">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[1.75rem] border border-amber-200 bg-amber-50 p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-800">Production output</p>
                <p className="mt-2 text-sm text-slate-700">{plan ? `${sceneCount} scenes drafted` : "No production plan yet"}</p>
              </div>
              {plan ? (
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={downloadMarkdown} className="rounded-full border border-amber-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-amber-100">
                    Export markdown
                  </button>
                  <button type="button" onClick={() => void exportPptx()} disabled={exportingPptx} className="rounded-full border border-amber-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-amber-100 disabled:opacity-60">
                    {exportingPptx ? "Exporting PPTX..." : "Export PPTX"}
                  </button>
                </div>
              ) : null}
            </div>
          </div>

          {plan ? (
            <>
              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="grid gap-4 md:grid-cols-2">
                  <InfoBlock label="Hook" value={plan.hook} />
                  <InfoBlock label="Runtime target" value={plan.runtimeTarget} />
                  <InfoBlock label="Visual style" value={plan.visualStyle} />
                  <InfoBlock label="Delivery notes" value={plan.deliveryNotes} />
                </div>
              </div>

              <div className="space-y-4">
                {plan.scenes.map((scene, index) => (
                  <article key={`${scene.sceneTitle}-${index}`} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Scene {index + 1}</p>
                    <h2 className="mt-2 text-xl font-semibold text-slate-950">{scene.sceneTitle}</h2>
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <InfoBlock label="Objective" value={scene.objective} />
                      <InfoBlock label="Narration beat" value={scene.narrationBeat} />
                      <InfoBlock label="Visual plan" value={scene.visualPlan} />
                      <InfoBlock label="Edit cue" value={scene.editCue} />
                    </div>
                  </article>
                ))}
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <ListCard title="Production checklist" items={plan.productionChecklist} tone="sky" />
                <ListCard title="Repurposing assets" items={plan.repurposingAssets} tone="rose" />
              </div>
            </>
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm leading-7 text-slate-600 shadow-sm">
              Paste a transcript or brief, then generate a plan to see scene structure, visual direction, editor cues, and exportable assets.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm leading-6 text-slate-700">{value}</p>
    </div>
  );
}

function ListCard({ title, items, tone }: { title: string; items: string[]; tone: "sky" | "rose" }) {
  const toneClass = tone === "sky"
    ? "border-sky-200 bg-sky-50 text-sky-800"
    : "border-rose-200 bg-rose-50 text-rose-800";

  return (
    <div className={`rounded-3xl border p-5 shadow-sm ${toneClass}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.16em]">{title}</p>
      <div className="mt-4 space-y-2">
        {items.map((item) => (
          <div key={item} className="rounded-2xl border border-white/70 bg-white/80 px-3 py-3 text-sm leading-6 text-slate-700">{item}</div>
        ))}
      </div>
    </div>
  );
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "video-production-plan";
}