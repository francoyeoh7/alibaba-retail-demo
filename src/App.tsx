import {
  Alert,
  App as AntApp,
  Breadcrumb,
  Button,
  Card,
  Collapse,
  DatePicker,
  Descriptions,
  Dropdown,
  Drawer,
  Empty,
  Form,
  Input,
  Layout,
  Menu,
  Modal,
  Pagination,
  Popconfirm,
  Radio,
  Result,
  Select,
  Space,
  Statistic,
  Steps,
  Table,
  Tag,
  Timeline,
  Tooltip,
  Typography,
  Upload,
  message,
  theme,
} from "antd";
import type { TableColumnsType, UploadFile } from "antd";
import {
  AppstoreOutlined,
  AuditOutlined,
  BarChartOutlined,
  DownOutlined,
  DatabaseOutlined,
  DeleteOutlined,
  EyeOutlined,
  FileProtectOutlined,
  HomeOutlined,
  PauseCircleOutlined,
  ReconciliationOutlined,
  SafetyCertificateOutlined,
  ShopOutlined,
  SwapOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import dayjs, { type Dayjs } from "dayjs";
import { useEffect, useMemo, useState } from "react";
import type {
  ApplicationRecord,
  ApplicationStatus,
  CampusBreakdownAction,
  CampusBreakdownItem,
  CampusCalendarImportOption,
  CampusCalendarPeriod,
  CampusCalendarSchool,
  CampusCalendarSchoolStatus,
  CampusConfidenceLevel,
  CampusOrderRow,
  CampusOrderScenarioId,
  EmployeeRecord,
  OperatorApprovalRecord,
  ScenarioId,
  StoreOption,
} from "./demoData";
import {
  baseEmployees,
  baseRecords,
  campusOrderScenarios,
  demoScenarios,
  operatorApprovalRecords,
} from "./demoData";

const { Header, Content, Sider } = Layout;
const transferCandidatePageSize = 5;

type MenuKey = "records" | "employees" | "analytics" | "approvals";
type DemoRole = "merchant" | "operator";
type RecordView =
  | "list"
  | "detail"
  | "continue-form"
  | "continue-result"
  | "form"
  | "result";
type CampusStatsMode = "natural" | "recommended";

type UpgradeFormValues = {
  warehouseType: string;
  pointAddress: string;
  city: string;
  district: string;
  legalPerson: string;
  legalPhone: string;
  legalId: string;
  companyName: string;
  creditCode: string;
  storeName: string;
};

type ContinueNewStoreFormValues = {
  merchantName: string;
  city: string;
  district: string;
  detailAddress: string;
  warehouseType: string;
  warehouseArea: string;
  warehouseRent: string;
  plannedEntryDate: Dayjs;
  plannedOpenDate: Dayjs;
  storeName: string;
  storeCode: string;
  legalPerson: string;
  legalPhone: string;
  legalId: string;
  companyName: string;
  creditCode: string;
};

type FilterValues = {
  status?: ApplicationStatus;
  storeKeyword?: string;
};

type ConversionDraft = {
  sourceRecord: ApplicationRecord;
  selectedStore: StoreOption;
};

type TransferFormValues = {
  transfereeId: string;
};

type CalendarEditPeriodFormValue = {
  label: string;
  startDate?: Dayjs;
  endDate?: Dayjs;
  effect: CampusCalendarPeriod["effect"];
  note?: string;
};

type CalendarEditFormValues = {
  sourceLabel: string;
  sourceUrl?: string;
  periods: CalendarEditPeriodFormValue[];
};

const statusColorMap: Record<ApplicationStatus, string> = {
  点位信息待完善: "processing",
  审批驳回: "error",
  审批通过: "success",
  已关闭: "default",
  已撤回: "warning",
};

const employeeStatusColorMap: Record<EmployeeRecord["status"], string> = {
  在职: "success",
  待停用: "warning",
  已停用: "default",
};

const approvalStatusColorMap: Record<string, string> = {
  点位信息待完善: "processing",
  审批驳回: "error",
  审批通过: "success",
  已关闭: "default",
  已撤回: "warning",
};

const approvalStatusLabelMap: Record<string, string> = {
  点位信息待完善: "待完善",
  审批驳回: "审批驳回",
  审批通过: "审批通过",
  已关闭: "已关闭",
  已撤回: "已撤回",
};

const campusConfidenceColorMap: Record<CampusConfidenceLevel, string> = {
  高可信: "success",
  中可信: "warning",
  仅供参考: "default",
};

const campusBreakdownActionColorMap: Record<CampusBreakdownAction, string> = {
  纳入比较: "success",
  不纳入比较: "warning",
  先不做校正: "default",
};

const campusCalendarSchoolStatusColorMap: Record<CampusCalendarSchoolStatus, string> = {
  已生效: "success",
  待导入: "warning",
};

const campusCalendarEffectLabelMap: Record<CampusCalendarPeriod["effect"], string> = {
  不纳入比较: "不比较",
  观察期: "先观察",
  仅记录: "只备注",
};

const roleLabelMap: Record<DemoRole, string> = {
  merchant: "服务商端",
  operator: "运营后台",
};

const roleMenuItems = [
  { key: "merchant", label: roleLabelMap.merchant },
  { key: "operator", label: roleLabelMap.operator },
];

const menuItems = [
  { key: "home", icon: <HomeOutlined aria-hidden="true" />, label: "首页" },
  { key: "records", icon: <ReconciliationOutlined aria-hidden="true" />, label: "申请记录" },
  { key: "employees", icon: <TeamOutlined aria-hidden="true" />, label: "员工维护" },
  { key: "analytics", icon: <BarChartOutlined aria-hidden="true" />, label: "校园经营分析" },
  { key: "goods", icon: <AppstoreOutlined aria-hidden="true" />, label: "商品管理" },
  { key: "approvals", icon: <AuditOutlined aria-hidden="true" />, label: "审批管理" },
  { key: "store", icon: <ShopOutlined aria-hidden="true" />, label: "店铺管理" },
  { key: "inventory", icon: <DatabaseOutlined aria-hidden="true" />, label: "库存管理" },
];

const merchantMenuItems = menuItems.filter((item) => item.key !== "approvals");
const operatorMenuItems = menuItems.filter((item) => item.key === "approvals");

const statusOptions = [
  { label: "点位信息待完善", value: "点位信息待完善" },
  { label: "审批驳回", value: "审批驳回" },
  { label: "审批通过", value: "审批通过" },
  { label: "已关闭", value: "已关闭" },
  { label: "已撤回", value: "已撤回" },
] as const;

const buildUploadFile = (uid: string, name: string): UploadFile => ({
  uid,
  name,
  status: "done",
  url: "#",
});

const readonlyUploadProps = (uid: string, fileName: string): { fileList: UploadFile[] } => ({
  fileList: [buildUploadFile(uid, fileName)],
});

const cloneCalendarSchools = (schools: CampusCalendarSchool[]) =>
  schools.map((school) => ({
    ...school,
    periods: school.periods.map((period) => ({ ...period })),
  }));

const buildCalendarSchoolsByScenario = (): Record<CampusOrderScenarioId, CampusCalendarSchool[]> =>
  Object.fromEntries(
    campusOrderScenarios.map((scenario) => [scenario.id, cloneCalendarSchools(scenario.calendarSchools)]),
  ) as Record<CampusOrderScenarioId, CampusCalendarSchool[]>;

const buildCalendarEditInitialValues = (school: CampusCalendarSchool): CalendarEditFormValues => ({
  sourceLabel: school.sourceLabel === "未导入官网校历" ? "人工补录日期" : school.sourceLabel,
  sourceUrl: school.sourceUrl === "--" ? "" : school.sourceUrl,
  periods: school.periods.length
    ? school.periods.map((period) => ({
        label: period.label,
        startDate: dayjs(period.startDate),
        endDate: dayjs(period.endDate),
        effect: period.effect,
        note: period.note,
      }))
    : [{ label: "", effect: "不纳入比较", note: "" }],
});

function isConvertible(record: ApplicationRecord) {
  return record.status === "点位信息待完善" && record.type === "新店申请";
}

function App() {
  const [messageApi, contextHolder] = message.useMessage();
  const { token } = theme.useToken();
  const [activeRole, setActiveRole] = useState<DemoRole>("merchant");
  const [activeMenuKey, setActiveMenuKey] = useState<MenuKey>("records");
  const [lastMerchantMenuKey, setLastMerchantMenuKey] = useState<MenuKey>("records");
  const [recordView, setRecordView] = useState<RecordView>("list");
  const [records, setRecords] = useState(baseRecords);
  const [employees, setEmployees] = useState(baseEmployees);
  const [activeScenario, setActiveScenario] = useState<ScenarioId>("complete");
  const [detailRecord, setDetailRecord] = useState<ApplicationRecord | null>(null);
  const [pendingRecord, setPendingRecord] = useState<ApplicationRecord | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<ApplicationRecord | null>(null);
  const [selectedStoreId, setSelectedStoreId] = useState<string>();
  const [modalError, setModalError] = useState("");
  const [conversionModalOpen, setConversionModalOpen] = useState(false);
  const [draft, setDraft] = useState<ConversionDraft | null>(null);
  const [newRecordName, setNewRecordName] = useState("");
  const [filters, setFilters] = useState<FilterValues>({});
  const [legalRuleModalOpen, setLegalRuleModalOpen] = useState(false);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [transferCandidatePage, setTransferCandidatePage] = useState(1);
  const [campusScenarioId, setCampusScenarioId] =
    useState<CampusOrderScenarioId>("calendar-ready");
  const [campusMode, setCampusMode] = useState<CampusStatsMode>("recommended");
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [calendarManagerOpen, setCalendarManagerOpen] = useState(false);
  const [calendarImportOptionId, setCalendarImportOptionId] = useState<string>();
  const [calendarEditSchool, setCalendarEditSchool] = useState<CampusCalendarSchool | null>(null);
  const [calendarSchoolsByScenario, setCalendarSchoolsByScenario] = useState(
    buildCalendarSchoolsByScenario,
  );
  const [campusExplainRow, setCampusExplainRow] = useState<CampusOrderRow | null>(null);
  const [approvalDrawerRecord, setApprovalDrawerRecord] =
    useState<OperatorApprovalRecord | null>(null);
  const [form] = Form.useForm<UpgradeFormValues>();
  const [continueNewStoreForm] = Form.useForm<ContinueNewStoreFormValues>();
  const [filterForm] = Form.useForm<FilterValues>();
  const [transferForm] = Form.useForm<TransferFormValues>();
  const [calendarEditForm] = Form.useForm<CalendarEditFormValues>();
  const [continueLeaseFiles, setContinueLeaseFiles] = useState<UploadFile[]>([]);
  const [continueLicenseFiles, setContinueLicenseFiles] = useState<UploadFile[]>([]);
  const [continuedStoreName, setContinuedStoreName] = useState("");
  const selectedTransfereeId = Form.useWatch("transfereeId", transferForm);

  const currentScenario =
    demoScenarios.find((scenario) => scenario.id === activeScenario) ?? demoScenarios[0];
  const selectedStore = currentScenario.stores.find((store) => store.id === selectedStoreId);
  const currentLegalEmployee = useMemo(
    () => employees.find((employee) => employee.isLegalRep) ?? null,
    [employees],
  );
  const transferCandidates = useMemo(
    () => employees.filter((employee) => !employee.isLegalRep && employee.status === "在职"),
    [employees],
  );
  const pagedTransferCandidates = useMemo(
    () =>
      transferCandidates.slice(
        (transferCandidatePage - 1) * transferCandidatePageSize,
        transferCandidatePage * transferCandidatePageSize,
      ),
    [transferCandidatePage, transferCandidates],
  );
  const selectedTransferCandidate = useMemo(
    () =>
      transferCandidates.find((employee) => employee.id === selectedTransfereeId) ?? null,
    [selectedTransfereeId, transferCandidates],
  );
  const currentCampusScenario =
    campusOrderScenarios.find((scenario) => scenario.id === campusScenarioId) ??
    campusOrderScenarios[0];
  const hasCampusReference = !currentCampusScenario.fallbackMessage;
  const isShowingCampusNatural = !hasCampusReference || campusMode === "natural";
  const currentCalendarSchools =
    calendarSchoolsByScenario[campusScenarioId] ?? currentCampusScenario.calendarSchools;
  const selectedCalendarImportOption = currentCampusScenario.importOptions.find(
    (option) => option.id === calendarImportOptionId,
  );
  const displayCampusOrders =
    isShowingCampusNatural ? currentCampusScenario.naturalOrders : currentCampusScenario.adjustedOrders;
  const displayCampusStoreAvg =
    isShowingCampusNatural
      ? currentCampusScenario.naturalStoreAvg
      : currentCampusScenario.adjustedStoreAvg;
  const displayCampusDays =
    isShowingCampusNatural ? currentCampusScenario.activeDays : currentCampusScenario.comparableDays;
  const calendarCoveredCampusCount = currentCalendarSchools.filter(
    (school) => school.status === "已生效",
  ).length;
  const calendarTotalCampusCount = currentCalendarSchools.length;

  useEffect(() => {
    if (!draft) {
      return;
    }

    form.setFieldsValue({
      warehouseType: draft.sourceRecord.warehouseType,
      pointAddress: draft.sourceRecord.pointAddress,
      city: draft.selectedStore.city,
      district: draft.selectedStore.district,
      legalPerson: draft.selectedStore.legalPerson,
      legalPhone: draft.selectedStore.legalPhone,
      legalId: draft.selectedStore.legalId,
      companyName: draft.selectedStore.companyName,
      creditCode: draft.selectedStore.creditCode,
      storeName: draft.selectedStore.name,
    });
  }, [draft, form]);

  useEffect(() => {
    setCalendarImportOptionId(undefined);
    setCampusMode("recommended");
    setCalendarEditSchool(null);
  }, [campusScenarioId]);

  useEffect(() => {
    if (!calendarEditSchool) {
      return;
    }

    calendarEditForm.setFieldsValue(buildCalendarEditInitialValues(calendarEditSchool));
  }, [calendarEditForm, calendarEditSchool]);

  useEffect(() => {
    if (recordView !== "continue-form" || !detailRecord) {
      return;
    }

    continueNewStoreForm.setFieldsValue({
      merchantName: detailRecord.merchantName,
      city: "上海市",
      district: "杨浦区",
      detailAddress: detailRecord.pointAddress,
      warehouseType: detailRecord.warehouseType,
      warehouseArea: detailRecord.warehouseType === "旗舰仓" ? "860" : "420",
      warehouseRent: "12",
      plannedEntryDate: dayjs("2026-05-06"),
      plannedOpenDate: dayjs("2026-05-28"),
      storeName: detailRecord.storeName,
      storeCode: "",
      legalPerson: "陈可欣",
      legalPhone: "13800000086",
      legalId: "310110199106180022",
      companyName: "上海校园便利服务商有限公司",
      creditCode: "91310000MA1KJ68D6Q",
    });
  }, [continueNewStoreForm, detailRecord, recordView]);

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const statusMatch = !filters.status || record.status === filters.status;
      const keyword = filters.storeKeyword?.trim();
      const keywordMatch =
        !keyword ||
        record.storeName.includes(keyword) ||
        record.merchantName.includes(keyword) ||
        record.merchantCode.includes(keyword);

      return statusMatch && keywordMatch;
    });
  }, [filters, records]);

  const resetConversionModalState = () => {
    setSelectedStoreId(undefined);
    setModalError("");
    setConversionModalOpen(false);
    setSelectedRecord(null);
  };

  const openConversionModal = (record: ApplicationRecord) => {
    setActiveMenuKey("records");
    setSelectedRecord(record);
    setSelectedStoreId(undefined);
    setModalError("");
    setConversionModalOpen(true);
  };

  const openDetailPage = (record: ApplicationRecord) => {
    setActiveMenuKey("records");
    setDetailRecord(record);
    setRecordView("detail");
  };

  const handlePendingEntry = (record: ApplicationRecord) => {
    setActiveMenuKey("records");
    setPendingRecord(record);
  };

  const handleContinueNewStore = (record: ApplicationRecord) => {
    setActiveMenuKey("records");
    setDetailRecord(record);
    setRecordView("continue-form");
    setContinueLeaseFiles([buildUploadFile("continue-lease", record.leaseContractName)]);
    setContinueLicenseFiles([buildUploadFile("continue-license", "营业执照.jpg")]);
  };

  const handleConfirmConversion = () => {
    if (!selectedRecord) {
      return;
    }

    if (!selectedStore) {
      setModalError("请选择要关联的门店后再继续转换。");
      return;
    }

    const mismatch =
      selectedStore.detailAddress &&
      selectedStore.detailAddress !== selectedRecord.pointAddress;

    if (mismatch) {
      const content = `所选门店地址“${selectedStore.detailAddress}”与原审批通过地址不一致，无法转换`;
      setModalError("地址校验未通过，请重新选择与原审批通过地址一致的门店。");
      messageApi.error(content);
      return;
    }

    setDraft({ sourceRecord: selectedRecord, selectedStore });
    setRecordView("form");
    setPendingRecord(null);
    resetConversionModalState();
  };

  const handleScenarioChange = (scenarioId: ScenarioId) => {
    setActiveScenario(scenarioId);
    setActiveMenuKey("records");
    setRecordView("list");
    setRecords(baseRecords);
    setDetailRecord(null);
    setPendingRecord(null);
    setDraft(null);
    setNewRecordName("");
    setContinuedStoreName("");
    setContinueLeaseFiles([]);
    setContinueLicenseFiles([]);
    setSelectedStoreId(undefined);
    setModalError("");
    setConversionModalOpen(false);
    setSelectedRecord(null);
    form.resetFields();
    continueNewStoreForm.resetFields();
  };

  const handleSearch = () => {
    setFilters(filterForm.getFieldsValue());
  };

  const handleResetFilters = () => {
    filterForm.resetFields();
    setFilters({});
  };

  const handleSubmit = async () => {
    if (!draft) {
      return;
    }

    const values = await form.validateFields();
    const newRecord: ApplicationRecord = {
      id: `OS-202604-${String(records.length + 28).padStart(3, "0")}`,
      merchantName: draft.sourceRecord.merchantName,
      merchantCode: draft.sourceRecord.merchantCode,
      status: "审批通过",
      type: "老店升级",
      storeName: values.storeName,
      storeCode: draft.selectedStore.id.toUpperCase(),
      warehouseType: values.warehouseType,
      pointAddress: values.pointAddress,
      cityDistrict: `${values.city} / ${values.district}`,
      leaseContractName: draft.sourceRecord.leaseContractName,
      propertyCertificateName: draft.sourceRecord.propertyCertificateName,
      applicationConfirmationName: draft.sourceRecord.applicationConfirmationName,
      approvalCode: "APR-202604-22",
    };

    setRecords((current) =>
      current.flatMap((item) =>
        item.id === draft.sourceRecord.id
          ? [{ ...item, status: "已关闭" as const }, newRecord]
          : [item],
      ),
    );
    setNewRecordName(newRecord.storeName);
    setRecordView("result");
    messageApi.success("老店升级申请已提交，原新店申请已自动关闭。");
  };

  const handleSubmitContinuedNewStore = async () => {
    if (!detailRecord) {
      return;
    }

    const values = await continueNewStoreForm.validateFields();
    const updatedRecord: ApplicationRecord = {
      ...detailRecord,
      status: "审批通过",
      storeName: values.storeName,
      storeCode: values.storeCode,
      warehouseType: values.warehouseType,
      pointAddress: values.detailAddress,
      cityDistrict: `${values.city} / ${values.district}`,
    };

    setRecords((current) =>
      current.map((item) => (item.id === detailRecord.id ? updatedRecord : item)),
    );
    setDetailRecord(updatedRecord);
    setContinuedStoreName(values.storeName);
    setRecordView("continue-result");
    messageApi.success("新店申请资料已补充完成。");
  };

  const handleDeactivateEmployee = (employeeId: string) => {
    const targetEmployee = employees.find((employee) => employee.id === employeeId);

    if (!targetEmployee) {
      return;
    }

    if (targetEmployee.isLegalRep) {
      messageApi.warning("法人账号需先完成移交，暂不支持直接停用。");
      return;
    }

    if (targetEmployee.status === "待停用") {
      messageApi.warning("该账号已处于待停用状态，请勿重复停用。");
      return;
    }

    if (targetEmployee.status === "已停用") {
      messageApi.warning("该账号已停用，无需重复操作。");
      return;
    }

    setEmployees((current) =>
      current.map((employee) =>
        employee.id === employeeId ? { ...employee, status: "已停用" } : employee,
      ),
    );
    messageApi.success("员工账号已停用。");
  };

  const handleDeleteEmployee = (employeeId: string) => {
    const targetEmployee = employees.find((employee) => employee.id === employeeId);

    if (!targetEmployee) {
      return;
    }

    if (targetEmployee.isLegalRep) {
      messageApi.warning("法人账号需先完成移交，暂不支持直接删除。");
      return;
    }

    setEmployees((current) => current.filter((employee) => employee.id !== employeeId));
    messageApi.success("员工账号已删除。");
  };

  const handleOpenCalendarManager = () => {
    setCalendarManagerOpen(true);
  };

  const handleGoHome = () => {
    closeCrossRoleOverlays();
    setGuideModalOpen(false);
    setDetailRecord(null);
    setDraft(null);
    setRecordView("list");
    setActiveMenuKey(activeRole === "operator" ? "approvals" : "records");
  };

  const closeCrossRoleOverlays = () => {
    setPendingRecord(null);
    setApprovalDrawerRecord(null);
    setCalendarManagerOpen(false);
    setCalendarEditSchool(null);
    setCampusExplainRow(null);
    setLegalRuleModalOpen(false);
    setTransferModalOpen(false);
    resetConversionModalState();
  };

  const handleRoleChange = (nextRole: DemoRole) => {
    if (nextRole === activeRole) {
      return;
    }

    setActiveRole(nextRole);
    closeCrossRoleOverlays();

    if (nextRole === "operator") {
      setActiveMenuKey("approvals");
      return;
    }

    setActiveMenuKey(lastMerchantMenuKey);
  };

  const handleOpenCalendarEdit = (school: CampusCalendarSchool) => {
    setCalendarEditSchool(school);
  };

  const handleSaveCalendarEdit = async () => {
    if (!calendarEditSchool) {
      return;
    }

    const values = await calendarEditForm.validateFields();

    if (!values.periods?.length) {
      messageApi.warning("请至少新增 1 条日期区间后再保存。");
      return;
    }

    const normalizedPeriods = values.periods
      .map((period, index) => ({
        id:
          calendarEditSchool.periods[index]?.id ??
          `${calendarEditSchool.id}-manual-${index + 1}`,
        label: period.label.trim(),
        startDate: period.startDate?.format("YYYY-MM-DD") ?? "",
        endDate: period.endDate?.format("YYYY-MM-DD") ?? "",
        effect: period.effect,
        note: period.note?.trim() || "人工调整后生效。",
      }))
      .sort((left, right) => dayjs(left.startDate).valueOf() - dayjs(right.startDate).valueOf());

    const hasInvalidRange = normalizedPeriods.some((period) =>
      dayjs(period.endDate).isBefore(dayjs(period.startDate), "day"),
    );

    if (hasInvalidRange) {
      messageApi.warning("结束日期不能早于开始日期，请调整后再保存。");
      return;
    }

    const hasOverlap = normalizedPeriods.some((period, index) => {
      if (index === 0) {
        return false;
      }

      return !dayjs(period.startDate).isAfter(normalizedPeriods[index - 1].endDate, "day");
    });

    if (hasOverlap) {
      messageApi.warning("日期区间有重叠，请调整后再保存。");
      return;
    }

    const nextSourceLabel = values.sourceLabel.trim();
    const sourceLooksOfficial =
      nextSourceLabel.includes("官网") ||
      nextSourceLabel.includes("教务") ||
      nextSourceLabel.includes("校历");
    const nextSchool: CampusCalendarSchool = {
      ...calendarEditSchool,
      status: "已生效",
      sourceLabel: nextSourceLabel,
      sourceUrl: values.sourceUrl?.trim() || "--",
      calendarVersion:
        calendarEditSchool.calendarVersion === "待补充"
          ? "人工调整版 v1.0"
          : calendarEditSchool.calendarVersion.includes("人工调整")
            ? calendarEditSchool.calendarVersion
            : `${calendarEditSchool.calendarVersion}（人工调整）`,
      updatedAt: dayjs().format("YYYY-MM-DD HH:mm"),
      confidence: sourceLooksOfficial ? "高可信" : "中可信",
      periods: normalizedPeriods,
    };

    setCalendarSchoolsByScenario((current) => ({
      ...current,
      [campusScenarioId]: current[campusScenarioId].map((school) =>
        school.id === calendarEditSchool.id ? nextSchool : school,
      ),
    }));
    setCalendarEditSchool(null);
    messageApi.success(`${calendarEditSchool.campusName}的手动调整已保存。`);
  };

  const handleImportCampusCalendar = () => {
    if (!selectedCalendarImportOption) {
      messageApi.warning("请先选择要导入的官网校历来源。");
      return;
    }

    if (campusScenarioId === "calendar-missing") {
      setCampusScenarioId("calendar-imported");
      setCampusMode("recommended");
      setCalendarManagerOpen(false);
      messageApi.success("已导入 2 个校区的官网校历，并重新计算近 90 天参考数据。");
      return;
    }

    messageApi.success(`${selectedCalendarImportOption.campusName} 的官网校历已重新同步。`);
  };

  const handleOpenLegalRule = () => {
    setLegalRuleModalOpen(true);
  };

  const handleOpenTransfer = () => {
    setLegalRuleModalOpen(false);
    transferForm.resetFields();
    setTransferCandidatePage(1);
    setTransferModalOpen(true);
  };

  const handleCloseTransferModal = () => {
    setTransferModalOpen(false);
    setTransferCandidatePage(1);
  };

  const handleTransferLegalAccount = async () => {
    const currentLegal = currentLegalEmployee;

    if (!currentLegal) {
      return;
    }

    const values = await transferForm.validateFields();
    const nextLegal = employees.find((employee) => employee.id === values.transfereeId);

    if (!nextLegal) {
      return;
    }

    setEmployees((current) =>
      current.map((employee) => {
        if (employee.id === currentLegal.id) {
          return { ...employee, isLegalRep: false, status: "待停用" };
        }

        if (employee.id === nextLegal.id) {
          return { ...employee, isLegalRep: true };
        }

        return employee;
      }),
    );
    handleCloseTransferModal();
    messageApi.success(`法人账号已移交给${nextLegal.name}`);
  };

  const handleMenuChange = (key: string) => {
    if (key === "employees" || key === "records" || key === "analytics" || key === "approvals") {
      setActiveMenuKey(key);
      setPendingRecord(null);
      setApprovalDrawerRecord(null);

      if (key !== "approvals") {
        setLastMerchantMenuKey(key);
      }

      if (key !== "records") {
        resetConversionModalState();
      }
    }
  };

  const getDeactivateDisabledReason = (record: EmployeeRecord) => {
    if (record.isLegalRep) {
      return "法人账号需先完成移交，才能继续停用。";
    }

    if (record.status === "待停用") {
      return "该账号已处于待停用状态，暂不可重复停用。";
    }

    if (record.status === "已停用") {
      return "该账号已停用，无需重复停用。";
    }

    return "";
  };

  const renderDeactivateAction = (record: EmployeeRecord) => {
    const disabledReason = getDeactivateDisabledReason(record);

    if (!disabledReason) {
      return (
        <Popconfirm
          title={`确认停用 ${record.name} 的账号吗？`}
          okText="确认"
          cancelText="取消"
          onConfirm={() => handleDeactivateEmployee(record.id)}
        >
          <Button
            type="link"
            danger
            className="record-action-button"
            icon={<PauseCircleOutlined aria-hidden="true" />}
          >
            停用
          </Button>
        </Popconfirm>
      );
    }

    return (
      <Tooltip title={disabledReason}>
        <span>
          <Button
            type="link"
            danger
            disabled
            className="record-action-button"
            icon={<PauseCircleOutlined aria-hidden="true" />}
            aria-label={record.isLegalRep ? "停用法人账号" : `停用${record.name}账号`}
          >
            停用
          </Button>
        </span>
      </Tooltip>
    );
  };

  const recordColumns: TableColumnsType<ApplicationRecord> = [
    {
      title: "商家名称/商家编码",
      dataIndex: "merchantName",
      key: "merchantName",
      width: 220,
      render: (_: string, record: ApplicationRecord) => (
        <Space direction="vertical" size={0}>
          <Typography.Text strong>{record.merchantName}</Typography.Text>
          <Typography.Text type="secondary">{record.merchantCode}</Typography.Text>
        </Space>
      ),
    },
    {
      title: "审批状态",
      key: "status",
      width: 180,
      render: (_: string, record: ApplicationRecord) => (
        <Space direction="vertical" size={4}>
          {isConvertible(record) ? (
            <Button type="link" onClick={() => handlePendingEntry(record)}>
              点位信息待完善
            </Button>
          ) : (
            <Tag color={statusColorMap[record.status]}>{record.status}</Tag>
          )}
        </Space>
      ),
    },
    {
      title: "申请类型",
      dataIndex: "type",
      key: "type",
      width: 120,
    },
    {
      title: "门店名称",
      key: "storeName",
      width: 200,
      render: (_: string, record: ApplicationRecord) => (
        <Space direction="vertical" size={0}>
          <Typography.Text>{record.storeName}</Typography.Text>
          <Typography.Text type="secondary">{record.storeCode}</Typography.Text>
        </Space>
      ),
    },
    {
      title: "申请仓型",
      dataIndex: "warehouseType",
      key: "warehouseType",
      width: 120,
    },
    {
      title: "租赁合同",
      dataIndex: "leaseContractName",
      key: "leaseContractName",
      width: 140,
      className: "attachment-column-cell",
      onHeaderCell: () => ({ className: "attachment-column-header" }),
      render: () => <Button type="link">查看</Button>,
    },
    {
      title: "房产证明",
      dataIndex: "propertyCertificateName",
      key: "propertyCertificateName",
      width: 140,
      className: "attachment-column-cell",
      onHeaderCell: () => ({ className: "attachment-column-header" }),
      render: () => <Button type="link">查看</Button>,
    },
    {
      title: "申请确认书",
      dataIndex: "applicationConfirmationName",
      key: "applicationConfirmationName",
      width: 140,
      className: "attachment-column-cell",
      onHeaderCell: () => ({ className: "attachment-column-header" }),
      render: () => <Button type="link">查看</Button>,
    },
    {
      title: "城市/行政区",
      dataIndex: "cityDistrict",
      key: "cityDistrict",
      width: 160,
    },
    {
      title: "详细地址",
      dataIndex: "pointAddress",
      key: "pointAddress",
      width: 280,
    },
    {
      title: "操作",
      key: "action",
      width: 160,
      fixed: "right",
      render: (_: string, record: ApplicationRecord) => (
        <Space direction="vertical" size={4} className="record-action-cell">
          {isConvertible(record) ? (
            <Button
              type="link"
              danger
              className="record-action-button"
              icon={<SwapOutlined aria-hidden="true" />}
              onClick={() => openConversionModal(record)}
            >
              转老店升级
            </Button>
          ) : null}
          <Button
            type="link"
            className="record-action-button"
            icon={<EyeOutlined aria-hidden="true" />}
            onClick={() => openDetailPage(record)}
          >
            查看
          </Button>
        </Space>
      ),
    },
  ];

  const employeeColumns: TableColumnsType<EmployeeRecord> = [
    {
      title: "员工姓名/账号",
      dataIndex: "name",
      key: "name",
      width: "24%",
      render: (_: string, record: EmployeeRecord) => (
        <Space direction="vertical" size={0}>
          <Space size={8}>
            <Typography.Text strong>{record.name}</Typography.Text>
            {record.isLegalRep ? (
              <Tag color="red" icon={<SafetyCertificateOutlined aria-hidden="true" />}>
                法人账号
              </Tag>
            ) : null}
          </Space>
          <Typography.Text type="secondary">{record.account}</Typography.Text>
        </Space>
      ),
    },
    {
      title: "角色",
      dataIndex: "role",
      key: "role",
      width: "14%",
    },
    {
      title: "负责门店",
      key: "managedStores",
      width: "22%",
      render: (_: string, record: EmployeeRecord) => (
        <Typography.Text>{record.managedStores.join("、")}</Typography.Text>
      ),
    },
    {
      title: "账号状态",
      key: "status",
      width: "10%",
      render: (_: string, record: EmployeeRecord) => (
        <Tag color={employeeStatusColorMap[record.status]}>{record.status}</Tag>
      ),
    },
    {
      title: "入职时间",
      dataIndex: "onboardingDate",
      key: "onboardingDate",
      width: "12%",
    },
    {
      title: "操作",
      key: "action",
      width: "18%",
      render: (_: string, record: EmployeeRecord) =>
        record.isLegalRep ? (
          <Space size={[6, 8]} wrap className="employee-action-row employee-action-cell">
            <Button
              type="link"
              danger
              className="record-action-button"
              icon={<SwapOutlined aria-hidden="true" />}
              onClick={handleOpenTransfer}
            >
              发起移交
            </Button>
            <Button
              type="link"
              className="record-action-button"
              icon={<SafetyCertificateOutlined aria-hidden="true" />}
              onClick={handleOpenLegalRule}
            >
              保护规则
            </Button>
          </Space>
        ) : (
          <Space direction="vertical" size={6} className="employee-action-cell">
            <Space size={[6, 8]} wrap className="employee-action-row">
              {renderDeactivateAction(record)}
              <Popconfirm
                title={`确认删除 ${record.name} 的账号吗？`}
                okText="确认"
                cancelText="取消"
                onConfirm={() => handleDeleteEmployee(record.id)}
              >
                <Button
                  type="link"
                  danger
                  className="record-action-button"
                  icon={<DeleteOutlined aria-hidden="true" />}
                >
                  删除
                </Button>
              </Popconfirm>
            </Space>
          </Space>
        ),
    },
  ];

  const campusBreakdownColumns: TableColumnsType<CampusBreakdownItem> = [
    {
      title: "日期类型",
      dataIndex: "label",
      key: "label",
      width: 140,
    },
    {
      title: "天数",
      dataIndex: "days",
      key: "days",
      width: 90,
      render: (value: number) => `${value} 天`,
    },
    {
      title: "系统处理",
      dataIndex: "action",
      key: "action",
      width: 130,
      render: (value: CampusBreakdownAction) => (
        <Tag color={campusBreakdownActionColorMap[value]}>{value}</Tag>
      ),
    },
    {
      title: "说明",
      dataIndex: "description",
      key: "description",
    },
  ];

  const calendarPeriodColumns: TableColumnsType<CampusCalendarPeriod> = [
    {
      title: "阶段",
      dataIndex: "label",
      key: "label",
      width: 140,
      render: (_: string, record: CampusCalendarPeriod) =>
        `${record.label} ${record.startDate} 至 ${record.endDate}`,
    },
    {
      title: "作用方式",
      dataIndex: "effect",
      key: "effect",
      width: 120,
      render: (value: CampusCalendarPeriod["effect"]) => (
        <Tag color={value === "不纳入比较" ? "warning" : value === "观察期" ? "processing" : "default"}>
          {campusCalendarEffectLabelMap[value]}
        </Tag>
      ),
    },
    {
      title: "说明",
      dataIndex: "note",
      key: "note",
    },
  ];

  const renderCalendarSchoolPanel = (school: CampusCalendarSchool) => ({
    key: school.id,
    label: school.campusName,
    children: (
      <Space direction="vertical" size={12} style={{ width: "100%" }}>
        <Descriptions size="small" column={2} bordered>
          <Descriptions.Item label="生效状态">
            <Tag color={campusCalendarSchoolStatusColorMap[school.status]}>{school.status}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="当前可信度">
            <Tag color={campusConfidenceColorMap[school.confidence]}>{school.confidence}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="来源">
            {school.sourceLabel}
          </Descriptions.Item>
          <Descriptions.Item label="校历版本">
            {school.calendarVersion}
          </Descriptions.Item>
          <Descriptions.Item label="来源链接">
            {school.sourceUrl}
          </Descriptions.Item>
          <Descriptions.Item label="最近更新">
            {school.updatedAt}
          </Descriptions.Item>
        </Descriptions>
        {school.periods.length ? (
          <Table
            rowKey="id"
            size="small"
            columns={calendarPeriodColumns}
            dataSource={school.periods}
            pagination={false}
          />
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="当前还没有可用的校历区间" />
        )}
        <Button type="link" onClick={() => handleOpenCalendarEdit(school)}>
          去调整
        </Button>
      </Space>
    ),
  });

  const campusColumns: TableColumnsType<CampusOrderRow> = useMemo(
    () => [
      {
        title: "校区",
        dataIndex: "campusName",
        key: "campusName",
        width: 220,
      },
      {
        title: "统计月份",
        dataIndex: "month",
        key: "month",
        width: 110,
      },
      {
        title: isShowingCampusNatural ? "原始订单量" : "参考订单量",
        dataIndex: isShowingCampusNatural ? "naturalOrders" : "adjustedOrders",
        key: isShowingCampusNatural ? "naturalOrders" : "adjustedOrders",
        width: 150,
        render: (value: number) => value.toLocaleString("zh-CN"),
      },
      {
        title: isShowingCampusNatural ? "统计天数" : "纳入比较的营业天数",
        key: "days",
        width: 180,
        render: (_: string, record: CampusOrderRow) =>
          isShowingCampusNatural
            ? `${record.activeDays} 天`
            : `${record.comparableDays} / ${record.activeDays} 天`,
      },
      {
        title: "校历状态",
        key: "calendarStatus",
        width: 120,
        render: (_: string, record: CampusOrderRow) => (
          <Tag color={record.calendarStatus === "已配置" ? "success" : "warning"}>
            {record.calendarStatus}
          </Tag>
        ),
      },
      {
        title: "主要影响",
        key: "holidayTag",
        width: 130,
        render: (_: string, record: CampusOrderRow) =>
          record.holidayTag ? <Tag color="gold">{record.holidayTag}</Tag> : <Tag>常规月</Tag>,
      },
      {
        title: "操作",
        key: "action",
        width: 140,
        className: "campus-column-cell campus-action-cell",
        onHeaderCell: () => ({ className: "campus-column-header" }),
        render: (_: string, record: CampusOrderRow) => (
          <Button
            type="link"
            className="campus-action-button"
            onClick={() => setCampusExplainRow(record)}
          >
            查看明细
          </Button>
        ),
      },
    ],
    [isShowingCampusNatural],
  );

  const approvalColumns: TableColumnsType<OperatorApprovalRecord> = [
    {
      title: "商家名称/商家编码",
      key: "merchantName",
      width: 220,
      className: "approval-column-cell",
      onHeaderCell: () => ({ className: "approval-column-header" }),
      render: (_: string, record: OperatorApprovalRecord) => (
        <Space direction="vertical" size={0} className="approval-cell-stack">
          <Typography.Text strong>{record.merchantName}</Typography.Text>
          <Typography.Text type="secondary">{record.merchantCode}</Typography.Text>
        </Space>
      ),
    },
    {
      title: "点位名称",
      dataIndex: "pointName",
      key: "pointName",
      width: 180,
      className: "approval-column-cell",
      onHeaderCell: () => ({ className: "approval-column-header" }),
    },
    {
      title: "申请类型",
      dataIndex: "applicationType",
      key: "applicationType",
      width: 120,
      className: "approval-column-cell",
      onHeaderCell: () => ({ className: "approval-column-header" }),
    },
    {
      title: "当前状态",
      key: "currentStatus",
      width: 150,
      className: "approval-column-cell",
      onHeaderCell: () => ({ className: "approval-column-header" }),
      render: (_: string, record: OperatorApprovalRecord) => (
        <div className="approval-status-cell">
          <Tag color={approvalStatusColorMap[record.currentStatus] ?? "default"}>
            {approvalStatusLabelMap[record.currentStatus] ?? record.currentStatus}
          </Tag>
        </div>
      ),
    },
    {
      title: "审批单号",
      dataIndex: "approvalCode",
      key: "approvalCode",
      width: 180,
      className: "approval-column-cell",
      onHeaderCell: () => ({ className: "approval-column-header" }),
      render: (value: string) => <Typography.Text>{value}</Typography.Text>,
    },
    {
      title: "最近更新时间",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 160,
      className: "approval-column-cell",
      onHeaderCell: () => ({ className: "approval-column-header" }),
    },
    {
      title: "操作",
      key: "action",
      width: 160,
      className: "approval-column-cell approval-action-cell",
      onHeaderCell: () => ({ className: "approval-column-header" }),
      render: (_: string, record: OperatorApprovalRecord) => (
        <Button
          type="link"
          className="approval-action-button"
          onClick={() => setApprovalDrawerRecord(record)}
        >
          查看详情
        </Button>
      ),
    },
  ];

  const breadcrumbItems =
    activeMenuKey === "employees"
      ? [{ title: "商家端管理系统" }, { title: "员工维护" }]
      : activeMenuKey === "analytics"
        ? [{ title: "商家端管理系统" }, { title: "校园经营分析" }]
        : activeMenuKey === "approvals"
          ? [{ title: "平台运营后台" }, { title: "审批管理" }]
          : [{ title: "商家端管理系统" }, { title: "申请记录" }];

  const headerTitle =
    activeMenuKey === "approvals" ? "平台运营后台" : "服务商管理后台";
  const menuItemsForRole = activeRole === "merchant" ? merchantMenuItems : operatorMenuItems;
  const defaultListPagination = {
    pageSize: 10,
    showSizeChanger: false,
  };

  const renderRecordsList = () => (
    <Space direction="vertical" size={16} className="page-stack">
      <Card>
        <Form form={filterForm} layout="inline" onFinish={handleSearch} className="query-form">
          <Form.Item label="审批状态" name="status">
            <Select
              allowClear
              placeholder="请选择"
              options={statusOptions.map((option) => ({
                label: option.label,
                value: option.value,
              }))}
              style={{ width: 200 }}
            />
          </Form.Item>
          <Form.Item label="店铺名称" name="storeKeyword">
            <Input allowClear placeholder="请输入" style={{ width: 240 }} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button onClick={handleResetFilters}>重置</Button>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Collapse
        items={[
          {
            key: "demo-scenarios",
            label: "Demo 场景切换（仅演示）",
            children: (
              <Space direction="vertical" size={12}>
                <Radio.Group
                  value={activeScenario}
                  onChange={(event) => handleScenarioChange(event.target.value)}
                >
                  <Space wrap>
                    {demoScenarios.map((scenario) => (
                      <Radio.Button key={scenario.id} value={scenario.id}>
                        {scenario.title}
                      </Radio.Button>
                    ))}
                  </Space>
                </Radio.Group>
                <Alert
                  type="info"
                  showIcon
                  message={currentScenario.title}
                  description={currentScenario.description}
                />
              </Space>
            ),
          },
        ]}
      />

      <Card>
        <Table
          rowKey="id"
          columns={recordColumns}
          dataSource={filteredRecords}
          pagination={defaultListPagination}
          scroll={{ x: 1860 }}
        />
      </Card>
    </Space>
  );

  const renderRecordDetail = () => {
    if (!detailRecord) {
      return null;
    }

    const isNewStoreDetail = detailRecord.type === "新店申请";
    const canContinueNewStore = isNewStoreDetail && detailRecord.status === "点位信息待完善";
    const detailAlertDescription = canContinueNewStore
      ? "当前申请处于点位信息待完善阶段，可继续补填或转为老店升级。"
      : detailRecord.status === "已关闭"
        ? "该历史记录已自动关闭，不可再次提交；对应点位已释放。"
        : isNewStoreDetail
          ? "当前申请已完成处理，可查看当时提交的点位与资质信息。"
          : "该老店升级记录已生成完成，可查看关联门店资料与带出信息。";
    const detailAlertMessage = canContinueNewStore ? "待完善阶段处理建议" : "记录状态说明";
    const detailActionHint =
      detailRecord.status === "已关闭"
        ? "原申请单已关闭，不支持再次提交。"
        : isNewStoreDetail
          ? "当前状态下无可执行操作。"
          : "该老店升级记录已完成处理，无需再次提交。";

    return (
      <Space direction="vertical" size={16} className="page-stack">
        <div className="page-utility-row">
          <Button onClick={() => setRecordView("list")}>返回申请记录</Button>
        </div>

        <Card>
          <Steps
            current={2}
            items={
              isNewStoreDetail
                ? [
                    { title: "提交点位申请" },
                    { title: "点位审批通过" },
                    { title: "点位信息待完善" },
                    { title: "开店营业" },
                  ]
                : [
                    { title: "发起老店升级" },
                    { title: "补齐门店资料" },
                    { title: "审批通过" },
                  ]
            }
          />
        </Card>

        <Card title="申请概览">
          <Descriptions column={2}>
            <Descriptions.Item label="申请单号">{detailRecord.id}</Descriptions.Item>
            <Descriptions.Item label="审批编号">{detailRecord.approvalCode}</Descriptions.Item>
            <Descriptions.Item label="商家名称">{detailRecord.merchantName}</Descriptions.Item>
            <Descriptions.Item label="申请类型">{detailRecord.type}</Descriptions.Item>
            <Descriptions.Item label="门店名称">{detailRecord.storeName}</Descriptions.Item>
            <Descriptions.Item label="申请仓型">{detailRecord.warehouseType}</Descriptions.Item>
            <Descriptions.Item label="点位地址" span={2}>
              {detailRecord.pointAddress}
            </Descriptions.Item>
          </Descriptions>
          <Alert
            type="warning"
            showIcon
            className="section-alert"
            message={detailAlertMessage}
            description={detailAlertDescription}
          />
        </Card>

        <Card title="点位与资质信息">
          <Descriptions column={2} className="detail-info-descriptions">
            <Descriptions.Item label="城市/行政区">{detailRecord.cityDistrict}</Descriptions.Item>
            <Descriptions.Item label="租赁合同">
              <Space size={8} className="detail-link-value">
                <Typography.Text>{detailRecord.leaseContractName}</Typography.Text>
                <Button type="link" className="record-action-button">
                  查看
                </Button>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="房产证明">
              <Space size={8} className="detail-link-value">
                <Typography.Text>{detailRecord.propertyCertificateName}</Typography.Text>
                <Button type="link" className="record-action-button">
                  查看
                </Button>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="申请确认书">
              <Space size={8} className="detail-link-value">
                <Typography.Text>{detailRecord.applicationConfirmationName}</Typography.Text>
                <Button type="link" className="record-action-button">
                  查看
                </Button>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="状态">{detailRecord.status}</Descriptions.Item>
            <Descriptions.Item label="备注">
              {isNewStoreDetail
                ? "若商家已有符合资质的老店，可直接切换到老店升级补录，避免重复提交。"
                : "当前记录已按老店升级链路生成，用于承接已有门店资质的开店申请。"}
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Card className="action-card">
          {canContinueNewStore ? (
            <Space>
              <Button onClick={() => handleContinueNewStore(detailRecord)}>
                继续完善新店申请
              </Button>
              <Button type="primary" danger onClick={() => openConversionModal(detailRecord)}>
                转老店升级
              </Button>
            </Space>
          ) : (
            <Typography.Text type="secondary">{detailActionHint}</Typography.Text>
          )}
        </Card>
      </Space>
    );
  };

  const renderContinueNewStoreForm = () => {
    if (!detailRecord) {
      return null;
    }

    return (
      <Space direction="vertical" size={16} className="page-stack">
        <div className="page-utility-row">
          <Button onClick={() => setRecordView("detail")}>返回申请详情</Button>
        </div>

        <Card title="可控仓申请类型">
          <Descriptions column={1}>
            <Descriptions.Item label="申请类型">{detailRecord.type}</Descriptions.Item>
            <Descriptions.Item label="当前单据">{detailRecord.id}</Descriptions.Item>
            <Descriptions.Item label="申请仓型">{detailRecord.warehouseType}</Descriptions.Item>
            <Descriptions.Item label="点位地址">
              <Space size={8} wrap>
                <Typography.Text>{detailRecord.pointAddress}</Typography.Text>
                <Button
                  type="link"
                  size="small"
                  onClick={() =>
                    messageApi.info("演示模式下保留重选地址入口，正式环境会跳回点位地图重新选址。")
                  }
                >
                  返回重新选择地址
                </Button>
              </Space>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <Form
          form={continueNewStoreForm}
          layout="vertical"
          onFinish={handleSubmitContinuedNewStore}
        >
          <Card title="点位信息填写">
            <div className="form-rail continue-form-shell">
              <Form.Item label="上传租赁合同" required>
                <Upload.Dragger
                  multiple={false}
                  maxCount={1}
                  beforeUpload={() => false}
                  fileList={continueLeaseFiles}
                  onChange={({ fileList }) => setContinueLeaseFiles(fileList)}
                >
                  <p className="ant-upload-text">点击或拖拽文件到这里上传</p>
                  <p className="ant-upload-hint">支持 pdf、png、jpg、jpeg，演示环境不会发起真实上传。</p>
                </Upload.Dragger>
              </Form.Item>

              <Form.Item label="客户名称" name="merchantName" rules={[{ required: true }]}>
                <Input disabled />
              </Form.Item>

              <Form.Item
                label="城市"
                name="city"
                rules={[{ required: true, message: "请选择城市" }]}
              >
                <Select
                  options={[
                    { label: "上海市", value: "上海市" },
                    { label: "杭州市", value: "杭州市" },
                  ]}
                />
              </Form.Item>
              <Form.Item
                label="行政区"
                name="district"
                rules={[{ required: true, message: "请选择行政区" }]}
              >
                <Select
                  options={[
                    { label: "杨浦区", value: "杨浦区" },
                    { label: "静安区", value: "静安区" },
                    { label: "虹口区", value: "虹口区" },
                  ]}
                />
              </Form.Item>

              <Form.Item
                label="详细地址"
                name="detailAddress"
                rules={[{ required: true, message: "请补充详细地址" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="所开仓型"
                name="warehouseType"
                rules={[{ required: true, message: "请选择所开仓型" }]}
              >
                <Radio.Group>
                  <Radio value="旗舰仓">旗舰仓</Radio>
                  <Radio value="标准仓">标准仓</Radio>
                  <Radio value="代理仓">代理仓</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                label="仓面积"
                name="warehouseArea"
                rules={[{ required: true, message: "请补充仓面积" }]}
              >
                <Space.Compact style={{ width: "100%" }}>
                  <Input />
                  <Button disabled>平方米</Button>
                </Space.Compact>
              </Form.Item>
              <Form.Item
                label="仓租金"
                name="warehouseRent"
                rules={[{ required: true, message: "请补充仓租金" }]}
              >
                <Space.Compact style={{ width: "100%" }}>
                  <Input />
                  <Button disabled>元/月·平方米</Button>
                </Space.Compact>
              </Form.Item>

              <Form.Item
                label="预计进店时间"
                name="plannedEntryDate"
                rules={[{ required: true, message: "请选择预计进店时间" }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
              <Form.Item
                label="预计营业时间"
                name="plannedOpenDate"
                rules={[{ required: true, message: "请选择预计营业时间" }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </div>
          </Card>

          <Card title="店铺信息填写" className="section-card">
            <div className="form-rail continue-form-shell">
              <Form.Item
                label="店铺名称"
                name="storeName"
                rules={[{ required: true, message: "请补充店铺名称" }]}
              >
                <Input placeholder="请输入" />
              </Form.Item>
              <Form.Item
                label="店铺编号"
                name="storeCode"
                rules={[{ required: true, message: "请补充店铺编号" }]}
              >
                <Input placeholder="请输入" />
              </Form.Item>

              <Form.Item
                label="法人姓名"
                name="legalPerson"
                rules={[{ required: true, message: "请选择法人姓名" }]}
              >
                <Select
                  options={employees
                    .filter((employee) => employee.status === "在职" || employee.isLegalRep)
                    .map((employee) => ({
                      label: employee.name,
                      value: employee.name,
                    }))}
                />
              </Form.Item>
              <Form.Item
                label="法人手机号"
                name="legalPhone"
                rules={[
                  { required: true, message: "请补充法人手机号" },
                  { len: 11, message: "法人手机号需为 11 位" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="法人身份证号"
                name="legalId"
                rules={[{ required: true, message: "请补充法人身份证号" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="公司名称"
                name="companyName"
                rules={[{ required: true, message: "请补充公司名称" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="统一信用代码"
                name="creditCode"
                rules={[{ required: true, message: "请补充统一信用代码" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item label="营业执照" required>
                <Upload
                  listType="picture-card"
                  beforeUpload={() => false}
                  fileList={continueLicenseFiles}
                  onChange={({ fileList }) => setContinueLicenseFiles(fileList)}
                >
                  {continueLicenseFiles.length >= 1 ? null : "+ 上传营业执照"}
                </Upload>
                <Typography.Paragraph type="secondary" style={{ marginBottom: 0 }}>
                  请上传清晰 JPG、PNG 文件，演示环境会保留上传状态但不会发起真实接口请求。
                </Typography.Paragraph>
              </Form.Item>
            </div>
          </Card>

          <Card className="section-card action-card">
            <Space>
              <Button onClick={() => setRecordView("detail")}>取消</Button>
              <Button type="primary" onClick={() => continueNewStoreForm.submit()}>
                提交点位申请
              </Button>
            </Space>
          </Card>
        </Form>
      </Space>
    );
  };

  const renderContinueNewStoreResult = () => (
    <Card>
      <Result
        status="success"
        title="新店申请补充已提交"
        subTitle={
          <Space direction="vertical" size={4}>
            <Typography.Text strong>{continuedStoreName}</Typography.Text>
            <Typography.Text type="secondary">
              已补齐点位与店铺资料，当前记录已更新为审批通过。
            </Typography.Text>
          </Space>
        }
        extra={
          <Button type="primary" onClick={() => setRecordView("list")}>
            返回申请记录
          </Button>
        }
      />
    </Card>
  );

  const renderUpgradeForm = () => {
    if (!draft) {
      return null;
    }

    return (
      <Space direction="vertical" size={16} className="page-stack">
        <div className="page-utility-row">
          <Button onClick={() => setRecordView("list")}>返回申请记录</Button>
        </div>

        <Card title="申请信息">
          <Descriptions column={2}>
            <Descriptions.Item label="原申请单号">{draft.sourceRecord.id}</Descriptions.Item>
            <Descriptions.Item label="审批编号">{draft.sourceRecord.approvalCode}</Descriptions.Item>
            <Descriptions.Item label="申请类型">
              <Tag color="blue">新店申请 → 老店升级</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="选择门店">{draft.selectedStore.name}</Descriptions.Item>
            <Descriptions.Item label="申请仓型">{draft.sourceRecord.warehouseType}</Descriptions.Item>
            <Descriptions.Item label="点位地址">{draft.sourceRecord.pointAddress}</Descriptions.Item>
          </Descriptions>
        </Card>

        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Card title="点位信息填写">
            <Form.Item label="申请仓型" name="warehouseType">
              <Input disabled />
            </Form.Item>
            <Form.Item label="点位地址" name="pointAddress">
              <Input disabled />
            </Form.Item>
            <Form.Item label="租赁合同">
              <Upload
                disabled
                listType="text"
                {...readonlyUploadProps("upgrade-lease", draft.sourceRecord.leaseContractName)}
              >
                <Button>查看</Button>
              </Upload>
            </Form.Item>
            <Form.Item label="房产证明">
              <Upload
                disabled
                listType="text"
                {...readonlyUploadProps(
                  "upgrade-property",
                  draft.sourceRecord.propertyCertificateName,
                )}
              >
                <Button>查看</Button>
              </Upload>
            </Form.Item>
            <Form.Item label="申请确认书">
              <Upload
                disabled
                listType="text"
                {...readonlyUploadProps(
                  "upgrade-confirmation",
                  draft.sourceRecord.applicationConfirmationName,
                )}
              >
                <Button>查看</Button>
              </Upload>
            </Form.Item>
          </Card>

          <Card title="店铺信息填写" className="section-card">
            <div className="form-rail upgrade-form-shell">
              {draft.selectedStore.note ? (
                <Alert
                  type="info"
                  showIcon
                  className="section-alert upgrade-store-note"
                  message="门店关联说明"
                  description={draft.selectedStore.note}
                />
              ) : null}

              <Form.Item
                label="选择门店"
                name="storeName"
                rules={[{ required: true, message: "请选择或确认关联门店" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="城市"
                name="city"
                rules={[{ required: true, message: "请补充城市" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="行政区"
                name="district"
                rules={[{ required: true, message: "请补充行政区" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item label="详细地址">
                <Input value={draft.selectedStore.detailAddress || draft.sourceRecord.pointAddress} readOnly />
              </Form.Item>
              <Typography.Text type="secondary" className="upgrade-field-hint">
                {draft.selectedStore.detailAddress
                  ? "地址来源：关联门店地址"
                  : "地址来源：门店地址为空，沿用原点位地址"}
              </Typography.Text>

              <Form.Item
                label="法人姓名"
                name="legalPerson"
                rules={[{ required: true, message: "请补充法人姓名" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="法人手机号"
                name="legalPhone"
                rules={[
                  { required: true, message: "请补充法人手机号" },
                  { len: 11, message: "法人手机号需为 11 位" },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="法人身份证号"
                name="legalId"
                rules={[{ required: true, message: "请补充法人身份证号" }]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="公司名称"
                name="companyName"
                rules={[{ required: true, message: "请补充公司名称" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="统一社会信用代码"
                name="creditCode"
                rules={[{ required: true, message: "请补充统一社会信用代码" }]}
              >
                <Input />
              </Form.Item>
            </div>
          </Card>

          <Card className="section-card action-card">
            <Space>
              <Button onClick={() => setRecordView("list")}>取消</Button>
              <Button type="primary" onClick={() => form.submit()}>
                提交老店升级申请
              </Button>
            </Space>
          </Card>
        </Form>
      </Space>
    );
  };

  const renderResult = () => (
    <Card>
      <Result
        status="success"
        title="老店升级申请已提交"
        subTitle={`${newRecordName} 已生成新的老店升级申请记录，原新店申请单已自动关闭并完成点位释放。`}
        extra={
          <Button type="primary" onClick={() => setRecordView("list")}>
            返回申请记录
          </Button>
        }
      />
    </Card>
  );

  const renderEmployeesPage = () => (
    <Space direction="vertical" size={16} className="page-stack">
      <Alert
        type="warning"
        showIcon
        message="法人账号保护"
        description={
          <Space direction="vertical" size={4}>
            <Typography.Text>{`当前法人账号：${currentLegalEmployee?.name ?? "未配置"}`}</Typography.Text>
            <Typography.Text type="secondary">
              法人账号不支持直接停用或删除，需先完成账号移交。
            </Typography.Text>
          </Space>
        }
      />

      <Card title="员工账号列表">
        <Table
          rowKey="id"
          className="employee-table"
          tableLayout="fixed"
          columns={employeeColumns}
          dataSource={employees}
          pagination={defaultListPagination}
        />
      </Card>
    </Space>
  );

  const renderAnalyticsPage = () => (
    <Space direction="vertical" size={16} className="page-stack">
      <Card>
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
          <Form layout="inline">
            <Form.Item label="业务场景">
              <Select
                value="校园场景"
                style={{ width: 180 }}
                options={[{ label: "校园场景", value: "校园场景" }]}
              />
            </Form.Item>
            <Form.Item label="统计周期">
              <Select
                value="近 90 天"
                style={{ width: 160 }}
                options={[{ label: "近 90 天", value: "近 90 天" }]}
              />
            </Form.Item>
            <Form.Item label="当前展示">
              <Tag color={isShowingCampusNatural ? "default" : "success"}>
                {isShowingCampusNatural ? "原始数据" : "参考数据（推荐）"}
              </Tag>
            </Form.Item>
            <Form.Item>
              <Button onClick={handleOpenCalendarManager}>校历管理</Button>
            </Form.Item>
          </Form>
        </Space>
      </Card>

      <Collapse
        items={[
          {
            key: "analytics-demo-scenarios",
            label: "Demo 场景切换（仅演示）",
            children: (
              <Space direction="vertical" size={12}>
                <Space wrap>
                  <Button
                    type={campusScenarioId === "calendar-ready" ? "primary" : "default"}
                    onClick={() => setCampusScenarioId("calendar-ready")}
                  >
                    标准校正场景
                  </Button>
                  <Button
                    type={campusScenarioId === "calendar-missing" ? "primary" : "default"}
                    onClick={() => setCampusScenarioId("calendar-missing")}
                  >
                    校历缺失场景
                  </Button>
                  <Button
                    type={campusScenarioId === "calendar-imported" ? "primary" : "default"}
                    onClick={() => setCampusScenarioId("calendar-imported")}
                  >
                    官网导入后生效
                  </Button>
                </Space>

                <Alert
                  type="info"
                  showIcon
                  message={currentCampusScenario.title}
                  description={currentCampusScenario.description}
                />
              </Space>
            ),
          },
        ]}
      />

      {hasCampusReference && !isShowingCampusNatural ? (
        <Alert
          type="success"
          showIcon
          message="已按校历处理"
          description="当前默认展示参考数据，更适合做校园经营复盘；如需查看未处理的原始波动，可切换到原始数据。"
          action={
            <Button size="small" onClick={() => setCampusMode("natural")}>
              查看原始数据
            </Button>
          }
        />
      ) : null}

      {hasCampusReference && isShowingCampusNatural ? (
        <Alert
          type="warning"
          showIcon
          message="当前查看原始数据"
          description="这份数据保留了寒暑假、返校周和考试周波动，适合看订单总量；做经营复盘时建议切回参考数据。"
          action={
            <Button size="small" type="primary" onClick={() => setCampusMode("recommended")}>
              切回参考数据
            </Button>
          }
        />
      ) : null}

      {!hasCampusReference ? (
        <Alert
          type="warning"
          showIcon
          message={currentCampusScenario.fallbackMessage}
          description="当前仅展示原始数据；导入学校官网校历后，系统会自动切换为参考数据视角。"
          action={
            <Button size="small" type="primary" onClick={handleOpenCalendarManager}>
              导入学校官网校历
            </Button>
          }
        />
      ) : null}

      <div className="analytics-summary-grid">
        <Card className="analytics-summary-card">
          <Statistic
            title={isShowingCampusNatural ? "原始订单量" : "参考订单量"}
            value={displayCampusOrders}
          />
        </Card>
        <Card className="analytics-summary-card">
          <Statistic
            title={isShowingCampusNatural ? "原始店均日单" : "参考店均日单"}
            value={displayCampusStoreAvg}
          />
        </Card>
        <Card className="analytics-summary-card">
          <Statistic
            title={isShowingCampusNatural ? "统计天数" : "纳入比较的营业天数"}
            value={displayCampusDays}
          />
        </Card>
        <Card className="analytics-summary-card">
          <Statistic
            title="校历覆盖校区"
            value={calendarCoveredCampusCount}
            suffix={`/ ${calendarTotalCampusCount}`}
          />
        </Card>
      </div>

      <Card
        title="校园订单月度明细"
        extra={<Typography.Text type="secondary">支持查看每个校区当前月的影响项</Typography.Text>}
      >
        <Table
          rowKey="id"
          columns={campusColumns}
          dataSource={currentCampusScenario.rows}
          pagination={defaultListPagination}
          scroll={{ x: 1360 }}
        />
      </Card>
    </Space>
  );

  const renderApprovalsPage = () => (
    <Space direction="vertical" size={16} className="page-stack">
      <Alert
        type="info"
        showIcon
        message="快速跳审批详情"
        description="已为每条申请记录补充审批单号与“查看详情”快捷入口，可直接进入对应审批详情。"
      />

      <Card title="点位申请记录">
        <Table
          rowKey="id"
          columns={approvalColumns}
          dataSource={operatorApprovalRecords}
          pagination={defaultListPagination}
          scroll={{ x: 1280 }}
        />
      </Card>
    </Space>
  );

  return (
    <AntApp>
      {contextHolder}
      <Layout className="page-layout" style={{ background: token.colorBgLayout }}>
        <Sider
          width={188}
          theme="light"
          className="page-sider"
          style={{
            background: token.colorBgContainer,
            borderInlineEnd: `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          <div
            className="page-logo"
            style={{ fontSize: token.fontSize, fontWeight: token.fontWeightStrong }}
          >
            <div
              className="page-logo-mark"
              style={{
                borderRadius: token.borderRadius,
                background: token.colorPrimary,
                color: token.colorTextLightSolid,
                fontSize: token.fontSizeSM,
                fontWeight: token.fontWeightStrong,
              }}
            >
              RL
            </div>
            <span>零售便利店平台</span>
          </div>
          <Menu
            mode="inline"
            selectedKeys={[activeMenuKey]}
            items={menuItemsForRole}
            onClick={({ key }) => handleMenuChange(key)}
          />
        </Sider>

        <Layout className="page-main">
          <Header
            className="page-header"
            style={{
              background: token.colorBgContainer,
              paddingInline: token.paddingLG,
              borderBottom: `1px solid ${token.colorBorderSecondary}`,
            }}
          >
            <Typography.Text strong className="page-header-title">
              {headerTitle}
            </Typography.Text>
            <Space className="page-header-actions" size={12}>
              <Space size={8} className="page-role-switch">
                <Typography.Text type="secondary">当前角色</Typography.Text>
                <Dropdown
                  trigger={["click"]}
                  menu={{
                    items: roleMenuItems,
                    selectable: true,
                    selectedKeys: [activeRole],
                    onClick: ({ key }) => handleRoleChange(key as DemoRole),
                  }}
                >
                  <Button className="page-role-trigger" aria-label="切换当前角色">
                    <span>{roleLabelMap[activeRole]}</span>
                    <DownOutlined aria-hidden="true" />
                  </Button>
                </Dropdown>
              </Space>
              <Button icon={<FileProtectOutlined />} onClick={() => setGuideModalOpen(true)}>
                使用说明
              </Button>
              <Button type="primary" icon={<HomeOutlined />} onClick={handleGoHome}>
                返回首页
              </Button>
            </Space>
          </Header>

          <Content className="page-content" style={{ padding: token.paddingLG }}>
            <Breadcrumb className="page-breadcrumb" items={breadcrumbItems} />

            {activeMenuKey === "employees"
              ? renderEmployeesPage()
              : activeMenuKey === "analytics"
                ? renderAnalyticsPage()
                : activeMenuKey === "approvals"
                  ? renderApprovalsPage()
                  : recordView === "detail"
                    ? renderRecordDetail()
                    : recordView === "continue-form"
                      ? renderContinueNewStoreForm()
                      : recordView === "continue-result"
                        ? renderContinueNewStoreResult()
                    : recordView === "form"
                      ? renderUpgradeForm()
                      : recordView === "result"
                        ? renderResult()
                        : renderRecordsList()}
          </Content>
        </Layout>

        <Modal
          title="使用说明"
          open={guideModalOpen}
          onCancel={() => setGuideModalOpen(false)}
          footer={[
            <Button key="close" type="primary" onClick={() => setGuideModalOpen(false)}>
              我知道了
            </Button>,
          ]}
          destroyOnHidden
        >
          <Space direction="vertical" size={12}>
            <Alert
              type="info"
              showIcon
              message="当前页面为笔试 Demo 原型，重点演示零售便利店平台的四类核心需求。"
            />
            <Descriptions size="small" column={1} bordered>
              <Descriptions.Item label="服务商端">
                申请记录、新店转老店升级、员工维护、校园经营分析。
              </Descriptions.Item>
              <Descriptions.Item label="运营端">
                审批管理，可从点位申请记录快速进入审批详情。
              </Descriptions.Item>
              <Descriptions.Item label="返回首页">
                点击右上角【返回首页】可快速回到当前角色的默认首页。
              </Descriptions.Item>
            </Descriptions>
          </Space>
        </Modal>

        <Modal
          title="点位信息待完善"
          open={Boolean(pendingRecord)}
          onCancel={() => setPendingRecord(null)}
          footer={[
            <Button key="cancel" onClick={() => setPendingRecord(null)}>
              关闭
            </Button>,
            <Button
              key="detail"
              type="primary"
              onClick={() => {
                if (!pendingRecord) {
                  return;
                }

                openDetailPage(pendingRecord);
                setPendingRecord(null);
              }}
            >
              查看申请详情
            </Button>,
          ]}
          destroyOnHidden
        >
          <Space direction="vertical" size={12}>
            <Typography.Text>当前申请已进入待完善阶段</Typography.Text>
            <Typography.Text type="secondary">
              点位审批已经通过，接下来需要补齐店铺主体资料。若商家已有符合资质的老店，可在详情页切换为“老店升级”继续处理。
            </Typography.Text>

            {pendingRecord ? (
              <Descriptions size="small" column={1}>
                <Descriptions.Item label="申请单号">{pendingRecord.id}</Descriptions.Item>
                <Descriptions.Item label="门店名称">{pendingRecord.storeName}</Descriptions.Item>
                <Descriptions.Item label="点位地址">{pendingRecord.pointAddress}</Descriptions.Item>
              </Descriptions>
            ) : null}
          </Space>
        </Modal>

        <Modal
          title="转老店升级"
          open={conversionModalOpen}
          onCancel={resetConversionModalState}
          onOk={handleConfirmConversion}
          okText="确认转换"
          cancelText="取消"
          okButtonProps={{ disabled: currentScenario.stores.length === 0 }}
          destroyOnHidden
        >
          <Form layout="vertical">
            <Form.Item label="选择门店" required>
              {currentScenario.stores.length > 0 ? (
                <Radio.Group
                  value={selectedStoreId}
                  onChange={(event) => {
                    setSelectedStoreId(event.target.value);
                    setModalError("");
                  }}
                >
                  <Space direction="vertical">
                    {currentScenario.stores.map((store) => (
                      <Radio key={store.id} value={store.id} aria-label={store.name}>
                        <Space direction="vertical" size={0}>
                          <Typography.Text>{store.name}</Typography.Text>
                          <Typography.Text type="secondary">
                            {store.city}
                            {store.district ? ` / ${store.district}` : ""}
                          </Typography.Text>
                          <Typography.Text type="secondary">
                            {store.detailAddress || "未维护门店地址，将沿用原点位地址"}
                          </Typography.Text>
                        </Space>
                      </Radio>
                    ))}
                  </Space>
                </Radio.Group>
              ) : (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="当前账号下暂无可关联门店" />
              )}
            </Form.Item>

            <Form.Item label="点位地址">
              <Input value={selectedRecord?.pointAddress} readOnly />
            </Form.Item>
          </Form>

          {selectedStore ? (
            <Descriptions size="small" column={1} className="modal-description">
              <Descriptions.Item label="门店地址">
                {selectedStore.detailAddress || "未维护门店地址，将沿用原点位地址"}
              </Descriptions.Item>
              <Descriptions.Item label="法人">{selectedStore.legalPerson}</Descriptions.Item>
            </Descriptions>
          ) : null}

          {modalError ? (
            <Alert type="error" showIcon className="section-alert" message={modalError} />
          ) : null}

          <Alert
            type="warning"
            showIcon
            className="section-alert"
            message="转换成功后，原始单据会自动关闭，不可逆，请谨慎选择。"
          />
        </Modal>

        <Modal
          title="法人账号保护规则"
          open={legalRuleModalOpen}
          onCancel={() => setLegalRuleModalOpen(false)}
          footer={[
            <Button key="close" onClick={() => setLegalRuleModalOpen(false)}>
              我知道了
            </Button>,
            <Button key="transfer" type="primary" onClick={handleOpenTransfer}>
              立即发起移交
            </Button>,
          ]}
          destroyOnHidden
        >
          <Space direction="vertical" size={12}>
            <Alert
              type="error"
              showIcon
              message="误停用或误删除法人账号会导致无法签约平台协议和缴纳保证金。"
            />
            <Descriptions size="small" column={1}>
              <Descriptions.Item label="当前法人账号">
                {currentLegalEmployee?.name ?? "未配置"}
              </Descriptions.Item>
              <Descriptions.Item label="保护动作">
                法人账号的停用、删除按钮默认禁用，必须先完成法人账号移交。
              </Descriptions.Item>
              <Descriptions.Item label="移交结果">
                新法人账号生效后，原法人账号会自动进入“待停用”状态，避免业务中断。
              </Descriptions.Item>
            </Descriptions>
          </Space>
        </Modal>

        <Modal
          title="法人账号移交"
          open={transferModalOpen}
          onCancel={handleCloseTransferModal}
          onOk={handleTransferLegalAccount}
          okText="确认移交"
          cancelText="取消"
          styles={{
            body: {
              maxHeight: "calc(100vh - 320px)",
              overflowY: "auto",
            },
          }}
          destroyOnHidden
        >
          <Form form={transferForm} layout="vertical">
            <Form.Item label="当前法人账号">
              <Input value={currentLegalEmployee?.name} readOnly />
            </Form.Item>
            <Form.Item
              label="选择接收人"
              name="transfereeId"
              rules={[{ required: true, message: "请选择新的法人账号接收人" }]}
            >
              <Space direction="vertical" size={12} className="transfer-candidate-panel">
                <Radio.Group className="transfer-candidate-group">
                  <Space direction="vertical" className="transfer-candidate-list">
                    {pagedTransferCandidates.map((employee) => (
                      <Radio key={employee.id} value={employee.id} aria-label={employee.name}>
                        <Space direction="vertical" size={0}>
                          <Typography.Text>{employee.name}</Typography.Text>
                          <Typography.Text type="secondary">
                            {employee.role} / {employee.mobile}
                          </Typography.Text>
                        </Space>
                      </Radio>
                    ))}
                  </Space>
                </Radio.Group>

                <div className="transfer-pagination-row">
                  <Pagination
                    current={transferCandidatePage}
                    pageSize={transferCandidatePageSize}
                    total={transferCandidates.length}
                    size="small"
                    showSizeChanger={false}
                    hideOnSinglePage
                    onChange={setTransferCandidatePage}
                  />
                </div>

                {selectedTransferCandidate ? (
                  <Typography.Text type="secondary">
                    已选接收人：{selectedTransferCandidate.name}
                  </Typography.Text>
                ) : null}
              </Space>
            </Form.Item>
            <Alert
              type="info"
              showIcon
              message="移交完成后，新法人账号立即接替协议签约与保证金缴纳权限。"
            />
          </Form>
        </Modal>

        <Drawer
          title="校历导入与设置"
          open={calendarManagerOpen}
          onClose={() => setCalendarManagerOpen(false)}
          width={720}
          destroyOnHidden
        >
          <Space direction="vertical" size={16} className="page-stack">
            <Alert
              type={currentCampusScenario.id === "calendar-missing" ? "warning" : "info"}
              showIcon
              message={currentCampusScenario.title}
              description={currentCampusScenario.calendarManagerHint}
            />

            <Card title="官网校历导入" size="small">
              <Space direction="vertical" size={12} style={{ width: "100%" }}>
                {currentCampusScenario.importOptions.length ? (
                  <Radio.Group
                    value={calendarImportOptionId}
                    onChange={(event) => setCalendarImportOptionId(event.target.value)}
                  >
                    <Space direction="vertical">
                      {currentCampusScenario.importOptions.map((option: CampusCalendarImportOption) => (
                        <Radio key={option.id} value={option.id} aria-label={option.label}>
                          <Space direction="vertical" size={2}>
                            <Typography.Text>{option.label}</Typography.Text>
                            <Typography.Text type="secondary">{option.resultSummary}</Typography.Text>
                          </Space>
                        </Radio>
                      ))}
                    </Space>
                  </Radio.Group>
                ) : (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="当前场景暂无可导入来源" />
                )}

                {selectedCalendarImportOption ? (
                  <Descriptions size="small" column={1} bordered>
                    <Descriptions.Item label="目标校区">
                      {selectedCalendarImportOption.campusName}
                    </Descriptions.Item>
                    <Descriptions.Item label="来源">
                      {selectedCalendarImportOption.sourceLabel}
                    </Descriptions.Item>
                    <Descriptions.Item label="来源链接">
                      {selectedCalendarImportOption.sourceUrl}
                    </Descriptions.Item>
                  </Descriptions>
                ) : null}

                <Space>
                  <Button type="primary" onClick={handleImportCampusCalendar}>
                    导入并生效
                  </Button>
                  <Typography.Text type="secondary">
                    导入后会直接重算当前近 90 天参考数据。
                  </Typography.Text>
                </Space>
              </Space>
            </Card>

            <Card
              title="已生效校历"
              size="small"
              extra={<Typography.Text type="secondary">手动调整日期</Typography.Text>}
            >
              <Collapse
                defaultActiveKey={currentCalendarSchools.map((school) => school.id)}
                items={currentCalendarSchools.map((school) => renderCalendarSchoolPanel(school))}
              />
            </Card>
          </Space>
        </Drawer>

        <Modal
          title="手动调整日期"
          open={Boolean(calendarEditSchool)}
          onCancel={() => setCalendarEditSchool(null)}
          width={920}
          footer={[
            <Button key="cancel" onClick={() => setCalendarEditSchool(null)}>
              取消
            </Button>,
            <Button
              key="save"
              type="primary"
              onClick={handleSaveCalendarEdit}
            >
              保存并重新计算
            </Button>,
          ]}
          styles={{
            body: {
              maxHeight: "calc(100vh - 240px)",
              overflowY: "auto",
              paddingRight: 20,
            },
          }}
          destroyOnHidden
        >
          {calendarEditSchool ? (
            <Space direction="vertical" size={12} style={{ width: "100%" }}>
              <Alert
                type="info"
                showIcon
                message={`${calendarEditSchool.campusName} 当前使用 ${calendarEditSchool.calendarVersion}`}
                description="当学校临时调整放假或返校时间时，可在这里人工修正后重新计算统计结果。"
              />
              <Descriptions size="small" column={1} bordered>
                <Descriptions.Item label="当前来源">
                  {calendarEditSchool.sourceLabel}
                </Descriptions.Item>
                <Descriptions.Item label="当前日期区间">
                  {calendarEditSchool.periods.length
                    ? calendarEditSchool.periods
                        .map((period) => `${period.label} ${period.startDate} 至 ${period.endDate}`)
                        .join("；")
                    : "当前还没有可编辑的日期区间"}
                </Descriptions.Item>
              </Descriptions>

              <Form form={calendarEditForm} layout="vertical">
                <Form.Item
                  label="来源说明"
                  name="sourceLabel"
                  rules={[{ required: true, message: "请填写当前使用的来源说明。" }]}
                >
                  <Input placeholder="例如：人工补录日期 / 官网校历人工修正" />
                </Form.Item>
                <Form.Item label="来源链接 / 备注" name="sourceUrl">
                  <Input placeholder="可填写官网链接、校方通知或人工调整备注" />
                </Form.Item>

                <Form.List name="periods">
                  {(fields, { add, remove }) => (
                    <Space direction="vertical" size={12} style={{ width: "100%" }}>
                      {fields.length ? (
                        fields.map((field, index) => (
                          <Card
                            key={field.key}
                            size="small"
                            title={`日期区间 ${index + 1}`}
                            extra={
                              <Button
                                type="text"
                                danger
                                icon={<DeleteOutlined aria-hidden="true" />}
                                onClick={() => remove(field.name)}
                              >
                                删除
                              </Button>
                            }
                          >
                            <Form.Item
                              label="阶段名称"
                              name={[field.name, "label"]}
                              rules={[{ required: true, message: "请填写阶段名称。" }]}
                            >
                              <Input placeholder="例如：寒假 / 返校过渡 / 考试周" />
                            </Form.Item>
                            <Form.Item
                              label="开始日期"
                              name={[field.name, "startDate"]}
                              rules={[{ required: true, message: "请选择开始日期。" }]}
                            >
                              <DatePicker
                                style={{ width: "100%" }}
                                placeholder="开始日期"
                                format="YYYY-MM-DD"
                                getPopupContainer={(triggerNode) =>
                                  triggerNode.parentElement ?? document.body
                                }
                              />
                            </Form.Item>
                            <Form.Item
                              label="结束日期"
                              name={[field.name, "endDate"]}
                              rules={[{ required: true, message: "请选择结束日期。" }]}
                            >
                              <DatePicker
                                style={{ width: "100%" }}
                                placeholder="结束日期"
                                format="YYYY-MM-DD"
                                getPopupContainer={(triggerNode) =>
                                  triggerNode.parentElement ?? document.body
                                }
                              />
                            </Form.Item>
                            <Form.Item
                              label="作用方式"
                              name={[field.name, "effect"]}
                              rules={[{ required: true, message: "请选择作用方式。" }]}
                            >
                              <Select
                                getPopupContainer={(triggerNode) =>
                                  triggerNode.parentElement ?? document.body
                                }
                                options={[
                                  { label: "不比较", value: "不纳入比较" },
                                  { label: "先观察", value: "观察期" },
                                  { label: "只备注", value: "仅记录" },
                                ]}
                              />
                            </Form.Item>
                            <Form.Item label="说明" name={[field.name, "note"]}>
                              <Input.TextArea
                                rows={3}
                                placeholder="补充说明这段日期为什么需要手动调整"
                              />
                            </Form.Item>
                          </Card>
                        ))
                      ) : (
                        <Empty
                          image={Empty.PRESENTED_IMAGE_SIMPLE}
                          description="当前还没有手动区间，可先新增 1 条。"
                        />
                      )}

                      <Button
                        block
                        type="dashed"
                        onClick={() => add({ label: "", effect: "不纳入比较", note: "" })}
                      >
                        新增日期区间
                      </Button>
                    </Space>
                  )}
                </Form.List>
              </Form>
            </Space>
          ) : null}
        </Modal>

        <Modal
          title="校区统计明细"
          open={Boolean(campusExplainRow)}
          onCancel={() => setCampusExplainRow(null)}
          footer={[
            <Button key="close" onClick={() => setCampusExplainRow(null)}>
              关闭
            </Button>,
          ]}
          width={720}
          destroyOnHidden
        >
          {campusExplainRow ? (
            <Space direction="vertical" size={12} style={{ width: "100%" }}>
              <Descriptions size="small" column={2} bordered>
                <Descriptions.Item label="校区">{campusExplainRow.campusName}</Descriptions.Item>
                <Descriptions.Item label="统计月份">{campusExplainRow.month}</Descriptions.Item>
                <Descriptions.Item label="原始订单量">
                  {campusExplainRow.naturalOrders.toLocaleString("zh-CN")}
                </Descriptions.Item>
                <Descriptions.Item label="参考订单量">
                  {campusExplainRow.adjustedOrders.toLocaleString("zh-CN")}
                </Descriptions.Item>
                <Descriptions.Item label="可用于比较的营业天数">
                  {campusExplainRow.comparableDays} / {campusExplainRow.activeDays} 天
                </Descriptions.Item>
                <Descriptions.Item label="当前可信度">
                  <Tag color={campusConfidenceColorMap[campusExplainRow.confidence]}>
                    {campusExplainRow.confidence}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="校历版本">
                  {campusExplainRow.calendarVersion}
                </Descriptions.Item>
                <Descriptions.Item label="最近更新">
                  {campusExplainRow.calendarUpdatedAt}
                </Descriptions.Item>
              </Descriptions>
              <Alert
                type={campusExplainRow.calendarStatus === "已配置" ? "info" : "warning"}
                showIcon
                message={campusExplainRow.summaryLine}
                description={campusExplainRow.note}
              />
              <Table
                rowKey="id"
                size="small"
                columns={campusBreakdownColumns}
                dataSource={campusExplainRow.breakdown}
                pagination={false}
              />
            </Space>
          ) : null}
        </Modal>

        <Drawer
          title={
            approvalDrawerRecord?.detail
              ? `审批详情 ${approvalDrawerRecord.detail.approvalCode}`
              : "审批详情"
          }
          open={Boolean(approvalDrawerRecord)}
          onClose={() => setApprovalDrawerRecord(null)}
          width={520}
          destroyOnHidden
        >
          {approvalDrawerRecord?.detail ? (
            <Space direction="vertical" size={16} className="page-stack">
              <Descriptions column={1} size="small" bordered>
                <Descriptions.Item label="申请单号">
                  {approvalDrawerRecord.detail.applicationId}
                </Descriptions.Item>
                <Descriptions.Item label="申请类型">
                  {approvalDrawerRecord.detail.applicationType}
                </Descriptions.Item>
                <Descriptions.Item label="当前状态">
                  {approvalStatusLabelMap[approvalDrawerRecord.detail.currentStatus] ??
                    approvalDrawerRecord.detail.currentStatus}
                </Descriptions.Item>
                <Descriptions.Item label="点位地址">
                  {approvalDrawerRecord.detail.pointAddress}
                </Descriptions.Item>
                <Descriptions.Item label="审批人">
                  {approvalDrawerRecord.detail.approver}
                </Descriptions.Item>
                <Descriptions.Item label="最近更新时间">
                  {approvalDrawerRecord.detail.updatedAt}
                </Descriptions.Item>
              </Descriptions>

              <Alert
                type="info"
                showIcon
                message="风险标签"
                description={approvalDrawerRecord.detail.riskTags.join("、")}
              />

              <Card title="审批流转记录">
                <Timeline
                  items={approvalDrawerRecord.detail.logs.map((log) => ({
                    children: (
                      <Space direction="vertical" size={2}>
                        <Typography.Text strong>
                          {`${log.action} · ${approvalStatusLabelMap[log.result] ?? log.result}`}
                        </Typography.Text>
                        <Typography.Text type="secondary">{log.time}</Typography.Text>
                        <Typography.Text type="secondary">{log.operator}</Typography.Text>
                        <Typography.Text>{log.note}</Typography.Text>
                      </Space>
                    ),
                  }))}
                />
              </Card>
            </Space>
          ) : (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂无审批详情" />
          )}
        </Drawer>
      </Layout>
    </AntApp>
  );
}

export default App;
