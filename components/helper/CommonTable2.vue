<template>
    <div class="w-full h-full custom-table-wrapper">        
         <a-table class="flex-1 w-full" ref="tableRef" size="small" :rowKey="_rowkey" :pagination="false" :dataSource="dataSource"
            :columns="columns" :scroll="{ x: calcTableWidth(), y: 'calc((100vh - 26rem - 12px)/2)' }"
            :rowClassName="(_, index) => index === selectedIndex ? 'selected-row' : 'cursor-pointer'"
            :customRow="(record, index) => ({
                onClick: () => {
                    selectedIndex = index;
                    $emit('selectRowHandler', record);
                }
            })"
            bordered
            :loading="loading"
            >
            <template #headerCell="{ column }">
                <template v-if="column.key !== null && column.dataIndex">
                    <div style="display: flex; flex-direction: column; align-items: start; gap: 4px;">
                        <span>{{ column.title }}</span>
                        <div class="flex flex-row items-center" v-if="isOpenFillter">
                            <a-input class="me-2" v-model:value="searchTexts[String(column.dataIndex)]" placeholder=""
                                style="flex-grow: 2;" @keyup.enter="onSearch" />
                            <a-dropdown>
                                <template #overlay>
                                    <a-menu>
                                        <template v-for="(enabled, type) in (column as TableColumn).filterMapping"
                                            :key="type">
                                            <a-menu-item v-if="enabled" :key="type"
                                                @click="handleFilterTypeChange(String(column.dataIndex), type)">
                                                <div class="flex flex-row items-center">
                                                    <svg width="16" height="16"
                                                        style="vertical-align: middle; margin-right: 4px;">
                                                        <use :xlink:href="'#' + type" />
                                                    </svg>
                                                    <h6 style="">
                                                        {{ {
                                                            'ct': 'Contains',
                                                            'eq': 'Equals',
                                                            'neq': 'Not equal',
                                                            'sw': 'Starts with',
                                                            'ew': 'Ends with',
                                                            'em': 'Empty',
                                                            'ne': 'Not empty',
                                                            'lt': 'Less than',
                                                            'gt': 'Greater than',
                                                            'lte': 'Less than or equal',
                                                            'gte': 'Greater than or equal',
                                                            'sel': 'Selected',
                                                            'nsel': 'Not selected',
                                                            'esn': 'Selected and not selected',
                                                        }[type] }}
                                                    </h6>
                                                </div>
                                            </a-menu-item>
                                        </template>
                                    </a-menu>
                                </template>
                                <div class="ms-2"><svg width="18" height="18"
                                        style="font-size: 30px; cursor:pointer; vertical-align: middle; margin-right: 4px;">
                                        <use
                                            :xlink:href="'#' + (currentFilterType[String(column.dataIndex)] || column.isCheckBox ? 'esn' : 'ct')" />
                                    </svg></div>
                            </a-dropdown>
                        </div>
                    </div>
                </template>
                <template v-else>
                    {{ column.title }}
                </template>
            </template>
        </a-table>
    </div>
</template>

<script setup lang="ts">
// #region IMPORTS
import { ref, reactive, nextTick, onMounted, onUnmounted } from 'vue';
import type { ColumnType } from 'ant-design-vue/es/table/interface';
// #endregion

// #region INTERFACES
interface FilterMapping {
    [key: string]: boolean;
}
interface TableColumn extends ColumnType<any> {
    title: string;
    dataIndex: string | number;
    key: string;
    width?: number;
    minWidth?: number;
    maxWidth?: number;
    filterMapping?: FilterMapping;
    isCheckBox?: boolean;
    customRender?: (params: { text: string }) => string;
}
interface TableRef {
    $el: HTMLElement;
}
// #endregion

// #region VARIABLES
const tableRef = ref<TableRef | null>(null);
const prevScrollTop = ref(0);
const currentFilterType = reactive<Record<string, string>>({});
const isOpenFillter = ref(true);
const searchTexts = reactive<Record<string, string>>({});
const searchType = reactive<Record<string, string>>({});
const selectedIndex = ref<number>(-1);

const emit = defineEmits(['selectRowHandler', 'searchHandler', 'loadMoreHandler']);
// #endregion

// #region PROPS
const props = withDefaults(defineProps<{
  _rowkey: string;
  dataSource: any[];
  pagination: any;
  columns: TableColumn[];
  title?: string;
  loading?: boolean;
  rowClassName?: (record: any, index: number) => string;
  minColumnWidth?: number;
}>(), {
  rowClassName: () => () => '',
  minColumnWidth: 120
});

// #endregion

// #region METHODS
// Calculate total table width based on column widths
const calcTableWidth = () => {
  const defaultMinWidth = props.minColumnWidth || 120;
  let totalWidth = 0;

  // Sum up the width of all columns
  props.columns.forEach((column) => {
    totalWidth += column.width || defaultMinWidth;
  });

  // Add extra space to ensure full display
  totalWidth += 300;
  
  return totalWidth < 300 ? 'max-content' : `${totalWidth}px`;
};

const onScroll = (e: Event) => {
    const target = e.target as HTMLElement;
    const { scrollTop, clientHeight, scrollHeight } = target;
    const threshold = 50;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - threshold;
    const scrollDirection = scrollTop > prevScrollTop.value ? 'down' : 'up';
    prevScrollTop.value = scrollTop;
    if (isNearBottom && !props.loading && scrollDirection === 'down') {
        clearTimeout((window as any).scrollTimeout);
        (window as any).scrollTimeout = setTimeout(() => {
            const headerInfo = props.columns.reduce((acc: Record<string, { searchText: string; searchType: string }>, column: TableColumn) => {
                if (column.dataIndex) {
                    acc[String(column.dataIndex)] = {
                        searchText: searchTexts[String(column.dataIndex)] || '',
                        searchType: searchType[String(column.dataIndex)] || ''
                    };
                }
                return acc;
            }, {});

            emit('loadMoreHandler', headerInfo);
        }, 100);
    }
};
const handleFilterTypeChange = (columnKey: string, filterType: string) => {
    searchType[columnKey] = filterType;
    currentFilterType[columnKey] = filterType;
}
const onSearch = () => {
    const headerInfo = props.columns.reduce((acc: Record<string, { searchText: string; searchType: string }>, column: TableColumn) => {
        if (column.dataIndex) {
            acc[String(column.dataIndex)] = {
                searchText: searchTexts[String(column.dataIndex)] || '',
                searchType: searchType[String(column.dataIndex)] || ''
            };
        }
        return acc;
    }, {});

    emit('searchHandler', headerInfo);
    // Scroll the table to the top when search is triggered
    const tableEl = tableRef.value?.$el;
    const tableBodyEl = tableEl?.querySelector('.ant-table-body');
    if (tableBodyEl) {
        tableBodyEl.scrollTop = 0;
    }
};
// #endregion

// Store the resize observer reference
let resizeObserver: ResizeObserver | null = null;

onMounted(async () => {
    await nextTick();
    const tableEl = tableRef.value?.$el;
    const tableBodyEl = tableEl?.querySelector('.ant-table-body');
    if (tableBodyEl) {
        tableBodyEl.addEventListener('scroll', onScroll);
        
        // Add resize observer to handle container size changes
        resizeObserver = new ResizeObserver(() => {
            // Force table to adapt to new container size
            nextTick(() => {
                if (tableEl) {
                    const containerWidth = tableEl.parentElement
                        ? tableEl.parentElement.clientWidth
                        : 0;
                    if (containerWidth > 0) {
                        tableEl.style.maxWidth = `${containerWidth}px`;
                    }
                }
            });
        });

        if (tableEl && tableEl.parentElement) {
            resizeObserver.observe(tableEl.parentElement);
        }
    }
})

onUnmounted(() => {
    const tableEl = tableRef.value?.$el;
    const tableBodyEl = tableEl?.querySelector('.ant-table-body');
    if (tableBodyEl) {
        tableBodyEl.removeEventListener('scroll', onScroll);
    }
    
    // Disconnect the resize observer when component unmounts
    if (resizeObserver) {
        resizeObserver.disconnect();
        resizeObserver = null;
    }
})


// #region WATCHES
// watch(open, (newVal) => {
//     if (newVal) {
//         // Clear all searchTexts when the modal is opened
//         for (const key in searchTexts) {
//             if (Object.prototype.hasOwnProperty.call(searchTexts, key)) {
//                 searchTexts[key] = '';
//             }
//         }
//     }
// });
// #endregion


</script>

<style scoped>
:deep(.ant-table-thead > tr > th) {
    background-color: #f5f5f5;
    font-weight: 600;
    padding: 8px 16px;
    white-space: nowrap;
}

:deep(.ant-table-tbody > tr:hover > td) {
    background-color: #e6f7ff;
}

:deep(.ant-table-tbody > tr.selected-row > td) {
    background-color: #bae7ff !important;
}

:deep(.ant-table-cell) {
    padding: 8px 16px;
    white-space: nowrap; /* Prevent text wrapping in cells */
}

.table-container {
    width: calc(100%) !important;
    height: calc(100%) !important;
    /* overflow: auto; */
}

:deep(.ant-spin-container) {
    width: calc(100%) !important;
    height: calc(100%) !important;
}

:deep(.ant-table-container) {
    /* position: relative; */
    width: calc(100%) !important;
    height: calc(100%) !important;
}

.custom-table-wrapper {
    width: 100%;
    height: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    display: flex;
    overflow: hidden;
    flex: 1;
    max-width: 100%;
    box-sizing: border-box;
}
:deep(.selected-row) {
  background-color: #d9eff5 !important;
}

:deep(.selected-row > td) {
  background-color: #d9eff5 !important;
}

/* Table width and scrolling styles */
:deep(.ant-table) {
  width: 100% !important;
}

:deep(.ant-table-body) {
  overflow-y: auto !important;
  overflow-x: scroll !important; /* Always show horizontal scrollbar */
  width: 100% !important;
}

:deep(.ant-table-header) {
  overflow: hidden !important;
  margin-bottom: 0 !important;
}

/* Horizontal scrollbar styling */
:deep(.ant-table-body::-webkit-scrollbar) {
  height: 10px;
  width: 8px;
}

:deep(.ant-table-body::-webkit-scrollbar-thumb) {
  background-color: #1890ff;
  border-radius: 5px;
  border: 2px solid #f1f1f1;
}

:deep(.ant-table-body::-webkit-scrollbar-thumb:hover) {
  background-color: #096dd9;
}

:deep(.ant-table-body::-webkit-scrollbar-track) {
  background-color: #f1f1f1;
  border-radius: 5px;
}

/* Scroll shadow indicator */
:deep(.ant-table-header::after) {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 40px;
  content: "";
  background: linear-gradient(to right, rgba(255, 255, 255, 0), rgba(24, 144, 255, 0.15));
  pointer-events: none;
  opacity: 0.8;
}
</style>
