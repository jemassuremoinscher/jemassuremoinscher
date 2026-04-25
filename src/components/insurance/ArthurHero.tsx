interface ArthurHeroProps {
  imageSrc: string;
  imageAlt: string;
  speechText: string;
}

const ArthurHero = ({ imageSrc, imageAlt, speechText }: ArthurHeroProps) => {
  return (
    <div className="flex flex-col items-center mb-8 px-4 animate-fade-in relative">
      {/* Large decorative Arthur background */}
      <img
        src={imageSrc}
        alt={`${imageAlt} en arrière-plan décoratif`}
        aria-hidden="true"
        className="absolute -right-10 md:-right-4 -top-8 w-[280px] sm:w-[340px] md:w-[420px] lg:w-[500px] h-auto opacity-[0.08] pointer-events-none select-none rotate-[-8deg] blur-[0.5px]"
        width={500}
        height={625}
        loading="lazy"
        decoding="async"
      />
      {/* Arthur + bubble side by side */}
      <div className="relative z-10 flex items-end gap-1 sm:gap-2">
        {/* Main Arthur */}
        <img
          src={imageSrc}
          alt={imageAlt}
          className="w-16 sm:w-20 md:w-28 lg:w-36 h-auto drop-shadow-2xl animate-hero-float flex-shrink-0"
          width={144}
          height={180}
          loading="eager"
          decoding="async"
        />
        {/* Speech bubble — to the right, anchored at Arthur's head level */}
        <div className="relative mb-8 sm:mb-10 md:mb-14 animate-fade-in-delay flex-shrink min-w-0">
          {/* Triangle pointing left toward Arthur */}
          <div className="absolute left-[-6px] bottom-2 w-3 h-3 bg-white border-l border-b border-border/30 transform rotate-45 z-0" />
          <div className="relative bg-white rounded-2xl px-3 py-2 sm:px-4 sm:py-3 shadow-lg border border-border/30 z-10">
            <p className="text-foreground font-medium text-[11px] sm:text-xs md:text-sm lg:text-base">
              {speechText} 💡
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArthurHero;
