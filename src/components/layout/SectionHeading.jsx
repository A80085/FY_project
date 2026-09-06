import React from "react";

export default function SectionHeading({ eyebrow, title, description, align = "left" }) {
  const isCenter = align === "center";
  return (
    <div className={`max-w-2xl ${isCenter ? "mx-auto text-center" : ""}`}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      {title && (
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl leading-tight text-primary">
          {title}
        </h2>
      )}
      {description && (
        <p className="mt-4 text-muted-foreground leading-relaxed text-sm sm:text-base">
          {description}
        </p>
      )}
    </div>
  );
}
