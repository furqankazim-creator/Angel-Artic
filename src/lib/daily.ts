import type { Profile } from '../store.tsx';
import { SOUNDS, WORDS, createCustomSound } from '../data/sounds.ts';
import type { Sound, Word } from '../data/sounds.ts';
import { BANDS, bandFor } from '../data/curriculum.ts';
import { masteryFor, type Mastery } from './mastery.ts';
import { dayKey, seedFromDay } from './date.ts';

export type ProblemReason = 'low_accuracy' | 'struggling' | 'target_unmastered' | 'age_focus' | 'review';

export interface ProblematicSound {
  soundId: string;
  urgency: number;
  reason: ProblemReason;
  label: string;
  avgScore: number | null;
  mastery: Mastery;
  scoredTries: number;
  unscoredTries: number;
}

export interface DailyChallengeItem {
  word: Word;
  soundId: string;
  reason: string;
  badge: string;
  isProblematic: boolean;
}

/**
 * Automatically detects the child's problematic sounds based on real practice data:
 * 1. Sounds with low average scores (< 70%) or recent struggles.
 * 2. Unscored attempts where voice input failed or had difficulty.
 * 3. Parent-selected target sounds that have not yet been mastered.
 * 4. Age-recommended emerging sounds not yet mastered.
 *
 * Mastered sounds (5+ tries with >= 80% accuracy) are pushed to lowest priority.
 */
export function getProblematicSounds(profile: Profile, pool: Sound[] = SOUNDS): ProblematicSound[] {
  const attempts = profile.attempts || [];
  const targetSounds = profile.targetSounds || [];
  const existingIds = new Set(pool.map((s) => s.id));
  const missingTargets = targetSounds
    .filter((id) => !existingIds.has(id))
    .map((id) => createCustomSound(id));
  const fullPool = [...pool, ...missingTargets];
  const band = BANDS[bandFor(profile.age)];
  const ageFocus = band ? [...band.focus, ...band.emerging] : [];

  const results: ProblematicSound[] = fullPool.map((snd) => {
    const soundAtt = attempts.filter((a) => a.soundId === snd.id);
    const scored = soundAtt.filter((a) => a.status === 'scored');
    const unscored = soundAtt.filter((a) => a.status !== 'scored');
    const scoredTries = scored.length;
    const unscoredTries = unscored.length;
    const avgScore = scoredTries > 0
      ? Math.round(scored.reduce((sum, a) => sum + a.score, 0) / scoredTries)
      : null;
    const { level: mastery } = masteryFor(attempts, snd.id);
    const isTarget = targetSounds.includes(snd.id);
    const isAgeFocus = ageFocus.includes(snd.id);

    let urgency = 0;
    let reason: ProblemReason = 'review';
    let label = 'Maintenance';

    if (avgScore !== null && avgScore < 70) {
      urgency = 100 - avgScore + unscoredTries * 6;
      if (isTarget) urgency += 30;
      reason = 'low_accuracy';
      label = `Needs practice (${avgScore}% avg)`;
    } else if (unscoredTries > 0 && scoredTries === 0) {
      urgency = 75 + unscoredTries * 5;
      if (isTarget) urgency += 20;
      reason = 'struggling';
      label = 'Voice not detected yet';
    } else if (isTarget && mastery !== 'Mastered') {
      urgency = 60 + (mastery === 'Learning' ? 15 : 5);
      reason = 'target_unmastered';
      label = 'Target sound';
    } else if (isAgeFocus && mastery !== 'Mastered') {
      urgency = 35 + (mastery === 'Learning' ? 10 : 0);
      reason = 'age_focus';
      label = 'Recommended for age';
    } else if (mastery === 'Mastered') {
      urgency = 5;
      if (isTarget) urgency += 25;
      reason = isTarget ? 'target_unmastered' : 'review';
      label = isTarget ? 'Target sound (Mastered)' : 'Mastered';
    } else {
      urgency = 15;
      reason = isTarget ? 'target_unmastered' : 'age_focus';
      label = isTarget ? 'Target sound' : 'General practice';
    }

    return {
      soundId: snd.id,
      urgency,
      reason,
      label,
      avgScore,
      mastery,
      scoredTries,
      unscoredTries,
    };
  });

  return results.sort((a, b) => b.urgency - a.urgency);
}

/**
 * Generates an automatic 5-word Daily Challenge customized to the child's problematic sounds.
 * Fully automatic: built from the child's own results, no one has to assign it.
 */
export function getDailyChallenge(
  profile: Profile,
  allWords: Word[] = WORDS,
  today: string = dayKey(),
  count?: number,
): DailyChallengeItem[] {
  const problematic = getProblematicSounds(profile);
  const seed = seedFromDay(today);
  const bandKey = bandFor(profile.age);

  // Filter words suitable for this child's age band
  const ageFiltered = allWords.filter((w) => {
    if (bandKey === '3-4') return w.level !== 2;
    if (bandKey === '7-8') return w.level === 2 || ['r', 'th', 's', 'l'].includes(w.soundId);
    return true;
  });

  // Determine sound pool: if profile has target sounds, strictly prioritize them!
  const targetSounds = (profile.targetSounds || []).filter(Boolean);
  let soundPool: ProblematicSound[];

  if (targetSounds.length > 0) {
    const targetObjs = problematic.filter((s) => targetSounds.includes(s.soundId));
    // Prioritize unmastered/struggling target sounds over mastered ones
    const unmasteredTargets = targetObjs.filter((s) => s.mastery !== 'Mastered');
    soundPool = unmasteredTargets.length > 0 ? unmasteredTargets : targetObjs;
    if (soundPool.length === 0) {
      soundPool = problematic;
    }
  } else {
    // No target sounds configured: pull unmastered and problematic sounds
    const unmastered = problematic.filter((s) => s.reason !== 'review');
    soundPool = unmastered.length >= 3 ? unmastered : problematic;
  }

  const selectedItems: DailyChallengeItem[] = [];
  const chosenWordIds = new Set<string>();
  const targetCount = count ?? (profile.dailyGoal ? profile.dailyGoal : 5);

  for (let slot = 0; slot < targetCount; slot++) {
    // Cycle through target/problematic sounds with seed offset so daily challenge stays fresh each day
    const soundObj = soundPool[(seed + slot) % soundPool.length];
    const soundId = soundObj.soundId;

    const available = ageFiltered.filter((w) => w.soundId === soundId && !chosenWordIds.has(w.id));
    const wordPool = available.length > 0
      ? available
      : allWords.filter((w) => w.soundId === soundId && !chosenWordIds.has(w.id));
    const finalWordPool = wordPool.length > 0
      ? wordPool
      : allWords.filter((w) => w.soundId === soundId);

    // Prioritize words the child struggled with
    const wordAttempts = new Map<string, number>();
    for (const a of profile.attempts || []) {
      if (a.soundId === soundId && a.status === 'scored') {
        const lowest = wordAttempts.get(a.wordId) ?? 100;
        wordAttempts.set(a.wordId, Math.min(lowest, a.score));
      }
    }

    const sorted = [...finalWordPool].sort((wa, wb) => {
      const scoreA = wordAttempts.get(wa.id);
      const scoreB = wordAttempts.get(wb.id);
      if (scoreA !== undefined && scoreB !== undefined) return scoreA - scoreB;
      if (scoreA !== undefined && scoreA < 70) return -1;
      if (scoreB !== undefined && scoreB < 70) return 1;
      if (scoreA === undefined && scoreB !== undefined) return -1;
      return 0;
    });

    // If there is a struggled word (< 70%), pick it for practice; otherwise select by day seed
    const hasStruggled = sorted.length > 0 && wordAttempts.has(sorted[0].id) && (wordAttempts.get(sorted[0].id)! < 70);
    const chosenIndex = hasStruggled ? 0 : (seed + slot * 7) % Math.max(1, sorted.length);
    const chosen = sorted[chosenIndex] || finalWordPool[0];

    chosenWordIds.add(chosen.id);

    const isTarget = targetSounds.includes(soundId);
    let badge = 'Practice';
    if (soundObj.reason === 'low_accuracy') badge = 'Needs Work';
    else if (soundObj.reason === 'struggling') badge = 'Focus';
    else if (isTarget) badge = 'Target';
    else if (soundObj.reason === 'age_focus') badge = 'Daily';
    else badge = 'Review';

    selectedItems.push({
      word: chosen,
      soundId,
      reason: soundObj.label,
      badge,
      isProblematic: isTarget || soundObj.reason === 'low_accuracy' || soundObj.reason === 'struggling' || soundObj.reason === 'target_unmastered',
    });
  }

  return selectedItems;
}
