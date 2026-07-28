import { Construction } from "lucide-react";

export default function CrmPlaceholder({ title }: { title: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-3xl bg-[#F3E8FF] dark:bg-[#262140] text-[#7C3AED] dark:text-[#C4B5FD]">
        <Construction className="h-6 w-6" />
      </div>
      <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">{title}</h1>
      <p className="max-w-md text-sm text-slate-500 dark:text-slate-400">
        Module en préparation dans les prochains lots (GED complète, dashboard KPIs,
        finance, marketing, RGPD).
      </p>
    </div>
  );
}
