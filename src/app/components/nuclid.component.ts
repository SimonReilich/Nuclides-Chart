import { Component, Input, HostBinding } from '@angular/core';
import { DataEntry } from '../models/nuclid.model';
import { NgClass } from '@angular/common';

@Component({
  selector: 'nuclid',
  imports: [NgClass],
  templateUrl: './nuclid.component.html',
  styleUrl: './nuclid.component.css'
})
export class NuclidComponent {
  @Input() nuclid: DataEntry | undefined = undefined

  @HostBinding('style.position')
  get position() {
    return 'absolute';
  }

  @HostBinding('style.left')
  get left() {
    if (this.nuclid) {
      return `${this.nuclid.n * 120}px`;
    }
    return '0';
  }

  @HostBinding('style.z-index')
  get zIndex() {
    return 2;
  }

  half_life_time() {
    if (this.nuclid == null || this.nuclid.unit_hl == null) {
      return null
    } else if (this.nuclid.unit_hl.includes('eV')) {
      switch (this.nuclid.unit_hl) {
        case 'eV':
          return this.convertEvToTime(+this.nuclid.half_life)
        case 'keV':
          return this.convertKevToTime(+this.nuclid.half_life)
        case 'MeV':
          return this.convertMevToTime(+this.nuclid.half_life)
        default:
          return null
      }
    } else if (this.nuclid.unit_hl === 'Y') {
      return this.formatYears(+this.nuclid.half_life)
    } else {
      return (+this.nuclid.half_life).toFixed(1) + ' ' + this.nuclid.unit_hl;
    }
  }

  formatYears(years: number) {
    const units = [
      { label: "Spd Y", value: 10^39 },
      { label: "Spl Y", value: 10^36 },
      { label: "Sxd Y", value: 10^33 },
      { label: "Sxl Y", value: 10^30 },
      { label: "Qid Y", value: 10^27 },
      { label: "Qin Y", value: 10^24 },
      { label: "Qrd Y", value: 10^27 },
      { label: "Qri Y", value: 10^24 },
      { label: "Trd Y", value: 10^21 },
      { label: "Til Y", value: 10^18 },
      { label: "Brd Y", value: 10^15 },
      { label: "Bil Y", value: 10^12 },
      { label: "Mrd Y", value: 10^9 },
      { label: "Mil Y", value: 10^6 },
      { label: "Tsd Y", value: 10^3 }
    ];

    for (const unit of units) {
      if (years >= unit.value) {
        const scaledValue = years / unit.value;
        return `${scaledValue.toFixed(1)} ${unit.label}`;
      }
    }

    return `${years.toFixed(1)} Y`
  }

  H_BAR_EV_S: number = 6.582119569e-16;
  LN_2: number = Math.LN2;

  formatTime(seconds: number) {
    if (seconds === 0 || isNaN(seconds)) {
      return "0 s"
    }

    const units = [
      { label: "s", value: 1 },
      { label: "ms", value: 1e-3 },
      { label: "µs", value: 1e-6 },
      { label: "ns", value: 1e-9 },
      { label: "ps", value: 1e-12 },
      { label: "fs", value: 1e-15 },
      { label: "as", value: 1e-18 },
      { label: "zs", value: 1e-21 },
      { label: "ys", value: 1e-24 }
    ];

    for (const unit of units) {
      if (seconds >= unit.value) {
        const scaledValue = seconds / unit.value;
        return `${scaledValue.toFixed(1)} ${unit.label}`;
      }
    }

    return `${seconds.toExponential(1)} s`
  }

  convertEvToTime(ev: number) {
    if (ev <= 0) return "Invalid Width";
    const seconds = (this.H_BAR_EV_S * this.LN_2) / ev;
    return this.formatTime(seconds);
  }

  convertKevToTime(kev: number) {
    if (kev <= 0) return "Invalid Width";
    const seconds = (this.H_BAR_EV_S * this.LN_2) / (kev * 1e3);
    return this.formatTime(seconds);
  }

  convertMevToTime(mev: number) {
    if (mev <= 0) return "Invalid Width";
    const seconds = (this.H_BAR_EV_S * this.LN_2) / (mev * 1e6);
    return this.formatTime(seconds);
  }
}
