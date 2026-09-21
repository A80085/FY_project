import React from "react";
import { AlertCircle } from "lucide-react";

export default function UserNotRegisteredError({ message }) {
  return (
    <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-sm text-destructive flex items-start gap-3 text-sm">
      <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold">Access Error</p>
        <p className="text-xs mt-1 leading-relaxed">{message || "You do not have access to this application."}</p>
      </div>
    </div>
  );
}
