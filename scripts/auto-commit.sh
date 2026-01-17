#!/bin/bash

# Auto-commit and push script for She Rises website
# This script checks for build errors, commits changes, and pushes to GitHub

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting auto-commit process...${NC}"

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo -e "${RED}Error: Not in a git repository${NC}"
    exit 1
fi

# Function to check if there are uncommitted changes
check_changes() {
    if [[ -z $(git status -s) ]]; then
        echo -e "${YELLOW}No changes to commit${NC}"
        return 1
    fi
    return 0
}

# Function to run build and check for errors
check_build() {
    echo -e "${YELLOW}Running build to check for errors...${NC}"

    # Run TypeScript compiler to check for errors
    echo -e "${YELLOW}Step 1/3: TypeScript check...${NC}"
    npx tsc --noEmit 2>&1 | tee /tmp/tsc-output.txt
    TSC_EXIT_CODE=${PIPESTATUS[0]}

    if [ $TSC_EXIT_CODE -ne 0 ]; then
        echo -e "${RED}TypeScript compilation errors found:${NC}"
        cat /tmp/tsc-output.txt
        return 1
    fi
    echo -e "${GREEN}✓ TypeScript check passed${NC}"

    # Run ESLint to check for linting errors
    echo -e "${YELLOW}Step 2/3: ESLint check...${NC}"
    npx eslint src --ext .ts,.tsx 2>&1 | tee /tmp/eslint-output.txt
    ESLINT_EXIT_CODE=${PIPESTATUS[0]}

    if [ $ESLINT_EXIT_CODE -ne 0 ]; then
        echo -e "${YELLOW}ESLint warnings/errors found (continuing anyway)${NC}"
    else
        echo -e "${GREEN}✓ ESLint check passed${NC}"
    fi

    # Run full Vite build to ensure production build works
    echo -e "${YELLOW}Step 3/3: Vite production build...${NC}"
    npm run build 2>&1 | tee /tmp/vite-output.txt
    VITE_EXIT_CODE=${PIPESTATUS[0]}

    if [ $VITE_EXIT_CODE -ne 0 ]; then
        echo -e "${RED}Vite build failed:${NC}"
        cat /tmp/vite-output.txt
        return 1
    fi
    echo -e "${GREEN}✓ Vite build passed${NC}"

    echo -e "${GREEN}✓ All checks passed!${NC}"
    return 0
}

# Function to generate commit message
generate_commit_message() {
    # Get current date and time
    TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
    
    # Get list of modified files
    MODIFIED_FILES=$(git diff --name-only | head -5 | tr '\n' ', ' | sed 's/,$//')
    
    # Count number of files changed
    FILE_COUNT=$(git diff --name-only | wc -l | tr -d ' ')
    
    # Generate descriptive commit message
    if [ $FILE_COUNT -eq 1 ]; then
        COMMIT_MSG="Update: $MODIFIED_FILES - $TIMESTAMP"
    elif [ $FILE_COUNT -le 5 ]; then
        COMMIT_MSG="Update $FILE_COUNT files: $MODIFIED_FILES - $TIMESTAMP"
    else
        COMMIT_MSG="Update $FILE_COUNT files - $TIMESTAMP"
    fi
    
    echo "$COMMIT_MSG"
}

# Main script execution
main() {
    # Check for uncommitted changes
    if ! check_changes; then
        exit 0
    fi
    
    # Show current status
    echo -e "${YELLOW}Current git status:${NC}"
    git status --short
    
    # Check build for errors
    if ! check_build; then
        echo -e "${RED}Build failed! Please fix errors before committing.${NC}"
        exit 1
    fi
    
    # Add all changes
    echo -e "${YELLOW}Adding all changes...${NC}"
    git add -A
    
    # Generate commit message
    COMMIT_MESSAGE=$(generate_commit_message)
    
    # Commit changes
    echo -e "${YELLOW}Committing with message: $COMMIT_MESSAGE${NC}"
    git commit -m "$COMMIT_MESSAGE"
    
    # Get current branch
    CURRENT_BRANCH=$(git branch --show-current)
    
    # Push to remote
    echo -e "${YELLOW}Pushing to origin/$CURRENT_BRANCH...${NC}"
    git push origin "$CURRENT_BRANCH"
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Successfully committed and pushed to GitHub!${NC}"
        echo -e "${GREEN}  Branch: $CURRENT_BRANCH${NC}"
        echo -e "${GREEN}  Commit: $COMMIT_MESSAGE${NC}"
    else
        echo -e "${RED}Failed to push to GitHub. You may need to set up remote or authenticate.${NC}"
        echo -e "${YELLOW}Try running: git push --set-upstream origin $CURRENT_BRANCH${NC}"
        exit 1
    fi
}

# Run main function
main