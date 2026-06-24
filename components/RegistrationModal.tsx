"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, Loader2 } from "lucide-react";
import { OPEN_THEME_TITLE } from "@/app/constants";
import type { RegistrationAvailability } from "@/lib/types/site";

interface Props {
  open: boolean;
  onClose: () => void;
  registrationThemes: string[];
  registration: RegistrationAvailability;
}

const emptyMember = { name: "", email: "" };

export default function RegistrationModal({
  open,
  onClose,
  registrationThemes,
  registration,
}: Props) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    teamName: "",
    college: "",
    theme: OPEN_THEME_TITLE,
    videoUrl: "",
    teamSize: 1,
    members: [{ ...emptyMember }],
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setSuccess(false);
      setError("");
      setForm({
        name: "",
        email: "",
        phone: "",
        teamName: "",
        college: "",
        theme: OPEN_THEME_TITLE,
        videoUrl: "",
        teamSize: 1,
        members: [{ ...emptyMember }],
      });
    }, 300);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-[#1a1a1a] border border-white/10 rounded-2xl p-6 relative"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-[#A3A3A3] hover:text-white"
              type="button"
              aria-label="Close registration form"
            >
              <X size={20} />
            </button>

            {success ? (
              <div className="flex flex-col items-center py-8 text-center gap-4">
                <CheckCircle size={56} className="text-yellow-400" />
                <h3 className="text-xl font-bold text-white">
                  You&apos;re Registered!
                </h3>
                <p className="text-[#A3A3A3] text-sm">
                  We&apos;ll send event details to your email shortly.
                </p>
                <button
                  onClick={handleClose}
                  type="button"
                  className="mt-2 px-6 py-2 bg-yellow-400 text-black font-bold rounded-full text-sm hover:bg-yellow-300 transition-all"
                >
                  Close
                </button>
              </div>
            ) : !registration.open ? (
              <div className="py-8 text-center">
                <h2 className="text-xl font-bold text-white mb-3">
                  Registration Closed
                </h2>
                <p className="text-[#A3A3A3] text-sm">
                  {registration.reason ??
                    "Registration is not open at the moment."}
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-white">
                    Register for{" "}
                    <span className="text-yellow-400">Lecathon 2.0</span>
                  </h2>
                  <p className="text-[#A3A3A3] text-sm mt-1">
                    Fill in your details to secure your spot.
                    {registration.spotsLeft !== undefined &&
                    registration.spotsLeft > 0 ? (
                      <span className="block text-yellow-400/80 mt-1">
                        {registration.spotsLeft} spot
                        {registration.spotsLeft === 1 ? "" : "s"} remaining
                      </span>
                    ) : null}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {[
                    {
                      key: "name",
                      label: "Team Leader Name",
                      type: "text",
                      required: true,
                    },
                    {
                      key: "email",
                      label: "Team Leader Email",
                      type: "email",
                      required: true,
                    },
                    {
                      key: "phone",
                      label: "Phone Number",
                      type: "tel",
                      required: true,
                    },
                    {
                      key: "teamName",
                      label: "Team Name",
                      type: "text",
                      required: true,
                    },
                    {
                      key: "college",
                      label: "College / Institution",
                      type: "text",
                      required: true,
                    },
                  ].map(({ key, label, type, required }) => (
                    <div key={key}>
                      <label className="text-xs text-[#A3A3A3] mb-1 block">
                        {label}
                        {required && " *"}
                      </label>
                      <input
                        type={type}
                        required={required}
                        value={form[key as keyof typeof form] as string}
                        onChange={(e) =>
                          setForm({ ...form, [key]: e.target.value })
                        }
                        className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-400/50 transition-colors"
                        placeholder={label}
                      />
                    </div>
                  ))}

                  <div>
                    <label className="text-xs text-[#A3A3A3] mb-1 block">
                      Number of Team Members
                    </label>
                    <select
                      value={form.teamSize}
                      onChange={(e) => {
                        const size = Number(e.target.value);
                        setForm({
                          ...form,
                          teamSize: size,
                          members: Array.from(
                            { length: size },
                            (_, i) => form.members[i] ?? { ...emptyMember }
                          ),
                        });
                      }}
                      className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-400/50 transition-colors"
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                    </select>
                  </div>

                  {form.members.map((member, index) => (
                    <div
                      key={index}
                      className="border border-white/10 rounded-xl p-4"
                    >
                      <h4 className="text-yellow-400 font-semibold mb-3">
                        Member {index + 1}
                      </h4>
                      <div className="flex flex-col gap-3">
                        <input
                          type="text"
                          required
                          placeholder="Member Name"
                          value={member.name}
                          onChange={(e) => {
                            const members = [...form.members];
                            members[index] = {
                              ...members[index],
                              name: e.target.value,
                            };
                            setForm({ ...form, members });
                          }}
                          className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-400/50 transition-colors"
                        />
                        <input
                          type="email"
                          required
                          placeholder="Member Email"
                          value={member.email}
                          onChange={(e) => {
                            const members = [...form.members];
                            members[index] = {
                              ...members[index],
                              email: e.target.value,
                            };
                            setForm({ ...form, members });
                          }}
                          className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-400/50 transition-colors"
                        />
                      </div>
                    </div>
                  ))}

                  <div>
                    <label className="text-xs text-[#A3A3A3] mb-1 block">
                      Theme
                    </label>
                    <div className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white">
                      {registrationThemes[0] ?? OPEN_THEME_TITLE}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-[#A3A3A3] mb-1 block">
                      Google Drive Video Link *
                    </label>
                    <input
                      type="url"
                      required
                      value={form.videoUrl}
                      onChange={(e) =>
                        setForm({ ...form, videoUrl: e.target.value })
                      }
                      className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-400/50 transition-colors"
                      placeholder="https://drive.google.com/file/d/..."
                    />
                    <p className="text-[10px] text-[#666] mt-1 leading-relaxed">
                      Paste a shareable Google Drive link to your team video.
                      Set sharing to &quot;Anyone with the link&quot;.
                    </p>
                    <details className="mt-2 rounded-lg border border-white/10 bg-[#111] px-3 py-2 group">
                      <summary className="text-xs text-yellow-400/90 cursor-pointer list-none flex items-center justify-between gap-2 [&::-webkit-details-marker]:hidden">
                        <span>What should I put in this field?</span>
                        <span className="text-[#666] group-open:rotate-180 transition-transform">
                          ▾
                        </span>
                      </summary>
                      <p className="text-[11px] text-[#A3A3A3] mt-2 leading-relaxed">
                        Prepare a presentation video explaining your
                        project&apos;s workflow, problem statement, and its
                        solution. The video must be{" "}
                        <span className="text-white font-medium">2–5 minutes</span>{" "}
                        long. Upload it to Google Drive, set sharing to
                        &quot;Anyone with the link&quot;, then paste the link
                        here.
                      </p>
                    </details>
                  </div>

                  {error && <p className="text-red-400 text-xs">{error}</p>}

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 w-full py-2.5 bg-yellow-400 text-black font-bold rounded-full text-sm hover:bg-yellow-300 disabled:opacity-60 transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Registering...
                      </>
                    ) : (
                      "Register Now"
                    )}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
