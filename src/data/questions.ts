import type { Question } from '@/types';

// 严格的 MBTI 题库设计：
// 1. 60题，每题3个选项
// 2. 每道题属于一个维度（EI/SN/TF/JP）
// 3. 每道题的选项分布：1个方向A + 1个方向B + 1个中立/混合
// 4. 总体每个维度的两个方向选项数量严格相等（各30个）

export const questions: Question[] = [
  // ========== E/I 维度 (15题) ==========
  // 每题：1个E + 1个I + 1个中立的EI混合
  // 总体：E=15, I=15, 中立EI=15
  {
    id: 1,
    text: '在社交聚会上，你通常：',
    dimension: 'EI',
    options: [
      { text: '主动与陌生人交谈，享受热闹氛围', dimension: 'E' },
      { text: '和熟悉的朋友聊天，适度参与', dimension: 'EI' },
      { text: '找个安静的角落，或早点离开', dimension: 'I' },
    ],
  },
  {
    id: 2,
    text: '周末休息时，你更倾向于：',
    dimension: 'EI',
    options: [
      { text: '约朋友出去玩，安排满满的活动', dimension: 'E' },
      { text: '偶尔出门，大部分时间在家', dimension: 'EI' },
      { text: '独自在家看书、看电影或做自己喜欢的事', dimension: 'I' },
    ],
  },
  {
    id: 3,
    text: '当你需要思考问题时，你更喜欢：',
    dimension: 'EI',
    options: [
      { text: '找朋友讨论，在交流中理清思路', dimension: 'E' },
      { text: '先自己想想，必要时再请教别人', dimension: 'EI' },
      { text: '独自安静思考，不受打扰', dimension: 'I' },
    ],
  },
  {
    id: 4,
    text: '在团队合作中，你通常：',
    dimension: 'EI',
    options: [
      { text: '积极发言，带动团队气氛', dimension: 'E' },
      { text: '适时表达自己的想法', dimension: 'EI' },
      { text: '先倾听，深思熟虑后再发言', dimension: 'I' },
    ],
  },
  {
    id: 5,
    text: '你的社交圈子：',
    dimension: 'EI',
    options: [
      { text: '很广，认识很多人', dimension: 'E' },
      { text: '中等，有几个圈子', dimension: 'EI' },
      { text: '很小，但关系很深', dimension: 'I' },
    ],
  },
  {
    id: 6,
    text: '参加完大型聚会后，你通常感到：',
    dimension: 'EI',
    options: [
      { text: '意犹未尽，还想继续玩', dimension: 'E' },
      { text: '玩得很开心，但也该休息了', dimension: 'EI' },
      { text: '精疲力尽，需要独处恢复', dimension: 'I' },
    ],
  },
  {
    id: 7,
    text: '在陌生的环境中，你通常：',
    dimension: 'EI',
    options: [
      { text: '兴奋期待，主动融入', dimension: 'E' },
      { text: '平常心对待', dimension: 'EI' },
      { text: '有些紧张，需要时间适应', dimension: 'I' },
    ],
  },
  {
    id: 8,
    text: '你更喜欢哪种沟通方式：',
    dimension: 'EI',
    options: [
      { text: '面对面交流或电话', dimension: 'E' },
      { text: '看情况，灵活选择', dimension: 'EI' },
      { text: '文字信息或邮件', dimension: 'I' },
    ],
  },
  {
    id: 9,
    text: '当朋友遇到困难找你倾诉时，你倾向于：',
    dimension: 'EI',
    options: [
      { text: '找朋友讨论，一起想办法', dimension: 'E' },
      { text: '和信任的人聊聊', dimension: 'EI' },
      { text: '自己消化，写日记或静静思考', dimension: 'I' },
    ],
  },
  {
    id: 10,
    text: '在公共场合，你：',
    dimension: 'EI',
    options: [
      { text: '很容易成为焦点，喜欢被关注', dimension: 'E' },
      { text: '不刻意回避，也不主动追求关注', dimension: 'EI' },
      { text: '尽量低调，不喜欢成为焦点', dimension: 'I' },
    ],
  },
  {
    id: 11,
    text: '你理想的工作环境是：',
    dimension: 'EI',
    options: [
      { text: '开放式的办公环境，随时可以和同事交流', dimension: 'E' },
      { text: '半开放式的环境，有交流也有独立空间', dimension: 'EI' },
      { text: '独立的办公室或安静的空间', dimension: 'I' },
    ],
  },
  {
    id: 12,
    text: '你更喜欢哪种学习方式：',
    dimension: 'EI',
    options: [
      { text: '小组讨论、互动式学习', dimension: 'E' },
      { text: '课堂听讲加课后复习', dimension: 'EI' },
      { text: '独自阅读、自学', dimension: 'I' },
    ],
  },
  {
    id: 13,
    text: '当你生气或难过时，你倾向于：',
    dimension: 'EI',
    options: [
      { text: '找朋友倾诉，寻求建议', dimension: 'E' },
      { text: '和信任的人聊聊', dimension: 'EI' },
      { text: '自己消化，需要时间平复', dimension: 'I' },
    ],
  },
  {
    id: 14,
    text: '你更喜欢哪种休闲方式：',
    dimension: 'EI',
    options: [
      { text: '与他人互动、社交活动', dimension: 'E' },
      { text: '两者都有，看心情', dimension: 'EI' },
      { text: '独处、安静的个人时间', dimension: 'I' },
    ],
  },
  {
    id: 15,
    text: '面对新的社交场合，你通常：',
    dimension: 'EI',
    options: [
      { text: '兴奋期待，主动融入', dimension: 'E' },
      { text: '先观察，再慢慢参与', dimension: 'EI' },
      { text: '感到紧张，希望有熟悉的人在身边', dimension: 'I' },
    ],
  },

  // ========== S/N 维度 (15题) ==========
  // 每题：1个S + 1个N + 1个中立的SN混合
  // 总体：S=15, N=15, 中立SN=15
  {
    id: 16,
    text: '你更关注：',
    dimension: 'SN',
    options: [
      { text: '具体的事实和细节', dimension: 'S' },
      { text: '具体与抽象兼顾', dimension: 'SN' },
      { text: '整体的可能性和未来趋势', dimension: 'N' },
    ],
  },
  {
    id: 17,
    text: '当你学习新事物时，你更喜欢：',
    dimension: 'SN',
    options: [
      { text: '按照教程一步步来', dimension: 'S' },
      { text: '先看教程，再自己摸索', dimension: 'SN' },
      { text: '先理解原理，再自由探索', dimension: 'N' },
    ],
  },
  {
    id: 18,
    text: '你更信任：',
    dimension: 'SN',
    options: [
      { text: '过去的经验和实际数据', dimension: 'S' },
      { text: '经验与直觉结合', dimension: 'SN' },
      { text: '自己的直觉和灵感', dimension: 'N' },
    ],
  },
  {
    id: 19,
    text: '你更喜欢哪种类型的书籍：',
    dimension: 'SN',
    options: [
      { text: '纪实文学、历史、实用指南', dimension: 'S' },
      { text: '情节和寓意都会关注', dimension: 'SN' },
      { text: '科幻、哲学、抽象理论', dimension: 'N' },
    ],
  },
  {
    id: 20,
    text: '当描述一个事件时，你倾向于：',
    dimension: 'SN',
    options: [
      { text: '按时间顺序，详细描述经过', dimension: 'S' },
      { text: '讲重点，适当补充细节', dimension: 'SN' },
      { text: '讲整体感受和意义', dimension: 'N' },
    ],
  },
  {
    id: 21,
    text: '你更欣赏哪种人：',
    dimension: 'SN',
    options: [
      { text: '脚踏实地、注重实际的人', dimension: 'S' },
      { text: '兼顾实际与想象的人', dimension: 'SN' },
      { text: '富有想象力、有远见的人', dimension: 'N' },
    ],
  },
  {
    id: 22,
    text: '面对问题时，你更倾向于：',
    dimension: 'SN',
    options: [
      { text: '参考已有的方法和成功案例', dimension: 'S' },
      { text: '结合经验和创新', dimension: 'SN' },
      { text: '尝试全新的、创造性的方法', dimension: 'N' },
    ],
  },
  {
    id: 23,
    text: '你更关注：',
    dimension: 'SN',
    options: [
      { text: '眼前的事实和细节', dimension: 'S' },
      { text: '平衡当下和未来', dimension: 'SN' },
      { text: '着眼未来，规划长远', dimension: 'N' },
    ],
  },
  {
    id: 24,
    text: '当看电影时，你更关注：',
    dimension: 'SN',
    options: [
      { text: '故事的具体情节和细节', dimension: 'S' },
      { text: '情节和寓意都会关注', dimension: 'SN' },
      { text: '故事背后的寓意和象征', dimension: 'N' },
    ],
  },
  {
    id: 25,
    text: '你更喜欢哪种艺术风格：',
    dimension: 'SN',
    options: [
      { text: '写实绘画、摄影、纪录片', dimension: 'S' },
      { text: '各种艺术形式都喜欢', dimension: 'SN' },
      { text: '抽象艺术、幻想文学、概念设计', dimension: 'N' },
    ],
  },
  {
    id: 26,
    text: '你更相信：',
    dimension: 'SN',
    options: [
      { text: '眼见为实，实践出真知', dimension: 'S' },
      { text: '实践与灵感都重要', dimension: 'SN' },
      { text: '灵感和直觉有时比逻辑更准', dimension: 'N' },
    ],
  },
  {
    id: 27,
    text: '当计划旅行时，你倾向于：',
    dimension: 'SN',
    options: [
      { text: '做好详细攻略，每天安排妥当', dimension: 'S' },
      { text: '有个大致计划，留些灵活空间', dimension: 'SN' },
      { text: '说走就走，享受未知的惊喜', dimension: 'N' },
    ],
  },
  {
    id: 28,
    text: '你更喜欢哪种信息呈现方式：',
    dimension: 'SN',
    options: [
      { text: '具体的事实、数字、细节', dimension: 'S' },
      { text: '具体与抽象结合', dimension: 'SN' },
      { text: '抽象的理论和可能性', dimension: 'N' },
    ],
  },
  {
    id: 29,
    text: '面对新环境，你更倾向于：',
    dimension: 'SN',
    options: [
      { text: '谨慎观察，等别人先尝试', dimension: 'S' },
      { text: '先观察，再慢慢参与', dimension: 'SN' },
      { text: '充满好奇，喜欢做第一个尝试的人', dimension: 'N' },
    ],
  },
  {
    id: 30,
    text: '你更擅长：',
    dimension: 'SN',
    options: [
      { text: '记住具体的事实和细节', dimension: 'S' },
      { text: '处理实际的具体问题', dimension: 'SN' },
      { text: '发现事物之间的联系和模式', dimension: 'N' },
    ],
  },

  // ========== T/F 维度 (15题) ==========
  // 每题：1个T + 1个F + 1个中立的TF混合
  // 总体：T=15, F=15, 中立TF=15
  {
    id: 31,
    text: '在做决策时，你更看重：',
    dimension: 'TF',
    options: [
      { text: '逻辑分析和客观事实', dimension: 'T' },
      { text: '道理重要，但方式也重要', dimension: 'TF' },
      { text: '个人价值观和他人的感受', dimension: 'F' },
    ],
  },
  {
    id: 32,
    text: '当朋友向你倾诉烦恼时，你倾向于：',
    dimension: 'TF',
    options: [
      { text: '帮他分析问题，给出解决方案', dimension: 'T' },
      { text: '先倾听，再给出建议', dimension: 'TF' },
      { text: '先共情，给予情感支持', dimension: 'F' },
    ],
  },
  {
    id: 33,
    text: '在争论中，你更关注：',
    dimension: 'TF',
    options: [
      { text: '谁的观点更有道理、更符合逻辑', dimension: 'T' },
      { text: '真理越辩越明', dimension: 'TF' },
      { text: '大家的感受，希望和谐收场', dimension: 'F' },
    ],
  },
  {
    id: 34,
    text: '你更重视：',
    dimension: 'TF',
    options: [
      { text: '能力和成就', dimension: 'T' },
      { text: '结果和过程都重要', dimension: 'TF' },
      { text: '人际关系和和谐', dimension: 'F' },
    ],
  },
  {
    id: 35,
    text: '当受到批评时，你通常：',
    dimension: 'TF',
    options: [
      { text: '冷静分析批评是否有道理', dimension: 'T' },
      { text: '对事不对人，坚持原则', dimension: 'TF' },
      { text: '感到受伤，需要时间平复', dimension: 'F' },
    ],
  },
  {
    id: 36,
    text: '你更欣赏的领导风格是：',
    dimension: 'TF',
    options: [
      { text: '公平公正、以业绩说话的领导', dimension: 'T' },
      { text: '既有原则又有人情味的领导', dimension: 'TF' },
      { text: '关心员工、注重团队氛围的领导', dimension: 'F' },
    ],
  },
  {
    id: 37,
    text: '当团队发生冲突时，你倾向于：',
    dimension: 'TF',
    options: [
      { text: '直接指出问题，寻求最优解', dimension: 'T' },
      { text: '理性沟通，寻找折中方案', dimension: 'TF' },
      { text: '考虑各方感受，寻求温和解决', dimension: 'F' },
    ],
  },
  {
    id: 38,
    text: '你更认同：',
    dimension: 'TF',
    options: [
      { text: '人类智慧和理性的光辉', dimension: 'T' },
      { text: '智慧与情感都重要', dimension: 'TF' },
      { text: '真挚的情感和温暖的瞬间', dimension: 'F' },
    ],
  },
  {
    id: 39,
    text: '评价一个项目成功与否，你更看重：',
    dimension: 'TF',
    options: [
      { text: '是否达到预期目标和效率', dimension: 'T' },
      { text: '效率和氛围都要兼顾', dimension: 'TF' },
      { text: '团队成员是否满意和开心', dimension: 'F' },
    ],
  },
  {
    id: 40,
    text: '当看电影时，什么最能打动你：',
    dimension: 'TF',
    options: [
      { text: '精妙的剧情设计和逻辑反转', dimension: 'T' },
      { text: '剧情和情感都会打动我', dimension: 'TF' },
      { text: '角色的情感经历和人际关系', dimension: 'F' },
    ],
  },
  {
    id: 41,
    text: '你更倾向于：',
    dimension: 'TF',
    options: [
      { text: '坚持原则，据理力争', dimension: 'T' },
      { text: '看情况，该争就争', dimension: 'TF' },
      { text: '和气生财，没必要争个输赢', dimension: 'F' },
    ],
  },
  {
    id: 42,
    text: '你更擅长：',
    dimension: 'TF',
    options: [
      { text: '分析问题和找出漏洞', dimension: 'T' },
      { text: '理性与感性兼顾', dimension: 'TF' },
      { text: '理解他人和调解矛盾', dimension: 'F' },
    ],
  },
  {
    id: 43,
    text: '当需要做决定时，你更看重：',
    dimension: 'TF',
    options: [
      { text: '逻辑和效率', dimension: 'T' },
      { text: '先理性分析，再考虑感受', dimension: 'TF' },
      { text: '对人的影响和感受', dimension: 'F' },
    ],
  },
  {
    id: 44,
    text: '你更认同哪种说法：',
    dimension: 'TF',
    options: [
      { text: '对事不对人，坚持原则', dimension: 'T' },
      { text: '道理重要，但方式也重要', dimension: 'TF' },
      { text: '以人为本，考虑特殊情况', dimension: 'F' },
    ],
  },
  {
    id: 45,
    text: '面对他人的错误，你倾向于：',
    dimension: 'TF',
    options: [
      { text: '直接指出，帮助对方改进', dimension: 'T' },
      { text: '先分析问题所在', dimension: 'TF' },
      { text: '委婉提醒，顾及对方感受', dimension: 'F' },
    ],
  },

  // ========== J/P 维度 (15题) ==========
  // 每题：1个J + 1个P + 1个中立的JP混合
  // 总体：J=15, P=15, 中立JP=15
  {
    id: 46,
    text: '你更喜欢的生活方式是：',
    dimension: 'JP',
    options: [
      { text: '有计划、有结构的生活', dimension: 'J' },
      { text: '有计划但也能灵活调整', dimension: 'JP' },
      { text: '随性自由，拥抱变化', dimension: 'P' },
    ],
  },
  {
    id: 47,
    text: '当面对截止日期时，你通常：',
    dimension: 'JP',
    options: [
      { text: '提前完成，留出缓冲时间', dimension: 'J' },
      { text: '按计划推进，准时完成', dimension: 'JP' },
      { text: '在压力下效率更高，经常踩点完成', dimension: 'P' },
    ],
  },
  {
    id: 48,
    text: '你的桌面/房间通常是：',
    dimension: 'JP',
    options: [
      { text: '整洁有序，每样东西都有固定位置', dimension: 'J' },
      { text: '大体整洁，偶尔有些乱', dimension: 'JP' },
      { text: '随性摆放，乱中有序', dimension: 'P' },
    ],
  },
  {
    id: 49,
    text: '当计划突然改变时，你：',
    dimension: 'JP',
    options: [
      { text: '有些不舒服，但会重新安排', dimension: 'J' },
      { text: '接受变化，调整计划', dimension: 'JP' },
      { text: '没关系，正好尝试新的事情', dimension: 'P' },
    ],
  },
  {
    id: 50,
    text: '你更喜欢哪种工作方式：',
    dimension: 'JP',
    options: [
      { text: '先拆解成步骤，按计划执行', dimension: 'J' },
      { text: '做完一件事再做下一件', dimension: 'JP' },
      { text: '多线程处理，同时推进多个任务', dimension: 'P' },
    ],
  },
  {
    id: 51,
    text: '对于规则，你的态度是：',
    dimension: 'JP',
    options: [
      { text: '遵守规则，规则让事情更有序', dimension: 'J' },
      { text: '大部分遵守，特殊情况特殊处理', dimension: 'JP' },
      { text: '规则是死的，人是活的', dimension: 'P' },
    ],
  },
  {
    id: 52,
    text: '你更倾向于：',
    dimension: 'JP',
    options: [
      { text: '尽快做决定，不想拖太久', dimension: 'J' },
      { text: '考虑清楚后再决定', dimension: 'JP' },
      { text: '保持开放，看看有没有更好的选项', dimension: 'P' },
    ],
  },
  {
    id: 53,
    text: '当项目结束时，你倾向于：',
    dimension: 'JP',
    options: [
      { text: '总结经验，归档整理', dimension: 'J' },
      { text: '简单回顾一下', dimension: 'JP' },
      { text: '马上开始下一个有趣的事情', dimension: 'P' },
    ],
  },
  {
    id: 54,
    text: '你更喜欢哪种旅行方式：',
    dimension: 'JP',
    options: [
      { text: '提前订好酒店和行程', dimension: 'J' },
      { text: '订好主要行程，细节灵活安排', dimension: 'JP' },
      { text: '到了再说，享受随机性', dimension: 'P' },
    ],
  },
  {
    id: 55,
    text: '你通常如何安排任务：',
    dimension: 'JP',
    options: [
      { text: '每天都有，并且认真执行', dimension: 'J' },
      { text: '有重要事项会记下来', dimension: 'JP' },
      { text: '很少列清单，凭感觉做事', dimension: 'P' },
    ],
  },
  {
    id: 56,
    text: '面对新的机会，你倾向于：',
    dimension: 'JP',
    options: [
      { text: '先规划框架，再逐步填充', dimension: 'J' },
      { text: '有大致方向就好', dimension: 'JP' },
      { text: '边做边想，在实践中调整', dimension: 'P' },
    ],
  },
  {
    id: 57,
    text: '你更喜欢：',
    dimension: 'JP',
    options: [
      { text: '知道接下来会发生什么', dimension: 'J' },
      { text: '有明确的流程和规范', dimension: 'JP' },
      { text: '享受未知和惊喜', dimension: 'P' },
    ],
  },
  {
    id: 58,
    text: '当遇到困难时，你倾向于：',
    dimension: 'JP',
    options: [
      { text: '按计划行事，有条不紊', dimension: 'J' },
      { text: '先想清楚，再谨慎行动', dimension: 'JP' },
      { text: '灵活应对，随机应变', dimension: 'P' },
    ],
  },
  {
    id: 59,
    text: '你更认同：',
    dimension: 'JP',
    options: [
      { text: '早起的鸟儿有虫吃', dimension: 'J' },
      { text: '有规划但也能随遇而安', dimension: 'JP' },
      { text: '船到桥头自然直', dimension: 'P' },
    ],
  },
  {
    id: 60,
    text: '对于时间管理，你：',
    dimension: 'JP',
    options: [
      { text: '严格按计划执行', dimension: 'J' },
      { text: '有大致安排，偶尔调整', dimension: 'JP' },
      { text: '随心所欲，顺其自然', dimension: 'P' },
    ],
  },
];
