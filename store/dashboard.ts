import { defineStore } from "pinia";
import { useAxios } from "~/composables/axios";
import dayjs from 'dayjs'
// Cấu hình dayjs sử dụng locale tiếng Việt
dayjs.locale('vi')


export const useDashboardStore = defineStore("dashboard", {
    state: () => ({
        SoCvTheoLich: 0,
        SoCvHoanThanhTheoLich: 0,
        PhanTramCvHoanThanhTheoLich: 0,
        SoCvSCDX: 0,
        SoCvHoanThanhSCDX: 0,
        PhanTramCvSCDX: 0,
        PTKeHoachThang: 0,
        PTKeHoachQuy: 0,
        PTKeHoachNam: 0,
        //
        baoduong: [],
        loadingBaoDuong: false,
        suachua: [],
        loadingSuachua: false,
        vattu: [],
        loadingVattu: false,
        vantai: [],
        loadingVantai: false,
        //
        chartPhieuCVByPX: [],
        loadingChartPhieuCVByPX: false,
        chartPhieuCVSCDXByPX: [],
        loadingChartPhieuCVSCDXByPX: false,
        chartStackByDanhGiaMucDo: [],
        loadingChartStackByDanhGiaMucDo: false,
        chartNhuCauNhanCongTheoDonVi: [],
        loadingChartNhuCauNhanCongTheoDonVi: false,
        ////////////////////////////////////////////////
        // #region Tab Asset
        soLuongThietBiDangHoatDong: 0,
        soLuongThietBiDangSuaChua: 0,
        soLuongThietBiSapDenHanSuaChua: 0,
        soLuongThietBiYeuCauSuaChua: 0,
        soLuongPhuongTienDangHoatDong: 0,
        nhienLieuTieuThuTrongNgay: 0,
        chartTieuHaoNhienLieuPhuongTienVanTai: [],
        chartChiPhiBaoTriThietBi: [],
        // #endregion
        ////////////////////////////////////////////////
        // #region Tab Part
        soLuongVatTuRiengBiet: 0,
        chiPhiVatTuTheoDonVi: 0,
        tonKhoChinhXac: 0,
        yeuCauVatTuTrongNgay: 0,
        chiPhiVatTuTrongNgay: 0,
        chartThongKeVatTuTieuHao: [],
        chartChiPhiBaoDuong: [],
        yeuCauVatTuChuaDuyet: 0,
        chartDeXuatNhuCauMuaSam: [],
        chartChiPhiSuaChuaDotXuat: [],
        // #endregion

        // #region Tab Work
        chartDanhGiaMucDoSuaChuaDotXuat: [],
        chartCongViecSuaChuaDotXuat: [],
        // #endregion   

        // #region Modal
        objCode: {
            data: [] as any[],
            pagination: {} as any,
        } as any,
        evtCode: {
            data: [] as any[],
            pagination: {} as any,
        } as any,
        depts: [] as any[],
        orgs: [] as any[],
        // #endregion

        // #region Chart static data
        chartData: {} as any,
        chartOptions: {} as any,
        // #endregion
    }),
    actions: {
        async getDashboardKPIData() {
            try {
                const axios = useAxios();
                let url = `/api/Dashboard/getkpi`;
                const response = await axios.get(url);
                console.log(response.data);
                this.SoCvTheoLich = response.data.asset.SoCvTheoLich;
                this.SoCvHoanThanhTheoLich = response.data.asset.SoCvHoanThanhTheoLich;
                this.PhanTramCvHoanThanhTheoLich = response.data.asset.PhanTramCvHoanThanhTheoLich;
                this.SoCvSCDX = response.data.asset.SoCvSCDX;
                this.SoCvHoanThanhSCDX = response.data.asset.SoCvHoanThanhSCDX;
                this.PhanTramCvSCDX = response.data.asset.PhanTramCvSCDX;
                //
                this.PTKeHoachThang = response.data.asset.PTCVTheoThang;
                this.PTKeHoachQuy = response.data.asset.PTCVTheoQuy;
                this.PTKeHoachNam = response.data.asset.PTCVTheoNam;
            } catch (error) {
                console.error("Failed to fetch dashboard KPI data:", error);
            }
        },
        async getBaoDuongInbox() {
            try {
                this.loadingBaoDuong = true;
                const axios = useAxios();
                let url = `/api/Dashboard/getinbox?type=MNT`;
                let url1 = `/api/Dashboard/getinbox?type=OPER`;
                const response = await axios.get(url);
                const response1 = await axios.get(url1);
                // this.baoduong = response.data;
                // this.suachua = response1.data;
                this.baoduong = [...response.data, ...response1.data];
            } catch (error) {
                console.error("Failed to fetch dashboard Inbox data:", error);
            } finally {
                this.loadingBaoDuong = false;
            }
        },
        async getSuaChuaInbox() {
            try {
                this.loadingSuachua = true;
                const axios = useAxios();
                let url = `/api/Dashboard/getinbox?type=OPER`;
                const response = await axios.get(url);
                this.suachua = response.data;
            } catch (error) {
                console.error("Failed to fetch dashboard Inbox data:", error);
            } finally {
                this.loadingSuachua = false;
            }
        },
        async getVatTuInbox() {
            try {
                this.loadingVattu = true;
                const axios = useAxios();
                let url = `/api/Dashboard/getinbox?type=MNG`;
                const response = await axios.get(url);
                console.log(response.data);
                this.vattu = response.data;
            } catch (error) {
                console.error("Failed to fetch dashboard Inbox data:", error);
            } finally {
                this.loadingVattu = false;
            }
        },
        async getVanTaiInbox() {
            try {
                this.loadingVantai = true;
                const axios = useAxios();
                let url = `/api/Dashboard/getinbox?type=MNG`; // Needfixing
                const response = await axios.get(url);
                console.log(response.data);
                this.vantai = [
                    {
                        id: 1,
                        description: "Số lượng phương tiện đang hoạt động",
                        count: 300
                    },
                    {
                        id: 2,
                        description: "Số lượng phương tiện đang ngưng hoạt động",
                        count: 20
                    },
                    {
                        id: 3,
                        description: "Số lượng phương tiện đang sửa chữa",
                        count: 10
                    },
                    {
                        id: 4,
                        description: "Số lượng phương tiện đang bảo dưỡng",
                        count: 10
                    },
                ];
            } catch (error) {
                console.error("Failed to fetch dashboard Inbox data:", error);
            } finally {
                this.loadingVantai = false;
            }
        },
        // Chart
        async getPhieuCVByPX(timeParam: string, departmentParam: string, fromToDate: [any, any], orgParam: string) {
            try {
                console.log(timeParam, departmentParam, fromToDate, orgParam);
                const axios = useAxios();
                let url = `/api/Dashboard/ChartPhieuCVByPX?type=${timeParam == "M" ? "monthly" : timeParam == "Q" ? "quarterly" : "yearly"}&startDate=${fromToDate[0].format('YYYY-MM-DD')}&endDate=${fromToDate[1].format('YYYY-MM-DD')}&org=${orgParam}`;
                const response = await axios.get(url);
                this.chartPhieuCVByPX = response.data.chart;
                return response.data;
            } catch (error) {
                console.error("Failed to fetch dashboard PhieuCV data:", error);
            }
        },
        async getPhieuCVSCDXByPX(timeParam: string, departmentParam: string, fromToDate: [any, any], orgParam: string) {
            try {
                console.log(timeParam, departmentParam, fromToDate, orgParam);
                const axios = useAxios();
                let url = `/api/Dashboard/ChartPhieuCVSCDXByPX?type=${timeParam == "M" ? "monthly" : timeParam == "Q" ? "quarterly" : "yearly"}&startDate=${fromToDate[0].format('YYYY-MM-DD')}&endDate=${fromToDate[1].format('YYYY-MM-DD')}&org=${orgParam}`;
                const response = await axios.get(url);
                this.chartPhieuCVSCDXByPX = response.data.chart;
                return response.data;
            } catch (error) {
                console.error("Failed to fetch dashboard PhieuCV data:", error);
            }
        },
        async getChartStackByDanhGiaMucDo(timeParam: string, departmentParam: string, fromToDate: [any, any], orgParam: string) {
            try {
                this.loadingChartStackByDanhGiaMucDo = true;
                console.log(timeParam, departmentParam, fromToDate, orgParam);
                const axios = useAxios();
                let url = `/api/Dashboard/ChartStackByDanhGiaMucDo?type=${timeParam == "M" ? "monthly" : timeParam == "Q" ? "quarterly" : "yearly"}&startDate=${fromToDate[0].format('YYYY-MM-DD')}&endDate=${fromToDate[1].format('YYYY-MM-DD')}&org=${orgParam}`;
                const response = await axios.get(url);
                this.chartStackByDanhGiaMucDo = response.data.chart;
                return response.data;
            } catch (error) {
                console.error("Failed to fetch dashboard PhieuCV data:", error);
            } finally {
                this.loadingChartStackByDanhGiaMucDo = false;
            }
        },

        // #region DASHBOARD LOOKUP
        async getDepts() {
            try {
                const axios = useAxios();
                let url = `/api/Asset/lookupDepartment?page=${1}&pageSize=${10000}`;

                const response = await axios.post(url);
                this.depts = response.data.data;
            } catch (error) {
                console.error("Failed to fetch department:", error);
            }
        },
        async getOrgs() {
            try {
                const axios = useAxios();
                let url = `/api/Asset/lookupOrg`
                const response = await axios.post(url);
                this.orgs = response.data.data;
            } catch (error) {
                console.error("Failed to fetch org:", error);
            }
        },
        async fetchAssets(page = 1, pageSize = 20, searchText = "", loadMore = false, searchFillter: any = null) {
            try {
                const axios = useAxios();
                ///
                let url = `/api/Asset/listview?page=${page}&pageSize=${pageSize}`;
                if (searchText && searchText.trim() !== "") {
                    url += `&searchText=${JSON.stringify(searchText)}`;
                }
                url += `&dataspyId=${1}`;
                const response = await axios.post(url, searchFillter);
                if (!loadMore) {
                    this.objCode = response.data;
                } else {
                    this.objCode.data = [...this.objCode.data, ...response.data.data];
                    this.objCode.pagination = response.data.pagination;
                }

                //

            } catch (error) {
                console.error("Failed to fetch parent:", error);
            }
        },
        // #endregion


        // #region Tab Asset
        // Chart
        async getChartTieuHaoNhienLieuPhuongTienVanTai(timeParam: string, departmentParam: string, fromToDate: [any, any], orgParam: string) {
            try {
                const axios = useAxios();
                let url = `/api/Dashboard/chart/FuelConsumptionByMonth?type=${timeParam == "M" ? "monthly" : timeParam == "Q" ? "quarterly" : "yearly"}&startDate=${fromToDate[0].format('YYYY-MM-DD')}&endDate=${fromToDate[1].format('YYYY-MM-DD')}&org=${orgParam}`;
                const response = await axios.get(url);
                this.chartTieuHaoNhienLieuPhuongTienVanTai = response.data.chart;
                return response.data;
            } catch (error) {
                console.error("Failed to fetch dashboard PhieuCV data:", error);
            }
        },
        async getChartSuDungVatTuPhuTung(timeParam: string, departmentParam: string, fromToDate: [any, any], orgParam: string) {

        },
        async getChartChiPhiBaoTriThietBi(timeParam: string, departmentParam: string, fromToDate: [any, any], orgParam: string, objCode: string) {
            try {
                const axios = useAxios();
                let url = `/api/Dashboard/chart/ChiPhiBaoTriThietBi?startDate=${fromToDate[0].format('YYYY-MM-DD')}&endDate=${fromToDate[1].format('YYYY-MM-DD')}&objectCode=${objCode}`;
                const response = await axios.get(url);
                this.chartTieuHaoNhienLieuPhuongTienVanTai = response.data.chart;
                return response.data;
            } catch (error) {
                console.error("Failed to fetch dashboard PhieuCV data:", error);
            }
        },
        async getChartTiLeBaoTriVaSuaChua(fromToDate: [any, any], objCode: string) {
            try {

            } catch (error) {
                console.error("Failed to fetch dashboard PhieuCV data:", error);
            }
        },


        // KPI
        async getKPISoLuongThietBiDangHoatDong() {
            try {
                const axios = useAxios();
                let url = `/api/Dashboard/kpi/ThietBiHoatDong`;
                const response = await axios.get(url);
                this.soLuongThietBiDangHoatDong = response.data.value;
            } catch (error) {
                console.error("Failed to fetch dashboard PhieuCV data:", error);
            }
        },
        async getKPISoLuongThietBiDangSuaChua() {
            try {
                const axios = useAxios();
                let url = `/api/Dashboard/kpi/ThietBiDangSuaChua`;
                const response = await axios.get(url);
                this.soLuongThietBiDangSuaChua = response.data.value;
            } catch (error) {
                console.error("Failed to fetch dashboard PhieuCV data:", error);
            }
        },
        async getKPISoLuongThietBiSapDenHanSuaChua() {
            try {
                const axios = useAxios();
                let url = `/api/Dashboard/kpi/ThietBiSapDenHanSuaChua`;
                const response = await axios.get(url);
                this.soLuongThietBiSapDenHanSuaChua = response.data.value;
            } catch (error) {
                console.error("Failed to fetch dashboard PhieuCV data:", error);
            }
        },
        async getKPISoLuongThietBiYeuCauSuaChua() {
            try {
                const axios = useAxios();
                let url = `/api/Dashboard/kpi/ThietBiYeuCauSuaChua`;
                const response = await axios.get(url);
                this.soLuongThietBiYeuCauSuaChua = response.data.value;
            } catch (error) {
                console.error("Failed to fetch dashboard PhieuCV data:", error);
            }
        },
        async getKPISoLuongPhuongTienDangHoatDong() {
            try {
                const axios = useAxios();
                let url = `/api/Dashboard/kpi/PhuongTienDangHoatDong`;
                const response = await axios.get(url);
                this.soLuongPhuongTienDangHoatDong = response.data.value;
            } catch (error) {
                console.error("Failed to fetch dashboard PhieuCV data:", error);
            }
        },
        async getKPINhienLieuTieuThuTrongNgay() {
            try {
                const axios = useAxios();
                let url = `/api/Dashboard/kpi/NhienLieuTieuThuTrongNgay`;
                const response = await axios.get(url);
                this.nhienLieuTieuThuTrongNgay = response.data.value;
            } catch (error) {
                console.error("Failed to fetch dashboard PhieuCV data:", error);
            }
        },
        // #endregion

        // #region Tab Part
        // Chart
        async getChartThongKeVatTuTieuHao(timeParam: string, departmentParam: string, fromToDate: [any, any], orgParam: string) {
            try {
                const axios = useAxios();
                let url = `/api/Dashboard/ChartVatTuTieuHao?type=${timeParam == "M" ? "monthly" : timeParam == "Q" ? "quarterly" : "yearly"}&startDate=${fromToDate[0].format('YYYY-MM-DD')}&endDate=${fromToDate[1].format('YYYY-MM-DD')}&org=${orgParam}`;
                const response = await axios.get(url);
                this.chartThongKeVatTuTieuHao = response.data.chart;
                return response.data;
            } catch (error) {
                console.error("Failed to fetch dashboard PhieuCV data:", error);
            }
        },
        async getChartChiPhiBaoDuong(timeParam: string, departmentParam: string, fromToDate: [any, any], orgParam: string) {
            try {
                const axios = useAxios();
                let url = `/api/Dashboard/ChartChiPhiBD?type=${timeParam == "M" ? "monthly" : timeParam == "Q" ? "quarterly" : "yearly"}&startDate=${fromToDate[0].format('YYYY-MM-DD')}&endDate=${fromToDate[1].format('YYYY-MM-DD')}&org=${orgParam}`;
                const response = await axios.get(url);
                this.chartChiPhiBaoDuong = response.data.chart;
                return response.data;
            } catch (error) {
                console.error("Failed to fetch dashboard PhieuCV data:", error);
            }
        },
        async getChartChiPhiSuaChuaDotXuat(timeParam: string, departmentParam: string, fromToDate: [any, any], orgParam: string) {
            try {
                const axios = useAxios();
                let url = `/api/Dashboard/ChartChiPhiSuaChuaDotXuat?type=${timeParam == "M" ? "monthly" : timeParam == "Q" ? "quarterly" : "yearly"}&startDate=${fromToDate[0].format('YYYY-MM-DD')}&endDate=${fromToDate[1].format('YYYY-MM-DD')}&org=${orgParam}`;
                const response = await axios.get(url);
                this.chartChiPhiSuaChuaDotXuat = response.data.chart;
                return response.data;
            } catch (error) {
                console.error("Failed to fetch dashboard PhieuCV data:", error);
            }
        },
        async getChartChiPhiVatTu(timeParam: string, departmentParam: string, fromToDate: [any, any], orgParam: string) {

        },
        async getChartDeXuatNhuCauMuaSam(timeParam: string, departmentParam: string, fromToDate: [any, any], orgParam: string) {
            try {
                const axios = useAxios();
                let url = `/api/Dashboard/ChartDeXuatNhuCauMuaSam?type=${timeParam == "M" ? "monthly" : timeParam == "Q" ? "quarterly" : "yearly"}&startDate=${fromToDate[0].format('YYYY-MM-DD')}&endDate=${fromToDate[1].format('YYYY-MM-DD')}&org=${orgParam}`;
                const response = await axios.get(url);
                this.chartDeXuatNhuCauMuaSam = response.data.chart;
                return response.data;
            } catch (error) {
                console.error("Failed to fetch dashboard PhieuCV data:", error);
            }
        },
        // KPI
        async getKPISoLuongVatTuRiengBiet() {

        },
        async getKPITonKhoChinhXac() {
            try {
                const axios = useAxios();
                let url = `/api/Dashboard/kpi/TonKhoChinhXac`;
                const response = await axios.get(url);
                this.tonKhoChinhXac = response.data.value;
            } catch (error) {
                console.error("Failed to fetch dashboard PhieuCV data:", error);
            }
        },
        async getKPIYeuCauVatTuTrongNgay() {
            try {
                const axios = useAxios();
                let url = `/api/Dashboard/kpi/YeuCauVatTuTrongNgay`;
                const response = await axios.get(url);
                this.yeuCauVatTuTrongNgay = response.data.value;
            } catch (error) {
                console.error("Failed to fetch dashboard PhieuCV data:", error);
            }
        },
        async getKPIChiPhiVatTuTrongNgay() {
            try {
                const axios = useAxios();
                let url = `/api/Dashboard/kpi/ChiPhiVatTuTrongNgay`;
                const response = await axios.get(url);
                this.chiPhiVatTuTrongNgay = response.data.value;
            } catch (error) {
                console.error("Failed to fetch dashboard PhieuCV data:", error);
            }
        },
        async getKPIYeuCauVatTuChuaDuyet() {
            try {
                const axios = useAxios();
                let url = `/api/Dashboard/kpi/YeuCauVatTuChuaDuyet`;
                const response = await axios.get(url);
                this.yeuCauVatTuChuaDuyet = response.data.value;
            } catch (error) {
                console.error("Failed to fetch dashboard PhieuCV data:", error);
            }
        },
        // #endregion

        // #region Tab Work
        // Chart
        async getChartPhieuCongViecTheoPhanXuong(timeParam: string, departmentParam: string, fromToDate: [any, any], orgParam: string) {

        },
        async getChartCongViecSuaChuaDotXuat(timeParam: string, departmentParam: string, fromToDate: [any, any], orgParam: string) {

        },
        async getChartDanhGiaMucDoSuaChuaDotXuat(timeParam: string, departmentParam: string, fromToDate: [any, any], orgParam: string) {

        },
        async getChartNhuCauNhanCongTheoDonVi(timeParam: string, departmentParam: string, fromToDate: [any, any], orgParam: string) {
            try {
                const axios = useAxios();
                let url = `/api/Dashboard/ChartBookedHoursByPX?type=${timeParam == "M" ? "monthly" : timeParam == "Q" ? "quarterly" : "yearly"}&startDate=${fromToDate[0].format('YYYY-MM-DD')}&endDate=${fromToDate[1].format('YYYY-MM-DD')}&org=${orgParam}`;
                const response = await axios.get(url);
                this.chartNhuCauNhanCongTheoDonVi = response.data.chart;
                return response.data;
            } catch (error) {
                console.error("Failed to fetch dashboard PhieuCV data:", error);
            }
        },
        // KPI
        async getKPITiLeHoanThanhCongViecThang() {

        },
        async getKPITiLeHoanThanhCongViecQuy() {

        },
        async getKPITiLeHoanThanhCongViecNam() {

        },
        async getKPITongSoCongViecSCDX() {

        },
        async getKPITiLeThucHienCongViecDamBaoAnToan() {

        },
        // #endregion




        // #region Modal
        async getObjCode(page = 1, pageSize = 20, searchText = "", loadMore = false, searchFillter: any = null) {
            try {
                console.log(searchFillter);
                // console.log(JSON.stringify(processStringProperties(searchFillter)));
                const axios = useAxios();
                let url = `/api/Asset/listview?page=${page}&pageSize=${pageSize}`;

                if (searchText && searchText.trim() !== "") {
                    url += `&search=${searchText}`;
                }
                //
                const response = await axios.post(url, searchFillter);
                if (!loadMore) {
                    this.objCode = response.data;
                } else {
                    this.objCode.data = [...this.objCode.data, ...response.data.data];
                    this.objCode.pagination = response.data.pagination;
                }
            } catch (error) {
                console.error("Failed to fetch assets:", error);
            }
        },
        async getEvtCode(page = 1, pageSize = 20, searchText = "", loadMore = false, searchFillter: any = null) {
            try {
                console.log(searchFillter);
                // console.log(JSON.stringify(processStringProperties(searchFillter)));
                const axios = useAxios();
                let url = `/api/WorkOrder/listview?page=${page}&pageSize=${pageSize}`;

                if (searchText && searchText.trim() !== "") {
                    url += `&search=${searchText}`;
                }
                //
                const response = await axios.post(url, searchFillter);
                if (!loadMore) {
                    this.evtCode = response.data;
                } else {
                    this.evtCode.data = [...this.evtCode.data, ...response.data.data];
                    this.evtCode.pagination = response.data.pagination;
                }
            } catch (error) {
                console.error("Failed to fetch evtCode:", error);
            }
        },
        // #endregion



        // #region Chart static data
        setChartData() {
            const documentStyle = getComputedStyle(document.documentElement);

            this.chartData = {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                datasets: [
                    {
                        label: '-',
                        backgroundColor: documentStyle.getPropertyValue('--p-cyan-500'),
                        borderColor: documentStyle.getPropertyValue('--p-cyan-500'),
                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    },
                    {
                        label: '--',
                        backgroundColor: documentStyle.getPropertyValue('--p-gray-500'),
                        borderColor: documentStyle.getPropertyValue('--p-gray-500'),
                        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                    }
                ]
            };
        },
        setChartOptions() {
            const documentStyle = getComputedStyle(document.documentElement);
            const textColor = documentStyle.getPropertyValue('--p-text-color');
            const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
            const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

            this.chartOptions = {
                maintainAspectRatio: false,
                aspectRatio: 0.8,
                plugins: {
                    legend: {
                        labels: {
                            color: textColor
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: textColorSecondary,
                            font: {
                                weight: 500
                            }
                        },
                        grid: {
                            display: false,
                            drawBorder: false
                        }
                    },
                    y: {
                        ticks: {
                            color: textColorSecondary
                        },
                        grid: {
                            color: surfaceBorder,
                            drawBorder: false
                        }
                    }
                }
            };
        }
        // #endregion
    }
});