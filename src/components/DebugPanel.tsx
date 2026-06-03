'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface LogEntry {
  time: string;
  type: 'log' | 'error' | 'warn';
  args: any[];
}

export default function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('debug') === '1' || localStorage.getItem('debug_mbti') === '1';
  });
  const logsEndRef = useRef<HTMLDivElement>(null);
  const originalConsole = useRef<{
    log: typeof console.log;
    error: typeof console.error;
    warn: typeof console.warn;
  } | null>(null);

  // 拦截 console 日志
  useEffect(() => {
    if (!isVisible) return;

    // 保存原始 console
    originalConsole.current = {
      log: console.log,
      error: console.error,
      warn: console.warn,
    };

    const addLog = (type: 'log' | 'error' | 'warn', args: any[]) => {
      const time = new Date().toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 });
      setLogs((prev) => [...prev, { time, type, args }]);
    };

    console.log = (...args: any[]) => {
      originalConsole.current?.log(...args);
      addLog('log', args);
    };
    console.error = (...args: any[]) => {
      originalConsole.current?.error(...args);
      addLog('error', args);
    };
    console.warn = (...args: any[]) => {
      originalConsole.current?.warn(...args);
      addLog('warn', args);
    };

    return () => {
      if (originalConsole.current) {
        console.log = originalConsole.current.log;
        console.error = originalConsole.current.error;
        console.warn = originalConsole.current.warn;
      }
    };
  }, [isVisible]);

  // 自动滚动到底部
  useEffect(() => {
    if (isOpen && logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isOpen]);

  const handleClear = useCallback(() => {
    setLogs([]);
  }, []);

  const handleCopy = useCallback(() => {
    const text = logs
      .map((log) => {
        const prefix = `[${log.time}] [${log.type.toUpperCase()}]`;
        const content = log.args
          .map((arg) => {
            if (typeof arg === 'object') {
              try {
                return JSON.stringify(arg, null, 2);
              } catch {
                return String(arg);
              }
            }
            return String(arg);
          })
          .join(' ');
        return `${prefix} ${content}`;
      })
      .join('\n');
    navigator.clipboard.writeText(text).then(() => {
      alert('日志已复制到剪贴板');
    });
  }, [logs]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[9999] font-mono text-xs">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gray-900 text-white px-3 py-2 rounded-lg shadow-lg opacity-70 hover:opacity-100 transition-opacity"
        >
          🐛 调试
        </button>
      ) : (
        <div className="bg-gray-900 text-green-400 rounded-lg shadow-2xl w-[380px] max-h-[70vh] flex flex-col">
          {/* 标题栏 */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700">
            <span className="text-white font-bold">🐛 MBTI 调试面板</span>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
              ✕
            </button>
          </div>

          {/* 环境信息 */}
          <div className="px-3 py-2 border-b border-gray-700 text-gray-300 text-[11px] space-y-1">
            <div>UA: {navigator.userAgent.slice(0, 60)}...</div>
            <div>wx_env: {(window as any).__wxjs_environment || 'undefined'}</div>
            <div>wx: {typeof (window as any).wx !== 'undefined' ? '✅' : '❌'}</div>
            <div>wx.miniProgram: {typeof (window as any).wx?.miniProgram !== 'undefined' ? '✅' : '❌'}</div>
            <div>isMini: {(window as any).__wxjs_environment === 'miniprogram' || /miniProgram/i.test(navigator.userAgent) ? '✅' : '❌'}</div>
          </div>

          {/* 日志区域 */}
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1 min-h-[200px] max-h-[400px]">
            {logs.length === 0 && (
              <div className="text-gray-500 text-center py-4">暂无日志</div>
            )}
            {logs.map((log, index) => (
              <div
                key={index}
                className={`break-all ${
                  log.type === 'error' ? 'text-red-400' : log.type === 'warn' ? 'text-yellow-400' : 'text-green-400'
                }`}
              >
                <span className="text-gray-500">[{log.time}]</span>{' '}
                {log.args.map((arg, i) => (
                  <span key={i}>
                    {typeof arg === 'object' ? (
                      <span className="text-blue-300">{JSON.stringify(arg).slice(0, 200)}{JSON.stringify(arg).length > 200 ? '...' : ''}</span>
                    ) : (
                      String(arg)
                    )}
                    {i < log.args.length - 1 ? ' ' : ''}
                  </span>
                ))}
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>

          {/* 按钮栏 */}
          <div className="flex gap-2 px-3 py-2 border-t border-gray-700">
            <button
              onClick={handleClear}
              className="flex-1 bg-gray-700 text-white py-1.5 rounded hover:bg-gray-600 transition-colors"
            >
              清空日志
            </button>
            <button
              onClick={handleCopy}
              className="flex-1 bg-blue-600 text-white py-1.5 rounded hover:bg-blue-500 transition-colors"
            >
              复制日志
            </button>
            <button
              onClick={handleClose}
              className="flex-1 bg-red-600 text-white py-1.5 rounded hover:bg-red-500 transition-colors"
            >
              关闭调试
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
