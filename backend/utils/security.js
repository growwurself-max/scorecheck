import ipaddr from 'ipaddr.js';

// SSRF protection - block localhost, loopback, private subnets, and cloud metadata IPs
const BLOCKED_IP_RANGES = [
  '127.0.0.0/8',           // Loopback
  '10.0.0.0/8',            // Private Class A
  '172.16.0.0/12',         // Private Class B
  '192.168.0.0/16',        // Private Class C
  'fc00::/7',              // Private IPv6
  '::1',                   // IPv6 loopback
  '169.254.169.254/32',    // AWS/cloud metadata
  'metadata.google.internal' // GCP metadata
];

const BLOCKED_HOSTNAMES = [
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '::1',
  'metadata.google.internal',
  '169.254.169.254'
];

// Maximum payload size limit (5MB)
const MAX_PAYLOAD_SIZE = 5 * 1024 * 1024;

// Request timeout (10 seconds)
const REQUEST_TIMEOUT = 10000;

/**
 * Validate if a URL is safe to fetch (SSRF protection)
 */
export const validateUrl = (url) => {
  try {
    const parsedUrl = new URL(url);
    
    // Only allow HTTP and HTTPS
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return {
        valid: false,
        error: 'Invalid protocol. Only HTTP and HTTPS are allowed.'
      };
    }
    
    // Check for blocked hostnames
    const hostname = parsedUrl.hostname.toLowerCase();
    if (BLOCKED_HOSTNAMES.some(blocked => hostname === blocked || hostname.endsWith('.' + blocked))) {
      return {
        valid: false,
        error: 'Security Notice: Local or restricted network URLs cannot be queried.'
      };
    }
    
    // Check for blocked IP ranges
    try {
      const ip = ipaddr.parse(hostname);
      for (const range of BLOCKED_IP_RANGES) {
        const [addr, prefix] = range.split('/');
        const parsedRange = ipaddr.parseCIDR(range);
        if (ip.match(parsedRange)) {
          return {
            valid: false,
            error: 'Security Notice: Local or restricted network URLs cannot be queried.'
          };
        }
      }
    } catch (e) {
      // Not an IP address, continue with hostname validation
    }
    
    // Check for internal/private hostnames patterns
    if (hostname.includes('internal') || hostname.includes('local') || hostname.includes('metadata')) {
      return {
        valid: false,
        error: 'Security Notice: This hostname appears to be internal or restricted.'
      };
    }
    
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: 'Invalid URL format. Please enter a valid HTTP or HTTPS URL.'
    };
  }
};

/**
 * Sanitize URL by removing potential malicious components
 */
export const sanitizeUrl = (url) => {
  try {
    const parsedUrl = new URL(url);
    
    // Remove credentials from URL
    parsedUrl.username = '';
    parsedUrl.password = '';
    
    // Remove fragment
    parsedUrl.hash = '';
    
    return parsedUrl.toString();
  } catch (error) {
    return url;
  }
};

/**
 * Check if response size exceeds limit
 */
export const checkPayloadSize = (contentLength) => {
  if (!contentLength) return true;
  return contentLength <= MAX_PAYLOAD_SIZE;
};

/**
 * Get timeout duration
 */
export const getTimeout = () => REQUEST_TIMEOUT;

/**
 * Get max payload size
 */
export const getMaxPayloadSize = () => MAX_PAYLOAD_SIZE;

/**
 * Validate redirect URL
 */
export const validateRedirect = (originalUrl, redirectUrl) => {
  const validation = validateUrl(redirectUrl);
  if (!validation.valid) {
    return validation;
  }
  
  // Ensure redirect stays on same protocol (no HTTP->HTTPS downgrade attacks)
  try {
    const original = new URL(originalUrl);
    const redirect = new URL(redirectUrl);
    
    if (original.protocol === 'https:' && redirect.protocol === 'http:') {
      return {
        valid: false,
        error: 'Insecure redirect from HTTPS to HTTP is not allowed.'
      };
    }
  } catch (error) {
    return {
      valid: false,
      error: 'Invalid redirect URL.'
    };
  }
  
  return { valid: true };
};
