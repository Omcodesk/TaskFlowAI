# Contributing to TaskFlow AI

First off, thank you for considering contributing to TaskFlow AI! It's people like you that make TaskFlow AI such a great tool.

## Where do I go from here?

If you've noticed a bug or have a feature request, make sure to check our [Issues](https://github.com/Omcodesk/Task-Assignment-Workflow-Management-System/issues) page if it already exists. If not, feel free to open a new issue!

## Fork & create a branch

If this is something you think you can fix, then fork TaskFlow AI and create a branch with a descriptive name.

A good branch name would be (where issue #325 is the ticket you're working on):

```sh
git checkout -b 325-add-dark-mode
```

## Implementation Guidelines

* Ensure your code adheres to the existing styling and architecture (MERN stack).
* If you are adding a new feature, make sure to add the necessary API routes and UI components.
* Ensure no sensitive data (like `.env` variables) are committed.

## Make a Pull Request

At this point, you should switch back to your master branch, make sure it's up to date with TaskFlow AI's master branch:

```sh
git remote add upstream https://github.com/Omcodesk/Task-Assignment-Workflow-Management-System.git
git checkout main
git pull upstream main
```

Then update your feature branch from your local copy of main, and push it!

```sh
git checkout 325-add-dark-mode
git rebase main
git push --set-upstream origin 325-add-dark-mode
```

Finally, go to GitHub and make a Pull Request! We will review it as soon as possible.
