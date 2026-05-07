interface ArthurHeroProps {
  imageSrc: string;
  imageAlt: string;
  speechText: string;
}

const ArthurHero = ({ imageSrc, imageAlt, speechText }: ArthurHeroProps) => {
  return (
    <div className="relative flex flex-col items-center mb-8 px-4 animate-fade-in">
      {/* Ambient gradient blobs — MD3 expressive backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -top-24 -left-16 w-72 h-72 rounded-full bg-primary/25 blur-3xl animate-hero-float" />
        <div
          className="absolute -bottom-20 -right-10 w-80 h-80 rounded-full bg-accent/20 blur-3xl animate-hero-float"
          style={{ animationDelay: "1.2s" }}
        />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-56 h-56 rounded-full bg-primary/10 blur-2xl" />
        {/* Subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(hsl(var(--primary)) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
      </div>

      {/* Decorative oversized Arthur */}
      <img
        src={imageSrc}
        alt=""
        aria-hidden="true"
        className="absolute -right-10 md:-right-4 -top-8 w-[280px] sm:w-[340px] md:w-[420px] lg:w-[500px] h-auto opacity-[0.06] pointer-events-none select-none rotate-[-8deg]"
        width={500}
        height={625}
        loading="lazy"
        decoding="async"
      />

      {/* Arthur + bubble */}
      <div className="relative z-10 flex items-end gap-2 sm:gap-3">
        {/* Arthur with glow ring */}
        <div className="relative flex-shrink-0">
          <div
            aria-hidden="true"
            className="absolute inset-0 -m-3 rounded-full bg-gradient-to-tr from-primary/40 via-accent/30 to-primary/20 blur-xl opacity-70"
          />
          <img
            src={imageSrc}
            alt={imageAlt}
            className="relative w-20 sm:w-24 md:w-32 lg:w-40 h-auto drop-shadow-2xl animate-hero-float"
            width={160}
            height={200}
            loading="eager"
            decoding="async"
          />
        </div>

        {/* Glassmorphic speech bubble */}
        <div className="relative mb-8 sm:mb-10 md:mb-14 animate-fade-in-delay flex-shrink min-w-0">
          {/* Gradient border wrapper */}
          <div className="relative rounded-2xl p-[1.5px] bg-gradient-to-br from-primary/60 via-accent/40 to-primary/30 shadow-[0_8px_30px_-8px_hsl(var(--primary)/0.35)]">
            {/* Triangle pointer */}
            <div
              aria-hidden="true"
              className="absolute left-[-7px] bottom-3 w-3.5 h-3.5 bg-gradient-to-br from-primary/60 to-accent/40 rotate-45 rounded-[2px]"
            />
            <div className="absolute left-[-5px] bottom-[14px] w-3 h-3 bg-white/80 backdrop-blur-xl rotate-45 rounded-[2px] z-10" />

            <div className="relative bg-white/75 backdrop-blur-xl rounded-2xl px-3.5 py-2.5 sm:px-5 sm:py-3 z-20">
              <p className="text-foreground font-medium text-[11px] sm:text-xs md:text-sm lg:text-base leading-snug">
                {speechText}{" "}
                <span className="inline-block animate-pulse">✨</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArthurHero;
