import type { Question } from '@/types';

export const questions: Question[] = [
  // E/I 维度 (1-15)
  {
    id: 1,
    text: '在社交聚会上，你通常：',
    dimension: 'EI',
    options: [
      { text: '主动与陌生人交谈，享受热闹氛围', dimension: 'E' },
      { text: '和熟悉的朋友聊天，适度参与', dimension: 'E' },
      { text: '找个安静的角落，或早点离开', dimension: 'I' },
    ],
  },
  {
    id: 2,
    text: '周末休息时，你更倾向于：',
    dimension: 'EI',
    options: [
      { text: '约朋友出去玩，安排满满的活动', dimension: 'E' },
      { text: '偶尔出门，大部分时间在家', dimension: 'I' },
      { text: '独自在家看书、看电影或做自己喜欢的事', dimension: 'I' },
    ],
  },
  {
    id: 3,
    text: '当你需要思考问题时，你更喜欢：',
    dimension: 'EI',
    options: [
      { text: '找朋友讨论，在交流中理清思路', dimension: 'E' },
      { text: '先自己想想，必要时再请教别人', dimension: 'I' },
      { text: '独自安静思考，不受打扰', dimension: 'I' },
    ],
  },
  {
    id: 4,
    text: '在团队合作中，你通常：',
    dimension: 'EI',
    options: [
      { text: '积极发言，带动团队气氛', dimension: 'E' },
      { text: '适时表达自己的想法', dimension: 'E' },
      { text: '先倾听，深思熟虑后再发言', dimension: 'I' },
    ],
  },
  {
    id: 5,
    text: '你更喜欢哪种工作环境？',
    dimension: 'EI',
    options: [
      { text: '开放式的办公环境，随时可以和同事交流', dimension: 'E' },
      { text: '半开放式的环境，有交流也有独立空间', dimension: 'E' },
      { text: '独立的办公室或安静的空间', dimension: 'I' },
    ],
  },
  {
    id: 6,
    text: '认识新朋友对你来说：',
    dimension: 'EI',
    options: [
      { text: '非常愉快，充满新鲜感', dimension: 'E' },
      { text: '还不错，顺其自然', dimension: 'E' },
      { text: '有点累，更喜欢和老朋友相处', dimension: 'I' },
    ],
  },
  {
    id: 7,
    text: '你更喜欢通过什么方式学习？',
    dimension: 'EI',
    options: [
      { text: '小组讨论、互动式学习', dimension: 'E' },
      { text: '课堂听讲加课后复习', dimension: 'E' },
      { text: '独自阅读、自学', dimension: 'I' },
    ],
  },
  {
    id: 8,
    text: '在公共场合，你通常：',
    dimension: 'EI',
    options: [
      { text: '很容易成为焦点，喜欢被关注', dimension: 'E' },
      { text: '不刻意回避，也不主动追求关注', dimension: 'E' },
      { text: '尽量低调，不喜欢成为焦点', dimension: 'I' },
    ],
  },
  {
    id: 9,
    text: '你的能量来源主要是：',
    dimension: 'EI',
    options: [
      { text: '与他人互动、社交活动', dimension: 'E' },
      { text: '两者都有，看心情', dimension: 'E' },
      { text: '独处、安静的个人时间', dimension: 'I' },
    ],
  },
  {
    id: 10,
    text: '面对新的社交场合，你：',
    dimension: 'EI',
    options: [
      { text: '兴奋期待，主动融入', dimension: 'E' },
      { text: '平常心对待', dimension: 'E' },
      { text: '有些紧张，需要时间适应', dimension: 'I' },
    ],
  },
  {
    id: 11,
    text: '你更喜欢哪种沟通方式？',
    dimension: 'EI',
    options: [
      { text: '面对面交流或电话', dimension: 'E' },
      { text: '都可以，看情况', dimension: 'E' },
      { text: '文字信息或邮件', dimension: 'I' },
    ],
  },
  {
    id: 12,
    text: '在派对结束后，你感觉：',
    dimension: 'EI',
    options: [
      { text: '意犹未尽，还想继续玩', dimension: 'E' },
      { text: '玩得很开心，但也该休息了', dimension: 'E' },
      { text: '精疲力尽，需要独处恢复', dimension: 'I' },
    ],
  },
  {
    id: 13,
    text: '你更倾向于：',
    dimension: 'EI',
    options: [
      { text: '先行动，在行动中思考', dimension: 'E' },
      { text: '行动前简单规划一下', dimension: 'E' },
      { text: '先想清楚，再谨慎行动', dimension: 'I' },
    ],
  },
  {
    id: 14,
    text: '你的朋友圈子：',
    dimension: 'EI',
    options: [
      { text: '很广，认识很多人', dimension: 'E' },
      { text: '中等，有几个圈子', dimension: 'E' },
      { text: '很小，但关系很深', dimension: 'I' },
    ],
  },
  {
    id: 15,
    text: '当你有烦恼时，你倾向于：',
    dimension: 'EI',
    options: [
      { text: '找朋友倾诉，寻求建议', dimension: 'E' },
      { text: '和信任的人聊聊', dimension: 'E' },
      { text: '自己消化，写日记或静静思考', dimension: 'I' },
    ],
  },

  // S/N 维度 (16-30)
  {
    id: 16,
    text: '你更关注：',
    dimension: 'SN',
    options: [
      { text: '具体的事实和细节', dimension: 'S' },
      { text: '两者都会关注', dimension: 'S' },
      { text: '整体的可能性和未来趋势', dimension: 'N' },
    ],
  },
  {
    id: 17,
    text: '当计划旅行时，你更喜欢：',
    dimension: 'SN',
    options: [
      { text: '做好详细攻略，每天安排妥当', dimension: 'S' },
      { text: '有个大致计划，留些灵活空间', dimension: 'S' },
      { text: '说走就走，享受未知的惊喜', dimension: 'N' },
    ],
  },
  {
    id: 18,
    text: '你更信任：',
    dimension: 'SN',
    options: [
      { text: '过去的经验和实际数据', dimension: 'S' },
      { text: '经验为主，直觉为辅', dimension: 'S' },
      { text: '自己的直觉和灵感', dimension: 'N' },
    ],
  },
  {
    id: 19,
    text: '你更喜欢阅读哪类书籍？',
    dimension: 'SN',
    options: [
      { text: '纪实文学、历史、实用指南', dimension: 'S' },
      { text: '两者都看', dimension: 'S' },
      { text: '科幻、哲学、抽象理论', dimension: 'N' },
    ],
  },
  {
    id: 20,
    text: '描述一件事时，你倾向于：',
    dimension: 'SN',
    options: [
      { text: '按时间顺序，详细描述经过', dimension: 'S' },
      { text: '讲重点，适当补充细节', dimension: 'S' },
      { text: '讲整体感受和意义', dimension: 'N' },
    ],
  },
  {
    id: 21,
    text: '你更欣赏哪种人？',
    dimension: 'SN',
    options: [
      { text: '脚踏实地、注重实际的人', dimension: 'S' },
      { text: '两者都有优点', dimension: 'S' },
      { text: '富有想象力、有远见的人', dimension: 'N' },
    ],
  },
  {
    id: 22,
    text: '解决问题时，你更倾向于：',
    dimension: 'SN',
    options: [
      { text: '参考已有的方法和成功案例', dimension: 'S' },
      { text: '结合经验和创新', dimension: 'S' },
      { text: '尝试全新的、创造性的方法', dimension: 'N' },
    ],
  },
  {
    id: 23,
    text: '你对新事物的态度是：',
    dimension: 'SN',
    options: [
      { text: '谨慎观察，等别人先尝试', dimension: 'S' },
      { text: '看情况，有用的就尝试', dimension: 'S' },
      { text: '充满好奇，喜欢做第一个尝试的人', dimension: 'N' },
    ],
  },
  {
    id: 24,
    text: '你更擅长记住：',
    dimension: 'SN',
    options: [
      { text: '具体的事实、数字、细节', dimension: 'S' },
      { text: '两者都不错', dimension: 'S' },
      { text: '概念、模式、整体印象', dimension: 'N' },
    ],
  },
  {
    id: 25,
    text: '在工作中，你更看重：',
    dimension: 'SN',
    options: [
      { text: '把当前任务做好，注重效率', dimension: 'S' },
      { text: '平衡当下和未来', dimension: 'S' },
      { text: '探索新的方向和可能性', dimension: 'N' },
    ],
  },
  {
    id: 26,
    text: '你更喜欢哪种艺术形式？',
    dimension: 'SN',
    options: [
      { text: '写实绘画、摄影、纪录片', dimension: 'S' },
      { text: '各种艺术形式都喜欢', dimension: 'S' },
      { text: '抽象艺术、幻想文学、概念设计', dimension: 'N' },
    ],
  },
  {
    id: 27,
    text: '当别人讲一个故事时，你更关注：',
    dimension: 'SN',
    options: [
      { text: '故事的具体情节和细节', dimension: 'S' },
      { text: '情节和寓意都会关注', dimension: 'S' },
      { text: '故事背后的寓意和象征', dimension: 'N' },
    ],
  },
  {
    id: 28,
    text: '你更倾向于：',
    dimension: 'SN',
    options: [
      { text: '关注眼前，活在当下', dimension: 'S' },
      { text: '兼顾当下和未来', dimension: 'S' },
      { text: '着眼未来，规划长远', dimension: 'N' },
    ],
  },
  {
    id: 29,
    text: '学习新技能时，你更喜欢：',
    dimension: 'SN',
    options: [
      { text: '按照教程一步步来', dimension: 'S' },
      { text: '先看教程，再自己摸索', dimension: 'S' },
      { text: '先理解原理，再自由探索', dimension: 'N' },
    ],
  },
  {
    id: 30,
    text: '你更相信：',
    dimension: 'SN',
    options: [
      { text: '眼见为实，实践出真知', dimension: 'S' },
      { text: '两者结合', dimension: 'S' },
      { text: '灵感和直觉有时比逻辑更准', dimension: 'N' },
    ],
  },

  // T/F 维度 (31-45)
  {
    id: 31,
    text: '做决策时，你更看重：',
    dimension: 'TF',
    options: [
      { text: '逻辑分析和客观事实', dimension: 'T' },
      { text: '两者都会考虑', dimension: 'T' },
      { text: '个人价值观和他人的感受', dimension: 'F' },
    ],
  },
  {
    id: 32,
    text: '朋友向你倾诉烦恼时，你更倾向于：',
    dimension: 'TF',
    options: [
      { text: '帮他分析问题，给出解决方案', dimension: 'T' },
      { text: '先倾听，再给出建议', dimension: 'T' },
      { text: '先共情，给予情感支持', dimension: 'F' },
    ],
  },
  {
    id: 33,
    text: '在争论中，你更看重：',
    dimension: 'TF',
    options: [
      { text: '谁的观点更有道理、更符合逻辑', dimension: 'T' },
      { text: '道理重要，但方式也重要', dimension: 'T' },
      { text: '大家的感受，希望和谐收场', dimension: 'F' },
    ],
  },
  {
    id: 34,
    text: '你更欣赏哪种领导风格？',
    dimension: 'TF',
    options: [
      { text: '公平公正、以业绩说话的领导', dimension: 'T' },
      { text: '既有原则又有人情味的领导', dimension: 'T' },
      { text: '关心员工、注重团队氛围的领导', dimension: 'F' },
    ],
  },
  {
    id: 35,
    text: '当别人批评你时，你更容易：',
    dimension: 'TF',
    options: [
      { text: '冷静分析批评是否有道理', dimension: 'T' },
      { text: '先理性分析，再考虑感受', dimension: 'T' },
      { text: '感到受伤，需要时间平复', dimension: 'F' },
    ],
  },
  {
    id: 36,
    text: '你更倾向于：',
    dimension: 'TF',
    options: [
      { text: '对事不对人，坚持原则', dimension: 'T' },
      { text: '看情况灵活处理', dimension: 'T' },
      { text: '以人为本，考虑特殊情况', dimension: 'F' },
    ],
  },
  {
    id: 37,
    text: '看电影时，你更容易被什么打动？',
    dimension: 'TF',
    options: [
      { text: '精妙的剧情设计和逻辑反转', dimension: 'T' },
      { text: '剧情和情感都会打动我', dimension: 'T' },
      { text: '角色的情感经历和人际关系', dimension: 'F' },
    ],
  },
  {
    id: 38,
    text: '工作中遇到冲突，你倾向于：',
    dimension: 'TF',
    options: [
      { text: '直接指出问题，寻求最优解', dimension: 'T' },
      { text: '理性沟通，寻找折中方案', dimension: 'T' },
      { text: '顾及大家感受，委婉处理', dimension: 'F' },
    ],
  },
  {
    id: 39,
    text: '你更重视：',
    dimension: 'TF',
    options: [
      { text: '能力和成就', dimension: 'T' },
      { text: '两者都重要', dimension: 'T' },
      { text: '人际关系和和谐', dimension: 'F' },
    ],
  },
  {
    id: 40,
    text: '评价一个项目成功与否，你更看重：',
    dimension: 'TF',
    options: [
      { text: '是否达到预期目标和效率', dimension: 'T' },
      { text: '结果和过程都重要', dimension: 'T' },
      { text: '团队成员是否满意和开心', dimension: 'F' },
    ],
  },
  {
    id: 41,
    text: '你更容易因为什么而感动？',
    dimension: 'TF',
    options: [
      { text: '人类智慧和理性的光辉', dimension: 'T' },
      { text: '智慧和情感都能打动我', dimension: 'T' },
      { text: '真挚的情感和温暖的瞬间', dimension: 'F' },
    ],
  },
  {
    id: 42,
    text: '在团队合作中，你更关注：',
    dimension: 'TF',
    options: [
      { text: '任务是否高效完成', dimension: 'T' },
      { text: '效率和氛围都要兼顾', dimension: 'T' },
      { text: '团队成员是否融洽', dimension: 'F' },
    ],
  },
  {
    id: 43,
    text: '你更认同哪种说法？',
    dimension: 'TF',
    options: [
      { text: '真理越辩越明', dimension: 'T' },
      { text: '辩论和沟通都重要', dimension: 'T' },
      { text: '和气生财，没必要争个输赢', dimension: 'F' },
    ],
  },
  {
    id: 44,
    text: '面对不公正的事情，你：',
    dimension: 'TF',
    options: [
      { text: '坚持原则，据理力争', dimension: 'T' },
      { text: '看情况，该争就争', dimension: 'T' },
      { text: '考虑各方感受，寻求温和解决', dimension: 'F' },
    ],
  },
  {
    id: 45,
    text: '你更擅长：',
    dimension: 'TF',
    options: [
      { text: '分析问题和找出漏洞', dimension: 'T' },
      { text: '两者都还行', dimension: 'T' },
      { text: '理解他人和调解矛盾', dimension: 'F' },
    ],
  },

  // J/P 维度 (46-60)
  {
    id: 46,
    text: '你的桌面/房间通常是：',
    dimension: 'JP',
    options: [
      { text: '整洁有序，每样东西都有固定位置', dimension: 'J' },
      { text: '大体整洁，偶尔有些乱', dimension: 'J' },
      { text: '随性摆放，乱中有序', dimension: 'P' },
    ],
  },
  {
    id: 47,
    text: '面对截止日期，你通常：',
    dimension: 'JP',
    options: [
      { text: '提前完成，留出缓冲时间', dimension: 'J' },
      { text: '按计划推进，准时完成', dimension: 'J' },
      { text: '在压力下效率更高，经常踩点完成', dimension: 'P' },
    ],
  },
  {
    id: 48,
    text: '你更喜欢：',
    dimension: 'JP',
    options: [
      { text: '有计划、有结构的生活', dimension: 'J' },
      { text: '有计划但也能灵活调整', dimension: 'J' },
      { text: '随性自由，拥抱变化', dimension: 'P' },
    ],
  },
  {
    id: 49,
    text: '旅行时，你更喜欢：',
    dimension: 'JP',
    options: [
      { text: '提前订好酒店和行程', dimension: 'J' },
      { text: '订好主要行程，细节灵活安排', dimension: 'J' },
      { text: '到了再说，享受随机性', dimension: 'P' },
    ],
  },
  {
    id: 50,
    text: '你更倾向于：',
    dimension: 'JP',
    options: [
      { text: '做完一件事再做下一件', dimension: 'J' },
      { text: '主要任务一件一件来', dimension: 'J' },
      { text: '多线程处理，同时推进多个任务', dimension: 'P' },
    ],
  },
  {
    id: 51,
    text: '面对新的选择时，你：',
    dimension: 'JP',
    options: [
      { text: '尽快做决定，不想拖太久', dimension: 'J' },
      { text: '考虑清楚后再决定', dimension: 'J' },
      { text: '保持开放，看看有没有更好的选项', dimension: 'P' },
    ],
  },
  {
    id: 52,
    text: '你的待办事项清单：',
    dimension: 'JP',
    options: [
      { text: '每天都有，并且认真执行', dimension: 'J' },
      { text: '有重要事项会记下来', dimension: 'J' },
      { text: '很少列清单，凭感觉做事', dimension: 'P' },
    ],
  },
  {
    id: 53,
    text: '你更喜欢哪种工作状态？',
    dimension: 'JP',
    options: [
      { text: '有明确的流程和规范', dimension: 'J' },
      { text: '有规范但也能灵活处理', dimension: 'J' },
      { text: '自由发挥，不受约束', dimension: 'P' },
    ],
  },
  {
    id: 54,
    text: '对于规则，你的态度是：',
    dimension: 'JP',
    options: [
      { text: '遵守规则，规则让事情更有序', dimension: 'J' },
      { text: '大部分遵守，特殊情况特殊处理', dimension: 'J' },
      { text: '规则是死的，人是活的', dimension: 'P' },
    ],
  },
  {
    id: 55,
    text: '周末计划被临时打乱，你：',
    dimension: 'JP',
    options: [
      { text: '有些不舒服，但会重新安排', dimension: 'J' },
      { text: '接受变化，调整计划', dimension: 'J' },
      { text: '没关系，正好尝试新的事情', dimension: 'P' },
    ],
  },
  {
    id: 56,
    text: '你更喜欢：',
    dimension: 'JP',
    options: [
      { text: '知道接下来会发生什么', dimension: 'J' },
      { text: '有大致方向就好', dimension: 'J' },
      { text: '享受未知和惊喜', dimension: 'P' },
    ],
  },
  {
    id: 57,
    text: '完成一个项目后，你：',
    dimension: 'JP',
    options: [
      { text: '总结经验，归档整理', dimension: 'J' },
      { text: '简单回顾一下', dimension: 'J' },
      { text: '马上开始下一个有趣的事情', dimension: 'P' },
    ],
  },
  {
    id: 58,
    text: '你更认同：',
    dimension: 'JP',
    options: [
      { text: '早起的鸟儿有虫吃', dimension: 'J' },
      { text: '平衡工作和休息', dimension: 'J' },
      { text: '船到桥头自然直', dimension: 'P' },
    ],
  },
  {
    id: 59,
    text: '你的生活方式更像：',
    dimension: 'JP',
    options: [
      { text: '按计划行事，有条不紊', dimension: 'J' },
      { text: '有规划但也能随遇而安', dimension: 'J' },
      { text: '随遇而安，顺其自然', dimension: 'P' },
    ],
  },
  {
    id: 60,
    text: '面对复杂任务，你：',
    dimension: 'JP',
    options: [
      { text: '先拆解成步骤，按计划执行', dimension: 'J' },
      { text: '先规划框架，再逐步填充', dimension: 'J' },
      { text: '边做边想，在实践中调整', dimension: 'P' },
    ],
  },
];
