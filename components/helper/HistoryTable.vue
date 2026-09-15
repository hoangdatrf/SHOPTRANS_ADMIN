<template>
    <div class="w-full h-full custom-table-wrapper">
            <a-table
            class="flex-1 w-full"
            ref="tableRef"
            size="small"
            :rowKey="_rowkey"
            :pagination="false"
            :dataSource="dataSource"
            :columns="columns"
            :scroll="{ x: true, y: 600 }"
            :rowClassName="(record, index) => {
                const custom = props.rowClassName?.(record, index) || '';
                return `${custom} cursor-pointer`;
            }"
            :customRow="(record) => ({
                onClick: () => {
                emit('selectRowHandler', record);
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
import { ref, reactive, nextTick } from 'vue';
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
}>(), {
  rowClassName: () => () => ''
});

// #endregion

// #region METHODS
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

onMounted(async () => {
    await nextTick();
    const tableEl = tableRef.value?.$el;
    const tableBodyEl = tableEl?.querySelector('.ant-table-body');
    if (tableBodyEl) {
        tableBodyEl.addEventListener('scroll', onScroll);
    }
})

onUnmounted(() => {
    const tableEl = tableRef.value?.$el;
    const tableBodyEl = tableEl?.querySelector('.ant-table-body');
    if (tableBodyEl) {
        tableBodyEl.removeEventListener('scroll', onScroll);
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


:deep(.ant-table-cell) {
    padding: 8px 16px;
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
    /* background-color: linear-gradient(to right, #ff0000, #006696); */
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;  /* ❌ Không cho scroll ở đây */
    height: 100%;
    width: 100%;
}
:deep(.selected-row) {
  background-color: #d9eff5 !important;
}

:deep(.selected-row > td) {
  background-color: #d9eff5 !important;
}
</style>
