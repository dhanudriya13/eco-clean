/**
 * EcoClean Modul Edukasi & Simulator Dampak Lingkungan
 */

class ImpactSimulator {
  constructor() {
    this.oilSlider = document.getElementById('impactOilSlider');
    this.oilDisplay = document.getElementById('impactOilDisplay');
    this.waterSavedDisplay = document.getElementById('waterSavedCount');
    this.co2SavedDisplay = document.getElementById('co2SavedCount');
    this.fatbergAvertedDisplay = document.getElementById('fatbergAvertedCount');

    this.init();
  }

  init() {
    if (!this.oilSlider) return;

    this.oilSlider.addEventListener('input', (e) => {
      this.updateImpact(parseFloat(e.target.value));
    });

    // Inisialisasi awal
    this.updateImpact(parseFloat(this.oilSlider.value) || 5);
  }

  updateImpact(litres) {
    if (this.oilDisplay) {
      this.oilDisplay.textContent = `${litres} Liter`;
    }

    const waterSaved = litres * IMPACT_MULTIPLIERS.waterSavedPerLitre;
    const co2Saved = (litres * IMPACT_MULTIPLIERS.co2AvoidedPerLitre).toFixed(1);
    const fatbergAverted = (litres * IMPACT_MULTIPLIERS.fatbergMassAvertedPerLitre).toFixed(1);

    if (this.waterSavedDisplay) {
      this.waterSavedDisplay.textContent = waterSaved.toLocaleString('id-ID') + ' Liter';
    }

    if (this.co2SavedDisplay) {
      this.co2SavedDisplay.textContent = `${co2Saved} kg`;
    }

    if (this.fatbergAvertedDisplay) {
      this.fatbergAvertedDisplay.textContent = `${fatbergAverted} kg`;
    }

    // Jalur slider
    const min = parseFloat(this.oilSlider.min) || 1;
    const max = parseFloat(this.oilSlider.max) || 100;
    const pct = ((litres - min) / (max - min)) * 100;
    this.oilSlider.style.background = `linear-gradient(90deg, var(--primary) ${pct}%, var(--bg-subtle-hover) ${pct}%)`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.impactSimulator = new ImpactSimulator();
});
