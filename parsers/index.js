import * as cheerio from 'cheerio';
import { parseTGTET } from './tgTETParser.js';
import { parseNEET } from './neetParser.js';
import { parseJEE } from './jeeParser.js';
import { parseSSC } from './sscParser.js';
import { parseRRB } from './rrbParser.js';
import { parseGeneric } from './genericParser.js';

/**
 * Parser router / auto-detector
 * Determines which parser to use based on exam type or auto-detection
 */
export const parseResponseSheet = async (html, examType, paperId, url = '') => {
  const $ = cheerio.load(html);
  
  // 1. Auto-detect DigiALM / TCS iON Touchstone response sheets
  const isDigiALM = 
    url.includes('digialm.com') || 
    url.includes('touchstone') || 
    url.includes('AssessmentQPHTMLMode1') ||
    html.includes('menu-tbl') || 
    html.includes('question-pnl');

  if (examType === 'tg-tet' || (examType === 'auto' && isDigiALM)) {
    try {
      return parseTGTET(html);
    } catch (err) {
      console.warn('TGTET parser failed, attempting generic fallback...', err.message);
    }
  }
  
  // Use specific parser if exam type is provided
  if (examType) {
    switch (examType) {
      case 'tg-tet':
        return parseTGTET(html);
      case 'neet':
        return parseNEET($, paperId);
      case 'jee-main':
        return parseJEE($, paperId);
      case 'ssc':
        return parseSSC($, paperId);
      case 'rrb':
        return parseRRB($, paperId);
      case 'eamcet':
        return parseGeneric($, examType, paperId);
      default:
        return parseGeneric($, examType, paperId);
    }
  }
  
  // Auto-detect exam type
  const detectedType = detectExamType($);
  if (detectedType) {
    switch (detectedType.type) {
      case 'tg-tet':
        return parseTGTET(html);
      case 'neet':
        return parseNEET($, detectedType.paperId);
      case 'jee-main':
        return parseJEE($, detectedType.paperId);
      case 'ssc':
        return parseSSC($, detectedType.paperId);
      case 'rrb':
        return parseRRB($, detectedType.paperId);
      default:
        return parseGeneric($, detectedType.type, detectedType.paperId);
    }
  }
  
  // Fall back to generic parser
  return parseGeneric($, 'custom', null);
};

/**
 * Auto-detect exam type from HTML content
 */
const detectExamType = ($) => {
  const html = $.html().toLowerCase();
  
  // TG TET detection
  if (html.includes('tet') || html.includes('teacher eligibility test')) {
    if (html.includes('paper 1') || html.includes('classes i–v')) {
      return { type: 'tg-tet', paperId: 'paper1' };
    }
    if (html.includes('mathematics & science') || html.includes('maths & science')) {
      return { type: 'tg-tet', paperId: 'paper2-math-science' };
    }
    if (html.includes('social studies')) {
      return { type: 'tg-tet', paperId: 'paper2-social' };
    }
    return { type: 'tg-tet', paperId: 'paper1' };
  }
  
  // NEET detection
  if (html.includes('neet') || html.includes('national eligibility cum entrance test')) {
    return { type: 'neet', paperId: 'default' };
  }
  
  // JEE Main detection
  if (html.includes('jee main') || html.includes('joint entrance examination')) {
    return { type: 'jee-main', paperId: 'default' };
  }
  
  // SSC detection
  if (html.includes('ssc') || html.includes('staff selection commission')) {
    if (html.includes('cgl')) return { type: 'ssc', paperId: 'cgl' };
    if (html.includes('chsl')) return { type: 'ssc', paperId: 'chsl' };
    return { type: 'ssc', paperId: 'cgl' };
  }
  
  // RRB detection
  if (html.includes('rrb') || html.includes('railway recruitment board')) {
    if (html.includes('ntpc')) return { type: 'rrb', paperId: 'ntpc' };
    if (html.includes('group d')) return { type: 'rrb', paperId: 'group-d' };
    return { type: 'rrb', paperId: 'ntpc' };
  }
  
  // EAMCET detection
  if (html.includes('eamcet') || html.includes('eapcet')) {
    if (html.includes('engineering')) return { type: 'eamcet', paperId: 'engineering' };
    if (html.includes('agriculture') || html.includes('medical')) return { type: 'eamcet', paperId: 'agri-medical' };
    return { type: 'eamcet', paperId: 'engineering' };
  }
  
  return null;
};
