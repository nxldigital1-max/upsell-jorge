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

  // Video Sound / Unmute Control
  const video = document.getElementById('heroVideo');
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const soundPillText = document.getElementById('soundPillText');
  const soundIcon = document.getElementById('soundIcon');

  if (soundToggleBtn && video) {
    soundToggleBtn.addEventListener('click', () => {
      if (video.muted) {
        video.muted = false;
        video.currentTime = 0;
        video.play().catch(e => console.log('Audio playback permission:', e));
        if (soundPillText) soundPillText.textContent = '🔊 Som ativado';
        if (soundIcon) soundIcon.classList.add('playing');
        
        // Softly fade out sound button after activation for clean viewing
        setTimeout(() => {
          soundToggleBtn.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          soundToggleBtn.style.opacity = '0.4';
        }, 1500);
      } else {
        video.muted = true;
        if (soundPillText) soundPillText.textContent = '🔊 Toca pra ouvir';
        if (soundIcon) soundIcon.classList.remove('playing');
        soundToggleBtn.style.opacity = '1';
      }
    });

    // Hover or touch on faded button brings it back
    soundToggleBtn.addEventListener('mouseenter', () => {
      soundToggleBtn.style.opacity = '1';
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
});
