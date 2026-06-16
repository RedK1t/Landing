import { FaSun, FaMoon, FaDesktop } from "react-icons/fa6";
import { useTheme, type Theme } from "../context/ThemeContext";

const options: { value: Theme; label: string; Icon: typeof FaSun }[] = [
  { value: "light", label: "Light", Icon: FaSun },
  { value: "dark", label: "Dark", Icon: FaMoon },
  { value: "system", label: "System", Icon: FaDesktop },
];

/** Compact segmented light / dark / system control for the top nav. */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-0.5 rounded-full border border-line bg-fg/[0.04] p-0.5">
      {options.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          onClick={() => setTheme(value)}
          aria-label={`${label} theme`}
          aria-pressed={theme === value}
          title={`${label} theme`}
          className={`flex h-7 w-7 items-center justify-center rounded-full text-xs transition-colors ${
            theme === value
              ? "bg-red text-white"
              : "text-fg-muted hover:text-fg"
          }`}
        >
          <Icon />
        </button>
      ))}
    </div>
  );
}
