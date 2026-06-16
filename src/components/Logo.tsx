/**
 * RedKit brand lockup: the squared mark (theme-swapped) + the Junicode
 * wordmark. The black mark shows in light mode, the white mark in dark mode.
 */
export function Logo({
  markClass = "h-8 w-8",
  textClass = "text-xl",
  withText = true,
}: {
  markClass?: string;
  textClass?: string;
  withText?: boolean;
}) {
  return (
    <span className="flex items-center gap-2.5">
      <img
        src="/logo/mark-dark.svg"
        alt="RedKit"
        className={`${markClass} dark:hidden`}
        width={32}
        height={32}
      />
      <img
        src="/logo/mark-light.svg"
        alt=""
        aria-hidden
        className={`${markClass} hidden dark:block`}
        width={32}
        height={32}
      />
      {withText && (
        <span
          className={`font-sans font-bold tracking-tight ${textClass}`}
        >
          <span className="text-red">Red</span>
          <span className="text-fg">Kit</span>
        </span>
      )}
    </span>
  );
}
