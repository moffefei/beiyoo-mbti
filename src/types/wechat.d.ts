interface WxMiniProgram {
  navigateTo(params: {
    url: string;
    success?: (res: unknown) => void;
    fail?: (err: unknown) => void;
    complete?: (res: unknown) => void;
  }): void;
  navigateBack(params?: { delta?: number }): void;
  switchTab(params: { url: string }): void;
  reLaunch(params: { url: string }): void;
  redirectTo(params: { url: string }): void;
  getEnv(callback: (res: { miniprogram: boolean }) => void): void;
  postMessage(params: { data: Record<string, unknown> }): void;
}

interface Wx {
  miniProgram: WxMiniProgram;
}

declare const wx: Wx;

interface Window {
  __wxjs_environment?: string;
  wx?: Wx;
  WeixinJSBridge?: {
    invoke(name: string, params: Record<string, unknown>, callback?: (res: unknown) => void): void;
  };
}
