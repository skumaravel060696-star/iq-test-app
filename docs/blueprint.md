# **App Name**: CogniAssess

## Core Features:

- Secure User Onboarding: Collect and securely store user data (Name, Email, Age, Consent) using AES-encrypted local storage upon initial app launch.
- Dynamic Test Generation: Generate a unique test for each user based on their age band, selecting questions from the local JSON question bank with a defined difficulty mix (30% easy, 50% medium, 20% hard), and randomizing question and option order. This feature will utilize a tool that chooses a mix of problems, of various kinds.
- Real-time Test Execution: Present questions one at a time with a progress indicator and a timer. The test automatically submits upon timeout or completion.
- Intelligent Scoring Engine: Calculate an ability score (θ) based on correct answers, question discrimination, and time factor. Normalize the score using age-based norms stored locally to derive the final IQ, clamped between 70-145.
- Integrated Anti-Cheat & Validity Engine: Detect anomalies such as extremely fast responses, perfect accuracy with low time, app backgrounding, screen recording (Android), and repeated answer patterns to determine test validity and output a confidence score.
- Comprehensive Result Display: Show the user's IQ score, confidence score, validity label (High/Medium/Low), and a disclaimer that it's not a clinical diagnosis on the result screen.
- Flexible Retake Logic: Enforce a minimum 7-day cooldown period before allowing users to retake the test. Label retakes as 'Practice Attempt' and prevent them from overwriting the best valid score.

## Style Guidelines:

- Primary color: Deep Indigo (#3F51B5) for a sense of intelligence and focus.
- Background color: Light Gray (#F5F5F5) to reduce distractions and ensure readability.
- Accent color: Amber (#FFC107) to highlight key elements and CTAs.
- Body and headline font: 'Inter' sans-serif for a modern and accessible feel.
- Code font: 'Source Code Pro' for configurations and logs.
- Use minimalist, line-based icons to maintain a distraction-free environment.
- Implement a clean, single-column layout for easy navigation and readability, especially during the test.
- Incorporate subtle animations for transitions between questions and to provide feedback during scoring.