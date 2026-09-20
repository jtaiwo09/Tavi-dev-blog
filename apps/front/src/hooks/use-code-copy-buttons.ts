"use client";

import { useEffect, type RefObject } from "react";

const svg = (paths: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

const COPY_ICON = svg(
  '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
);
const CHECK_ICON = svg('<path d="M20 6 9 17l-5-5"/>');

export function useCodeCopyButtons(
  ref: RefObject<HTMLElement | null>,
  dep?: unknown,
) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    root.querySelectorAll("pre").forEach((pre) => {
      if (pre.parentElement?.classList.contains("code-block")) return;

      const wrapper = document.createElement("div");
      wrapper.className = "code-block";
      pre.replaceWith(wrapper);
      wrapper.appendChild(pre);

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "code-copy-btn";
      btn.setAttribute("aria-label", "Copy code");
      btn.innerHTML = COPY_ICON;

      let timer: ReturnType<typeof setTimeout>;
      btn.addEventListener("click", async () => {
        const text =
          pre.querySelector("code")?.textContent ?? pre.textContent ?? "";
        try {
          await navigator.clipboard.writeText(text);
          btn.innerHTML = CHECK_ICON;
          btn.dataset.copied = "true";
          btn.setAttribute("aria-label", "Copied");
          clearTimeout(timer);
          timer = setTimeout(() => {
            btn.innerHTML = COPY_ICON;
            delete btn.dataset.copied;
            btn.setAttribute("aria-label", "Copy code");
          }, 2000);
        } catch {
          /* clipboard blocked (e.g. insecure context) */
        }
      });

      wrapper.appendChild(btn);
    });
  }, [ref, dep]);
}
