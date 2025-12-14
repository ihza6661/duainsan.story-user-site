import { Link } from "react-router-dom";

/**
 * Skip Link Component for Accessibility
 * 
 * Allows keyboard users to skip directly to main content,
 * bypassing repetitive navigation elements.
 * 
 * WCAG 2.1 Compliance: Level A (2.4.1 Bypass Blocks)
 */
const SkipLink = () => {
  return (
    <a
      href="#main-content"
      className="
        sr-only
        focus:not-sr-only
        focus:absolute
        focus:z-50
        focus:top-4
        focus:left-4
        focus:px-4
        focus:py-3
        focus:bg-primary
        focus:text-primary-foreground
        focus:rounded-lg
        focus:shadow-lg
        focus:outline-none
        focus:ring-2
        focus:ring-ring
        focus:ring-offset-2
        transition-all
      "
    >
      Skip to main content
    </a>
  );
};

export default SkipLink;
