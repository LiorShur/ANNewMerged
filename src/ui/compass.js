// Compass rotation functionality
export class CompassController {
  constructor() {
    this.isRotationEnabled = false;
    this.currentHeading = 0;
    this.dependencies = {};
    this.orientationHandler = null;
  }

  setDependencies(deps) {
    this.dependencies = deps;
  }

  initialize() {
    this.setupToggleButton();
    this.checkDeviceSupport();
    console.log('Compass controller initialized');
  }

  setupToggleButton() {
    const toggleBtn = document.getElementById('toggleBtn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        this.toggleRotation();
      });
    }
  }

  async checkDeviceSupport() {
    if (!window.DeviceOrientationEvent) {
      console.warn('Device orientation not supported');
      return false;
    }

    // For iOS 13+, request permission
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const permission = await DeviceOrientationEvent.requestPermission();
        return permission === 'granted';
      } catch (error) {
        console.error('Permission request failed:', error);
        return false;
      }
    }

    return true;
  }

  async toggleRotation() {
    if (!await this.checkDeviceSupport()) {
      alert('Compass rotation requires device orientation access. Please enable it in your browser settings.');
      return;
    }

    if (this.isRotationEnabled) {
      this.disableRotation();
    } else {
      this.enableRotation();
    }
  }

  enableRotation() {
    if (this.isRotationEnabled) return;

    this.orientationHandler = (event) => {
      this.handleOrientationChange(event);
    };

    window.addEventListener('deviceorientation', this.orientationHandler);
    this.isRotationEnabled = true;
    
    this.updateToggleButton();
    console.log('Compass rotation enabled');
  }

  disableRotation() {
    if (!this.isRotationEnabled) return;

    if (this.orientationHandler) {
      window.removeEventListener('deviceorientation', this.orientationHandler);
      this.orientationHandler = null;
    }

    this.isRotationEnabled = false;
    
    // Reset rotation
    this.resetMapRotation();
    this.resetCompassRotation();
    
    this.updateToggleButton();
    console.log('Compass rotation disabled');
  }

  handleOrientationChange(event) {
    if (!this.isRotationEnabled) return;

    let heading = null;

    // Try different sources for compass heading
    if (typeof event.webkitCompassHeading !== "undefined") {
      // iOS Safari
      heading = event.webkitCompassHeading;
    } else if (event.alpha !== null && event.alpha !== undefined) {
      // Android Chrome and others
      heading = event.alpha;
    }

    if (heading !== null) {
      this.currentHeading = heading;
      this.updateRotations();
    }
  }

  updateRotations() {
    this.updateMapRotation();
    this.updateCompassRotation();
    this.updateHeadingDisplay();
  }

  updateMapRotation() {
    if (!this.dependencies.map || !this.isRotationEnabled) return;

    try {
      this.dependencies.map.setRotation(this.currentHeading);
    } catch (error) {
      console.error('Failed to update map rotation:', error);
    }
  }

  updateCompassRotation() {
    const needleElement = document.getElementById('compass-needle');
    if (!needleElement) return;

    // The needle should point north, so rotate opposite to device heading
    const needleRotation = -this.currentHeading;
    needleElement.style.transform = `rotate(${needleRotation}deg)`;
  }

  updateHeadingDisplay() {
  const headingValue = document.getElementById('heading-value');
  if (!headingValue) return;

  // Round to nearest degree
  const roundedHeading = Math.round(this.currentHeading);
  headingValue.textContent = `${roundedHeading}°`;
  
  // Add cardinal direction
  const cardinal = this.getCardinalDirection(roundedHeading);
  headingValue.setAttribute('data-cardinal', cardinal);
}

getCardinalDirection(heading) {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(((heading % 360) / 45)) % 8;
  return directions[index];
}

  updateToggleButton() {
    const toggleBtn = document.getElementById('toggleBtn');
    if (!toggleBtn) return;

    if (this.isRotationEnabled) {
      toggleBtn.style.background = '#4CAF50';
      toggleBtn.title = 'Disable Rotation';
    } else {
      toggleBtn.style.background = 'rgba(0, 0, 0, 0.8)';
      toggleBtn.title = 'Enable Rotation';
    }
  }

  resetMapRotation() {
    if (!this.dependencies.map) return;

    try {
      this.dependencies.map.resetRotation();
    } catch (error) {
      console.error('Failed to reset map rotation:', error);
    }
  }

  resetCompassRotation() {
    const needleElement = document.getElementById('compass-needle');
    if (!needleElement) return;
    
    needleElement.style.transform = 'rotate(0deg)';
  }

  getCurrentHeading() {
    return this.currentHeading;
  }

  isRotationActive() {
    return this.isRotationEnabled;
  }

  cleanup() {
    this.disableRotation();
    console.log('Compass controller cleaned up');
  }
}