import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NuclidService } from './services/nuclid.service';
import { NuclidComponent } from './components/nuclid.component';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';
import { DataEntry } from './models/nuclid.model';

@Component({
  selector: 'app-root',
  imports: [NuclidComponent, ScrollingModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;

  dataReady = false;
  z: DataEntry[][] = [];

  constructor(private nuclidService: NuclidService) {}

  async ngOnInit() {
    await this.nuclidService.loadData('nuclides.csv');
    this.z = Array.from({ length: 119 }, (_, z) =>
      Array.from(
        { length: 179 },
        (_, n) => this.nuclidService.get(118 - z, n)!
      )
    );
    this.dataReady = true;
  }

  ngAfterViewInit() {
    setTimeout(() => this.viewport.scrollTo({ bottom: 0, left: 0 }));
  }
}