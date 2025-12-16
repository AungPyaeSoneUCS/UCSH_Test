document.addEventListener('DOMContentLoaded', function() {
  animateStepsProgress();
  setupTouchFeedback();
});

function animateStepsProgress() {
  const stepCounter = document.getElementById('step-counter');
  const progressRing = document.getElementById('progress-ring');

  if (!stepCounter || !progressRing) return;

  const maxSteps = 10000;
  const currentSteps = 6916;
  let displayedSteps = 0;

  const circumference = 2 * Math.PI * 88;
  progressRing.style.strokeDasharray = circumference;
  progressRing.style.strokeDashoffset = circumference;

  const stepInterval = setInterval(() => {
    displayedSteps += Math.ceil(currentSteps / 60);
    if (displayedSteps >= currentSteps) {
      displayedSteps = currentSteps;
      clearInterval(stepInterval);
    }

    stepCounter.textContent = displayedSteps.toLocaleString();

    const offset = circumference - (displayedSteps / maxSteps) * circumference;
    progressRing.style.strokeDashoffset = offset;
  }, 20);
}

function setupTouchFeedback() {
  const interactiveElements = document.querySelectorAll('.workout-card, .achievement, .chart-bar, .recommendation-action, .nav-item');

  interactiveElements.forEach(element => {
    element.addEventListener('touchstart', () => {
      element.classList.add('touch-active');
    });

    ['touchend', 'touchcancel'].forEach(event => {
      element.addEventListener(event, () => {
        element.classList.remove('touch-active');
      });
    });
  });
}