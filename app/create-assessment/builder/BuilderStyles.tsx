"use client";

import type { Theme } from "@/ui/AppTheme";

type Props = {
  theme: Theme;
};

export default function BuilderGlobalStyles({ theme }: Props) {
  return (
    <style jsx global>{`
      .hover-scroll {
        scrollbar-width: thin;
        scrollbar-color: transparent transparent;
      }

      .hover-scroll:hover {
        scrollbar-color: ${theme.textMuted} ${theme.bgSurface};
      }

      .hover-scroll::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }

      .hover-scroll::-webkit-scrollbar-track {
        background: transparent;
      }

      .hover-scroll::-webkit-scrollbar-thumb {
        background: transparent;
        border-radius: 999px;
      }

      .hover-scroll:hover::-webkit-scrollbar-track {
        background: ${theme.bgSurface};
      }

      .hover-scroll:hover::-webkit-scrollbar-thumb {
        background: ${theme.textMuted};
      }

      .hover-scroll:hover::-webkit-scrollbar-thumb:hover {
        background: ${theme.textSecondary};
      }

      .hover-scroll::-webkit-scrollbar-corner {
        background: transparent;
      }

      .pdf-header {
        padding: 14px;
        display: flex;
        justify-content: space-between;
        gap: 20px;
        align-items: center;
      }

      .zoom-overlay {
        position: absolute;
        top: 8px;
        left: 50%;
        transform: translateX(-50%);
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 8px;
        min-height: 30px;
        background: ${theme.bgElevated};
        border: 1px solid ${theme.borderStandard};
        border-radius: 12px;
        box-shadow: ${theme.shadow};
        color: ${theme.textSecondary};
        font-family: Inter, Arial, sans-serif;
        font-size: 11px;
        line-height: 1;
        z-index: 100;
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
      }

      .zoom-overlay .zoom-text {
        min-width: 38px;
        text-align: center;
        font-weight: 700;
        font-size: 13px;
        color: ${theme.textPrimary};
        letter-spacing: 0;
      }

      .zoom-overlay .zoom-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 16px;
        height: 16px;
        padding: 0 3px;
        margin: 0;
        background: transparent;
        border: none;
        cursor: pointer;
        color: ${theme.textSecondary};
        font-size: 14px;
        line-height: 1;
        transition: color 0.15s ease, transform 0.15s ease;
      }

      .zoom-overlay .zoom-btn:hover {
        color: ${theme.accentPrimary};
      }

      .zoom-overlay .zoom-btn:active {
        transform: scale(0.96);
      }
    `}</style>
  );
}