export type ApplicationStatus =
  | "点位信息待完善"
  | "审批驳回"
  | "审批通过"
  | "已关闭"
  | "已撤回";

export type ApplicationType = "新店申请" | "老店升级";

export type ApplicationRecord = {
  id: string;
  merchantName: string;
  merchantCode: string;
  status: ApplicationStatus;
  type: ApplicationType;
  storeName: string;
  storeCode: string;
  warehouseType: string;
  pointAddress: string;
  cityDistrict: string;
  leaseContractName: string;
  propertyCertificateName: string;
  applicationConfirmationName: string;
  approvalCode: string;
};

export type StoreOption = {
  id: string;
  name: string;
  city: string;
  district: string;
  detailAddress: string;
  legalPerson: string;
  legalPhone: string;
  legalId: string;
  companyName: string;
  creditCode: string;
  note?: string;
};

export type ScenarioId =
  | "complete"
  | "empty-address"
  | "no-store"
  | "incomplete-profile";

export type DemoScenario = {
  id: ScenarioId;
  title: string;
  description: string;
  stores: StoreOption[];
};

export type EmployeeStatus = "在职" | "待停用" | "已停用";

export type EmployeeRecord = {
  id: string;
  name: string;
  mobile: string;
  account: string;
  role: string;
  managedStores: string[];
  status: EmployeeStatus;
  isLegalRep: boolean;
  onboardingDate: string;
};

export type CampusOrderScenarioId = "calendar-ready" | "calendar-missing" | "calendar-imported";

export type CampusConfidenceLevel = "高可信" | "中可信" | "仅供参考";

export type CampusBreakdownAction = "纳入比较" | "不纳入比较" | "先不做校正";

export type CampusCalendarSchoolStatus = "已生效" | "待导入";

export type CampusCalendarPeriod = {
  id: string;
  label: string;
  startDate: string;
  endDate: string;
  effect: "不纳入比较" | "观察期" | "仅记录";
  note: string;
};

export type CampusCalendarSchool = {
  id: string;
  campusName: string;
  status: CampusCalendarSchoolStatus;
  sourceLabel: string;
  sourceUrl: string;
  calendarVersion: string;
  updatedAt: string;
  confidence: CampusConfidenceLevel;
  periods: CampusCalendarPeriod[];
};

export type CampusCalendarImportOption = {
  id: string;
  label: string;
  campusName: string;
  sourceLabel: string;
  sourceUrl: string;
  resultSummary: string;
};

export type CampusBreakdownItem = {
  id: string;
  label: string;
  days: number;
  action: CampusBreakdownAction;
  description: string;
};

export type CampusCalendarInsight = {
  summaryLine: string;
  compareRule: string;
  confidence: CampusConfidenceLevel;
  confidenceReason: string;
  totalDays: number;
  includedDays: number;
  excludedDays: number;
  calendarVersion: string;
  calendarUpdatedAt: string;
  coverageLabel: string;
  breakdown: CampusBreakdownItem[];
};

export type CampusOrderRow = {
  id: string;
  campusName: string;
  month: string;
  naturalOrders: number;
  adjustedOrders: number;
  activeDays: number;
  comparableDays: number;
  calendarStatus: "已配置" | "缺失";
  holidayTag?: string;
  confidence: CampusConfidenceLevel;
  note: string;
  summaryLine: string;
  calendarVersion: string;
  calendarUpdatedAt: string;
  breakdown: CampusBreakdownItem[];
};

export type CampusOrderScenario = {
  id: CampusOrderScenarioId;
  title: string;
  description: string;
  dataStatusLabel: string;
  naturalOrders: number;
  adjustedOrders: number;
  naturalStoreAvg: number;
  adjustedStoreAvg: number;
  activeDays: number;
  comparableDays: number;
  correctionHint: string;
  fallbackMessage?: string;
  insight: CampusCalendarInsight;
  calendarManagerHint: string;
  calendarSchools: CampusCalendarSchool[];
  importOptions: CampusCalendarImportOption[];
  rows: CampusOrderRow[];
};

export type ApprovalLog = {
  id: string;
  time: string;
  action: string;
  operator: string;
  result: string;
  note: string;
};

export type ApprovalDetail = {
  approvalCode: string;
  applicationId: string;
  currentStatus: string;
  applicationType: string;
  pointAddress: string;
  submittedAt: string;
  updatedAt: string;
  approver: string;
  riskTags: string[];
  logs: ApprovalLog[];
};

export type ApprovalSyncStatus = "linked" | "syncing";

export type OperatorApprovalRecord = {
  id: string;
  merchantName: string;
  merchantCode: string;
  pointName: string;
  applicationType: string;
  currentStatus: string;
  pointAddress: string;
  approvalCode: string;
  syncStatus: ApprovalSyncStatus;
  updatedAt: string;
  approver: string;
  detail?: ApprovalDetail;
};

const extendedListCount = 36;

const padNumber = (value: number, length = 3) => String(value).padStart(length, "0");

const applicationLocations = [
  {
    city: "上海市",
    district: "浦东新区",
    street: "金桥路",
    number: "1088号",
    site: "金桥生活广场B1层",
    storePrefix: "金桥生活广场",
  },
  {
    city: "杭州市",
    district: "西湖区",
    street: "文二路",
    number: "391号",
    site: "翠苑天地1层",
    storePrefix: "翠苑天地",
  },
  {
    city: "南京市",
    district: "鼓楼区",
    street: "广州路",
    number: "188号",
    site: "科巷商业街A区",
    storePrefix: "科巷商业街",
  },
  {
    city: "苏州市",
    district: "工业园区",
    street: "星湖街",
    number: "999号",
    site: "创客里2层",
    storePrefix: "创客里",
  },
  {
    city: "合肥市",
    district: "蜀山区",
    street: "长江西路",
    number: "689号",
    site: "乐彩城1层",
    storePrefix: "乐彩城",
  },
  {
    city: "宁波市",
    district: "鄞州区",
    street: "钱湖北路",
    number: "566号",
    site: "大学生活动中心南厅",
    storePrefix: "大学生活动中心",
  },
  {
    city: "无锡市",
    district: "滨湖区",
    street: "蠡溪路",
    number: "88号",
    site: "溪岸里街区A座",
    storePrefix: "溪岸里街区",
  },
  {
    city: "常州市",
    district: "新北区",
    street: "通江中路",
    number: "598号",
    site: "万悦汇负一层",
    storePrefix: "万悦汇",
  },
] as const;

const merchantSeeds = [
  { name: "华东校园运营中心", code: "MR_EAST_021" },
  { name: "沪苏便利联合体", code: "MR_HS_008" },
  { name: "新城零售服务商", code: "MR_CITY_012" },
  { name: "高校生活配套公司", code: "MR_CAMPUS_015" },
  { name: "长三角门店运营商", code: "MR_YRD_011" },
] as const;

const employeeRolePool = [
  "区域主管",
  "店长",
  "运营专员",
  "商品专员",
  "巡店专员",
  "培训督导",
] as const;

const employeeStorePool = [
  ["上海江湾城店", "上海静安寺店"],
  ["创智天地候选店"],
  ["南京江宁大学城店", "南京仙林湖店"],
  ["杭州翠苑生活店"],
  ["苏州创客里店", "无锡溪岸里店"],
  ["宁波大学生活动中心店"],
] as const;

const employeeNamePool = [
  "王若涵",
  "赵一鸣",
  "孙嘉树",
  "周星灿",
  "吴雨晨",
  "郑可为",
  "冯诗涵",
  "陈明礼",
  "褚知夏",
  "卫思源",
  "蒋书瑶",
  "沈嘉禾",
  "韩初阳",
  "杨景川",
  "朱亦菲",
  "秦言溪",
  "许乐童",
  "何书航",
  "吕可心",
  "施沐晨",
  "张知然",
  "孔嘉佑",
  "曹瑞宁",
  "严思妍",
  "华景逸",
  "金语桐",
  "魏泽远",
  "陶若溪",
  "姜祺然",
  "戚子昂",
  "谢晚晴",
  "邹言蹊",
] as const;

const buildExtraApplicationRecords = (count: number): ApplicationRecord[] => {
  const newStoreStatuses: ApplicationStatus[] = [
    "点位信息待完善",
    "审批驳回",
    "审批通过",
    "已关闭",
    "已撤回",
  ];
  const oldStoreStatuses: ApplicationStatus[] = ["审批通过", "审批驳回", "已关闭", "已撤回"];
  const warehouseTypes = ["旗舰仓", "标准仓", "代理仓"] as const;

  return Array.from({ length: count }, (_, index) => {
    const location = applicationLocations[index % applicationLocations.length];
    const merchant = merchantSeeds[index % merchantSeeds.length];
    const type: ApplicationType = index % 5 === 0 ? "老店升级" : "新店申请";
    const statusPool = type === "新店申请" ? newStoreStatuses : oldStoreStatuses;
    const status = statusPool[index % statusPool.length];
    const warehouseType = warehouseTypes[index % warehouseTypes.length];
    const serial = index + 200;
    const storeName =
      type === "新店申请"
        ? `${location.storePrefix}${index % 2 === 0 ? "候选店" : "待开业店"}`
        : `${location.storePrefix}${index % 2 === 0 ? "直营店" : "升级店"}`;
    const storeCode =
      type === "新店申请" ? `PENDING_${padNumber(serial)}` : `STORE_${padNumber(serial)}`;
    const attachmentBase = `${location.storePrefix}${type === "新店申请" ? "新店" : "老店升级"}`;

    return {
      id: `${type === "新店申请" ? "NS" : "OS"}-202605-${padNumber(serial)}`,
      merchantName: merchant.name,
      merchantCode: merchant.code,
      status,
      type,
      storeName,
      storeCode,
      warehouseType,
      pointAddress: `${location.city}${location.district}${location.street}${location.number}${location.site}`,
      cityDistrict: `${location.city} / ${location.district}`,
      leaseContractName: `${attachmentBase}租赁合同.pdf`,
      propertyCertificateName: `${attachmentBase}房产证明.pdf`,
      applicationConfirmationName: `${attachmentBase}申请确认书.pdf`,
      approvalCode: `APR-202605-${padNumber(serial)}`,
    };
  });
};

const buildExtraEmployees = (count: number): EmployeeRecord[] =>
  Array.from({ length: count }, (_, index) => {
    const stores = employeeStorePool[index % employeeStorePool.length];
    const role = employeeRolePool[index % employeeRolePool.length];
    const status: EmployeeStatus =
      index % 11 === 0 ? "已停用" : index % 7 === 0 ? "待停用" : "在职";
    const year = index % 3 === 0 ? 2023 : 2024;
    const month = String((index % 12) + 1).padStart(2, "0");
    const day = String(((index * 3) % 27) + 1).padStart(2, "0");

    return {
      id: `emp-extra-${padNumber(index + 1)}`,
      name: employeeNamePool[index % employeeNamePool.length],
      mobile: `139${padNumber(index + 101, 8)}`,
      account: `staff${padNumber(index + 5)}@retail.demo`,
      role,
      managedStores: [...stores],
      status,
      isLegalRep: false,
      onboardingDate: `${year}-${month}-${day}`,
    };
  });

const cloneCampusBreakdown = (row: CampusOrderRow, suffix: string) =>
  row.breakdown.map((item, index) => ({
    ...item,
    id: `${item.id}-${suffix}-${index}`,
  }));

const buildExpandedCampusRows = (
  seedRows: CampusOrderRow[],
  scenarioId: CampusOrderScenarioId,
  total = extendedListCount,
): CampusOrderRow[] => {
  const extraCount = Math.max(total - seedRows.length, 0);
  const extraRows = Array.from({ length: extraCount }, (_, index) => {
    const template = seedRows[index % seedRows.length];
    const cycle = Math.floor(index / seedRows.length) + 1;
    const monthValue = ((index + 3) % 12) + 1;
    const yearValue = 2025 + Math.floor((index + 3) / 12);
    const monthLabel = `${yearValue}-${String(monthValue).padStart(2, "0")}`;
    const naturalOrders = template.naturalOrders + cycle * 780 + (index % seedRows.length) * 260;
    const adjustedDelta =
      scenarioId === "calendar-missing" ? 0 : template.adjustedOrders - template.naturalOrders;
    const adjustedOrders = naturalOrders + adjustedDelta;
    const comparableDays =
      scenarioId === "calendar-missing"
        ? template.activeDays
        : Math.max(6, Math.min(template.activeDays, template.comparableDays + (cycle % 3) - 1));

    return {
      ...template,
      id: `${template.id}-extra-${index + 1}`,
      month: monthLabel,
      naturalOrders,
      adjustedOrders,
      comparableDays,
      note: `${template.note} 当前为滚动补充展示样本。`,
      summaryLine: `${template.summaryLine} 当前为滚动补充展示样本。`,
      breakdown: cloneCampusBreakdown(template, `extra-${index + 1}`),
    };
  });

  return [...seedRows, ...extraRows];
};

const buildExtraApprovalRecords = (count: number): OperatorApprovalRecord[] => {
  const approvalStatusPool = [
    "点位信息待完善",
    "审批驳回",
    "审批通过",
    "已关闭",
    "已撤回",
  ] as const;
  const approvers = ["刘晨曦", "林芮", "陈奕文", "顾昕然", "邵子铭"] as const;

  return Array.from({ length: count }, (_, index) => {
    const location = applicationLocations[index % applicationLocations.length];
    const merchant = merchantSeeds[index % merchantSeeds.length];
    const applicationType = index % 4 === 0 ? "老店升级" : "新店申请";
    const currentStatus = approvalStatusPool[index % approvalStatusPool.length];
    const syncStatus: ApprovalSyncStatus = "linked";
    const serial = index + 40;
    const approvalCode = `APR-202605-${padNumber(serial)}`;
    const pointAddress = `${location.city}${location.district}${location.street}${location.number}${location.site}`;
    const pointName = `${location.storePrefix}${applicationType === "新店申请" ? "点位" : "升级点"}`;
    const updatedAt = `2026-05-${String((index % 20) + 1).padStart(2, "0")} ${String(
      9 + (index % 8),
    ).padStart(2, "0")}:${index % 2 === 0 ? "12" : "46"}`;
    const approver = approvers[index % approvers.length];

    return {
      id: `operator-approval-extra-${padNumber(index + 1)}`,
      merchantName: merchant.name,
      merchantCode: merchant.code,
      pointName,
      applicationType,
      currentStatus,
      pointAddress,
      approvalCode,
      syncStatus,
      updatedAt,
      approver,
      detail:
        syncStatus === "linked"
          ? {
              approvalCode,
              applicationId: `${applicationType === "新店申请" ? "NS" : "OS"}-202605-${padNumber(
                serial,
              )}`,
              currentStatus,
              applicationType,
              pointAddress,
              submittedAt: `2026-05-${String((index % 20) + 1).padStart(2, "0")} 10:15`,
              updatedAt,
              approver,
              riskTags:
                currentStatus === "审批通过"
                  ? ["门店一致性通过", "实名核验通过"]
                  : currentStatus === "审批驳回"
                    ? ["地址补充待确认"]
                    : ["流程状态已同步"],
              logs: [
                {
                  id: `approval-log-${index + 1}-1`,
                  time: `2026-05-${String((index % 20) + 1).padStart(2, "0")} 10:15`,
                  action: `提交${applicationType}`,
                  operator: `${merchant.name} / 运营专员`,
                  result: "已提交",
                  note: "申请记录已进入平台审核队列。",
                },
                {
                  id: `approval-log-${index + 1}-2`,
                  time: updatedAt,
                  action: "同步审批状态",
                  operator: `平台运营 / ${approver}`,
                  result: currentStatus,
                  note:
                    currentStatus === "点位信息待完善"
                      ? "点位审核通过，等待商家补齐主体信息。"
                      : `当前申请已更新为${currentStatus}。`,
                },
              ],
            }
          : undefined,
    };
  });
};

export const baseRecords: ApplicationRecord[] = [
  {
    id: "NS-202604-001",
    merchantName: "上海校园便利服务商",
    merchantCode: "MR_SH_001",
    status: "点位信息待完善",
    type: "新店申请",
    storeName: "创智天地候选店",
    storeCode: "PENDING_001",
    warehouseType: "旗舰仓",
    pointAddress: "上海市杨浦区政民路318号创智天地广场B2栋",
    cityDistrict: "上海市 / 杨浦区",
    leaseContractName: "杨浦创智天地租赁合同.pdf",
    propertyCertificateName: "杨浦创智天地房产证明.pdf",
    applicationConfirmationName: "杨浦创智天地申请确认书.pdf",
    approvalCode: "APR-202604-19",
  },
  {
    id: "NS-202604-002",
    merchantName: "上海校园便利服务商",
    merchantCode: "MR_SH_001",
    status: "审批驳回",
    type: "新店申请",
    storeName: "复旦北区候选店",
    storeCode: "PENDING_002",
    warehouseType: "标准仓",
    pointAddress: "上海市杨浦区邯郸路220号校园食堂一层",
    cityDistrict: "上海市 / 杨浦区",
    leaseContractName: "复旦北区租赁合同.pdf",
    propertyCertificateName: "复旦北区房产证明.pdf",
    applicationConfirmationName: "复旦北区申请确认书.pdf",
    approvalCode: "APR-202604-11",
  },
  {
    id: "NS-202603-101",
    merchantName: "华东渠道运营中心",
    merchantCode: "MR_EAST_019",
    status: "已关闭",
    type: "新店申请",
    storeName: "杭州锦元中心候选店",
    storeCode: "PENDING_023",
    warehouseType: "标准仓",
    pointAddress: "杭州市萧山区金城路189号锦元中心B座",
    cityDistrict: "杭州市 / 萧山区",
    leaseContractName: "锦元中心租赁合同.pdf",
    propertyCertificateName: "锦元中心房产证明.pdf",
    applicationConfirmationName: "锦元中心申请确认书.pdf",
    approvalCode: "APR-202603-28",
  },
  {
    id: "OS-202604-017",
    merchantName: "南京运营服务商",
    merchantCode: "MR_NJ_003",
    status: "审批通过",
    type: "老店升级",
    storeName: "南京江宁大学城店",
    storeCode: "STORE_031",
    warehouseType: "旗舰仓",
    pointAddress: "南京市江宁区龙眠大道688号学创园A座",
    cityDistrict: "南京市 / 江宁区",
    leaseContractName: "江宁大学城租赁合同.pdf",
    propertyCertificateName: "江宁大学城房产证明.pdf",
    applicationConfirmationName: "江宁大学城申请确认书.pdf",
    approvalCode: "APR-202604-16",
  },
];

baseRecords.push(...buildExtraApplicationRecords(extendedListCount - baseRecords.length));

const matchedStore: StoreOption = {
  id: "store-match",
  name: "上海江湾城店",
  city: "上海市",
  district: "杨浦区",
  detailAddress: "上海市杨浦区政民路318号创智天地广场B2栋",
  legalPerson: "陈可欣",
  legalPhone: "13800000086",
  legalId: "310110199106180022",
  companyName: "上海江湾便利零售有限公司",
  creditCode: "91310000MA1KJ68D6Q",
  note: "地址一致，可直接发起转换。",
};

const mismatchStore: StoreOption = {
  id: "store-mismatch",
  name: "上海静安寺店",
  city: "上海市",
  district: "静安区",
  detailAddress: "上海市静安区延平路88号",
  legalPerson: "周以恒",
  legalPhone: "13900000218",
  legalId: "310106199208054511",
  companyName: "上海静安零售服务有限公司",
  creditCode: "91310000MA1L882D12",
  note: "地址与原申请不一致，确认转换时会被拦截。",
};

const emptyAddressStore: StoreOption = {
  id: "store-empty",
  name: "上海虹口试运营店",
  city: "上海市",
  district: "虹口区",
  detailAddress: "",
  legalPerson: "顾明睿",
  legalPhone: "13700000661",
  legalId: "310109199110026214",
  companyName: "上海虹口试运营便利店有限公司",
  creditCode: "91310000MA1F541N2B",
  note: "门店地址为空，可继续转换并沿用原点位地址。",
};

const incompleteProfileStore: StoreOption = {
  id: "store-incomplete",
  name: "上海创智测试店",
  city: "上海市",
  district: "杨浦区",
  detailAddress: "上海市杨浦区政民路318号创智天地广场B2栋",
  legalPerson: "林韬",
  legalPhone: "",
  legalId: "310110198907214015",
  companyName: "",
  creditCode: "",
  note: "地址一致，但门店主体信息缺失，可在表单中补齐后提交。",
};

export const demoScenarios: DemoScenario[] = [
  {
    id: "complete",
    title: "标准成功流",
    description: "提供一个地址一致门店和一个地址不一致门店，适合演示正常流和拦截流。",
    stores: [matchedStore, mismatchStore],
  },
  {
    id: "empty-address",
    title: "门店地址为空",
    description: "允许继续转换，但在表单中提示会沿用原点位地址。",
    stores: [emptyAddressStore],
  },
  {
    id: "no-store",
    title: "无可选门店",
    description: "弹窗展示空状态并禁用确认按钮。",
    stores: [],
  },
  {
    id: "incomplete-profile",
    title: "门店资料缺失",
    description: "允许转化，但提交前需要补齐法人手机号、公司名称和统一社会信用代码。",
    stores: [incompleteProfileStore],
  },
];

export const baseEmployees: EmployeeRecord[] = [
  {
    id: "emp-legal",
    name: "陈可欣",
    mobile: "13800000086",
    account: "chenkexin@retail.demo",
    role: "法人 / 服务商负责人",
    managedStores: ["上海江湾城店", "创智天地候选店"],
    status: "在职",
    isLegalRep: true,
    onboardingDate: "2023-09-14",
  },
  {
    id: "emp-manager",
    name: "李晓晨",
    mobile: "13600000421",
    account: "lixiaochen@retail.demo",
    role: "区域主管",
    managedStores: ["上海江湾城店", "上海静安寺店"],
    status: "在职",
    isLegalRep: false,
    onboardingDate: "2024-03-08",
  },
  {
    id: "emp-store",
    name: "周雨桐",
    mobile: "13500000119",
    account: "zhouyutong@retail.demo",
    role: "店长",
    managedStores: ["创智天地候选店"],
    status: "在职",
    isLegalRep: false,
    onboardingDate: "2024-11-20",
  },
  {
    id: "emp-ops",
    name: "沈亦凡",
    mobile: "13700000532",
    account: "shenyifan@retail.demo",
    role: "运营专员",
    managedStores: ["上海虹口试运营店"],
    status: "待停用",
    isLegalRep: false,
    onboardingDate: "2024-06-12",
  },
];

baseEmployees.push(...buildExtraEmployees(extendedListCount - baseEmployees.length));

export const campusOrderScenarios: CampusOrderScenario[] = [
  {
    id: "calendar-ready",
    title: "标准校正场景",
    description:
      "已为重点校区维护连续校历区间。主页面只展示经营结果，校历来源、寒暑假区间和人工校正入口统一收进“校历管理”。",
    dataStatusLabel: "已按校历处理",
    naturalOrders: 89240,
    adjustedOrders: 128420,
    naturalStoreAvg: 2860,
    adjustedStoreAvg: 4120,
    activeDays: 90,
    comparableDays: 53,
    correctionHint: "已按各学校自己的校历剔除假期影响",
    insight: {
      summaryLine:
        "统计周期 2026-01-01 至 2026-03-31，共 90 天；寒假 28 天、返校过渡 4 天、考试周 5 天，最终纳入比较 53 天。",
      compareRule: "各学校按自己的校历计算，只比较正常营业日，不把寒暑假和返校过渡期混在一起。",
      confidence: "高可信",
      confidenceReason: "3 个目标校区都已维护最新校历，寒暑假与返校时间完整，可直接用于经营复盘。",
      totalDays: 90,
      includedDays: 53,
      excludedDays: 37,
      calendarVersion: "2026 春季校历总表 v2.0",
      calendarUpdatedAt: "2026-01-05 18:00",
      coverageLabel: "3 / 3 个校区已完成校历配置",
      breakdown: [
        {
          id: "regular-class-days",
          label: "正常上课日",
          days: 53,
          action: "纳入比较",
          description: "学生稳定在校，订单波动接近日常营业水平。",
        },
        {
          id: "winter-break-days",
          label: "寒假",
          days: 28,
          action: "不纳入比较",
          description: "按官网校历连续识别为寒假区间，整段从比较样本中剔除。",
        },
        {
          id: "return-buffer-days",
          label: "返校过渡",
          days: 4,
          action: "不纳入比较",
          description: "开学前后客流尚未恢复稳定，先不计入可比样本。",
        },
        {
          id: "exam-week-days",
          label: "考试周",
          days: 5,
          action: "不纳入比较",
          description: "考试周订单结构和平时不同，单独排除。",
        },
      ],
    },
    calendarManagerHint:
      "建议优先导入学校官网校历或教务处 PDF，由系统识别连续假期区间，再由运营确认后生效到统计。",
    calendarSchools: [
      {
        id: "calendar-fudan",
        campusName: "复旦大学邯郸校区",
        status: "已生效",
        sourceLabel: "复旦大学教务处校历公告",
        sourceUrl: "https://jwc.fudan.edu.cn/calendar",
        calendarVersion: "复旦大学 2026 春季校历 v1.1",
        updatedAt: "2026-01-03 09:00",
        confidence: "高可信",
        periods: [
          {
            id: "fudan-period-1",
            label: "寒假",
            startDate: "2026-01-20",
            endDate: "2026-02-16",
            effect: "不纳入比较",
            note: "寒假为连续区间，跨 1 月和 2 月统一处理，不按月拆成固定天数。",
          },
          {
            id: "fudan-period-2",
            label: "返校过渡",
            startDate: "2026-02-17",
            endDate: "2026-02-20",
            effect: "观察期",
            note: "返校首周客流恢复不均匀，先不并入稳定经营样本。",
          },
        ],
      },
      {
        id: "calendar-tongji",
        campusName: "同济大学四平校区",
        status: "已生效",
        sourceLabel: "同济大学官网校历 PDF",
        sourceUrl: "https://jwc.tongji.edu.cn/calendar",
        calendarVersion: "同济大学 2026 春季校历 v1.0",
        updatedAt: "2026-02-08 12:00",
        confidence: "高可信",
        periods: [
          {
            id: "tongji-period-1",
            label: "寒假",
            startDate: "2026-01-18",
            endDate: "2026-02-15",
            effect: "不纳入比较",
            note: "寒假持续到返校前一天，整段从比较样本中剔除。",
          },
          {
            id: "tongji-period-2",
            label: "返校过渡",
            startDate: "2026-02-16",
            endDate: "2026-02-19",
            effect: "观察期",
            note: "返校头几天仅做观察，不直接作为经营基准。",
          },
        ],
      },
      {
        id: "calendar-sufe",
        campusName: "上海财经大学国定校区",
        status: "已生效",
        sourceLabel: "上海财经大学教务日历",
        sourceUrl: "https://jwc.sufe.edu.cn/calendar",
        calendarVersion: "上海财经大学 2026 春季校历 v1.2",
        updatedAt: "2026-03-02 10:30",
        confidence: "高可信",
        periods: [
          {
            id: "sufe-period-1",
            label: "考试周",
            startDate: "2026-03-23",
            endDate: "2026-03-27",
            effect: "不纳入比较",
            note: "考试周消费节奏异常波动，单独剔除。",
          },
        ],
      },
    ],
    importOptions: [
      {
        id: "import-fudan",
        label: "复旦大学教务处校历公告",
        campusName: "复旦大学邯郸校区",
        sourceLabel: "复旦大学教务处校历公告",
        sourceUrl: "https://jwc.fudan.edu.cn/calendar",
        resultSummary: "识别出寒假 2026-01-20 至 2026-02-16，返校过渡 2026-02-17 至 2026-02-20。",
      },
    ],
    rows: [
      {
        id: "campus-row-1",
        campusName: "复旦大学邯郸校区",
        month: "2026-01",
        naturalOrders: 18240,
        adjustedOrders: 30520,
        activeDays: 31,
        comparableDays: 19,
        calendarStatus: "已配置",
        holidayTag: "寒假开始",
        confidence: "高可信",
        note: "1 月 20 日起进入寒假，因此系统只保留 1 月 1 日至 1 月 19 日的稳定营业天数。",
        summaryLine: "当前月共 31 天，寒假从 2026-01-20 开始，当月实际纳入比较 19 天。",
        calendarVersion: "复旦大学 2026 春季校历 v1.1",
        calendarUpdatedAt: "2026-01-03 09:00",
        breakdown: [
          {
            id: "fudan-regular",
            label: "正常上课日",
            days: 19,
            action: "纳入比较",
            description: "学生在校且经营稳定，作为本月主要样本。",
          },
          {
            id: "fudan-winter",
            label: "寒假",
            days: 12,
            action: "不纳入比较",
            description: "寒假开始后客流快速下降，不与平时经营混比。",
          },
        ],
      },
      {
        id: "campus-row-2",
        campusName: "同济大学四平校区",
        month: "2026-02",
        naturalOrders: 21450,
        adjustedOrders: 28610,
        activeDays: 28,
        comparableDays: 8,
        calendarStatus: "已配置",
        holidayTag: "寒假 / 返校",
        confidence: "高可信",
        note: "2 月 1 日至 2 月 15 日仍在寒假，2 月 16 日至 2 月 19 日为返校过渡，只有后面的稳定营业日纳入比较。",
        summaryLine:
          "当前月共 28 天，寒假 15 天、返校过渡 4 天，最终纳入比较 8 天。",
        calendarVersion: "同济大学 2026 春季校历 v1.0",
        calendarUpdatedAt: "2026-02-08 12:00",
        breakdown: [
          {
            id: "tongji-regular",
            label: "正常上课日",
            days: 8,
            action: "纳入比较",
            description: "返校后客流恢复稳定，适合拿来做经营对比。",
          },
          {
            id: "tongji-winter",
            label: "寒假",
            days: 15,
            action: "不纳入比较",
            description: "寒假仍未结束，这部分订单不与正常教学期混比。",
          },
          {
            id: "tongji-return",
            label: "返校过渡",
            days: 4,
            action: "不纳入比较",
            description: "返校前几天波动大，先不纳入参考。",
          },
        ],
      },
      {
        id: "campus-row-3",
        campusName: "上海财经大学国定校区",
        month: "2026-03",
        naturalOrders: 49550,
        adjustedOrders: 69290,
        activeDays: 31,
        comparableDays: 27,
        calendarStatus: "已配置",
        holidayTag: "考试周",
        confidence: "高可信",
        note: "考试周客流波动更像短期异常，不和正常上课日直接混比。",
        summaryLine: "当前月共 31 天，其中考试周 5 天，最终纳入比较 26 天。",
        calendarVersion: "上海财经大学 2026 春季校历 v1.2",
        calendarUpdatedAt: "2026-03-02 10:30",
        breakdown: [
          {
            id: "sufe-regular",
            label: "正常上课日",
            days: 26,
            action: "纳入比较",
            description: "绝大多数日期经营稳定，可作为本月基准。",
          },
          {
            id: "sufe-exam",
            label: "考试周",
            days: 5,
            action: "不纳入比较",
            description: "学生出行和就餐节奏变化明显，避免拉低可比结果。",
          },
        ],
      },
    ],
  },
  {
    id: "calendar-missing",
    title: "校历缺失场景",
    description: "目标校区还没维护完整校历。系统不会猜测寒暑假日期，而是明确回退到原始订单视角。",
    dataStatusLabel: "待导入校历",
    naturalOrders: 76430,
    adjustedOrders: 76430,
    naturalStoreAvg: 2465,
    adjustedStoreAvg: 2465,
    activeDays: 90,
    comparableDays: 90,
    correctionHint: "学校假期信息还没配好，先按原始数据看。",
    fallbackMessage: "学校假期信息还没配好，先按原始数据看。",
    insight: {
      summaryLine:
        "统计周期 2026-01-01 至 2026-03-31，共 90 天；由于 2 个校区缺少官网校历，本期先按原始数据展示。",
      compareRule: "没有完整校历时，系统不输出参考值，也不猜测假期天数，避免把不可靠的数据说成结论。",
      confidence: "仅供参考",
      confidenceReason: "2 个目标校区都缺少最新校历，当前只能看原始订单走势，暂不建议拿来做跨校区对比。",
      totalDays: 90,
      includedDays: 0,
      excludedDays: 0,
      calendarVersion: "待补充",
      calendarUpdatedAt: "--",
      coverageLabel: "0 / 2 个校区已完成校历配置",
      breakdown: [
        {
          id: "calendar-missing-days",
          label: "待补校历天数",
          days: 90,
          action: "先不做校正",
          description: "学校的寒暑假和返校时间尚未维护完成，系统先不输出可比结果。",
        },
      ],
    },
    calendarManagerHint:
      "当前没有可用的官网校历，建议先导入学校官网公告或 PDF，再由系统识别寒假、暑假和返校过渡日期。",
    calendarSchools: [
      {
        id: "calendar-ecnu",
        campusName: "华东师范大学闵行校区",
        status: "待导入",
        sourceLabel: "未导入官网校历",
        sourceUrl: "--",
        calendarVersion: "待补充",
        updatedAt: "--",
        confidence: "仅供参考",
        periods: [],
      },
      {
        id: "calendar-shu",
        campusName: "上海大学宝山校区",
        status: "待导入",
        sourceLabel: "未导入官网校历",
        sourceUrl: "--",
        calendarVersion: "待补充",
        updatedAt: "--",
        confidence: "仅供参考",
        periods: [],
      },
    ],
    importOptions: [
      {
        id: "import-ecnu",
        label: "华东师范大学官网校历 PDF",
        campusName: "华东师范大学闵行校区",
        sourceLabel: "华东师范大学官网校历 PDF",
        sourceUrl: "https://www.ecnu.edu.cn/calendar.pdf",
        resultSummary: "识别出寒假 2026-01-18 至 2026-02-15，返校过渡 2026-02-16 至 2026-02-19。",
      },
      {
        id: "import-shu",
        label: "上海大学教务处校历公告",
        campusName: "上海大学宝山校区",
        sourceLabel: "上海大学教务处校历公告",
        sourceUrl: "https://jwc.shu.edu.cn/calendar",
        resultSummary: "识别出寒假 2026-01-19 至 2026-02-16，返校过渡 2026-02-17 至 2026-02-20。",
      },
    ],
    rows: [
      {
        id: "campus-row-4",
        campusName: "华东师范大学闵行校区",
        month: "2026-01",
        naturalOrders: 32580,
        adjustedOrders: 32580,
        activeDays: 31,
        comparableDays: 31,
        calendarStatus: "缺失",
        holidayTag: "待补校历",
        confidence: "仅供参考",
        note: "尚未配置寒假开始时间，系统不会猜测这部分日期该不该剔除。",
        summaryLine: "当前月共 31 天，但寒假开始时间缺失，所以这期只展示原始订单。",
        calendarVersion: "待补充",
        calendarUpdatedAt: "--",
        breakdown: [
          {
            id: "ecnu-missing",
            label: "待补校历天数",
            days: 31,
            action: "先不做校正",
            description: "缺少完整校历，先不生成参考值。",
          },
        ],
      },
      {
        id: "campus-row-5",
        campusName: "上海大学宝山校区",
        month: "2026-02",
        naturalOrders: 43850,
        adjustedOrders: 43850,
        activeDays: 28,
        comparableDays: 28,
        calendarStatus: "缺失",
        confidence: "仅供参考",
        note: "校历同步中，先保留原始数据，避免误判开学回暖幅度。",
        summaryLine: "当前月共 28 天，但返校时间仍在同步中，所以这期先按原始订单查看。",
        calendarVersion: "同步中",
        calendarUpdatedAt: "--",
        breakdown: [
          {
            id: "shu-missing",
            label: "待补校历天数",
            days: 28,
            action: "先不做校正",
            description: "返校时间未确认前，不输出对比结论。",
          },
        ],
      },
    ],
  },
  {
    id: "calendar-imported",
    title: "官网导入后生效",
    description:
      "已从学校官网校历中识别连续寒假区间并人工确认，导入结果已直接作用到近 90 天统计。",
    dataStatusLabel: "已按校历处理",
    naturalOrders: 76430,
    adjustedOrders: 101860,
    naturalStoreAvg: 2465,
    adjustedStoreAvg: 3285,
    activeDays: 90,
    comparableDays: 48,
    correctionHint: "官网校历已导入并生效，参考数据已重新计算。",
    insight: {
      summaryLine:
        "统计周期 2026-01-01 至 2026-03-31，共 90 天；寒假 29 天、返校过渡 4 天，最终纳入比较 48 天。",
      compareRule: "系统会先识别学校官网校历中的连续假期区间，再把这些区间从比较样本中剔除。",
      confidence: "高可信",
      confidenceReason: "2 个校区都已完成官网校历导入并人工确认，当前统计已按生效版本重新计算。",
      totalDays: 90,
      includedDays: 48,
      excludedDays: 33,
      calendarVersion: "官网导入校历 v1.0",
      calendarUpdatedAt: "2026-02-20 16:30",
      coverageLabel: "2 / 2 个校区已完成校历导入",
      breakdown: [
        {
          id: "import-regular-days",
          label: "正常上课日",
          days: 48,
          action: "纳入比较",
          description: "已按导入后的官网校历重新筛出稳定经营日。",
        },
        {
          id: "import-winter-days",
          label: "寒假",
          days: 29,
          action: "不纳入比较",
          description: "寒假按连续区间整体剔除。",
        },
        {
          id: "import-buffer-days",
          label: "返校过渡",
          days: 4,
          action: "不纳入比较",
          description: "返校过渡期客流恢复不均匀，单独排除。",
        },
      ],
    },
    calendarManagerHint:
      "官网导入后仍保留人工校正入口，便于运营修正学校临时调整的放假和返校日期。",
    calendarSchools: [
      {
        id: "calendar-import-ecnu",
        campusName: "华东师范大学闵行校区",
        status: "已生效",
        sourceLabel: "华东师范大学官网校历 PDF",
        sourceUrl: "https://www.ecnu.edu.cn/calendar.pdf",
        calendarVersion: "华东师范大学 2026 春季校历 v1.0",
        updatedAt: "2026-02-20 16:30",
        confidence: "高可信",
        periods: [
          {
            id: "ecnu-period-1",
            label: "寒假",
            startDate: "2026-01-18",
            endDate: "2026-02-15",
            effect: "不纳入比较",
            note: "官网导入识别出的连续寒假区间，已直接作用到统计。",
          },
          {
            id: "ecnu-period-2",
            label: "返校过渡",
            startDate: "2026-02-16",
            endDate: "2026-02-19",
            effect: "观察期",
            note: "返校恢复期先单独观察，不与稳定经营日混比。",
          },
        ],
      },
      {
        id: "calendar-import-shu",
        campusName: "上海大学宝山校区",
        status: "已生效",
        sourceLabel: "上海大学教务处校历公告",
        sourceUrl: "https://jwc.shu.edu.cn/calendar",
        calendarVersion: "上海大学 2026 春季校历 v1.0",
        updatedAt: "2026-02-20 16:30",
        confidence: "高可信",
        periods: [
          {
            id: "shu-period-1",
            label: "寒假",
            startDate: "2026-01-19",
            endDate: "2026-02-16",
            effect: "不纳入比较",
            note: "官网公告识别后的寒假区间已生效。",
          },
          {
            id: "shu-period-2",
            label: "返校过渡",
            startDate: "2026-02-17",
            endDate: "2026-02-20",
            effect: "观察期",
            note: "返校首周先做观察，再纳入稳定经营样本。",
          },
        ],
      },
    ],
    importOptions: [
      {
        id: "import-ecnu",
        label: "华东师范大学官网校历 PDF",
        campusName: "华东师范大学闵行校区",
        sourceLabel: "华东师范大学官网校历 PDF",
        sourceUrl: "https://www.ecnu.edu.cn/calendar.pdf",
        resultSummary: "已识别寒假 2026-01-18 至 2026-02-15，返校过渡 2026-02-16 至 2026-02-19。",
      },
      {
        id: "import-shu",
        label: "上海大学教务处校历公告",
        campusName: "上海大学宝山校区",
        sourceLabel: "上海大学教务处校历公告",
        sourceUrl: "https://jwc.shu.edu.cn/calendar",
        resultSummary: "已识别寒假 2026-01-19 至 2026-02-16，返校过渡 2026-02-17 至 2026-02-20。",
      },
    ],
    rows: [
      {
        id: "campus-row-6",
        campusName: "华东师范大学闵行校区",
        month: "2026-01",
        naturalOrders: 32580,
        adjustedOrders: 40120,
        activeDays: 31,
        comparableDays: 17,
        calendarStatus: "已配置",
        holidayTag: "寒假开始",
        confidence: "高可信",
        note: "官网校历导入后，1 月 18 日后的寒假区间已整体剔除。",
        summaryLine: "当前月共 31 天，寒假从 2026-01-18 开始，当月纳入比较 17 天。",
        calendarVersion: "华东师范大学 2026 春季校历 v1.0",
        calendarUpdatedAt: "2026-02-20 16:30",
        breakdown: [
          {
            id: "ecnu-regular",
            label: "正常上课日",
            days: 17,
            action: "纳入比较",
            description: "寒假开始前的稳定营业日纳入比较。",
          },
          {
            id: "ecnu-winter",
            label: "寒假",
            days: 14,
            action: "不纳入比较",
            description: "寒假区间整体剔除。",
          },
        ],
      },
      {
        id: "campus-row-7",
        campusName: "上海大学宝山校区",
        month: "2026-02",
        naturalOrders: 43850,
        adjustedOrders: 61740,
        activeDays: 28,
        comparableDays: 8,
        calendarStatus: "已配置",
        holidayTag: "寒假 / 返校",
        confidence: "高可信",
        note: "官网校历导入后，寒假和返校过渡日期都已生效到统计。",
        summaryLine: "当前月共 28 天，寒假 16 天、返校过渡 4 天，最终纳入比较 8 天。",
        calendarVersion: "上海大学 2026 春季校历 v1.0",
        calendarUpdatedAt: "2026-02-20 16:30",
        breakdown: [
          {
            id: "shu-regular",
            label: "正常上课日",
            days: 8,
            action: "纳入比较",
            description: "返校稳定后的营业日纳入比较。",
          },
          {
            id: "shu-winter",
            label: "寒假",
            days: 16,
            action: "不纳入比较",
            description: "寒假连续区间整体剔除。",
          },
          {
            id: "shu-return",
            label: "返校过渡",
            days: 4,
            action: "不纳入比较",
            description: "返校恢复期先单独观察。",
          },
        ],
      },
    ],
  },
];

campusOrderScenarios.forEach((scenario) => {
  scenario.rows = buildExpandedCampusRows(scenario.rows, scenario.id);
});

export const operatorApprovalRecords: OperatorApprovalRecord[] = [
  {
    id: "operator-approval-1",
    merchantName: "上海校园便利服务商",
    merchantCode: "MR_SH_001",
    pointName: "创智天地 B2 仓点",
    applicationType: "新店申请",
    currentStatus: "点位信息待完善",
    pointAddress: "上海市杨浦区政民路318号创智天地广场B2栋",
    approvalCode: "APR-202604-19",
    syncStatus: "linked",
    updatedAt: "2026-04-22 10:18",
    approver: "刘晨曦",
    detail: {
      approvalCode: "APR-202604-19",
      applicationId: "NS-202604-001",
      currentStatus: "点位信息待完善",
      applicationType: "新店申请",
      pointAddress: "上海市杨浦区政民路318号创智天地广场B2栋",
      submittedAt: "2026-04-19 14:22",
      updatedAt: "2026-04-22 10:18",
      approver: "刘晨曦",
      riskTags: ["地址核验通过", "主体待补充"],
      logs: [
        {
          id: "log-1",
          time: "2026-04-19 14:22",
          action: "提交点位申请",
          operator: "上海校园便利服务商 / 张祺",
          result: "已提交",
          note: "新店申请单进入平台待审队列。",
        },
        {
          id: "log-2",
          time: "2026-04-20 09:15",
          action: "初审点位信息",
          operator: "平台运营 / 刘晨曦",
          result: "通过",
          note: "点位合规、租赁合同齐备，可进入主体补录阶段。",
        },
        {
          id: "log-3",
          time: "2026-04-22 10:18",
          action: "流转至待完善",
          operator: "平台运营 / 刘晨曦",
          result: "点位信息待完善",
          note: "已通知商家补充门店主体信息，支持转老店升级。",
        },
      ],
    },
  },
  {
    id: "operator-approval-2",
    merchantName: "上海校园便利服务商",
    merchantCode: "MR_SH_001",
    pointName: "复旦北区食堂点位",
    applicationType: "新店申请",
    currentStatus: "审批驳回",
    pointAddress: "上海市杨浦区邯郸路220号校园食堂一层",
    approvalCode: "APR-202604-11",
    syncStatus: "syncing",
      updatedAt: "2026-04-21 18:20",
      approver: "林芮",
    detail: {
      approvalCode: "APR-202604-11",
      applicationId: "NS-202604-002",
      currentStatus: "审批驳回",
      applicationType: "新店申请",
      pointAddress: "上海市杨浦区邯郸路220号校园食堂一层",
      submittedAt: "2026-04-18 11:06",
      updatedAt: "2026-04-21 18:20",
      approver: "林芮",
      riskTags: ["补充租赁附件", "经营主体信息不完整"],
      logs: [
        {
          id: "log-6",
          time: "2026-04-18 11:06",
          action: "提交点位申请",
          operator: "上海校园便利服务商 / 张祺",
          result: "已提交",
          note: "复旦北区点位申请进入平台审核流程。",
        },
        {
          id: "log-7",
          time: "2026-04-21 18:20",
          action: "复核点位资料",
          operator: "平台运营 / 林芮",
          result: "审批驳回",
          note: "租赁附件缺失且主体信息不完整，需补充后重新提交。",
        },
      ],
    },
  },
  {
    id: "operator-approval-3",
    merchantName: "南京运营服务商",
    merchantCode: "MR_NJ_003",
    pointName: "南京江宁大学城店",
    applicationType: "老店升级",
    currentStatus: "审批通过",
    pointAddress: "南京市江宁区龙眠大道688号学创园A座",
    approvalCode: "APR-202604-16",
    syncStatus: "linked",
    updatedAt: "2026-04-22 09:03",
    approver: "陈奕文",
    detail: {
      approvalCode: "APR-202604-16",
      applicationId: "OS-202604-017",
      currentStatus: "审批通过",
      applicationType: "老店升级",
      pointAddress: "南京市江宁区龙眠大道688号学创园A座",
      submittedAt: "2026-04-16 11:20",
      updatedAt: "2026-04-22 09:03",
      approver: "陈奕文",
      riskTags: ["待复核门店一致性"],
      logs: [
        {
          id: "log-4",
          time: "2026-04-16 11:20",
          action: "提交老店升级申请",
          operator: "南京运营服务商 / 王钰",
          result: "已提交",
          note: "已带出老店主体信息，待平台复核。",
        },
        {
          id: "log-5",
          time: "2026-04-22 09:03",
          action: "进入复核队列",
          operator: "平台运营 / 陈奕文",
          result: "审批通过",
          note: "门店一致性与实名认证校验完成，升级记录已生效。",
        },
      ],
    },
  },
];

operatorApprovalRecords.push(
  ...buildExtraApprovalRecords(extendedListCount - operatorApprovalRecords.length),
);
