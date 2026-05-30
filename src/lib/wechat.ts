const WX_SDK_URL = 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js';

export function isWeChatMiniProgram(): boolean {
  if (typeof window === 'undefined') return false;
  if ((window as any).__wxjs_environment === 'miniprogram') return true;
  if (/miniProgram/i.test(navigator.userAgent)) return true;
  return false;
}

let sdkLoadPromise: Promise<void> | null = null;

export function loadWeChatSDK(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('Not in browser'));
  if ((window as any).wx) return Promise.resolve();

  if (!sdkLoadPromise) {
    sdkLoadPromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = WX_SDK_URL;
      script.onload = () => {
        if ((window as any).wx) {
          resolve();
        } else {
          reject(new Error('WeChat SDK loaded but wx not found'));
        }
      };
      script.onerror = () => reject(new Error('Failed to load WeChat SDK'));
      document.head.appendChild(script);
    });
  }
  return sdkLoadPromise;
}

export async function navigateToSaveImage(imageUrl: string): Promise<void> {
  await loadWeChatSDK();

  const wxObj = (window as any).wx;
  if (!wxObj?.miniProgram) {
    throw new Error('wx.miniProgram not available');
  }

  wxObj.miniProgram.navigateTo({
    url: `/pages/save-image/save-image?url=${encodeURIComponent(imageUrl)}`,
  });
}
