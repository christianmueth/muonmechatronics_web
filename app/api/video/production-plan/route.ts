import { NextResponse } from "next/server";
import { chatV1 } from "@/lib/aiGateway";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PRODUCTION_PLAN_TIMEOUT_MS = 12_000;

type ProductionPlanRequest = {
  projectTitle?: string;
  format?: string;
  audience?: string;
  productionGoal?: string;
  sourceText?: string;
};

const productionPlanSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "format", "audience", "objective", "hook", "runtimeTarget", "visualStyle", "deliveryNotes", "scenes", "productionChecklist", "repurposingAssets"],
  properties: {
    title: { type: "string" },
    format: { type: "string" },
    audience: { type: "string" },
    objective: { type: "string" },
    hook: { type: "string" },
    runtimeTarget: { type: "string" },
    visualStyle: { type: "string" },
    deliveryNotes: { type: "string" },
    scenes: {
      type: "array",
      minItems: 4,
      maxItems: 7,
      items: {
        type: "object",
        additionalProperties: false,
        required: ["sceneTitle", "objective", "narrationBeat", "visualPlan", "editCue"],
        properties: {
          sceneTitle: { type: "string" },
          objective: { type: "string" },
          narrationBeat: { type: "string" },
          visualPlan: { type: "string" },
          editCue: { type: "string" },
        },
      },
    },
    productionChecklist: { type: "array", items: { type: "string" }, minItems: 4, maxItems: 8 },
    repurposingAssets: { type: "array", items: { type: "string" }, minItems: 3, maxItems: 6 },
  },
} as const;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ProductionPlanRequest;
    const sourceText = clean(body.sourceText).slice(0, 12000);
    if (!sourceText) {
      return NextResponse.json({ ok: false, error: "Source material is required." }, { status: 400 });
    }

    let plan: Record<string, unknown>;

    try {
      const response = await Promise.race([
        chatV1({
          allowUnauthenticated: true,
          disableOpenAICompat: true,
          temperature: 0.4,
          max_output_tokens: 1100,
          structured_output: { type: "json_schema", name: "video_production_plan", schema: productionPlanSchema },
          messages: [
            {
              role: "system",
              content: [
                "You build AI-assisted video production plans for a human production team.",
                "Produce a concise but concrete plan that can move from source material into scripting, shooting, and editing.",
                "Make each scene practical for editors and producers, not generic.",
                "Do not invent facts that conflict with the source material.",
              ].join(" "),
            },
            {
              role: "user",
              content: [
                `Project title: ${clean(body.projectTitle) || "Untitled video"}`,
                `Format: ${clean(body.format) || "YouTube explainer"}`,
                `Audience: ${clean(body.audience) || "General audience"}`,
                `Production goal: ${clean(body.productionGoal) || "Explain the idea clearly and make the next action obvious."}`,
                "Source material:",
                sourceText,
              ].join("\n\n"),
            },
          ],
        }),
        createPlannerTimeout(),
      ]);

      plan = response.output_json && typeof response.output_json === "object"
        ? response.output_json as Record<string, unknown>
        : buildFallbackPlan(body, sourceText, response.output_text);
    } catch {
      plan = buildFallbackPlan(body, sourceText, "");
    }

    return NextResponse.json({
      ok: true,
      plan: {
        ...plan,
        exportMarkdown: buildMarkdown(plan),
      },
    });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error?.message || "Production planning failed." }, { status: 500 });
  }
}

function clean(value: unknown) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function createPlannerTimeout() {
  return new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error("Production planner timed out before model output was ready.")), PRODUCTION_PLAN_TIMEOUT_MS);
  });
}

function buildFallbackPlan(body: ProductionPlanRequest, sourceText: string, modelText: string) {
  const sourceSentences = splitSentences(sourceText || modelText);
  const keyPoints = sourceSentences.slice(0, 10);
  const title = clean(body.projectTitle) || inferTitle(sourceSentences[0]) || "AI video production plan";
  const format = clean(body.format) || "YouTube explainer";
  const audience = clean(body.audience) || "General audience";
  const objective = clean(body.productionGoal) || "Help the audience understand the main idea and the next step.";
  const hook = keyPoints[0] || `Open with the clearest audience pain point for ${audience.toLowerCase()}.`;
  const runtimeTarget = inferRuntime(format);
  const visualStyle = inferVisualStyle(format);
  const deliveryNotes = "Keep the delivery direct, cut filler, and let each scene earn the next transition.";

  const scenes = [
    {
      sceneTitle: "Open with the problem",
      objective: "Create immediate relevance and establish why the topic matters now.",
      narrationBeat: keyPoints[0] || "Lead with a concrete viewer problem or tension.",
      visualPlan: "Use a punchy opening visual, title card, or strong first-frame b-roll tied to the viewer pain point.",
      editCue: "Start tight, cut quickly, and place the strongest phrase in the first five seconds.",
    },
    {
      sceneTitle: "Frame the promise",
      objective: "Tell the viewer what they will get from staying with the video.",
      narrationBeat: keyPoints[1] || `State the payoff and connect it to the goal: ${objective}`,
      visualPlan: "Use on-screen text or a simple graphic that states the transformation or takeaway.",
      editCue: "Add a clean text overlay with the key promise and keep the pacing controlled.",
    },
    {
      sceneTitle: "Walk through the core sequence",
      objective: "Break the main idea into a usable sequence the team can shoot and edit around.",
      narrationBeat: summarize(keyPoints.slice(2, 5)) || "Explain the main process in sequence with one idea per beat.",
      visualPlan: "Alternate between primary footage, supporting b-roll, and simple overlays that reinforce the sequence.",
      editCue: "Use match cuts or chapter markers so the progression feels intentional.",
    },
    {
      sceneTitle: "Show proof or application",
      objective: "Make the content credible by showing an example, result, or applied scenario.",
      narrationBeat: summarize(keyPoints.slice(5, 7)) || "Demonstrate the idea through a specific example or observed result.",
      visualPlan: "Use screenshots, demo footage, case evidence, or annotated examples instead of abstract claims.",
      editCue: "Slow down slightly, hold key frames longer, and let the proof section breathe.",
    },
    {
      sceneTitle: "Close with next action",
      objective: "Land the takeaway and give the viewer a clear final action or reflection.",
      narrationBeat: keyPoints[7] || `Restate the core promise and ask for the next action tied to ${objective.toLowerCase()}`,
      visualPlan: "Return to the presenter, a branded end card, or a recap graphic with one CTA.",
      editCue: "Tighten the final recap and leave a deliberate pause before the end card or CTA.",
    },
  ];

  return {
    title,
    format,
    audience,
    objective,
    hook,
    runtimeTarget,
    visualStyle,
    deliveryNotes,
    scenes,
    productionChecklist: [
      "Confirm the hook is visible and understandable in the opening seconds.",
      "Gather b-roll or overlays for every scene before editing starts.",
      "Trim narration so each beat carries only one main point.",
      "Check that the final CTA matches the production goal and audience.",
    ],
    repurposingAssets: [
      "15-second hook cut for social distribution.",
      "One quote card or text-slide recap for LinkedIn or email.",
      "Thumbnail and headline options derived from the opening hook.",
    ],
  };
}

function splitSentences(text: string) {
  return String(text || "")
    .split(/(?<=[.!?])\s+/)
    .map((part) => clean(part))
    .filter(Boolean);
}

function inferTitle(firstSentence: string) {
  const line = clean(firstSentence);
  if (!line) return "";
  return line.length > 72 ? `${line.slice(0, 69)}...` : line;
}

function inferRuntime(format: string) {
  const lower = format.toLowerCase();
  if (lower.includes("short") || lower.includes("reel")) return "30-60 seconds";
  if (lower.includes("interview")) return "2-4 minutes";
  if (lower.includes("course") || lower.includes("lesson")) return "4-7 minutes";
  return "90 seconds to 3 minutes";
}

function inferVisualStyle(format: string) {
  const lower = format.toLowerCase();
  if (lower.includes("launch")) return "Confident product visuals, clean overlays, and stronger motion beats.";
  if (lower.includes("lesson") || lower.includes("course")) return "Clear instructional framing with diagrams, highlighted keywords, and paced transitions.";
  if (lower.includes("interview")) return "Conversational framing with selective b-roll, lower thirds, and reaction-driven cutaways.";
  return "Clean explainer style with presenter-led framing, purposeful b-roll, and concise kinetic text.";
}

function summarize(items: string[]) {
  const text = items.map((item) => clean(item)).filter(Boolean).join(" ");
  if (!text) return "";
  return text.length > 220 ? `${text.slice(0, 217)}...` : text;
}

function buildMarkdown(plan: Record<string, unknown>) {
  const lines = [
    `# ${String(plan.title || "AI video production plan")}`,
    "",
    `Format: ${String(plan.format || "")}`,
    `Audience: ${String(plan.audience || "")}`,
    `Objective: ${String(plan.objective || "")}`,
    `Hook: ${String(plan.hook || "")}`,
    `Runtime target: ${String(plan.runtimeTarget || "")}`,
    `Visual style: ${String(plan.visualStyle || "")}`,
    `Delivery notes: ${String(plan.deliveryNotes || "")}`,
    "",
    "## Scenes",
  ];

  const scenes = Array.isArray(plan.scenes) ? plan.scenes as Array<Record<string, unknown>> : [];
  scenes.forEach((scene, index) => {
    lines.push(`### Scene ${index + 1}: ${String(scene.sceneTitle || "")}`);
    lines.push(`Objective: ${String(scene.objective || "")}`);
    lines.push(`Narration beat: ${String(scene.narrationBeat || "")}`);
    lines.push(`Visual plan: ${String(scene.visualPlan || "")}`);
    lines.push(`Edit cue: ${String(scene.editCue || "")}`);
    lines.push("");
  });

  lines.push("## Production checklist");
  const checklist = Array.isArray(plan.productionChecklist) ? plan.productionChecklist as string[] : [];
  checklist.forEach((item) => lines.push(`- ${String(item)}`));
  lines.push("");
  lines.push("## Repurposing assets");
  const repurposingAssets = Array.isArray(plan.repurposingAssets) ? plan.repurposingAssets as string[] : [];
  repurposingAssets.forEach((item) => lines.push(`- ${String(item)}`));
  lines.push("");
  return lines.join("\n");
}