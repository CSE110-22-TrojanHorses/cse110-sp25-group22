# Team Page

[View our Team page](admin/team.md)

# Status Video 1

[Status Video #1 Youtube Link](https://youtu.be/EruypN3kkbo)  
[Status Video #1 Repo Link](admin/videos/statusvideo1.mp4)

# Greeting Card Editor – CSE110 Group 22

## Overview

This is an interactive editor for custom digital greeting cards. Users can add, move, and delete basic shapes on a card using a custom toolbar and navigation bar. The project uses Web Components with encapsulated styles and DOM logic.

---

**Our app is deployed using Github pages. It is [currently live](https://cse110-22-trojanhorses.github.io/cse110-sp25-group22/pages/home_page/homepage.html)!**

## To run tests locally:

- Make sure you install Jest by typing it into the command line
  - npm install --save-dev jest
- npm run test:e2e within the command line.

## Contributing

If you want to build/copy off this project, follow the guidelines below on how to fork, clone, create branches, publish changes, and submit pull requests. We also outline styling practices using ESLint and Prettier in VS Code.

### 1. **Fork the repository**

- Click the **Fork** button in the top-right corner of GitHub to create a copy under your account.

### 2. **Clone your fork locally**

- On the terminal of your preferred choice of Code Editor, type git clone https://github.com/CSE110-22-TrojanHorses/cse110-sp25-group22.git
- cd cse110-sp25-group22 to go to that particular folder
- Then run npm install in the terminal to download basic dependencies

### 3. **Creating a Branch**

- Always create a new branch for each feature or fix rather than committing directly to main
- Use this command on the terminal: git checkout -b your-feature-name

### 4. **Installing ESLint Prettier**

- If you want to follow our styling method, download the ESLint and Prettier extensions on VS Code if that’s the editor you’re using
  - Then run npm install --save-dev eslint prettier
- Go to command palette (gear symbol in left nav)
- Open settings.json
- Make sure these are in it:
  - "editor.formatOnSave": true,
  - "eslint.format.enable": true,
  - that allows formatting on save

### 5. **Committing & Pushing**

- When committing your changes, ensure you commit with a clear statement on what is being added
  - git add .
  - git commit -m "Add feature: allow shape rotation"
- git push origin feature/your-feature-name

### 6. **Creating a Pull Request**

- After you push from your branch head back to the Github Repo and you should see
  - "Compare & pull request", click on it
- There, you can fill in the title of the change and a summary of what was done
- Once that's done, you can submit the pull request, and a team member will come and review the changes
  5
