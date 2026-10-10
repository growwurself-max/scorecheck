// Dedicated TG TET Paper 1 & Paper 2 configurations

export const TG_TET_CONFIG = {
  paper1: {
    id: 'paper1',
    name: 'Paper 1 (Classes I–V)',
    totalQuestions: 150,
    marksPerCorrect: 1,
    negativeMarksPerWrong: 0,
    marksPerUnanswered: 0,
    subjectRanges: [
      { name: 'Child Development & Pedagogy', start: 1, end: 30 },
      { name: 'Language I', start: 31, end: 60 },
      { name: 'Language II (English)', start: 61, end: 90 },
      { name: 'Mathematics', start: 91, end: 120 },
      { name: 'Environmental Studies (EVS)', start: 121, end: 150 }
    ]
  },
  'paper2-math-science': {
    id: 'paper2-math-science',
    name: 'Paper 2 (Classes VI–VIII - Maths & Science)',
    totalQuestions: 150,
    marksPerCorrect: 1,
    negativeMarksPerWrong: 0,
    marksPerUnanswered: 0,
    subjectRanges: [
      { name: 'Child Development & Pedagogy', start: 1, end: 30 },
      { name: 'Language I', start: 31, end: 60 },
      { name: 'Language II (English)', start: 61, end: 90 },
      { name: 'Mathematics & Science', start: 91, end: 150 }
    ]
  },
  'paper2-social': {
    id: 'paper2-social',
    name: 'Paper 2 (Classes VI–VIII - Social Studies)',
    totalQuestions: 150,
    marksPerCorrect: 1,
    negativeMarksPerWrong: 0,
    marksPerUnanswered: 0,
    subjectRanges: [
      { name: 'Child Development & Pedagogy', start: 1, end: 30 },
      { name: 'Language I', start: 31, end: 60 },
      { name: 'Language II (English)', start: 61, end: 90 },
      { name: 'Social Studies', start: 91, end: 150 }
    ]
  }
};

export const getSubjectForQuestion = (questionNumber, paperId) => {
  const config = TG_TET_CONFIG[paperId];
  if (!config) return 'General';
  
  for (const subject of config.subjectRanges) {
    if (questionNumber >= subject.start && questionNumber <= subject.end) {
      return subject.name;
    }
  }
  return 'General';
};
