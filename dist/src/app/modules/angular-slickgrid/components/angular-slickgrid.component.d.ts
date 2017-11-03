import 'slickgrid/lib/jquery-ui-1.11.3';
import 'slickgrid/lib/jquery.event.drag-2.3.0';
import 'slickgrid/slick.core';
import 'slickgrid/slick.dataview';
import 'slickgrid/slick.grid';
import 'slickgrid/slick.dataview';
import 'slickgrid/plugins/slick.autotooltips';
import 'slickgrid/plugins/slick.cellcopymanager';
import 'slickgrid/plugins/slick.cellexternalcopymanager';
import 'slickgrid/plugins/slick.cellrangedecorator';
import 'slickgrid/plugins/slick.cellrangeselector';
import 'slickgrid/plugins/slick.cellselectionmodel';
import 'slickgrid/plugins/slick.checkboxselectcolumn';
import 'slickgrid/plugins/slick.headerbuttons';
import 'slickgrid/plugins/slick.headermenu';
import 'slickgrid/plugins/slick.rowmovemanager';
import 'slickgrid/plugins/slick.rowselectionmodel';
import 'slickgrid/controls/slick.columnpicker';
import 'slickgrid/controls/slick.pager';
import { Column, GridOption } from './../models';
import { AfterViewInit, EventEmitter, OnInit } from '@angular/core';
import { FilterService, GridEventService, SortService, ResizerService } from './../services';
export declare class AngularSlickgridComponent implements AfterViewInit, OnInit {
    private resizer;
    private gridEventService;
    private filterService;
    private sortService;
    private _dataset;
    private _dataView;
    private _gridOptions;
    private _columnFilters;
    grid: any;
    gridPaginationOptions: GridOption;
    gridHeightString: string;
    gridWidthString: string;
    showPagination: boolean;
    dataviewChanged: EventEmitter<any>;
    gridChanged: EventEmitter<any>;
    gridId: string;
    columnDefinitions: Column[];
    gridOptions: GridOption;
    gridHeight: number;
    gridWidth: number;
    dataset: any[];
    constructor(resizer: ResizerService, gridEventService: GridEventService, filterService: FilterService, sortService: SortService);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    attachDifferentControlOrPlugins(grid: any, options: GridOption, dataView: any): void;
    attachDifferentHooks(grid: any, options: GridOption, dataView: any): void;
    attachResizeHook(grid: any, options: GridOption): void;
    mergeGridOptions(): GridOption;
    /** Toggle the filter row displayed on first row */
    showHeaderRow(isShowing: boolean): boolean;
    /** Toggle the filter row displayed on first row */
    toggleHeaderRow(): boolean;
    refreshGridData(dataset: any[]): void;
}
