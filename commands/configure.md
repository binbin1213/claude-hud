---
description: 配置 HUD 显示选项（布局、语言、预设、显示元素），同时保留手动设置的高级覆盖项
allowed-tools: Read, Write, AskUserQuestion
---

# 配置 Claude HUD

## 读取当前配置

配置目录是设置了 `$CLAUDE_CONFIG_DIR` 时的该目录，否则是 `~/.claude`。如果以下文件存在，读取它们：

1. `plugins/claude-hud/config.json`：基础配置。本命令只写入这个文件。
2. 配置目录下的 `claude-hud.json`：手动维护的按目录覆盖配置。它结构相同，值优先。永远不要写入或删除它。

生效配置是基础配置叠加覆盖配置后的结果：嵌套对象按键合并，数组和标量则整个替换。缺失的键使用 README 配置表中的默认值。描述当前状态时使用生效值。

## 询问

用 AskUserQuestion 询问，分两批，每批最多四个问题。每道题的选项里写出当前值。多选问题中，被选中的项设为 `true`，未选中的设为 `false`。

**布局**（单选）
- "展开"：`lineLayout: "expanded"`, `showSeparators: false`
- "紧凑"：`lineLayout: "compact"`, `showSeparators: false`
- "紧凑 + 分隔线"：`lineLayout: "compact"`, `showSeparators: true`

**活动行**（多选）
- "工具"：`display.showTools`
- "子代理"：`display.showAgents`
- "待办"：`display.showTodos`
- "技能与 MCP"：`display.showSkills`, `display.showMcp`

**会话信息**（多选）
- "费用"：`display.showCost`
- "时长"：`display.showDuration`
- "会话名称"：`display.showSessionName`
- "推理强度"：`display.showEffortLevel`

**用量限制**（单选）
- "进度条（默认）"：`display.showUsage: true`, `display.usageBarEnabled: true`, `display.usageCompact: false`
- "文本"：`display.showUsage: true`, `display.usageBarEnabled: false`, `display.usageCompact: false`
- "紧凑"：`display.showUsage: true`, `display.usageCompact: true`
- "隐藏"：`display.showUsage: false`

**Git**（单选）
- "分支 + 未提交标记（默认）"：`gitStatus.enabled: true`, `showDirty: true`, `showAheadBehind: false`, `showFileStats: false`
- "仅分支"：`gitStatus.enabled: true`, `showDirty: false`, `showAheadBehind: false`, `showFileStats: false`
- "领先/落后"：`gitStatus.enabled: true`, `showDirty: true`, `showAheadBehind: true`, `showFileStats: false`
- "文件统计"：`gitStatus.enabled: true`, `showDirty: true`, `showAheadBehind: false`, `showFileStats: true`

**语言**（单选）
- "保持当前"
- "简体中文"：`language: "zh-Hans"`
- "English"：`language: "en"`
- "繁體中文"：`language: "zh-Hant"`

**自定义行**（单选）
- "保持当前"
- "输入文本"：询问文本（最多 80 个字符），保存为 `display.customLine`
- "移除"：仅当已设置时显示；保存 `display.customLine: ""`

如果用户取消任何问题，说"已取消配置。"并停止。

## 预览并确认

将改动与生效配置比较，算出发生变化的键。

- 如果没有变化，说"无需更改 - 配置保持不变。"并停止。
- 否则逐行显示每个变化的键：`键: 旧值 → 新值`。
- 如果某个变化的键同时也在 `claude-hud.json` 中设置过，警告覆盖配置仍然优先，并显示生效值。

然后询问"保存这些更改吗？"

## 写入

写入 `plugins/claude-hud/config.json`，必要时创建目录。从现有的基础文件开始，只改选中的键。其他所有键保持原样，包括本命令不询问的设置，例如 `colors`、阈值、`elementOrder`、`mergeGroups` 和 `display.externalUsage*`。写入合法 JSON，使用 2 空格缩进。

然后说："配置已保存！HUD 会在下次刷新时生效。"并说明 README 记录了其他所有选项。
