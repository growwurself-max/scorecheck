import * as cheerio from 'cheerio';

export function parseTGTET(html) {
  const $ = cheerio.load(html);

  // 1. Extract Candidate Meta
  const candidateInfo = {
    candidateName: null,
    rollNumber: null,
    examDate: null,
    shift: null,
    testCenter: null,
    subject: 'TG TET Paper 1',
    paper: 'Paper 1'
  };

  $('table').each((_, tbl) => {
    const text = $(tbl).text();
    if (text.includes('Participant ID') || text.includes('Participant Name') || text.includes('Roll No')) {
      $(tbl).find('tr').each((__, tr) => {
        const tds = $(tr).find('td');
        if (tds.length >= 2) {
          const key = $(tds[0]).text().trim().toLowerCase();
          const val = $(tds[1]).text().trim();
          if (key.includes('name')) candidateInfo.candidateName = val;
          if (key.includes('id') || key.includes('roll')) candidateInfo.rollNumber = val;
          if (key.includes('date')) candidateInfo.examDate = val;
          if (key.includes('time') || key.includes('shift')) candidateInfo.shift = val;
          if (key.includes('subject') || key.includes('test')) candidateInfo.subject = val;
          if (key.includes('center')) candidateInfo.testCenter = val;
        }
      });
    }
  });

  // Detect Paper Type
  const subjectStr = (candidateInfo.subject || '').toLowerCase();
  if (subjectStr.includes('paper ii') || subjectStr.includes('paper 2')) {
    candidateInfo.paper = subjectStr.includes('social') 
      ? 'Paper 2 (Social Studies)' 
      : 'Paper 2 (Maths & Science)';
  } else {
    candidateInfo.paper = 'Paper 1';
  }

  // 2. Extract Questions
  const rawQuestions = [];
  
  // Strategy A: Find by .question-pnl
  let panels = $('.question-pnl');
  
  // Strategy B: If no .question-pnl, find all menu-tbl containers
  if (panels.length === 0) {
    panels = $('table.menu-tbl').map((_, el) => $(el).closest('table').parent()).get();
  }

  panels.each((idx, pnl) => {
    const $pnl = $(pnl);

    // Extract Question ID and Chosen Option
    let questionId = `Q${idx + 1}`;
    let chosenOption = null;

    $pnl.find('table.menu-tbl tr').each((_, tr) => {
      const tds = $(tr).find('td');
      if (tds.length >= 2) {
        const k = $(tds[0]).text().trim();
        const v = $(tds[1]).text().trim();

        if (k.includes('Question ID')) questionId = v;
        if (k.includes('Chosen Option')) {
          if (/^[1-4]$/.test(v)) {
            chosenOption = v;
          }
        }
      }
    });

    const isAttempted = chosenOption !== null;

    // Extract Correct Option from .rightAns or tick image
    let correctOption = null;
    const rightAnsEl = $pnl.find('.rightAns');

    if (rightAnsEl.length > 0) {
      const match = rightAnsEl.text().trim().match(/^([1-4])[\.\)\s]/);
      if (match) {
        correctOption = match[1];
      } else {
        const tr = rightAnsEl.closest('tr');
        const allTrs = tr.closest('table').find('tr');
        allTrs.each((rowIdx, r) => {
          if ($(r).hasClass('rightAns') || $(r).find('.rightAns').length > 0) {
            correctOption = String(rowIdx + 1);
          }
        });
      }
    }

    if (!correctOption) {
      $pnl.find('img[src*="tick"], img[src*="correct"]').each((_, img) => {
        const trText = $(img).closest('tr').text().trim();
        const match = trText.match(/^([1-4])[\.\)\s]/);
        if (match) correctOption = match[1];
      });
    }

    rawQuestions.push({
      questionNumber: idx + 1,
      questionId,
      studentAnswer: isAttempted ? String(chosenOption) : null,
      correctAnswer: String(correctOption || '1'),
      isAttempted
    });
  });

  if (rawQuestions.length === 0) {
    throw new Error('Unable to extract questions from the response sheet.');
  }

  // 3. Map Exact TG TET Subjects Based on Question Ranges (Official TS TET Schema)
  const isPaper2Social = candidateInfo.paper.includes('Social');
  const isPaper2Maths = candidateInfo.paper.includes('Maths');

  const questions = rawQuestions.map((q, idx) => {
    const qNum = idx + 1;
    let subject = 'Child Development & Pedagogy';

    if (qNum <= 30) {
      subject = 'Child Development & Pedagogy';
    } else if (qNum <= 60) {
      subject = 'Language I';
    } else if (qNum <= 90) {
      subject = 'Language II (English)';
    } else if (qNum <= 120) {
      if (isPaper2Social) {
        subject = 'Social Studies';
      } else if (isPaper2Maths) {
        subject = 'Mathematics & Science';
      } else {
        subject = 'Mathematics';
      }
    } else if (qNum <= 150) {
      if (isPaper2Social) {
        subject = 'Social Studies';
      } else if (isPaper2Maths) {
        subject = 'Mathematics & Science';
      } else {
        subject = 'Environmental Studies';
      }
    } else {
      subject = 'General';
    }

    return {
      ...q,
      questionNumber: qNum,
      subject
    };
  });

  return {
    candidateInfo,
    questions
  };
}
