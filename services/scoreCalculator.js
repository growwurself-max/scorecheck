/**
 * Universal score, accuracy, and negative marking calculator
 */

export const calculateScores = (questions, marksPerCorrect, negativeMarksPerWrong, marksPerUnanswered) => {
  let correct = 0;
  let wrong = 0;
  let unattempted = 0;
  let positiveMarks = 0;
  let negativeMarks = 0;
  let totalScore = 0;
  
  questions.forEach(question => {
    // Use string equality for comparison
    const studentAns = question.studentAnswer ? String(question.studentAnswer).trim() : null;
    const correctAns = question.correctAnswer ? String(question.correctAnswer).trim() : '';
    
    // Update isCorrect based on answers
    if (studentAns && correctAns) {
      question.isCorrect = studentAns === correctAns;
    } else if (!studentAns) {
      question.isCorrect = false;
    }
    
    if (!studentAns || studentAns === '' || studentAns === '--') {
      // Unattempted
      unattempted++;
      const marks = marksPerUnanswered || 0;
      question.marksAwarded = marks;
      totalScore += marks;
    } else if (studentAns === correctAns) {
      // Correct
      correct++;
      const marks = marksPerCorrect || 0;
      question.marksAwarded = marks;
      positiveMarks += marks;
      totalScore += marks;
    } else {
      // Wrong
      wrong++;
      const marks = -(negativeMarksPerWrong || 0);
      question.marksAwarded = marks;
      negativeMarks += Math.abs(marks);
      totalScore += marks;
    }
  });
  
  const totalQuestions = questions.length;
  const attempted = correct + wrong;
  const maxScore = totalQuestions * (marksPerCorrect || 0);
  const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
  const accuracy = attempted > 0 ? (correct / attempted) * 100 : 0;
  
  // Determine performance rating
  const performanceRating = getPerformanceRating(percentage);
  
  return {
    totalQuestions,
    attempted,
    unattempted,
    correct,
    wrong,
    totalScore,
    maxScore,
    percentage: parseFloat(percentage.toFixed(2)),
    accuracy: parseFloat(accuracy.toFixed(2)),
    positiveMarks,
    negativeMarks,
    performanceRating
  };
};

const getPerformanceRating = (percentage) => {
  if (percentage >= 90) return 'Excellent';
  if (percentage >= 80) return 'Very Good';
  if (percentage >= 70) return 'Good';
  if (percentage >= 60) return 'Satisfactory';
  if (percentage >= 50) return 'Average';
  return 'Needs Improvement';
};

export const calculateSubjectScores = (questions, marksPerCorrect, negativeMarksPerWrong, marksPerUnanswered) => {
  const subjectMap = new Map();
  
  questions.forEach(question => {
    const subject = question.subject || 'General';
    
    if (!subjectMap.has(subject)) {
      subjectMap.set(subject, {
        name: subject,
        totalQuestions: 0,
        attempted: 0,
        unattempted: 0,
        correct: 0,
        wrong: 0,
        score: 0,
        maxScore: 0
      });
    }
    
    const subjectData = subjectMap.get(subject);
    subjectData.totalQuestions++;
    subjectData.maxScore += marksPerCorrect || 0;
    
    // Use string equality for comparison
    const studentAns = question.studentAnswer ? String(question.studentAnswer).trim() : null;
    const correctAns = question.correctAnswer ? String(question.correctAnswer).trim() : '';
    
    if (!studentAns || studentAns === '' || studentAns === '--') {
      subjectData.unattempted++;
      subjectData.score += marksPerUnanswered || 0;
    } else if (studentAns === correctAns) {
      subjectData.attempted++;
      subjectData.correct++;
      subjectData.score += marksPerCorrect || 0;
    } else {
      subjectData.attempted++;
      subjectData.wrong++;
      subjectData.score -= negativeMarksPerWrong || 0;
    }
  });
  
  // Calculate percentages and accuracy for each subject
  const subjects = Array.from(subjectMap.values()).map(subject => {
    const percentage = subject.maxScore > 0 ? (subject.score / subject.maxScore) * 100 : 0;
    const accuracy = subject.attempted > 0 ? (subject.correct / subject.attempted) * 100 : 0;
    
    return {
      ...subject,
      percentage: parseFloat(percentage.toFixed(2)),
      accuracy: parseFloat(accuracy.toFixed(2))
    };
  });
  
  // Sort by score descending
  subjects.sort((a, b) => b.score - a.score);
  
  return subjects;
};
