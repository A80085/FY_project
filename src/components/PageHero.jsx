import React from "react";
import { Image } from "@/components/ui/image";

export default function PageHero({ eyebrow, title, description, image }) {
  return (
    <div className="relative pt-32 pb-16 lg:pb-20 overflow-hidden bg-primary text-primary-foreground">
      {image && (
        <div className="absolute inset-0 opacity-25">
          <Image
            src={image}
            alt={title}
            className="h-full w-full object-cover"
            fittingType="fill"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/70 to-transparent" />
        </div>
      )}
      <div className="relative container-px max-w-7xl mx-auto">
        {eyebrow && <p className="eyebrow text-primary-foreground/70 mb-3">{eyebrow}</p>}
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl max-w-3xl leading-tight">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-xl text-primary-foreground/80 text-sm sm:text-base leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
