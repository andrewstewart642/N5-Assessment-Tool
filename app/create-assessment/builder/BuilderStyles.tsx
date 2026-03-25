"use client";

import type { AppTheme } from "@/ui/AppTheme";

type Props = {
  theme: AppTheme;
};

export default function BuilderGlobalStyles({ theme }: Props) {
  return (
    <style jsx global>{`
      /* Side Scrollbars */
      .hover-scroll {
        scrollbar-width: thin;
        scrollbar-color: transparent transparent;
      }

      .hover-scroll:hover {
        scrollbar-color: ${theme.scrollbarThumb} ${theme.bgPrimary};
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
        background: ${theme.bgPrimary};
      }

      .hover-scroll:hover::-webkit-scrollbar-thumb {
        background: ${theme.scrollbarThumb};
      }

      .hover-scroll:hover::-webkit-scrollbar-thumb:hover {
        background: ${theme.borderStrong};
      }

      .hover-scroll::-webkit-scrollbar-corner {
        background: transparent;
      }

      /* PDF Header Padding */
      .pdf-header {
        padding: 14px;
        display: flex;
        justify-content: space-between;
        gap: 20px;
        align-items: center;
      }

      /* Zoom Overlay */
      .zoom-overlay {
        position: absolute;
        top: 12px;
        left: 50%;
        transform: translateX(-50%);
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 6px 10px;
        min-height: 36px;

        background: ${theme.overlay};
        border: 1px solid ${theme.borderSoft};
        border-radius: 999px;
        box-shadow: ${theme.cardShadow};

        color: ${theme.textSecondary};
        font-family: Inter, Arial, sans-serif;
        font-size: 12px;
        line-height: 1;
        z-index: 100;

        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
      }

      .zoom-overlay .zoom-text {
        min-width: 42px;
        text-align: center;
        font-weight: 600;
        font-size: 12px;
        color: ${theme.textPrimary};
        letter-spacing: 0;
      }

      .zoom-overlay .zoom-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 18px;
        padding: 0;
        margin: 0;

        background: transparent;
        border: none;
        cursor: pointer;

        color: ${theme.textSecondary};
        font-size: 16px;
        line-height: 1;

        transition:
          color 0.15s ease,
          transform 0.15s ease,
          opacity 0.15s ease;
      }

      .zoom-overlay .zoom-btn:hover {
        color: ${theme.textPrimary};
      }

      .zoom-overlay .zoom-btn:active {
        transform: scale(0.96);
      }
    `}</style>
  );
}