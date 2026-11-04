"use client";

import { useState, useCallback } from "react";

export default function BatchControls() {
  const [count, setCount] = useState(5);
  const [copied, setCopied] = useState(false);

  const command = `/seo-machine brand="marketerhire" count=${count}`;

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(command).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [command]);

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="h-1 bg-mh-pink" />
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <svg
            className="h-5 w-5 text-mh-pink"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z"
            />
          </svg>
          <h3 className="text-sm font-semibold text-mh-black">
            Produce Articles
          </h3>
        </div>

        <p className="text-xs text-gray-500 mb-4">
          Start a Claude Code session and run the command below to produce
          articles in batch via the article machine.
        </p>

        <div className="flex items-center gap-3">
          {/* Count input */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="batch-count"
              className="text-xs text-gray-500 font-medium"
            >
              Count:
            </label>
            <input
              id="batch-count"
              type="number"
              min={1}
              max={20}
              value={count}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                if (!isNaN(v) && v >= 1 && v <= 20) setCount(v);
              }}
              className="w-16 px-2 py-1.5 text-sm border border-gray-200 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-mh-pink/30 focus:border-mh-pink"
            />
          </div>

          {/* Command display + copy */}
          <div className="flex-1 flex items-center gap-2">
            <code className="flex-1 bg-mh-gray px-3 py-1.5 rounded-lg text-xs text-gray-700 font-mono truncate border border-gray-200">
              {command}
            </code>
            <button
              type="button"
              onClick={handleCopy}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                copied
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-mh-pink text-white hover:bg-mh-pink/90"
              }`}
            >
              {copied ? (
                <>
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Copied
                </>
              ) : (
                <>
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9.75a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
