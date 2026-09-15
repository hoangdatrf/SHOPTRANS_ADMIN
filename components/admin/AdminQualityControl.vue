<template>
  <section class="qc-page" @click="columnMenu = null">
    <nav class="qc-tabs" aria-label="Quality Control tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        type="button"
        :class="{ active: activeTab === tab.id }"
        @click="selectTab(tab.id)"
      >
        {{ tab.label }}
        <span
          v-if="tab.custom"
          class="qc-tab-x"
          title="Delete tab"
          @click.stop="removeTab(tab)"
          >&times;</span
        >
      </button>
      <button class="qc-tab-add" type="button" title="Add tab" @click="addTab">
        +
      </button>
    </nav>

    <template v-if="activeTab === 'history'">
      <div class="qc-history-filter">
        <label
          >Range<select v-model="historyFilter.range">
            <option value="today">Today</option>
            <option value="week">This week</option>
            <option value="month">This month</option>
            <option value="year">This year</option>
            <option value="lastyear">Last year</option>
            <option value="all">All</option>
          </select></label
        >
        <label>From<input v-model="historyFilter.from" type="date" /></label>
        <label>To<input v-model="historyFilter.to" type="date" /></label>
        <label
          >Dept<select v-model="historyFilter.dept">
            <option value="">All</option>
            <option v-for="dept in departments" :key="dept">{{ dept }}</option>
          </select></label
        >
        <label
          >StaffID<input
            v-model.trim="historyFilter.staffid"
            type="text"
            placeholder="ID"
        /></label>
        <label
          >StaffName<input
            v-model.trim="historyFilter.staffname"
            type="text"
            placeholder="Name"
        /></label>
        <label
          >Keyword<input
            v-model.trim="historyFilter.keyword"
            type="text"
            placeholder="match any text"
        /></label>
        <button class="qc-btn primary" type="button" @click="searchHistory">
          Search
        </button>
      </div>
      <div class="qc-tablewrap">
        <table class="qc-table history" :style="{ width: `${historyTableWidth}px`, minWidth: '100%' }">
          <colgroup>
            <col v-for="column in historyColumns" :key="column.key" :style="{ width: `${column.w}px` }" />
          </colgroup>
          <thead>
            <tr>
              <th v-for="(column, index) in historyColumns" :key="column.key" class="qc-column-head">
                {{ column.label }}
                <span class="qc-column-resizer" title="Resize column" @mousedown.stop.prevent="startHistoryColumnResize(index, $event)"></span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="6" class="qc-empty">Loading...</td>
            </tr>
            <tr v-else-if="!historySearched">
              <td colspan="6" class="qc-empty">
                Set filters and click "Search".
              </td>
            </tr>
            <tr v-else-if="!filteredHistory.length">
              <td colspan="6" class="qc-empty">
                No records match these filters.
              </td>
            </tr>
            <tr v-for="(row, index) in filteredHistory" :key="row.id">
              <td>{{ index + 1 }}</td>
              <td>{{ row.data.date }}</td>
              <td>{{ row.data.dept }}</td>
              <td>{{ row.data.staffid }}</td>
              <td>{{ row.data.staffname }}</td>
              <td class="qc-history-text">{{ row.data.history }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <template v-else>
      <div class="qc-toolbar">
        <button
          v-if="activeTab !== 'incident'"
          class="qc-btn"
          type="button"
          @click="addColumn"
        >
          + Column
        </button>
        <button class="qc-btn primary" type="button" @click="addRow">
          + Add
        </button>
        <button
          class="qc-btn danger"
          type="button"
          :disabled="!selected.size"
          @click="removeRows"
        >
          Remove
        </button>
      </div>
      <div class="qc-tablewrap">
        <table
          class="qc-table"
          :class="{ custom: activeTab !== 'incident' }"
          :style="activeTab === 'incident' ? { width: '100%' } : { width: `${customTableWidth}px`, minWidth: '100%' }"
        >
          <colgroup>
            <col :style="{ width: activeTab === 'incident' ? '2.5%' : '40px' }" />
            <col
              v-for="column in activeColumns"
              :key="column.key"
              :style="{ width: activeTab === 'incident' ? `${(column.w / incidentColumnsWidth) * 97.5}%` : `${column.w}px` }"
            />
          </colgroup>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  :checked="allSelected"
                  :disabled="!editableRows.length"
                  @change="toggleAll"
                />
              </th>
              <th
                v-for="(column, columnIndex) in activeColumns"
                :key="column.key"
                class="qc-column-head"
              >
                <span>{{ column.label }}</span>
                <button
                  v-if="activeTab !== 'incident'"
                  type="button"
                  title="Column options"
                  @click.stop="toggleColumnMenu(columnIndex)"
                >
                  ▾
                </button>
                <div v-if="columnMenu === columnIndex" class="qc-column-menu">
                  <button type="button" @click.stop="renameColumn(columnIndex)">
                    Rename
                  </button>
                  <button
                    type="button"
                    class="delete"
                    @click.stop="deleteColumn(columnIndex)"
                  >
                    Delete
                  </button>
                </div>
                <span class="qc-column-resizer" title="Resize column" @mousedown.stop.prevent="startColumnResize(columnIndex, $event)"></span>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td :colspan="activeColumns.length + 1" class="qc-empty">
                Loading...
              </td>
            </tr>
            <tr v-else-if="!rows.length">
              <td :colspan="activeColumns.length + 1" class="qc-empty">
                <i>No rows yet - click "Add".</i>
              </td>
            </tr>
            <tr
              v-for="row in displayedRows"
              :key="row.id"
              :class="{ locked: row.data.resulted }"
            >
              <td>
                <input
                  type="checkbox"
                  :disabled="row.data.resulted"
                  :checked="selected.has(row.id)"
                  @change="toggleRow(row.id)"
                />
              </td>
              <td
                v-for="column in activeColumns"
                :key="column.key"
                :class="{
                  readonly: column.readonly,
                  invalid: invalidCells.has(`${row.id}:${column.key}`),
                }"
              >
                <template v-if="column.key === 'resulted'">
                  <div class="qc-resulted">
                    <span
                      ><input
                        type="checkbox"
                        :checked="!!row.data.resulted"
                        :disabled="!!row.data.resulted"
                        @change="markResulted(row, $event)"
                      /><button
                        v-if="row.data.resulted"
                        type="button"
                        title="Edit"
                        @click="unlockRow(row)"
                      >
                        &#9998;
                      </button></span
                    >
                    <small v-if="row.data.resultedAt">{{
                      row.data.resultedAt
                    }}</small>
                  </div>
                </template>
                <div
                  v-else-if="column.readonly"
                  class="qc-readonly-cell"
                  :title="row.data[column.key] || ''"
                >
                  {{ row.data[column.key] || "" }}
                </div>
                <input
                  v-else-if="column.kind === 'date'"
                  class="qc-cell-input qc-date"
                  type="date"
                  :value="row.data[column.key] || ''"
                  :disabled="row.data.resulted || column.readonly"
                  @change="
                    updateCell(
                      row,
                      column.key,
                      ($event.target as HTMLInputElement).value,
                    )
                  "
                />
                <select
                  v-else-if="column.kind === 'staff'"
                  class="qc-cell-input qc-staff"
                  :value="row.data[column.key] || ''"
                  :disabled="row.data.resulted"
                  @change="
                    updateCell(
                      row,
                      column.key,
                      ($event.target as HTMLSelectElement).value,
                    )
                  "
                >
                  <option value="">— Staff —</option>
                  <option
                    v-for="staff in staffOptions"
                    :key="staff.value"
                    :value="staff.value"
                  >
                    {{ staff.label }}
                  </option>
                </select>
                <textarea
                  v-else
                  class="qc-cell-input qc-text"
                  rows="1"
                  :value="row.data[column.key] || ''"
                  :disabled="row.data.resulted || column.readonly"
                  @focus="growText"
                  @input="growText"
                  @blur="
                    updateCell(
                      row,
                      column.key,
                      ($event.target as HTMLTextAreaElement).value,
                    )
                  "
                ></textarea>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="qc-note" v-if="activeTab === 'incident'">
        Edit cells directly (text wraps &amp; the row grows). Fill every column
        except <b>Notes</b> before ticking <b>Resulted</b> — that locks the row
        (date-time + Staff recorded) and logs to History; the pencil unlocks
        after confirmation.
      </p>
      <p class="qc-note" v-else>
        Custom tab - edit cells directly. Use "+ Column" to extend this tab.
      </p>
    </template>
    <div v-if="message" class="qc-toast">{{ message }}</div>
    <div
      v-if="confirmDialog.open"
      class="qc-overlay"
      @mousedown.self="closeConfirm(false)"
    >
      <section
        class="qc-confirm"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="'qc-confirm-title'"
      >
        <button
          v-if="!confirmDialog.matchText && !confirmDialog.inputRequired"
          class="qc-confirm-x"
          type="button"
          aria-label="Close"
          @click="closeConfirm(false)"
        >
          &times;
        </button>
        <h2 id="qc-confirm-title">{{ confirmDialog.title }}</h2>
        <p v-if="confirmDialog.body">{{ confirmDialog.body }}</p>
        <input
          v-if="confirmDialog.matchText || confirmDialog.inputRequired"
          ref="confirmInput"
          v-model="confirmDialog.value"
          type="text"
          :class="{ uppercase: !!confirmDialog.matchText }"
          :placeholder="confirmDialog.placeholder"
          @keyup.enter="submitConfirm"
        />
        <footer>
          <button class="qc-btn" type="button" @click="closeConfirm(false)">
            {{ confirmDialog.cancelLabel }}
          </button>
          <button
            class="qc-btn"
            :class="confirmDialog.danger ? 'danger-solid' : 'primary'"
            type="button"
            :disabled="!confirmReady"
            @click="submitConfirm"
          >
            {{ confirmDialog.confirmLabel }}
          </button>
        </footer>
      </section>
    </div>
  </section>
</template>

<script setup lang="ts">
type Column = {
  key: string;
  label: string;
  w: number;
  kind?: string;
  readonly?: boolean;
  optional?: boolean;
};
type QcRecord = {
  id: string;
  country: string;
  page: string;
  kind: string;
  data: Record<string, any>;
  sortOrder?: number;
};
const props = defineProps<{
  request: (path: string, options?: any) => Promise<any>;
  currentUser?: Record<string, any> | null;
}>();
const incidentColumns: Column[] = [
  { key: "caseid", label: "CaseID", w: 118, readonly: true },
  { key: "date", label: "Date", w: 134, kind: "date" },
  { key: "staff", label: "Staff", w: 150, kind: "staff" },
  { key: "ref", label: "Ref#", w: 92 },
  { key: "client", label: "ClientCode", w: 104 },
  { key: "shipper", label: "ShipperCode", w: 112 },
  { key: "cnee", label: "CneeCode", w: 104 },
  { key: "desc", label: "Incident Description", w: 190 },
  { key: "rootcause", label: "Root Cause", w: 150 },
  { key: "solution", label: "Solution", w: 150 },
  { key: "notes", label: "Notes", w: 150, optional: true },
  { key: "resulted", label: "Resulted", w: 118 },
];
const historyColumns: Column[] = [
  { key: "order", label: "Order", w: 60 },
  { key: "date", label: "Date", w: 150 },
  { key: "dept", label: "Dept", w: 90 },
  { key: "staffid", label: "StaffID", w: 120 },
  { key: "staffname", label: "StaffName", w: 170 },
  { key: "history", label: "History", w: 620 },
];
const tabs = ref<any[]>([
  { id: "incident", label: "Incident Management" },
  { id: "history", label: "History" },
]);
const activeTab = ref("incident");
const rows = ref<QcRecord[]>([]);
const historyRows = ref<QcRecord[]>([]);
const staffOptions = ref<{ value: string; label: string }[]>([]);
const selected = ref(new Set<string>());
const loading = ref(false);
const message = ref("");
const columnMenu = ref<number | null>(null);
const columnResize = reactive({ active: false, index: -1, startX: 0, startWidth: 0, target: "active" as "active" | "history" });
const invalidCells = ref(new Set<string>());
const confirmInput = ref<HTMLInputElement | null>(null);
const confirmDialog = reactive({
  open: false,
  title: "",
  body: "",
  matchText: "",
  inputRequired: false,
  value: "",
  placeholder: "",
  confirmLabel: "Confirm",
  cancelLabel: "Cancel",
  danger: false,
  resolve: null as null | ((value: boolean) => void),
});
const confirmReady = computed(
  () =>
    (!confirmDialog.matchText ||
      confirmDialog.value.trim().toUpperCase() === confirmDialog.matchText) &&
    (!confirmDialog.inputRequired || !!confirmDialog.value.trim()),
);
const historySearched = ref(false);
const departments = ["GSD", "ECD", "ICD", "TCD", "CCD", "DCD", "FCD"];
const historyFilter = reactive({
  range: "today",
  from: "",
  to: "",
  dept: "",
  staffid: "",
  staffname: "",
  keyword: "",
});
const activeColumns = computed<Column[]>(() =>
  activeTab.value === "incident"
    ? incidentColumns
    : tabs.value.find((tab) => tab.id === activeTab.value)?.columns || [],
);
const customTableWidth = computed(
  () => 40 + activeColumns.value.reduce((total, column) => total + column.w, 0),
);
const incidentColumnsWidth = computed(() => incidentColumns.reduce((total, column) => total + column.w, 0));
const historyTableWidth = computed(() => historyColumns.reduce((total, column) => total + column.w, 0));
const displayedRows = computed(() => {
  if (activeTab.value !== "incident") return rows.value;
  return [...rows.value].sort(
    (a, b) =>
      Number(b.sortOrder || 0) - Number(a.sortOrder || 0) ||
      String(b.data.caseid || "").localeCompare(String(a.data.caseid || "")),
  );
});
const editableRows = computed(() =>
  rows.value.filter((row) => !row.data.resulted),
);
const allSelected = computed(
  () =>
    editableRows.value.length > 0 &&
    editableRows.value.every((row) => selected.value.has(row.id)),
);
const notify = (text: string) => {
  message.value = text;
  window.setTimeout(() => {
    if (message.value === text) message.value = "";
  }, 2600);
};
const askConfirm = (options: Partial<typeof confirmDialog>) =>
  new Promise<boolean>((resolve) => {
    Object.assign(
      confirmDialog,
      {
        open: true,
        title: "",
        body: "",
        matchText: "",
        inputRequired: false,
        value: "",
        placeholder: "",
        confirmLabel: "Confirm",
        cancelLabel: "Cancel",
        danger: false,
      },
      options,
      { resolve },
    );
    nextTick(() => confirmInput.value?.focus());
  });
const closeConfirm = (result: boolean) => {
  const resolve = confirmDialog.resolve;
  confirmDialog.open = false;
  confirmDialog.resolve = null;
  resolve?.(result);
};
const submitConfirm = () => {
  if (confirmReady.value) closeConfirm(true);
};
const askText = async (
  title: string,
  placeholder: string,
  confirmLabel: string,
  initial = "",
) => {
  const accepted = await askConfirm({
    title,
    inputRequired: true,
    value: initial,
    placeholder,
    confirmLabel,
    cancelLabel: "Cancel",
  });
  return accepted ? confirmDialog.value.trim() : "";
};
const growText = (event: Event) => {
  const field = event.target as HTMLTextAreaElement;
  field.style.height = "42px";
  field.style.height = `${Math.max(42, field.scrollHeight)}px`;
};
const nowText = () => new Date().toLocaleString("en-GB", { hour12: false });
const userName = () =>
  props.currentUser?.name ||
  props.currentUser?.fullName ||
  props.currentUser?.email ||
  "";
const pageKey = () =>
  activeTab.value === "incident"
    ? "quality_incident"
    : `quality_custom_${activeTab.value}`;
const unwrap = (result: any) =>
  result?.items ? result : result?.data || result || {};
const loadConfig = async () => {
  const result = unwrap(
    await props.request("/records?country=GLOBAL&page=quality_tabs&limit=1000"),
  );
  const custom = (result.items || [])
    .map((row: any) => ({
      ...row.data,
      columns: (row.data?.columns || []).map((column: any) => ({
        ...column,
        w: Number(column.w) || 170,
      })),
      recordId: row.id,
      custom: true,
    }))
    .filter((tab: any) => tab.id && tab.label);
  tabs.value = [
    { id: "incident", label: "Incident Management" },
    { id: "history", label: "History" },
    ...custom,
  ];
};
const loadStaff = async () => {
  const result = unwrap(
    await props.request(
      "/records?country=GLOBAL&page=internal_staff&limit=1000",
    ),
  );
  staffOptions.value = (result.items || [])
    .map((row: any) => {
      const data = row.data || {};
      const value = String(
        data.staffid || data.fullname || data.nickname || "",
      ).trim();
      const name = String(data.fullname || data.nickname || value).trim();
      return {
        value,
        label: value && name !== value ? `${value} - ${name}` : name,
      };
    })
    .filter((item: any) => item.value);
};
const loadRows = async () => {
  loading.value = true;
  selected.value = new Set();
  try {
    if (activeTab.value === "history") {
      const result = unwrap(
        await props.request(
          "/records?country=GLOBAL&page=quality_history&limit=5000",
        ),
      );
      historyRows.value = result.items || [];
    } else {
      const result = unwrap(
        await props.request(
          `/records?country=GLOBAL&page=${encodeURIComponent(pageKey())}&limit=5000`,
        ),
      );
      rows.value = result.items || [];
    }
  } finally {
    loading.value = false;
  }
};
const selectTab = async (id: string) => {
  if (activeTab.value === id) return;
  activeTab.value = id;
  columnMenu.value = null;
  historySearched.value = false;
  if (id === "history") {
    historyRows.value = [];
    return;
  }
  await loadRows();
};
const searchHistory = async () => {
  historySearched.value = true;
  await loadRows();
};
const nextCaseId = () => {
  const d = new Date();
  const stamp = [
    d.getDate(),
    d.getMonth() + 1,
    String(d.getFullYear()).slice(-2),
  ]
    .map((v) => String(v).padStart(2, "0"))
    .join("");
  const prefix = `CS_${stamp}_`;
  const max = rows.value.reduce(
    (n, row) =>
      Math.max(
        n,
        String(row.data.caseid || "").startsWith(prefix)
          ? Number(String(row.data.caseid).slice(prefix.length)) || 0
          : 0,
      ),
    0,
  );
  return `${prefix}${String(max + 1).padStart(2, "0")}`;
};
const log = async (history: string) =>
  props.request("/records", {
    method: "POST",
    body: {
      country: "GLOBAL",
      page: "quality_history",
      kind: "quality-control",
      data: {
        date: nowText(),
        dept: props.currentUser?.department || "",
        staffid:
          props.currentUser?.staffId || props.currentUser?.username || "",
        staffname: userName(),
        history,
      },
      sortOrder: 0,
    },
  });
const addRow = async () => {
  const data: Record<string, any> =
    activeTab.value === "incident"
      ? {
          caseid: nextCaseId(),
          date: new Date().toISOString().slice(0, 10),
          staff: "",
          resulted: false,
        }
      : {};
  await props.request("/records", {
    method: "POST",
    body: {
      country: "GLOBAL",
      page: pageKey(),
      kind: "quality-control",
      data,
      sortOrder: rows.value.length + 1,
    },
  });
  if (activeTab.value === "incident")
    await log(`Created incident ${data.caseid}`);
  await loadRows();
};
const patchRow = (row: QcRecord) =>
  props.request(`/records/${row.id}`, {
    method: "PATCH",
    body: {
      country: row.country,
      page: row.page,
      kind: row.kind,
      data: row.data,
      sortOrder: row.sortOrder || 0,
    },
  });
const updateCell = async (row: QcRecord, key: string, value: any) => {
  if (row.data.resulted) return;
  const previous = row.data[key];
  row.data[key] = value;
  const next = new Set(invalidCells.value);
  if (String(value || "").trim()) next.delete(`${row.id}:${key}`);
  invalidCells.value = next;
  const compareKeys = activeColumns.value
    .filter((column) => !column.readonly && column.key !== "resulted" && column.key !== "notes")
    .map((column) => column.key);
  const complete = compareKeys.length > 0 && compareKeys.every((columnKey) => String(row.data[columnKey] ?? "").trim());
  const duplicate = complete && rows.value.some((item) => item.id !== row.id && compareKeys.every((columnKey) => String(item.data[columnKey] ?? "").trim().toUpperCase() === String(row.data[columnKey] ?? "").trim().toUpperCase()));
  if (duplicate) {
    row.data[key] = previous;
    notify("Duplicate data already exists in this tab");
    return;
  }
  await patchRow(row);
};
const missingRequired = (row: QcRecord) =>
  incidentColumns.filter(
    (column) =>
      !column.readonly &&
      !column.optional &&
      column.key !== "resulted" &&
      !String(row.data[column.key] || "").trim(),
  );
const markResulted = async (row: QcRecord, event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.checked) return;
  const missing = missingRequired(row);
  if (missing.length) {
    input.checked = false;
    invalidCells.value = new Set(
      missing.map((column) => `${row.id}:${column.key}`),
    );
    notify("Fill every column except Notes before marking Resulted");
    return;
  }
  invalidCells.value = new Set();
  row.data.resulted = true;
  row.data.resultedAt = nowText();
  row.data.resultedBy = userName();
  selected.value.delete(row.id);
  await patchRow(row);
  await log(`Marked Resulted ${row.data.caseid}`);
  notify(`Locked ${row.data.caseid}`);
};
const unlockRow = async (row: QcRecord) => {
  if (
    !(await askConfirm({
      title: "Are you sure to edit?",
      confirmLabel: "YES",
      cancelLabel: "NO",
      danger: true,
    }))
  )
    return;
  row.data.resulted = false;
  row.data.resultedAt = "";
  await patchRow(row);
  await log(`Edited incident ${row.data.caseid}`);
  notify(`Unlocked ${row.data.caseid}`);
};
const toggleRow = (id: string) => {
  const next = new Set(selected.value);
  next.has(id) ? next.delete(id) : next.add(id);
  selected.value = next;
};
const toggleAll = () => {
  selected.value = allSelected.value
    ? new Set()
    : new Set(editableRows.value.map((row) => row.id));
};
const removeRows = async () => {
  const removing = rows.value.filter(
    (row) => selected.value.has(row.id) && !row.data.resulted,
  );
  if (!removing.length) return;
  const confirmed = await askConfirm({
    title: `Remove ${removing.length} row(s)`,
    body: "This action cannot be undone.",
    matchText: "REMOVE",
    placeholder: "TYPE REMOVE TO DELETE",
    confirmLabel: "Delete",
    cancelLabel: "Cancel",
    danger: true,
  });
  if (!confirmed) return;
  for (const row of removing) {
    await props.request(`/records/${row.id}`, { method: "DELETE" });
    if (activeTab.value === "incident")
      await log(`Removed incident ${row.data.caseid}`);
  }
  await loadRows();
  notify(`Removed ${removing.length} row(s)`);
};
const addTab = async () => {
  const label = await askText("New tab", "Tab name", "Add");
  if (!label) return;
  if (tabs.value.some((tab) => String(tab.label).trim().toUpperCase() === label.trim().toUpperCase())) {
    notify("A tab with this name already exists");
    return;
  }
  const id = `t_${Date.now().toString(36)}`;
  const columns = [
    { key: "c1", label: "Column 1", w: 170 },
    { key: "c2", label: "Column 2", w: 170 },
    { key: "c3", label: "Notes", w: 170 },
  ];
  await props.request("/records", {
    method: "POST",
    body: {
      country: "GLOBAL",
      page: "quality_tabs",
      kind: "quality-control-config",
      data: { id, label, columns },
      sortOrder: tabs.value.length,
    },
  });
  await loadConfig();
  await selectTab(id);
};
const removeTab = async (tab: any) => {
  const confirmed = await askConfirm({
    title: `Delete tab "${tab.label}"?`,
    body: "All rows in this tab will be permanently deleted.",
    matchText: "DELETE",
    placeholder: "TYPE DELETE TO CONFIRM",
    confirmLabel: "Delete",
    cancelLabel: "Cancel",
    danger: true,
  });
  if (!confirmed) return;
  const result = unwrap(
    await props.request(
      `/records?country=GLOBAL&page=${encodeURIComponent(`quality_custom_${tab.id}`)}&limit=5000`,
    ),
  );
  for (const row of result.items || [])
    await props.request(`/records/${row.id}`, { method: "DELETE" });
  if (tab.recordId)
    await props.request(`/records/${tab.recordId}`, { method: "DELETE" });
  await loadConfig();
  await selectTab("incident");
};
const resizeMove = (event: MouseEvent) => {
  if (!columnResize.active) return;
  const column = (columnResize.target === "history" ? historyColumns : activeColumns.value)[columnResize.index];
  if (column) column.w = Math.max(70, columnResize.startWidth + event.clientX - columnResize.startX);
};
const resizeEnd = async () => {
  if (!columnResize.active) return;
  columnResize.active = false;
  window.removeEventListener("mousemove", resizeMove);
  window.removeEventListener("mouseup", resizeEnd);
  const tab = tabs.value.find((item) => item.id === activeTab.value);
  if (columnResize.target === "history" && import.meta.client) localStorage.setItem("shoptrans_qc_history_widths", JSON.stringify(historyColumns.map((column) => column.w)));
  else if (tab?.custom) await saveCustomTab(tab);
  else if (import.meta.client) localStorage.setItem("shoptrans_qc_incident_widths", JSON.stringify(incidentColumns.map((column) => column.w)));
};
const startColumnResize = (index: number, event: MouseEvent) => {
  const column = activeColumns.value[index];
  if (!column) return;
  columnResize.active = true;
  columnResize.index = index;
  columnResize.startX = event.clientX;
  columnResize.startWidth = column.w;
  columnResize.target = "active";
  window.addEventListener("mousemove", resizeMove);
  window.addEventListener("mouseup", resizeEnd);
};
const startHistoryColumnResize = (index: number, event: MouseEvent) => {
  const column = historyColumns[index];
  if (!column) return;
  columnResize.active = true;
  columnResize.index = index;
  columnResize.startX = event.clientX;
  columnResize.startWidth = column.w;
  columnResize.target = "history";
  window.addEventListener("mousemove", resizeMove);
  window.addEventListener("mouseup", resizeEnd);
};
const addColumn = async () => {
  const label = await askText("Add column", "Column name", "Add");
  if (!label) return;
  const tab = tabs.value.find((item) => item.id === activeTab.value);
  if (!tab) return;
  tab.columns = [
    ...(tab.columns || []),
    { key: `c_${Date.now().toString(36)}`, label, w: 160 },
  ];
  await props.request(`/records/${tab.recordId}`, {
    method: "PATCH",
    body: {
      country: "GLOBAL",
      page: "quality_tabs",
      kind: "quality-control-config",
      data: { id: tab.id, label: tab.label, columns: tab.columns },
      sortOrder: 0,
    },
  });
};
const saveCustomTab = async (tab: any) => {
  await props.request(`/records/${tab.recordId}`, {
    method: "PATCH",
    body: {
      country: "GLOBAL",
      page: "quality_tabs",
      kind: "quality-control-config",
      data: { id: tab.id, label: tab.label, columns: tab.columns },
      sortOrder: 0,
    },
  });
};
const toggleColumnMenu = (index: number) => {
  columnMenu.value = columnMenu.value === index ? null : index;
};
const renameColumn = async (index: number) => {
  const tab = tabs.value.find((item) => item.id === activeTab.value);
  const column = tab?.columns?.[index];
  if (!tab || !column) return;
  columnMenu.value = null;
  const label = await askText(
    "Rename column",
    column.label,
    "Rename",
    column.label,
  );
  if (!label) return;
  column.label = label;
  await saveCustomTab(tab);
  notify("Column renamed");
};
const deleteColumn = async (index: number) => {
  const tab = tabs.value.find((item) => item.id === activeTab.value);
  const column = tab?.columns?.[index];
  if (!tab || !column) return;
  columnMenu.value = null;
  if (
    !(await askConfirm({
      title: `Delete column \"${column.label}\"?`,
      confirmLabel: "YES",
      cancelLabel: "NO",
      danger: true,
    }))
  )
    return;
  tab.columns.splice(index, 1);
  rows.value.forEach((row) => {
    delete row.data[column.key];
  });
  await saveCustomTab(tab);
  for (const row of rows.value) await patchRow(row);
  notify("Column deleted");
};
const inRange = (row: QcRecord) => {
  const raw = String(row.data.date || "");
  const parts = raw.match(/(\d{2})\/(\d{2})\/(\d{4})/);
  const date = parts
    ? new Date(`${parts[3]}-${parts[2]}-${parts[1]}T00:00:00`)
    : new Date(raw);
  if (Number.isNaN(date.getTime())) return historyFilter.range === "all";
  if (historyFilter.from && date < new Date(`${historyFilter.from}T00:00:00`))
    return false;
  if (historyFilter.to && date > new Date(`${historyFilter.to}T23:59:59`))
    return false;
  if (historyFilter.from || historyFilter.to || historyFilter.range === "all")
    return true;
  const now = new Date();
  if (historyFilter.range === "today")
    return date.toDateString() === now.toDateString();
  if (historyFilter.range === "month")
    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  if (historyFilter.range === "year")
    return date.getFullYear() === now.getFullYear();
  if (historyFilter.range === "lastyear")
    return date.getFullYear() === now.getFullYear() - 1;
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  const next = new Date(monday);
  next.setDate(monday.getDate() + 7);
  return date >= monday && date < next;
};
const filteredHistory = computed(() =>
  historyRows.value
    .filter((row) => {
      const data = row.data || {};
      if (!inRange(row)) return false;
      if (historyFilter.dept && data.dept !== historyFilter.dept) return false;
      if (
        historyFilter.staffid &&
        !String(data.staffid || "")
          .toLowerCase()
          .includes(historyFilter.staffid.toLowerCase())
      )
        return false;
      if (
        historyFilter.staffname &&
        !String(data.staffname || "")
          .toLowerCase()
          .includes(historyFilter.staffname.toLowerCase())
      )
        return false;
      return (
        !historyFilter.keyword ||
        JSON.stringify(data)
          .toLowerCase()
          .includes(historyFilter.keyword.toLowerCase())
      );
    })
    .sort((a, b) =>
      String(b.data.date || "").localeCompare(String(a.data.date || "")),
    ),
);
onMounted(async () => {
  if (import.meta.client) {
    try {
      const widths = JSON.parse(localStorage.getItem("shoptrans_qc_incident_widths") || "[]");
      if (Array.isArray(widths)) widths.forEach((width, index) => { if (incidentColumns[index] && Number(width) >= 70) incidentColumns[index].w = Number(width); });
      const historyWidths = JSON.parse(localStorage.getItem("shoptrans_qc_history_widths") || "[]");
      if (Array.isArray(historyWidths)) historyWidths.forEach((width, index) => { if (historyColumns[index] && Number(width) >= 70) historyColumns[index].w = Number(width); });
    } catch (_) {}
  }
  await Promise.all([loadConfig(), loadStaff()]);
  await loadRows();
});
onBeforeUnmount(() => {
  window.removeEventListener("mousemove", resizeMove);
  window.removeEventListener("mouseup", resizeEnd);
});
</script>

<style scoped>
.qc-page {
  height: 100vh;
  min-width: 0;
  overflow: auto;
  scrollbar-gutter: stable;
  background: #f5faf6;
  color: #16241c;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial,
    sans-serif;
  font-size: 13px;
  line-height: 1.35;
}
.qc-tabs {
  display: flex;
  gap: 0;
  overflow-x: auto;
  border-bottom: 1px solid #c4e6d1;
  background: #f5faf6;
}
.qc-tabs > button {
  position: relative;
  flex: 0 0 auto;
  min-height: 38px;
  padding: 0 17px;
  border: 0;
  border-bottom: 2px solid transparent;
  background: transparent;
  color: #426052;
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}
.qc-tabs > button.active {
  border-bottom-color: #22a155;
  color: #007d3e;
}
.qc-tabs .qc-tab-add {
  color: #008f4c;
  font-size: 16px;
}
.qc-tab-x {
  margin-left: 7px;
  color: #7b8e83;
  font-size: 10px;
}
.qc-toolbar {
  display: flex;
  gap: 8px;
  padding: 14px 16px 10px;
}
.qc-btn {
  height: 30px;
  padding: 0 14px;
  border: 1px solid #c4e6d1;
  border-radius: 7px;
  background: #fff;
  color: #15532f;
  font: inherit;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  transition:
    background-color 0.15s,
    border-color 0.15s,
    color 0.15s;
}
.qc-btn:hover:not(:disabled) {
  background: #f0f8f3;
}
.qc-btn.primary {
  background: #116b3b;
  border-color: #116b3b;
  color: #fff;
}
.qc-btn.primary:hover:not(:disabled) {
  border-color: #123d28;
  background: #123d28;
}
.qc-btn.danger {
  border-color: #efc9c4;
  color: #d57369;
}
.qc-btn.danger:hover:not(:disabled) {
  border-color: #cf3b2e;
  background: #fff0ee;
  color: #b82d24;
}
.qc-btn.danger-solid {
  border-color: #c7352a;
  background: #c7352a;
  color: #fff;
}
.qc-btn.danger-solid:hover:not(:disabled) {
  border-color: #a92b23;
  background: #a92b23;
}
.qc-btn:disabled {
  opacity: 0.48;
  cursor: not-allowed;
}
.qc-tablewrap {
  margin: 0 16px;
  min-height: 86px;
  overflow: auto;
  scrollbar-gutter: stable;
  border: 1px solid #c4e6d1;
  border-radius: 10px;
  background: #fff;
}
.qc-tablewrap:has(.qc-table.custom) { overflow: auto; }
.qc-table {
  width: 100%;
  min-width: 0;
  border-collapse: separate;
  border-spacing: 0;
  table-layout: fixed;
  font-size: 12.5px;
}
.qc-table th {
  height: 35px;
  padding: 0 8px;
  border-right: 1px solid #dcefe3;
  border-bottom: 1px solid #c4e6d1;
  background: #eaf6ee;
  color: #15532f;
  font-family: inherit;
  font-size: 11.5px;
  font-weight: 700;
  line-height: 1.35;
  text-align: center;
  white-space: nowrap;
}
.qc-column-head {
  position: relative;
}
.qc-column-resizer{position:absolute;top:0;right:-3px;z-index:4;width:7px;height:100%;cursor:col-resize;user-select:none}
.qc-column-resizer:hover{background:rgba(34,161,85,.28)}
.qc-column-head > button {
  margin-left: 2px;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: #1b7a43;
  font: inherit;
  cursor: pointer;
}
.qc-column-head > button:hover {
  background: rgba(27, 122, 67, 0.12);
}
.qc-column-menu {
  position: absolute;
  z-index: 20;
  top: calc(100% + 3px);
  right: 4px;
  display: flex;
  min-width: 118px;
  flex-direction: column;
  padding: 4px;
  border: 1px solid #c4e6d1;
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
}
.qc-column-menu button {
  border: 0;
  border-radius: 6px;
  background: transparent;
  padding: 7px 10px;
  color: #16241c;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial,
    sans-serif;
  font-size: 12.5px;
  font-weight: 400;
  line-height: 1.35;
  text-align: left;
  cursor: pointer;
}
.qc-column-menu button:hover {
  background: #f0f8f3;
}
.qc-column-menu button.delete {
  color: #cf3b2e;
}
.qc-table th:first-child,
.qc-table td:first-child {
  width: 40px;
}
.qc-table:not(.custom):not(.history) th:nth-child(2) {
  width: 7%;
}
.qc-table:not(.custom):not(.history) th:nth-child(3) {
  width: 9%;
}
.qc-table:not(.custom):not(.history) th:nth-child(4) {
  width: 10%;
}
.qc-table:not(.custom):not(.history) th:nth-child(5) {
  width: 6%;
}
.qc-table:not(.custom):not(.history) th:nth-child(6) {
  width: 7%;
}
.qc-table:not(.custom):not(.history) th:nth-child(7) {
  width: 8%;
}
.qc-table:not(.custom):not(.history) th:nth-child(8) {
  width: 7%;
}
.qc-table:not(.custom):not(.history) th:nth-child(9) {
  width: 14%;
}
.qc-table:not(.custom):not(.history) th:nth-child(10) {
  width: 10%;
}
.qc-table:not(.custom):not(.history) th:nth-child(11) {
  width: 10%;
}
.qc-table:not(.custom):not(.history) th:nth-child(12) {
  width: 10%;
}
.qc-table:not(.custom):not(.history) th:nth-child(13) {
  width: 8%;
}
.qc-table td {
  min-height: 36px;
  padding: 0;
  border-right: 1px solid #f0f5f2;
  border-bottom: 1px solid #edf3ef;
  text-align: center;
  vertical-align: middle;
}
.qc-table tbody tr:hover td {
  background: #f6fbf8;
}
.qc-table tr.locked td {
  background: #f2f6f4;
  color: #5d7567;
}
.qc-table input[type="checkbox"] {
  width: 16px;
  height: 16px;
  accent-color: #1b7a43;
  cursor: pointer;
}
.qc-cell-input {
  display: block;
  width: 100%;
  min-height: 36px;
  box-sizing: border-box;
  border: 0;
  background: transparent;
  padding: 6px;
  color: #16241c;
  font: inherit;
  font-size: 12px;
  text-align: center;
  outline: none;
}
.qc-cell-input:focus {
  box-shadow: inset 0 0 0 2px #35b66a;
  background: #fff;
}
.qc-readonly-cell {
  overflow: hidden;
  padding: 6px 8px;
  color: #16241c;
  font-family: ui-monospace, Menlo, monospace;
  font-size: 12px;
  font-weight: 700;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.qc-date,
.qc-staff {
  width: calc(100% - 12px);
  min-height: 30px;
  height: 30px;
  margin: 3px 6px;
  border: 1px solid #c4e6d1;
  border-radius: 5px;
  background: #fff;
  padding: 0 6px;
}
.qc-staff {
  box-sizing: border-box;
  width: calc(100% - 12px);
  height: 31px;
  min-height: 31px;
  margin: 3px 6px;
  border: 1px solid #c4e6d1;
  border-radius: 6px;
  background: #fff;
  padding: 5px 6px;
  color: #16241c;
  font-family: inherit;
  font-size: 12px;
  line-height: normal;
  text-align: left;
  cursor: pointer;
}
.qc-staff:focus {
  border-color: #35b66a;
  box-shadow: inset 0 0 0 2px #35b66a;
}
.qc-staff:disabled {
  background: #f2f6f4;
  color: #5d7567;
  cursor: default;
}
.qc-text {
  resize: none;
  overflow: hidden;
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.4;
  text-align: left;
}
.qc-table td:nth-child(2) .qc-text {
  font-family: ui-monospace, Menlo, monospace;
  font-weight: 700;
  color: #1b7a43;
  text-align: center;
}
.qc-table td.readonly,
.qc-cell-input:disabled {
  color: #5d7567;
  background: #f2f6f4;
}
.qc-table td.invalid {
  background: #fff1ef;
}
.qc-table td.invalid .qc-cell-input {
  box-shadow: inset 0 0 0 2px #cf3b2e;
  background: #fff;
}
.qc-resulted {
  display: flex;
  min-height: 36px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
}
.qc-resulted span {
  display: flex;
  align-items: center;
  gap: 6px;
}
.qc-resulted button {
  display: inline-flex;
  border: 0;
  background: none;
  color: #e67e22;
  cursor: pointer;
  font-size: 15px;
  line-height: 1;
}
.qc-resulted small {
  color: #5d7567;
  font-family: ui-monospace, Menlo, monospace;
  font-size: 9.5px;
  white-space: nowrap;
}
.qc-empty {
  height: 52px !important;
  color: #7b8e83;
  font-family: inherit;
  font-size: 12.5px;
  font-style: italic;
  line-height: 1.35;
}
.qc-note {
  margin: 8px 16px;
  color: #5d7567;
  font-size: 11.5px;
}
.qc-history-filter {
  display: flex;
  align-items: flex-end;
  flex-wrap: nowrap;
  gap: 8px;
  padding: 12px 16px;
  overflow-x: auto;
}
.qc-history-filter label {
  display: flex;
  flex: 0 0 auto;
  flex-direction: row;
  align-items: center;
  gap: 5px;
  color: #15532f;
  font-size: 12px;
  font-weight: 400;
}
.qc-history-filter input,
.qc-history-filter select {
  height: 30px;
  box-sizing: border-box;
  border: 1px solid #c4e6d1;
  border-radius: 7px;
  background: #fff;
  padding: 0 9px;
  font: inherit;
  font-size: 12.5px;
  color: #16241c;
}
.qc-table.history {
  min-width: 0;
}
.qc-table.history th:nth-child(1) {
  width: 60px;
}
.qc-table.history th:nth-child(2) {
  width: 150px;
}
.qc-table.history th:nth-child(3) {
  width: 90px;
}
.qc-table.history th:nth-child(4) {
  width: 120px;
}
.qc-table.history th:nth-child(5) {
  width: 170px;
}
.qc-table.history td {
  height: 38px;
  padding: 6px 8px;
}
.qc-history-text {
  text-align: left !important;
}
.qc-toast {
  position: fixed;
  z-index: 10020;
  left: 50%;
  bottom: 20px;
  transform: translateX(-50%);
  border-radius: 8px;
  background: #123d28;
  color: #fff;
  padding: 10px 16px;
  font-size: 12.5px;
  font-weight: 600;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
}
.qc-overlay {
  position: fixed;
  z-index: 10010;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(10, 30, 18, 0.42);
}
.qc-confirm {
  position: relative;
  width: 390px;
  max-width: 92vw;
  overflow: hidden;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.3);
}
.qc-confirm h2 {
  margin: 0;
  padding: 16px 18px 4px;
  color: #15532f;
  font-size: 15px;
  font-weight: 750;
}
.qc-confirm p {
  margin: 0;
  padding: 4px 18px 10px;
  color: #5d7567;
  font-size: 13px;
  line-height: 1.5;
}
.qc-confirm > input {
  display: block;
  width: calc(100% - 36px);
  height: 38px;
  box-sizing: border-box;
  margin: 4px 18px 12px;
  border: 1px solid #c4e6d1;
  border-radius: 7px;
  padding: 0 10px;
  color: #16241c;
  font: inherit;
  outline: none;
}
.qc-confirm > input.uppercase {
  text-transform: uppercase;
}
.qc-confirm > input:focus {
  box-shadow: inset 0 0 0 2px #35b66a;
}
.qc-confirm footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid #c4e6d1;
  background: #f0f8f3;
}
.qc-confirm footer .qc-btn {
  min-width: 68px;
}
.qc-confirm footer .qc-btn.danger-solid:disabled {
  border-color: #edcfc9;
  background: #fff;
  color: #dfa39a;
  opacity: 1;
}
.qc-confirm-x {
  position: absolute;
  z-index: 1;
  top: 10px;
  right: 10px;
  width: 25px;
  height: 25px;
  border: 0;
  border-radius: 50%;
  background: #c7352a;
  color: #fff;
  font-size: 20px;
  line-height: 23px;
  cursor: pointer;
}
@media (max-width: 900px) {
  .qc-tablewrap {
    overflow-x: auto;
  }
  .qc-table:not(.history) {
    min-width: 1180px;
  }
}
@media (max-width: 700px) {
  .qc-page {
    height: 100dvh;
  }
  .qc-toolbar,
  .qc-history-filter {
    padding: 8px;
  }
  .qc-tablewrap {
    margin: 0 8px;
  }
  .qc-note {
    margin: 8px;
  }
  .qc-history-filter label {
    flex: 0 0 auto;
  }
  .qc-table.history {
    min-width: 760px;
  }
  .qc-overlay {
    padding: 12px;
  }
}
</style>
