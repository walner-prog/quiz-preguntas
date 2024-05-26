document.addEventListener('DOMContentLoaded', () => {
    const welcomeScreen = document.getElementById('welcome-screen');
    const quizContainer = document.getElementById('quiz-container');
    const enterButton = document.getElementById('enter-btn');

    enterButton.addEventListener('click', () => {
        welcomeScreen.style.display = 'none';
        quizContainer.style.display = 'block';
    });
});

