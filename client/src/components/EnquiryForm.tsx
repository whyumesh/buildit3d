import { useMemo, useState } from "react";
import { MessageCircle, Paperclip, Coins, Mail } from "lucide-react";
import { SHOP, STOCK, waLink } from "../config";

export type Path = "file" | "photo";

type FileForm = { name: string; material: string; colour: string; quantity: string; deadline: string; notes: string };
type PhotoForm = { name: string; purpose: string; size: string; deadline: string; description: string };

const PURPOSES = ["Gift", "College project", "Part for a machine or home", "Other"];
const NOT_SURE = "Not sure";
const MULTI = "More than one colour (tell us in notes)";

/** Build the WhatsApp text. Empty answers are left out. No phone numbers go in the message. */
function message(head: string, rows: [string, string][], tail: string) {
  const lines = rows.filter(([, v]) => v.trim()).map(([k, v]) => `${k}: ${v.trim()}`);
  return [head, ...lines, tail].join("\n");
}

function formatDate(iso: string) {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function EnquiryForm({ path, onSwitch }: { path: Path; onSwitch: (p: Path) => void }) {
  const [file, setFile] = useState<FileForm>({ name: "", material: "PLA", colour: "", quantity: "1", deadline: "", notes: "" });
  const [photo, setPhoto] = useState<PhotoForm>({ name: "", purpose: "", size: "", deadline: "", description: "" });
  const [sent, setSent] = useState(false);

  const colours = useMemo(
    () => (file.material === NOT_SURE ? [] : STOCK[file.material] ?? []),
    [file.material],
  );

  const text =
    path === "file"
      ? message(
          "Hi Buildit3D, I have a 3D file.",
          [
            ["Name", file.name],
            ["Material", file.material],
            ["Colour", file.colour],
            ["Quantity", file.quantity],
            ["Needed by", formatDate(file.deadline)],
            ["Notes", file.notes],
          ],
          "(I will attach the file in this chat.)",
        )
      : message(
          "Hi Buildit3D, I have a photo or idea.",
          [
            ["Name", photo.name],
            ["It is for", photo.purpose],
            ["Rough size", photo.size],
            ["Needed by", formatDate(photo.deadline)],
            ["What I want", photo.description],
          ],
          "(I will attach photos in this chat.)",
        );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    window.open(waLink(text), "_blank", "noopener,noreferrer");
    setSent(true);
  };

  const today = new Date().toISOString().slice(0, 10);

  return (
    <section id="enquiry" className="scroll-mt-20 bg-white">
      <div className="section max-w-2xl pt-4">
        <div className="mb-6 flex gap-2 rounded-xl bg-slate-100 p-1 text-sm font-semibold" role="tablist">
          {(["file", "photo"] as Path[]).map((p) => (
            <button
              key={p}
              type="button"
              role="tab"
              aria-selected={path === p}
              onClick={() => { onSwitch(p); setSent(false); }}
              className={`flex-1 rounded-lg px-3 py-2 ${path === p ? "bg-white shadow text-brand" : "text-slate-600"}`}
            >
              {p === "file" ? "I have a 3D file" : "I have a photo or idea"}
            </button>
          ))}
        </div>

        <h2 className="h2">{path === "file" ? "Tell us about your file" : "Tell us what you want"}</h2>

        {sent ? (
          <AfterSend path={path} text={text} />
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-5">
            {path === "file" ? (
              <>
                <Note icon={<Paperclip className="h-5 w-5" />}>
                  We can open STL, 3MF and STEP files. You will attach the file in WhatsApp in the next step.
                </Note>
                <Field label="Your name" help="So we know who to reply to.">
                  <input className="field" required value={file.name} onChange={(e) => setFile({ ...file, name: e.target.value })} autoComplete="given-name" />
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Material" help={'Not sure? Choose "Not sure" and we will suggest one.'}>
                    <select className="field" value={file.material} onChange={(e) => setFile({ ...file, material: e.target.value, colour: "" })}>
                      {[...Object.keys(STOCK), NOT_SURE].map((m) => <option key={m}>{m}</option>)}
                    </select>
                  </Field>
                  <Field label="Colour" help="Colours we have right now. Other colours: ask us.">
                    <select className="field" value={file.colour} onChange={(e) => setFile({ ...file, colour: e.target.value })}>
                      <option value="">Choose…</option>
                      {colours.map((c) => <option key={c}>{c}</option>)}
                      <option>{MULTI}</option>
                      <option>{NOT_SURE}</option>
                    </select>
                  </Field>
                  <Field label="Quantity" help="How many pieces?">
                    <input className="field" type="number" min={1} inputMode="numeric" value={file.quantity} onChange={(e) => setFile({ ...file, quantity: e.target.value })} />
                  </Field>
                  <Field label="Needed by" help="When do you need it? A date is fine.">
                    <input className="field" type="date" min={today} value={file.deadline} onChange={(e) => setFile({ ...file, deadline: e.target.value })} />
                  </Field>
                </div>
                <Field label="Notes (optional)" help="Size, how you will use it, anything special.">
                  <textarea className="field" rows={3} value={file.notes} onChange={(e) => setFile({ ...file, notes: e.target.value })} />
                </Field>
              </>
            ) : (
              <>
                <Note icon={<Coins className="h-5 w-5" />}>
                  <strong>Photo tip:</strong> send 3 to 4 photos from different angles. Keep a coin next to the item so we can see the size.
                </Note>
                <Field label="Your name" help="So we know who to reply to.">
                  <input className="field" required value={photo.name} onChange={(e) => setPhoto({ ...photo, name: e.target.value })} autoComplete="given-name" />
                </Field>
                <Field label="What is it for?" group>
                  <div className="grid grid-cols-2 gap-2">
                    {PURPOSES.map((p) => (
                      <label key={p} className={`cursor-pointer rounded-lg border px-3 py-2.5 text-sm ${photo.purpose === p ? "border-brand bg-brand-soft font-semibold text-brand" : "border-slate-300"}`}>
                        <input type="radio" name="purpose" value={p} checked={photo.purpose === p} onChange={() => setPhoto({ ...photo, purpose: p })} className="sr-only" />
                        {p}
                      </label>
                    ))}
                  </div>
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Rough size" help="Height or length in cm is fine. A guess is okay.">
                    <input className="field" placeholder="e.g. about 10 cm tall" value={photo.size} onChange={(e) => setPhoto({ ...photo, size: e.target.value })} />
                  </Field>
                  <Field label="Needed by" help="When do you need it? A date is fine.">
                    <input className="field" type="date" min={today} value={photo.deadline} onChange={(e) => setPhoto({ ...photo, deadline: e.target.value })} />
                  </Field>
                </div>
                <Field label="Describe it" help="Tell us in your own words. Hindi, Marathi or English is fine. Colour, text or a name to add, anything you like.">
                  <textarea className="field" rows={4} required value={photo.description} onChange={(e) => setPhoto({ ...photo, description: e.target.value })} />
                </Field>
              </>
            )}

            <button type="submit" className="btn-wa w-full text-lg">
              <MessageCircle className="h-5 w-5" /> Send on WhatsApp
            </button>
            <p className="text-center text-xs text-slate-500">
              Opens WhatsApp with your answers. Nothing is saved on this website. We reply with a price; no instant quotes.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

function AfterSend({ path, text }: { path: Path; text: string }) {
  const what = path === "file" ? "your file" : "your photos";
  return (
    <div className="mt-6 space-y-4 rounded-2xl border-2 border-wa/40 bg-green-50 p-6">
      <p className="text-lg font-semibold">
        WhatsApp is opening with your details. Please attach {what} in that chat and press Send.
      </p>
      <p className="text-slate-700">We will check it and reply there with a price.</p>
      <p lang="mr" className="text-slate-700">WhatsApp उघडत आहे. त्या चॅटमध्ये तुमची फाईल किंवा फोटो जोडा आणि Send दाबा. आम्ही तपासून तिथेच किंमत कळवू.</p>
      <p lang="hi" className="text-slate-700">WhatsApp खुल रहा है। उस चैट में अपनी फाइल या फोटो जोड़ें और Send दबाएं। हम देखकर वहीं कीमत बताएंगे।</p>
      <div className="flex flex-wrap gap-3 pt-2">
        <a href={waLink(text)} target="_blank" rel="noopener noreferrer" className="btn-wa">
          <MessageCircle className="h-5 w-5" /> Open WhatsApp again
        </a>
        <a
          href={`mailto:${SHOP.email}?subject=${encodeURIComponent("3D printing enquiry")}&body=${encodeURIComponent(text.replace("in this chat", "to this email"))}`}
          className="btn-ghost"
        >
          <Mail className="h-5 w-5" /> No WhatsApp? Email us
        </a>
      </div>
    </div>
  );
}

function Field({ label, help, group, children }: { label: string; help?: string; group?: boolean; children: React.ReactNode }) {
  const inner = (
    <>
      <span className="label">{label}</span>
      {children}
      {help && <span className="help">{help}</span>}
    </>
  );
  // A real <label> ties the text to its input (tap the label, focus the field). Radio groups use a fieldset.
  return group ? <fieldset>{inner}</fieldset> : <label className="block">{inner}</label>;
}

function Note({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
      <span className="mt-0.5 shrink-0">{icon}</span>
      <p>{children}</p>
    </div>
  );
}
