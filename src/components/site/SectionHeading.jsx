import React from "react";

export default function SectionHeading({ eyebrow, title, description, align = "left", light = false }) {
  const alignCls = align === "center" ? "text-center mx-auto items-center" : "items-start";
  return (
    <div className={`flex flex-col gap-3 max-w-2xl ${alignCls}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className={`font-display text-3xl sm:text-4xl lg:text-5xl leading-[1.08] ${light ? "text-primary-foreground" : "text-primary"}`}>
        {title}
      </h2>
      {description && (
        <p className={`text-sm sm:text-base leading-relaxed ${light ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
          {description}
        </p>
      )}
    </div>
  );
}