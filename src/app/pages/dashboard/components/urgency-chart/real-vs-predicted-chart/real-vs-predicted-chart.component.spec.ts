import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealVsPredictedChartComponent } from './real-vs-predicted-chart.component';

describe('RealVsPredictedChartComponent', () => {
  let component: RealVsPredictedChartComponent;
  let fixture: ComponentFixture<RealVsPredictedChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RealVsPredictedChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RealVsPredictedChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
