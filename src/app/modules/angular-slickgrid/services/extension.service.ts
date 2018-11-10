import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import {
  Column,
  Extension,
  ExtensionName,
  GridOption,
} from '../models/index';
import {
  AutoTooltipExtension,
  CellExternalCopyManagerExtension,
  CheckboxSelectorExtension,
  ColumnPickerExtension,
  GridMenuExtension,
  GroupItemMetaProviderExtension,
  HeaderButtonExtension,
  HeaderMenuExtension,
  RowSelectionExtension,
} from '../extensions';
import { SharedService } from './shared.service';

// using external non-typed js libraries
declare var Slick: any;

@Injectable()
export class ExtensionService {
  extensionList: Extension[] = [];

  constructor(
    private autoTooltipExtension: AutoTooltipExtension,
    private cellExternalCopyExtension: CellExternalCopyManagerExtension,
    private checkboxSelectorExtension: CheckboxSelectorExtension,
    private columnPickerExtension: ColumnPickerExtension,
    private gridMenuExtension: GridMenuExtension,
    private groupItemMetaExtension: GroupItemMetaProviderExtension,
    private headerButtonExtension: HeaderButtonExtension,
    private headerMenuExtension: HeaderMenuExtension,
    private rowSelectionExtension: RowSelectionExtension,
    private sharedService: SharedService,
    private translate: TranslateService,
  ) {}

  /** Get all columns (includes visible and non-visible) */
  getAllColumns(): Column[] {
    return this.sharedService.allColumns || [];
  }

  /** Get only visible columns */
  getVisibleColumns(): Column[] {
    return this.sharedService.visibleColumns || [];
  }

  /** Get all Extensions */
  getAllExtensions(): Extension[] {
    return this.extensionList;
  }

  /**
   * Get an Extension by it's name
   *  @param name
   */
  getExtensionByName(name: string): Extension | undefined {
    return this.extensionList.find((p) => p.name === name);
  }

  /** Auto-resize all the column in the grid to fit the grid width */
  autoResizeColumns() {
    this.sharedService.grid.autosizeColumns();
  }

  /**
   * Attach/Create different Controls or Plugins after the Grid is created
   * @param grid
   * @param dataView
   * @param groupItemMetadataProvider
   */
  attachDifferentExtensions() {
    // make sure all columns are translated before creating ColumnPicker/GridMenu Controls
    // this is to avoid having hidden columns not being translated on first load
    if (this.sharedService.gridOptions.enableTranslate) {
      this.translateItems(this.sharedService.allColumns, 'headerKey', 'name');
    }

    // Column Picker Control
    if (this.sharedService.gridOptions.enableColumnPicker) {
      if (this.columnPickerExtension && this.columnPickerExtension.register) {
        this.extensionList.push({ name: ExtensionName.columnPicker, service: this.columnPickerExtension.register() });
      }
    }

    // Grid Menu Control
    if (this.sharedService.gridOptions.enableGridMenu) {
      if (this.gridMenuExtension && this.gridMenuExtension.register) {
        this.extensionList.push({ name: ExtensionName.gridMenu, service: this.gridMenuExtension.register() });
      }
    }

    // Auto Tooltip Plugin
    if (this.sharedService.gridOptions.enableAutoTooltip) {
      if (this.autoTooltipExtension && this.autoTooltipExtension.register) {
        this.extensionList.push({ name: ExtensionName.autoTooltip, service: this.autoTooltipExtension.register() });
      }
    }

    // Grouping Plugin
    // register the group item metadata provider to add expand/collapse group handlers
    if (this.sharedService.gridOptions.enableGrouping) {
      if (this.groupItemMetaExtension && this.groupItemMetaExtension.register) {
        this.extensionList.push({ name: ExtensionName.groupItemMetaProvider, service: this.groupItemMetaExtension.register() });
      }
    }

    // Checkbox Selector Plugin
    if (this.sharedService.gridOptions.enableCheckboxSelector) {
      if (this.checkboxSelectorExtension && this.checkboxSelectorExtension.register) {
        const rowSelectionExtension = this.getExtensionByName(ExtensionName.rowSelectionExtension);
        this.extensionList.push({ name: ExtensionName.checkboxSelector, service: this.checkboxSelectorExtension.register(rowSelectionExtension) });
      }
    }

    // Row Selection Plugin
    if (!this.sharedService.gridOptions.enableCheckboxSelector && this.sharedService.gridOptions.enableRowSelection) {
      if (this.rowSelectionExtension && this.rowSelectionExtension.register) {
        this.extensionList.push({ name: ExtensionName.rowSelectionExtension, service: this.rowSelectionExtension.register() });
      }
    }

    // Header Button Plugin
    if (this.sharedService.gridOptions.enableHeaderButton) {
      if (this.headerButtonExtension && this.headerButtonExtension.register) {
        this.extensionList.push({ name: ExtensionName.headerButtons, service: this.headerButtonExtension.register() });
      }
    }

    // Header Menu Plugin
    if (this.sharedService.gridOptions.enableHeaderMenu) {
      if (this.headerMenuExtension && this.headerMenuExtension.register) {
        this.extensionList.push({ name: ExtensionName.headerMenu, service: this.headerMenuExtension.register() });
      }
    }

    // Cell External Copy Manager Plugin (Excel Like)
    if (this.sharedService.gridOptions.enableExcelCopyBuffer) {
      if (this.cellExternalCopyExtension && this.cellExternalCopyExtension.register) {
        this.extensionList.push({ name: ExtensionName.cellExternalCopyManager, service: this.cellExternalCopyExtension.register() });
      }
    }

    // manually register other plugins
    if (this.sharedService.gridOptions.registerPlugins !== undefined) {
      if (Array.isArray(this.sharedService.gridOptions.registerPlugins)) {
        this.sharedService.gridOptions.registerPlugins.forEach((plugin) => {
          this.sharedService.grid.registerPlugin(plugin);
          this.extensionList.push({ name: ExtensionName.noname, service: plugin });
        });
      } else {
        this.sharedService.grid.registerPlugin(this.sharedService.gridOptions.registerPlugins);
        this.extensionList.push({ name: ExtensionName.noname, service: this.sharedService.gridOptions.registerPlugins });
      }
    }
  }

  /**
   * Attach/Create different plugins before the Grid creation.
   * For example the multi-select have to be added to the column definition before the grid is created to work properly
   * @param columnDefinitions
   * @param options
   */
  createCheckboxPluginBeforeGridCreation(columnDefinitions: Column[], options: GridOption) {
    if (options.enableCheckboxSelector) {
      this.checkboxSelectorExtension.create(columnDefinitions, options);
    }
  }

  /** Hide a column from the grid */
  hideColumn(column: Column) {
    if (this.sharedService.grid && this.sharedService.grid.getColumns && this.sharedService.grid.setColumns) {
      const columnIndex = this.sharedService.grid.getColumnIndex(column.id);
      this.sharedService.visibleColumns = this.removeColumnByIndex(this.sharedService.grid.getColumns(), columnIndex);
      this.sharedService.grid.setColumns(this.sharedService.visibleColumns);
    }
  }

  /** Dispose of all the controls & plugins */
  dispose() {
    this.sharedService.grid = null;
    this.sharedService.visibleColumns = [];

    // dispose of each control/plugin if it has a destroy method
    this.extensionList.forEach((item) => {
      if (item && item.service && item.service.destroy) {
        item.service.destroy();
      }
    });
    this.extensionList = [];
  }

  /** Refresh the dataset through the Backend Service */
  refreshBackendDataset(gridOptions?: GridOption) {
    this.gridMenuExtension.refreshBackendDataset(gridOptions);
  }

  /**
   * Remove a column from the grid by it's index in the grid
   * @param array input
   * @param index
   */
  removeColumnByIndex(array: any[], index: number) {
    return array.filter((el: any, i: number) => {
      return index !== i;
    });
  }

  /** Translate the Column Picker and it's last 2 checkboxes */
  translateColumnPicker() {
    this.columnPickerExtension.translateColumnPicker();
  }

  /**
   * Translate the Header Menu titles, we need to loop through all column definition to re-translate them
   */
  translateGridMenu() {
    if (this.sharedService.gridOptions && this.sharedService.gridOptions.gridMenu) {
      this.gridMenuExtension.translateGridMenu();
    }
  }

  /**
   * Translate the Header Menu titles, we need to loop through all column definition to re-translate them
   */
  translateHeaderMenu() {
    if (this.sharedService.gridOptions && this.sharedService.gridOptions.headerMenu) {
      this.headerMenuExtension.translateHeaderMenu();
    }
  }

  /**
   * Translate manually the header titles.
   * We could optionally pass a locale (that will change currently loaded locale), else it will use current locale
   * @param locale to use
   * @param new column definitions (optional)
   */
  translateColumnHeaders(locale?: boolean | string, newColumnDefinitions?: Column[]) {
    if (locale) {
      this.translate.use(locale as string);
    }

    const columnDefinitions = newColumnDefinitions || this.sharedService.columnDefinitions;

    this.translateItems(columnDefinitions, 'headerKey', 'name');
    this.translateItems(this.sharedService.allColumns, 'headerKey', 'name');

    // re-render the column headers
    this.renderColumnHeaders(columnDefinitions);
  }

  /**
   * Render (or re-render) the column headers from column definitions.
   * calling setColumns() will trigger a grid re-render
   */
  renderColumnHeaders(newColumnDefinitions?: Column[]) {
    const collection = newColumnDefinitions || this.sharedService.columnDefinitions;
    if (Array.isArray(collection) && this.sharedService.grid && this.sharedService.grid.setColumns) {
      this.sharedService.grid.setColumns(collection);
    }
  }

  /** Translate the an array of items from an input key and assign to the output key */
  private translateItems(items: any[], inputKey: string, outputKey: string) {
    for (const item of items) {
      if (item[inputKey]) {
        item[outputKey] = this.translate.instant(item[inputKey]);
      }
    }
  }
}
