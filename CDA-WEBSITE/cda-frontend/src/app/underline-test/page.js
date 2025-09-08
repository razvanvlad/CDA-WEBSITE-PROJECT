export const metadata = {
  title: "Underline Utilities Test",
};

export default function UnderlineTestPage() {
  return (
    <div className="mx-auto max-w-[1620px] px-6 py-12 space-y-16">
      <header>
        <h1 className="text-4xl md:text-5xl font-bold">Underline Utilities Test</h1>
        <p className="text-gray-600 mt-2">Review and tweak color, gap, width, and thickness before using on production pages.</p>
      </header>

      {/* Partial underline on a word */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Partial underline on a word</h2>
        <div className="space-y-4">
          <h3 className="text-3xl md:text-5xl font-semibold leading-tight">
            Our <span className="title-underline title-large-orange">Mission</span> Matters
          </h3>
          <h3 className="text-3xl md:text-5xl font-semibold leading-tight">
            Our <span className="title-underline title-large-pink">Mission</span> Matters
          </h3>
          <h3 className="text-3xl md:text-5xl font-semibold leading-tight">
            Our <span className="title-underline title-large-purple">Mission</span> Matters
          </h3>
          <h3 className="text-3xl md:text-5xl font-semibold leading-tight">
            Our <span className="title-underline title-large-light-blue">Mission</span> Matters
          </h3>
          <h3 className="text-3xl md:text-5xl font-semibold leading-tight">
            Our <span className="title-underline title-large-green">Mission</span> Matters
          </h3>
        </div>
      </section>

      {/* Half underline across entire title */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Half underline across the entire title</h2>
        <div className="space-y-4">
          <h3 className="text-3xl md:text-5xl font-semibold leading-tight">
            <span className="title-underline title-large-orange u-half">Our Mission Matters</span>
          </h3>
          <h3 className="text-3xl md:text-5xl font-semibold leading-tight">
            <span className="title-underline title-large-pink u-half">Our Mission Matters</span>
          </h3>
          <h3 className="text-3xl md:text-5xl font-semibold leading-tight">
            <span className="title-underline title-large-purple u-half">Our Mission Matters</span>
          </h3>
          <h3 className="text-3xl md:text-5xl font-semibold leading-tight">
            <span className="title-underline title-large-light-blue u-half">Our Mission Matters</span>
          </h3>
          <h3 className="text-3xl md:text-5xl font-semibold leading-tight">
            <span className="title-underline title-large-green u-half">Our Mission Matters</span>
          </h3>
        </div>
      </section>

      {/* Gap variations */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Gap variations (underline offset)</h2>
        <div className="space-y-4">
          <h3 className="text-3xl md:text-5xl font-semibold leading-tight">
            <span className="title-underline title-large-orange u-half u-gap-12">Gap 6px</span>
          </h3>
          <h3 className="text-3xl md:text-5xl font-semibold leading-tight">
            <span className="title-underline title-large-orange u-half u-gap-10">Gap 10px</span>
          </h3>
          <h3 className="text-3xl md:text-5xl font-semibold leading-tight">
            <span className="title-underline title-large-orange u-half u-gap-14">Gap 14px</span>
          </h3>
        </div>
      </section>

      {/* Thickness variations */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Thickness variations</h2>
        <div className="space-y-4">
          <h3 className="text-3xl md:text-5xl font-semibold leading-tight">
            <span className="title-underline title-large-purple u-half u-thick-9">Thickness 9px</span>
          </h3>
          <h3 className="text-3xl md:text-5xl font-semibold leading-tight">
            <span className="title-underline title-large-purple u-half u-thick-11">Thickness 11px</span>
          </h3>
          <h3 className="text-3xl md:text-5xl font-semibold leading-tight">
            <span className="title-underline title-large-purple u-half u-thick-14">Thickness 14px</span>
          </h3>
        </div>
      </section>

      {/* Width variations */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Width variations</h2>
        <div className="space-y-4">
          <h3 className="text-3xl md:text-5xl font-semibold leading-tight">
            <span className="title-underline title-large-light-blue u-third">One Third Width</span>
          </h3>
          <h3 className="text-3xl md:text-5xl font-semibold leading-tight">
            <span className="title-underline title-large-light-blue u-half">Half Width</span>
          </h3>
          <h3 className="text-3xl md:text-5xl font-semibold leading-tight">
            <span className="title-underline title-large-light-blue u-full">Full Width</span>
          </h3>
        </div>
      </section>

      {/* Multiline example */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Multi-line wrapping behavior</h2>
        <div className="space-y-4 max-w-xl">
          <h3 className="text-3xl md:text-5xl font-semibold leading-tight">
            <span className="title-underline title-large-green u-full">
              Underline width behavior
            </span>
          </h3>
        </div>
      </section>

      {/* Inline custom vars */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Inline custom variables</h2>
        <div className="space-y-4">
          <h3 className="text-3xl md:text-5xl font-semibold leading-tight">
            <span
              className="title-underline u-half"
              style={{
                '--u-offset': '20px',
                '--u-thickness': '8px',
                '--u-color': '#00BFFF',
                '--u-width': '60%'
              }}
            >
              Custom Offset 20px, Thickness 8px, Width 60%, Color #00BFFF
            </span>
          </h3>
        </div>
      </section>
    </div>
  );
}

