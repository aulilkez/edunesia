export function PasswordStrength({ value }: { value: string }) {
  const checks = [
    value.length >= 12,
    /[A-Z]/.test(value),
    /[0-9]/.test(value),
    /[^A-Za-z0-9]/.test(value),
  ];
  const strength = checks.filter(Boolean).length;
  return (
    <div
      aria-label={`Password strength: ${strength} of 4`}
      className="grid grid-cols-4 gap-1"
      role="meter"
      aria-valuemin={0}
      aria-valuemax={4}
      aria-valuenow={strength}
    >
      {checks.map((_, index) => (
        <span
          key={index}
          className={`h-1 rounded-full ${index < strength ? "bg-primary" : "bg-muted"}`}
        />
      ))}
      <span className="sr-only">{strength < 2 ? "Weak" : strength < 4 ? "Good" : "Strong"}</span>
    </div>
  );
}
