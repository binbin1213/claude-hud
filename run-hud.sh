#!/bin/bash
# claude-hud wrapper script to ensure environment variables are passed
# Read token from settings.json
SETTINGS_FILE="$HOME/.claude/settings.json"
if [ -f "$SETTINGS_FILE" ]; then
    TOKEN=$(grep '"ANTHROPIC_AUTH_TOKEN"' "$SETTINGS_FILE" | sed 's/.*: *"\([^"]*\)".*/\1/')
    ANTHROPIC_AUTH_TOKEN="$TOKEN" exec node "$HOME/.claude/plugins/marketplaces/claude-hud/dist/index.js"
else
    exec node "$HOME/.claude/plugins/marketplaces/claude-hud/dist/index.js"
fi
