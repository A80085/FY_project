import React from "react";

export default function Logo({ 
  className = "h-10 w-10", 
  withText = false, 
  textClassName = "",
  variant = "badge" 
}) {
  return (
    <div className="flex items-center gap-3 group shrink-0">
      {/* Official Shree Mangalam Monogram Mark */}
      {variant === "transparent" ? (
        <div className={`relative shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${className}`}>
          <img
            src="/images/logo_transparent_white.png"
            alt="Shree Mangalam Monogram"
            className="w-full h-full object-contain dark:block hidden"
          />
          <img
            src="/images/logo_transparent_dark.png"
            alt="Shree Mangalam Monogram"
            className="w-full h-full object-contain dark:hidden block"
          />
        </div>
      ) : (
        <div
          className={`relative rounded-md overflow-hidden shrink-0 shadow-sm border border-border/80 bg-white dark:bg-black p-0.5 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${className}`}
        >
          {/* Dark mode: Crisp white monogram on black */}
          <img
            src="/images/logo_icon_dark.png"
            alt="Shree Mangalam Monogram"
            className="w-full h-full object-contain dark:block hidden"
          />
          {/* Light mode: Crisp black monogram on white */}
          <img
            src="/images/logo_icon_light.png"
            alt="Shree Mangalam Monogram"
            className="w-full h-full object-contain dark:hidden block"
          />
        </div>
      )}

      {withText && (
        <div className={`min-w-0 ${textClassName}`}>
          <span className="font-display font-semibold tracking-tight block text-foreground uppercase leading-tight truncate">
            Shree Mangalam
          </span>
          <span className="text-[9px] uppercase font-semibold tracking-[0.24em] block text-accent whitespace-nowrap">
            Ply &amp; Interiors
          </span>
        </div>
      )}
    </div>
  );
}
