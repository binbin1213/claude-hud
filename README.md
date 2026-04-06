# Claude HUD (中文优化版)

> **这是 [jarrodwatts/claude-hud](https://github.com/jarrodwatts/claude-hud) 的中文优化修改版**

Claude Code 插件，显示实时多行状态栏。展示上下文健康度、工具活动、代理状态和待办事项进度。

## 中文优化内容

本版本针对中文用户和智谱 AI 做了以下优化：

| 优化项 | 说明 |
|--------|------|
| **智谱配额支持** | 新增智谱 AI Token 和时间配额实时查询显示 |
| **中文界面** | 状态栏标签使用中文（配额、时间、上下文等） |
| **环境变量传递** | 修复了 `CLAUDE_CODE_SUBPROCESS_ENV_SCRUB` 导致的令牌无法传递问题 |
| **缓存优化** | 配额缓存时间延长至 5 分钟，减少 API 调用 |

### 配额显示效果

```
配额 token 12% (04-06 14:56) | 时间 10%
```

## 原作者项目

- **GitHub**: [jarrodwatts/claude-hud](https://github.com/jarrodwatts/claude-hud)
- 感谢原作者的出色工作

## 安装步骤

### 前置要求

- Claude Code v1.0.80+
- Node.js 18+ 或 Bun

### 一键安装（推荐）

在 Claude Code 中运行：

```
/plugin marketplace add binbin1213/claude-hud
/plugin install claude-hud
```

安装后**需要配置 `statusLine`** 才能显示配额信息。

### 智谱配额配置

编辑 `~/.claude/settings.json`，添加/修改以下内容：

```json
{
  "statusLine": {
    "type": "command",
    "command": "\"/Users/[你的用户名]/.claude/plugins/marketplaces/claude-hud/run-hud.sh\""
  }
}
```

**注意**: 将 `[你的用户名]` 替换为你的实际用户名。

wrapper 脚本会自动从 `settings.json` 读取 `ANTHROPIC_AUTH_TOKEN` 用于配额查询。

### 手动安装

如果一键安装不可用，编辑 `~/.claude/settings.json`，添加：

```json
"statusLine": {
  "type": "command",
  "command": "bash -c 'plugin_dir=$(ls -d \"$HOME\"/.claude/plugins/cache/claude-hud/claude-hud/*/ 2>/dev/null | head -1); exec node \"$plugin_dir/dist/index.js\"'"
}
```

## 配置说明

配置文件位置：`~/.claude/plugins/claude-hud/config.json`

### 完整配置示例

```json
{
  "lineLayout": "expanded",
  "showSeparators": false,
  "pathLevels": 1,
  "elementOrder": ["project", "context", "usage", "environment", "tools", "agents", "todos"],
  "gitStatus": {
    "enabled": true,
    "showDirty": true,
    "showAheadBehind": true,
    "showFileStats": true
  },
  "display": {
    "showModel": true,
    "showProject": true,
    "showContextBar": true,
    "contextValue": "percent",
    "showConfigCounts": true,
    "showDuration": true,
    "showSpeed": true,
    "showTokenBreakdown": true,
    "showUsage": true,
    "usageBarEnabled": true,
    "showTools": true,
    "showAgents": true,
    "showTodos": true,
    "showSessionName": true,
    "autocompactBuffer": "enabled",
    "usageThreshold": 0,
    "sevenDayThreshold": 80,
    "environmentThreshold": 0
  },
  "usage": {
    "cacheTtlSeconds": 300,
    "failureCacheTtlSeconds": 30
  },
  "colors": {
    "context": "green",
    "usage": "brightBlue",
    "warning": "yellow",
    "usageWarning": "brightMagenta",
    "critical": "red"
  }
}
```

### 配置项说明

#### 布局设置

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `lineLayout` | `"compact"` \| `"expanded"` | `"expanded"` | 布局模式。compact 单行紧凑，expanded 多行展开 |
| `showSeparators` | boolean | `false` | 是否显示分隔线 |
| `pathLevels` | `1` \| `2` \| `3` | `1` | 项目路径显示层级 |
| `elementOrder` | string[] | 见上方 | 元素显示顺序 |

#### Git 状态设置

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `gitStatus.enabled` | boolean | `true` | 是否显示 Git 状态 |
| `gitStatus.showDirty` | boolean | `true` | 显示是否有未提交更改（*标记） |
| `gitStatus.showAheadBehind` | boolean | `true` | 显示领先/落后远程的提交数 |
| `gitStatus.showFileStats` | boolean | `true` | 显示文件变更统计 |

#### 显示设置

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `display.showModel` | boolean | `true` | 显示模型名称 |
| `display.showProject` | boolean | `true` | 显示项目路径 |
| `display.showContextBar` | boolean | `true` | 显示上下文进度条 |
| `display.contextValue` | `"percent"` \| `"tokens"` \| `"remaining"` | `"percent"` | 上下文值显示方式 |
| `display.showConfigCounts` | boolean | `true` | 显示配置文件数量 |
| `display.showDuration` | boolean | `true` | 显示会话时长 |
| `display.showSpeed` | boolean | `true` | 显示输出速度 |
| `display.showTokenBreakdown` | boolean | `true` | 高上下文时显示 Token 明细 |
| `display.showUsage` | boolean | `true` | 显示用量信息 |
| `display.usageBarEnabled` | boolean | `true` | 显示用量进度条 |
| `display.showTools` | boolean | `true` | 显示工具活动 |
| `display.showAgents` | boolean | `true` | 显示代理活动 |
| `display.showTodos` | boolean | `true` | 显示待办事项 |
| `display.showSessionName` | boolean | `true` | 显示会话名称 |
| `display.autocompactBuffer` | `"enabled"` \| `"disabled"` | `"enabled"` | 自动压缩缓冲计算 |
| `display.usageThreshold` | number (0-100) | `0` | 用量显示阈值 |
| `display.sevenDayThreshold` | number (0-100) | `80` | 7天用量显示阈值 |
| `display.environmentThreshold` | number (0-100) | `0` | 环境配置显示阈值 |

#### 用量缓存设置

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `usage.cacheTtlSeconds` | number | `300` | 成功请求缓存时间（秒） |
| `usage.failureCacheTtlSeconds` | number | `30` | 失败请求缓存时间（秒） |

#### 颜色设置

可用颜色：`red`、`green`、`yellow`、`magenta`、`cyan`、`brightBlue`、`brightMagenta`

| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| `colors.context` | `"green"` | 上下文进度条颜色 |
| `colors.usage` | `"brightBlue"` | 用量进度条颜色 |
| `colors.warning` | `"yellow"` | 警告状态颜色 |
| `colors.usageWarning` | `"brightMagenta"` | 用量警告颜色 |
| `colors.critical` | `"red"` | 临界状态颜色 |

### 常用配置示例

#### 显示所有信息

```json
{
  "display": {
    "showTools": true,
    "showAgents": true,
    "showTodos": true,
    "showDuration": true,
    "showSessionName": true
  }
}
```

#### 紧凑单行模式

```json
{
  "lineLayout": "compact",
  "showSeparators": true
}
```

#### 只显示核心信息

```json
{
  "display": {
    "showModel": true,
    "showContextBar": true,
    "showUsage": false,
    "showTools": false,
    "showAgents": false,
    "showTodos": false
  },
  "gitStatus": {
    "enabled": false
  }
}
```

#### 自定义颜色主题

```json
{
  "colors": {
    "context": "cyan",
    "usage": "magenta",
    "warning": "yellow",
    "usageWarning": "brightMagenta",
    "critical": "red"
  }
}
```

## 开发

```bash
git clone https://github.com/binbin1213/claude-hud
cd claude-hud
npm ci && npm run build
npm test
```

## 许可证

MIT — 详见 [LICENSE](LICENSE)

本修改版遵循原项目的 MIT 许可证。
