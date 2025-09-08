"use client";

import { useState } from "react";

export default function ButtonsTestPage() {
  // Controls for button-l
  const [lOffset, setLOffset] = useState(0.5); // px
  const [lLine, setLLine] = useState(1); // px

  // Controls for button-without-box
  const [linkUnderline, setLinkUnderline] = useState(0.5); // px
  const [linkIcon, setLinkIcon] = useState(12); // px
  const [linkGap, setLinkGap] = useState(3); // px
  const [linkBaseline, setLinkBaseline] = useState(2); // px

  return (
    <div className="mx-auto max-w-[1620px] px-6 py-12 space-y-16">
      <header className="space-y-2">
        <h1 className="text-4xl md:text-5xl font-bold">Buttons Design Test</h1>
        <p className="text-gray-600">Interactive controls to fine-tune L-button and link-button offsets and sizes.</p>
      </header>

      {/* Button L - Solid */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">L Button (solid) — .button-l</h2>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="w-40 text-sm text-gray-600">Offset (--btn-l-offset)</span>
              <input type="range" min={0} max={2} step={0.5} value={lOffset} onChange={(e) => setLOffset(parseFloat(e.target.value))} className="w-full" />
              <span className="w-16 text-right text-sm">{lOffset}px</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-40 text-sm text-gray-600">Line (--btn-l-line)</span>
              <input type="range" min={1} max={2} step={0.5} value={lLine} onChange={(e) => setLLine(parseFloat(e.target.value))} className="w-full" />
              <span className="w-16 text-right text-sm">{lLine}px</span>
            </div>

            <div className="space-x-4">
              <button
                className="button-l"
                style={{
                  "--btn-l-offset": `${lOffset}px`,
                  "--btn-l-line": `${lLine}px`,
                }}
              >
                Start A Project
              </button>
              <button
                className="button-l"
                style={{ "--btn-l-offset": `0px`, "--btn-l-line": `1px` }}
              >
                Offset 0px
              </button>
              <button
                className="button-l"
                style={{ "--btn-l-offset": `1px`, "--btn-l-line": `1px` }}
              >
                Offset 1px
              </button>
            </div>
          </div>

          {/* Dark background check */}
          <div className="rounded-lg p-8" style={{ background: "#111827" }}>
            <div className="text-white mb-4">Dark background preview</div>
            <button
              className="button-l"
              style={{
                "--btn-l-offset": `${lOffset}px`,
                "--btn-l-line": `${lLine}px`,
              }}
            >
              Start A Project
            </button>
          </div>
        </div>
      </section>

      {/* Link Button - Underline with icon */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Link Button (underline + icon) — .button-without-box</h2>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="w-40 text-sm text-gray-600">Underline (--btn-link-underline)</span>
              <input type="range" min={0.5} max={2} step={0.5} value={linkUnderline} onChange={(e) => setLinkUnderline(parseFloat(e.target.value))} className="w-full" />
              <span className="w-16 text-right text-sm">{linkUnderline}px</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-40 text-sm text-gray-600">Icon size (--btn-link-icon)</span>
              <input type="range" min={10} max={16} step={1} value={linkIcon} onChange={(e) => setLinkIcon(parseInt(e.target.value, 10))} className="w-full" />
              <span className="w-16 text-right text-sm">{linkIcon}px</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-40 text-sm text-gray-600">Gap (--btn-link-gap)</span>
              <input type="range" min={0} max={8} step={1} value={linkGap} onChange={(e) => setLinkGap(parseInt(e.target.value, 10))} className="w-full" />
              <span className="w-16 text-right text-sm">{linkGap}px</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-40 text-sm text-gray-600">Baseline (--btn-link-baseline)</span>
              <input type="range" min={0} max={4} step={0.5} value={linkBaseline} onChange={(e) => setLinkBaseline(parseFloat(e.target.value))} className="w-full" />
              <span className="w-16 text-right text-sm">{linkBaseline}px</span>
            </div>

            <div className="space-x-4">
              <a
                className="button-without-box"
                style={{
                  "--btn-link-underline": `${linkUnderline}px`,
                  "--btn-link-icon": `${linkIcon}px`,
                  "--btn-link-gap": `${linkGap}px`,
                  "--btn-link-baseline": `${linkBaseline}px`,
                }}
                href="#"
              >
                View Our Services
              </a>
              <a className="button-without-box" href="#" style={{ "--btn-link-underline": `0.5px`, "--btn-link-icon": `12px`, "--btn-link-gap": `3px`, "--btn-link-baseline": `2px` }}>
                Default Spec
              </a>
            </div>
          </div>

          {/* Dark background check */}
          <div className="rounded-lg p-8" style={{ background: "#f3f4f6" }}>
            <div className="mb-4 text-gray-700">Light grey background preview</div>
            <a
              className="button-without-box"
              style={{
                "--btn-link-underline": `${linkUnderline}px`,
                "--btn-link-icon": `${linkIcon}px`,
                "--btn-link-gap": `${linkGap}px`,
                "--btn-link-baseline": `${linkBaseline}px`,
              }}
              href="#"
            >
              View Our Services
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

