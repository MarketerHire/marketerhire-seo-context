#!/bin/bash
# Weekly SEO Audit — runs via cron
# Schedule: Monday 9 AM PT (16:00 UTC)
# Cron: 0 16 * * 1 /home/exedev/mh-os/seo/bin/weekly-audit.sh

set -euo pipefail

LOG_DIR="/home/exedev/mh-os/seo/audit/logs"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/audit-$(date +%Y-%m-%d).log"

echo "=== SEO Audit started at $(date) ===" >> "$LOG_FILE"

cd /home/exedev/mh-os

claude -p \
  --dangerously-skip-permissions \
  --allowedTools "Read,Write,Edit,Bash,Grep,Glob" \
  --max-budget-usd 5 \
  "Run /seo-audit. Follow every step in seo/.claude/commands/seo-audit.md. Write all outputs to Supabase and the local registry. Do not ask for confirmation — execute fully." \
  >> "$LOG_FILE" 2>&1

echo "=== SEO Audit finished at $(date) ===" >> "$LOG_FILE"
