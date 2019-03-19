import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { AngularSlickgridComponent } from './angular-slickgrid.component';
import { SlickPaginationComponent } from './slick-pagination.component';
import { CollectionService } from '../services/collection.service';

// still missing this constructor inject:: @Inject('config') private forRootConfig: GridOption

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AngularSlickgridComponent,
        SlickPaginationComponent
      ],
      providers: [CollectionService, TranslateService],
      imports: [
        RouterTestingModule,
        TranslateModule.forRoot()
      ]
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AngularSlickgridComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it(`should have as title 'Angular SlickGrid Demo'`, async(() => {
    const fixture = TestBed.createComponent(AngularSlickgridComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Angular SlickGrid Demo');
  }));
});
