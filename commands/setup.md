---
description: 将 claude-hud 配置为你的状态栏
allowed-tools: Bash, Read, AskUserQuestion
---

把 claude-hud 设置为 Claude Code 的状态栏。`${CLAUDE_PLUGIN_ROOT}` 是本插件的安装目录。`{花括号}` 中的占位符需要根据前面步骤的结果填入。

## 第 1 步：确定 shell

Claude Code 在 macOS、Linux 和 WSL 上通过 bash 运行 statusLine 命令。在 Windows 上，如果安装了 Git Bash 就用它，否则使用 PowerShell。根据环境的 `Platform:` 和 `Shell:` 选择 `{SHELL}`。在 `win32` 上还要用 Bash 工具运行 `echo $OSTYPE`。

| 平台 | Shell / OSTYPE | `{SHELL}` |
|---|---|---|
| `darwin`、`linux`（含 WSL） | 任意 | `posix` |
| `win32` | Shell 为 `bash`，或 OSTYPE 为 `msys` / `cygwin` | `gitbash` |
| `win32` | 其他情况 | `powershell` |

使用 `gitbash` 时，每一步都要用 bash 语法：如果写成 PowerShell 的 `$env:...`，bash 会在 PowerShell 运行前就展开它。在 WSL 中，插件必须安装在 Linux 侧，不能装在 Windows 侧。

## 第 2 步：查找运行时

| `{SHELL}` | 命令 |
|---|---|
| `posix` | `command -v bun 2>/dev/null \|\| command -v node 2>/dev/null` |
| `gitbash` | `command -v node 2>/dev/null`（Windows 需要 Node.js，不要使用 Bun） |
| `powershell` | `(Get-Command node -ErrorAction SilentlyContinue).Source` |

结果记为 `{RUNTIME}`。状态栏会和后续步骤中的辅助脚本使用同一个运行时。

如果什么都没找到，就停下来。告诉用户当前 shell 找不到 Node.js（或 Bun），即使 Claude Code 本身已经安装。引导他们安装 Node.js LTS（https://nodejs.org，Windows 上可用 `winget install OpenJS.NodeJS.LTS`）或 Bun（https://bun.sh，仅限 macOS 和 Linux），然后请他们重启 shell 并重新运行 `/claude-hud:setup`。

## 第 3 步：检查当前设置

```bash
"{RUNTIME}" "${CLAUDE_PLUGIN_ROOT}/scripts/setup.mjs" inspect --shell {SHELL}
```

在 PowerShell 中，命令前要加 `&`。辅助脚本会输出一段 JSON：

- `settingsPath`
- `command`：它将要安装的 statusLine 命令
- `existing`：当前 statusLine 的类型，取值为 `none`、`claude-hud` 或 `other`
- `existingPreview`：当前命令脱敏后的预览

如果命令失败（例如 settings.json 不是合法 JSON），显示错误并停止。不要手动编辑 settings.json。

如果 `existing` 为 `other`，用 AskUserQuestion 询问：

- header："已有状态栏"
- question："你已经有一个状态栏：`{existingPreview}`。要替换为 claude-hud 吗？替换前会先备份 settings.json。"
- options："替换它" / "保留当前状态栏"

选择"保留"时，不要做任何修改，直接停止。只展示 `existingPreview`，永远不要展示原始命令，因为其中可能包含密钥。

## 第 4 步：安装

```bash
"{RUNTIME}" "${CLAUDE_PLUGIN_ROOT}/scripts/setup.mjs" install --shell {SHELL}
```

这一步会：

- 把启动器复制到 `<配置目录>/plugins/claude-hud/statusline.mjs`。启动器总是运行最新安装的 claude-hud，因此插件更新后无需再次运行 setup。
- 在 `gitbash` 下，会在旁边写入一个 `statusline.cmd` 垫片。通过 cmd.exe 启动可以避免 Git Bash 留下挂起的 `node.exe` 进程。
- 将 settings.json 备份到报告中给出的 `backupPath`。
- 将被替换的命令保存到 `previousCommandPath`。
- 写入 `statusLine`，并保留其他所有设置。

用示例输入测试结果：

```bash
echo '{"model":{"display_name":"Opus"},"context_window":{"used_percentage":12,"context_window_size":200000}}' | {COMMAND}
```

`{COMMAND}` 是报告中的 `command`。在 `powershell` 下，改为直接测试启动器：`'<json>' | & "{RUNTIME}" "<配置目录>\plugins\claude-hud\statusline.mjs"`。

几秒内应打印出两行 HUD。如果报错或没有输出：

1. 显示输出。
2. 把 `backupPath` 复制回 `settingsPath` 以恢复备份。
3. 停止。

## 第 5 步：收尾

settings.json 一变，Claude Code 就会运行新命令，所以 HUD 应该已经显示在输入框下方。用 AskUserQuestion 询问：

- header："claude-hud"
- question："设置完成！HUD 应该已经显示在输入框下方。它工作正常吗？"
- options：
  - "正常，并给仓库点个星 ⭐"：运行 `gh repo star jarrodwatts/claude-hud`。如果 `gh` 不存在或没有该子命令，运行 `gh api -X PUT /user/starred/jarrodwatts/claude-hud`，或把 https://github.com/jarrodwatts/claude-hud 提供给他们。
  - "正常，可以用了"
  - "不正常，有问题"

**如果正常**，用一句话告诉用户：有任何想改的，直接说就行，例如"在 HUD 里显示工具活动"或"使用紧凑布局"，也可以运行 `/claude-hud:configure`。

**如果不正常**，按顺序检查：

1. 重新运行第 4 步的测试并显示输出。
2. 如果没有输出，确认插件已安装：`ls "<配置目录>/plugins/cache/"*/claude-hud/`。启动器找不到安装时不会打印任何内容。如果目录不存在，用 `/plugin install claude-hud` 重新安装。
3. 如果运行时路径变了（nvm、mise、asdf 升级会改变路径），重新运行 setup。
4. 在 Windows 上，如果存在大量空闲的 `node.exe` 进程，说明 setup 早于 cmd.exe 垫片。结束这些进程并重新运行 setup。
5. 要回到之前的状态栏，把 `backupPath` 复制回 `settingsPath`。
