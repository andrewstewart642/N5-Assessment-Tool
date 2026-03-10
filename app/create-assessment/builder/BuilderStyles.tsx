"use client";

import type { Theme } from "@/shared-types/AssessmentTypes";

type Props = {
  theme: Theme;
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
        scrollbar-color: ${theme.pageBg === "#eef3f8" ? "#c4cfdd #edf2f7" : "#2c3c50 #0b1118"};
      }

      .hover-scroll::-webkit-scrollbar {
        width: 4px;
        height: 4px;
      }

      .hover-scroll::-webkit-scrollbar-track {
        background: transparent;
      }

      .hover-scroll::-webkit-scrollbar-thumb {
        background: transparent;
        border-radius: 999px;
      }

      .hover-scroll:hover::-webkit-scrollbar-track {
        background: ${theme.pageBg === "#eef3f8" ? "#edf2f7" : "#0b1118"};
      }

      .hover-scroll:hover::-webkit-scrollbar-thumb {
        background: ${theme.pageBg === "#eef3f8" ? "#c4cfdd" : "#2c3c50"};
      }

      .hover-scroll:hover::-webkit-scrollbar-thumb:hover {
        background: ${theme.pageBg === "#eef3f8" ? "#aebdce" : "#3a4e66"};
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
        top: 10px;
        right: 10px;
        background-color: rgba(255, 255, 255, 0.8);
        box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        padding: 4px 8px;
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 12px;
        z-index: 100;
        font-family: Arial, sans-serif;
      }

      .zoom-overlay .zoom-text {
        font-weight: bold;
        font-size: 14px;
      }

      .zoom-overlay .zoom-btn {
        font-size: 18px;
        cursor: pointer;
        background: transparent;
        border: none;
        color: #333;
      }

      .zoom-overlay .zoom-btn:hover {
        color: #0078d4;
      }
    `}</style>
  );
}