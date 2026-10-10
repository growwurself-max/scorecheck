import express from 'express';
import { fetchWithRedirectValidation } from '../services/fetchService.js';
import { parseResponseSheet } from '../parsers/index.js';
import { calculateScores } from '../services/scoreCalculator.js';
import { analyzeSubjects } from '../services/subjectAnalyzer.js';
import { getExamConfig, getPaperConfig } from '../configs/examConfigs.js';
import { getDemoData } from '../utils/mockData.js';

const router = express.Router();

/**
 * POST /api/analyze
 * Analyze a response sheet from a URL
 */
router.post('/analyze', async (req, res) => {
  try {
    const { url, exam = 'tg-tet', paper, marksPerCorrect = 1, negativeMarksPerWrong = 0 } = req.body;
    
    // Validate required fields
    if (!url || !url.startsWith('http')) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid response-sheet URL.'
      });
    }
    
    // Get exam configuration
    let examConfig = getExamConfig(exam);
    let paperConfig = null;
    
    if (examConfig) {
      paperConfig = getPaperConfig(exam, paper);
    }
    
    // Use provided marking scheme or fall back to config
    const mpc = marksPerCorrect !== undefined ? marksPerCorrect : (paperConfig?.marksPerCorrect || 1);
    const nmpw = negativeMarksPerWrong !== undefined ? negativeMarksPerWrong : (paperConfig?.negativeMarksPerWrong || 0);
    const mpu = 0; // TG TET has 0 marks for unanswered
    
    // Fetch the response sheet
    const fetchResult = await fetchWithRedirectValidation(url);
    
    if (!fetchResult.success) {
      return res.status(400).json({
        success: false,
        error: fetchResult.error || 'Failed to fetch response sheet'
      });
    }
    
    // Parse the HTML
    const parsedData = await parseResponseSheet(fetchResult.data, exam, paper, url);
    
    if (!parsedData.questions || parsedData.questions.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Unable to parse questions from the response sheet. The format may not be supported.'
      });
    }
    
    // Calculate scores - this adds isCorrect, marksAwarded, and status to questions
    const summary = calculateScores(parsedData.questions, mpc, nmpw, mpu);
    
    // Calculate subject-wise breakdown from scored questions (now have status field)
    const subjects = analyzeSubjects(parsedData.questions, {
      marksPerCorrect: mpc,
      negativeMarksPerWrong: nmpw
    });
    
    // Get exam name and paper name
    const examName = examConfig?.name || exam === 'tg-tet' ? 'TG TET' : exam.toUpperCase();
    const paperName = parsedData.candidateInfo.paper || paperConfig?.name || paper || 'Paper 1';
    
    // Format questions for response with status
    const formattedQuestions = parsedData.questions.map(q => ({
      questionNumber: q.questionNumber,
      subject: q.subject,
      studentAnswer: q.studentAnswer,
      correctAnswer: q.correctAnswer,
      status: !q.studentAnswer ? 'unattempted' : (q.isCorrect ? 'correct' : 'wrong'),
      marks: q.marksAwarded
    }));
    
    res.json({
      success: true,
      data: {
        examId: exam || 'custom',
        examName,
        paper: paperName,
        candidateInfo: parsedData.candidateInfo,
        summary,
        subjects,
        questions: formattedQuestions
      }
    });
    
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to analyze response sheet'
    });
  }
});

/**
 * GET /api/demo/:examId
 * Get demo data for a specific exam
 */
router.get('/demo/:examId', (req, res) => {
  try {
    const { examId } = req.params;
    
    const demoData = getDemoData(examId);
    
    if (!demoData) {
      return res.status(404).json({
        success: false,
        error: 'Demo data not found for this exam'
      });
    }
    
    // Get exam configuration for marking scheme
    const examConfig = getExamConfig(demoData.examId);
    const paperConfig = examConfig?.papers[0];
    
    const mpc = paperConfig?.marksPerCorrect || 1;
    const nmpw = paperConfig?.negativeMarksPerWrong || 0;
    const mpu = paperConfig?.marksPerUnanswered || 0;
    
    // Calculate scores
    const summary = calculateScores(demoData.questions, mpc, nmpw, mpu);
    
    // Calculate subject-wise breakdown
    const subjects = calculateSubjectScores(demoData.questions, mpc, nmpw, mpu);
    
    // Format questions for response
    const formattedQuestions = demoData.questions.map(q => ({
      questionNumber: q.questionNumber,
      subject: q.subject,
      studentAnswer: q.studentAnswer,
      correctAnswer: q.correctAnswer,
      status: !q.studentAnswer ? 'unattempted' : (q.isCorrect ? 'correct' : 'wrong'),
      marks: q.marksAwarded
    }));
    
    // Add demo watermark
    res.json({
      success: true,
      data: {
        examId: demoData.examId,
        examName: demoData.examName,
        paper: demoData.paper,
        candidateInfo: demoData.candidateInfo,
        summary,
        subjects,
        questions: formattedQuestions,
        isDemo: true
      }
    });
    
  } catch (error) {
    console.error('Demo error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to load demo data'
    });
  }
});

/**
 * GET /api/exams
 * Get list of supported exams
 */
router.get('/exams', (req, res) => {
  try {
    const { getAllExams } = require('../configs/examConfigs.js');
    const exams = getAllExams();
    
    res.json({
      success: true,
      data: exams
    });
  } catch (error) {
    console.error('Exams error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get exams list'
    });
  }
});

export default router;
