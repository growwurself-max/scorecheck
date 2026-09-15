import * as cheerio from 'cheerio';

/**
 * Dedicated parser for RRB response formats
 */
export const parseRRB = ($, paperId = 'ntpc') => {
  const candidateInfo = extractCandidateInfo($);
  const questions = extractQuestions($);
  
  return {
    candidateInfo,
    questions
  };
};

const extractCandidateInfo = ($) => {
  const info = {
    candidateName: null,
    rollNumber: null,
    examDate: null,
    shift: null,
    paper: paperId === 'ntpc' ? 'RRB NTPC' : 'RRB Group D'
  };
  
  // Extract candidate name
  const nameSelectors = [
    'td:contains("Name")',
    'td:contains("Candidate Name")',
    '.candidate-name',
    '.name'
  ];
  
  for (const selector of nameSelectors) {
    const element = $(selector).first();
    if (element.length) {
      const parent = element.parent();
      const nameCell = parent.find('td').eq(1).text().trim() || 
                       parent.next().find('td').first().text().trim();
      if (nameCell && nameCell.length > 2) {
        info.candidateName = nameCell;
        break;
      }
    }
  }
  
  // Extract roll number
  const rollSelectors = [
    'td:contains("Roll No")',
    'td:contains("Registration No")',
    '.roll-number'
  ];
  
  for (const selector of rollSelectors) {
    const element = $(selector).first();
    if (element.length) {
      const parent = element.parent();
      const rollCell = parent.find('td').eq(1).text().trim() || 
                       parent.next().find('td').first().text().trim();
      if (rollCell && rollCell.length > 2) {
        info.rollNumber = rollCell;
        break;
      }
    }
  }
  
  // Extract exam date and shift
  const dateShiftSelectors = [
    'td:contains("Date")',
    'td:contains("Shift")'
  ];
  
  for (const selector of dateShiftSelectors) {
    const element = $(selector).first();
    if (element.length) {
      const parent = element.parent();
      const cellText = parent.find('td').eq(1).text().trim() || 
                      parent.next().find('td').first().text().trim();
      if (cellText) {
        if (selector.includes('Date')) {
          info.examDate = cellText;
        } else {
          info.shift = cellText;
        }
      }
    }
  }
  
  return info;
};

const extractQuestions = ($) => {
  const questions = [];
  
  // Try table-based extraction
  const tables = $('table');
  
  tables.each((tableIndex, table) => {
    const $table = $(table);
    const rows = $table.find('tr');
    
    rows.each((rowIndex, row) => {
      const $row = $(row);
      const cells = $row.find('td');
      
      if (cells.length < 2) return;
      
      const firstCellText = cells.eq(0).text().trim();
      const questionNumber = parseInt(firstCellText);
      
      if (!isNaN(questionNumber) && questionNumber > 0 && questionNumber <= 100) {
        let studentAnswer = null;
        let correctAnswer = null;
        
        // Extract answers from cells
        cells.each((cellIndex, cell) => {
          const $cell = $(cell);
          const text = $cell.text().trim();
          
          if ($cell.find('b, strong').length || text.includes('✓')) {
            const optionMatch = text.match(/[A-Da-d]/);
            if (optionMatch) studentAnswer = optionMatch[0].toUpperCase();
          }
          
          if (text.toLowerCase().includes('key') || text.toLowerCase().includes('answer')) {
            const nextCell = cells.eq(cellIndex + 1);
            if (nextCell.length) {
              const optionMatch = nextCell.text().trim().match(/[A-Da-d]/);
              if (optionMatch) correctAnswer = optionMatch[0].toUpperCase();
            }
          }
        });
        
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
  });
  
  // Sort by question number
  questions.sort((a, b) => a.questionNumber - b.questionNumber);
  
  return questions;
};
