# AGENTS.md

本文档为 AI 编码代理提供项目指南。

## 项目概述

Claude HUD 是一个 Claude Code 插件，显示实时多行状态栏。它展示上下文健康度、工具活动、代理状态和待办事项进度。

## 构建命令

```bash
# 安装依赖
npm ci

# 构建 TypeScript 到 dist/
npm run build

# 开发模式（监听文件变化）
npm run dev

# 运行所有测试
npm test

# 运行测试并生成覆盖率报告
npm run test:coverage

# 更新测试快照
npm run test:update-snapshots

# 运行单个测试文件
npm run build && node --test tests/xxx.test.js

# 使用示例 stdin 数据测试
npm run test:stdin
```

## 代码风格

### TypeScript 配置

- 目标: ES2022
- 模块: NodeNext (ESM)
- 严格模式已启用
- 输出目录: `dist/`

### 导入规范

```typescript
// Node.js 内置模块使用 node: 前缀
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

// 类型导入使用 import type
import type { RenderContext } from './types.js';
import type { HudConfig } from './config.js';

// 本地模块导入必须包含 .js 扩展名（ESM 要求）
import { readStdin } from './stdin.js';
import { parseTranscript } from './transcript.js';
```

### 命名约定

| 类型 | 命名风格 | 示例 |
|------|----------|------|
| 变量/函数 | camelCase | `getModelName`, `contextPercent` |
| 类型/接口 | PascalCase | `StdinData`, `RenderContext`, `HudConfig` |
| 常量 | UPPER_SNAKE_CASE | `DEFAULT_CONFIG`, `RESET` |
| 私有函数 | 无下划线前缀 | 内部辅助函数直接命名 |
| 类型参数 | PascalCase | `MainDeps` |

### 函数风格

```typescript
// 优先使用命名导出
export function getContextPercent(stdin: StdinData): number { /* ... */ }

// 异步函数使用 async/await
export async function loadConfig(): Promise<HudConfig> {
  try { /* ... */ } catch { return DEFAULT_CONFIG; }
}

// 纯函数优先，副作用通过依赖注入
export function formatSessionDuration(sessionStart?: Date, now = () => Date.now()): string { /* ... */ }
```

### 类型定义

```typescript
// 接口定义数据结构
export interface StdinData {
  transcript_path?: string;
  cwd?: string;
  model?: { id?: string; display_name?: string };
}

// 类型别名定义联合类型
export type LineLayoutType = 'compact' | 'expanded';
export type HudElement = 'project' | 'context' | 'usage';
```

### 错误处理

```typescript
// 简洁的错误处理，不记录堆栈
try {
  const result = JSON.parse(content);
  return result;
} catch {
  return DEFAULT_CONFIG;
}

// 顶层错误使用 Error 消息
catch (error) {
  deps.log('[claude-hud] Error:', error instanceof Error ? error.message : 'Unknown error');
}
```

### 代码格式

- 无分号
- 使用 `const` 和 `let`，避免 `var`
- 字符串使用单引号
- 避免不必要的类型断言，使用类型守卫

## 测试规范

### 测试框架

使用 Node.js 内置测试框架：

```javascript
import { test } from 'node:test';
import assert from 'node:assert/strict';
```

### 测试风格

```javascript
// 测试描述使用完整句子
test('getContextPercent returns 0 when data is missing', () => {
  assert.equal(getContextPercent({}), 0);
});

// 测试边界条件
test('native percentage clamps values over 100 to 100', () => {
  assert.equal(getContextPercent({ context_window: { used_percentage: 150 } }), 100);
});
```



## 架构要点

### 数据流

```
Claude Code → stdin JSON → parse → render lines → stdout
           ↘ transcript_path → parse JSONL → tools/agents/todos
```

### 关键文件

| 文件 | 职责 |
|------|------|
| `src/index.ts` | 入口点，协调各模块 |
| `src/stdin.ts` | 解析 Claude 的 JSON 输入 |
| `src/transcript.ts` | 解析会话 JSONL 文件 |
| `src/config.ts` | 加载/验证用户配置 |
| `src/render/index.ts` | 渲染协调器 |

## 依赖

- 运行时: Node.js 18+
- 构建: TypeScript 5
- 测试: Node.js 内置测试框架

## 提交前检查

```bash
npm run build && npm test
```