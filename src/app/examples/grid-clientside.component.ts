import { CustomInputFilter } from './custom-inputFilter';
import { Component, OnInit } from '@angular/core';
import { AngularGridInstance, Column, FieldType, Filters, Formatters, GridOption, GridStateChange } from './../modules/angular-slickgrid';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs/Subject';

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
const NB_ITEMS = 500;

@Component({
  templateUrl: './grid-clientside.component.html'
})
export class GridClientSideComponent implements OnInit {
  title = 'Example 4: Client Side Sort/Filter';
  subTitle = `
    Sort/Filter on client side only using SlickGrid DataView (<a href="https://github.com/ghiscoding/Angular-Slickgrid/wiki/Sorting" target="_blank">Wiki docs</a>)
    <br/>
    <ul class="small">
      <li>Support multi-sort (by default), hold "Shift" key and click on the next column to sort.
      <li>All column types support the following operators: (>, >=, <, <=, <>, !=, =, ==, *)
      <ul>
        <li>Example: >100 ... >=2001-01-01 ... >02/28/17</li>
        <li><b>Note:</b> For filters to work properly (default is string), make sure to provide a FieldType (type is against the dataset, not the Formatter)</li>
      </ul>
      <li>Date Filters</li>
      <ul>
        <li>FieldType of dateUtc/date (from dataset) can use an extra option of "filterSearchType" to let user filter more easily. For example, in the "UTC Date" field below, you can type "&gt;02/28/2017", also when dealing with UTC you have to take the time difference in consideration.</li>
      </ul>
      <li>On String filters, (*) can be used as startsWith (Hello* => matches "Hello Word") ... endsWith (*Doe => matches: "John Doe")</li>
      <li>Custom Filter are now possible, "Description" column below, is a customized InputFilter with different placeholder. See <a href="https://github.com/ghiscoding/Angular-Slickgrid/wiki/Custom-Filter" target="_blank">Wiki - Custom Filter</a>
    </ul>
  `;

  angularGrid: AngularGridInstance;
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset: any[];

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    // prepare a multiple-select array to filter the "Duration" column
    // wrap it inside a timer to simulate a backend call
    const durationCollection$ = new Subject<any>();
    setTimeout(() => {
      const multiSelectFilterArray = [];
      for (let i = 0; i < NB_ITEMS; i++) {
        multiSelectFilterArray.push({ value: i, label: i });
      }

      durationCollection$.next(multiSelectFilterArray);
    }, 1000);

    this.columnDefinitions = [
      { id: 'title', name: 'Title', field: 'title', sortable: true, minWidth: 55,
        type: FieldType.string, filterable: true, filter: { model: Filters.compoundInput }
      },
      { id: 'description', name: 'Description', field: 'description', filterable: true, sortable: true, minWidth: 80,
        type: FieldType.string,
        filter: {
          model: new CustomInputFilter() // create a new instance to make each Filter independent from each other
        }
      },
      { id: 'duration', name: 'Duration (days)', field: 'duration', sortable: true, type: FieldType.number, exportCsvForceToKeepAsString: true,
        minWidth: 55,
        filterable: true,
        filter: {
          asyncCollection: durationCollection$,
          collectionSortBy: {
            property: 'value',
            sortDesc: true,
            fieldType: FieldType.number
          },
          model: Filters.multipleSelect,

          // we could add certain option(s) to the "multiple-select" plugin
          filterOptions: {
            maxHeight: 250,
            width: 175
          }
        }
      },
      { id: 'complete', name: '% Complete', field: 'percentComplete', formatter: Formatters.percentCompleteBar, minWidth: 70, type: FieldType.number, sortable: true,
        filterable: true, filter: { model: Filters.compoundInput }
      },
      { id: 'start', name: 'Start', field: 'start', formatter: Formatters.dateIso, sortable: true, minWidth: 75, exportWithFormatter: true,
        type: FieldType.date, filterable: true, filter: { model: Filters.compoundDate }
      },
      { id: 'usDateShort', name: 'US Date Short', field: 'usDateShort', sortable: true, minWidth: 70, width: 70,
        type: FieldType.dateUsShort, filterable: true, filter: { model: Filters.compoundDate }
      },
      { id: 'utcDate', name: 'UTC Date', field: 'utcDate', formatter: Formatters.dateTimeIsoAmPm, sortable: true, minWidth: 115,
        type: FieldType.dateUtc, outputType: FieldType.dateTimeIsoAmPm, filterable: true, filter: { model: Filters.compoundDate } },
      { id: 'effort-driven', name: 'Effort Driven', field: 'effortDriven', minWidth: 85, maxWidth: 85, formatter: Formatters.checkmark,
        type: FieldType.boolean,
        sortable: true,
        filterable: true,
        filter: {
          collection: [ { value: '', label: '' }, { value: true, label: 'True' }, { value: false, label: 'False' } ],
          model: Filters.singleSelect,

          // we could add certain option(s) to the "multiple-select" plugin
          filterOptions: {
            autoDropWidth: true
          },
        }
      }
    ];

    this.gridOptions = {
      autoResize: {
        containerId: 'demo-container',
        sidePadding: 15
      },
      enableExcelCopyBuffer: true,
      enableFiltering: true,
      i18n: this.translate,

      // use columnDef searchTerms OR use presets as shown below
      presets: {
        filters: [
          { columnId: 'duration', searchTerms: [2, 22, 44] },
          // { columnId: 'complete', searchTerms: ['5'], operator: '>' },
          { columnId: 'usDateShort', operator: '<', searchTerms: ['4/20/25'] },
          // { columnId: 'effort-driven', searchTerms: [true] }
        ],
        sorters: [
          { columnId: 'duration', direction: 'DESC' },
          { columnId: 'complete', direction: 'ASC' }
        ],
      }
    };

    // mock a dataset
    this.dataset = this.mockData(NB_ITEMS);
  }

  angularGridReady(angularGrid: any) {
    this.angularGrid = angularGrid;
  }

  addItem() {
    // add a new row to the grid
    const lastRowIndex = this.dataset.length;
    const newRows = this.mockData(1, lastRowIndex);
    this.angularGrid.gridService.addItemToDatagrid(newRows[0]);

    // refresh the MultipleSelect Filter of the "Duration" column
    const durationColumnDef = this.columnDefinitions.find((column: Column) => column.id === 'duration');
    if (durationColumnDef) {
      const asyncCollection = durationColumnDef.filter.asyncCollection;
      const collection = durationColumnDef.filter.collection;
      if (Array.isArray(collection)) {
        // add the new value to the filter collection
        collection.push({ value: lastRowIndex, label: lastRowIndex });

        // trigger a change for the Observable/Subject of the async collection
        if (asyncCollection instanceof Subject) {
          asyncCollection.next(collection);
        }
      }
    }
  }

  mockData(itemCount, startingIndex = 0): any[] {
    // mock a dataset
    const tempDataset = [];
    for (let i = startingIndex; i < (startingIndex + itemCount); i++) {
      const randomDuration = Math.round(Math.random() * 100);
      const randomYear = randomBetween(2000, 2025);
      const randomYearShort = randomBetween(10, 25);
      const randomMonth = randomBetween(1, 12);
      const randomMonthStr = (randomMonth < 10) ? `0${randomMonth}` : randomMonth;
      const randomDay = randomBetween(10, 28);
      const randomPercent = randomBetween(0, 100);
      const randomHour = randomBetween(10, 23);
      const randomTime = randomBetween(10, 59);

      tempDataset.push({
        id: i,
        title: 'Task ' + i,
        description: (i % 5) ? 'desc ' + i : null, // also add some random to test NULL field
        duration: randomDuration,
        percentComplete: randomPercent,
        percentCompleteNumber: randomPercent,
        start: (i % 4) ? null : new Date(randomYear, randomMonth, randomDay),          // provide a Date format
        usDateShort: `${randomMonth}/${randomDay}/${randomYearShort}`, // provide a date US Short in the dataset
        utcDate: `${randomYear}-${randomMonthStr}-${randomDay}T${randomHour}:${randomTime}:${randomTime}Z`,
        effortDriven: (i % 3 === 0)
      });
    }

    return tempDataset;
  }

  /** Dispatched event of a Grid State Changed event */
  gridStateChanged(gridState: GridStateChange) {
    console.log('Client sample, Grid State changed:: ', gridState);
  }

  /** Save current Filters, Sorters in LocaleStorage or DB */
  saveCurrentGridState(grid) {
    console.log('Client sample, last Grid State:: ', this.angularGrid.gridStateService.getCurrentGridState());
  }
}
