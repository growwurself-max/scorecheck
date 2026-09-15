// Default marking schemes, papers, and subject definitions for all supported exams

export const EXAM_CONFIGS = {
  'tg-tet': {
    id: 'tg-tet',
    name: 'TG TET',
    papers: [
      {
        id: 'paper1',
        name: 'Paper 1 (Classes I–V)',
        totalQuestions: 150,
        marksPerCorrect: 1,
        negativeMarksPerWrong: 0,
        marksPerUnanswered: 0,
        subjects: [
          { name: 'Child Development & Pedagogy', questions: 30 },
          { name: 'Language I', questions: 30 },
          { name: 'Language II (English)', questions: 30 },
          { name: 'Mathematics', questions: 30 },
          { name: 'Environmental Studies (EVS)', questions: 30 }
        ]
      },
      {
        id: 'paper2-math-science',
        name: 'Paper 2 (Classes VI–VIII - Maths & Science)',
        totalQuestions: 150,
        marksPerCorrect: 1,
        negativeMarksPerWrong: 0,
        marksPerUnanswered: 0,
        subjects: [
          { name: 'Child Development & Pedagogy', questions: 30 },
          { name: 'Language I', questions: 30 },
          { name: 'Language II (English)', questions: 30 },
          { name: 'Mathematics & Science', questions: 60 }
        ]
      },
      {
        id: 'paper2-social',
        name: 'Paper 2 (Classes VI–VIII - Social Studies)',
        totalQuestions: 150,
        marksPerCorrect: 1,
        negativeMarksPerWrong: 0,
        marksPerUnanswered: 0,
        subjects: [
          { name: 'Child Development & Pedagogy', questions: 30 },
          { name: 'Language I', questions: 30 },
          { name: 'Language II (English)', questions: 30 },
          { name: 'Social Studies', questions: 60 }
        ]
      }
    ]
  },
  'neet': {
    id: 'neet',
    name: 'NEET UG',
    papers: [
      {
        id: 'default',
        name: 'NEET UG',
        totalQuestions: 180,
        marksPerCorrect: 4,
        negativeMarksPerWrong: 1,
        marksPerUnanswered: 0,
        subjects: [
          { name: 'Physics', questions: 45 },
          { name: 'Chemistry', questions: 45 },
          { name: 'Botany', questions: 45 },
          { name: 'Zoology', questions: 45 }
        ]
      }
    ]
  },
  'jee-main': {
    id: 'jee-main',
    name: 'JEE Main',
    papers: [
      {
        id: 'default',
        name: 'JEE Main',
        totalQuestions: 75,
        marksPerCorrect: 4,
        negativeMarksPerWrong: 1,
        marksPerUnanswered: 0,
        subjects: [
          { name: 'Physics', questions: 25 },
          { name: 'Chemistry', questions: 25 },
          { name: 'Mathematics', questions: 25 }
        ]
      }
    ]
  },
  'eamcet': {
    id: 'eamcet',
    name: 'EAMCET / TG EAPCET',
    papers: [
      {
        id: 'engineering',
        name: 'Engineering',
        totalQuestions: 160,
        marksPerCorrect: 1,
        negativeMarksPerWrong: 0,
        marksPerUnanswered: 0,
        subjects: [
          { name: 'Mathematics', questions: 80 },
          { name: 'Physics', questions: 40 },
          { name: 'Chemistry', questions: 40 }
        ]
      },
      {
        id: 'agri-medical',
        name: 'Agriculture & Medical',
        totalQuestions: 160,
        marksPerCorrect: 1,
        negativeMarksPerWrong: 0,
        marksPerUnanswered: 0,
        subjects: [
          { name: 'Botany', questions: 40 },
          { name: 'Zoology', questions: 40 },
          { name: 'Physics', questions: 40 },
          { name: 'Chemistry', questions: 40 }
        ]
      }
    ]
  },
  'ssc': {
    id: 'ssc',
    name: 'SSC',
    papers: [
      {
        id: 'cgl',
        name: 'SSC CGL',
        totalQuestions: 100,
        marksPerCorrect: 2,
        negativeMarksPerWrong: 0.5,
        marksPerUnanswered: 0,
        subjects: [
          { name: 'General Intelligence & Reasoning', questions: 25 },
          { name: 'General Awareness', questions: 25 },
          { name: 'Quantitative Aptitude', questions: 25 },
          { name: 'English Comprehension', questions: 25 }
        ]
      },
      {
        id: 'chsl',
        name: 'SSC CHSL',
        totalQuestions: 100,
        marksPerCorrect: 2,
        negativeMarksPerWrong: 0.5,
        marksPerUnanswered: 0,
        subjects: [
          { name: 'General Intelligence', questions: 25 },
          { name: 'General Awareness', questions: 25 },
          { name: 'Quantitative Aptitude', questions: 25 },
          { name: 'English Language', questions: 25 }
        ]
      }
    ]
  },
  'rrb': {
    id: 'rrb',
    name: 'RRB',
    papers: [
      {
        id: 'ntpc',
        name: 'RRB NTPC',
        totalQuestions: 100,
        marksPerCorrect: 1,
        negativeMarksPerWrong: 0.33,
        marksPerUnanswered: 0,
        subjects: [
          { name: 'General Awareness', questions: 40 },
          { name: 'Mathematics', questions: 30 },
          { name: 'General Intelligence & Reasoning', questions: 30 }
        ]
      },
      {
        id: 'group-d',
        name: 'RRB Group D',
        totalQuestions: 100,
        marksPerCorrect: 1,
        negativeMarksPerWrong: 0.33,
        marksPerUnanswered: 0,
        subjects: [
          { name: 'General Science', questions: 25 },
          { name: 'Mathematics', questions: 25 },
          { name: 'General Intelligence & Reasoning', questions: 30 },
          { name: 'General Awareness & Current Affairs', questions: 20 }
        ]
      }
    ]
  },
  'custom': {
    id: 'custom',
    name: 'Custom Exam',
    papers: [
      {
        id: 'custom',
        name: 'Custom',
        totalQuestions: 100,
        marksPerCorrect: 1,
        negativeMarksPerWrong: 0,
        marksPerUnanswered: 0,
        subjects: [
          { name: 'Subject 1', questions: 25 },
          { name: 'Subject 2', questions: 25 },
          { name: 'Subject 3', questions: 25 },
          { name: 'Subject 4', questions: 25 }
        ]
      }
    ]
  }
};

export const getExamConfig = (examId) => {
  return EXAM_CONFIGS[examId] || null;
};

export const getPaperConfig = (examId, paperId) => {
  const exam = EXAM_CONFIGS[examId];
  if (!exam) return null;
  return exam.papers.find(p => p.id === paperId) || null;
};

export const getAllExams = () => {
  return Object.values(EXAM_CONFIGS).map(exam => ({
    id: exam.id,
    name: exam.name,
    papers: exam.papers.map(p => ({ id: p.id, name: p.name }))
  }));
};
