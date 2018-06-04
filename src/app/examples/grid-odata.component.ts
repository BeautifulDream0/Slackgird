import { Component, OnInit, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Column, FieldType, FilterType, GridOdataService, GridOption } from './../modules/angular-slickgrid';

const defaultPageSize = 20;
const sampleDataRoot = 'assets/data';

@Component({
  templateUrl: './grid-odata.component.html'
})
@Injectable()
export class GridOdataComponent implements OnInit {
  title = 'Example 5: Grid connected to Backend Server with OData';
  subTitle = `
    Sorting/Paging connected to a Backend OData Service (<a href="https://github.com/ghiscoding/Angular-Slickgrid/wiki/OData" target="_blank">Wiki docs</a>).
    <br/>
    <ul class="small">
      <li>Only "Name" field is sortable for the demo (because we use JSON files), however "multiColumnSort: true" is also supported</li>
      <li>String column also support operator (>, >=, <, <=, <>, !=, =, ==, *)
      <ul>
        <li>The (*) can be used as startsWith (ex.: "abc*" => startsWith "abc") / endsWith (ex.: "*xyz" => endsWith "xyz")</li>
        <li>The other operators can be used on column type number for example: ">=100" (bigger or equal than 100)</li>
      </ul>
      <li>OData Service could be replaced by other Service type in the future (GraphQL or whichever you provide)</li>
      <li>You can also preload a grid with certain "presets" like Filters / Sorters / Pagination <a href="https://github.com/ghiscoding/Angular-Slickgrid/wiki/Grid-State-&-Preset" target="_blank">Wiki - Grid Preset</a>
    </ul>
  `;
  columnDefinitions: Column[];
  gridOptions: GridOption;
  dataset = [];

  odataQuery = '';
  processing = true;
  status = { text: 'processing...', class: 'alert alert-danger' };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.columnDefinitions = [
      { id: 'name', name: 'Name', field: 'name', sortable: true, type: FieldType.string,
        filterable: true,
        filter: {
          type: FilterType.compoundInput
        }
      },
      { id: 'gender', name: 'Gender', field: 'gender', filterable: true, sortable: true,
        filter: {
          type: FilterType.singleSelect,
          collection: [ { value: '', label: '' }, { value: 'male', label: 'male' }, { value: 'female', label: 'female' } ]
        }
      },
      { id: 'company', name: 'Company', field: 'company' }
    ];

    this.gridOptions = {
      enableAutoResize: true,
      autoResize: {
        containerId: 'demo-container',
        sidePadding: 15
      },
      enableCellNavigation: true,
      enableFiltering: true,
      enableCheckboxSelector: true,
      enableRowSelection: true,
      pagination: {
        pageSizes: [10, 15, 20, 25, 30, 40, 50, 75, 100],
        pageSize: defaultPageSize,
        totalItems: 0
      },
      backendServiceApi: {
        service: new GridOdataService(),
        preProcess: () => this.displaySpinner(true),
        process: (query) => this.getCustomerApiCall(query),
        postProcess: (response) => {
          this.displaySpinner(false);
          this.getCustomerCallback(response);
        }
      }
    };
  }

  displaySpinner(isProcessing) {
    this.processing = isProcessing;
    this.status = (isProcessing)
      ? { text: 'processing...', class: 'alert alert-danger' }
      : { text: 'done', class: 'alert alert-success' };
  }

  getCustomerCallback(data) {
    // totalItems property needs to be filled for pagination to work correctly
    // however we need to force Angular to do a dirty check, doing a clone object will do just that
    this.gridOptions.pagination.totalItems = data['totalRecordCount'];
    this.gridOptions = Object.assign({}, this.gridOptions);

    // once pagination totalItems is filled, we can update the dataset
    this.dataset = data['items'];
    this.odataQuery = data['query'];
  }

  getCustomerApiCall(query) {
    // in your case, you will call your WebAPI function (wich needs to return a Promise)
    // for the demo purpose, we will call a mock WebAPI function
    return this.getCustomerDataApiMock(query);
  }

  /** This function is only here to mock a WebAPI call (since we are using a JSON file for the demo)
   *  in your case the getCustomer() should be a WebAPI function returning a Promise
   */
  getCustomerDataApiMock(query) {
    // the mock is returning a Promise, just like a WebAPI typically does
    return new Promise((resolve, reject) => {
      const queryParams = query.toLowerCase().split('&');
      let top: number;
      let skip = 0;
      let orderBy = '';
      let countTotalItems = 100;
      const columnFilters = {};

      for (const param of queryParams) {
        if (param.includes('$top=')) {
          top = +(param.substring('$top='.length));
        }
        if (param.includes('$skip=')) {
          skip = +(param.substring('$skip='.length));
        }
        if (param.includes('$orderby=')) {
          orderBy = param.substring('$orderby='.length);
        }
        if (param.includes('$filter=')) {
          const filterBy = param.substring('$filter='.length).replace('%20', ' ');
          if (filterBy.includes('substringof')) {
            const filterMatch = filterBy.match(/substringof\('(.*?)',([a-zA-Z ]*)/);
            const fieldName = filterMatch[2].trim();
            columnFilters[fieldName] = {
              type: 'substring',
              term: filterMatch[1].trim()
            };
          }
          if (filterBy.includes('eq')) {
            const filterMatch = filterBy.match(/([a-zA-Z ]*) eq '(.*?)'/);
            const fieldName = filterMatch[1].trim();
            columnFilters[fieldName] = {
              type: 'equal',
              term: filterMatch[2].trim()
            };
          }
          if (filterBy.includes('startswith')) {
            const filterMatch = filterBy.match(/startswith\(([a-zA-Z ]*),\s?'(.*?)'/);
            const fieldName = filterMatch[1].trim();
            columnFilters[fieldName] = {
              type: 'starts',
              term: filterMatch[2].trim()
            };
          }
          if (filterBy.includes('endswith')) {
            const filterMatch = filterBy.match(/endswith\(([a-zA-Z ]*),\s?'(.*?)'/);
            const fieldName = filterMatch[1].trim();
            columnFilters[fieldName] = {
              type: 'ends',
              term: filterMatch[2].trim()
            };
          }
        }
      }

      const sort = orderBy.includes('asc')
        ? 'ASC'
        : orderBy.includes('desc')
          ? 'DESC'
          : '';

      let url;
      switch (sort) {
        case 'ASC':
          url = `${sampleDataRoot}/customers_100_ASC.json`;
          break;
        case 'DESC':
          url = `${sampleDataRoot}/customers_100_DESC.json`;
          break;
        default:
          url = `${sampleDataRoot}/customers_100.json`;
          break;
      }

      this.http.get(url).subscribe(data => {
        const dataArray = <any[]> data;

        // Read the result field from the JSON response.
        const firstRow = skip;
        let filteredData = dataArray;
        if (columnFilters) {
          for (const columnId in columnFilters) {
            if (columnFilters.hasOwnProperty(columnId)) {
              filteredData = filteredData.filter(column => {
                const filterType = columnFilters[columnId].type;
                const searchTerm = columnFilters[columnId].term;
                let colId = columnId;
                if (columnId && columnId.indexOf(' ') !== -1) {
                  const splitIds = columnId.split(' ');
                  colId = splitIds[splitIds.length - 1];
                }
                const filterTerm = column[colId];
                if (filterTerm) {
                  switch (filterType) {
                    case 'equal': return filterTerm.toLowerCase() === searchTerm;
                    case 'ends': return filterTerm.toLowerCase().endsWith(searchTerm);
                    case 'starts': return filterTerm.toLowerCase().startsWith(searchTerm);
                    case 'substring': return filterTerm.toLowerCase().includes(searchTerm);
                  }
                }
              });
            }
          }
          countTotalItems = filteredData.length;
        }
        const updatedData = filteredData.slice(firstRow, firstRow + top);

        setTimeout(() => {
          resolve({ items: updatedData, totalRecordCount: countTotalItems, query });
        }, 500);
      });
    });
  }
}
