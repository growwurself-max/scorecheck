import axios from 'axios';
import { validateUrl, sanitizeUrl, validateRedirect, getTimeout, getMaxPayloadSize, checkPayloadSize } from '../utils/security.js';

/**
 * SSRF-guarded HTTP client with timeout & size limits
 */
export const fetchUrl = async (url) => {
  // Validate URL
  const validation = validateUrl(url);
  if (!validation.valid) {
    throw new Error(validation.error);
  }
  
  // Sanitize URL
  const sanitizedUrl = sanitizeUrl(url);
  
  try {
    const response = await axios.get(sanitizedUrl, {
      timeout: 12000,
      maxRedirects: 5,
      validateStatus: (status) => status < 500, // Don't throw on 4xx errors
      responseType: 'text',
      maxContentLength: 8 * 1024 * 1024, // 8MB limit
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://cdn3.digialm.com/'
      }
    });
    
    // Check response size
    const contentLength = response.headers['content-length'];
    if (contentLength && !checkPayloadSize(parseInt(contentLength))) {
      throw new Error('Response payload exceeds maximum allowed size of 5MB.');
    }
    
    // Check actual data size
    if (response.data && response.data.length > getMaxPayloadSize()) {
      throw new Error('Response payload exceeds maximum allowed size of 5MB.');
    }
    
    // Handle specific HTTP status codes
    if (response.status === 401 || response.status === 403) {
      throw new Error('This response sheet requires credentials or is protected by anti-bot verification. ScoreCheck only analyzes publicly accessible response sheets.');
    }
    
    if (response.status === 404) {
      throw new Error('The response sheet link could not be found. Please check if the link has expired.');
    }
    
    if (response.status === 429) {
      throw new Error('Too many requests in a short window. Please wait a moment and try again.');
    }
    
    if (!response.data) {
      throw new Error('No data received from the URL.');
    }
    
    return {
      success: true,
      data: response.data,
      status: response.status,
      finalUrl: response.request.res.responseUrl || sanitizedUrl
    };
    
  } catch (error) {
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      throw new Error('The response sheet host took too long to respond. Please try again.');
    }
    
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      throw new Error('Unable to connect to the response sheet host. Please check the URL and try again.');
    }
    
    // Re-throw our custom errors
    if (error.message.startsWith('Security Notice') || 
        error.message.startsWith('This response sheet requires') ||
        error.message.startsWith('The response sheet link') ||
        error.message.startsWith('Too many requests') ||
        error.message.startsWith('Response payload')) {
      throw error;
    }
    
    throw new Error(`Failed to fetch the response sheet: ${error.message}`);
  }
};

/**
 * Fetch with redirect validation
 */
export const fetchWithRedirectValidation = async (url) => {
  const validation = validateUrl(url);
  if (!validation.valid) {
    throw new Error(validation.error);
  }
  
  const sanitizedUrl = sanitizeUrl(url);
  let currentUrl = sanitizedUrl;
  let redirectCount = 0;
  const maxRedirects = 5;
  
  while (redirectCount < maxRedirects) {
    try {
      const result = await fetchUrl(currentUrl);
      
      // Check if we were redirected
      if (result.finalUrl && result.finalUrl !== currentUrl) {
        const redirectValidation = validateRedirect(currentUrl, result.finalUrl);
        if (!redirectValidation.valid) {
          throw new Error(redirectValidation.error);
        }
        currentUrl = result.finalUrl;
        redirectCount++;
        continue;
      }
      
      return result;
    } catch (error) {
      if (redirectCount > 0 && error.message.includes('redirect')) {
        throw error;
      }
      throw error;
    }
  }
  
  throw new Error('Too many redirects. The URL may be part of a redirect loop.');
};
