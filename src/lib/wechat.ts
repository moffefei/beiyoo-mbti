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

/**
 * 跳转到小程序原生分享结果页
 * @param type MBTI 类型
 * @param title 分享标题
 * @param desc 分享描述
 * @param imageUrl 分享图片 URL（HTTPS）
 */
export async function navigateToShareResult(
  type: string,
  title: string,
  desc: string,
  imageUrl: string,
): Promise<void> {
  await loadWeChatSDK();

  // 如果 imageUrl 太长，使用 posterId 短参数
  // Supabase URL 通常较长，这里设置一个合理的阈值
  const MAX_URL_LENGTH = 800;
  let finalImageUrl = imageUrl;
  let posterId: string | undefined;

  // 提取文件名作为 posterId（Supabase URL 的最后一段）
  if (imageUrl.length > MAX_URL_LENGTH) {
    try {
      const url = new URL(imageUrl);
      const pathParts = url.pathname.split('/');
      posterId = pathParts[pathParts.length - 1];
      // 保留基础 URL，小程序端可以通过 posterId 拼接完整 URL
      finalImageUrl = `${url.origin}${pathParts.slice(0, -1).join('/')}/`;
    } catch {
      // URL 解析失败，保留原样
    }
  }

  // 使用 URLSearchParams 确保正确编码
  const params = new URLSearchParams();
  params.set('type', type);
  params.set('title', title);
  params.set('desc', desc);
  params.set('imageUrl', finalImageUrl);
  if (posterId) {
    params.set('posterId', posterId);
  }

  const url = `/pages/share-result/share-result?${params.toString()}`;
  console.log('[WeChat] Navigating to:', url);

  (window as any).wx.miniProgram.navigateTo({
    url: url,
    success: () => {
      console.log('[WeChat] navigateTo success');
    },
    fail: (err: any) => {
      console.error('[WeChat] navigateTo failed:', err);
      throw new Error(`跳转失败: ${err?.errMsg || '未知错误'}`);
    },
  });
}
