/**
 * EcoClean Modul Kalkulator Saponifikasi NaOH
 * Rumus: Gram NaOH = Minyak Jelantah (Liter) * 0.141
 */

class SoapCalculator {
  constructor() {
    this.oilInput = document.getElementById('oilVolumeInput');
    this.oilSlider = document.getElementById('oilVolumeSlider');
    this.presetButtons = document.querySelectorAll('.preset-btn');
    
    // Elemen Output DOM
    this.naohResultDisplay = document.getElementById('naohResult');
    this.waterResultDisplay = document.getElementById('waterResult');
    this.soapYieldDisplay = document.getElementById('soapYieldResult');
    this.applyToTutorialBtn = document.getElementById('applyToTutorialBtn');
    this.copyRecipeBtn = document.getElementById('copyRecipeBtn');

    // Status / State
    this.currentLitre = 1.0;
    this.currentNaohGrams = 0.141;

    this.init();
  }

  init() {
    if (!this.oilInput || !this.oilSlider) return;

    // Sinkronisasi slider dan input angka
    this.oilInput.addEventListener('input', (e) => {
      let val = parseFloat(e.target.value);
      if (isNaN(val) || val < 0.1) val = 0.1;
      if (val > 50) val = 50;
      this.setOilVolume(val, false);
    });

    this.oilSlider.addEventListener('input', (e) => {
      this.setOilVolume(parseFloat(e.target.value), true);
    });

    // Tombol Preset
    this.presetButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const val = parseFloat(btn.getAttribute('data-volume'));
        this.setOilVolume(val, true);
        this.updateActivePreset(btn);
      });
    });

    // Tombol "Terapkan ke Panduan Sabun"
    if (this.applyToTutorialBtn) {
      this.applyToTutorialBtn.addEventListener('click', () => {
        this.applyBatchToTutorial();
      });
    }

    // Tombol "Salin Resep"
    if (this.copyRecipeBtn) {
      this.copyRecipeBtn.addEventListener('click', () => {
        this.copyRecipeToClipboard();
      });
    }

    // Hitung awal
    this.calculate();
  }

  setOilVolume(litre, syncInput = true) {
    this.currentLitre = Math.round(litre * 100) / 100;
    if (syncInput) {
      this.oilInput.value = this.currentLitre;
    }
    this.oilSlider.value = this.currentLitre;

    // Warna jalur slider
    const min = parseFloat(this.oilSlider.min) || 0.1;
    const max = parseFloat(this.oilSlider.max) || 10;
    const percentage = ((this.currentLitre - min) / (max - min)) * 100;
    this.oilSlider.style.background = `linear-gradient(90deg, var(--primary) ${percentage}%, var(--bg-subtle-hover) ${percentage}%)`;

    this.calculate();
  }

  updateActivePreset(activeBtn) {
    this.presetButtons.forEach(btn => btn.classList.remove('active'));
    if (activeBtn) activeBtn.classList.add('active');
  }

  calculate() {
    // Rumus PRD: Gram of NaOH = used oil in litre * 0.141
    const naohGrams = this.currentLitre * 0.141;
    this.currentNaohGrams = naohGrams;

    // Rasio Minyak : Air = 7 : 2 (Setiap 7 bagian volume minyak membutuhkan 2 bagian air suling)
    const waterLitre = (this.currentLitre * 2) / 7;
    const waterGrams = waterLitre * 1000; // 1 Liter air = 1000 gram

    // Estimasi berat sabun (berat jenis minyak ~920g/L + NaOH + air)
    const estimatedYieldGrams = (this.currentLitre * 920) + naohGrams + waterGrams;
    const estimatedBars = Math.max(1, Math.round(estimatedYieldGrams / 100));

    // Perbarui Tampilan
    if (this.naohResultDisplay) {
      const formattedNaoh = naohGrams < 1 
        ? naohGrams.toFixed(3) 
        : naohGrams.toFixed(2);
      this.naohResultDisplay.textContent = formattedNaoh;
      const heroQuick = document.getElementById('heroQuickDisplay');
      if (heroQuick) heroQuick.textContent = formattedNaoh;
    }

    if (this.waterResultDisplay) {
      this.waterResultDisplay.textContent = `${waterGrams.toFixed(1)} g (~${Math.round(waterGrams)} ml)`;
    }

    if (this.soapYieldDisplay) {
      this.soapYieldDisplay.textContent = `~${estimatedBars} batang (${Math.round(estimatedYieldGrams)}g)`;
    }

    // Kirim event ke komponen lain (tutorial)
    window.dispatchEvent(new CustomEvent('ecoclean:batchUpdated', {
      detail: {
        litre: this.currentLitre,
        naohGrams: this.currentNaohGrams,
        waterGrams: waterGrams,
        waterLitre: waterLitre,
        estimatedBars: estimatedBars
      }
    }));
  }

  applyBatchToTutorial() {
    const tutorialSection = document.getElementById('tutorial');
    if (tutorialSection) {
      tutorialSection.scrollIntoView({ behavior: 'smooth' });
      const banner = document.getElementById('tutorialSyncBanner');
      if (banner) {
        banner.style.boxShadow = '0 0 30px var(--primary)';
        setTimeout(() => {
          banner.style.boxShadow = '';
        }, 1500);
      }
      if (window.showToast) {
        const waterGrams = ((this.currentLitre * 2) / 7) * 1000;
        window.showToast(`Takaran ${this.currentLitre}L Minyak, ${this.currentNaohGrams.toFixed(3)}g NaOH & ${waterGrams.toFixed(1)}g Air (Rasio 7:2) diterapkan!`);
      }
    }
  }

  copyRecipeToClipboard() {
    const naohStr = this.currentNaohGrams < 1 ? this.currentNaohGrams.toFixed(3) : this.currentNaohGrams.toFixed(2);
    const waterGrams = ((this.currentLitre * 2) / 7) * 1000;
    const waterStr = `${waterGrams.toFixed(1)} g / ml (~${((this.currentLitre * 2) / 7).toFixed(2)} L)`;
    const text = `🌿 Resep Sabun EcoClean Buleleng:\n• Minyak Jelantah: ${this.currentLitre} Liter (bersih disaring)\n• Soda Api (NaOH): ${naohStr} gram (Rumus: Liter * 0.141)\n• Air Suling: ${waterStr} (Perbandingan Minyak : Air = 7 : 2)\nAturan: Tuang kristal NaOH ke dalam air secara perlahan!`;

    navigator.clipboard.writeText(text).then(() => {
      if (window.showToast) {
        window.showToast("Resep berhasil disalin ke papan klip!");
      } else {
        alert("Resep berhasil disalin!");
      }
    }).catch(() => {
      prompt("Salin takaran resep di bawah ini:", text);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.soapCalculator = new SoapCalculator();
});
