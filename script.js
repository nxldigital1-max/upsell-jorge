document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // Countdown Timer Logic (5 Minutes)
  const timerElement = document.getElementById('countdownTimer');
  let durationInSeconds = 5 * 60;

  function updateTimer() {
    const minutes = Math.floor(durationInSeconds / 60);
    const seconds = durationInSeconds % 60;
    
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    
    if (timerElement) {
      timerElement.textContent = `${formattedMinutes}:${formattedSeconds}`;
    }

    if (durationInSeconds > 0) {
      durationInSeconds--;
    } else {
      clearInterval(timerInterval);
    }
  }

  const timerInterval = setInterval(updateTimer, 1000);

  // Video Sound & Play/Pause Control
  const video = document.getElementById('heroVideo');
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const heroMediaCard = document.getElementById('heroMediaCard');
  const videoWrap = document.querySelector('.video-container-wrap');
  const videoStateOverlay = document.getElementById('videoStateOverlay');
  const videoStateIcon = document.getElementById('videoStateIcon');

  let hasActivatedSound = false;
  let overlayTimeout;

  function showStateIndicator(isPlaying) {
    if (!videoStateOverlay || !videoStateIcon) return;
    clearTimeout(overlayTimeout);

    if (isPlaying) {
      videoStateIcon.className = 'video-state-icon playing';
      videoStateOverlay.classList.add('visible');
      overlayTimeout = setTimeout(() => {
        videoStateOverlay.classList.remove('visible');
      }, 700);
    } else {
      videoStateIcon.className = 'video-state-icon paused';
      videoStateOverlay.classList.add('visible');
    }
  }

  function handleVideoActivation() {
    if (!hasActivatedSound) {
      hasActivatedSound = true;
      video.muted = false;
      video.currentTime = 0; // Only reset to 0:00 on the initial activation
      video.play().catch(e => console.log('Audio playback permission:', e));
      if (heroMediaCard) {
        heroMediaCard.classList.add('sound-active');
      }
    } else {
      // Toggle play / pause WITHOUT resetting currentTime
      if (video.paused) {
        video.play().catch(e => console.log('Video play error:', e));
        showStateIndicator(true);
      } else {
        video.pause();
        showStateIndicator(false);
      }
    }
  }

  if (soundToggleBtn && video) {
    soundToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      handleVideoActivation();
    });
  }

  if (videoWrap && video) {
    videoWrap.addEventListener('click', () => {
      handleVideoActivation();
    });
  }

  // Auto-remove black background from logo for 100% clean transparent rendering
  const logoImg = document.querySelector('.brand-logo-img');
  if (logoImg) {
    const processLogo = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = logoImg.naturalWidth || 300;
        canvas.height = logoImg.naturalHeight || 120;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(logoImg, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        for (let i = 0; i < data.length; i += 4) {
          const maxVal = Math.max(data[i], data[i+1], data[i+2]);
          if (maxVal < 22) {
            data[i+3] = 0;
          } else if (maxVal < 55) {
            data[i+3] = Math.round(((maxVal - 22) / (55 - 22)) * 255);
          }
        }
        ctx.putImageData(imgData, 0, 0);
        logoImg.src = canvas.toDataURL('image/png');
        logoImg.classList.add('processed');
      } catch (e) {
        console.log('Logo transparency fallback to CSS screen blend mode:', e);
      }
    };

    if (logoImg.complete) {
      processLogo();
    } else {
      logoImg.addEventListener('load', processLogo);
    }
  }

  // Luck Meter Animation (0 to 86%)
  const luckPercentVal = document.getElementById('luckPercentVal');
  const luckBarFill = document.getElementById('luckBarFill');

  if (luckPercentVal && luckBarFill) {
    luckBarFill.style.width = '0%';
    let currentPercent = 0;
    const targetPercent = 86;
    const duration = 1400; // 1.4s
    const startTime = performance.now();

    const animateMeter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      currentPercent = Math.round(easeProgress * targetPercent);
      
      luckPercentVal.textContent = `${currentPercent}%`;
      luckBarFill.style.width = `${easeProgress * targetPercent}%`;

      if (progress < 1) {
        requestAnimationFrame(animateMeter);
      } else {
        luckPercentVal.textContent = `${targetPercent}%`;
        luckBarFill.style.width = `${targetPercent}%`;
      }
    };

    setTimeout(() => {
      requestAnimationFrame(animateMeter);
    }, 300);
  }
});
