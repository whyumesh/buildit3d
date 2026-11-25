import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import type { BufferGeometry } from "three";
import { Upload, MessageCircle, Mail, RotateCw, Ruler, AlertTriangle, X, Camera, FileBox, Coins, Paperclip, Check } from "lucide-react";
import { COLOUR_HEX, SHOP, STOCK, waLink } from "../config";
import { BED_MM, estimate, type Geometry } from "../estimate";

const ModelViewer = lazy(() => import("./ModelViewer"));

export type Path = "file" | "photo";

const NOT_SURE = "Not sure";
const PURPOSES = ["Gift", "College project", "Part for a machine or home", "Other"];
const inr = (n: number) => "₹" + n.toLocaleString("en-IN");
const mm = (n: number) => (n >= 100 ? n.toFixed(0) : n.toFixed(1));
const today = new Date().toISOString().slice(0, 10);

function message(head: string, rows: [string, string][], tail: string) {
  return [head, ...rows.filter(([, v]) => v.trim()).map(([k, v]) => `${k}: ${v.trim()}`), tail].join("\n");
}
function niceDate(iso: string) {
  return iso ? new Date(iso + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";
}

export default function Studio({ path, setPath }: { path: Path; setPath: (p: Path) => void }) {
  return (
    <div id="studio" className="scroll-mt-24 overflow-hidden rounded-[28px] border border-line bg-white shadow-[0_40px_90px_-40px_rgba(6,58,94,0.35)]">
      <div className="grid grid-cols-2 border-b border-line text-sm font-semibold" role="tablist">
        {([["file", "I have a 3D file", "3D file", FileBox], ["photo", "I have a photo or idea", "Photo or idea", Camera]] as const).map(([p, label, short, Icon]) => (
          <button
            key={p}
            role="tab"
            aria-selected={path === p}
            onClick={() => setPath(p)}
            className={`relative flex items-center justify-center gap-2 px-3 py-4 transition ${path === p ? "text-brand" : "text-mute hover:text-ink"}`}
          >
            <Icon className="h-4 w-4 shrink-0" /> <span className="hidden sm:inline">{label}</span><span className="sm:hidden">{short}</span>
            <span className={`absolute inset-x-6 bottom-0 h-0.5 rounded-full bg-brand transition ${path === p ? "opacity-100" : "opacity-0"}`} />
          </button>
        ))}
      </div>
      {path === "file" ? <FilePath /> : <PhotoPath />}
    </div>
  );
}

/* ---------------- 3D file path ---------------- */

function FilePath() {
  const [file, setFile] = useState<File | null>(null);
  const [model, setModel] = useState<{ geometry: BufferGeometry; info: Geometry } | null>(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [drag, setDrag] = useState(false);
  const [material, setMaterial] = useState("PLA");
  const [colour, setColour] = useState("White");
  const [qty, setQty] = useState(1);
  const [scale, setScale] = useState(100);
  const [name, setName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [notes, setNotes] = useState("");
  const [sent, setSent] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const pick = async (f: File | undefined) => {
    if (!f) return;
    setErr(""); setSent(false); setModel(null); setScale(100); setFile(f);
    const ext = f.name.toLowerCase().split(".").pop();
    if (ext === "step" || ext === "stp") return; // no browser preview; we check it on our side
    if (ext !== "stl" && ext !== "3mf") { setErr("Please choose an STL, 3MF or STEP file."); setFile(null); return; }
    setLoading(true);
    try {
      const { loadModel } = await import("./ModelViewer");
      setModel(await loadModel(f));
    } catch (e) {
      setErr("We could not open this file in the preview. Send it anyway and we will check it.");
    } finally {
      setLoading(false);
    }
  };

  const colours = material === NOT_SURE ? [] : STOCK[material] ?? [];
  useEffect(() => { if (!colours.includes(colour)) setColour(colours[0] ?? NOT_SURE); }, [material]); // eslint-disable-line

  const s = scale / 100;
  const size = model?.info.size.map((v) => v * s) as [number, number, number] | undefined;
  const tooBig = size && size.some((v) => v > BED_MM);
  const oddUnits = size && Math.max(...size) < 3;
  const est = useMemo(
    () => (model && !tooBig ? estimate(model.info, material === NOT_SURE ? "PLA" : material, qty, s) : null),
    [model, material, qty, s, tooBig],
  );

  const text = message(
    "Hi Buildit3D, I have a 3D file.",
    [
      ["Name", name],
      ["File", file?.name ?? ""],
      ["Size", size ? `${mm(size[0])} x ${mm(size[1])} x ${mm(size[2])} mm${scale !== 100 ? ` (scaled to ${scale}%)` : ""}` : ""],
      ["Material", material],
      ["Colour", colour],
      ["Quantity", String(qty)],
      ["Website estimate", est ? `${inr(est.low)} - ${inr(est.high)}` : ""],
      ["Needed by", niceDate(deadline)],
      ["Notes", notes],
    ],
    "(I will attach the file in this chat.)",
  );

  if (!file) {
    return (
      <div className="p-5 sm:p-7">
        <label
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); pick(e.dataTransfer.files[0]); }}
          className={`group relative flex cursor-pointer flex-col items-center overflow-hidden rounded-3xl border-2 border-dashed px-5 pb-7 pt-2 text-center transition ${
            drag ? "border-brand bg-brand-soft" : "border-brand/30 bg-gradient-to-b from-brand-soft/60 to-white hover:border-brand"
          }`}
        >
          <div className="pointer-events-none flex h-52 w-full items-center justify-center [perspective:700px] sm:h-60">
            <div className="relative h-24 w-24 animate-[spin3d_9s_linear_infinite] [transform-style:preserve-3d] group-hover:[animation-duration:3s]">
              {["rotateY(0deg)", "rotateY(90deg)", "rotateY(180deg)", "rotateY(-90deg)", "rotateX(90deg)", "rotateX(-90deg)"].map((r) => (
                <span key={r} className="absolute inset-0 rounded-md border-2 border-brand/70 bg-brand/5 shadow-[0_0_30px_rgba(19,153,236,0.25)_inset]" style={{ transform: `${r} translateZ(48px)` }} />
              ))}
            </div>
            <Upload className="absolute h-7 w-7 animate-bounce text-brand" />
          </div>
          <span className="btn-brand -mt-4"><Upload className="h-4 w-4" /> Choose your 3D file</span>
          <span className="mt-3 text-sm text-mute">or drag it here · STL, 3MF or STEP</span>
          <span className="mt-1 text-xs text-mute">See it in 3D, its size and a rough price. The file stays on your phone.</span>
          <input ref={input} type="file" accept=".stl,.3mf,.step,.stp" className="sr-only" onChange={(e) => pick(e.target.files?.[0])} />
        </label>
        {err && <p className="mt-3 text-sm text-red-600">{err}</p>}
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-[1.15fr_1fr]">
      {/* Viewer */}
      <div className="lg:border-r lg:border-line">
      <div className="relative h-[340px] border-b border-line bg-gradient-to-b from-brand-soft/70 to-white sm:h-[420px] lg:sticky lg:top-16 lg:h-[calc(100vh-5rem)] lg:max-h-[640px] lg:border-b-0">
        {model ? (
          <Suspense fallback={<Center>Opening 3D view…</Center>}>
            <ModelViewer geometry={model.geometry} color={COLOUR_HEX[colour] ?? "#1399ec"} scale={s} />
          </Suspense>
        ) : loading ? (
          <Center><RotateCw className="h-6 w-6 animate-spin text-brand" /> Reading your file…</Center>
        ) : (
          <Center>
            <FileBox className="h-10 w-10 text-brand" />
            <span className="font-semibold">{file.name}</span>
            <span className="max-w-xs text-sm text-mute">
              {err || "STEP files can't be previewed in the browser. Send it and we will check it and reply with a price."}
            </span>
          </Center>
        )}
        <div className="pointer-events-none absolute left-4 top-4 flex max-w-[75%] items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium shadow-sm backdrop-blur">
          <Check className="h-3.5 w-3.5 text-wa" /> <span className="truncate">{file.name}</span>
        </div>
        <button
          onClick={() => { setFile(null); setModel(null); if (input.current) input.current.value = ""; }}
          className="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-mute shadow-sm hover:text-ink"
          aria-label="Choose another file"
        >
          <X className="h-4 w-4" />
        </button>
        {size && (
          <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-ink/85 px-3 py-1.5 font-medium text-white">
              <Ruler className="h-3.5 w-3.5" /> {mm(size[0])} × {mm(size[1])} × {mm(size[2])} mm
            </span>
            <span className="rounded-full bg-white/90 px-3 py-1.5 text-mute">Drag to turn · pinch to zoom</span>
          </div>
        )}
      </div>
      </div>

      {/* Options + estimate */}
      <div className="p-5 sm:p-7">
        {sent ? (
          <AfterSend what="your file" fileName={file.name} text={text} />
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); window.open(waLink(text), "_blank", "noopener,noreferrer"); setSent(true); }} className="space-y-5">
            {model && (
              <div>
                <div className="flex items-baseline justify-between">
                  <span className="label">Size</span>
                  <span className="text-sm font-semibold text-brand">{scale}%</span>
                </div>
                <input type="range" min={25} max={300} step={5} value={scale} onChange={(e) => setScale(+e.target.value)} className="w-full accent-[#1399ec]" aria-label="Scale" />
                <span className="help">Want it bigger or smaller? Slide to change the size.</span>
              </div>
            )}

            {tooBig && (
              <Warn>Bigger than our printer at this size (max 25.6 cm per side). We can print it in parts, or make it smaller. Ask us on WhatsApp.</Warn>
            )}
            {oddUnits && <Warn>This looks very small (under 3 mm). If the file is in inches or metres, tell us in the notes.</Warn>}

            <div>
              <span className="label">Material</span>
              <Chips options={[...Object.keys(STOCK), NOT_SURE]} value={material} onChange={setMaterial} />
            </div>
            {colours.length > 0 && (
              <div>
                <span className="label">Colour <span className="font-normal text-mute">· {colour}</span></span>
                <div className="flex flex-wrap gap-2">
                  {colours.map((c) => (
                    <button
                      type="button" key={c} onClick={() => setColour(c)} title={c} aria-label={c} aria-pressed={colour === c}
                      className={`h-9 w-9 rounded-full border-2 transition ${colour === c ? "scale-110 border-brand ring-4 ring-brand/20" : "border-line hover:scale-105"}`}
                      style={{ background: COLOUR_HEX[c] }}
                    />
                  ))}
                </div>
                <span className="help">Colours in stock now. Other colours or more than one colour: tell us in the notes.</span>
              </div>
            )}
            <div>
              <span className="label">Quantity</span>
              <div className="inline-flex items-center rounded-full border border-line">
                <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="h-10 w-10 text-lg text-mute hover:text-ink" aria-label="Fewer">−</button>
                <input type="number" min={1} value={qty} onChange={(e) => setQty(Math.max(1, +e.target.value || 1))} className="w-12 bg-transparent text-center font-semibold focus:outline-none" aria-label="Quantity" />
                <button type="button" onClick={() => setQty(qty + 1)} className="h-10 w-10 text-lg text-mute hover:text-ink" aria-label="More">+</button>
              </div>
            </div>

            {est && (
              <div className="rounded-2xl bg-ink p-5 text-white">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">Rough estimate</p>
                <p className="mt-1 font-display text-3xl font-extrabold tracking-tight">
                  {inr(est.low)} <span className="text-white/40">–</span> {inr(est.high)}
                </p>
                <p className="mt-1 text-xs text-white/60">
                  about {est.hours < 1 ? `${Math.round(est.hours * 60)} min` : `${est.hours.toFixed(1)} h`} of printing · {Math.round(est.grams)} g of {material === NOT_SURE ? "PLA" : material}
                </p>
                <p className="mt-3 text-xs leading-relaxed text-white/80">
                  From our own slicer data. Final price on WhatsApp after we check your file: very detailed models, supports, finish or a tight deadline can change it.
                </p>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block"><span className="label">Your name</span>
                <input className="field" required value={name} onChange={(e) => setName(e.target.value)} autoComplete="given-name" />
              </label>
              <label className="block"><span className="label">Needed by</span>
                <input className="field" type="date" min={today} value={deadline} onChange={(e) => setDeadline(e.target.value)} />
              </label>
            </div>
            <label className="block"><span className="label">Notes <span className="font-normal text-mute">(optional)</span></span>
              <textarea className="field" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="How you will use it, anything special" />
            </label>
            <button type="submit" className="btn-wa w-full text-base"><MessageCircle className="h-5 w-5" /> Send on WhatsApp</button>
            <p className="text-center text-xs text-mute">Opens WhatsApp with these details. Nothing is saved on this website.</p>
          </form>
        )}
      </div>
    </div>
  );
}

/* ---------------- photo / idea path ---------------- */

function PhotoPath() {
  const [photos, setPhotos] = useState<{ file: File; url: string }[]>([]);
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [size, setSize] = useState("");
  const [deadline, setDeadline] = useState("");
  const [desc, setDesc] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => () => photos.forEach((p) => URL.revokeObjectURL(p.url)), []); // eslint-disable-line

  const add = (files: FileList | null) => {
    if (!files) return;
    const next = [...files].filter((f) => f.type.startsWith("image/")).slice(0, 8 - photos.length)
      .map((file) => ({ file, url: URL.createObjectURL(file) }));
    setPhotos([...photos, ...next]);
  };

  const text = message(
    "Hi Buildit3D, I have a photo or idea.",
    [
      ["Name", name],
      ["It is for", purpose],
      ["Rough size", size],
      ["Needed by", niceDate(deadline)],
      ["What I want", desc],
      ["Photos", photos.length ? `${photos.length} (sending in this chat)` : ""],
    ],
    "(I will attach photos in this chat.)",
  );

  if (sent) return <div className="p-5 sm:p-7"><AfterSend what="your photos" photos={photos.map((p) => p.file)} text={text} /></div>;

  return (
    <form onSubmit={(e) => { e.preventDefault(); window.open(waLink(text), "_blank", "noopener,noreferrer"); setSent(true); }} className="space-y-5 p-5 sm:p-7">
      <div className="flex gap-3 rounded-2xl bg-brand-soft p-4 text-sm text-brand-ink">
        <Coins className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
        <p><strong>Photo tip:</strong> 3 to 4 photos from different angles. Keep a coin next to it so we can see the size.</p>
      </div>

      <div>
        <span className="label">Your photos</span>
        <div className="grid grid-cols-4 gap-2">
          {photos.map((p, i) => (
            <div key={p.url} className="group relative aspect-square overflow-hidden rounded-xl border border-line">
              <img src={p.url} alt={`Photo ${i + 1}`} className="h-full w-full object-cover" />
              <button type="button" onClick={() => { URL.revokeObjectURL(p.url); setPhotos(photos.filter((x) => x !== p)); }}
                className="absolute right-1 top-1 rounded-full bg-white/90 p-1 text-mute shadow hover:text-ink" aria-label="Remove photo">
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {photos.length < 8 && (
            <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-brand/30 bg-brand-soft/50 text-xs font-medium text-brand transition hover:border-brand">
              <Camera className="h-5 w-5" /> Add
              <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => add(e.target.files)} />
            </label>
          )}
        </div>
        <span className="help">Only shown here so you can check them. You send them in WhatsApp next.</span>
      </div>

      <div>
        <span className="label">What is it for?</span>
        <Chips options={PURPOSES} value={purpose} onChange={setPurpose} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block"><span className="label">Rough size</span>
          <input className="field" placeholder="e.g. about 10 cm tall" value={size} onChange={(e) => setSize(e.target.value)} />
        </label>
        <label className="block"><span className="label">Needed by</span>
          <input className="field" type="date" min={today} value={deadline} onChange={(e) => setDeadline(e.target.value)} />
        </label>
      </div>
      <label className="block"><span className="label">Describe it</span>
        <textarea className="field" rows={3} required value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="In your own words: Marathi, Hindi or English. Colour, a name to add, anything." />
      </label>
      <label className="block"><span className="label">Your name</span>
        <input className="field" required value={name} onChange={(e) => setName(e.target.value)} autoComplete="given-name" />
      </label>
      <button type="submit" className="btn-wa w-full text-base"><MessageCircle className="h-5 w-5" /> Send on WhatsApp</button>
      <p className="text-center text-xs text-mute">No instant price for ideas: we look first, then reply with a price on WhatsApp.</p>
    </form>
  );
}

/* ---------------- shared bits ---------------- */

function AfterSend({ what, text, fileName, photos }: { what: string; text: string; fileName?: string; photos?: File[] }) {
  const canShare = !!photos?.length && typeof navigator !== "undefined" && !!navigator.canShare?.({ files: photos });
  return (
    <div className="space-y-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-wa/10 text-wa"><MessageCircle className="h-6 w-6" /></div>
      <h3 className="font-display text-2xl font-extrabold tracking-tight">One last step</h3>
      <p className="text-ink/80">
        WhatsApp opened with your details. Now attach {what} in that chat and press Send.
        {fileName && <> Tap <Paperclip className="inline h-4 w-4" /> → Document → <strong className="break-all">{fileName}</strong>.</>}
      </p>
      {canShare && (
        <button type="button" onClick={() => navigator.share({ files: photos! }).catch(() => {})} className="btn-brand w-full">
          <Upload className="h-4 w-4" /> Share the {photos!.length} photos to WhatsApp
        </button>
      )}
      <p className="text-sm text-mute">We check it and reply there with the price.</p>
      <div className="flex flex-wrap gap-3 pt-1">
        <a href={waLink(text)} target="_blank" rel="noopener noreferrer" className="btn-ghost"><MessageCircle className="h-4 w-4" /> Open WhatsApp again</a>
        <a href={`mailto:${SHOP.email}?subject=${encodeURIComponent("3D printing enquiry")}&body=${encodeURIComponent(text.replace("in this chat", "to this email"))}`} className="btn-ghost">
          <Mail className="h-4 w-4" /> No WhatsApp? Email
        </a>
      </div>
    </div>
  );
}

function Chips({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button type="button" key={o} onClick={() => onChange(o)} aria-pressed={value === o}
          className={`rounded-full border px-4 py-2 text-sm transition ${value === o ? "border-brand bg-brand text-white" : "border-line text-ink hover:border-ink/30"}`}>
          {o}
        </button>
      ))}
    </div>
  );
}

function Warn({ children }: { children: React.ReactNode }) {
  return <div className="flex gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-900"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />{children}</div>;
}

function Center({ children }: { children: React.ReactNode }) {
  return <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">{children}</div>;
}
