import { useState } from "react";
import { CheckCircle, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { NicheQuestion } from "@/data/nicheInsuranceData";

interface QuickCheckProps {
  questions: NicheQuestion[];
  eligibleMessage: string;
  notEligibleMessage: string;
}

const QuickCheck = ({ questions, eligibleMessage, notEligibleMessage }: QuickCheckProps) => {
  const [answers, setAnswers] = useState<Record<string, boolean | null>>({});
  const answeredAll = questions.every(q => answers[q.id] !== undefined && answers[q.id] !== null);
  const allYes = answeredAll && questions.every(q => answers[q.id] === true);

  return (
    <Card className="p-6 md:p-8">
      <h2 className="text-xl font-bold text-foreground mb-2">Quick Check — Êtes-vous éligible ?</h2>
      <p className="text-sm text-muted-foreground mb-6">3 questions, 30 secondes. Aucune donnée personnelle requise.</p>

      <div className="space-y-4">
        {questions.map((q) => (
          <div key={q.id} className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <p className="text-sm font-medium text-foreground flex-1">{q.label}</p>
            <div className="flex gap-2">
              <button
                onClick={() => setAnswers(prev => ({ ...prev, [q.id]: true }))}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  answers[q.id] === true
                    ? "bg-primary text-primary-foreground shadow-md scale-105"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {q.yesText}
              </button>
              <button
                onClick={() => setAnswers(prev => ({ ...prev, [q.id]: false }))}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  answers[q.id] === false
                    ? "bg-destructive text-destructive-foreground shadow-md scale-105"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {q.noText}
              </button>
            </div>
          </div>
        ))}
      </div>

      {answeredAll && (
        <div
          className={`mt-6 p-4 rounded-xl flex items-start gap-3 transition-all duration-300 ${
            allYes
              ? "bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800"
              : "bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800"
          }`}
          style={{ animation: "fadeIn 0.4s ease-out" }}
        >
          {allYes ? (
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
          )}
          <p className={`text-sm font-medium ${allYes ? "text-green-800 dark:text-green-200" : "text-amber-800 dark:text-amber-200"}`}>
            {allYes ? eligibleMessage : notEligibleMessage}
          </p>
        </div>
      )}
    </Card>
  );
};

export default QuickCheck;
