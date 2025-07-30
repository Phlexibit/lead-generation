"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
    getFilteredRowModel,
    getSortedRowModel,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"

import * as React from "react"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { DataTablePagination } from "./data-table-pagination"
import { Input } from "@/components/ui/input"
import { X, Calendar, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    handleCellClickCb?: (row: TData) => void
    clickableColumns?: string[]
    showDateFilter?: boolean
    onDateFilterChange?: (startDate: string | undefined, endDate: string | undefined) => void
    pagination?: {
        total?: number
        filtered?: number
        hasDateFilter?: boolean
    }
}

export function DataTable<TData, TValue>({
    columns,
    data,
    handleCellClickCb,
    clickableColumns = [],
    showDateFilter = false,
    onDateFilterChange,
    pagination,
}: DataTableProps<TData, TValue>) {
    const [startDate, setStartDate] = React.useState<string>("")
    const [endDate, setEndDate] = React.useState<string>("")
    const [globalFilter, setGlobalFilter] = React.useState("")

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
    })

    // Handle date filter changes
    React.useEffect(() => {
        if (onDateFilterChange) {
            const startDateStr = startDate || undefined;
            const endDateStr = endDate || undefined;
            console.log('DataTable date filter changed:', { startDate, endDate, startDateStr, endDateStr });
            onDateFilterChange(startDateStr, endDateStr);
        }
    }, [startDate, endDate, onDateFilterChange]);

    const handleCellClick = (e: React.MouseEvent, cell: any, row: any) => {
        if (clickableColumns && clickableColumns.length > 0) {
            const columnId = cell.column.id
            if (clickableColumns.includes(columnId)) {
                e.stopPropagation()
                handleCellClickCb?.(row.original)
            }
        }
    }

    const handleRowClick = (row: any) => {
        if (!clickableColumns || clickableColumns.length === 0) {
            handleCellClickCb?.(row.original)
        }
    }

    const clearDateFilters = () => {
        console.log('Clearing date filters');
        setStartDate("");
        setEndDate("");
    }

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        console.log('Start date changed to:', value);
        setStartDate(value);
        
        // If end date is before start date, clear end date
        if (endDate && value && endDate < value) {
            setEndDate("");
        }
    }

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        console.log('End date changed to:', value);
        setEndDate(value);
    }

    const setToday = () => {
        const today = new Date().toISOString().split('T')[0];
        console.log('Setting today:', today);
        setStartDate(today);
        setEndDate(today);
    }

    const setYesterday = () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        console.log('Setting yesterday:', yesterdayStr);
        setStartDate(yesterdayStr);
        setEndDate(yesterdayStr);
    }

    const setThisWeek = () => {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        
        const startStr = startOfWeek.toISOString().split('T')[0];
        const endStr = endOfWeek.toISOString().split('T')[0];
        console.log('Setting this week:', { startStr, endStr });
        setStartDate(startStr);
        setEndDate(endStr);
    }

    const setThisMonth = () => {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        
        const startStr = startOfMonth.toISOString().split('T')[0];
        const endStr = endOfMonth.toISOString().split('T')[0];
        console.log('Setting this month:', { startStr, endStr });
        setStartDate(startStr);
        setEndDate(endStr);
    }

    const setLastMonth = () => {
        const today = new Date();
        const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        
        const startStr = startOfLastMonth.toISOString().split('T')[0];
        const endStr = endOfLastMonth.toISOString().split('T')[0];
        console.log('Setting last month:', { startStr, endStr });
        setStartDate(startStr);
        setEndDate(endStr);
    }

    const setLast7Days = () => {
        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);
        
        const startStr = sevenDaysAgo.toISOString().split('T')[0];
        const endStr = today.toISOString().split('T')[0];
        console.log('Setting last 7 days:', { startStr, endStr });
        setStartDate(startStr);
        setEndDate(endStr);
    }

    const setLast30Days = () => {
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        
        const startStr = thirtyDaysAgo.toISOString().split('T')[0];
        const endStr = today.toISOString().split('T')[0];
        console.log('Setting last 30 days:', { startStr, endStr });
        setStartDate(startStr);
        setEndDate(endStr);
    }

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Input
                        placeholder="Search all columns..."
                        value={globalFilter ?? ""}
                        onChange={(event) => setGlobalFilter(event.target.value)}
                        className="max-w-sm"
                    />
                </div>
                
                {showDateFilter && (
                    <div className="flex items-center space-x-4">
                        {/* Date Presets Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="text-xs">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    Quick Filters
                                    <ChevronDown className="h-3 w-3 ml-1" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={setToday}>
                                    Today
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={setYesterday}>
                                    Yesterday
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={setThisWeek}>
                                    This Week
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={setThisMonth}>
                                    This Month
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={setLastMonth}>
                                    Last Month
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={setLast7Days}>
                                    Last 7 Days
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={setLast30Days}>
                                    Last 30 Days
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Date inputs */}
                        <div className="flex items-center space-x-2">
                            <Input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-32 text-xs"
                                placeholder="Start Date"
                            />
                            <span className="text-xs text-gray-500">to</span>
                            <Input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-32 text-xs"
                                placeholder="End Date"
                            />
                        </div>
                        
                        {(startDate || endDate) && (
                            <div className="flex items-center space-x-2">
                                <div className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-md border border-blue-200">
                                    {startDate && endDate ? (
                                        `${startDate} to ${endDate}`
                                    ) : startDate ? (
                                        `From ${startDate}`
                                    ) : (
                                        `Until ${endDate}`
                                    )}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={clearDateFilters}
                                    className="flex items-center space-x-1"
                                >
                                    <X className="h-3 w-3" />
                                    <span>Clear</span>
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Filter Summary */}
            {((startDate || endDate) || pagination?.hasDateFilter) && (
                <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex items-center space-x-4">
                        <div className="text-sm text-blue-700">
                            <span className="font-medium">Active Filters:</span>
                            {startDate && endDate ? (
                                <span className="ml-2">Date range: {startDate} to {endDate}</span>
                            ) : startDate ? (
                                <span className="ml-2">From: {startDate}</span>
                            ) : endDate ? (
                                <span className="ml-2">Until: {endDate}</span>
                            ) : null}
                        </div>
                        {pagination && (
                            <div className="text-sm text-blue-700">
                                <span className="font-medium">Results:</span>
                                <span className="ml-2">
                                    {pagination.filtered || data.length} of {pagination.total || data.length} records
                                </span>
                            </div>
                        )}
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearDateFilters}
                        className="text-blue-700 hover:text-blue-800 hover:bg-blue-100"
                    >
                        <X className="h-3 w-3 mr-1" />
                        Clear All Filters
                    </Button>
                </div>
            )}

            <div className="rounded-md border table-responsive">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    onClick={() => handleRowClick(row)}
                                    className={(!clickableColumns || clickableColumns.length === 0) ? "cursor-pointer" : ""}
                                >
                                    {row.getVisibleCells().map((cell) => {
                                        const isClickableColumn = clickableColumns?.includes(cell.column.id)
                                        return (
                                            <TableCell
                                                key={cell.id}
                                                onClick={(e) => handleCellClick(e, cell, row)}
                                                className={isClickableColumn ? "cursor-pointer" : ""}
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        )
                                    })}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table}/>
        </div>
    )
}