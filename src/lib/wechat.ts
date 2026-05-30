const WX_SDK_URL = 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js';

export function isWeChatMiniProgram(): boolean {
  if (typeof window === 'undefined') return false;
  if ((window as any).__wxjs_environment === 'miniprogram') return true;
  if (/miniProgram/i.test(navigator.userAgent)) return true;
  return false;
}

let sdkLoadPromise: Promise<void> | null = null;

function waitForMiniProgram(timeout = 3000): Promise<void> {
  if ((window as any).wx?.miniProgram) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const timer = setInterval(() => {
      if ((window as any).wx?.miniProgram) {
        clearInterval(timer);
        resolve();
      } else if (Date.now() - start > timeout) {
        clearInterval(timer);
        reject(new Error('wx.miniProgram not available after waiting'));
      }
    }, 100);
  });
}

async function _doLoadSDK(): Promise<void> {
  if ((window as any).wx) {
    await waitForMiniProgram();
    return;
  }

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = WX_SDK_URL;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load WeChat SDK'));
    document.head.appendChild(script);
  });

  await waitForMiniProgram();
}

export function loadWeChatSDK(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('Not in browser'));
  if ((window as any).wx?.miniProgram) return Promise.resolve();

  if (!sdkLoadPromise) {
    sdkLoadPromise = _doLoadSDK().catch((err) => {
      sdkLoadPromise = null;
      throw err;
    });
  }
  return sdkLoadPromise;
}

export async function navigateToSaveImage(imageUrl: string): Promise<void> {
  await loadWeChatSDK();
  (window as any).wx.miniProgram.navigateTo({
    url: `/pages/save-image/save-image?url=${encodeURIComponent(imageUrl)}`,
  });
}

export async function navigateToShareResult(
  type: string,
  title: string,
  desc: string,
  imageUrl: string,
): Promise<void> {
  await loadWeChatSDK();
  const params = new URLSearchParams({ type, title, desc, imageUrl });
  (window as any).wx.miniProgram.navigateTo({
    url: `/pages/share-result/share-result?${params.toString()}`,
  });
}
