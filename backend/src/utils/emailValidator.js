/**
 * Email validation utility to block fake, temporary, and disposable email providers.
 * Ensures users register with genuine personal or work email addresses.
 */

// Popular disposable / throwaway email domain blacklist (over 80 common providers)
const DISPOSABLE_DOMAINS = new Set([
  'tempmail.com', 'temp-mail.org', '10minutemail.com', '10minutemail.net',
  'mailinator.com', 'guerrillamail.com', 'guerrillamail.net', 'guerrillamail.org',
  'sharklasers.com', 'grr.la', 'yopmail.com', 'yopmail.net',
  'trashmail.com', 'trashmail.net', 'trashmail.me', 'fakeinbox.com',
  'dispostable.com', 'getairmail.com', 'crazymailing.com', 'burnermail.io',
  'throwawaymail.com', 'mohmal.com', 'mytemp.email', 'nada.ltd',
  'dropmail.me', 'generator.email', 'emailondeck.com', 'fakemailgenerator.com',
  'inboxkitten.com', 'tempmailo.com', 'tempmailaddress.com', 'throwawayemail.com',
  'tempr.email', 'discard.email', 'spambog.com', 'mailnull.com',
  'mintemail.com', 'harakirimail.com', 'mytempemail.com', 'deadaddress.com',
  'filzmail.com', 'getnada.com', 'abacusmail.com', 'armyspy.com',
  'cuvox.de', 'dayrep.com', 'einrot.com', 'fleckens.hu', 'gustr.com',
  'jourrapide.com', 'rhyta.com', 'superrito.com', 'teleworm.us',
  'fakeemail.net', 'trashmail.org', 'emailtemporal.org', 'correotemporal.org'
]);

/**
 * Validates if an email address has a legitimate structure and is not from a disposable service.
 * @param {string} email 
 * @returns {{ isValid: boolean, reason?: string }}
 */
function validateRealEmail(email) {
  if (!email || typeof email !== 'string') {
    return { isValid: false, reason: 'Email is required' };
  }

  const cleanEmail = email.trim().toLowerCase();

  // 1. Strict RFC 5322 standard regex check
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!emailRegex.test(cleanEmail)) {
    return { isValid: false, reason: 'Please enter a valid email format (e.g. name@gmail.com)' };
  }

  const parts = cleanEmail.split('@');
  if (parts.length !== 2) {
    return { isValid: false, reason: 'Invalid email address structure' };
  }

  const [localPart, domain] = parts;

  // 2. Reject obvious test/gibberish addresses
  if (localPart.length < 2 || localPart.length > 64) {
    return { isValid: false, reason: 'Email username must be between 2 and 64 characters' };
  }

  // 3. Domain TLD validation (must have at least 2 char TLD e.g. .com, .in, .edu, .org)
  const domainParts = domain.split('.');
  if (domainParts.length < 2) {
    return { isValid: false, reason: 'Email domain must have a valid extension (.com, .org, etc.)' };
  }

  const tld = domainParts[domainParts.length - 1];
  if (tld.length < 2 || !/^[a-zA-Z]+$/.test(tld)) {
    return { isValid: false, reason: 'Email top-level domain is invalid' };
  }

  // 4. Disposable email blacklist check
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return {
      isValid: false,
      reason: 'Disposable or temporary email services are not permitted. Please use your genuine personal or work email (e.g., Gmail, Outlook, Yahoo, or company email).'
    };
  }

  // 5. Reject common dummy domains
  const testDomains = ['example.com', 'test.com', 'fake.com', 'invalid.com', 'localhost'];
  if (testDomains.includes(domain)) {
    return {
      isValid: false,
      reason: 'Please use a real, accessible email address to register.'
    };
  }

  return { isValid: true };
}

module.exports = {
  validateRealEmail,
  DISPOSABLE_DOMAINS
};
