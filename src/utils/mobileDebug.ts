// Mobile Debug Utilities
export const mobileDebug = {
  // Detect mobile device
  isMobile: (): boolean => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  },

  // Detect iOS
  isIOS: (): boolean => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  },

  // Detect Android
  isAndroid: (): boolean => {
    return /Android/.test(navigator.userAgent);
  },

  // Get browser info
  getBrowserInfo: () => {
    const ua = navigator.userAgent;
    const browsers = {
      chrome: /Chrome/.test(ua) && /Google Inc/.test(navigator.vendor),
      safari: /Safari/.test(ua) && /Apple Computer/.test(navigator.vendor),
      firefox: /Firefox/.test(ua),
      edge: /Edg/.test(ua),
      samsung: /SamsungBrowser/.test(ua),
    };
    
    return {
      userAgent: ua,
      browsers,
      isMobile: mobileDebug.isMobile(),
      isIOS: mobileDebug.isIOS(),
      isAndroid: mobileDebug.isAndroid(),
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
    };
  },

  // Check for common mobile issues
  checkMobileIssues: () => {
    const issues: string[] = [];
    const info = mobileDebug.getBrowserInfo();
    const ua = info.userAgent;

    // Check viewport
    if (info.viewportWidth < 320) {
      issues.push('Viewport muito pequeno (< 320px)');
    }

    // Check for old browsers
    if (info.browsers.chrome) {
      const chromeVersion = parseInt(ua.match(/Chrome\/(\d+)/)?.[1] || '0');
      if (chromeVersion < 80) {
        issues.push('Chrome muito antigo (< 80)');
      }
    }

    if (info.browsers.safari && info.isIOS) {
      const iosVersion = parseFloat(ua.match(/OS (\d+)_/)?.[1] || '0');
      if (iosVersion < 12) {
        issues.push('iOS muito antigo (< 12)');
      }
    }

    // Check for touch support
    if (!('ontouchstart' in window)) {
      issues.push('Dispositivo não suporta touch');
    }

    // Check for modern JavaScript features
    if (typeof Promise === 'undefined') {
      issues.push('Promise não suportado');
    }

    if (typeof fetch === 'undefined') {
      issues.push('Fetch API não suportado');
    }

    if (typeof localStorage === 'undefined') {
      issues.push('LocalStorage não suportado');
    }

    return {
      issues,
      info,
      hasIssues: issues.length > 0,
    };
  },

  // Log debug info to console
  logDebugInfo: () => {
    const check = mobileDebug.checkMobileIssues();
    console.group('🔍 Mobile Debug Info');
    console.log('📱 Device Info:', check.info);
    console.log('⚠️ Issues:', check.issues);
    console.log('✅ Has Issues:', check.hasIssues);
    console.groupEnd();
    
    return check;
  },

  // Test touch events
  testTouchEvents: () => {
    const testElement = document.createElement('div');
    testElement.style.position = 'fixed';
    testElement.style.top = '0';
    testElement.style.left = '0';
    testElement.style.width = '100%';
    testElement.style.height = '100%';
    testElement.style.background = 'rgba(0,0,0,0.5)';
    testElement.style.zIndex = '9999';
    testElement.style.display = 'flex';
    testElement.style.alignItems = 'center';
    testElement.style.justifyContent = 'center';
    testElement.style.color = 'white';
    testElement.style.fontSize = '24px';
    testElement.textContent = 'Teste de Touch - Toque na tela';
    
    document.body.appendChild(testElement);
    
    const cleanup = () => {
      document.body.removeChild(testElement);
    };
    
    testElement.addEventListener('touchstart', () => {
      console.log('✅ Touch events funcionando');
      cleanup();
    });
    
    testElement.addEventListener('click', () => {
      console.log('✅ Click events funcionando');
      cleanup();
    });
    
    // Auto cleanup after 5 seconds
    setTimeout(cleanup, 5000);
  }
};

// Auto-run debug on mobile devices
if (mobileDebug.isMobile()) {
  // Run debug after page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(mobileDebug.logDebugInfo, 1000);
    });
  } else {
    setTimeout(mobileDebug.logDebugInfo, 1000);
  }
}
