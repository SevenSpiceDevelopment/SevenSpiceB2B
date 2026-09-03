"use client";

import { Globe, Handshake, FlaskConical, CalendarCheck } from "lucide-react";

export default function StatsBanner({ locale = "en" }) {
  const stats = [
    {
      icon: Globe,
      value: "50+",
      label: locale === "ur" ? "ممالک میں سپلائی" : "Countries Served",
    },
    {
      icon: Handshake,
      value: "100+",
      label: locale === "ur" ? "قابلِ اعتماد پارٹنرز" : "Trusted Partners",
    },
    {
      icon: FlaskConical,
      value: "30+",
      label: locale === "ur" ? "کوالٹی چیک پوائنٹس" : "Quality Checkpoints",
    },
    {
      icon: CalendarCheck,
      value: "99.5%",
      label: locale === "ur" ? "بروقت ترسیل" : "On-Time Delivery",
    },
  ];

  return (
    <div className="mt-14 sm:mt-16 w-full bg-[#fdfcf9] border border-[#e8dfd5] rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-xs">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-0 lg:divide-x lg:divide-[#e8dfd5] rtl:lg:divide-x-reverse">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`flex items-center gap-4 ${
                idx === 0
                  ? "lg:pr-8 rtl:lg:pl-8 rtl:lg:pr-0"
                  : idx === stats.length - 1
                  ? "lg:pl-8 rtl:lg:pr-8 rtl:lg:pl-0"
                  : "lg:px-8"
              }`}
            >
              {/* Circular Gold-Ring Icon */}
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full border border-[#c68a1d]/40 bg-[#fbf6ec] flex items-center justify-center shrink-0 shadow-2xs">
                <Icon size={22} className="text-[#b47a18]" strokeWidth={1.75} />
              </div>

              {/* Stat Value & Label */}
              <div className="flex flex-col text-left rtl:text-right">
                <span className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight font-display leading-tight">
                  {stat.value}
                </span>
                <span className="text-xs sm:text-sm font-medium text-slate-600 mt-0.5">
                  {stat.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
