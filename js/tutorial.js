/**
 * EcoClean Modul Panduan Pembuatan Sabun Interaktif
 * Tersinkronisasi dengan kalkulator & gerbang keamanan APD
 */

class SoapTutorial {
  constructor() {
    this.oilSyncDisplay = document.getElementById('tutorialSyncOil');
    this.naohSyncDisplay = document.getElementById('tutorialSyncNaoh');
    this.waterSyncDisplay = document.getElementById('tutorialSyncWater');

    // Gerbang Keamanan
    this.safetyCheckboxes = document.querySelectorAll('.safety-checkbox-input');
    this.unlockSafetyBtn = document.getElementById('unlockSafetyBtn');
    this.safetyStatusText = document.getElementById('safetyGateStatus');
    this.tutorialStepsContainer = document.getElementById('tutorialStepsFlow');

    // Accordions
    this.accordionItems = document.querySelectorAll('.accordion-item');

    this.currentBatch = {
      litre: 1.0,
      naohGrams: 0.141,
      waterGrams: 0.352,
      estimatedBars: 9
    };

    this.init();
  }

  init() {
    // Dengarkan event pembaruan batch dari kalkulator
    window.addEventListener('ecoclean:batchUpdated', (e) => {
      this.currentBatch = e.detail;
      this.updateTutorialBatchDisplays();
    });

    // Validasi Gerbang Keselamatan
    if (this.safetyCheckboxes.length > 0 && this.unlockSafetyBtn) {
      this.safetyCheckboxes.forEach(cb => {
        cb.addEventListener('change', () => this.checkSafetyReadiness());
      });

      this.unlockSafetyBtn.addEventListener('click', () => {
        this.confirmSafetyReadiness();
      });
    }

    // FAQ Accordion
    this.accordionItems.forEach(item => {
      const header = item.querySelector('.accordion-header');
      if (header) {
        header.addEventListener('click', () => {
          item.classList.toggle('open');
        });
      }
    });

    // Tandai Langkah Selesai
    const stepCards = document.querySelectorAll('.tutorial-step-card');
    stepCards.forEach(card => {
      const btn = card.querySelector('.btn-mark-step');
      if (btn) {
        btn.addEventListener('click', () => {
          const isDone = card.classList.toggle('step-completed');
          btn.textContent = isDone ? '✓ Selesai' : 'Tandai Selesai';
          btn.classList.toggle('btn-primary', !isDone);
          btn.classList.toggle('btn-secondary', isDone);
        });
      }
    });
  }

  updateTutorialBatchDisplays() {
    const naohText = this.currentBatch.naohGrams < 1 
      ? this.currentBatch.naohGrams.toFixed(3) 
      : this.currentBatch.naohGrams.toFixed(2);
    const waterGrams = this.currentBatch.waterGrams || (((this.currentBatch.litre || 1) * 2 / 7) * 1000);
    const waterText = `${waterGrams.toFixed(1)} g (~${Math.round(waterGrams)} ml)`;

    if (this.oilSyncDisplay) this.oilSyncDisplay.textContent = `${this.currentBatch.litre} L`;
    if (this.naohSyncDisplay) this.naohSyncDisplay.textContent = `${naohText} g`;
    if (this.waterSyncDisplay) this.waterSyncDisplay.textContent = `${waterText}`;

    // Perbarui teks dinamis di dalam langkah-langkah
    document.querySelectorAll('[data-sync="oil"]').forEach(el => {
      el.textContent = `${this.currentBatch.litre} Liter`;
    });
    document.querySelectorAll('[data-sync="naoh"]').forEach(el => {
      el.textContent = `${naohText} gram`;
    });
    document.querySelectorAll('[data-sync="water"]').forEach(el => {
      el.textContent = `${waterText} (Rasio 7:2)`;
    });
  }

  checkSafetyReadiness() {
    const allChecked = Array.from(this.safetyCheckboxes).every(cb => cb.checked);
    if (this.unlockSafetyBtn) {
      this.unlockSafetyBtn.disabled = !allChecked;
      if (allChecked) {
        this.unlockSafetyBtn.classList.remove('btn-secondary');
        this.unlockSafetyBtn.classList.add('btn-primary');
        if (this.safetyStatusText) {
          this.safetyStatusText.textContent = "Semua protokol keselamatan telah diverifikasi. Anda siap melanjutkan!";
          this.safetyStatusText.style.color = "var(--primary)";
        }
      } else {
        this.unlockSafetyBtn.classList.add('btn-secondary');
        this.unlockSafetyBtn.classList.remove('btn-primary');
        if (this.safetyStatusText) {
          this.safetyStatusText.textContent = "Silakan centang seluruh 4 perlengkapan keselamatan di atas.";
          this.safetyStatusText.style.color = "var(--text-muted)";
        }
      }
    }
  }

  confirmSafetyReadiness() {
    if (this.tutorialStepsContainer) {
      this.tutorialStepsContainer.style.filter = "none";
      this.tutorialStepsContainer.style.opacity = "1";
      this.tutorialStepsContainer.style.pointerEvents = "auto";
    }
    if (window.showToast) {
      window.showToast("Gerbang keselamatan dibuka! Ikuti setiap langkah dengan cermat.");
    }
    const step1 = document.getElementById('step-1');
    if (step1) {
      step1.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.soapTutorial = new SoapTutorial();
});
