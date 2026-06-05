import React, { useState, useEffect } from "react";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function gtag(...args: any[]): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function fbq(...args: any[]): void;
}

export const FormStep1ABTest: React.FC<{ onNextStep: () => void }> = ({ onNextStep }) => {
  const [variant] = useState<"A" | "B">(() => (Math.random() < 0.5 ? "A" : "B"));
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerActive, setTimerActive] = useState(true);

  useEffect(() => {
    if (typeof gtag !== "undefined") {
      gtag("event", "form_step_1_view", { variant });
    }
    if (typeof fbq !== "undefined") {
      fbq("track", "ViewContent", { content_name: `form_step_1_variant_${variant}` });
    }
  }, [variant]);

  useEffect(() => {
    if (!timerActive || timeLeft <= 0) {
      setTimerActive(false);
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timerActive, timeLeft]);

  const handleNextStep = () => {
    if (typeof gtag !== "undefined") {
      gtag("event", "form_step_1_complete", { variant });
    }
    onNextStep();
  };

  return (
    <div className="form-step">
      <div className="timer" data-timer>
        ⏰ Plus que {timeLeft}s pour voir vos prix
      </div>

      <h2 className="text-2xl font-semibold">
        Étape 1/5 — {variant === "A" ? "Que souhaitez-vous assurer ?" : "En 2 minutes, trouvez votre meilleure assurance"}
      </h2>
      <p>
        {variant === "A"
          ? "Nous comparerons 70+ offres pour vous."
          : "Nous comparerons 70+ offres d'assurance auto, habitation, santé et plus."}
      </p>

      <button
        type="button"
        className="btn cta-button"
        onClick={handleNextStep}
        disabled={!timerActive}
        aria-label="Continuer vers l'étape 2"
      >
        Continuer vers l'étape 2
      </button>
    </div>
  );
};

export default FormStep1ABTest;
