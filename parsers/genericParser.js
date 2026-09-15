import * as cheerio from 'cheerio';

/**
 * Heuristic fallback table/table-row/div extractor
 * Used when specific exam parsers don't match or for custom exams
 */
export const parseGeneric = ($, examType, paperId) => {
  const candidateInfo = extractCandidateInfo($, examType);
  const questions = extractQuestions($);
  
  return {
    candidateInfo,
    questions
  };
};

const extractCandidateInfo = ($, examType) => {
  const info = {
    candidateName: null,
    rollNumber: null,
    examDate: null,
    shift: null,
    paper: examType === 'custom' ? 'Custom Exam' : examType || 'Unknown'
  };
  
  // Extract candidate name
  const nameSelectors = [
    'td:contains("Name")',
    'td:contains("Candidate Name")',
    '.candidate-name',
    '.name',
    'th:contains("Name")'
  ];
  
  for (const selector of nameSelectors) {
    const element = $(selector).first();
    if (element.length) {
      const parent = element.parent();
      const nameCell = parent.find('td').eq(1).text().trim() || 
                       parent.next().find('td').first().text().trim() ||
                       element.next().text().trim();
      if (nameCell && nameCell.length > 2) {
        info.candidateName = nameCell;
        break;
      }
    }
  }
  
  // Extract roll number
  const rollSelectors = [
    'td:contains("Roll No")',
    'td:contains("Roll Number")',
    'td:contains("Registration No")',
    'td:contains("Application No")',
    '.roll-number',
    '.roll-no'
  ];
  
  for (const selector of rollSelectors) {
    const element = $(selector).first();
    if (element.length) {
      const parent = element.parent();
      const rollCell = parent.find('td').eq(1).text().trim() || 
                       parent.next().find('td').first().text().trim() ||
                       element.next().text().trim();
      if (rollCell && rollCell.length > 2) {
        info.rollNumber = rollCell;
        break;
      }
    }
  }
  
  // Extract exam date
  const dateSelectors = [
    'td:contains("Date")',
    'td:contains("Exam Date")',
    '.exam-date',
    '.date'
  ];
  
  for (const selector of dateSelectors) {
    const element = $(selector).first();
    if (element.length) {
      const parent = element.parent();
      const dateCell = parent.find('td').eq(1).text().trim() || 
                       parent.next().find('td').first().text().trim() ||
                       element.next().text().trim();
      if (dateCell && dateCell.match(/\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4}/)) {
        info.examDate = dateCell;
        break;
      }
    }
  }
  
  // Extract shift
  const shiftSelectors = [
    'td:contains("Shift")',
    'td:contains("Slot")',
    '.shift'
  ];
  
  for (const selector of shiftSelectors) {
    const element = $(selector).first();
    if (element.length) {
      const parent = element.parent();
      const shiftCell = parent.find('td').eq(1).text().trim() || 
                        parent.next().find('td').first().text().trim() ||
                        element.next().text().trim();
      if (shiftCell) {
        info.shift = shiftCell;
        break;
      }
    }
  }
  
  return info;
};

const extractQuestions = ($) => {
  const questions = [];
  
  // Try table-based extraction first
  const tables = $('table');
  
  tables.each((tableIndex, table) => {
    const $table = $(table);
    const rows = $table.find('tr');
    
    let hasQuestionData = false;
    
    // Check if this table contains question data
    rows.each((rowIndex, row) => {
      const $row = $(row);
      const firstCell = $row.find('td').first().text().trim();
      if (/^\d+$/.test(firstCell) && parseInt(firstCell) > 0) {
        hasQuestionData = true;
        return false;
      }
    });
    
    if (hasQuestionData) {
      rows.each((rowIndex, row) => {
        const $row = $(row);
        const cells = $row.find('td');
        
        if (cells.length < 2) return;
        
        const firstCellText = cells.eq(0).text().trim();
        const questionNumber = parseInt(firstCellText);
        
        if (!isNaN(questionNumber) && questionNumber > 0 && questionNumber <= 200) {
          let studentAnswer = null;
          let correctAnswer = null;
          
          // Extract answers from cells
          cells.each((cellIndex, cell) => {
            const $cell = $(cell);
            const text = $cell.text().trim();
            
            // Check for selected option (bold, checkmark, etc.)
            if ($cell.find('b, strong').length || 
                text.includes('✓') || 
                text.includes('✗') ||
                text.toLowerCase().includes('selected') ||
                text.toLowerCase().includes('attempted')) {
              const optionMatch = text.match(/[A-Da-d]/);
              if (optionMatch) studentAnswer = optionMatch[0].toUpperCase();
            }
            
            // Check for correct answer key
            if (text.toLowerCase().includes('key') || 
                text.toLowerCase().includes('answer') ||
                text.toLowerCase().includes('correct')) {
              const nextCell = cells.eq(cellIndex + 1);
              if (nextCell.length) {
                const optionMatch = nextCell.text().trim().match(/[A-Da-d]/);
                if (optionMatch) correctAnswer = optionMatch[0].toUpperCase();
              }
            }
          });
          
          // Alternative: look for patterns in the entire row
          if (!studentAnswer) {
            const rowText = $row.text();
            const selectedMatch = rowText.match(/selected[:\s]*([A-Da-d])/i);
            if (selectedMatch) studentAnswer = selectedMatch[1].toUpperCase();
          }
          
          if (!correctAnswer) {
            const rowText = $row.text();
            const keyMatch = rowText.match(/key[:\s]*([A-Da-d])/i);
            if (keyMatch) correctAnswer = keyMatch[1].toUpperCase();
          }
          
          questions.push({
            questionNumber,
            questionId: `Q${questionNumber}`,
            subject: 'General',
            studentAnswer,
            correctAnswer,
            isAttempted: studentAnswer !== null,
            isCorrect: studentAnswer === correctAnswer,
            marksAwarded: 0
          });
        }
      });
    }
  });
  
  // If no questions found from tables, try div-based layout
  if (questions.length === 0) {
    const questionDivs = $('.question, .q-row, [class*="question"], [class*="Question"]');
    
    questionDivs.each((index, div) => {
      const $div = $(div);
      const text = $div.text();
      const numberMatch = text.match(/^(\d+)[\.\)]/);
      
      if (numberMatch) {
        const questionNumber = parseInt(numberMatch[1]);
        if (questionNumber > 0 && questionNumber <= 200) {
          let studentAnswer = null;
          let correctAnswer = null;
          
          const selectedMatch = text.match(/selected[:\s]*([A-Da-d])/i);
          if (selectedMatch) studentAnswer = selectedMatch[1].toUpperCase();
          
          const keyMatch = text.match(/key[:\s]*([A-Da-d])/i);
          if (keyMatch) correctAnswer = keyMatch[1].toUpperCase();
          
          questions.push({
            questionNumber,
            questionId: `Q${questionNumber}`,
            subject: 'General',
            studentAnswer,
            correctAnswer,
            isAttempted: studentAnswer !== null,
            isCorrect: studentAnswer === correctAnswer,
            marksAwarded: 0
          });
        }
      }
    });
  }
  
  // Sort by question number
  questions.sort((a, b) => a.questionNumber - b.questionNumber);
  
  return questions;
};
