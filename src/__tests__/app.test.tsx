import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import App from "../App";

afterEach(() => {
  cleanup();
});

describe("new-store to old-store upgrade demo", () => {
  it("renders the records page as a standard Ant Design query-table layout", () => {
    render(<App />);
    const breadcrumb = screen.getByRole("navigation");

    expect(breadcrumb).toHaveTextContent("商家端管理系统");
    expect(breadcrumb).toHaveTextContent("申请记录");
    expect(breadcrumb).not.toHaveTextContent("点位地图");
    expect(screen.getByText("当前角色")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "切换当前角色" })).toHaveTextContent("服务商端");
    expect(screen.getByRole("menuitem", { name: "商品管理" })).toBeInTheDocument();
    expect(screen.getByRole("menuitem", { name: "库存管理" })).toBeInTheDocument();
    expect(screen.queryByRole("menuitem", { name: "审批管理" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "申请记录" })).not.toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "店铺名称" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "房产证明" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "申请确认书" })).toBeInTheDocument();
    expect(
      screen.queryByText("用一条可解释的补救链路，代替重复提单"),
    ).not.toBeInTheDocument();
  });

  it("shows the convert action only for eligible records", () => {
    render(<App />);

    expect(
      screen.getByRole("button", { name: "转老店升级" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "查看" }).length).toBeGreaterThanOrEqual(4);
  });

  it("blocks conversion when the selected store address mismatches", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: "转老店升级" }));
    await user.click(screen.getByLabelText("上海静安寺店"));
    await user.click(screen.getByRole("button", { name: "确认转换" }));

    expect(
      screen.getByText(/所选门店地址“上海市静安区延平路88号”与原审批通过地址不一致/),
    ).toBeInTheDocument();
  });

  it("opens the old-store upgrade form with carried-over data after a valid conversion", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: "转老店升级" }));
    await user.click(screen.getByLabelText("上海江湾城店"));
    await user.click(screen.getByRole("button", { name: "确认转换" }));

    expect(screen.queryByRole("heading", { name: "老店升级申请表单" })).not.toBeInTheDocument();
    expect(screen.getByDisplayValue("旗舰仓")).toBeInTheDocument();
    expect(
      screen.getAllByDisplayValue("上海市杨浦区政民路318号创智天地广场B2栋").length,
    ).toBeGreaterThan(0);
    expect(screen.getByDisplayValue("上海江湾城店")).toBeInTheDocument();
    expect(screen.getByText("杨浦创智天地房产证明.pdf")).toBeInTheDocument();
    expect(screen.getByText("杨浦创智天地申请确认书.pdf")).toBeInTheDocument();
  });

  it("closes the original new-store record after old-store upgrade submission and creates a new approved upgrade record", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: "转老店升级" }));
    await user.click(screen.getByLabelText("上海江湾城店"));
    await user.click(screen.getByRole("button", { name: "确认转换" }));
    await user.click(screen.getByRole("button", { name: "提交老店升级申请" }));

    expect(screen.getByText("老店升级申请已提交")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "返回申请记录" }));

    const sourceRow = screen.getByText("创智天地候选店").closest("tr");
    const upgradeRow = screen.getByText("上海江湾城店").closest("tr");

    expect(sourceRow).not.toBeNull();
    expect(upgradeRow).not.toBeNull();

    expect(within(sourceRow as HTMLElement).getByText("已关闭")).toBeInTheDocument();
    expect(
      within(sourceRow as HTMLElement).queryByRole("button", { name: "转老店升级" }),
    ).not.toBeInTheDocument();
    expect(within(upgradeRow as HTMLElement).getByText("审批通过")).toBeInTheDocument();
  });

  it("opens the pending-info modal from the status entry and then routes to the detail page", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: "点位信息待完善" }));

    expect(screen.getByText("当前申请已进入待完善阶段")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "查看申请详情" }));

    expect(screen.queryByRole("heading", { name: "新店申请详情" })).not.toBeInTheDocument();
    expect(
      screen.getByText("当前申请处于点位信息待完善阶段，可继续补填或转为老店升级。"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "转老店升级" })).toBeInTheDocument();
  });

  it("opens the continue-new-store form with the point data carried over", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: "点位信息待完善" }));
    await user.click(screen.getByRole("button", { name: "查看申请详情" }));
    await user.click(screen.getByRole("button", { name: "继续完善新店申请" }));

    expect(screen.queryByRole("heading", { name: "继续完善新店申请" })).not.toBeInTheDocument();
    expect(screen.getByText("可控仓申请类型")).toBeInTheDocument();
    expect(screen.getByDisplayValue("上海校园便利服务商")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("上海市杨浦区政民路318号创智天地广场B2栋"),
    ).toBeInTheDocument();
    expect(screen.getByText("店铺信息填写")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "提交点位申请" })).toBeInTheDocument();
  });

  it(
    "submits the continued new-store application after the missing fields are completed",
    async () => {
      const user = userEvent.setup();

      render(<App />);

      await user.click(screen.getByRole("button", { name: "点位信息待完善" }));
      await user.click(screen.getByRole("button", { name: "查看申请详情" }));
      await user.click(screen.getByRole("button", { name: "继续完善新店申请" }));

      await user.clear(screen.getByRole("textbox", { name: "店铺名称" }));
      await user.type(screen.getByRole("textbox", { name: "店铺名称" }), "创智天地旗舰店");
      await user.type(screen.getByRole("textbox", { name: "店铺编号" }), "STORE_101");
      await user.click(screen.getByRole("button", { name: "提交点位申请" }));

      expect(screen.getByText("新店申请补充已提交")).toBeInTheDocument();
      expect(screen.getByText("创智天地旗舰店")).toBeInTheDocument();
    },
    10000,
  );

  it("protects the legal representative account and forces a handover before deactivation", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("menuitem", { name: "员工维护" }));

    expect(screen.queryByRole("heading", { name: "员工维护" })).not.toBeInTheDocument();
    expect(screen.getByText("当前法人账号：陈可欣")).toBeInTheDocument();
    expect(screen.queryByText("保护规则说明")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "停用法人账号" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "删除法人账号" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "保护规则" }));

    expect(
      screen.getByText("误停用或误删除法人账号会导致无法签约平台协议和缴纳保证金。"),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "立即发起移交" }));
    await user.click(screen.getByLabelText("李晓晨"));
    await user.click(screen.getByRole("button", { name: "确认移交" }));

    expect(screen.getByText("当前法人账号：李晓晨")).toBeInTheDocument();
  });

  it("disables repeat deactivation after an employee has already been stopped", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("menuitem", { name: "员工维护" }));

    const storeManagerRow = screen.getByText("周雨桐").closest("tr");

    expect(storeManagerRow).not.toBeNull();

    await user.click(within(storeManagerRow as HTMLElement).getByRole("button", { name: "停用" }));
    await user.click(screen.getByRole("button", { name: /确\s*认/ }));

    expect(within(storeManagerRow as HTMLElement).getByText("已停用")).toBeInTheDocument();
    expect(
      within(storeManagerRow as HTMLElement).getByRole("button", { name: "停用周雨桐账号" }),
    ).toBeDisabled();
  });

  it("simplifies legal-account actions to the two valid choices", async () => {
    const user = userEvent.setup();

    render(<App />);
    await user.click(screen.getByRole("menuitem", { name: "员工维护" }));

    const legalRow = screen.getByText("chenkexin@retail.demo").closest("tr");

    expect(legalRow).not.toBeNull();
    expect(
      within(legalRow as HTMLElement).getByRole("button", { name: "发起移交" }),
    ).toBeInTheDocument();
    expect(
      within(legalRow as HTMLElement).getByRole("button", { name: "保护规则" }),
    ).toBeInTheDocument();
    expect(
      within(legalRow as HTMLElement).queryByRole("button", { name: "停用法人账号" }),
    ).not.toBeInTheDocument();
    expect(
      within(legalRow as HTMLElement).queryByRole("button", { name: "删除法人账号" }),
    ).not.toBeInTheDocument();
    expect(
      within(legalRow as HTMLElement).queryByRole("button", { name: "查看保护规则" }),
    ).not.toBeInTheDocument();
    expect(
      within(legalRow as HTMLElement).getByRole("button", { name: "发起移交" }),
    ).toHaveClass("record-action-button");
    expect(
      within(legalRow as HTMLElement).getByRole("button", { name: "保护规则" }),
    ).toHaveClass("record-action-button");
    expect(screen.queryByText("当前为法人账号，需先完成移交后再停用或删除。")).not.toBeInTheDocument();
    expect(
      screen.queryByText("该账号已进入待停用状态，系统会保留当前处理进度。"),
    ).not.toBeInTheDocument();
    expect(
      within(legalRow as HTMLElement).getByRole("button", { name: "发起移交" }).closest(
        ".employee-action-row",
      ),
    ).not.toBeNull();
  });

  it("defaults analytics to the recommended reference data when calendars are available", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("menuitem", { name: "校园经营分析" }));

    expect(screen.queryByRole("heading", { name: "校园订单统计" })).not.toBeInTheDocument();
    expect(screen.getByText("128,420")).toBeInTheDocument();
    expect(screen.getAllByText("参考订单量").length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "查看原始数据" })).toBeInTheDocument();
    expect(
      screen.queryByRole("radio", { name: "剔除假期影响后看" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "校历管理" })).toBeInTheDocument();
  });

  it("lets users switch to original data only as a secondary view when reference data is available", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("menuitem", { name: "校园经营分析" }));
    await user.click(screen.getByRole("button", { name: "查看原始数据" }));

    expect(screen.getByText("89,240")).toBeInTheDocument();
    expect(screen.getAllByText("原始订单量").length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "切回参考数据" })).toBeInTheDocument();
  });

  it("opens calendar management and shows continuous holiday ranges instead of fragmented monthly days", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("menuitem", { name: "校园经营分析" }));
    await user.click(screen.getByRole("button", { name: "校历管理" }));

    expect(screen.getByText("校历导入与设置")).toBeInTheDocument();
    expect(screen.getByText("寒假 2026-01-20 至 2026-02-16")).toBeInTheDocument();
    expect(screen.getByText("返校过渡 2026-02-17 至 2026-02-20")).toBeInTheDocument();
    expect(screen.getByText("手动调整日期")).toBeInTheDocument();
  });

  it(
    "allows manual calendar adjustment for campuses without imported schedules",
    async () => {
      const user = userEvent.setup();

      render(<App />);

      await user.click(screen.getByRole("menuitem", { name: "校园经营分析" }));
      await user.click(screen.getByRole("button", { name: "collapsed Demo 场景切换（仅演示）" }));
      await user.click(screen.getByRole("button", { name: "校历缺失场景" }));
      await user.click(screen.getByRole("button", { name: "校历管理" }));
      await user.click(screen.getAllByRole("button", { name: "去调整" })[0]);

      const dialogs = screen.getAllByRole("dialog");
      const dialog = dialogs[dialogs.length - 1] as HTMLElement;

      expect(within(dialog).getByDisplayValue("人工补录日期")).toBeInTheDocument();
      expect(within(dialog).getByRole("button", { name: "新增日期区间" })).toBeInTheDocument();
      await user.click(within(dialog).getByLabelText("作用方式"));
      expect(screen.getByText("先观察")).toBeInTheDocument();
      expect(screen.getByText("只备注")).toBeInTheDocument();

      await user.type(within(dialog).getByLabelText("阶段名称"), "寒假");
      await user.type(within(dialog).getByPlaceholderText("开始日期"), "2026-01-18");
      await user.keyboard("{Enter}");
      await user.type(within(dialog).getByPlaceholderText("结束日期"), "2026-02-15");
      await user.keyboard("{Enter}");
      await user.click(within(dialog).getByRole("button", { name: "保存并重新计算" }));

      expect(await screen.findByText("华东师范大学闵行校区的手动调整已保存。")).toBeInTheDocument();
      expect(screen.getByText("寒假 2026-01-18 至 2026-02-15")).toBeInTheDocument();
      expect(screen.getByText("人工补录日期")).toBeInTheDocument();
    },
    10000,
  );

  it("replaces the redundant status card with calendar coverage metrics", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("menuitem", { name: "校园经营分析" }));

    const coverageCard = screen.getByText("校历覆盖校区").closest(".analytics-summary-card");

    expect(screen.queryByText("数据状态")).not.toBeInTheDocument();
    expect(coverageCard).not.toBeNull();
    expect(within(coverageCard as HTMLElement).getByText("校历覆盖校区")).toBeInTheDocument();
    expect(within(coverageCard as HTMLElement).getByText("3")).toBeInTheDocument();
    expect(within(coverageCard as HTMLElement).getByText("/ 3")).toBeInTheDocument();
  });

  it("shows only original data when calendars are missing, then restores reference data after import", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("menuitem", { name: "校园经营分析" }));
    await user.click(screen.getByRole("button", { name: "collapsed Demo 场景切换（仅演示）" }));
    await user.click(screen.getByRole("button", { name: "校历缺失场景" }));

    expect(screen.getByText("学校假期信息还没配好，先按原始数据看。")).toBeInTheDocument();
    expect(screen.getByText("76,430")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "查看原始数据" }),
    ).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "导入学校官网校历" }));

    expect(screen.getByText("官网校历导入")).toBeInTheDocument();
    await user.click(screen.getByLabelText("华东师范大学官网校历 PDF"));
    await user.click(screen.getByRole("button", { name: "导入并生效" }));

    expect(screen.getByText("101,860")).toBeInTheDocument();
    expect(screen.getAllByText("已按校历处理").length).toBeGreaterThan(0);
    expect(screen.getByRole("button", { name: "查看原始数据" })).toBeInTheDocument();
  });

  it("lets operators jump from point application records to the linked approval detail", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: "切换当前角色" }));
    await user.click(screen.getByRole("menuitem", { name: "运营后台" }));

    expect(screen.queryByRole("heading", { name: "点位审批管理" })).not.toBeInTheDocument();
    await user.click(screen.getAllByRole("button", { name: "查看详情" })[0]);

    expect(screen.getByText("审批详情 APR-202604-19")).toBeInTheDocument();
    expect(screen.getByText("审批流转记录")).toBeInTheDocument();
    expect(screen.getAllByText("待完善").length).toBeGreaterThan(0);
  });

  it("uses plain approval codes and a single detail entry for rejected rows as well", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: "切换当前角色" }));
    await user.click(screen.getByRole("menuitem", { name: "运营后台" }));

    const approvalCodeCell = screen.getByText("APR-202604-19").closest("td");

    expect(approvalCodeCell).not.toBeNull();
    expect(within(approvalCodeCell as HTMLElement).queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByText("审批详情待同步")).not.toBeInTheDocument();
    await user.click(screen.getAllByRole("button", { name: "查看详情" })[1]);
    expect(screen.getByText("审批详情 APR-202604-11")).toBeInTheDocument();
    expect(screen.getAllByText("审批驳回").length).toBeGreaterThan(0);
  });

  it("applies left-aligned layout classes to the approval table", async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole("button", { name: "切换当前角色" }));
    await user.click(screen.getByRole("menuitem", { name: "运营后台" }));

    expect(screen.getByRole("columnheader", { name: "当前状态" })).toHaveClass(
      "approval-column-header",
    );
    expect(screen.getByRole("columnheader", { name: "操作" })).toHaveClass(
      "approval-column-header",
    );

    const approvalCodeCell = screen.getByText("APR-202604-19").closest("td");

    expect(approvalCodeCell).not.toBeNull();
    expect(approvalCodeCell).toHaveClass("approval-column-cell");
    expect(screen.getAllByRole("button", { name: "查看详情" })[0]).toHaveClass(
      "approval-action-button",
    );
  });

  it("switches the demo between service-provider and operator roles", async () => {
    const user = userEvent.setup();

    render(<App />);

    expect(screen.getByRole("button", { name: "切换当前角色" })).toHaveTextContent("服务商端");
    expect(screen.queryByRole("heading", { name: "申请记录" })).not.toBeInTheDocument();
    expect(screen.getByRole("navigation")).toHaveTextContent("申请记录");
    expect(screen.queryByRole("menuitem", { name: "审批管理" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "切换当前角色" }));
    await user.click(screen.getByRole("menuitem", { name: "运营后台" }));

    expect(screen.getByRole("button", { name: "切换当前角色" })).toHaveTextContent("运营后台");
    expect(screen.queryByRole("heading", { name: "点位审批管理" })).not.toBeInTheDocument();
    expect(screen.getByRole("navigation")).toHaveTextContent("审批管理");
    expect(screen.getByRole("menuitem", { name: "审批管理" })).toBeInTheDocument();
    expect(screen.queryByRole("menuitem", { name: "员工维护" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "切换当前角色" }));
    await user.click(screen.getByRole("menuitem", { name: "服务商端" }));

    expect(screen.queryByRole("heading", { name: "申请记录" })).not.toBeInTheDocument();
    expect(screen.getByRole("navigation")).toHaveTextContent("申请记录");
    expect(screen.getByRole("menuitem", { name: "员工维护" })).toBeInTheDocument();
  });
});
