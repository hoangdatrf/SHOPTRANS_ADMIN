<template>
    <a-modal v-model:open="open" :title="title" @ok="handleOk" width="max-content" class="!max-w-[60vw] !max-h-[50vh]">
        <div class="flex justify-between items-center mb-4">
            <a-checkbox v-model:checked="isOpenFillter" style="user-select: none;">
                Hiện bộ lọc
            </a-checkbox>
            <div class="flex flex-row gap-2">
                <a-input v-model:value.lazy="sText" autofocus placeholder="Tìm kiếm" @keyup.enter="onSearch" />
                <a-button type="primary" @click="onSearch">
                    Tìm kiếm
                </a-button>
            </div>
        </div>
        <a-table ref="tableRef" size="small" :rowKey="_rowkey" :pagination="false" :dataSource="dataSource"
            :columns="columns" :scroll="{ x: true, y: 'calc(100vh - 400px)' }" :rowClassName="() => 'cursor-pointer'"
            :customRow="(record) => ({
                onDblclick: () => {
                    $emit('selectRow', record);
                    hideModal();
                }
            })" bordered :loading="loading">
            <template #headerCell="{ column }">
                <template v-if="column.key !== null && column.dataIndex">
                    <div style="display: flex; flex-direction: column; align-items: start; gap: 4px;">
                        <span>{{ column.title }}</span>
                        <div class="flex flex-row items-center"
                            style="display: flex; flex-grow: 1; width: 100%; flex-direction: row; align-items: center; gap: 4px;"
                            v-if="isOpenFillter">
                            <a-input class="me-2" v-model:value="searchTexts[String(column.dataIndex)]" placeholder=""
                                style="flex-grow: 2; width: 100%;" @keyup.enter="onSearch" />
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
                                            :xlink:href="'#' + (currentFilterType[String(column.dataIndex)] ? currentFilterType[String(column.dataIndex)] : (column as TableColumn).isCheckBox ? 'esn' : 'ct')" />
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
    </a-modal>
</template>
<script lang="ts" setup>
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
const isOpenFillter = ref(false);
const open = ref<boolean>(false);
const searchTexts = reactive<Record<string, string>>({});
const searchType = reactive<Record<string, string>>({});
const sText = ref('');

const emit = defineEmits(['selectRow', 'search', 'loadMore']);
// #endregion

// #region PROPS
const props = defineProps<{
    _rowkey: string;
    dataSource: any[];
    pagination: any;
    columns: TableColumn[];
    title?: string;
    loading?: boolean;
}>();
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

            emit('loadMore', headerInfo, sText.value);
        }, 100);
    }
};
const showModal = async () => {
    open.value = true;
    
    await nextTick();
     setTimeout(() => {
    const tableEl = tableRef.value?.$el;
    const tableBodyEl = tableEl?.querySelector('.ant-table-body');
    if (tableBodyEl) {
        tableBodyEl.addEventListener('scroll', onScroll);
    }
     }, 100);
};
const hideModal = () => {
    open.value = false;
    const tableEl = tableRef.value?.$el;
    const tableBodyEl = tableEl?.querySelector('.ant-table-body');
    if (tableBodyEl) {
        tableBodyEl.removeEventListener('scroll', onScroll);
    }
};
const handleOk = (e: MouseEvent) => {
    hideModal();
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

    emit('search', headerInfo, sText.value.trim());
    // Scroll the table to the top when search is triggered
    const tableEl = tableRef.value?.$el;
    const tableBodyEl = tableEl?.querySelector('.ant-table-body');
    if (tableBodyEl) {
        tableBodyEl.scrollTop = 0;
    }
};

// #endregion

// #region WATCHES
watch(open, (newVal) => {
    if (newVal) {
        // Clear all searchTexts when the modal is opened
        for (const key in searchTexts) {
            if (Object.prototype.hasOwnProperty.call(searchTexts, key)) {
                searchTexts[key] = '';
            }
        }
        // Clear sText
        sText.value = '';

        // Focus on the input
        nextTick(() => {
            const inputEl = document.querySelector('input[autofocus]');
            if (inputEl) {
                inputEl.focus();
            }
        });
    }else{
        nextTick(() => {
            const inputEl = document.querySelector('input[autofocus]');
            if (inputEl) {
                inputEl.blur();
            }
        });
    }
});
// #endregion

// Expose các hàm ra ngoài
defineExpose({
    showModal,
    hideModal
});
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

:deep(.ant-modal-title) {
    font-size: 30px;
    font-weight: 600;
    color: #1a1a1a;
}
</style>
