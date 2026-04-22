# Auto-Commit Scripts for She Rises Website

This directory contains scripts to automatically commit and push changes to GitHub when there are no build errors.

## 📋 Prerequisites

1. **Git Configuration**: Make sure you have Git configured with your GitHub credentials:
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

2. **GitHub Authentication**: Ensure you're authenticated with GitHub (SSH key or token)

3. **For Watch Mode**: Install `fswatch` (optional, only for watch mode):
   ```bash
   # On macOS
   brew install fswatch
   
   # On Ubuntu/Debian
   sudo apt-get install fswatch
   ```

## 🚀 Usage

### Method 1: Manual Commit (Recommended)
Run this command whenever you want to commit your changes:
```bash
npm run commit
```

This will:
- Check for TypeScript errors
- Check for ESLint errors
- If no errors, commit all changes with an auto-generated message
- Push to GitHub

### Method 2: Watch Mode (Advanced)
Automatically commit when files change:
```bash
npm run watch-commit
```

This will:
- Watch for file changes in the `src` directory
- Wait 5 seconds after a change (debounce)
- Run the auto-commit process
- Continue watching for more changes

Press `Ctrl+C` to stop watching.

### Method 3: Direct Script Usage
```bash
# Manual commit
./scripts/auto-commit.sh

# Watch mode
./scripts/watch-and-commit.sh
```

## 📝 Available NPM Scripts

- `npm run commit` - Run auto-commit once
- `npm run watch-commit` - Watch for changes and auto-commit
- `npm run typecheck` - Check TypeScript errors only
- `npm run lint` - Check ESLint errors only
- `npm run check` - Run both TypeScript and ESLint checks

## ⚙️ How It Works

1. **Error Checking**: The script first runs TypeScript compiler and ESLint to check for errors
2. **Auto-Generated Messages**: Commit messages are automatically generated with:
   - List of modified files (up to 5)
   - Number of files changed
   - Timestamp
3. **Git Operations**: If no errors are found, the script:
   - Adds all changes (`git add -A`)
   - Commits with the generated message
   - Pushes to the current branch on GitHub

## 🛠️ Customization

### Change Watch Directory
Edit `WATCH_DIR` in `watch-and-commit.sh`:
```bash
WATCH_DIR="./src"  # Change to watch different directory
```

### Change Debounce Time
Edit `DEBOUNCE_SECONDS` in `watch-and-commit.sh`:
```bash
DEBOUNCE_SECONDS=5  # Wait time in seconds after file change
```

### Modify Commit Message Format
Edit the `generate_commit_message()` function in `auto-commit.sh` to customize the commit message format.

## ⚠️ Important Notes

1. **Build Errors**: The script will NOT commit if there are TypeScript compilation errors
2. **ESLint Warnings**: ESLint warnings will show but won't prevent commits (only errors will)
3. **Large Commits**: Be careful with watch mode as it will commit all changes automatically
4. **Branch Protection**: Make sure you have permission to push to the current branch

## 🔧 Troubleshooting

### "Not in a git repository"
Make sure you're in the project root directory and it's initialized as a git repo:
```bash
git init
git remote add origin https://github.com/yourusername/your-repo.git
```

### "Failed to push to GitHub"
You may need to set the upstream branch:
```bash
git push --set-upstream origin main
```

### "Permission denied"
Make sure the scripts are executable:
```bash
chmod +x scripts/*.sh
```

### "fswatch: command not found"
Install fswatch for watch mode:
```bash
brew install fswatch  # macOS
```

## 📄 Example Output

```bash
$ npm run commit

Starting auto-commit process...
Current git status:
M  src/pages/Index.tsx
M  src/pages/About.tsx

Running build to check for errors...
✓ Build check passed!

Adding all changes...
Committing with message: Update 2 files: src/pages/Index.tsx, src/pages/About.tsx - 2025-01-13 10:30:45
Pushing to origin/main...
✓ Successfully committed and pushed to GitHub!
  Branch: main
  Commit: Update 2 files: src/pages/Index.tsx, src/pages/About.tsx - 2025-01-13 10:30:45
```

## 💡 Tips

- Use manual mode (`npm run commit`) for important commits where you want to review changes
- Use watch mode (`npm run watch-commit`) during active development sessions
- Always ensure your GitHub authentication is working before using these scripts
- Consider adding a `.gitignore` for files you don't want to auto-commit