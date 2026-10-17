function Badge({ active, activeClass, inactiveClass, children }) {
  return (
    <span
      className={`px-3 py-1.5 text-xs font-bold rounded-full ${active ? activeClass : inactiveClass}`}
    >
      {children}
    </span>
  );
}

const idle = "bg-neutral-800 text-neutral-500 border border-neutral-700";

export function FormStateTracker({ formState }) {
  const { isValid, isDirty, isSubmitting, isValidating, touchedFields } =
    formState;
  const isTouched = Object.keys(touchedFields).length > 0;

  return (
    <div className="flex flex-wrap gap-2 mb-5 p-4 bg-neutral-900 rounded-xl border border-neutral-800">
      <Badge
        active={isValid}
        activeClass="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
        inactiveClass="bg-red-500/20 text-red-400 border border-red-500/30"
      >
        {isValid ? "Valid" : "Invalid"}
      </Badge>

      <Badge
        active={isTouched}
        activeClass="bg-amber-500/20 text-amber-400 border border-amber-500/30"
        inactiveClass={idle}
      >
        {isTouched ? "Touched" : "Untouched"}
      </Badge>

      <Badge
        active={isDirty}
        activeClass="bg-blue-500/20 text-blue-400 border border-blue-500/30"
        inactiveClass={idle}
      >
        {isDirty ? "Dirty" : "Clean"}
      </Badge>

      <Badge
        active={isSubmitting}
        activeClass="bg-purple-500/20 text-purple-400 border border-purple-500/30 animate-pulse"
        inactiveClass={idle}
      >
        {isSubmitting ? "Submitting…" : "Idle"}
      </Badge>

      <Badge
        active={isValidating}
        activeClass="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
        inactiveClass={idle}
      >
        {isValidating ? "Validating…" : "Validated"}
      </Badge>
    </div>
  );
}
