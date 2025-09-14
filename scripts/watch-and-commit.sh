#!/bin/bash

# Watch for file changes and auto-commit when no errors
# Uses fswatch (install with: brew install fswatch)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
WATCH_DIR="./src"
DEBOUNCE_SECONDS=5
LAST_RUN=0

echo -e "${BLUE}╔══════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     She Rises Auto-Commit Watch Mode                  ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}Watching for changes in: $WATCH_DIR${NC}"
echo -e "${YELLOW}Debounce time: ${DEBOUNCE_SECONDS} seconds${NC}"
echo -e "${GREEN}Press Ctrl+C to stop${NC}"
echo ""

# Check if fswatch is installed
if ! command -v fswatch &> /dev/null; then
    echo -e "${RED}Error: fswatch is not installed${NC}"
    echo -e "${YELLOW}Install it with: brew install fswatch${NC}"
    echo -e "${YELLOW}Or on Ubuntu/Debian: sudo apt-get install fswatch${NC}"
    exit 1
fi

# Check if auto-commit.sh exists
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
AUTO_COMMIT_SCRIPT="$SCRIPT_DIR/auto-commit.sh"

if [ ! -f "$AUTO_COMMIT_SCRIPT" ]; then
    echo -e "${RED}Error: auto-commit.sh not found at $AUTO_COMMIT_SCRIPT${NC}"
    exit 1
fi

# Make auto-commit.sh executable
chmod +x "$AUTO_COMMIT_SCRIPT"

# Function to handle file changes
handle_change() {
    CURRENT_TIME=$(date +%s)
    TIME_DIFF=$((CURRENT_TIME - LAST_RUN))
    
    # Debounce: Only run if enough time has passed since last run
    if [ $TIME_DIFF -lt $DEBOUNCE_SECONDS ]; then
        return
    fi
    
    LAST_RUN=$CURRENT_TIME
    
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}[$(date '+%Y-%m-%d %H:%M:%S')] File change detected!${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    # Wait a moment for file operations to complete
    sleep 1
    
    # Run the auto-commit script
    "$AUTO_COMMIT_SCRIPT"
    
    echo -e "${GREEN}Waiting for more changes...${NC}"
}

# Export the function so it's available to the subshell
export -f handle_change
export LAST_RUN
export DEBOUNCE_SECONDS
export AUTO_COMMIT_SCRIPT
export RED GREEN YELLOW BLUE NC

# Watch for changes using fswatch
fswatch -o "$WATCH_DIR" --exclude "\.git" --exclude "node_modules" --exclude "dist" --exclude "build" | while read change
do
    handle_change
done