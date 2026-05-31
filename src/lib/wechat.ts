const WX_SDK_URL = 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js';

/**
 * 检测当前是否在小程序 web-view 环境中
 * 兼容 iOS、Android、鸿蒙
 */
export function isWeChatMiniProgram(): boolean {
  if (typeof window === 'undefined') return false;
  // 方式1: __wxjs_environment (iOS/Android 微信 web-view 通用)
  if ((window as any).__wxjs_environment === 'miniprogram') return true;
  // 方式2: userAgent 检测 (鸿蒙等部分环境)
  if (/miniProgram/i.test(navigator.userAgent)) return true;
  return false;
}

/**
 * 获取小程序环境类型
 */
export function getMiniProgramEnv(): 'standard' | 'harmony' | 'none' {
  if (typeof window === 'undefined') return 'none';
  // 标准环境: 有 window.wx.miniProgram
  if ((window as any).wx?.miniProgram) return 'standard';
  // 鸿蒙环境: 无 window.wx，但有 __wxjs_environment
  if ((window as any).__wxjs_environment === 'miniprogram') return 'harmony';
  return 'none';
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

/**
 * 跳转到小程序原生页面
 * 兼容三种环境:
 * 1. 标准 iOS/Android: 使用 wx.miniProgram.navigateTo
 * 2. 鸿蒙: 使用 wx.miniProgram.navigateTo (加载 JSSDK 后)
 * 3. 鸿蒙无 wx: 使用 postMessage 通知小程序端跳转
 */
export async function miniProgramNavigateTo(url: string): Promise<void> {
  console.log('[MBTI_SHARE_DEBUG] ===== miniProgramNavigateTo =====');
  console.log('[MBTI_SHARE_DEBUG] 目标 URL:', url);

  const env = getMiniProgramEnv();
  console.log('[MBTI_SHARE_DEBUG] 环境类型:', env);

  // 方式1: 标准环境，直接使用 wx.miniProgram.navigateTo
  if ((window as any).wx?.miniProgram) {
    console.log('[MBTI_SHARE_DEBUG] 使用标准 wx.miniProgram.navigateTo');
    (window as any).wx.miniProgram.navigateTo({
      url,
      success: (res: any) => console.log('[MBTI_SHARE_DEBUG] navigateTo success', res),
      fail: (err: any) => {
        console.error('[MBTI_SHARE_DEBUG] navigateTo fail', err);
        // 失败后尝试 postMessage
        tryPostMessage(url);
      },
      complete: (res: any) => console.log('[MBTI_SHARE_DEBUG] navigateTo complete', res),
    });
    return;
  }

  // 方式2: 尝试加载 JSSDK 后再跳转 (鸿蒙部分版本支持)
  try {
    console.log('[MBTI_SHARE_DEBUG] 尝试加载 WeChat JSSDK...');
    await loadWeChatSDK();
    if ((window as any).wx?.miniProgram) {
      console.log('[MBTI_SHARE_DEBUG] JSSDK 加载成功，使用 navigateTo');
      (window as any).wx.miniProgram.navigateTo({
        url,
        success: (res: any) => console.log('[MBTI_SHARE_DEBUG] navigateTo success', res),
        fail: (err: any) => {
          console.error('[MBTI_SHARE_DEBUG] navigateTo fail', err);
          tryPostMessage(url);
        },
        complete: (res: any) => console.log('[MBTI_SHARE_DEBUG] navigateTo complete', res),
      });
      return;
    }
  } catch (sdkErr) {
    console.log('[MBTI_SHARE_DEBUG] JSSDK 加载失败:', sdkErr);
  }

  // 方式3: 使用 postMessage 通知小程序端
  console.log('[MBTI_SHARE_DEBUG] 使用 postMessage 通知小程序');
  tryPostMessage(url);
}

/**
 * 通过 postMessage 通知小程序端跳转
 * 适用于鸿蒙等不支持 window.wx 的环境
 */
function tryPostMessage(url: string): void {
  console.log('[MBTI_SHARE_DEBUG] tryPostMessage:', url);

  // 标准微信 web-view postMessage
  if ((window as any).wx?.miniProgram?.postMessage) {
    (window as any).wx.miniProgram.postMessage({
      data: { type: 'navigateTo', url },
    });
    console.log('[MBTI_SHARE_DEBUG] wx.miniProgram.postMessage 已发送');
    return;
  }

  // 尝试使用 WeixinJSBridge
  if ((window as any).WeixinJSBridge) {
    (window as any).WeixinJSBridge.invoke('navigateTo', { url }, (res: any) => {
      console.log('[MBTI_SHARE_DEBUG] WeixinJSBridge.navigateTo res:', res);
    });
    console.log('[MBTI_SHARE_DEBUG] WeixinJSBridge.invoke 已调用');
    return;
  }

  // 最后的降级: 直接修改 location (小程序 web-view 中通常会被拦截，但部分环境可用)
  console.warn('[MBTI_SHARE_DEBUG] 无可用跳转方式，尝试 location.href');
  // 不直接跳转，而是抛出错误让上层处理
  throw new Error(
    '小程序跳转失败: 当前环境不支持 wx.miniProgram.navigateTo。' +
    '请确保小程序端已注册 pages/share-result/share-result 页面，' +
    '或在小程序 web-view 中配置 bindmessage 接收跳转请求。'
  );
}

export async function navigateToSaveImage(imageUrl: string): Promise<void> {
  const url = `/pages/save-image/save-image?url=${encodeURIComponent(imageUrl)}`;
  await miniProgramNavigateTo(url);
}

/**
 * 跳转到小程序原生分享结果页
 */
export async function navigateToShareResult(
  type: string,
  title: string,
  desc: string,
  imageUrl: string,
): Promise<void> {
  console.log('[MBTI_SHARE_DEBUG] ===== 开始跳转小程序原生页 =====');

  // 如果 imageUrl 太长，使用 posterId 短参数
  const MAX_URL_LENGTH = 800;
  let finalImageUrl = imageUrl;
  let posterId: string | undefined;

  if (imageUrl.length > MAX_URL_LENGTH) {
    try {
      const url = new URL(imageUrl);
      const pathParts = url.pathname.split('/');
      posterId = pathParts[pathParts.length - 1];
      finalImageUrl = `${url.origin}${pathParts.slice(0, -1).join('/')}/`;
      console.log('[MBTI_SHARE_DEBUG] URL 过长，使用 posterId:', posterId);
    } catch {
      console.log('[MBTI_SHARE_DEBUG] URL 解析失败，保留原样');
    }
  }

  const params = new URLSearchParams();
  params.set('type', type);
  params.set('title', title);
  params.set('desc', desc);
  params.set('imageUrl', finalImageUrl);
  if (posterId) {
    params.set('posterId', posterId);
  }

  const url = `/pages/share-result/share-result?${params.toString()}`;
  console.log('[MBTI_SHARE_DEBUG] URL 长度:', url.length);
  console.log('[MBTI_SHARE_DEBUG] imageUrl:', finalImageUrl);

  await miniProgramNavigateTo(url);
}
