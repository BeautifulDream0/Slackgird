import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Constants } from '../constants';
import {
  CellArgs,
  DelimiterType,
  Extension,
  ExtensionName,
  FileType,
  GraphqlResult,
  GridOption,
  GridMenu,
  GridMenuItem,
  SlickEventHandler,
} from '../models';
import { ExportService } from '../services/export.service';
import { ExtensionUtility } from './extensionUtility';
import { FilterService } from '../services/filter.service';
import { SortService } from '../services/sort.service';
import { castToPromise } from '../services/utilities';
import { SharedService } from '../services/shared.service';

// using external non-typed js libraries
declare var Slick: any;
declare var $: any;

@Injectable()
export class GridMenuExtension implements Extension {
  private _addon: any;
  private _areVisibleColumnDifferent = false;
  private _eventHandler: SlickEventHandler;
  private _userOriginalGridMenu: GridMenu;

  constructor(
    private exportService: ExportService,
    private extensionUtility: ExtensionUtility,
    private filterService: FilterService,
    private sharedService: SharedService,
    private sortService: SortService,
    private translate: TranslateService,
  ) {
    this._eventHandler = new Slick.EventHandler();
  }

  get eventHandler(): SlickEventHandler {
    return this._eventHandler;
  }

  dispose() {
    // unsubscribe all SlickGrid events
    this._eventHandler.unsubscribeAll();
    if (this._addon && this._addon.destroy) {
      this._addon.destroy();
    }
  }

  showGridMenu(e) {
    this._addon.showGridMenu(e);
  }

  /** Create the Header Menu and expose all the available hooks that user can subscribe (onCommand, onBeforeMenuShow, ...) */
  register(): any {
    // keep original user grid menu, useful when switching locale to translate
    this._userOriginalGridMenu = { ...this.sharedService.gridOptions.gridMenu };

    if (this.sharedService.gridOptions && this.sharedService.gridOptions.gridMenu) {
      // dynamically import the SlickGrid plugin (addon) with RequireJS
      this.extensionUtility.loadExtensionDynamically(ExtensionName.gridMenu);
      this.sharedService.gridOptions.gridMenu = { ...this.getDefaultGridMenuOptions(), ...this.sharedService.gridOptions.gridMenu };

      // merge original user grid menu items with internal items
      // then sort all Grid Menu Custom Items (sorted by pointer, no need to use the return)
      this.sharedService.gridOptions.gridMenu.customItems = [...this._userOriginalGridMenu.customItems || [], ...this.addGridMenuCustomCommands()];
      this.extensionUtility.translateItems(this.sharedService.gridOptions.gridMenu.customItems, 'titleKey', 'title');
      this.extensionUtility.sortItems(this.sharedService.gridOptions.gridMenu.customItems, 'positionOrder');

      this._addon = new Slick.Controls.GridMenu(this.sharedService.columnDefinitions, this.sharedService.grid, this.sharedService.gridOptions);

      // hook all events
      if (this.sharedService.grid && this.sharedService.gridOptions.gridMenu) {
        if (this.sharedService.gridOptions.gridMenu.onExtensionRegistered) {
          this.sharedService.gridOptions.gridMenu.onExtensionRegistered(this._addon);
        }
        this._eventHandler.subscribe(this._addon.onBeforeMenuShow, (e: any, args: CellArgs) => {
          if (this.sharedService.gridOptions.gridMenu && typeof this.sharedService.gridOptions.gridMenu.onBeforeMenuShow === 'function') {
            this.sharedService.gridOptions.gridMenu.onBeforeMenuShow(e, args);
          }
        });
        this._eventHandler.subscribe(this._addon.onColumnsChanged, (e: any, args: CellArgs) => {
          this._areVisibleColumnDifferent = true;
          if (this.sharedService.gridOptions.gridMenu && typeof this.sharedService.gridOptions.gridMenu.onColumnsChanged === 'function') {
            this.sharedService.gridOptions.gridMenu.onColumnsChanged(e, args);
          }
        });
        this._eventHandler.subscribe(this._addon.onCommand, (e: any, args: any) => {
          this.executeGridMenuInternalCustomCommands(e, args);
          if (this.sharedService.gridOptions.gridMenu && typeof this.sharedService.gridOptions.gridMenu.onCommand === 'function') {
            this.sharedService.gridOptions.gridMenu.onCommand(e, args);
          }
        });
        this._eventHandler.subscribe(this._addon.onMenuClose, (e: any, args: CellArgs) => {
          if (this.sharedService.gridOptions.gridMenu && typeof this.sharedService.gridOptions.gridMenu.onMenuClose === 'function') {
            this.sharedService.gridOptions.gridMenu.onMenuClose(e, args);
          }

          // we also want to resize the columns if the user decided to hide certain column(s)
          if (this.sharedService.grid && typeof this.sharedService.grid.autosizeColumns === 'function') {
            // make sure that the grid still exist (by looking if the Grid UID is found in the DOM tree)
            const gridUid = this.sharedService.grid.getUID();
            if (this._areVisibleColumnDifferent && gridUid && $(`.${gridUid}`).length > 0) {
              if (this.sharedService.gridOptions && this.sharedService.gridOptions.enableAutoSizeColumns) {
                this.sharedService.grid.autosizeColumns();
              }
              this._areVisibleColumnDifferent = false;
            }
          }
        });
      }
      return this._addon;
    }
    return null;
  }

  /** Refresh the dataset through the Backend Service */
  refreshBackendDataset(gridOptions?: GridOption) {
    let query = '';

    // user can pass new set of grid options which will override current ones
    if (gridOptions) {
      this.sharedService.gridOptions = { ...this.sharedService.gridOptions, ...gridOptions };
    }

    const backendApi = this.sharedService.gridOptions.backendServiceApi;
    if (!backendApi || !backendApi.service || !backendApi.process) {
      throw new Error(`BackendServiceApi requires at least a "process" function and a "service" defined`);
    }

    if (backendApi.service) {
      query = backendApi.service.buildQuery();
    }

    if (query && query !== '') {
      // keep start time & end timestamps & return it after process execution
      const startTime = new Date();

      if (backendApi.preProcess) {
        backendApi.preProcess();
      }

      // the process could be an Observable (like HttpClient) or a Promise
      // in any case, we need to have a Promise so that we can await on it (if an Observable, convert it to Promise)
      const observableOrPromise = backendApi.process(query);

      castToPromise(observableOrPromise).then((processResult: GraphqlResult | any) => {
        const endTime = new Date();

        // from the result, call our internal post process to update the Dataset and Pagination info
        if (processResult && backendApi && backendApi.internalPostProcess) {
          backendApi.internalPostProcess(processResult);
        }

        // send the response process to the postProcess callback
        if (backendApi && backendApi.postProcess) {
          if (processResult instanceof Object) {
            processResult.statistics = {
              startTime,
              endTime,
              executionTime: endTime.valueOf() - startTime.valueOf(),
              totalItemCount: this.sharedService.gridOptions && this.sharedService.gridOptions.pagination && this.sharedService.gridOptions.pagination.totalItems
            };
          }
          backendApi.postProcess(processResult);
        }
      });
    }
  }

  /** Translate the Grid Menu titles and column picker */
  translateGridMenu() {
    // update the properties by pointers, that is the only way to get Grid Menu Control to see the new values
    // we also need to call the control init so that it takes the new Grid object with latest values
    if (this.sharedService.gridOptions && this.sharedService.gridOptions.gridMenu) {
      this.sharedService.gridOptions.gridMenu.customItems = [];
      this.emptyGridMenuTitles();

      // merge original user grid menu items with internal items
      // then sort all Grid Menu Custom Items (sorted by pointer, no need to use the return)
      this.sharedService.gridOptions.gridMenu.customItems = [...this._userOriginalGridMenu.customItems || [], ...this.addGridMenuCustomCommands()];
      this.extensionUtility.translateItems(this.sharedService.gridOptions.gridMenu.customItems, 'titleKey', 'title');
      this.extensionUtility.sortItems(this.sharedService.gridOptions.gridMenu.customItems, 'positionOrder');

      this.sharedService.gridOptions.gridMenu.columnTitle = this.extensionUtility.getPickerTitleOutputString('columnTitle', 'gridMenu');
      this.sharedService.gridOptions.gridMenu.forceFitTitle = this.extensionUtility.getPickerTitleOutputString('forceFitTitle', 'gridMenu');
      this.sharedService.gridOptions.gridMenu.syncResizeTitle = this.extensionUtility.getPickerTitleOutputString('syncResizeTitle', 'gridMenu');

      // translate all columns (including non-visible)
      this.extensionUtility.translateItems(this.sharedService.allColumns, 'headerKey', 'name');

      // re-initialize the Grid Menu, that will recreate all the menus & list
      // doing an "init()" won't drop any existing command attached
      if (this._addon.init) {
        this._addon.init(this.sharedService.grid);
      }
    }
  }

  // --
  // private functions
  // ------------------

  /** Create Grid Menu with Custom Commands if user has enabled Filters and/or uses a Backend Service (OData, GraphQL) */
  private addGridMenuCustomCommands() {
    const backendApi = this.sharedService.gridOptions.backendServiceApi || null;
    const gridMenuCustomItems: GridMenuItem[] = [];

    if (this.sharedService.gridOptions && this.sharedService.gridOptions.enableFiltering) {
      // show grid menu: clear all filters
      if (this.sharedService.gridOptions && this.sharedService.gridOptions.gridMenu && !this.sharedService.gridOptions.gridMenu.hideClearAllFiltersCommand) {
        gridMenuCustomItems.push(
          {
            iconCssClass: this.sharedService.gridOptions.gridMenu.iconClearAllFiltersCommand || 'fa fa-filter text-danger',
            title: this.sharedService.gridOptions.enableTranslate ? this.translate.instant('CLEAR_ALL_FILTERS') : Constants.TEXT_CLEAR_ALL_FILTERS,
            disabled: false,
            command: 'clear-filter',
            positionOrder: 50
          }
        );
      }

      // show grid menu: toggle filter row
      if (this.sharedService.gridOptions && this.sharedService.gridOptions.gridMenu && !this.sharedService.gridOptions.gridMenu.hideToggleFilterCommand) {
        gridMenuCustomItems.push(
          {
            iconCssClass: this.sharedService.gridOptions.gridMenu.iconToggleFilterCommand || 'fa fa-random',
            title: this.sharedService.gridOptions.enableTranslate ? this.translate.instant('TOGGLE_FILTER_ROW') : Constants.TEXT_TOGGLE_FILTER_ROW,
            disabled: false,
            command: 'toggle-filter',
            positionOrder: 52
          }
        );
      }

      // show grid menu: refresh dataset
      if (this.sharedService.gridOptions && this.sharedService.gridOptions.gridMenu && !this.sharedService.gridOptions.gridMenu.hideRefreshDatasetCommand && backendApi) {
        gridMenuCustomItems.push(
          {
            iconCssClass: this.sharedService.gridOptions.gridMenu.iconRefreshDatasetCommand || 'fa fa-refresh',
            title: this.sharedService.gridOptions.enableTranslate ? this.translate.instant('REFRESH_DATASET') : Constants.TEXT_REFRESH_DATASET,
            disabled: false,
            command: 'refresh-dataset',
            positionOrder: 54
          }
        );
      }
    }

    if (this.sharedService.gridOptions.showPreHeaderPanel) {
      // show grid menu: toggle pre-header row
      if (this.sharedService.gridOptions && this.sharedService.gridOptions.gridMenu && !this.sharedService.gridOptions.gridMenu.hideTogglePreHeaderCommand) {
        gridMenuCustomItems.push(
          {
            iconCssClass: this.sharedService.gridOptions.gridMenu.iconTogglePreHeaderCommand || 'fa fa-random',
            title: this.sharedService.gridOptions.enableTranslate ? this.translate.instant('TOGGLE_PRE_HEADER_ROW') : Constants.TEXT_TOGGLE_PRE_HEADER_ROW,
            disabled: false,
            command: 'toggle-preheader',
            positionOrder: 52
          }
        );
      }
    }

    if (this.sharedService.gridOptions.enableSorting) {
      // show grid menu: clear all sorting
      if (this.sharedService.gridOptions && this.sharedService.gridOptions.gridMenu && !this.sharedService.gridOptions.gridMenu.hideClearAllSortingCommand) {
        gridMenuCustomItems.push(
          {
            iconCssClass: this.sharedService.gridOptions.gridMenu.iconClearAllSortingCommand || 'fa fa-unsorted text-danger',
            title: this.sharedService.gridOptions.enableTranslate ? this.translate.instant('CLEAR_ALL_SORTING') : Constants.TEXT_CLEAR_ALL_SORTING,
            disabled: false,
            command: 'clear-sorting',
            positionOrder: 51
          }
        );
      }
    }

    // show grid menu: export to file
    if (this.sharedService.gridOptions && this.sharedService.gridOptions.enableExport && this.sharedService.gridOptions.gridMenu && !this.sharedService.gridOptions.gridMenu.hideExportCsvCommand) {
      gridMenuCustomItems.push(
        {
          iconCssClass: this.sharedService.gridOptions.gridMenu.iconExportCsvCommand || 'fa fa-download',
          title: this.sharedService.gridOptions.enableTranslate ? this.translate.instant('EXPORT_TO_CSV') : Constants.TEXT_EXPORT_IN_CSV_FORMAT,
          disabled: false,
          command: 'export-csv',
          positionOrder: 53
        }
      );
    }
    // show grid menu: export to text file as tab delimited
    if (this.sharedService.gridOptions && this.sharedService.gridOptions.enableExport && this.sharedService.gridOptions.gridMenu && !this.sharedService.gridOptions.gridMenu.hideExportTextDelimitedCommand) {
      gridMenuCustomItems.push(
        {
          iconCssClass: this.sharedService.gridOptions.gridMenu.iconExportTextDelimitedCommand || 'fa fa-download',
          title: this.sharedService.gridOptions.enableTranslate ? this.translate.instant('EXPORT_TO_TAB_DELIMITED') : Constants.TEXT_EXPORT_IN_TEXT_FORMAT,
          disabled: false,
          command: 'export-text-delimited',
          positionOrder: 54
        }
      );
    }

    // add the custom "Commands" title if there are any commands
    if (this.sharedService.gridOptions && this.sharedService.gridOptions.gridMenu && (gridMenuCustomItems.length > 0 || (this.sharedService.gridOptions.gridMenu.customItems && this.sharedService.gridOptions.gridMenu.customItems.length > 0))) {
      this.sharedService.gridOptions.gridMenu.customTitle = this.sharedService.gridOptions.gridMenu.customTitle || this.extensionUtility.getPickerTitleOutputString('customTitle', 'gridMenu');
    }

    return gridMenuCustomItems;
  }

  /**
   * Execute the Grid Menu Custom command callback that was triggered by the onCommand subscribe
   * These are the default internal custom commands
   * @param event
   * @param GridMenuItem args
   */
  private executeGridMenuInternalCustomCommands(e: Event, args: GridMenuItem) {
    if (args && args.command) {
      switch (args.command) {
        case 'clear-filter':
          this.filterService.clearFilters();
          this.sharedService.dataView.refresh();
          break;
        case 'clear-sorting':
          this.sortService.clearSorting();
          this.sharedService.dataView.refresh();
          break;
        case 'export-csv':
          this.exportService.exportToFile({
            delimiter: DelimiterType.comma,
            filename: 'export',
            format: FileType.csv,
            useUtf8WithBom: true
          });
          break;
        case 'export-text-delimited':
          this.exportService.exportToFile({
            delimiter: DelimiterType.tab,
            filename: 'export',
            format: FileType.txt,
            useUtf8WithBom: true
          });
          break;
        case 'toggle-filter':
          const showHeaderRow = this.sharedService && this.sharedService.gridOptions && this.sharedService.gridOptions.showHeaderRow || false;
          this.sharedService.grid.setHeaderRowVisibility(!showHeaderRow);
          break;
        case 'toggle-toppanel':
          const showTopPanel = this.sharedService && this.sharedService.gridOptions && this.sharedService.gridOptions.showTopPanel || false;
          this.sharedService.grid.setTopPanelVisibility(!showTopPanel);
          break;
        case 'toggle-preheader':
          const showPreHeaderPanel = this.sharedService && this.sharedService.gridOptions && this.sharedService.gridOptions.showPreHeaderPanel || false;
          this.sharedService.grid.setPreHeaderPanelVisibility(!showPreHeaderPanel);
          break;
        case 'refresh-dataset':
          this.refreshBackendDataset();
          break;
        default:
          break;
      }
    }
  }

  private emptyGridMenuTitles() {
    if (this.sharedService && this.sharedService.gridOptions && this.sharedService.gridOptions.gridMenu) {
      this.sharedService.gridOptions.gridMenu.customTitle = '';
      this.sharedService.gridOptions.gridMenu.columnTitle = '';
      this.sharedService.gridOptions.gridMenu.forceFitTitle = '';
      this.sharedService.gridOptions.gridMenu.syncResizeTitle = '';
    }
  }

  /** @return default Grid Menu options */
  private getDefaultGridMenuOptions(): GridMenu {
    return {
      customTitle: undefined,
      columnTitle: this.extensionUtility.getPickerTitleOutputString('columnTitle', 'gridMenu'),
      forceFitTitle: this.extensionUtility.getPickerTitleOutputString('forceFitTitle', 'gridMenu'),
      syncResizeTitle: this.extensionUtility.getPickerTitleOutputString('syncResizeTitle', 'gridMenu'),
      iconCssClass: 'fa fa-bars',
      menuWidth: 18,
      customItems: [],
      hideClearAllFiltersCommand: false,
      hideRefreshDatasetCommand: false,
      hideToggleFilterCommand: false,
    };
  }
}
