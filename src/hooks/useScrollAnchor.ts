import { useRef } from 'react';
export function useScrollAnchor() {
  const listRef = useRef<HTMLDivElement | null>(null);
  const anchorRef = useRef<{ id: string; offset: number } | null>(null);

  const saveAnchor = (selector: string, dataAttr: string) => {
    if (!listRef.current) return;

    const items =
      listRef.current.querySelectorAll<HTMLElement>(selector);

    const lastItem = items[items.length - 1];
    if (!lastItem) return;

    anchorRef.current = {
      id: lastItem.dataset[dataAttr]!,
      offset: lastItem.getBoundingClientRect().top,
    };
  };

  const restoreAnchor = () => {
    if (!listRef.current || !anchorRef.current) return;

    const el = listRef.current.querySelector<HTMLElement>(
      `[data-${anchorRef.current.id}]`
    );

    if (!el) return;

    const newOffset = el.getBoundingClientRect().top;
    const delta = newOffset - anchorRef.current.offset;

    listRef.current.scrollTop += delta;
    anchorRef.current = null;
  };

  return {
    listRef,
    saveAnchor,
    restoreAnchor,
  };
}
