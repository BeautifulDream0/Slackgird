/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import * as tslib_1 from "tslib";
// import 3rd party vendor libs
// only import the necessary core lib, each will be imported on demand when enabled (via require)
import 'jquery-ui-dist/jquery-ui';
import 'slickgrid/lib/jquery.event.drag-2.3.0';
import 'slickgrid/slick.core';
import 'slickgrid/slick.grid';
import 'slickgrid/slick.dataview';
import { Component, ElementRef, EventEmitter, Inject, Injectable, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { castToPromise, titleCase, unsubscribeAllObservables } from './../services/utilities';
import { GlobalGridOptions } from './../global-grid-options';
import { ExtensionName, GridStateType, } from './../models/index';
import { FilterFactory } from '../filters/filterFactory';
import { SlickgridConfig } from '../slickgrid-config';
import { Observable } from 'rxjs';
// Services
import { ExportService } from './../services/export.service';
import { ExtensionService } from '../services/extension.service';
import { ExtensionUtility } from '../extensions/extensionUtility';
import { FilterService } from './../services/filter.service';
import { GraphqlService } from './../services/graphql.service';
import { GridEventService } from './../services/gridEvent.service';
import { GridService } from './../services/grid.service';
import { GridStateService } from './../services/gridState.service';
import { GroupingAndColspanService } from './../services/groupingAndColspan.service';
import { ResizerService } from './../services/resizer.service';
import { SharedService } from '../services/shared.service';
import { SortService } from './../services/sort.service';
// Extensions (SlickGrid Controls & Plugins)
import { AutoTooltipExtension } from '../extensions/autoTooltipExtension';
import { CellExternalCopyManagerExtension } from '../extensions/cellExternalCopyManagerExtension';
import { CheckboxSelectorExtension } from '../extensions/checkboxSelectorExtension';
import { ColumnPickerExtension } from '../extensions/columnPickerExtension';
import { DraggableGroupingExtension } from '../extensions/draggableGroupingExtension';
import { GridMenuExtension } from '../extensions/gridMenuExtension';
import { GroupItemMetaProviderExtension } from '../extensions/groupItemMetaProviderExtension';
import { HeaderButtonExtension } from '../extensions/headerButtonExtension';
import { HeaderMenuExtension } from '../extensions/headerMenuExtension';
import { RowMoveManagerExtension } from '../extensions/rowMoveManagerExtension';
import { RowSelectionExtension } from '../extensions/rowSelectionExtension';
/** @type {?} */
const slickgridEventPrefix = 'sg';
export class AngularSlickgridComponent {
    /**
     * @param {?} elm
     * @param {?} exportService
     * @param {?} extensionService
     * @param {?} extensionUtility
     * @param {?} filterService
     * @param {?} gridService
     * @param {?} gridEventService
     * @param {?} gridStateService
     * @param {?} groupingAndColspanService
     * @param {?} resizer
     * @param {?} sharedService
     * @param {?} sortService
     * @param {?} translate
     * @param {?} forRootConfig
     */
    constructor(elm, exportService, extensionService, extensionUtility, filterService, gridService, gridEventService, gridStateService, groupingAndColspanService, resizer, sharedService, sortService, translate, forRootConfig) {
        this.elm = elm;
        this.exportService = exportService;
        this.extensionService = extensionService;
        this.extensionUtility = extensionUtility;
        this.filterService = filterService;
        this.gridService = gridService;
        this.gridEventService = gridEventService;
        this.gridStateService = gridStateService;
        this.groupingAndColspanService = groupingAndColspanService;
        this.resizer = resizer;
        this.sharedService = sharedService;
        this.sortService = sortService;
        this.translate = translate;
        this.forRootConfig = forRootConfig;
        this._eventHandler = new Slick.EventHandler();
        this._hideHeaderRowAfterPageLoad = false;
        this.groupingDefinition = {};
        this.showPagination = false;
        this.isGridInitialized = false;
        this.subscriptions = [];
        this.onAngularGridCreated = new EventEmitter();
        this.onDataviewCreated = new EventEmitter();
        this.onGridCreated = new EventEmitter();
        this.onGridInitialized = new EventEmitter();
        this.onBeforeGridCreate = new EventEmitter();
        this.onBeforeGridDestroy = new EventEmitter();
        this.onAfterGridDestroyed = new EventEmitter();
        this.onGridStateChanged = new EventEmitter();
    }
    /**
     * @param {?} height
     * @return {?}
     */
    set gridHeight(height) {
        this._fixedHeight = height;
    }
    /**
     * @param {?} width
     * @return {?}
     */
    set gridWidth(width) {
        this._fixedWidth = width;
    }
    /**
     * @param {?} columnDefinitions
     * @return {?}
     */
    set columnDefinitions(columnDefinitions) {
        this._columnDefinitions = columnDefinitions;
        if (this.isGridInitialized) {
            this.updateColumnDefinitionsList(columnDefinitions);
        }
    }
    /**
     * @return {?}
     */
    get columnDefinitions() {
        return this._columnDefinitions;
    }
    /**
     * @param {?} dataset
     * @return {?}
     */
    set dataset(dataset) {
        this._dataset = dataset;
        this.refreshGridData(dataset);
    }
    /**
     * @return {?}
     */
    get dataset() {
        return this._dataView.getItems();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.onBeforeGridCreate.emit(true);
        if (this.gridOptions && !this.gridOptions.enableAutoResize && !this.gridOptions.autoResize) {
            this.gridHeightString = `${this._fixedHeight}px`;
            this.gridWidthString = `${this._fixedWidth}px`;
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.onBeforeGridDestroy.emit(this.grid);
        this.destroy();
        this.onAfterGridDestroyed.emit(true);
    }
    /**
     * @param {?=} emptyDomElementContainer
     * @return {?}
     */
    destroy(emptyDomElementContainer = false) {
        this._dataView = [];
        this.gridOptions = {};
        this._eventHandler.unsubscribeAll();
        this.extensionService.dispose();
        this.filterService.dispose();
        this.gridEventService.dispose();
        this.gridStateService.dispose();
        this.groupingAndColspanService.dispose();
        this.resizer.dispose();
        this.sortService.dispose();
        this.grid.destroy();
        if (emptyDomElementContainer) {
            $(this.gridOptions.gridContainerId).empty();
        }
        // also unsubscribe all RxJS subscriptions
        this.subscriptions = unsubscribeAllObservables(this.subscriptions);
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this.initialization();
        this.isGridInitialized = true;
    }
    /**
     * @return {?}
     */
    initialization() {
        // make sure the dataset is initialized (if not it will throw an error that it cannot getLength of null)
        this._dataset = this._dataset || [];
        this.gridOptions = this.mergeGridOptions(this.gridOptions);
        this.createBackendApiInternalPostProcessCallback(this.gridOptions);
        if (!this.customDataView) {
            if (this.gridOptions.draggableGrouping || this.gridOptions.enableGrouping) {
                this.extensionUtility.loadExtensionDynamically(ExtensionName.groupItemMetaProvider);
                this.groupItemMetadataProvider = new Slick.Data.GroupItemMetadataProvider();
                this.sharedService.groupItemMetadataProvider = this.groupItemMetadataProvider;
                this._dataView = new Slick.Data.DataView({ groupItemMetadataProvider: this.groupItemMetadataProvider });
            }
            else {
                this._dataView = new Slick.Data.DataView();
            }
        }
        // for convenience, we provide the property "editor" as an Angular-Slickgrid editor complex object
        // however "editor" is used internally by SlickGrid for it's own Editor Factory
        // so in our lib we will swap "editor" and copy it into a new property called "internalColumnEditor"
        // then take back "editor.model" and make it the new "editor" so that SlickGrid Editor Factory still works
        this._columnDefinitions = this._columnDefinitions.map((column) => {
            // on every Editor that have a "collectionAsync", resolve the data and assign it to the "collection" property
            if (column.editor && column.editor.collectionAsync) {
                this.loadEditorCollectionAsync(column);
            }
            return Object.assign({}, column, { editor: column.editor && column.editor.model, internalColumnEditor: Object.assign({}, column.editor) });
        });
        // save reference for all columns before they optionally become hidden/visible
        this.sharedService.allColumns = this._columnDefinitions;
        this.sharedService.visibleColumns = this._columnDefinitions;
        this.extensionService.createExtensionsBeforeGridCreation(this._columnDefinitions, this.gridOptions);
        // build SlickGrid Grid, also user might optionally pass a custom dataview (e.g. remote model)
        this.grid = new Slick.Grid(`#${this.gridId}`, this.customDataView || this._dataView, this._columnDefinitions, this.gridOptions);
        this.sharedService.dataView = this._dataView;
        this.sharedService.grid = this.grid;
        this.extensionService.attachDifferentExtensions();
        this.attachDifferentHooks(this.grid, this.gridOptions, this._dataView);
        // emit the Grid & DataView object to make them available in parent component
        this.onGridCreated.emit(this.grid);
        // initialize the SlickGrid grid
        this.grid.init();
        if (!this.customDataView && (this._dataView && this._dataView.beginUpdate && this._dataView.setItems && this._dataView.endUpdate)) {
            this.onDataviewCreated.emit(this._dataView);
            this._dataView.beginUpdate();
            this._dataView.setItems(this._dataset, this.gridOptions.datasetIdPropertyName);
            this._dataView.endUpdate();
        }
        // user might want to hide the header row on page load but still have `enableFiltering: true`
        // if that is the case, we need to hide the headerRow ONLY AFTER all filters got created & dataView exist
        if (this._hideHeaderRowAfterPageLoad) {
            this.showHeaderRow(false);
        }
        // after the DataView is created & updated execute some processes
        this.executeAfterDataviewCreated(this.grid, this.gridOptions, this._dataView);
        // attach resize ONLY after the dataView is ready
        this.attachResizeHook(this.grid, this.gridOptions);
        // attach grouping and header grouping colspan service
        if (this.gridOptions.createPreHeaderPanel && !this.gridOptions.enableDraggableGrouping) {
            this.groupingAndColspanService.init(this.grid, this._dataView);
        }
        // attach grid  service
        this.gridService.init(this.grid, this._dataView);
        // when user enables translation, we need to translate Headers on first pass & subsequently in the attachDifferentHooks
        if (this.gridOptions.enableTranslate) {
            this.extensionService.translateColumnHeaders();
        }
        // if Export is enabled, initialize the service with the necessary grid and other objects
        if (this.gridOptions.enableExport) {
            this.exportService.init(this.grid, this._dataView);
        }
        // once all hooks are in placed and the grid is initialized, we can emit an event
        this.onGridInitialized.emit(this.grid);
        // attach the Backend Service API callback functions only after the grid is initialized
        // because the preProcess() and onInit() might get triggered
        if (this.gridOptions && this.gridOptions.backendServiceApi) {
            this.attachBackendCallbackFunctions(this.gridOptions);
        }
        this.gridStateService.init(this.grid, this.extensionService, this.filterService, this.sortService);
        this.onAngularGridCreated.emit({
            // Slick Grid & DataView objects
            dataView: this._dataView,
            slickGrid: this.grid,
            // public methods
            destroy: this.destroy.bind(this),
            // return all available Services (non-singleton)
            backendService: this.gridOptions && this.gridOptions.backendServiceApi && this.gridOptions.backendServiceApi.service,
            exportService: this.exportService,
            filterService: this.filterService,
            gridEventService: this.gridEventService,
            gridStateService: this.gridStateService,
            gridService: this.gridService,
            groupingService: this.groupingAndColspanService,
            extensionService: this.extensionService,
            /**
             * @deprecated please use "extensionService" instead
             */
            pluginService: this.extensionService,
            resizerService: this.resizer,
            sortService: this.sortService,
        });
    }
    /**
     * Commits the current edit to the grid
     * @param {?} target
     * @return {?}
     */
    commitEdit(target) {
        if (this.grid.getOptions().autoCommitEdit) {
            /** @type {?} */
            const activeNode = this.grid.getActiveCellNode();
            // a timeout must be set or this could come into conflict when slickgrid
            // tries to commit the edit when going from one editor to another on the grid
            // through the click event. If the timeout was not here it would
            // try to commit/destroy the twice, which would throw a jquery
            // error about the element not being in the DOM
            setTimeout(() => {
                // make sure the target is the active editor so we do not
                // commit prematurely
                if (activeNode && activeNode.contains(target) && this.grid.getEditorLock().isActive()) {
                    this.grid.getEditorLock().commitCurrentEdit();
                }
            });
        }
    }
    /**
     * Define what our internal Post Process callback, it will execute internally after we get back result from the Process backend call
     * For now, this is GraphQL Service only feature and it will basically refresh the Dataset & Pagination without having the user to create his own PostProcess every time
     * @param {?} gridOptions
     * @return {?}
     */
    createBackendApiInternalPostProcessCallback(gridOptions) {
        if (gridOptions && gridOptions.backendServiceApi) {
            /** @type {?} */
            const backendApi = gridOptions.backendServiceApi;
            // internalPostProcess only works with a GraphQL Service, so make sure it is that type
            if (backendApi && backendApi.service && backendApi.service instanceof GraphqlService) {
                backendApi.internalPostProcess = (processResult) => {
                    /** @type {?} */
                    const datasetName = (backendApi && backendApi.service && typeof backendApi.service.getDatasetName === 'function') ? backendApi.service.getDatasetName() : '';
                    if (processResult && processResult.data && processResult.data[datasetName]) {
                        this._dataset = processResult.data[datasetName].nodes;
                        this.refreshGridData(this._dataset, processResult.data[datasetName].totalCount);
                    }
                    else {
                        this._dataset = [];
                    }
                };
            }
        }
    }
    /**
     * @param {?} grid
     * @param {?} gridOptions
     * @param {?} dataView
     * @return {?}
     */
    attachDifferentHooks(grid, gridOptions, dataView) {
        // on locale change, we have to manually translate the Headers, GridMenu
        this.subscriptions.push(this.translate.onLangChange.subscribe((event) => {
            if (gridOptions.enableTranslate) {
                this.extensionService.translateColumnHeaders();
                this.extensionService.translateColumnPicker();
                this.extensionService.translateGridMenu();
                this.extensionService.translateHeaderMenu();
            }
        }));
        // if user entered some Columns "presets", we need to reflect them all in the grid
        if (gridOptions.presets && Array.isArray(gridOptions.presets.columns) && gridOptions.presets.columns.length > 0) {
            /** @type {?} */
            const gridColumns = this.gridStateService.getAssociatedGridColumns(grid, gridOptions.presets.columns);
            if (gridColumns && Array.isArray(gridColumns) && gridColumns.length > 0) {
                // make sure that the checkbox selector is also visible if it is enabled
                if (gridOptions.enableCheckboxSelector) {
                    /** @type {?} */
                    const checkboxColumn = (Array.isArray(this._columnDefinitions) && this._columnDefinitions.length > 0) ? this._columnDefinitions[0] : null;
                    if (checkboxColumn && checkboxColumn.id === '_checkbox_selector' && gridColumns[0].id !== '_checkbox_selector') {
                        gridColumns.unshift(checkboxColumn);
                    }
                }
                // finally set the new presets columns (including checkbox selector if need be)
                grid.setColumns(gridColumns);
            }
        }
        // attach external sorting (backend) when available or default onSort (dataView)
        if (gridOptions.enableSorting && !this.customDataView) {
            gridOptions.backendServiceApi ? this.sortService.attachBackendOnSort(grid, dataView) : this.sortService.attachLocalOnSort(grid, dataView);
        }
        // attach external filter (backend) when available or default onFilter (dataView)
        if (gridOptions.enableFiltering && !this.customDataView) {
            this.filterService.init(grid);
            // if user entered some "presets", we need to reflect them all in the DOM
            if (gridOptions.presets && Array.isArray(gridOptions.presets.filters) && gridOptions.presets.filters.length > 0) {
                this.filterService.populateColumnFilterSearchTerms();
            }
            gridOptions.backendServiceApi ? this.filterService.attachBackendOnFilter(grid) : this.filterService.attachLocalOnFilter(grid, this._dataView);
        }
        // if user set an onInit Backend, we'll run it right away (and if so, we also need to run preProcess, internalPostProcess & postProcess)
        if (gridOptions.backendServiceApi) {
            /** @type {?} */
            const backendApi = gridOptions.backendServiceApi;
            if (backendApi && backendApi.service && backendApi.service.init) {
                backendApi.service.init(backendApi.options, gridOptions.pagination, this.grid);
            }
        }
        // expose all Slick Grid Events through dispatch
        for (const prop in grid) {
            if (grid.hasOwnProperty(prop) && prop.startsWith('on')) {
                this._eventHandler.subscribe(grid[prop], (e, args) => {
                    return this.dispatchCustomEvent(`${slickgridEventPrefix}${titleCase(prop)}`, { eventData: e, args });
                });
            }
        }
        // expose all Slick DataView Events through dispatch
        for (const prop in dataView) {
            if (dataView.hasOwnProperty(prop) && prop.startsWith('on')) {
                this._eventHandler.subscribe(dataView[prop], (e, args) => {
                    return this.dispatchCustomEvent(`${slickgridEventPrefix}${titleCase(prop)}`, { eventData: e, args });
                });
            }
        }
        // expose GridState Service changes event through dispatch
        this.subscriptions.push(this.gridStateService.onGridStateChanged.subscribe((gridStateChange) => {
            this.onGridStateChanged.emit(gridStateChange);
        }));
        // on cell click, mainly used with the columnDef.action callback
        this.gridEventService.attachOnCellChange(grid, dataView);
        this.gridEventService.attachOnClick(grid, dataView);
        if (dataView && grid) {
            this._eventHandler.subscribe(dataView.onRowCountChanged, (e, args) => {
                grid.updateRowCount();
                grid.render();
            });
            this._eventHandler.subscribe(dataView.onRowsChanged, (e, args) => {
                grid.invalidateRows(args.rows);
                grid.render();
            });
        }
        // does the user have a colspan callback?
        if (gridOptions.colspanCallback) {
            this._dataView.getItemMetadata = (rowNumber) => {
                /** @type {?} */
                const item = this._dataView.getItem(rowNumber);
                return gridOptions.colspanCallback(item);
            };
        }
    }
    /**
     * @param {?} gridOptions
     * @return {?}
     */
    attachBackendCallbackFunctions(gridOptions) {
        /** @type {?} */
        const backendApi = gridOptions.backendServiceApi;
        /** @type {?} */
        const serviceOptions = (backendApi && backendApi.service && backendApi.service.options) ? backendApi.service.options : {};
        /** @type {?} */
        const isExecuteCommandOnInit = (!serviceOptions) ? false : ((serviceOptions && serviceOptions.hasOwnProperty('executeProcessCommandOnInit')) ? serviceOptions['executeProcessCommandOnInit'] : true);
        // update backend filters (if need be) before the query runs
        if (backendApi) {
            /** @type {?} */
            const backendService = backendApi.service;
            // if user entered some any "presets", we need to reflect them all in the grid
            if (gridOptions && gridOptions.presets) {
                // Filters "presets"
                if (backendService && backendService.updateFilters && Array.isArray(gridOptions.presets.filters) && gridOptions.presets.filters.length > 0) {
                    backendService.updateFilters(gridOptions.presets.filters, true);
                }
                // Sorters "presets"
                if (backendService && backendService.updateSorters && Array.isArray(gridOptions.presets.sorters) && gridOptions.presets.sorters.length > 0) {
                    backendService.updateSorters(undefined, gridOptions.presets.sorters);
                }
                // Pagination "presets"
                if (backendService && backendService.updatePagination && gridOptions.presets.pagination) {
                    backendService.updatePagination(gridOptions.presets.pagination.pageNumber, gridOptions.presets.pagination.pageSize);
                }
            }
            else {
                /** @type {?} */
                const columnFilters = this.filterService.getColumnFilters();
                if (columnFilters && backendService && backendService.updateFilters) {
                    backendService.updateFilters(columnFilters, false);
                }
            }
        }
        if (backendApi && backendApi.service && (backendApi.onInit || isExecuteCommandOnInit)) {
            /** @type {?} */
            const query = (typeof backendApi.service.buildQuery === 'function') ? backendApi.service.buildQuery() : '';
            /** @type {?} */
            const observableOrPromise = (isExecuteCommandOnInit) ? backendApi.process(query) : backendApi.onInit(query);
            // wrap this inside a setTimeout to avoid timing issue since the gridOptions needs to be ready before running this onInit
            setTimeout(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
                // keep start time & end timestamps & return it after process execution
                /** @type {?} */
                const startTime = new Date();
                if (backendApi.preProcess) {
                    backendApi.preProcess();
                }
                try {
                    // the process could be an Observable (like HttpClient) or a Promise
                    // in any case, we need to have a Promise so that we can await on it (if an Observable, convert it to Promise)
                    /** @type {?} */
                    const processResult = yield castToPromise(observableOrPromise);
                    /** @type {?} */
                    const endTime = new Date();
                    // define what our internal Post Process callback, only available for GraphQL Service for now
                    // it will basically refresh the Dataset & Pagination without having the user to create his own PostProcess every time
                    if (processResult && backendApi && backendApi.service instanceof GraphqlService && backendApi.internalPostProcess) {
                        backendApi.internalPostProcess(processResult);
                    }
                    // send the response process to the postProcess callback
                    if (backendApi.postProcess) {
                        if (processResult instanceof Object) {
                            processResult.statistics = {
                                startTime,
                                endTime,
                                executionTime: endTime.valueOf() - startTime.valueOf(),
                                totalItemCount: this.gridOptions && this.gridOptions.pagination && this.gridOptions.pagination.totalItems
                            };
                        }
                        backendApi.postProcess(processResult);
                    }
                }
                catch (e) {
                    if (backendApi && backendApi.onError) {
                        backendApi.onError(e);
                    }
                    else {
                        throw e;
                    }
                }
            }));
        }
    }
    /**
     * @param {?} grid
     * @param {?} options
     * @return {?}
     */
    attachResizeHook(grid, options) {
        // expand/autofit columns on first page load
        if (grid && options.autoFitColumnsOnFirstLoad && options.enableAutoSizeColumns) {
            grid.autosizeColumns();
            // compensate anytime SlickGrid measureScrollbar is incorrect (only seems to happen in Chrome 1/5 computers)
            this.resizer.compensateHorizontalScroll(this.grid, this.gridOptions);
        }
        // auto-resize grid on browser resize
        if (this._fixedHeight || this._fixedWidth) {
            this.resizer.init(grid, { height: this._fixedHeight, width: this._fixedWidth });
        }
        else {
            this.resizer.init(grid);
        }
        if (options.enableAutoResize) {
            this.resizer.attachAutoResizeDataGrid();
            if (grid && options.autoFitColumnsOnFirstLoad && options.enableAutoSizeColumns) {
                grid.autosizeColumns();
            }
        }
    }
    /**
     * @param {?} grid
     * @param {?} gridOptions
     * @param {?} dataView
     * @return {?}
     */
    executeAfterDataviewCreated(grid, gridOptions, dataView) {
        // if user entered some Sort "presets", we need to reflect them all in the DOM
        if (gridOptions.enableSorting) {
            if (gridOptions.presets && Array.isArray(gridOptions.presets.sorters) && gridOptions.presets.sorters.length > 0) {
                this.sortService.loadLocalPresets(grid, dataView);
            }
        }
    }
    /**
     * @param {?} gridOptions
     * @return {?}
     */
    mergeGridOptions(gridOptions) {
        gridOptions.gridId = this.gridId;
        gridOptions.gridContainerId = `slickGridContainer-${this.gridId}`;
        // use jquery extend to deep merge & copy to avoid immutable properties being changed in GlobalGridOptions after a route change
        /** @type {?} */
        const options = $.extend(true, {}, GlobalGridOptions, this.forRootConfig, gridOptions);
        // also make sure to show the header row if user have enabled filtering
        this._hideHeaderRowAfterPageLoad = (options.showHeaderRow === false);
        if (options.enableFiltering && !options.showHeaderRow) {
            options.showHeaderRow = options.enableFiltering;
        }
        return options;
    }
    /**
     * On a Pagination changed, we will trigger a Grid State changed with the new pagination info
     * Also if we use Row Selection or the Checkbox Selector, we need to reset any selection
     * @param {?} pagination
     * @return {?}
     */
    paginationChanged(pagination) {
        if (this.gridOptions.enableRowSelection || this.gridOptions.enableCheckboxSelector) {
            this.gridService.setSelectedRows([]);
        }
        this.gridStateService.onGridStateChanged.next({
            change: { newValues: pagination, type: GridStateType.pagination },
            gridState: this.gridStateService.getCurrentGridState()
        });
    }
    /**
     * When dataset changes, we need to refresh the entire grid UI & possibly resize it as well
     * @param {?} dataset
     * @param {?=} totalCount
     * @return {?}
     */
    refreshGridData(dataset, totalCount) {
        if (Array.isArray(dataset) && this.grid && this._dataView && typeof this._dataView.setItems === 'function') {
            this._dataView.setItems(dataset, this.gridOptions.datasetIdPropertyName);
            if (!this.gridOptions.backendServiceApi) {
                this._dataView.reSort();
            }
            // this.grid.setData(dataset);
            this.grid.invalidate();
            this.grid.render();
            if (this.gridOptions.backendServiceApi) {
                // do we want to show pagination?
                // if we have a backendServiceApi and the enablePagination is undefined, we'll assume that we do want to see it, else get that defined value
                this.showPagination = ((this.gridOptions.backendServiceApi && this.gridOptions.enablePagination === undefined) ? true : this.gridOptions.enablePagination) || false;
                // before merging the grid options, make sure that it has the totalItems count
                // once we have that, we can merge and pass all these options to the pagination component
                if (!this.gridOptions.pagination) {
                    this.gridOptions.pagination = (this.gridOptions.pagination) ? this.gridOptions.pagination : undefined;
                }
                if (this.gridOptions.pagination && totalCount !== undefined) {
                    this.gridOptions.pagination.totalItems = totalCount;
                }
                if (this.gridOptions.presets && this.gridOptions.presets.pagination && this.gridOptions.pagination) {
                    this.gridOptions.pagination.pageSize = this.gridOptions.presets.pagination.pageSize;
                    this.gridOptions.pagination.pageNumber = this.gridOptions.presets.pagination.pageNumber;
                }
                this.gridPaginationOptions = this.mergeGridOptions(this.gridOptions);
            }
            // resize the grid inside a slight timeout, in case other DOM element changed prior to the resize (like a filter/pagination changed)
            if (this.grid && this.gridOptions.enableAutoResize) {
                /** @type {?} */
                const delay = this.gridOptions.autoResize && this.gridOptions.autoResize.delay;
                this.resizer.resizeGrid(delay || 10);
            }
        }
    }
    /**
     * Dynamically change or update the column definitions list.
     * We will re-render the grid so that the new header and data shows up correctly.
     * If using i18n, we also need to trigger a re-translate of the column headers
     * @param {?} newColumnDefinitions
     * @return {?}
     */
    updateColumnDefinitionsList(newColumnDefinitions) {
        if (this.gridOptions.enableTranslate) {
            this.extensionService.translateColumnHeaders(false, newColumnDefinitions);
        }
        else {
            this.extensionService.renderColumnHeaders(newColumnDefinitions);
        }
        if (this.gridOptions && this.gridOptions.enableAutoSizeColumns) {
            this.grid.autosizeColumns();
        }
    }
    /**
     * Toggle the filter row displayed on first row
     * @param {?} isShowing
     * @return {?}
     */
    showHeaderRow(isShowing) {
        this.grid.setHeaderRowVisibility(isShowing);
        return isShowing;
    }
    /**
     * Toggle the filter row displayed on first row
     * @return {?}
     */
    toggleHeaderRow() {
        /** @type {?} */
        const isShowing = !this.grid.getOptions().showHeaderRow;
        this.grid.setHeaderRowVisibility(isShowing);
        return isShowing;
    }
    //
    // private functions
    // ------------------
    /**
     * Dispatch of Custom Event, which by default will bubble & is cancelable
     * @private
     * @param {?} eventName
     * @param {?=} data
     * @param {?=} isBubbling
     * @param {?=} isCancelable
     * @return {?}
     */
    dispatchCustomEvent(eventName, data, isBubbling = true, isCancelable = true) {
        /** @type {?} */
        const eventInit = { bubbles: isBubbling, cancelable: isCancelable };
        if (data) {
            eventInit.detail = data;
        }
        return this.elm.nativeElement.dispatchEvent(new CustomEvent(eventName, eventInit));
    }
    /**
     * Load the Editor Collection asynchronously and replace the "collection" property when Observable resolves
     * @private
     * @param {?} column
     * @return {?}
     */
    loadEditorCollectionAsync(column) {
        /** @type {?} */
        const collectionAsync = column && column.editor && column.editor.collectionAsync;
        if (collectionAsync instanceof Observable) {
            this.subscriptions.push(collectionAsync.subscribe((resolvedCollection) => this.updateEditorCollection(column, resolvedCollection)));
        }
    }
    /**
     * Update the Editor "collection" property from an async call resolved
     * Since this is called after the async call resolves, the pointer will not be the same as the "column" argument passed.
     * Once we found the new pointer, we will reassign the "editor" and "collection" to the "internalColumnEditor" so it has newest collection
     * @private
     * @param {?} column
     * @param {?} newCollection
     * @return {?}
     */
    updateEditorCollection(column, newCollection) {
        column.editor.collection = newCollection;
        // find the new column reference pointer
        /** @type {?} */
        const columns = this.grid.getColumns();
        if (Array.isArray(columns)) {
            /** @type {?} */
            const columnRef = columns.find((col) => col.id === column.id);
            columnRef.internalColumnEditor = column.editor;
        }
    }
}
AngularSlickgridComponent.decorators = [
    { type: Injectable },
    { type: Component, args: [{
                selector: 'angular-slickgrid',
                template: "<div id=\"slickGridContainer-{{gridId}}\" class=\"gridPane\" [style.width]=\"gridWidthString\">\r\n    <div attr.id='{{gridId}}' class=\"slickgrid-container\" style=\"width: 100%\" [style.height]=\"gridHeightString\">\r\n    </div>\r\n\r\n    <slick-pagination id=\"slickPagingContainer-{{gridId}}\"\r\n        *ngIf=\"showPagination\"\r\n        (onPaginationChanged)=\"paginationChanged($event)\"\r\n        [gridPaginationOptions]=\"gridPaginationOptions\">\r\n    </slick-pagination>\r\n</div>\r\n",
                providers: [
                    // make everything transient (non-singleton)
                    AutoTooltipExtension,
                    CellExternalCopyManagerExtension,
                    CheckboxSelectorExtension,
                    ColumnPickerExtension,
                    DraggableGroupingExtension,
                    ExtensionService,
                    ExportService,
                    ExtensionUtility,
                    FilterFactory,
                    FilterService,
                    GraphqlService,
                    GridEventService,
                    GridMenuExtension,
                    GridService,
                    GridStateService,
                    GroupingAndColspanService,
                    GroupItemMetaProviderExtension,
                    HeaderButtonExtension,
                    HeaderMenuExtension,
                    ResizerService,
                    RowMoveManagerExtension,
                    RowSelectionExtension,
                    SharedService,
                    SortService,
                    SlickgridConfig
                ]
            }] }
];
/** @nocollapse */
AngularSlickgridComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: ExportService },
    { type: ExtensionService },
    { type: ExtensionUtility },
    { type: FilterService },
    { type: GridService },
    { type: GridEventService },
    { type: GridStateService },
    { type: GroupingAndColspanService },
    { type: ResizerService },
    { type: SharedService },
    { type: SortService },
    { type: TranslateService },
    { type: undefined, decorators: [{ type: Inject, args: ['config',] }] }
];
AngularSlickgridComponent.propDecorators = {
    onAngularGridCreated: [{ type: Output }],
    onDataviewCreated: [{ type: Output }],
    onGridCreated: [{ type: Output }],
    onGridInitialized: [{ type: Output }],
    onBeforeGridCreate: [{ type: Output }],
    onBeforeGridDestroy: [{ type: Output }],
    onAfterGridDestroyed: [{ type: Output }],
    onGridStateChanged: [{ type: Output }],
    customDataView: [{ type: Input }],
    gridId: [{ type: Input }],
    gridOptions: [{ type: Input }],
    gridHeight: [{ type: Input }],
    gridWidth: [{ type: Input }],
    columnDefinitions: [{ type: Input }],
    dataset: [{ type: Input }]
};
if (false) {
    /**
     * @type {?}
     * @private
     */
    AngularSlickgridComponent.prototype._dataset;
    /**
     * @type {?}
     * @private
     */
    AngularSlickgridComponent.prototype._columnDefinitions;
    /**
     * @type {?}
     * @private
     */
    AngularSlickgridComponent.prototype._dataView;
    /**
     * @type {?}
     * @private
     */
    AngularSlickgridComponent.prototype._eventHandler;
    /**
     * @type {?}
     * @private
     */
    AngularSlickgridComponent.prototype._fixedHeight;
    /**
     * @type {?}
     * @private
     */
    AngularSlickgridComponent.prototype._fixedWidth;
    /**
     * @type {?}
     * @private
     */
    AngularSlickgridComponent.prototype._hideHeaderRowAfterPageLoad;
    /** @type {?} */
    AngularSlickgridComponent.prototype.grid;
    /** @type {?} */
    AngularSlickgridComponent.prototype.gridPaginationOptions;
    /** @type {?} */
    AngularSlickgridComponent.prototype.gridHeightString;
    /** @type {?} */
    AngularSlickgridComponent.prototype.gridWidthString;
    /** @type {?} */
    AngularSlickgridComponent.prototype.groupingDefinition;
    /** @type {?} */
    AngularSlickgridComponent.prototype.groupItemMetadataProvider;
    /** @type {?} */
    AngularSlickgridComponent.prototype.showPagination;
    /** @type {?} */
    AngularSlickgridComponent.prototype.isGridInitialized;
    /** @type {?} */
    AngularSlickgridComponent.prototype.subscriptions;
    /** @type {?} */
    AngularSlickgridComponent.prototype.onAngularGridCreated;
    /** @type {?} */
    AngularSlickgridComponent.prototype.onDataviewCreated;
    /** @type {?} */
    AngularSlickgridComponent.prototype.onGridCreated;
    /** @type {?} */
    AngularSlickgridComponent.prototype.onGridInitialized;
    /** @type {?} */
    AngularSlickgridComponent.prototype.onBeforeGridCreate;
    /** @type {?} */
    AngularSlickgridComponent.prototype.onBeforeGridDestroy;
    /** @type {?} */
    AngularSlickgridComponent.prototype.onAfterGridDestroyed;
    /** @type {?} */
    AngularSlickgridComponent.prototype.onGridStateChanged;
    /** @type {?} */
    AngularSlickgridComponent.prototype.customDataView;
    /** @type {?} */
    AngularSlickgridComponent.prototype.gridId;
    /** @type {?} */
    AngularSlickgridComponent.prototype.gridOptions;
    /**
     * @type {?}
     * @private
     */
    AngularSlickgridComponent.prototype.elm;
    /**
     * @type {?}
     * @private
     */
    AngularSlickgridComponent.prototype.exportService;
    /**
     * @type {?}
     * @private
     */
    AngularSlickgridComponent.prototype.extensionService;
    /**
     * @type {?}
     * @private
     */
    AngularSlickgridComponent.prototype.extensionUtility;
    /**
     * @type {?}
     * @private
     */
    AngularSlickgridComponent.prototype.filterService;
    /**
     * @type {?}
     * @private
     */
    AngularSlickgridComponent.prototype.gridService;
    /**
     * @type {?}
     * @private
     */
    AngularSlickgridComponent.prototype.gridEventService;
    /**
     * @type {?}
     * @private
     */
    AngularSlickgridComponent.prototype.gridStateService;
    /**
     * @type {?}
     * @private
     */
    AngularSlickgridComponent.prototype.groupingAndColspanService;
    /**
     * @type {?}
     * @private
     */
    AngularSlickgridComponent.prototype.resizer;
    /**
     * @type {?}
     * @private
     */
    AngularSlickgridComponent.prototype.sharedService;
    /**
     * @type {?}
     * @private
     */
    AngularSlickgridComponent.prototype.sortService;
    /**
     * @type {?}
     * @private
     */
    AngularSlickgridComponent.prototype.translate;
    /**
     * @type {?}
     * @private
     */
    AngularSlickgridComponent.prototype.forRootConfig;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1zbGlja2dyaWQuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Im5nOi8vYW5ndWxhci1zbGlja2dyaWQvIiwic291cmNlcyI6WyJhcHAvbW9kdWxlcy9hbmd1bGFyLXNsaWNrZ3JpZC9jb21wb25lbnRzL2FuZ3VsYXItc2xpY2tncmlkLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBRUEsT0FBTywwQkFBMEIsQ0FBQztBQUNsQyxPQUFPLHVDQUF1QyxDQUFDO0FBQy9DLE9BQU8sc0JBQXNCLENBQUM7QUFDOUIsT0FBTyxzQkFBc0IsQ0FBQztBQUM5QixPQUFPLDBCQUEwQixDQUFDO0FBRWxDLE9BQU8sRUFBaUIsU0FBUyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFxQixNQUFNLGVBQWUsQ0FBQztBQUN6SSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUN2RCxPQUFPLEVBQUUsYUFBYSxFQUFFLFNBQVMsRUFBRSx5QkFBeUIsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQzlGLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQzdELE9BQU8sRUFJTCxhQUFhLEVBSWIsYUFBYSxHQUVkLE1BQU0sbUJBQW1CLENBQUM7QUFDM0IsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDBCQUEwQixDQUFDO0FBQ3pELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUN0RCxPQUFPLEVBQUUsVUFBVSxFQUFnQixNQUFNLE1BQU0sQ0FBQzs7QUFHaEQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQzdELE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLCtCQUErQixDQUFDO0FBQ2pFLE9BQU8sRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQ2xF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QUE0Qzs7SUFDNUMseUNBQVU7O0lBQ1YsMERBQWtDOztJQUNsQyxxREFBeUI7O0lBQ3pCLG9EQUF3Qjs7SUFDeEIsdURBQTZCOztJQUM3Qiw4REFBK0I7O0lBQy9CLG1EQUF1Qjs7SUFDdkIsc0RBQTBCOztJQUMxQixrREFBbUM7O0lBRW5DLHlEQUF5RTs7SUFDekUsc0RBQXNEOztJQUN0RCxrREFBa0Q7O0lBQ2xELHNEQUFzRDs7SUFDdEQsdURBQTJEOztJQUMzRCx3REFBd0Q7O0lBQ3hELHlEQUE2RDs7SUFDN0QsdURBQW1FOztJQUNuRSxtREFBNkI7O0lBQzdCLDJDQUF3Qjs7SUFDeEIsZ0RBQWlDOzs7OztJQStCL0Isd0NBQXVCOzs7OztJQUN2QixrREFBb0M7Ozs7O0lBQ3BDLHFEQUEwQzs7Ozs7SUFDMUMscURBQTBDOzs7OztJQUMxQyxrREFBb0M7Ozs7O0lBQ3BDLGdEQUFnQzs7Ozs7SUFDaEMscURBQTBDOzs7OztJQUMxQyxxREFBMEM7Ozs7O0lBQzFDLDhEQUE0RDs7Ozs7SUFDNUQsNENBQStCOzs7OztJQUMvQixrREFBb0M7Ozs7O0lBQ3BDLGdEQUFnQzs7Ozs7SUFDaEMsOENBQW1DOzs7OztJQUNuQyxrREFBbUQiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQgM3JkIHBhcnR5IHZlbmRvciBsaWJzXG4vLyBvbmx5IGltcG9ydCB0aGUgbmVjZXNzYXJ5IGNvcmUgbGliLCBlYWNoIHdpbGwgYmUgaW1wb3J0ZWQgb24gZGVtYW5kIHdoZW4gZW5hYmxlZCAodmlhIHJlcXVpcmUpXG5pbXBvcnQgJ2pxdWVyeS11aS1kaXN0L2pxdWVyeS11aSc7XG5pbXBvcnQgJ3NsaWNrZ3JpZC9saWIvanF1ZXJ5LmV2ZW50LmRyYWctMi4zLjAnO1xuaW1wb3J0ICdzbGlja2dyaWQvc2xpY2suY29yZSc7XG5pbXBvcnQgJ3NsaWNrZ3JpZC9zbGljay5ncmlkJztcbmltcG9ydCAnc2xpY2tncmlkL3NsaWNrLmRhdGF2aWV3JztcblxuaW1wb3J0IHsgQWZ0ZXJWaWV3SW5pdCwgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIEluamVjdCwgSW5qZWN0YWJsZSwgSW5wdXQsIE91dHB1dCwgT25EZXN0cm95LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFRyYW5zbGF0ZVNlcnZpY2UgfSBmcm9tICdAbmd4LXRyYW5zbGF0ZS9jb3JlJztcbmltcG9ydCB7IGNhc3RUb1Byb21pc2UsIHRpdGxlQ2FzZSwgdW5zdWJzY3JpYmVBbGxPYnNlcnZhYmxlcyB9IGZyb20gJy4vLi4vc2VydmljZXMvdXRpbGl0aWVzJztcbmltcG9ydCB7IEdsb2JhbEdyaWRPcHRpb25zIH0gZnJvbSAnLi8uLi9nbG9iYWwtZ3JpZC1vcHRpb25zJztcbmltcG9ydCB7XG4gIEFuZ3VsYXJHcmlkSW5zdGFuY2UsXG4gIEJhY2tlbmRTZXJ2aWNlT3B0aW9uLFxuICBDb2x1bW4sXG4gIEV4dGVuc2lvbk5hbWUsXG4gIEdyYXBocWxSZXN1bHQsXG4gIEdyaWRPcHRpb24sXG4gIEdyaWRTdGF0ZUNoYW5nZSxcbiAgR3JpZFN0YXRlVHlwZSxcbiAgUGFnaW5hdGlvbixcbn0gZnJvbSAnLi8uLi9tb2RlbHMvaW5kZXgnO1xuaW1wb3J0IHsgRmlsdGVyRmFjdG9yeSB9IGZyb20gJy4uL2ZpbHRlcnMvZmlsdGVyRmFjdG9yeSc7XG5pbXBvcnQgeyBTbGlja2dyaWRDb25maWcgfSBmcm9tICcuLi9zbGlja2dyaWQtY29uZmlnJztcbmltcG9ydCB7IE9ic2VydmFibGUsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuXG4vLyBTZXJ2aWNlc1xuaW1wb3J0IHsgRXhwb3J0U2VydmljZSB9IGZyb20gJy4vLi4vc2VydmljZXMvZXhwb3J0LnNlcnZpY2UnO1xuaW1wb3J0IHsgRXh0ZW5zaW9uU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL2V4dGVuc2lvbi5zZXJ2aWNlJztcbmltcG9ydCB7IEV4dGVuc2lvblV0aWxpdHkgfSBmcm9tICcuLi9leHRlbnNpb25zL2V4dGVuc2lvblV0aWxpdHknO1xuaW1wb3J0IHsgRmlsdGVyU2VydmljZSB9IGZyb20gJy4vLi4vc2VydmljZXMvZmlsdGVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgR3JhcGhxbFNlcnZpY2UgfSBmcm9tICcuLy4uL3NlcnZpY2VzL2dyYXBocWwuc2VydmljZSc7XG5pbXBvcnQgeyBHcmlkRXZlbnRTZXJ2aWNlIH0gZnJvbSAnLi8uLi9zZXJ2aWNlcy9ncmlkRXZlbnQuc2VydmljZSc7XG5pbXBvcnQgeyBHcmlkU2VydmljZSB9IGZyb20gJy4vLi4vc2VydmljZXMvZ3JpZC5zZXJ2aWNlJztcbmltcG9ydCB7IEdyaWRTdGF0ZVNlcnZpY2UgfSBmcm9tICcuLy4uL3NlcnZpY2VzL2dyaWRTdGF0ZS5zZXJ2aWNlJztcbmltcG9ydCB7IEdyb3VwaW5nQW5kQ29sc3BhblNlcnZpY2UgfSBmcm9tICcuLy4uL3NlcnZpY2VzL2dyb3VwaW5nQW5kQ29sc3Bhbi5zZXJ2aWNlJztcbmltcG9ydCB7IFJlc2l6ZXJTZXJ2aWNlIH0gZnJvbSAnLi8uLi9zZXJ2aWNlcy9yZXNpemVyLnNlcnZpY2UnO1xuaW1wb3J0IHsgU2hhcmVkU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL3NoYXJlZC5zZXJ2aWNlJztcbmltcG9ydCB7IFNvcnRTZXJ2aWNlIH0gZnJvbSAnLi8uLi9zZXJ2aWNlcy9zb3J0LnNlcnZpY2UnO1xuXG4vLyBFeHRlbnNpb25zIChTbGlja0dyaWQgQ29udHJvbHMgJiBQbHVnaW5zKVxuaW1wb3J0IHsgQXV0b1Rvb2x0aXBFeHRlbnNpb24gfSBmcm9tICcuLi9leHRlbnNpb25zL2F1dG9Ub29sdGlwRXh0ZW5zaW9uJztcbmltcG9ydCB7IENlbGxFeHRlcm5hbENvcHlNYW5hZ2VyRXh0ZW5zaW9uIH0gZnJvbSAnLi4vZXh0ZW5zaW9ucy9jZWxsRXh0ZXJuYWxDb3B5TWFuYWdlckV4dGVuc2lvbic7XG5pbXBvcnQgeyBDaGVja2JveFNlbGVjdG9yRXh0ZW5zaW9uIH0gZnJvbSAnLi4vZXh0ZW5zaW9ucy9jaGVja2JveFNlbGVjdG9yRXh0ZW5zaW9uJztcbmltcG9ydCB7IENvbHVtblBpY2tlckV4dGVuc2lvbiB9IGZyb20gJy4uL2V4dGVuc2lvbnMvY29sdW1uUGlja2VyRXh0ZW5zaW9uJztcbmltcG9ydCB7IERyYWdnYWJsZUdyb3VwaW5nRXh0ZW5zaW9uIH0gZnJvbSAnLi4vZXh0ZW5zaW9ucy9kcmFnZ2FibGVHcm91cGluZ0V4dGVuc2lvbic7XG5pbXBvcnQgeyBHcmlkTWVudUV4dGVuc2lvbiB9IGZyb20gJy4uL2V4dGVuc2lvbnMvZ3JpZE1lbnVFeHRlbnNpb24nO1xuaW1wb3J0IHsgR3JvdXBJdGVtTWV0YVByb3ZpZGVyRXh0ZW5zaW9uIH0gZnJvbSAnLi4vZXh0ZW5zaW9ucy9ncm91cEl0ZW1NZXRhUHJvdmlkZXJFeHRlbnNpb24nO1xuaW1wb3J0IHsgSGVhZGVyQnV0dG9uRXh0ZW5zaW9uIH0gZnJvbSAnLi4vZXh0ZW5zaW9ucy9oZWFkZXJCdXR0b25FeHRlbnNpb24nO1xuaW1wb3J0IHsgSGVhZGVyTWVudUV4dGVuc2lvbiB9IGZyb20gJy4uL2V4dGVuc2lvbnMvaGVhZGVyTWVudUV4dGVuc2lvbic7XG5pbXBvcnQgeyBSb3dNb3ZlTWFuYWdlckV4dGVuc2lvbiB9IGZyb20gJy4uL2V4dGVuc2lvbnMvcm93TW92ZU1hbmFnZXJFeHRlbnNpb24nO1xuaW1wb3J0IHsgUm93U2VsZWN0aW9uRXh0ZW5zaW9uIH0gZnJvbSAnLi4vZXh0ZW5zaW9ucy9yb3dTZWxlY3Rpb25FeHRlbnNpb24nO1xuXG5cbi8vIHVzaW5nIGV4dGVybmFsIG5vbi10eXBlZCBqcyBsaWJyYXJpZXNcbmRlY2xhcmUgdmFyIFNsaWNrOiBhbnk7XG5kZWNsYXJlIHZhciAkOiBhbnk7XG5cbmNvbnN0IHNsaWNrZ3JpZEV2ZW50UHJlZml4ID0gJ3NnJztcblxuQEluamVjdGFibGUoKVxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYW5ndWxhci1zbGlja2dyaWQnLFxuICB0ZW1wbGF0ZVVybDogJy4vYW5ndWxhci1zbGlja2dyaWQuY29tcG9uZW50Lmh0bWwnLFxuICBwcm92aWRlcnM6IFtcbiAgICAvLyBtYWtlIGV2ZXJ5dGhpbmcgdHJhbnNpZW50IChub24tc2luZ2xldG9uKVxuICAgIEF1dG9Ub29sdGlwRXh0ZW5zaW9uLFxuICAgIENlbGxFeHRlcm5hbENvcHlNYW5hZ2VyRXh0ZW5zaW9uLFxuICAgIENoZWNrYm94U2VsZWN0b3JFeHRlbnNpb24sXG4gICAgQ29sdW1uUGlja2VyRXh0ZW5zaW9uLFxuICAgIERyYWdnYWJsZUdyb3VwaW5nRXh0ZW5zaW9uLFxuICAgIEV4dGVuc2lvblNlcnZpY2UsXG4gICAgRXhwb3J0U2VydmljZSxcbiAgICBFeHRlbnNpb25VdGlsaXR5LFxuICAgIEZpbHRlckZhY3RvcnksXG4gICAgRmlsdGVyU2VydmljZSxcbiAgICBHcmFwaHFsU2VydmljZSxcbiAgICBHcmlkRXZlbnRTZXJ2aWNlLFxuICAgIEdyaWRNZW51RXh0ZW5zaW9uLFxuICAgIEdyaWRTZXJ2aWNlLFxuICAgIEdyaWRTdGF0ZVNlcnZpY2UsXG4gICAgR3JvdXBpbmdBbmRDb2xzcGFuU2VydmljZSxcbiAgICBHcm91cEl0ZW1NZXRhUHJvdmlkZXJFeHRlbnNpb24sXG4gICAgSGVhZGVyQnV0dG9uRXh0ZW5zaW9uLFxuICAgIEhlYWRlck1lbnVFeHRlbnNpb24sXG4gICAgUmVzaXplclNlcnZpY2UsXG4gICAgUm93TW92ZU1hbmFnZXJFeHRlbnNpb24sXG4gICAgUm93U2VsZWN0aW9uRXh0ZW5zaW9uLFxuICAgIFNoYXJlZFNlcnZpY2UsXG4gICAgU29ydFNlcnZpY2UsXG4gICAgU2xpY2tncmlkQ29uZmlnXG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgQW5ndWxhclNsaWNrZ3JpZENvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSwgT25Jbml0IHtcbiAgcHJpdmF0ZSBfZGF0YXNldDogYW55W107XG4gIHByaXZhdGUgX2NvbHVtbkRlZmluaXRpb25zOiBDb2x1bW5bXTtcbiAgcHJpdmF0ZSBfZGF0YVZpZXc6IGFueTtcbiAgcHJpdmF0ZSBfZXZlbnRIYW5kbGVyOiBhbnkgPSBuZXcgU2xpY2suRXZlbnRIYW5kbGVyKCk7XG4gIHByaXZhdGUgX2ZpeGVkSGVpZ2h0OiBudW1iZXIgfCBudWxsO1xuICBwcml2YXRlIF9maXhlZFdpZHRoOiBudW1iZXIgfCBudWxsO1xuICBwcml2YXRlIF9oaWRlSGVhZGVyUm93QWZ0ZXJQYWdlTG9hZCA9IGZhbHNlO1xuICBncmlkOiBhbnk7XG4gIGdyaWRQYWdpbmF0aW9uT3B0aW9uczogR3JpZE9wdGlvbjtcbiAgZ3JpZEhlaWdodFN0cmluZzogc3RyaW5nO1xuICBncmlkV2lkdGhTdHJpbmc6IHN0cmluZztcbiAgZ3JvdXBpbmdEZWZpbml0aW9uOiBhbnkgPSB7fTtcbiAgZ3JvdXBJdGVtTWV0YWRhdGFQcm92aWRlcjogYW55O1xuICBzaG93UGFnaW5hdGlvbiA9IGZhbHNlO1xuICBpc0dyaWRJbml0aWFsaXplZCA9IGZhbHNlO1xuICBzdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuXG4gIEBPdXRwdXQoKSBvbkFuZ3VsYXJHcmlkQ3JlYXRlZCA9IG5ldyBFdmVudEVtaXR0ZXI8QW5ndWxhckdyaWRJbnN0YW5jZT4oKTtcbiAgQE91dHB1dCgpIG9uRGF0YXZpZXdDcmVhdGVkID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoKSBvbkdyaWRDcmVhdGVkID0gbmV3IEV2ZW50RW1pdHRlcjxhbnk+KCk7XG4gIEBPdXRwdXQoKSBvbkdyaWRJbml0aWFsaXplZCA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgb25CZWZvcmVHcmlkQ3JlYXRlID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuICBAT3V0cHV0KCkgb25CZWZvcmVHcmlkRGVzdHJveSA9IG5ldyBFdmVudEVtaXR0ZXI8YW55PigpO1xuICBAT3V0cHV0KCkgb25BZnRlckdyaWREZXN0cm95ZWQgPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XG4gIEBPdXRwdXQoKSBvbkdyaWRTdGF0ZUNoYW5nZWQgPSBuZXcgRXZlbnRFbWl0dGVyPEdyaWRTdGF0ZUNoYW5nZT4oKTtcbiAgQElucHV0KCkgY3VzdG9tRGF0YVZpZXc6IGFueTtcbiAgQElucHV0KCkgZ3JpZElkOiBzdHJpbmc7XG4gIEBJbnB1dCgpIGdyaWRPcHRpb25zOiBHcmlkT3B0aW9uO1xuXG4gIEBJbnB1dCgpXG4gIHNldCBncmlkSGVpZ2h0KGhlaWdodDogbnVtYmVyKSB7XG4gICAgdGhpcy5fZml4ZWRIZWlnaHQgPSBoZWlnaHQ7XG4gIH1cbiAgQElucHV0KClcbiAgc2V0IGdyaWRXaWR0aCh3aWR0aDogbnVtYmVyKSB7XG4gICAgdGhpcy5fZml4ZWRXaWR0aCA9IHdpZHRoO1xuICB9XG5cbiAgQElucHV0KClcbiAgc2V0IGNvbHVtbkRlZmluaXRpb25zKGNvbHVtbkRlZmluaXRpb25zOiBDb2x1bW5bXSkge1xuICAgIHRoaXMuX2NvbHVtbkRlZmluaXRpb25zID0gY29sdW1uRGVmaW5pdGlvbnM7XG4gICAgaWYgKHRoaXMuaXNHcmlkSW5pdGlhbGl6ZWQpIHtcbiAgICAgIHRoaXMudXBkYXRlQ29sdW1uRGVmaW5pdGlvbnNMaXN0KGNvbHVtbkRlZmluaXRpb25zKTtcbiAgICB9XG4gIH1cbiAgZ2V0IGNvbHVtbkRlZmluaXRpb25zKCk6IENvbHVtbltdIHtcbiAgICByZXR1cm4gdGhpcy5fY29sdW1uRGVmaW5pdGlvbnM7XG4gIH1cbiAgQElucHV0KClcbiAgc2V0IGRhdGFzZXQoZGF0YXNldDogYW55W10pIHtcbiAgICB0aGlzLl9kYXRhc2V0ID0gZGF0YXNldDtcbiAgICB0aGlzLnJlZnJlc2hHcmlkRGF0YShkYXRhc2V0KTtcbiAgfVxuICBnZXQgZGF0YXNldCgpOiBhbnlbXSB7XG4gICAgcmV0dXJuIHRoaXMuX2RhdGFWaWV3LmdldEl0ZW1zKCk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGVsbTogRWxlbWVudFJlZixcbiAgICBwcml2YXRlIGV4cG9ydFNlcnZpY2U6IEV4cG9ydFNlcnZpY2UsXG4gICAgcHJpdmF0ZSBleHRlbnNpb25TZXJ2aWNlOiBFeHRlbnNpb25TZXJ2aWNlLFxuICAgIHByaXZhdGUgZXh0ZW5zaW9uVXRpbGl0eTogRXh0ZW5zaW9uVXRpbGl0eSxcbiAgICBwcml2YXRlIGZpbHRlclNlcnZpY2U6IEZpbHRlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBncmlkU2VydmljZTogR3JpZFNlcnZpY2UsXG4gICAgcHJpdmF0ZSBncmlkRXZlbnRTZXJ2aWNlOiBHcmlkRXZlbnRTZXJ2aWNlLFxuICAgIHByaXZhdGUgZ3JpZFN0YXRlU2VydmljZTogR3JpZFN0YXRlU2VydmljZSxcbiAgICBwcml2YXRlIGdyb3VwaW5nQW5kQ29sc3BhblNlcnZpY2U6IEdyb3VwaW5nQW5kQ29sc3BhblNlcnZpY2UsXG4gICAgcHJpdmF0ZSByZXNpemVyOiBSZXNpemVyU2VydmljZSxcbiAgICBwcml2YXRlIHNoYXJlZFNlcnZpY2U6IFNoYXJlZFNlcnZpY2UsXG4gICAgcHJpdmF0ZSBzb3J0U2VydmljZTogU29ydFNlcnZpY2UsXG4gICAgcHJpdmF0ZSB0cmFuc2xhdGU6IFRyYW5zbGF0ZVNlcnZpY2UsXG4gICAgQEluamVjdCgnY29uZmlnJykgcHJpdmF0ZSBmb3JSb290Q29uZmlnOiBHcmlkT3B0aW9uXG4gICkge31cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLm9uQmVmb3JlR3JpZENyZWF0ZS5lbWl0KHRydWUpO1xuICAgIGlmICh0aGlzLmdyaWRPcHRpb25zICYmICF0aGlzLmdyaWRPcHRpb25zLmVuYWJsZUF1dG9SZXNpemUgJiYgIXRoaXMuZ3JpZE9wdGlvbnMuYXV0b1Jlc2l6ZSkge1xuICAgICAgdGhpcy5ncmlkSGVpZ2h0U3RyaW5nID0gYCR7dGhpcy5fZml4ZWRIZWlnaHR9cHhgO1xuICAgICAgdGhpcy5ncmlkV2lkdGhTdHJpbmcgPSBgJHt0aGlzLl9maXhlZFdpZHRofXB4YDtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLm9uQmVmb3JlR3JpZERlc3Ryb3kuZW1pdCh0aGlzLmdyaWQpO1xuICAgIHRoaXMuZGVzdHJveSgpO1xuICAgIHRoaXMub25BZnRlckdyaWREZXN0cm95ZWQuZW1pdCh0cnVlKTtcbiAgfVxuXG4gIGRlc3Ryb3koZW1wdHlEb21FbGVtZW50Q29udGFpbmVyID0gZmFsc2UpIHtcbiAgICB0aGlzLl9kYXRhVmlldyA9IFtdO1xuICAgIHRoaXMuZ3JpZE9wdGlvbnMgPSB7fTtcbiAgICB0aGlzLl9ldmVudEhhbmRsZXIudW5zdWJzY3JpYmVBbGwoKTtcbiAgICB0aGlzLmV4dGVuc2lvblNlcnZpY2UuZGlzcG9zZSgpO1xuICAgIHRoaXMuZmlsdGVyU2VydmljZS5kaXNwb3NlKCk7XG4gICAgdGhpcy5ncmlkRXZlbnRTZXJ2aWNlLmRpc3Bvc2UoKTtcbiAgICB0aGlzLmdyaWRTdGF0ZVNlcnZpY2UuZGlzcG9zZSgpO1xuICAgIHRoaXMuZ3JvdXBpbmdBbmRDb2xzcGFuU2VydmljZS5kaXNwb3NlKCk7XG4gICAgdGhpcy5yZXNpemVyLmRpc3Bvc2UoKTtcbiAgICB0aGlzLnNvcnRTZXJ2aWNlLmRpc3Bvc2UoKTtcbiAgICB0aGlzLmdyaWQuZGVzdHJveSgpO1xuXG4gICAgaWYgKGVtcHR5RG9tRWxlbWVudENvbnRhaW5lcikge1xuICAgICAgJCh0aGlzLmdyaWRPcHRpb25zLmdyaWRDb250YWluZXJJZCkuZW1wdHkoKTtcbiAgICB9XG5cbiAgICAvLyBhbHNvIHVuc3Vic2NyaWJlIGFsbCBSeEpTIHN1YnNjcmlwdGlvbnNcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSB1bnN1YnNjcmliZUFsbE9ic2VydmFibGVzKHRoaXMuc3Vic2NyaXB0aW9ucyk7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgdGhpcy5pbml0aWFsaXphdGlvbigpO1xuICAgIHRoaXMuaXNHcmlkSW5pdGlhbGl6ZWQgPSB0cnVlO1xuICB9XG5cbiAgaW5pdGlhbGl6YXRpb24oKSB7XG4gICAgLy8gbWFrZSBzdXJlIHRoZSBkYXRhc2V0IGlzIGluaXRpYWxpemVkIChpZiBub3QgaXQgd2lsbCB0aHJvdyBhbiBlcnJvciB0aGF0IGl0IGNhbm5vdCBnZXRMZW5ndGggb2YgbnVsbClcbiAgICB0aGlzLl9kYXRhc2V0ID0gdGhpcy5fZGF0YXNldCB8fCBbXTtcbiAgICB0aGlzLmdyaWRPcHRpb25zID0gdGhpcy5tZXJnZUdyaWRPcHRpb25zKHRoaXMuZ3JpZE9wdGlvbnMpO1xuICAgIHRoaXMuY3JlYXRlQmFja2VuZEFwaUludGVybmFsUG9zdFByb2Nlc3NDYWxsYmFjayh0aGlzLmdyaWRPcHRpb25zKTtcblxuICAgIGlmICghdGhpcy5jdXN0b21EYXRhVmlldykge1xuICAgICAgaWYgKHRoaXMuZ3JpZE9wdGlvbnMuZHJhZ2dhYmxlR3JvdXBpbmcgfHwgdGhpcy5ncmlkT3B0aW9ucy5lbmFibGVHcm91cGluZykge1xuICAgICAgICB0aGlzLmV4dGVuc2lvblV0aWxpdHkubG9hZEV4dGVuc2lvbkR5bmFtaWNhbGx5KEV4dGVuc2lvbk5hbWUuZ3JvdXBJdGVtTWV0YVByb3ZpZGVyKTtcbiAgICAgICAgdGhpcy5ncm91cEl0ZW1NZXRhZGF0YVByb3ZpZGVyID0gbmV3IFNsaWNrLkRhdGEuR3JvdXBJdGVtTWV0YWRhdGFQcm92aWRlcigpO1xuICAgICAgICB0aGlzLnNoYXJlZFNlcnZpY2UuZ3JvdXBJdGVtTWV0YWRhdGFQcm92aWRlciA9IHRoaXMuZ3JvdXBJdGVtTWV0YWRhdGFQcm92aWRlcjtcbiAgICAgICAgdGhpcy5fZGF0YVZpZXcgPSBuZXcgU2xpY2suRGF0YS5EYXRhVmlldyh7IGdyb3VwSXRlbU1ldGFkYXRhUHJvdmlkZXI6IHRoaXMuZ3JvdXBJdGVtTWV0YWRhdGFQcm92aWRlciB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2RhdGFWaWV3ID0gbmV3IFNsaWNrLkRhdGEuRGF0YVZpZXcoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBmb3IgY29udmVuaWVuY2UsIHdlIHByb3ZpZGUgdGhlIHByb3BlcnR5IFwiZWRpdG9yXCIgYXMgYW4gQW5ndWxhci1TbGlja2dyaWQgZWRpdG9yIGNvbXBsZXggb2JqZWN0XG4gICAgLy8gaG93ZXZlciBcImVkaXRvclwiIGlzIHVzZWQgaW50ZXJuYWxseSBieSBTbGlja0dyaWQgZm9yIGl0J3Mgb3duIEVkaXRvciBGYWN0b3J5XG4gICAgLy8gc28gaW4gb3VyIGxpYiB3ZSB3aWxsIHN3YXAgXCJlZGl0b3JcIiBhbmQgY29weSBpdCBpbnRvIGEgbmV3IHByb3BlcnR5IGNhbGxlZCBcImludGVybmFsQ29sdW1uRWRpdG9yXCJcbiAgICAvLyB0aGVuIHRha2UgYmFjayBcImVkaXRvci5tb2RlbFwiIGFuZCBtYWtlIGl0IHRoZSBuZXcgXCJlZGl0b3JcIiBzbyB0aGF0IFNsaWNrR3JpZCBFZGl0b3IgRmFjdG9yeSBzdGlsbCB3b3Jrc1xuICAgIHRoaXMuX2NvbHVtbkRlZmluaXRpb25zID0gdGhpcy5fY29sdW1uRGVmaW5pdGlvbnMubWFwKChjb2x1bW46IENvbHVtbiB8IGFueSkgPT4ge1xuICAgICAgLy8gb24gZXZlcnkgRWRpdG9yIHRoYXQgaGF2ZSBhIFwiY29sbGVjdGlvbkFzeW5jXCIsIHJlc29sdmUgdGhlIGRhdGEgYW5kIGFzc2lnbiBpdCB0byB0aGUgXCJjb2xsZWN0aW9uXCIgcHJvcGVydHlcbiAgICAgIGlmIChjb2x1bW4uZWRpdG9yICYmIGNvbHVtbi5lZGl0b3IuY29sbGVjdGlvbkFzeW5jKSB7XG4gICAgICAgIHRoaXMubG9hZEVkaXRvckNvbGxlY3Rpb25Bc3luYyhjb2x1bW4pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHsgLi4uY29sdW1uLCBlZGl0b3I6IGNvbHVtbi5lZGl0b3IgJiYgY29sdW1uLmVkaXRvci5tb2RlbCwgaW50ZXJuYWxDb2x1bW5FZGl0b3I6IHsgLi4uY29sdW1uLmVkaXRvciAgfX07XG4gICAgfSk7XG5cbiAgICAvLyBzYXZlIHJlZmVyZW5jZSBmb3IgYWxsIGNvbHVtbnMgYmVmb3JlIHRoZXkgb3B0aW9uYWxseSBiZWNvbWUgaGlkZGVuL3Zpc2libGVcbiAgICB0aGlzLnNoYXJlZFNlcnZpY2UuYWxsQ29sdW1ucyA9IHRoaXMuX2NvbHVtbkRlZmluaXRpb25zO1xuICAgIHRoaXMuc2hhcmVkU2VydmljZS52aXNpYmxlQ29sdW1ucyA9IHRoaXMuX2NvbHVtbkRlZmluaXRpb25zO1xuICAgIHRoaXMuZXh0ZW5zaW9uU2VydmljZS5jcmVhdGVFeHRlbnNpb25zQmVmb3JlR3JpZENyZWF0aW9uKHRoaXMuX2NvbHVtbkRlZmluaXRpb25zLCB0aGlzLmdyaWRPcHRpb25zKTtcblxuICAgIC8vIGJ1aWxkIFNsaWNrR3JpZCBHcmlkLCBhbHNvIHVzZXIgbWlnaHQgb3B0aW9uYWxseSBwYXNzIGEgY3VzdG9tIGRhdGF2aWV3IChlLmcuIHJlbW90ZSBtb2RlbClcbiAgICB0aGlzLmdyaWQgPSBuZXcgU2xpY2suR3JpZChgIyR7dGhpcy5ncmlkSWR9YCwgdGhpcy5jdXN0b21EYXRhVmlldyB8fCB0aGlzLl9kYXRhVmlldywgdGhpcy5fY29sdW1uRGVmaW5pdGlvbnMsIHRoaXMuZ3JpZE9wdGlvbnMpO1xuXG4gICAgdGhpcy5zaGFyZWRTZXJ2aWNlLmRhdGFWaWV3ID0gdGhpcy5fZGF0YVZpZXc7XG4gICAgdGhpcy5zaGFyZWRTZXJ2aWNlLmdyaWQgPSB0aGlzLmdyaWQ7XG5cbiAgICB0aGlzLmV4dGVuc2lvblNlcnZpY2UuYXR0YWNoRGlmZmVyZW50RXh0ZW5zaW9ucygpO1xuICAgIHRoaXMuYXR0YWNoRGlmZmVyZW50SG9va3ModGhpcy5ncmlkLCB0aGlzLmdyaWRPcHRpb25zLCB0aGlzLl9kYXRhVmlldyk7XG5cbiAgICAvLyBlbWl0IHRoZSBHcmlkICYgRGF0YVZpZXcgb2JqZWN0IHRvIG1ha2UgdGhlbSBhdmFpbGFibGUgaW4gcGFyZW50IGNvbXBvbmVudFxuICAgIHRoaXMub25HcmlkQ3JlYXRlZC5lbWl0KHRoaXMuZ3JpZCk7XG5cbiAgICAvLyBpbml0aWFsaXplIHRoZSBTbGlja0dyaWQgZ3JpZFxuICAgIHRoaXMuZ3JpZC5pbml0KCk7XG5cbiAgICBpZiAoIXRoaXMuY3VzdG9tRGF0YVZpZXcgJiYgKHRoaXMuX2RhdGFWaWV3ICYmIHRoaXMuX2RhdGFWaWV3LmJlZ2luVXBkYXRlICYmIHRoaXMuX2RhdGFWaWV3LnNldEl0ZW1zICYmIHRoaXMuX2RhdGFWaWV3LmVuZFVwZGF0ZSkpIHtcbiAgICAgIHRoaXMub25EYXRhdmlld0NyZWF0ZWQuZW1pdCh0aGlzLl9kYXRhVmlldyk7XG4gICAgICB0aGlzLl9kYXRhVmlldy5iZWdpblVwZGF0ZSgpO1xuICAgICAgdGhpcy5fZGF0YVZpZXcuc2V0SXRlbXModGhpcy5fZGF0YXNldCwgdGhpcy5ncmlkT3B0aW9ucy5kYXRhc2V0SWRQcm9wZXJ0eU5hbWUpO1xuICAgICAgdGhpcy5fZGF0YVZpZXcuZW5kVXBkYXRlKCk7XG4gICAgfVxuXG4gICAgLy8gdXNlciBtaWdodCB3YW50IHRvIGhpZGUgdGhlIGhlYWRlciByb3cgb24gcGFnZSBsb2FkIGJ1dCBzdGlsbCBoYXZlIGBlbmFibGVGaWx0ZXJpbmc6IHRydWVgXG4gICAgLy8gaWYgdGhhdCBpcyB0aGUgY2FzZSwgd2UgbmVlZCB0byBoaWRlIHRoZSBoZWFkZXJSb3cgT05MWSBBRlRFUiBhbGwgZmlsdGVycyBnb3QgY3JlYXRlZCAmIGRhdGFWaWV3IGV4aXN0XG4gICAgaWYgKHRoaXMuX2hpZGVIZWFkZXJSb3dBZnRlclBhZ2VMb2FkKSB7XG4gICAgICB0aGlzLnNob3dIZWFkZXJSb3coZmFsc2UpO1xuICAgIH1cblxuICAgIC8vIGFmdGVyIHRoZSBEYXRhVmlldyBpcyBjcmVhdGVkICYgdXBkYXRlZCBleGVjdXRlIHNvbWUgcHJvY2Vzc2VzXG4gICAgdGhpcy5leGVjdXRlQWZ0ZXJEYXRhdmlld0NyZWF0ZWQodGhpcy5ncmlkLCB0aGlzLmdyaWRPcHRpb25zLCB0aGlzLl9kYXRhVmlldyk7XG5cbiAgICAvLyBhdHRhY2ggcmVzaXplIE9OTFkgYWZ0ZXIgdGhlIGRhdGFWaWV3IGlzIHJlYWR5XG4gICAgdGhpcy5hdHRhY2hSZXNpemVIb29rKHRoaXMuZ3JpZCwgdGhpcy5ncmlkT3B0aW9ucyk7XG5cbiAgICAvLyBhdHRhY2ggZ3JvdXBpbmcgYW5kIGhlYWRlciBncm91cGluZyBjb2xzcGFuIHNlcnZpY2VcbiAgICBpZiAodGhpcy5ncmlkT3B0aW9ucy5jcmVhdGVQcmVIZWFkZXJQYW5lbCAmJiAhdGhpcy5ncmlkT3B0aW9ucy5lbmFibGVEcmFnZ2FibGVHcm91cGluZykge1xuICAgICAgdGhpcy5ncm91cGluZ0FuZENvbHNwYW5TZXJ2aWNlLmluaXQodGhpcy5ncmlkLCB0aGlzLl9kYXRhVmlldyk7XG4gICAgfVxuXG4gICAgLy8gYXR0YWNoIGdyaWQgIHNlcnZpY2VcbiAgICB0aGlzLmdyaWRTZXJ2aWNlLmluaXQodGhpcy5ncmlkLCB0aGlzLl9kYXRhVmlldyk7XG5cbiAgICAvLyB3aGVuIHVzZXIgZW5hYmxlcyB0cmFuc2xhdGlvbiwgd2UgbmVlZCB0byB0cmFuc2xhdGUgSGVhZGVycyBvbiBmaXJzdCBwYXNzICYgc3Vic2VxdWVudGx5IGluIHRoZSBhdHRhY2hEaWZmZXJlbnRIb29rc1xuICAgIGlmICh0aGlzLmdyaWRPcHRpb25zLmVuYWJsZVRyYW5zbGF0ZSkge1xuICAgICAgdGhpcy5leHRlbnNpb25TZXJ2aWNlLnRyYW5zbGF0ZUNvbHVtbkhlYWRlcnMoKTtcbiAgICB9XG5cbiAgICAvLyBpZiBFeHBvcnQgaXMgZW5hYmxlZCwgaW5pdGlhbGl6ZSB0aGUgc2VydmljZSB3aXRoIHRoZSBuZWNlc3NhcnkgZ3JpZCBhbmQgb3RoZXIgb2JqZWN0c1xuICAgIGlmICh0aGlzLmdyaWRPcHRpb25zLmVuYWJsZUV4cG9ydCkge1xuICAgICAgdGhpcy5leHBvcnRTZXJ2aWNlLmluaXQodGhpcy5ncmlkLCB0aGlzLl9kYXRhVmlldyk7XG4gICAgfVxuXG4gICAgLy8gb25jZSBhbGwgaG9va3MgYXJlIGluIHBsYWNlZCBhbmQgdGhlIGdyaWQgaXMgaW5pdGlhbGl6ZWQsIHdlIGNhbiBlbWl0IGFuIGV2ZW50XG4gICAgdGhpcy5vbkdyaWRJbml0aWFsaXplZC5lbWl0KHRoaXMuZ3JpZCk7XG5cbiAgICAvLyBhdHRhY2ggdGhlIEJhY2tlbmQgU2VydmljZSBBUEkgY2FsbGJhY2sgZnVuY3Rpb25zIG9ubHkgYWZ0ZXIgdGhlIGdyaWQgaXMgaW5pdGlhbGl6ZWRcbiAgICAvLyBiZWNhdXNlIHRoZSBwcmVQcm9jZXNzKCkgYW5kIG9uSW5pdCgpIG1pZ2h0IGdldCB0cmlnZ2VyZWRcbiAgICBpZiAodGhpcy5ncmlkT3B0aW9ucyAmJiB0aGlzLmdyaWRPcHRpb25zLmJhY2tlbmRTZXJ2aWNlQXBpKSB7XG4gICAgICB0aGlzLmF0dGFjaEJhY2tlbmRDYWxsYmFja0Z1bmN0aW9ucyh0aGlzLmdyaWRPcHRpb25zKTtcbiAgICB9XG5cbiAgICB0aGlzLmdyaWRTdGF0ZVNlcnZpY2UuaW5pdCh0aGlzLmdyaWQsIHRoaXMuZXh0ZW5zaW9uU2VydmljZSwgdGhpcy5maWx0ZXJTZXJ2aWNlLCB0aGlzLnNvcnRTZXJ2aWNlKTtcblxuICAgIHRoaXMub25Bbmd1bGFyR3JpZENyZWF0ZWQuZW1pdCh7XG4gICAgICAvLyBTbGljayBHcmlkICYgRGF0YVZpZXcgb2JqZWN0c1xuICAgICAgZGF0YVZpZXc6IHRoaXMuX2RhdGFWaWV3LFxuICAgICAgc2xpY2tHcmlkOiB0aGlzLmdyaWQsXG5cbiAgICAgIC8vIHB1YmxpYyBtZXRob2RzXG4gICAgICBkZXN0cm95OiB0aGlzLmRlc3Ryb3kuYmluZCh0aGlzKSxcblxuICAgICAgLy8gcmV0dXJuIGFsbCBhdmFpbGFibGUgU2VydmljZXMgKG5vbi1zaW5nbGV0b24pXG4gICAgICBiYWNrZW5kU2VydmljZTogdGhpcy5ncmlkT3B0aW9ucyAmJiB0aGlzLmdyaWRPcHRpb25zLmJhY2tlbmRTZXJ2aWNlQXBpICYmIHRoaXMuZ3JpZE9wdGlvbnMuYmFja2VuZFNlcnZpY2VBcGkuc2VydmljZSxcbiAgICAgIGV4cG9ydFNlcnZpY2U6IHRoaXMuZXhwb3J0U2VydmljZSxcbiAgICAgIGZpbHRlclNlcnZpY2U6IHRoaXMuZmlsdGVyU2VydmljZSxcbiAgICAgIGdyaWRFdmVudFNlcnZpY2U6IHRoaXMuZ3JpZEV2ZW50U2VydmljZSxcbiAgICAgIGdyaWRTdGF0ZVNlcnZpY2U6IHRoaXMuZ3JpZFN0YXRlU2VydmljZSxcbiAgICAgIGdyaWRTZXJ2aWNlOiB0aGlzLmdyaWRTZXJ2aWNlLFxuICAgICAgZ3JvdXBpbmdTZXJ2aWNlOiB0aGlzLmdyb3VwaW5nQW5kQ29sc3BhblNlcnZpY2UsXG4gICAgICBleHRlbnNpb25TZXJ2aWNlOiB0aGlzLmV4dGVuc2lvblNlcnZpY2UsXG5cbiAgICAgIC8qKiBAZGVwcmVjYXRlZCBwbGVhc2UgdXNlIFwiZXh0ZW5zaW9uU2VydmljZVwiIGluc3RlYWQgKi9cbiAgICAgIHBsdWdpblNlcnZpY2U6IHRoaXMuZXh0ZW5zaW9uU2VydmljZSxcbiAgICAgIHJlc2l6ZXJTZXJ2aWNlOiB0aGlzLnJlc2l6ZXIsXG4gICAgICBzb3J0U2VydmljZTogdGhpcy5zb3J0U2VydmljZSxcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb21taXRzIHRoZSBjdXJyZW50IGVkaXQgdG8gdGhlIGdyaWRcbiAgICovXG4gIGNvbW1pdEVkaXQodGFyZ2V0OiBFbGVtZW50KSB7XG4gICAgaWYgKHRoaXMuZ3JpZC5nZXRPcHRpb25zKCkuYXV0b0NvbW1pdEVkaXQpIHtcbiAgICAgIGNvbnN0IGFjdGl2ZU5vZGUgPSB0aGlzLmdyaWQuZ2V0QWN0aXZlQ2VsbE5vZGUoKTtcblxuICAgICAgLy8gYSB0aW1lb3V0IG11c3QgYmUgc2V0IG9yIHRoaXMgY291bGQgY29tZSBpbnRvIGNvbmZsaWN0IHdoZW4gc2xpY2tncmlkXG4gICAgICAvLyB0cmllcyB0byBjb21taXQgdGhlIGVkaXQgd2hlbiBnb2luZyBmcm9tIG9uZSBlZGl0b3IgdG8gYW5vdGhlciBvbiB0aGUgZ3JpZFxuICAgICAgLy8gdGhyb3VnaCB0aGUgY2xpY2sgZXZlbnQuIElmIHRoZSB0aW1lb3V0IHdhcyBub3QgaGVyZSBpdCB3b3VsZFxuICAgICAgLy8gdHJ5IHRvIGNvbW1pdC9kZXN0cm95IHRoZSB0d2ljZSwgd2hpY2ggd291bGQgdGhyb3cgYSBqcXVlcnlcbiAgICAgIC8vIGVycm9yIGFib3V0IHRoZSBlbGVtZW50IG5vdCBiZWluZyBpbiB0aGUgRE9NXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgLy8gbWFrZSBzdXJlIHRoZSB0YXJnZXQgaXMgdGhlIGFjdGl2ZSBlZGl0b3Igc28gd2UgZG8gbm90XG4gICAgICAgIC8vIGNvbW1pdCBwcmVtYXR1cmVseVxuICAgICAgICBpZiAoYWN0aXZlTm9kZSAmJiBhY3RpdmVOb2RlLmNvbnRhaW5zKHRhcmdldCkgJiYgdGhpcy5ncmlkLmdldEVkaXRvckxvY2soKS5pc0FjdGl2ZSgpKSB7XG4gICAgICAgICAgdGhpcy5ncmlkLmdldEVkaXRvckxvY2soKS5jb21taXRDdXJyZW50RWRpdCgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRGVmaW5lIHdoYXQgb3VyIGludGVybmFsIFBvc3QgUHJvY2VzcyBjYWxsYmFjaywgaXQgd2lsbCBleGVjdXRlIGludGVybmFsbHkgYWZ0ZXIgd2UgZ2V0IGJhY2sgcmVzdWx0IGZyb20gdGhlIFByb2Nlc3MgYmFja2VuZCBjYWxsXG4gICAqIEZvciBub3csIHRoaXMgaXMgR3JhcGhRTCBTZXJ2aWNlIG9ubHkgZmVhdHVyZSBhbmQgaXQgd2lsbCBiYXNpY2FsbHkgcmVmcmVzaCB0aGUgRGF0YXNldCAmIFBhZ2luYXRpb24gd2l0aG91dCBoYXZpbmcgdGhlIHVzZXIgdG8gY3JlYXRlIGhpcyBvd24gUG9zdFByb2Nlc3MgZXZlcnkgdGltZVxuICAgKi9cbiAgY3JlYXRlQmFja2VuZEFwaUludGVybmFsUG9zdFByb2Nlc3NDYWxsYmFjayhncmlkT3B0aW9uczogR3JpZE9wdGlvbikge1xuICAgIGlmIChncmlkT3B0aW9ucyAmJiBncmlkT3B0aW9ucy5iYWNrZW5kU2VydmljZUFwaSkge1xuICAgICAgY29uc3QgYmFja2VuZEFwaSA9IGdyaWRPcHRpb25zLmJhY2tlbmRTZXJ2aWNlQXBpO1xuXG4gICAgICAvLyBpbnRlcm5hbFBvc3RQcm9jZXNzIG9ubHkgd29ya3Mgd2l0aCBhIEdyYXBoUUwgU2VydmljZSwgc28gbWFrZSBzdXJlIGl0IGlzIHRoYXQgdHlwZVxuICAgICAgaWYgKGJhY2tlbmRBcGkgJiYgYmFja2VuZEFwaS5zZXJ2aWNlICYmIGJhY2tlbmRBcGkuc2VydmljZSBpbnN0YW5jZW9mIEdyYXBocWxTZXJ2aWNlKSB7XG4gICAgICAgIGJhY2tlbmRBcGkuaW50ZXJuYWxQb3N0UHJvY2VzcyA9IChwcm9jZXNzUmVzdWx0OiBhbnkpID0+IHtcbiAgICAgICAgICBjb25zdCBkYXRhc2V0TmFtZSA9IChiYWNrZW5kQXBpICYmIGJhY2tlbmRBcGkuc2VydmljZSAmJiB0eXBlb2YgYmFja2VuZEFwaS5zZXJ2aWNlLmdldERhdGFzZXROYW1lID09PSAnZnVuY3Rpb24nKSA/IGJhY2tlbmRBcGkuc2VydmljZS5nZXREYXRhc2V0TmFtZSgpIDogJyc7XG4gICAgICAgICAgaWYgKHByb2Nlc3NSZXN1bHQgJiYgcHJvY2Vzc1Jlc3VsdC5kYXRhICYmIHByb2Nlc3NSZXN1bHQuZGF0YVtkYXRhc2V0TmFtZV0pIHtcbiAgICAgICAgICAgIHRoaXMuX2RhdGFzZXQgPSBwcm9jZXNzUmVzdWx0LmRhdGFbZGF0YXNldE5hbWVdLm5vZGVzO1xuICAgICAgICAgICAgdGhpcy5yZWZyZXNoR3JpZERhdGEodGhpcy5fZGF0YXNldCwgcHJvY2Vzc1Jlc3VsdC5kYXRhW2RhdGFzZXROYW1lXS50b3RhbENvdW50KTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fZGF0YXNldCA9IFtdO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBhdHRhY2hEaWZmZXJlbnRIb29rcyhncmlkOiBhbnksIGdyaWRPcHRpb25zOiBHcmlkT3B0aW9uLCBkYXRhVmlldzogYW55KSB7XG4gICAgLy8gb24gbG9jYWxlIGNoYW5nZSwgd2UgaGF2ZSB0byBtYW51YWxseSB0cmFuc2xhdGUgdGhlIEhlYWRlcnMsIEdyaWRNZW51XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICB0aGlzLnRyYW5zbGF0ZS5vbkxhbmdDaGFuZ2Uuc3Vic2NyaWJlKChldmVudCkgPT4ge1xuICAgICAgICBpZiAoZ3JpZE9wdGlvbnMuZW5hYmxlVHJhbnNsYXRlKSB7XG4gICAgICAgICAgdGhpcy5leHRlbnNpb25TZXJ2aWNlLnRyYW5zbGF0ZUNvbHVtbkhlYWRlcnMoKTtcbiAgICAgICAgICB0aGlzLmV4dGVuc2lvblNlcnZpY2UudHJhbnNsYXRlQ29sdW1uUGlja2VyKCk7XG4gICAgICAgICAgdGhpcy5leHRlbnNpb25TZXJ2aWNlLnRyYW5zbGF0ZUdyaWRNZW51KCk7XG4gICAgICAgICAgdGhpcy5leHRlbnNpb25TZXJ2aWNlLnRyYW5zbGF0ZUhlYWRlck1lbnUoKTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICApO1xuXG4gICAgLy8gaWYgdXNlciBlbnRlcmVkIHNvbWUgQ29sdW1ucyBcInByZXNldHNcIiwgd2UgbmVlZCB0byByZWZsZWN0IHRoZW0gYWxsIGluIHRoZSBncmlkXG4gICAgaWYgKGdyaWRPcHRpb25zLnByZXNldHMgJiYgQXJyYXkuaXNBcnJheShncmlkT3B0aW9ucy5wcmVzZXRzLmNvbHVtbnMpICYmIGdyaWRPcHRpb25zLnByZXNldHMuY29sdW1ucy5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBncmlkQ29sdW1uczogQ29sdW1uW10gPSB0aGlzLmdyaWRTdGF0ZVNlcnZpY2UuZ2V0QXNzb2NpYXRlZEdyaWRDb2x1bW5zKGdyaWQsIGdyaWRPcHRpb25zLnByZXNldHMuY29sdW1ucyk7XG4gICAgICBpZiAoZ3JpZENvbHVtbnMgJiYgQXJyYXkuaXNBcnJheShncmlkQ29sdW1ucykgJiYgZ3JpZENvbHVtbnMubGVuZ3RoID4gMCkge1xuICAgICAgICAvLyBtYWtlIHN1cmUgdGhhdCB0aGUgY2hlY2tib3ggc2VsZWN0b3IgaXMgYWxzbyB2aXNpYmxlIGlmIGl0IGlzIGVuYWJsZWRcbiAgICAgICAgaWYgKGdyaWRPcHRpb25zLmVuYWJsZUNoZWNrYm94U2VsZWN0b3IpIHtcbiAgICAgICAgICBjb25zdCBjaGVja2JveENvbHVtbiA9IChBcnJheS5pc0FycmF5KHRoaXMuX2NvbHVtbkRlZmluaXRpb25zKSAmJiB0aGlzLl9jb2x1bW5EZWZpbml0aW9ucy5sZW5ndGggPiAwKSA/IHRoaXMuX2NvbHVtbkRlZmluaXRpb25zWzBdIDogbnVsbDtcbiAgICAgICAgICBpZiAoY2hlY2tib3hDb2x1bW4gJiYgY2hlY2tib3hDb2x1bW4uaWQgPT09ICdfY2hlY2tib3hfc2VsZWN0b3InICYmIGdyaWRDb2x1bW5zWzBdLmlkICE9PSAnX2NoZWNrYm94X3NlbGVjdG9yJykge1xuICAgICAgICAgICAgZ3JpZENvbHVtbnMudW5zaGlmdChjaGVja2JveENvbHVtbik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gZmluYWxseSBzZXQgdGhlIG5ldyBwcmVzZXRzIGNvbHVtbnMgKGluY2x1ZGluZyBjaGVja2JveCBzZWxlY3RvciBpZiBuZWVkIGJlKVxuICAgICAgICBncmlkLnNldENvbHVtbnMoZ3JpZENvbHVtbnMpO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vIGF0dGFjaCBleHRlcm5hbCBzb3J0aW5nIChiYWNrZW5kKSB3aGVuIGF2YWlsYWJsZSBvciBkZWZhdWx0IG9uU29ydCAoZGF0YVZpZXcpXG4gICAgaWYgKGdyaWRPcHRpb25zLmVuYWJsZVNvcnRpbmcgJiYgIXRoaXMuY3VzdG9tRGF0YVZpZXcpIHtcbiAgICAgIGdyaWRPcHRpb25zLmJhY2tlbmRTZXJ2aWNlQXBpID8gdGhpcy5zb3J0U2VydmljZS5hdHRhY2hCYWNrZW5kT25Tb3J0KGdyaWQsIGRhdGFWaWV3KSA6IHRoaXMuc29ydFNlcnZpY2UuYXR0YWNoTG9jYWxPblNvcnQoZ3JpZCwgZGF0YVZpZXcpO1xuICAgIH1cblxuICAgIC8vIGF0dGFjaCBleHRlcm5hbCBmaWx0ZXIgKGJhY2tlbmQpIHdoZW4gYXZhaWxhYmxlIG9yIGRlZmF1bHQgb25GaWx0ZXIgKGRhdGFWaWV3KVxuICAgIGlmIChncmlkT3B0aW9ucy5lbmFibGVGaWx0ZXJpbmcgJiYgIXRoaXMuY3VzdG9tRGF0YVZpZXcpIHtcbiAgICAgIHRoaXMuZmlsdGVyU2VydmljZS5pbml0KGdyaWQpO1xuXG4gICAgICAvLyBpZiB1c2VyIGVudGVyZWQgc29tZSBcInByZXNldHNcIiwgd2UgbmVlZCB0byByZWZsZWN0IHRoZW0gYWxsIGluIHRoZSBET01cbiAgICAgIGlmIChncmlkT3B0aW9ucy5wcmVzZXRzICYmIEFycmF5LmlzQXJyYXkoZ3JpZE9wdGlvbnMucHJlc2V0cy5maWx0ZXJzKSAmJiBncmlkT3B0aW9ucy5wcmVzZXRzLmZpbHRlcnMubGVuZ3RoID4gMCkge1xuICAgICAgICB0aGlzLmZpbHRlclNlcnZpY2UucG9wdWxhdGVDb2x1bW5GaWx0ZXJTZWFyY2hUZXJtcygpO1xuICAgICAgfVxuICAgICAgZ3JpZE9wdGlvbnMuYmFja2VuZFNlcnZpY2VBcGkgPyB0aGlzLmZpbHRlclNlcnZpY2UuYXR0YWNoQmFja2VuZE9uRmlsdGVyKGdyaWQpIDogdGhpcy5maWx0ZXJTZXJ2aWNlLmF0dGFjaExvY2FsT25GaWx0ZXIoZ3JpZCwgdGhpcy5fZGF0YVZpZXcpO1xuICAgIH1cblxuICAgIC8vIGlmIHVzZXIgc2V0IGFuIG9uSW5pdCBCYWNrZW5kLCB3ZSdsbCBydW4gaXQgcmlnaHQgYXdheSAoYW5kIGlmIHNvLCB3ZSBhbHNvIG5lZWQgdG8gcnVuIHByZVByb2Nlc3MsIGludGVybmFsUG9zdFByb2Nlc3MgJiBwb3N0UHJvY2VzcylcbiAgICBpZiAoZ3JpZE9wdGlvbnMuYmFja2VuZFNlcnZpY2VBcGkpIHtcbiAgICAgIGNvbnN0IGJhY2tlbmRBcGkgPSBncmlkT3B0aW9ucy5iYWNrZW5kU2VydmljZUFwaTtcblxuICAgICAgaWYgKGJhY2tlbmRBcGkgJiYgYmFja2VuZEFwaS5zZXJ2aWNlICYmIGJhY2tlbmRBcGkuc2VydmljZS5pbml0KSB7XG4gICAgICAgIGJhY2tlbmRBcGkuc2VydmljZS5pbml0KGJhY2tlbmRBcGkub3B0aW9ucywgZ3JpZE9wdGlvbnMucGFnaW5hdGlvbiwgdGhpcy5ncmlkKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBleHBvc2UgYWxsIFNsaWNrIEdyaWQgRXZlbnRzIHRocm91Z2ggZGlzcGF0Y2hcbiAgICBmb3IgKGNvbnN0IHByb3AgaW4gZ3JpZCkge1xuICAgICAgaWYgKGdyaWQuaGFzT3duUHJvcGVydHkocHJvcCkgJiYgcHJvcC5zdGFydHNXaXRoKCdvbicpKSB7XG4gICAgICAgIHRoaXMuX2V2ZW50SGFuZGxlci5zdWJzY3JpYmUoZ3JpZFtwcm9wXSwgKGU6IGFueSwgYXJnczogYW55KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2hDdXN0b21FdmVudChgJHtzbGlja2dyaWRFdmVudFByZWZpeH0ke3RpdGxlQ2FzZShwcm9wKX1gLCB7IGV2ZW50RGF0YTogZSwgYXJncyB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gZXhwb3NlIGFsbCBTbGljayBEYXRhVmlldyBFdmVudHMgdGhyb3VnaCBkaXNwYXRjaFxuICAgIGZvciAoY29uc3QgcHJvcCBpbiBkYXRhVmlldykge1xuICAgICAgaWYgKGRhdGFWaWV3Lmhhc093blByb3BlcnR5KHByb3ApICYmIHByb3Auc3RhcnRzV2l0aCgnb24nKSkge1xuICAgICAgICB0aGlzLl9ldmVudEhhbmRsZXIuc3Vic2NyaWJlKGRhdGFWaWV3W3Byb3BdLCAoZTogYW55LCBhcmdzOiBhbnkpID0+IHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5kaXNwYXRjaEN1c3RvbUV2ZW50KGAke3NsaWNrZ3JpZEV2ZW50UHJlZml4fSR7dGl0bGVDYXNlKHByb3ApfWAsIHsgZXZlbnREYXRhOiBlLCBhcmdzIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBleHBvc2UgR3JpZFN0YXRlIFNlcnZpY2UgY2hhbmdlcyBldmVudCB0aHJvdWdoIGRpc3BhdGNoXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICB0aGlzLmdyaWRTdGF0ZVNlcnZpY2Uub25HcmlkU3RhdGVDaGFuZ2VkLnN1YnNjcmliZSgoZ3JpZFN0YXRlQ2hhbmdlOiBHcmlkU3RhdGVDaGFuZ2UpID0+IHtcbiAgICAgICAgdGhpcy5vbkdyaWRTdGF0ZUNoYW5nZWQuZW1pdChncmlkU3RhdGVDaGFuZ2UpO1xuICAgICAgfSlcbiAgICApO1xuXG5cbiAgICAvLyBvbiBjZWxsIGNsaWNrLCBtYWlubHkgdXNlZCB3aXRoIHRoZSBjb2x1bW5EZWYuYWN0aW9uIGNhbGxiYWNrXG4gICAgdGhpcy5ncmlkRXZlbnRTZXJ2aWNlLmF0dGFjaE9uQ2VsbENoYW5nZShncmlkLCBkYXRhVmlldyk7XG4gICAgdGhpcy5ncmlkRXZlbnRTZXJ2aWNlLmF0dGFjaE9uQ2xpY2soZ3JpZCwgZGF0YVZpZXcpO1xuXG4gICAgaWYgKGRhdGFWaWV3ICYmIGdyaWQpIHtcbiAgICAgIHRoaXMuX2V2ZW50SGFuZGxlci5zdWJzY3JpYmUoZGF0YVZpZXcub25Sb3dDb3VudENoYW5nZWQsIChlOiBhbnksIGFyZ3M6IGFueSkgPT4ge1xuICAgICAgICBncmlkLnVwZGF0ZVJvd0NvdW50KCk7XG4gICAgICAgIGdyaWQucmVuZGVyKCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuX2V2ZW50SGFuZGxlci5zdWJzY3JpYmUoZGF0YVZpZXcub25Sb3dzQ2hhbmdlZCwgKGU6IGFueSwgYXJnczogYW55KSA9PiB7XG4gICAgICAgIGdyaWQuaW52YWxpZGF0ZVJvd3MoYXJncy5yb3dzKTtcbiAgICAgICAgZ3JpZC5yZW5kZXIoKTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIGRvZXMgdGhlIHVzZXIgaGF2ZSBhIGNvbHNwYW4gY2FsbGJhY2s/XG4gICAgaWYgKGdyaWRPcHRpb25zLmNvbHNwYW5DYWxsYmFjaykge1xuICAgICAgdGhpcy5fZGF0YVZpZXcuZ2V0SXRlbU1ldGFkYXRhID0gKHJvd051bWJlcjogbnVtYmVyKSA9PiB7XG4gICAgICAgIGNvbnN0IGl0ZW0gPSB0aGlzLl9kYXRhVmlldy5nZXRJdGVtKHJvd051bWJlcik7XG4gICAgICAgIHJldHVybiBncmlkT3B0aW9ucy5jb2xzcGFuQ2FsbGJhY2soaXRlbSk7XG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIGF0dGFjaEJhY2tlbmRDYWxsYmFja0Z1bmN0aW9ucyhncmlkT3B0aW9uczogR3JpZE9wdGlvbikge1xuICAgIGNvbnN0IGJhY2tlbmRBcGkgPSBncmlkT3B0aW9ucy5iYWNrZW5kU2VydmljZUFwaTtcbiAgICBjb25zdCBzZXJ2aWNlT3B0aW9uczogQmFja2VuZFNlcnZpY2VPcHRpb24gPSAoYmFja2VuZEFwaSAmJiBiYWNrZW5kQXBpLnNlcnZpY2UgJiYgYmFja2VuZEFwaS5zZXJ2aWNlLm9wdGlvbnMpID8gYmFja2VuZEFwaS5zZXJ2aWNlLm9wdGlvbnMgOiB7fTtcbiAgICBjb25zdCBpc0V4ZWN1dGVDb21tYW5kT25Jbml0ID0gKCFzZXJ2aWNlT3B0aW9ucykgPyBmYWxzZSA6ICgoc2VydmljZU9wdGlvbnMgJiYgc2VydmljZU9wdGlvbnMuaGFzT3duUHJvcGVydHkoJ2V4ZWN1dGVQcm9jZXNzQ29tbWFuZE9uSW5pdCcpKSA/IHNlcnZpY2VPcHRpb25zWydleGVjdXRlUHJvY2Vzc0NvbW1hbmRPbkluaXQnXSA6IHRydWUpO1xuXG4gICAgLy8gdXBkYXRlIGJhY2tlbmQgZmlsdGVycyAoaWYgbmVlZCBiZSkgYmVmb3JlIHRoZSBxdWVyeSBydW5zXG4gICAgaWYgKGJhY2tlbmRBcGkpIHtcbiAgICAgIGNvbnN0IGJhY2tlbmRTZXJ2aWNlID0gYmFja2VuZEFwaS5zZXJ2aWNlO1xuXG4gICAgICAvLyBpZiB1c2VyIGVudGVyZWQgc29tZSBhbnkgXCJwcmVzZXRzXCIsIHdlIG5lZWQgdG8gcmVmbGVjdCB0aGVtIGFsbCBpbiB0aGUgZ3JpZFxuICAgICAgaWYgKGdyaWRPcHRpb25zICYmIGdyaWRPcHRpb25zLnByZXNldHMpIHtcbiAgICAgICAgIC8vIEZpbHRlcnMgXCJwcmVzZXRzXCJcbiAgICAgICAgIGlmIChiYWNrZW5kU2VydmljZSAmJiBiYWNrZW5kU2VydmljZS51cGRhdGVGaWx0ZXJzICYmIEFycmF5LmlzQXJyYXkoZ3JpZE9wdGlvbnMucHJlc2V0cy5maWx0ZXJzKSAmJiBncmlkT3B0aW9ucy5wcmVzZXRzLmZpbHRlcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGJhY2tlbmRTZXJ2aWNlLnVwZGF0ZUZpbHRlcnMoZ3JpZE9wdGlvbnMucHJlc2V0cy5maWx0ZXJzLCB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBTb3J0ZXJzIFwicHJlc2V0c1wiXG4gICAgICAgIGlmIChiYWNrZW5kU2VydmljZSAmJiBiYWNrZW5kU2VydmljZS51cGRhdGVTb3J0ZXJzICYmIEFycmF5LmlzQXJyYXkoZ3JpZE9wdGlvbnMucHJlc2V0cy5zb3J0ZXJzKSAmJiBncmlkT3B0aW9ucy5wcmVzZXRzLnNvcnRlcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGJhY2tlbmRTZXJ2aWNlLnVwZGF0ZVNvcnRlcnModW5kZWZpbmVkLCBncmlkT3B0aW9ucy5wcmVzZXRzLnNvcnRlcnMpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFBhZ2luYXRpb24gXCJwcmVzZXRzXCJcbiAgICAgICAgaWYgKGJhY2tlbmRTZXJ2aWNlICYmIGJhY2tlbmRTZXJ2aWNlLnVwZGF0ZVBhZ2luYXRpb24gJiYgZ3JpZE9wdGlvbnMucHJlc2V0cy5wYWdpbmF0aW9uKSB7XG4gICAgICAgICAgYmFja2VuZFNlcnZpY2UudXBkYXRlUGFnaW5hdGlvbihncmlkT3B0aW9ucy5wcmVzZXRzLnBhZ2luYXRpb24ucGFnZU51bWJlciwgZ3JpZE9wdGlvbnMucHJlc2V0cy5wYWdpbmF0aW9uLnBhZ2VTaXplKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgY29sdW1uRmlsdGVycyA9IHRoaXMuZmlsdGVyU2VydmljZS5nZXRDb2x1bW5GaWx0ZXJzKCk7XG4gICAgICAgIGlmIChjb2x1bW5GaWx0ZXJzICYmIGJhY2tlbmRTZXJ2aWNlICYmIGJhY2tlbmRTZXJ2aWNlLnVwZGF0ZUZpbHRlcnMpIHtcbiAgICAgICAgICBiYWNrZW5kU2VydmljZS51cGRhdGVGaWx0ZXJzKGNvbHVtbkZpbHRlcnMsIGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChiYWNrZW5kQXBpICYmIGJhY2tlbmRBcGkuc2VydmljZSAmJiAoYmFja2VuZEFwaS5vbkluaXQgfHwgaXNFeGVjdXRlQ29tbWFuZE9uSW5pdCkpIHtcbiAgICAgIGNvbnN0IHF1ZXJ5ID0gKHR5cGVvZiBiYWNrZW5kQXBpLnNlcnZpY2UuYnVpbGRRdWVyeSA9PT0gJ2Z1bmN0aW9uJykgPyBiYWNrZW5kQXBpLnNlcnZpY2UuYnVpbGRRdWVyeSgpIDogJyc7XG4gICAgICBjb25zdCBvYnNlcnZhYmxlT3JQcm9taXNlID0gKGlzRXhlY3V0ZUNvbW1hbmRPbkluaXQpID8gYmFja2VuZEFwaS5wcm9jZXNzKHF1ZXJ5KSA6IGJhY2tlbmRBcGkub25Jbml0KHF1ZXJ5KTtcblxuICAgICAgLy8gd3JhcCB0aGlzIGluc2lkZSBhIHNldFRpbWVvdXQgdG8gYXZvaWQgdGltaW5nIGlzc3VlIHNpbmNlIHRoZSBncmlkT3B0aW9ucyBuZWVkcyB0byBiZSByZWFkeSBiZWZvcmUgcnVubmluZyB0aGlzIG9uSW5pdFxuICAgICAgc2V0VGltZW91dChhc3luYyAoKSA9PiB7XG4gICAgICAgIC8vIGtlZXAgc3RhcnQgdGltZSAmIGVuZCB0aW1lc3RhbXBzICYgcmV0dXJuIGl0IGFmdGVyIHByb2Nlc3MgZXhlY3V0aW9uXG4gICAgICAgIGNvbnN0IHN0YXJ0VGltZSA9IG5ldyBEYXRlKCk7XG5cbiAgICAgICAgaWYgKGJhY2tlbmRBcGkucHJlUHJvY2Vzcykge1xuICAgICAgICAgIGJhY2tlbmRBcGkucHJlUHJvY2VzcygpO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAvLyB0aGUgcHJvY2VzcyBjb3VsZCBiZSBhbiBPYnNlcnZhYmxlIChsaWtlIEh0dHBDbGllbnQpIG9yIGEgUHJvbWlzZVxuICAgICAgICAgIC8vIGluIGFueSBjYXNlLCB3ZSBuZWVkIHRvIGhhdmUgYSBQcm9taXNlIHNvIHRoYXQgd2UgY2FuIGF3YWl0IG9uIGl0IChpZiBhbiBPYnNlcnZhYmxlLCBjb252ZXJ0IGl0IHRvIFByb21pc2UpXG4gICAgICAgICAgY29uc3QgcHJvY2Vzc1Jlc3VsdDogR3JhcGhxbFJlc3VsdCB8IGFueSA9IGF3YWl0IGNhc3RUb1Byb21pc2Uob2JzZXJ2YWJsZU9yUHJvbWlzZSk7XG4gICAgICAgICAgY29uc3QgZW5kVGltZSA9IG5ldyBEYXRlKCk7XG5cbiAgICAgICAgICAvLyBkZWZpbmUgd2hhdCBvdXIgaW50ZXJuYWwgUG9zdCBQcm9jZXNzIGNhbGxiYWNrLCBvbmx5IGF2YWlsYWJsZSBmb3IgR3JhcGhRTCBTZXJ2aWNlIGZvciBub3dcbiAgICAgICAgICAvLyBpdCB3aWxsIGJhc2ljYWxseSByZWZyZXNoIHRoZSBEYXRhc2V0ICYgUGFnaW5hdGlvbiB3aXRob3V0IGhhdmluZyB0aGUgdXNlciB0byBjcmVhdGUgaGlzIG93biBQb3N0UHJvY2VzcyBldmVyeSB0aW1lXG4gICAgICAgICAgaWYgKHByb2Nlc3NSZXN1bHQgJiYgYmFja2VuZEFwaSAmJiBiYWNrZW5kQXBpLnNlcnZpY2UgaW5zdGFuY2VvZiBHcmFwaHFsU2VydmljZSAmJiBiYWNrZW5kQXBpLmludGVybmFsUG9zdFByb2Nlc3MpIHtcbiAgICAgICAgICAgIGJhY2tlbmRBcGkuaW50ZXJuYWxQb3N0UHJvY2Vzcyhwcm9jZXNzUmVzdWx0KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBzZW5kIHRoZSByZXNwb25zZSBwcm9jZXNzIHRvIHRoZSBwb3N0UHJvY2VzcyBjYWxsYmFja1xuICAgICAgICAgIGlmIChiYWNrZW5kQXBpLnBvc3RQcm9jZXNzKSB7XG4gICAgICAgICAgICBpZiAocHJvY2Vzc1Jlc3VsdCBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgICAgICAgICAgICBwcm9jZXNzUmVzdWx0LnN0YXRpc3RpY3MgPSB7XG4gICAgICAgICAgICAgICAgc3RhcnRUaW1lLFxuICAgICAgICAgICAgICAgIGVuZFRpbWUsXG4gICAgICAgICAgICAgICAgZXhlY3V0aW9uVGltZTogZW5kVGltZS52YWx1ZU9mKCkgLSBzdGFydFRpbWUudmFsdWVPZigpLFxuICAgICAgICAgICAgICAgIHRvdGFsSXRlbUNvdW50OiB0aGlzLmdyaWRPcHRpb25zICYmIHRoaXMuZ3JpZE9wdGlvbnMucGFnaW5hdGlvbiAmJiB0aGlzLmdyaWRPcHRpb25zLnBhZ2luYXRpb24udG90YWxJdGVtc1xuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYmFja2VuZEFwaS5wb3N0UHJvY2Vzcyhwcm9jZXNzUmVzdWx0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBpZiAoYmFja2VuZEFwaSAmJiBiYWNrZW5kQXBpLm9uRXJyb3IpIHtcbiAgICAgICAgICAgIGJhY2tlbmRBcGkub25FcnJvcihlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGF0dGFjaFJlc2l6ZUhvb2soZ3JpZDogYW55LCBvcHRpb25zOiBHcmlkT3B0aW9uKSB7XG4gICAgLy8gZXhwYW5kL2F1dG9maXQgY29sdW1ucyBvbiBmaXJzdCBwYWdlIGxvYWRcbiAgICBpZiAoZ3JpZCAmJiBvcHRpb25zLmF1dG9GaXRDb2x1bW5zT25GaXJzdExvYWQgJiYgb3B0aW9ucy5lbmFibGVBdXRvU2l6ZUNvbHVtbnMpIHtcbiAgICAgIGdyaWQuYXV0b3NpemVDb2x1bW5zKCk7XG5cbiAgICAgIC8vIGNvbXBlbnNhdGUgYW55dGltZSBTbGlja0dyaWQgbWVhc3VyZVNjcm9sbGJhciBpcyBpbmNvcnJlY3QgKG9ubHkgc2VlbXMgdG8gaGFwcGVuIGluIENocm9tZSAxLzUgY29tcHV0ZXJzKVxuICAgICAgdGhpcy5yZXNpemVyLmNvbXBlbnNhdGVIb3Jpem9udGFsU2Nyb2xsKHRoaXMuZ3JpZCwgdGhpcy5ncmlkT3B0aW9ucyk7XG4gICAgfVxuXG4gICAgLy8gYXV0by1yZXNpemUgZ3JpZCBvbiBicm93c2VyIHJlc2l6ZVxuICAgIGlmICh0aGlzLl9maXhlZEhlaWdodCB8fCB0aGlzLl9maXhlZFdpZHRoKSB7XG4gICAgICB0aGlzLnJlc2l6ZXIuaW5pdChncmlkLCB7IGhlaWdodDogdGhpcy5fZml4ZWRIZWlnaHQsIHdpZHRoOiB0aGlzLl9maXhlZFdpZHRoIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlc2l6ZXIuaW5pdChncmlkKTtcbiAgICB9XG4gICAgaWYgKG9wdGlvbnMuZW5hYmxlQXV0b1Jlc2l6ZSkge1xuICAgICAgdGhpcy5yZXNpemVyLmF0dGFjaEF1dG9SZXNpemVEYXRhR3JpZCgpO1xuICAgICAgaWYgKGdyaWQgJiYgb3B0aW9ucy5hdXRvRml0Q29sdW1uc09uRmlyc3RMb2FkICYmIG9wdGlvbnMuZW5hYmxlQXV0b1NpemVDb2x1bW5zKSB7XG4gICAgICAgIGdyaWQuYXV0b3NpemVDb2x1bW5zKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZXhlY3V0ZUFmdGVyRGF0YXZpZXdDcmVhdGVkKGdyaWQ6IGFueSwgZ3JpZE9wdGlvbnM6IEdyaWRPcHRpb24sIGRhdGFWaWV3OiBhbnkpIHtcbiAgICAvLyBpZiB1c2VyIGVudGVyZWQgc29tZSBTb3J0IFwicHJlc2V0c1wiLCB3ZSBuZWVkIHRvIHJlZmxlY3QgdGhlbSBhbGwgaW4gdGhlIERPTVxuICAgIGlmIChncmlkT3B0aW9ucy5lbmFibGVTb3J0aW5nKSB7XG4gICAgICBpZiAoZ3JpZE9wdGlvbnMucHJlc2V0cyAmJiBBcnJheS5pc0FycmF5KGdyaWRPcHRpb25zLnByZXNldHMuc29ydGVycykgJiYgZ3JpZE9wdGlvbnMucHJlc2V0cy5zb3J0ZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgdGhpcy5zb3J0U2VydmljZS5sb2FkTG9jYWxQcmVzZXRzKGdyaWQsIGRhdGFWaWV3KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBtZXJnZUdyaWRPcHRpb25zKGdyaWRPcHRpb25zKTogR3JpZE9wdGlvbiB7XG4gICAgZ3JpZE9wdGlvbnMuZ3JpZElkID0gdGhpcy5ncmlkSWQ7XG4gICAgZ3JpZE9wdGlvbnMuZ3JpZENvbnRhaW5lcklkID0gYHNsaWNrR3JpZENvbnRhaW5lci0ke3RoaXMuZ3JpZElkfWA7XG5cbiAgICAvLyB1c2UganF1ZXJ5IGV4dGVuZCB0byBkZWVwIG1lcmdlICYgY29weSB0byBhdm9pZCBpbW11dGFibGUgcHJvcGVydGllcyBiZWluZyBjaGFuZ2VkIGluIEdsb2JhbEdyaWRPcHRpb25zIGFmdGVyIGEgcm91dGUgY2hhbmdlXG4gICAgY29uc3Qgb3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBHbG9iYWxHcmlkT3B0aW9ucywgdGhpcy5mb3JSb290Q29uZmlnLCBncmlkT3B0aW9ucyk7XG5cbiAgICAvLyBhbHNvIG1ha2Ugc3VyZSB0byBzaG93IHRoZSBoZWFkZXIgcm93IGlmIHVzZXIgaGF2ZSBlbmFibGVkIGZpbHRlcmluZ1xuICAgIHRoaXMuX2hpZGVIZWFkZXJSb3dBZnRlclBhZ2VMb2FkID0gKG9wdGlvbnMuc2hvd0hlYWRlclJvdyA9PT0gZmFsc2UpO1xuICAgIGlmIChvcHRpb25zLmVuYWJsZUZpbHRlcmluZyAmJiAhb3B0aW9ucy5zaG93SGVhZGVyUm93KSB7XG4gICAgICBvcHRpb25zLnNob3dIZWFkZXJSb3cgPSBvcHRpb25zLmVuYWJsZUZpbHRlcmluZztcbiAgICB9XG4gICAgcmV0dXJuIG9wdGlvbnM7XG4gIH1cblxuICAvKipcbiAgICogT24gYSBQYWdpbmF0aW9uIGNoYW5nZWQsIHdlIHdpbGwgdHJpZ2dlciBhIEdyaWQgU3RhdGUgY2hhbmdlZCB3aXRoIHRoZSBuZXcgcGFnaW5hdGlvbiBpbmZvXG4gICAqIEFsc28gaWYgd2UgdXNlIFJvdyBTZWxlY3Rpb24gb3IgdGhlIENoZWNrYm94IFNlbGVjdG9yLCB3ZSBuZWVkIHRvIHJlc2V0IGFueSBzZWxlY3Rpb25cbiAgICovXG4gIHBhZ2luYXRpb25DaGFuZ2VkKHBhZ2luYXRpb246IFBhZ2luYXRpb24pIHtcbiAgICBpZiAodGhpcy5ncmlkT3B0aW9ucy5lbmFibGVSb3dTZWxlY3Rpb24gfHwgdGhpcy5ncmlkT3B0aW9ucy5lbmFibGVDaGVja2JveFNlbGVjdG9yKSB7XG4gICAgICB0aGlzLmdyaWRTZXJ2aWNlLnNldFNlbGVjdGVkUm93cyhbXSk7XG4gICAgfVxuXG4gICAgdGhpcy5ncmlkU3RhdGVTZXJ2aWNlLm9uR3JpZFN0YXRlQ2hhbmdlZC5uZXh0KHtcbiAgICAgIGNoYW5nZTogeyBuZXdWYWx1ZXM6IHBhZ2luYXRpb24sIHR5cGU6IEdyaWRTdGF0ZVR5cGUucGFnaW5hdGlvbiB9LFxuICAgICAgZ3JpZFN0YXRlOiB0aGlzLmdyaWRTdGF0ZVNlcnZpY2UuZ2V0Q3VycmVudEdyaWRTdGF0ZSgpXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogV2hlbiBkYXRhc2V0IGNoYW5nZXMsIHdlIG5lZWQgdG8gcmVmcmVzaCB0aGUgZW50aXJlIGdyaWQgVUkgJiBwb3NzaWJseSByZXNpemUgaXQgYXMgd2VsbFxuICAgKiBAcGFyYW0gZGF0YXNldFxuICAgKi9cbiAgcmVmcmVzaEdyaWREYXRhKGRhdGFzZXQ6IGFueVtdLCB0b3RhbENvdW50PzogbnVtYmVyKSB7XG4gICAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YXNldCkgJiYgdGhpcy5ncmlkICYmIHRoaXMuX2RhdGFWaWV3ICYmIHR5cGVvZiB0aGlzLl9kYXRhVmlldy5zZXRJdGVtcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5fZGF0YVZpZXcuc2V0SXRlbXMoZGF0YXNldCwgdGhpcy5ncmlkT3B0aW9ucy5kYXRhc2V0SWRQcm9wZXJ0eU5hbWUpO1xuICAgICAgaWYgKCF0aGlzLmdyaWRPcHRpb25zLmJhY2tlbmRTZXJ2aWNlQXBpKSB7XG4gICAgICAgIHRoaXMuX2RhdGFWaWV3LnJlU29ydCgpO1xuICAgICAgfVxuXG4gICAgICAvLyB0aGlzLmdyaWQuc2V0RGF0YShkYXRhc2V0KTtcbiAgICAgIHRoaXMuZ3JpZC5pbnZhbGlkYXRlKCk7XG4gICAgICB0aGlzLmdyaWQucmVuZGVyKCk7XG5cbiAgICAgIGlmICh0aGlzLmdyaWRPcHRpb25zLmJhY2tlbmRTZXJ2aWNlQXBpKSB7XG4gICAgICAgIC8vIGRvIHdlIHdhbnQgdG8gc2hvdyBwYWdpbmF0aW9uP1xuICAgICAgICAvLyBpZiB3ZSBoYXZlIGEgYmFja2VuZFNlcnZpY2VBcGkgYW5kIHRoZSBlbmFibGVQYWdpbmF0aW9uIGlzIHVuZGVmaW5lZCwgd2UnbGwgYXNzdW1lIHRoYXQgd2UgZG8gd2FudCB0byBzZWUgaXQsIGVsc2UgZ2V0IHRoYXQgZGVmaW5lZCB2YWx1ZVxuICAgICAgICB0aGlzLnNob3dQYWdpbmF0aW9uID0gKCh0aGlzLmdyaWRPcHRpb25zLmJhY2tlbmRTZXJ2aWNlQXBpICYmIHRoaXMuZ3JpZE9wdGlvbnMuZW5hYmxlUGFnaW5hdGlvbiA9PT0gdW5kZWZpbmVkKSA/IHRydWUgOiB0aGlzLmdyaWRPcHRpb25zLmVuYWJsZVBhZ2luYXRpb24pIHx8IGZhbHNlO1xuXG4gICAgICAgIC8vIGJlZm9yZSBtZXJnaW5nIHRoZSBncmlkIG9wdGlvbnMsIG1ha2Ugc3VyZSB0aGF0IGl0IGhhcyB0aGUgdG90YWxJdGVtcyBjb3VudFxuICAgICAgICAvLyBvbmNlIHdlIGhhdmUgdGhhdCwgd2UgY2FuIG1lcmdlIGFuZCBwYXNzIGFsbCB0aGVzZSBvcHRpb25zIHRvIHRoZSBwYWdpbmF0aW9uIGNvbXBvbmVudFxuICAgICAgICBpZiAoIXRoaXMuZ3JpZE9wdGlvbnMucGFnaW5hdGlvbikge1xuICAgICAgICAgIHRoaXMuZ3JpZE9wdGlvbnMucGFnaW5hdGlvbiA9ICh0aGlzLmdyaWRPcHRpb25zLnBhZ2luYXRpb24pID8gdGhpcy5ncmlkT3B0aW9ucy5wYWdpbmF0aW9uIDogdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmdyaWRPcHRpb25zLnBhZ2luYXRpb24gJiYgdG90YWxDb3VudCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgdGhpcy5ncmlkT3B0aW9ucy5wYWdpbmF0aW9uLnRvdGFsSXRlbXMgPSB0b3RhbENvdW50O1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmdyaWRPcHRpb25zLnByZXNldHMgJiYgdGhpcy5ncmlkT3B0aW9ucy5wcmVzZXRzLnBhZ2luYXRpb24gJiYgdGhpcy5ncmlkT3B0aW9ucy5wYWdpbmF0aW9uKSB7XG4gICAgICAgICAgdGhpcy5ncmlkT3B0aW9ucy5wYWdpbmF0aW9uLnBhZ2VTaXplID0gdGhpcy5ncmlkT3B0aW9ucy5wcmVzZXRzLnBhZ2luYXRpb24ucGFnZVNpemU7XG4gICAgICAgICAgdGhpcy5ncmlkT3B0aW9ucy5wYWdpbmF0aW9uLnBhZ2VOdW1iZXIgPSB0aGlzLmdyaWRPcHRpb25zLnByZXNldHMucGFnaW5hdGlvbi5wYWdlTnVtYmVyO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ3JpZFBhZ2luYXRpb25PcHRpb25zID0gdGhpcy5tZXJnZUdyaWRPcHRpb25zKHRoaXMuZ3JpZE9wdGlvbnMpO1xuICAgICAgfVxuXG4gICAgICAvLyByZXNpemUgdGhlIGdyaWQgaW5zaWRlIGEgc2xpZ2h0IHRpbWVvdXQsIGluIGNhc2Ugb3RoZXIgRE9NIGVsZW1lbnQgY2hhbmdlZCBwcmlvciB0byB0aGUgcmVzaXplIChsaWtlIGEgZmlsdGVyL3BhZ2luYXRpb24gY2hhbmdlZClcbiAgICAgIGlmICh0aGlzLmdyaWQgJiYgdGhpcy5ncmlkT3B0aW9ucy5lbmFibGVBdXRvUmVzaXplKSB7XG4gICAgICAgIGNvbnN0IGRlbGF5ID0gdGhpcy5ncmlkT3B0aW9ucy5hdXRvUmVzaXplICYmIHRoaXMuZ3JpZE9wdGlvbnMuYXV0b1Jlc2l6ZS5kZWxheTtcbiAgICAgICAgdGhpcy5yZXNpemVyLnJlc2l6ZUdyaWQoZGVsYXkgfHwgMTApO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBEeW5hbWljYWxseSBjaGFuZ2Ugb3IgdXBkYXRlIHRoZSBjb2x1bW4gZGVmaW5pdGlvbnMgbGlzdC5cbiAgICogV2Ugd2lsbCByZS1yZW5kZXIgdGhlIGdyaWQgc28gdGhhdCB0aGUgbmV3IGhlYWRlciBhbmQgZGF0YSBzaG93cyB1cCBjb3JyZWN0bHkuXG4gICAqIElmIHVzaW5nIGkxOG4sIHdlIGFsc28gbmVlZCB0byB0cmlnZ2VyIGEgcmUtdHJhbnNsYXRlIG9mIHRoZSBjb2x1bW4gaGVhZGVyc1xuICAgKi9cbiAgdXBkYXRlQ29sdW1uRGVmaW5pdGlvbnNMaXN0KG5ld0NvbHVtbkRlZmluaXRpb25zKSB7XG4gICAgaWYgKHRoaXMuZ3JpZE9wdGlvbnMuZW5hYmxlVHJhbnNsYXRlKSB7XG4gICAgICB0aGlzLmV4dGVuc2lvblNlcnZpY2UudHJhbnNsYXRlQ29sdW1uSGVhZGVycyhmYWxzZSwgbmV3Q29sdW1uRGVmaW5pdGlvbnMpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmV4dGVuc2lvblNlcnZpY2UucmVuZGVyQ29sdW1uSGVhZGVycyhuZXdDb2x1bW5EZWZpbml0aW9ucyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZ3JpZE9wdGlvbnMgJiYgdGhpcy5ncmlkT3B0aW9ucy5lbmFibGVBdXRvU2l6ZUNvbHVtbnMpIHtcbiAgICAgIHRoaXMuZ3JpZC5hdXRvc2l6ZUNvbHVtbnMoKTtcbiAgICB9XG4gIH1cblxuICAvKiogVG9nZ2xlIHRoZSBmaWx0ZXIgcm93IGRpc3BsYXllZCBvbiBmaXJzdCByb3dcbiAgICogQHBhcmFtIGlzU2hvd2luZ1xuICAgKi9cbiAgc2hvd0hlYWRlclJvdyhpc1Nob3dpbmc6IGJvb2xlYW4pIHtcbiAgICB0aGlzLmdyaWQuc2V0SGVhZGVyUm93VmlzaWJpbGl0eShpc1Nob3dpbmcpO1xuICAgIHJldHVybiBpc1Nob3dpbmc7XG4gIH1cblxuICAvKiogVG9nZ2xlIHRoZSBmaWx0ZXIgcm93IGRpc3BsYXllZCBvbiBmaXJzdCByb3cgKi9cbiAgdG9nZ2xlSGVhZGVyUm93KCkge1xuICAgIGNvbnN0IGlzU2hvd2luZyA9ICF0aGlzLmdyaWQuZ2V0T3B0aW9ucygpLnNob3dIZWFkZXJSb3c7XG4gICAgdGhpcy5ncmlkLnNldEhlYWRlclJvd1Zpc2liaWxpdHkoaXNTaG93aW5nKTtcbiAgICByZXR1cm4gaXNTaG93aW5nO1xuICB9XG5cbiAgLy9cbiAgLy8gcHJpdmF0ZSBmdW5jdGlvbnNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLyoqIERpc3BhdGNoIG9mIEN1c3RvbSBFdmVudCwgd2hpY2ggYnkgZGVmYXVsdCB3aWxsIGJ1YmJsZSAmIGlzIGNhbmNlbGFibGUgKi9cbiAgcHJpdmF0ZSBkaXNwYXRjaEN1c3RvbUV2ZW50KGV2ZW50TmFtZTogc3RyaW5nLCBkYXRhPzogYW55LCBpc0J1YmJsaW5nOiBib29sZWFuID0gdHJ1ZSwgaXNDYW5jZWxhYmxlOiBib29sZWFuID0gdHJ1ZSkge1xuICAgIGNvbnN0IGV2ZW50SW5pdDogQ3VzdG9tRXZlbnRJbml0ID0geyBidWJibGVzOiBpc0J1YmJsaW5nLCBjYW5jZWxhYmxlOiBpc0NhbmNlbGFibGUgfTtcbiAgICBpZiAoZGF0YSkge1xuICAgICAgZXZlbnRJbml0LmRldGFpbCA9IGRhdGE7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmVsbS5uYXRpdmVFbGVtZW50LmRpc3BhdGNoRXZlbnQobmV3IEN1c3RvbUV2ZW50KGV2ZW50TmFtZSwgZXZlbnRJbml0KSk7XG4gIH1cblxuICAvKiogTG9hZCB0aGUgRWRpdG9yIENvbGxlY3Rpb24gYXN5bmNocm9ub3VzbHkgYW5kIHJlcGxhY2UgdGhlIFwiY29sbGVjdGlvblwiIHByb3BlcnR5IHdoZW4gT2JzZXJ2YWJsZSByZXNvbHZlcyAqL1xuICBwcml2YXRlIGxvYWRFZGl0b3JDb2xsZWN0aW9uQXN5bmMoY29sdW1uOiBDb2x1bW4pIHtcbiAgICBjb25zdCBjb2xsZWN0aW9uQXN5bmMgPSBjb2x1bW4gJiYgY29sdW1uLmVkaXRvciAmJiBjb2x1bW4uZWRpdG9yLmNvbGxlY3Rpb25Bc3luYztcbiAgICBpZiAoY29sbGVjdGlvbkFzeW5jIGluc3RhbmNlb2YgT2JzZXJ2YWJsZSkge1xuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnB1c2goXG4gICAgICAgIGNvbGxlY3Rpb25Bc3luYy5zdWJzY3JpYmUoKHJlc29sdmVkQ29sbGVjdGlvbikgPT4gdGhpcy51cGRhdGVFZGl0b3JDb2xsZWN0aW9uKGNvbHVtbiwgcmVzb2x2ZWRDb2xsZWN0aW9uKSlcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSB0aGUgRWRpdG9yIFwiY29sbGVjdGlvblwiIHByb3BlcnR5IGZyb20gYW4gYXN5bmMgY2FsbCByZXNvbHZlZFxuICAgKiBTaW5jZSB0aGlzIGlzIGNhbGxlZCBhZnRlciB0aGUgYXN5bmMgY2FsbCByZXNvbHZlcywgdGhlIHBvaW50ZXIgd2lsbCBub3QgYmUgdGhlIHNhbWUgYXMgdGhlIFwiY29sdW1uXCIgYXJndW1lbnQgcGFzc2VkLlxuICAgKiBPbmNlIHdlIGZvdW5kIHRoZSBuZXcgcG9pbnRlciwgd2Ugd2lsbCByZWFzc2lnbiB0aGUgXCJlZGl0b3JcIiBhbmQgXCJjb2xsZWN0aW9uXCIgdG8gdGhlIFwiaW50ZXJuYWxDb2x1bW5FZGl0b3JcIiBzbyBpdCBoYXMgbmV3ZXN0IGNvbGxlY3Rpb25cbiAgICovXG4gIHByaXZhdGUgdXBkYXRlRWRpdG9yQ29sbGVjdGlvbihjb2x1bW46IENvbHVtbiwgbmV3Q29sbGVjdGlvbjogYW55W10pIHtcbiAgICBjb2x1bW4uZWRpdG9yLmNvbGxlY3Rpb24gPSBuZXdDb2xsZWN0aW9uO1xuXG4gICAgLy8gZmluZCB0aGUgbmV3IGNvbHVtbiByZWZlcmVuY2UgcG9pbnRlclxuICAgIGNvbnN0IGNvbHVtbnMgPSB0aGlzLmdyaWQuZ2V0Q29sdW1ucygpO1xuICAgIGlmIChBcnJheS5pc0FycmF5KGNvbHVtbnMpKSB7XG4gICAgICBjb25zdCBjb2x1bW5SZWY6IENvbHVtbiA9IGNvbHVtbnMuZmluZCgoY29sOiBDb2x1bW4pID0+IGNvbC5pZCA9PT0gY29sdW1uLmlkKTtcbiAgICAgIGNvbHVtblJlZi5pbnRlcm5hbENvbHVtbkVkaXRvciA9IGNvbHVtbi5lZGl0b3I7XG4gICAgfVxuICB9XG59XG4iXX0=