import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekdayFlowChartComponent } from './weekday-flow-chart.component';

describe('WeekdayFlowChartComponent', () => {
  let component: WeekdayFlowChartComponent;
  let fixture: ComponentFixture<WeekdayFlowChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeekdayFlowChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeekdayFlowChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
