/**
 * High-fidelity sample response datasets for Demo mode
 */

export const DEMO_DATA = {
  'tg-tet-paper1': {
    examId: 'tg-tet',
    examName: 'TG TET',
    paper: 'Paper 1',
    candidateInfo: {
      candidateName: 'P. Ramesh Kumar',
      rollNumber: '240810992',
      examDate: '20 May 2024',
      shift: 'Shift 1'
    },
    questions: generateTgTETPaper1Questions()
  },
  'neet': {
    examId: 'neet',
    examName: 'NEET UG',
    paper: 'NEET UG',
    candidateInfo: {
      candidateName: 'A. Priya Sharma',
      rollNumber: 'NEET2024789456',
      examDate: '5 May 2024',
      shift: 'Shift 2'
    },
    questions: generateNEETQuestions()
  },
  'jee-main': {
    examId: 'jee-main',
    examName: 'JEE Main',
    paper: 'JEE Main',
    candidateInfo: {
      candidateName: 'V. Suresh Reddy',
      rollNumber: 'JEE2024123456',
      examDate: '27 January 2024',
      shift: 'Shift 1'
    },
    questions: generateJEEQuestions()
  }
};

// Generate TG TET Paper 1 questions (150 questions, 5 subjects)
function generateTgTETPaper1Questions() {
  const questions = [];
  const subjects = [
    { name: 'Child Development & Pedagogy', start: 1, end: 30 },
    { name: 'Language I', start: 31, end: 60 },
    { name: 'Language II (English)', start: 61, end: 90 },
    { name: 'Mathematics', start: 91, end: 120 },
    { name: 'Environmental Studies (EVS)', start: 121, end: 150 }
  ];
  
  const options = ['A', 'B', 'C', 'D'];
  
  for (let i = 1; i <= 150; i++) {
    const subject = subjects.find(s => i >= s.start && i <= s.end);
    const correctAnswer = options[Math.floor(Math.random() * 4)];
    
    // Simulate realistic performance: ~80% correct, 15% wrong, 5% unattempted
    const rand = Math.random();
    let studentAnswer;
    if (rand < 0.05) {
      studentAnswer = null; // Unattempted
    } else if (rand < 0.20) {
      // Wrong answer (different from correct)
      const wrongOptions = options.filter(o => o !== correctAnswer);
      studentAnswer = wrongOptions[Math.floor(Math.random() * 3)];
    } else {
      studentAnswer = correctAnswer; // Correct
    }
    
    questions.push({
      questionNumber: i,
      questionId: `Q${i}`,
      subject: subject ? subject.name : 'General',
      studentAnswer,
      correctAnswer,
      isAttempted: studentAnswer !== null,
      isCorrect: studentAnswer === correctAnswer,
      marksAwarded: 0
    });
  }
  
  return questions;
}

// Generate NEET questions (180 questions, 4 subjects)
function generateNEETQuestions() {
  const questions = [];
  const subjects = [
    { name: 'Physics', start: 1, end: 45 },
    { name: 'Chemistry', start: 46, end: 90 },
    { name: 'Botany', start: 91, end: 135 },
    { name: 'Zoology', start: 136, end: 180 }
  ];
  
  const options = ['A', 'B', 'C', 'D'];
  
  for (let i = 1; i <= 180; i++) {
    const subject = subjects.find(s => i >= s.start && i <= s.end);
    const correctAnswer = options[Math.floor(Math.random() * 4)];
    
    // Simulate realistic performance: ~75% correct, 20% wrong, 5% unattempted
    const rand = Math.random();
    let studentAnswer;
    if (rand < 0.05) {
      studentAnswer = null;
    } else if (rand < 0.25) {
      const wrongOptions = options.filter(o => o !== correctAnswer);
      studentAnswer = wrongOptions[Math.floor(Math.random() * 3)];
    } else {
      studentAnswer = correctAnswer;
    }
    
    questions.push({
      questionNumber: i,
      questionId: `Q${i}`,
      subject: subject ? subject.name : 'General',
      studentAnswer,
      correctAnswer,
      isAttempted: studentAnswer !== null,
      isCorrect: studentAnswer === correctAnswer,
      marksAwarded: 0
    });
  }
  
  return questions;
}

// Generate JEE Main questions (75 questions, 3 subjects)
function generateJEEQuestions() {
  const questions = [];
  const subjects = [
    { name: 'Physics', start: 1, end: 25 },
    { name: 'Chemistry', start: 26, end: 50 },
    { name: 'Mathematics', start: 51, end: 75 }
  ];
  
  const options = ['A', 'B', 'C', 'D'];
  
  for (let i = 1; i <= 75; i++) {
    const subject = subjects.find(s => i >= s.start && i <= s.end);
    const correctAnswer = options[Math.floor(Math.random() * 4)];
    
    // Simulate realistic performance: ~70% correct, 25% wrong, 5% unattempted
    const rand = Math.random();
    let studentAnswer;
    if (rand < 0.05) {
      studentAnswer = null;
    } else if (rand < 0.30) {
      const wrongOptions = options.filter(o => o !== correctAnswer);
      studentAnswer = wrongOptions[Math.floor(Math.random() * 3)];
    } else {
      studentAnswer = correctAnswer;
    }
    
    questions.push({
      questionNumber: i,
      questionId: `Q${i}`,
      subject: subject ? subject.name : 'General',
      studentAnswer,
      correctAnswer,
      isAttempted: studentAnswer !== null,
      isCorrect: studentAnswer === correctAnswer,
      marksAwarded: 0
    });
  }
  
  return questions;
}

export const getDemoData = (examId) => {
  const demoKey = examId === 'tg-tet' ? 'tg-tet-paper1' : examId;
  return DEMO_DATA[demoKey] || null;
};

export const getAllDemoExams = () => {
  return Object.keys(DEMO_DATA).map(key => ({
    id: key,
    examId: DEMO_DATA[key].examId,
    examName: DEMO_DATA[key].examName,
    paper: DEMO_DATA[key].paper
  }));
};
