# Rock Paper Scissors (Gesture Recognition Game)

A browser-based Rock Paper Scissors game where you play using real hand gestures detected via your webcam. The interface is styled with **Tailwind CSS** for a clean, modern, and responsive experience.  
**MediaPipe** is used for real-time hand tracking and gesture recognition, powering the core gameplay.

---

## About MediaPipe

[MediaPipe](https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker) is an open-source, cross-platform framework developed by Google for building and deploying machine learning pipelines, especially for processing live and streaming media like video and audio.  
In this project, MediaPipe's hand tracking solution detects your hand and recognizes gestures (rock, paper, or scissors) directly in the browser, enabling fast and accurate gameplay.  
MediaPipe is optimized for real-time, on-device processing, making it ideal for interactive applications like this game.

---

## Features

- **Gesture Recognition:** Play by showing rock, paper, or scissors gestures to your webcam, detected using MediaPipe.
- **Webcam Integration:** Uses your device camera for real-time hand tracking.
- **AI Opponent:** Play against a computer that randomly selects its move.
- **Score & Rounds:** First to 3 wins, with score and round tracking.
- **Responsive UI:** Styled with Tailwind CSS for a seamless experience on all devices.
- **Privacy Friendly:** All video processing happens locally in your browser.

---

## How It Works

1. **Start the Game:** Click "Start Game" to activate your webcam.
2. **Show a Gesture:** When prompted, show one of the following gestures:
    - ✊ Rock: Make a fist.
    - ✋ Paper: Open your palm.
    - ✌️ Scissors: Extend your index and middle fingers.
3. **AI Move:** The computer randomly picks its move.
4. **Result:** The game compares moves, updates the score, and displays the result.
5. **Next Round:** Click "Next Round" to play again. First to 3 points wins.

---

## Technologies Used

- **JavaScript** (game logic, gesture detection)
- **MediaPipe Hands** (real-time hand landmark detection and gesture recognition)
- **Tailwind CSS** (UI styling)
- **HTML5 Canvas** (drawing hand landmarks)
- **Webcam API** (camera access)

---

## Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Edge, etc.)
- Functional webcam

### Run Locally

1. **Clone the repository:**
    ```
    git clone https://github.com/Anshuman2305/rps_project.git
    cd rps_project
    ```

2. **Open `index.html` in your browser.**
    - Double-click `index.html` or right-click and select "Open with" → your browser.

3. **Allow camera access** when prompted.

---

## Privacy

- All video and gesture processing is done locally in your browser.
- No video or personal data is sent to any server.

---

## License

This project is open source and available under the [MIT License](LICENSE).

---


