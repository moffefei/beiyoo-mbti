# MBTI Question Bank Scientific Audit

Date: 2026-06-03

## Scope

Audited files:

- `src/data/questions.ts`
- `src/lib/quizLogic.ts`
- `src/data/results.ts`

Goal:

- Review whether the question bank and answers are scientifically defensible.
- Check whether the product can claim alignment with "2026 latest MBTI research".
- Identify item-level and scoring-level risks.

## Source Baseline

### What Can Be Safely Claimed

The current custom question bank should be described as:

> A self-report, MBTI-inspired, four-preference personality tendency quiz for entertainment and self-reflection.

It should not be described as:

> A scientifically validated MBTI assessment, professional psychological test, diagnostic tool, recruitment tool, or instrument proven to match 2026 MBTI research.

### Evidence Reviewed

- The Myers-Briggs Company states that the official MBTI assessment is an indicator, not a pass/fail test, and is designed for self-understanding rather than measuring ability.
  Source: https://www.myersbriggs.org/unique-features-of-myers-briggs/is-the-mbti-a-test/home.htm

- The Myers-Briggs Company says the latest exhaustive official validity summary is in the 2018 Global Step I and Step II manual, not a 2026 public standard.
  Source: https://www.themyersbriggs.com/en-us/support/mbti-facts

- The Myers-Briggs Company explicitly says MBTI should never be used for recruitment or selection because it does not measure skills or abilities and is not built to predict behavior.
  Source: https://www.themyersbriggs.com/en-us/explore-solutions/mbti

- Recent personality psychology still generally treats the Big Five / Five-Factor Model as the strongest empirical framework for trait assessment, while MBTI remains useful mainly as a type-language and self-reflection framework.
  Source: https://www.britannica.com/science/five-factor-model-of-personality

- Modern scale-development guidance emphasizes validation evidence, item clarity, enough items per subscale, careful use of reversed items, and attention to response biases such as acquiescence and social desirability.
  Source: https://pmc.ncbi.nlm.nih.gov/articles/PMC11798685/
  Source: https://pmc.ncbi.nlm.nih.gov/articles/PMC8684561/

## Current Structure

The current bank has 60 items:

- EI: 15 items, E = 7, I = 8
- SN: 15 items, S = 8, N = 7
- TF: 15 items, T = 8, F = 7
- JP: 15 items, J = 8, P = 7

All items use a 5-point Likert response:

- 完全不符合 = -2
- 不太符合 = -1
- 不确定 = 0
- 比较符合 = 1
- 非常符合 = 2

Overall structure is reasonable for a lightweight self-report quiz. The main scientific problems are not the number of items or the use of a 5-point scale; they are construct validity, social desirability, scoring defaults, and overclaiming.

## Top Findings

### Finding 1: The "2026 Latest MBTI Research" Claim Is Not Supportable

Severity: High

The current bank is custom-written and has no empirical validation data:

- No reliability estimate, such as Cronbach's alpha or omega, for each dimension.
- No test-retest reliability.
- No confirmatory factor analysis.
- No comparison against official MBTI, Big Five, or another validated personality measure.
- No Chinese-language cultural adaptation procedure.
- No norm sample or percentile interpretation.

Because of that, the product should not claim it is based on "2026 latest MBTI research" unless the team has a real validation study behind it.

Recommended copy:

> 60 道 MBTI 四维倾向题，帮助你进行轻量自我探索。结果仅供娱乐与参考，不作专业心理诊断。

Avoid:

> 参考 2026 年最新 MBTI 研究

### Finding 2: Neutral Answers Default To ESTJ

Severity: High

In `determineMBTIType`, ties are resolved with `>=`, so equal scores default to E, S, T, and J. If a user chooses all neutral answers, each dimension score is zero, and the result becomes `ESTJ`.

This is scientifically indefensible. Neutral or low-information response patterns should produce an uncertain result, not a confident type.

Recommended fix:

- Track preference strength per dimension.
- If total evidence for a dimension is below a threshold, mark it as uncertain.
- For display, use wording such as "倾向不明显" or show a confidence score.
- If all dimensions are neutral, ask the user to retake or present "结果不够稳定".

### Finding 3: T/F Items Are Value-Laden And Socially Desirable

Severity: High

Many T items sound like virtue-coded rationality:

- Q31: "逻辑和客观分析"
- Q37: "基于事实，而不是个人情感"
- Q43: "基于数据和事实"
- Q45: "真理和正确性比和谐更重要"

Many F items sound like agreeableness or conflict avoidance:

- Q38: "维护团队的和谐氛围"
- Q42: "用同理心理解他人"
- Q44: "避免冲突，寻求共识"

This risks measuring social desirability and agreeableness rather than MBTI Thinking/Feeling preference. Users may interpret T as "rational and correct" and F as "kind but less objective", which is both scientifically weak and socially loaded.

Recommended direction:

- Rewrite T/F as decision criteria, not moral superiority.
- Keep both poles equally respectable.
- Avoid direct "truth vs harmony" framing where one side sounds childish or morally inferior.

Better examples:

- T-leaning: "做决定时，我会先明确评估标准，再考虑各方感受。"
- F-leaning: "做决定时，我会先考虑这件事对相关人的意义和影响。"

### Finding 4: J/P Is Mixed With Conscientiousness, Procrastination, And Emotional Stability

Severity: High

Several JP items are not cleanly measuring Judging/Perceiving preference:

- Q50 "在截止日期前完成任务" measures conscientiousness and self-management.
- Q53 "在压力下保持冷静和灵活" measures emotional stability plus adaptability.
- Q59 "在最后一刻完成任务" measures procrastination, not simply P.
- Q51 "探索新的方法和途径" overlaps with N / openness.

This will make P results feel like "less organized" or "procrastinating", which is a common but weak stereotype.

Recommended direction:

- J/P should focus on closure vs openness, planned structure vs adaptive flexibility.
- Avoid making J the responsible pole and P the careless pole.

Better examples:

- J-leaning: "面对一个任务，我更安心于先确定步骤和截止点。"
- P-leaning: "面对一个任务，我更安心于保留调整空间，边推进边修正。"

### Finding 5: EI Is Mostly Strong, But A Few Items Drift

Severity: Medium

EI is the cleanest dimension overall. Most items are direct and interpretable.

Potential issues:

- Q15 "行动前先深思熟虑" is closer to impulsivity/conscientiousness/J than Introversion.
- Q7 "文字信息而不是面对面交流" may reflect social anxiety, remote-work habits, or age cohort more than I.
- Q6 "朋友很多，社交圈广" measures social network size, which is influenced by life stage and context.

Recommended direction:

- Keep EI focused on energy source, stimulation preference, and breadth/depth of interaction.
- Avoid behavior items that are heavily determined by occupation, age, or social opportunity.

### Finding 6: SN Contains Multiple J/P Contaminations

Severity: Medium

SN should measure concrete facts and present sensory data vs patterns, meanings, and possibilities. Several S items instead measure process preference:

- Q18 "按照已有的方法和经验解决问题"
- Q22 "按部就班地完成任务"
- Q30 "按照既定的流程和方法工作"

These overlap heavily with J and conscientiousness.

Recommended direction:

- Make S items about concrete evidence, specifics, and direct observation.
- Make N items about possibilities, abstraction, patterns, and inferred meaning.
- Avoid "process/order" wording unless the intent is JP.

### Finding 7: "Clear-Purpose" Items Are Acceptable But Easy To Game

Severity: Medium

The official MBTI uses clear-purpose items, so it is not automatically wrong that users can infer what an item measures. However, clear-purpose items make the quiz unsuitable for selection, screening, ranking, or any high-stakes use.

Recommendation:

- Keep the product framed as entertainment and self-reflection.
- Do not expose dimension tags during the quiz unless in debug mode.
- Do not use results for professional advice beyond playful suggestions.

### Finding 8: Result Copy Is Too Certain

Severity: Medium

Result descriptions are polished and positive, but they read as fixed identity labels. This increases Barnum-effect satisfaction but weakens scientific caution.

Recommended direction:

- Use "你当前更偏向..." rather than "你就是..."
- Add confidence/strength language by dimension.
- Avoid career suggestions sounding prescriptive.

Example:

> 你的回答更接近 ISTJ 倾向。这个结果反映的是你当前在四个偏好维度上的选择模式，不代表固定人格标签。

## Item-Level Review

### EI

Acceptable items:

- Q1, Q2, Q4, Q5, Q8, Q10, Q11, Q12, Q13, Q14

Needs revision:

- Q3: "思考清楚后再发言" can reflect communication style and conscientiousness, not only I.
- Q6: "朋友很多，社交圈广" depends on context and life stage.
- Q7: "文字信息而不是面对面交流" can reflect social anxiety, convenience, or generation.
- Q9: "先倾听，然后再表达观点" can reflect agreeableness or communication training.
- Q15: "行动前先深思熟虑" overlaps strongly with J/conscientiousness.

### SN

Acceptable items:

- Q16, Q17, Q19, Q20, Q21, Q23, Q24, Q25, Q26, Q27, Q29

Needs revision:

- Q18: method/experience wording overlaps with J.
- Q22: step-by-step completion overlaps with J.
- Q28: present vs future can reflect planning horizon, not only S/N.
- Q30: fixed process/method overlaps with J.

### TF

Acceptable with caution:

- Q31, Q32, Q34, Q36, Q40, Q42

Needs revision:

- Q33: "fairness vs harmony" is culturally and morally loaded.
- Q35: direct problem-pointing may measure assertiveness/conflict style.
- Q37: "facts rather than personal emotion" frames F as less factual.
- Q38: team harmony overlaps with agreeableness and cultural norms.
- Q39: root-cause analysis can measure analytical style beyond T/F.
- Q41: efficiency vs interpersonal relationship is too stark and value-laden.
- Q43: data/facts item repeats Q31/Q37 and makes T socially desirable.
- Q44: avoiding conflict can measure conflict anxiety, not F preference.
- Q45: truth/correctness vs harmony is too moralized.

### JP

Acceptable with caution:

- Q46, Q47, Q48, Q49, Q52, Q54, Q55, Q56, Q57, Q58, Q60

Needs revision:

- Q50: deadline behavior measures conscientiousness.
- Q51: exploring new methods overlaps with N/openness.
- Q53: calm under pressure measures emotional stability.
- Q59: last-minute completion measures procrastination and may shame P.

## Recommended Redesign Principles

### 1. Change The Claim

Replace "符合/参考 2026 最新 MBTI 研究" with a safer, more accurate claim:

> 基于 MBTI 四维偏好框架设计，用于娱乐和自我探索。

### 2. Add Uncertainty

Every result should include:

- Type
- Four dimension strengths
- Uncertain dimensions
- A low-confidence state if responses are mostly neutral

### 3. Normalize Each Pole

Each pair should be framed as two valid preferences:

- E: outward stimulation / I: inward restoration
- S: concrete evidence / N: pattern and possibility
- T: impersonal criteria / F: human impact and values
- J: closure and structure / P: adaptability and openness

Avoid:

- Rational vs emotional
- Responsible vs procrastinating
- Scientific vs vague
- Truth vs harmony

### 4. Reduce Response Bias

Use a mix of:

- Direct preference statements.
- Scenario-based items.
- Less virtue-coded wording.
- Balanced desirability across poles.

Avoid too many items beginning with:

- "我喜欢..."
- "我更喜欢..."
- "我倾向于..."

Current counts:

- "喜欢": 26 items
- "更喜欢": 14 items
- "倾向于": 17 items

This repetition is readable, but it makes the quiz feel formulaic and may encourage autopilot answering.

### 5. Validate Before Scientific Claims

Before using stronger claims, collect validation evidence:

- At least 300-500 completed responses as a starting sample.
- Internal consistency per dimension.
- Item-total correlations.
- Test-retest reliability for a subset of users.
- Distribution analysis for type balance.
- Correlation with a validated Big Five short scale.
- Human review by a psychologist or psychometrician.

## Recommended Next Step

Do not only polish the existing 60 items. The better path is:

1. Keep the 60-item length and 5-point response format.
2. Rewrite roughly 20-25 weak or contaminated items.
3. Add low-confidence handling in scoring.
4. Update result copy to use tendency and uncertainty language.
5. Remove the "2026 latest MBTI research" claim.
6. Run a small validation pass after deployment data is collected.

