import { cn } from "@repo/ui/lib/utils";

type FormErrorProps = {
  message?: string | string[];
  className?: string;
};

const FormError = ({
  message,
  className,
}: FormErrorProps) => {
  if (!message) return null;

  const text = Array.isArray(message)
    ? message[0]
    : message;

  return (
    <div
      role="alert"
      className={cn(
        "rounded-lg border border-destructive/20",
        "bg-destructive/10 px-3.5 py-3",
        "text-sm font-medium text-destructive",
        className,
      )}
    >
      {text}
    </div>
  );
};

export default FormError;