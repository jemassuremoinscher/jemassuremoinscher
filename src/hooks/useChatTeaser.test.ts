import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useChatTeaser } from "./useChatTeaser";

describe("useChatTeaser", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.sessionStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
    window.sessionStorage.clear();
  });

  it("starts hidden", () => {
    const { result } = renderHook(() => useChatTeaser());
    expect(result.current).toBe(false);
  });

  it('shows the "Nouveau message" badge after the configured delay', () => {
    const { result } = renderHook(() =>
      useChatTeaser({ showAfterMs: 1000, visibleForMs: 500, hiddenBetweenMs: 2000 }),
    );

    expect(result.current).toBe(false);
    act(() => { vi.advanceTimersByTime(999); });
    expect(result.current).toBe(false);

    act(() => { vi.advanceTimersByTime(1); });
    expect(result.current).toBe(true);
  });

  it("auto-hides the badge after visibleForMs and re-shows on next cycle", () => {
    const { result } = renderHook(() =>
      useChatTeaser({ showAfterMs: 1000, visibleForMs: 500, hiddenBetweenMs: 2000 }),
    );

    act(() => { vi.advanceTimersByTime(1000); });
    expect(result.current).toBe(true);

    act(() => { vi.advanceTimersByTime(500); });
    expect(result.current).toBe(false);

    // Wait the pause + next show delay → reappears
    act(() => { vi.advanceTimersByTime(2000 + 1000); });
    expect(result.current).toBe(true);
  });

  it("stops permanently when the chat is opened (open-chatbot event)", () => {
    const { result } = renderHook(() =>
      useChatTeaser({ showAfterMs: 1000, visibleForMs: 500, hiddenBetweenMs: 2000 }),
    );

    act(() => { vi.advanceTimersByTime(1000); });
    expect(result.current).toBe(true);

    act(() => {
      window.dispatchEvent(new CustomEvent("open-chatbot"));
    });
    expect(result.current).toBe(false);
    expect(window.sessionStorage.getItem("chat-opened")).toBe("1");

    // Even after a long wait, the badge must not reappear
    act(() => { vi.advanceTimersByTime(60_000); });
    expect(result.current).toBe(false);
  });

  it("also reacts to the chatbot-opened event", () => {
    const { result } = renderHook(() =>
      useChatTeaser({ showAfterMs: 1000, visibleForMs: 500, hiddenBetweenMs: 2000 }),
    );

    act(() => { vi.advanceTimersByTime(1000); });
    expect(result.current).toBe(true);

    act(() => {
      window.dispatchEvent(new CustomEvent("chatbot-opened"));
    });
    expect(result.current).toBe(false);

    act(() => { vi.advanceTimersByTime(60_000); });
    expect(result.current).toBe(false);
  });

  it("never shows when the chat was already opened in this session", () => {
    window.sessionStorage.setItem("chat-opened", "1");
    const { result } = renderHook(() =>
      useChatTeaser({ showAfterMs: 1000, visibleForMs: 500, hiddenBetweenMs: 2000 }),
    );

    act(() => { vi.advanceTimersByTime(60_000); });
    expect(result.current).toBe(false);
  });

  it("cleans up timers and listeners on unmount", () => {
    const { result, unmount } = renderHook(() =>
      useChatTeaser({ showAfterMs: 1000, visibleForMs: 500, hiddenBetweenMs: 2000 }),
    );

    unmount();
    // Advancing timers after unmount must not throw and must not flip state
    act(() => { vi.advanceTimersByTime(60_000); });
    expect(result.current).toBe(false);
  });
});
