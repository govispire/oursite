import { useEffect, useState, useCallback } from 'react';
import {
  allSyllabusData,
  ExamSyllabusConfig,
  TierConfig,
  SubjectConfig,
  TopicConfig,
  VideoResource,
  PdfResource,
  TestResource,
} from '@/data/syllabusData';

const STORAGE_KEY = 'prepsmart.syllabus.v1';
const EVENT = 'syllabus:changed';

export type SyllabusMap = Record<string, ExamSyllabusConfig>;

function readFromStorage(): SyllabusMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return JSON.parse(JSON.stringify(allSyllabusData));
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') return parsed;
  } catch (e) {
    console.warn('Failed to read syllabus storage', e);
  }
  return JSON.parse(JSON.stringify(allSyllabusData));
}

function writeToStorage(data: SyllabusMap) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent(EVENT));
  } catch (e: any) {
    console.error('Failed to save syllabus', e);
    throw new Error(
      e?.name === 'QuotaExceededError'
        ? 'Browser storage is full. Try removing large uploads or use URLs instead.'
        : 'Failed to save changes.'
    );
  }
}

// Singleton in-memory cache so multiple consumers share state without re-reading localStorage.
let cache: SyllabusMap | null = null;
function getCache(): SyllabusMap {
  if (!cache) cache = readFromStorage();
  return cache;
}

export function useSyllabusStore() {
  const [data, setData] = useState<SyllabusMap>(() => getCache());

  useEffect(() => {
    const refresh = () => {
      cache = readFromStorage();
      setData(cache);
    };
    window.addEventListener(EVENT, refresh);
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY) refresh();
    });
    return () => {
      window.removeEventListener(EVENT, refresh);
    };
  }, []);

  const commit = useCallback((next: SyllabusMap) => {
    cache = next;
    setData(next);
    writeToStorage(next);
  }, []);

  const updateExam = useCallback(
    (examId: string, updater: (e: ExamSyllabusConfig) => ExamSyllabusConfig) => {
      const current = getCache();
      if (!current[examId]) return;
      commit({ ...current, [examId]: updater({ ...current[examId] }) });
    },
    [commit]
  );

  const upsertExam = useCallback(
    (exam: ExamSyllabusConfig) => {
      commit({ ...getCache(), [exam.examId]: exam });
    },
    [commit]
  );

  const deleteExam = useCallback(
    (examId: string) => {
      const next = { ...getCache() };
      delete next[examId];
      commit(next);
    },
    [commit]
  );

  const resetToDefaults = useCallback(() => {
    commit(JSON.parse(JSON.stringify(allSyllabusData)));
  }, [commit]);

  const exportJSON = useCallback((): string => {
    return JSON.stringify(getCache(), null, 2);
  }, []);

  const importJSON = useCallback(
    (json: string) => {
      const parsed = JSON.parse(json);
      if (!parsed || typeof parsed !== 'object') throw new Error('Invalid JSON.');
      commit(parsed);
    },
    [commit]
  );

  return {
    data,
    updateExam,
    upsertExam,
    deleteExam,
    resetToDefaults,
    exportJSON,
    importJSON,
  };
}

// Helper mutators for tier-level work
export const tierMutators = {
  mapTier(
    exam: ExamSyllabusConfig,
    tierId: string,
    fn: (t: TierConfig) => TierConfig
  ): ExamSyllabusConfig {
    return { ...exam, tiers: exam.tiers.map((t) => (t.id === tierId ? fn({ ...t }) : t)) };
  },
  mapSubject(
    exam: ExamSyllabusConfig,
    tierId: string,
    subjectId: string,
    fn: (s: SubjectConfig) => SubjectConfig
  ): ExamSyllabusConfig {
    return tierMutators.mapTier(exam, tierId, (t) => ({
      ...t,
      subjects: t.subjects.map((s) => (s.id === subjectId ? fn({ ...s }) : s)),
    }));
  },
  mapTopic(
    exam: ExamSyllabusConfig,
    tierId: string,
    subjectId: string,
    topicId: string,
    fn: (tp: TopicConfig) => TopicConfig
  ): ExamSyllabusConfig {
    return tierMutators.mapSubject(exam, tierId, subjectId, (s) => ({
      ...s,
      topics: s.topics.map((tp) => (tp.id === topicId ? fn({ ...tp }) : tp)),
    }));
  },
};

export type { ExamSyllabusConfig, TierConfig, SubjectConfig, TopicConfig, VideoResource, PdfResource, TestResource };
