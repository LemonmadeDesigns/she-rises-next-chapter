# How to Make Changes to the Website

## Step 1: Open VS Code

1. Press **Command + Space** on your keyboard
2. Type **Visual Studio Code**
3. Press **Enter**
4. Click **File** > **Open Folder**
5. Navigate to **Desktop** > **SheRises** > **she-rises-next-chapter**
6. Click **Open**

---

## Step 2: Open the Terminal in VS Code

Press **Command + J** on your keyboard

A terminal panel will appear at the bottom of VS Code.

---

## Step 3: Start Claude Code

Type this and press **Enter**:

```
claude
```

Wait for Claude to start up.

---

## Step 4: Tell Claude What You Want

Just type what you want in plain English. Examples:

- "Change the phone number to 555-123-4567"
- "Update the address to 123 Main Street"
- "Change the button color to blue"
- "Add a new paragraph that says Welcome to our site"

Press **Enter** and Claude will make the changes for you.

---

## Step 5: Save and Publish Your Changes

After Claude makes your changes, type this and press **Enter**:

```
npm run commit
```

This will:
1. Check that everything works
2. Save your changes
3. Push to GitHub
4. Update the live website automatically

---

## That's It!

Your changes will appear on **safehavenforempowerment.org** within a few minutes.

---

## Quick Reference

| What You Want | What to Do |
|---------------|------------|
| Open VS Code | **Command + Space**, type "Visual Studio Code" |
| Open Terminal in VS Code | **Command + J** |
| Start Claude | Type `claude` and press Enter |
| Save & publish | Type `npm run commit` and press Enter |
| Exit Claude | Type `exit` or press **Ctrl + C** |
