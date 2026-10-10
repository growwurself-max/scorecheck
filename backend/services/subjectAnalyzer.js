/**
 * Dynamic aggregator grouping questions by subject/section
 */

export function analyzeSubjects(questions, config = {}) {
  const marksPerCorrect = Number(config.marksPerCorrect ?? 1);
  const negativeMarks = Math.abs(Number(config.negativeMarksPerWrong ?? 0));

  const map = new Map();

  questions.forEach((q) => {
    const subName = q.subject || 'General';
    
    if (!map.has(subName)) {
      map.set(subName, {
        name: subName,
        totalQuestions: 0,
        attempted: 0,
        unattempted: 0,
        correct: 0,
        wrong: 0,
        score: 0,
        maxScore: 0,
        percentage: 0,
        accuracy: 0
      });
    }

    const item = map.get(subName);
    item.totalQuestions += 1;
    item.maxScore += marksPerCorrect;

    // Direct answer comparison (resilient to string types)
    const studentAns = q.studentAnswer !== null && q.studentAnswer !== undefined 
      ? String(q.studentAnswer).trim() 
      : null;
    const correctAns = q.correctAnswer !== null && q.correctAnswer !== undefined 
      ? String(q.correctAnswer).trim() 
      : '';

    const isAttempted = studentAns !== null && studentAns !== '' && studentAns !== '--' && studentAns !== '-';

    if (isAttempted) {
      item.attempted += 1;
      if (studentAns === correctAns || q.status === 'correct') {
        item.correct += 1;
        item.score += marksPerCorrect;
      } else {
        item.wrong += 1;
        item.score -= negativeMarks;
      }
    } else {
      item.unattempted += 1;
    }
  });

  return Array.from(map.values()).map((s) => {
    s.score = Math.max(0, Number(s.score.toFixed(2)));
    s.percentage = s.maxScore > 0 ? Number(((s.score / s.maxScore) * 100).toFixed(1)) : 0;
    s.accuracy = s.attempted > 0 ? Number(((s.correct / s.attempted) * 100).toFixed(1)) : 0;
    return s;
  });
}

export const analyzeBySubject = (questions) => {
  const subjectMap = new Map();
  
  questions.forEach(question => {
    const subject = question.subject || 'General';
    
    if (!subjectMap.has(subject)) {
      subjectMap.set(subject, {
        name: subject,
        questions: [],
        totalQuestions: 0,
        correct: 0,
        wrong: 0,
        unattempted: 0
      });
    }
    
    const subjectData = subjectMap.get(subject);
    subjectData.questions.push(question);
    subjectData.totalQuestions++;
    
    if (!question.studentAnswer) {
      subjectData.unattempted++;
    } else if (question.isCorrect) {
      subjectData.correct++;
    } else {
      subjectData.wrong++;
    }
  });
  
  return Array.from(subjectMap.values());
};

export const getSubjectWiseBreakdown = (questions, marksPerCorrect, negativeMarksPerWrong, marksPerUnanswered) => {
  const subjectAnalysis = analyzeBySubject(questions);
  
  return subjectAnalysis.map(subject => {
    const attempted = subject.correct + subject.wrong;
    const score = (subject.correct * marksPerCorrect) - (subject.wrong * negativeMarksPerWrong) + (subject.unattempted * marksPerUnanswered);
    const maxScore = subject.totalQuestions * marksPerCorrect;
    const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
    const accuracy = attempted > 0 ? (subject.correct / attempted) * 100 : 0;
    
    return {
      name: subject.name,
      totalQuestions: subject.totalQuestions,
      attempted,
      unattempted: subject.unattempted,
      correct: subject.correct,
      wrong: subject.wrong,
      score: parseFloat(score.toFixed(2)),
      maxScore,
      percentage: parseFloat(percentage.toFixed(2)),
      accuracy: parseFloat(accuracy.toFixed(2))
    };
  });
};

export const filterQuestionsBySubject = (questions, subject) => {
  if (!subject || subject === 'All') {
    return questions;
  }
  return questions.filter(q => q.subject === subject);
};

export const filterQuestionsByStatus = (questions, status) => {
  switch (status) {
    case 'correct':
      return questions.filter(q => q.isCorrect);
    case 'wrong':
      return questions.filter(q => !q.isCorrect && q.studentAnswer);
    case 'unattempted':
      return questions.filter(q => !q.studentAnswer);
    default:
      return questions;
  }
};

export const getWrongAnswersBySubject = (questions) => {
  const wrongQuestions = questions.filter(q => !q.isCorrect && q.studentAnswer);
  const subjectMap = new Map();
  
  wrongQuestions.forEach(question => {
    const subject = question.subject || 'General';
    
    if (!subjectMap.has(subject)) {
      subjectMap.set(subject, []);
    }
    
    subjectMap.get(subject).push(question);
  });
  
  return {
    total: wrongQuestions.length,
    bySubject: Object.fromEntries(subjectMap)
  };
};
