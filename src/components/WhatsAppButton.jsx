import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = "918788609224";
  const defaultMessage = encodeURIComponent(
    "Hi Shree Mangalam Team, I visited your website and would like to inquire about plywood finishes, laminates, and an estimate for my space."
  );

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 print:hidden">
      {/* Quick popup tooltip / greeting */}
      {isOpen && (
        <div className="bg-card text-card-foreground border border-border shadow-2xl rounded-xl p-4 w-72 mb-1 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-start justify-between gap-2 pb-2 border-b border-border/60">
            <div>
              <p className="font-semibold text-xs text-foreground">Shree Mangalam Studio</p>
              <p className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                Available on WhatsApp
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground p-0.5 rounded-sm"
              aria-label="Close message"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-2.5 leading-relaxed font-light">
            Need pricing, plywood stock details, or want to share your floor plan for a fast quote?
          </p>
          <a
            href={`https://wa.me/${phoneNumber}?text=${defaultMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-semibold py-2 px-3 rounded-md transition-colors shadow-sm"
          >
            <MessageCircle className="h-4 w-4 fill-white" />
            Start WhatsApp Chat
          </a>
        </div>
      )}

      {/* Main floating trigger button */}
      <div className="flex items-center gap-2">
        {!isOpen && (
          <span className="hidden sm:inline-flex bg-card/95 backdrop-blur-md text-foreground text-xs font-medium px-3 py-1.5 rounded-full border border-border shadow-md">
            Need a Quick Quote?
          </span>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="h-13 w-13 sm:h-14 sm:w-14 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-[#25D366]/30"
          aria-label="Open WhatsApp conversation"
          title="Chat with Shree Mangalam on WhatsApp"
        >
          <MessageCircle className="h-7 w-7 fill-white" />
        </button>
      </div>
    </div>
  );
}
