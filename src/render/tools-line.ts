import type { RenderContext } from '../types.js';
import { yellow, green, cyan, dim } from './colors.js';

const toolNameChinese: Record<string, string> = {
  'Read': '读取',
  'Edit': '编辑',
  'Bash': '命令',
  'Grep': '搜索',
  'Glob': '查找',
  'Agent': '代理',
  'Write': '写入',
  'TaskOutput': '任务输出',
  'TaskCreate': '任务创建',
  'TaskUpdate': '任务更新',
  'TaskList': '任务列表',
  'AskUserQuestion': '询问用户',
  'WebFetch': '网页获取',
  'WebSearch': '网页搜索',
  'Skill': '技能',
  'NotebookEdit': '笔记本编辑',
  'Mcp': 'MCP'
};

function getToolName(name: string): string {
  return toolNameChinese[name] || name;
}

export function renderToolsLine(ctx: RenderContext): string | null {
  const { tools } = ctx.transcript;

  if (tools.length === 0) {
    return null;
  }

  const parts: string[] = [];

  const runningTools = tools.filter((t) => t.status === 'running');
  const completedTools = tools.filter((t) => t.status === 'completed' || t.status === 'error');

  for (const tool of runningTools.slice(-2)) {
    const target = tool.target ? truncatePath(tool.target) : '';
    const displayName = getToolName(tool.name);
    parts.push(`${yellow('◐')} ${cyan(displayName)}${target ? dim(`: ${target}`) : ''}`);
  }

  const toolCounts = new Map<string, number>();
  for (const tool of completedTools) {
    const count = toolCounts.get(tool.name) ?? 0;
    toolCounts.set(tool.name, count + 1);
  }

  const sortedTools = Array.from(toolCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  for (const [name, count] of sortedTools) {
    const displayName = getToolName(name);
    parts.push(`${green('✓')} ${displayName} ${dim(`×${count}`)}`);
  }

  if (parts.length === 0) {
    return null;
  }

  return parts.join(' | ');
}

function truncatePath(path: string, maxLen: number = 20): string {
  // Normalize Windows backslashes to forward slashes for consistent display
  const normalizedPath = path.replace(/\\/g, '/');

  if (normalizedPath.length <= maxLen) return normalizedPath;

  // Split by forward slash (already normalized)
  const parts = normalizedPath.split('/');
  const filename = parts.pop() || normalizedPath;

  if (filename.length >= maxLen) {
    return filename.slice(0, maxLen - 3) + '...';
  }

  return '.../' + filename;
}
