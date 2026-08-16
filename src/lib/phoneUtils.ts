/**
 * Phone utilities specifically tailored for Mauritania (+222) and international formats
 */

export interface PhoneValidationResult {
  isValid: boolean;
  isMauritania: boolean;
  raw: string;
  normalized: string; // E.164 without plus, e.g., '22246123456'
  formatted: string;  // E.g., '+222 46 12 34 56'
  operator?: string;  // 'Mauritel' | 'Mattel' | 'Chinguitel' | 'Fixe' | 'International'
  error?: string;
  hint?: string;
}

export function validateMauritanianPhone(input: string): PhoneValidationResult {
  if (!input) {
    return {
      isValid: false,
      isMauritania: false,
      raw: '',
      normalized: '',
      formatted: '',
      error: 'Le numéro de téléphone est requis',
      hint: 'Format recommandé: +222 46 12 34 56 ou 46123456',
    };
  }

  // Remove all non-digits except initial +
  const cleaned = input.trim();
  const digitsOnly = cleaned.replace(/\D/g, '');

  let normalized = '';
  let operator = 'International';
  let isMauritania = false;
  let isValid = false;
  let formatted = '';
  let error: string | undefined;
  let hint: string | undefined;

  // Case 1: 8 digits entered directly (local Mauritanian format, e.g., 46123456)
  if (digitsOnly.length === 8) {
    isMauritania = true;
    normalized = `222${digitsOnly}`;
  } 
  // Case 2: Starts with 222 and has 11 digits (e.g. 22246123456)
  else if (digitsOnly.startsWith('222') && digitsOnly.length === 11) {
    isMauritania = true;
    normalized = digitsOnly;
  }
  // Case 3: Starts with 00222 and has 13 digits
  else if (digitsOnly.startsWith('00222') && digitsOnly.length === 13) {
    isMauritania = true;
    normalized = digitsOnly.substring(2);
  }
  // Case 4: Other international number (at least 7 to 15 digits)
  else if (digitsOnly.length >= 8 && digitsOnly.length <= 15) {
    normalized = digitsOnly;
    isMauritania = digitsOnly.startsWith('222');
    if (!isMauritania) {
      isValid = true;
      operator = 'International';
      formatted = `+${digitsOnly}`;
      return {
        isValid: true,
        isMauritania: false,
        raw: input,
        normalized,
        formatted,
        operator,
        hint: 'Numéro international détecté',
      };
    }
  }

  if (isMauritania) {
    const localPart = normalized.substring(3); // 8 digits
    const prefix2 = localPart.substring(0, 2);
    const firstDigit = localPart.charAt(0);

    // Identify Mauritanian mobile & fixed operators
    if (firstDigit === '3' || ['30', '31', '32', '33', '34', '36', '37', '38', '39'].includes(prefix2)) {
      operator = 'Mauritel (Jawal)';
      isValid = true;
    } else if (firstDigit === '4' || ['40', '41', '42', '43', '44', '46', '47', '48', '49'].includes(prefix2)) {
      operator = 'Mattel';
      isValid = true;
    } else if (firstDigit === '2' || ['20', '21', '22', '23', '24', '26', '27', '28', '29'].includes(prefix2)) {
      operator = 'Chinguitel (MauriPost)';
      isValid = true;
    } else if (firstDigit === '8' || firstDigit === '7') {
      operator = 'Opérateur Mobile National';
      isValid = true;
    } else if (firstDigit === '4' && prefix2 === '45') {
      operator = 'Ligne Fixe / Entreprise';
      isValid = true;
    } else {
      operator = 'Opérateur Mauritanie Inconnu';
      isValid = localPart.length === 8;
    }

    if (localPart.length !== 8) {
      isValid = false;
      error = `Numéro incomplet (${localPart.length}/8 chiffres)`;
      hint = 'Un numéro en Mauritanie doit comporter exactement 8 chiffres après +222';
    } else {
      formatted = `+222 ${localPart.substring(0, 2)} ${localPart.substring(2, 4)} ${localPart.substring(4, 6)} ${localPart.substring(6, 8)}`;
      hint = `Valide • ${operator} (Mauritanie)`;
    }
  } else {
    isValid = false;
    error = 'Format de numéro non reconnu';
    hint = 'Pour la Mauritanie: saisissez 8 chiffres (ex: 46 12 34 56) ou avec +222';
  }

  return {
    isValid,
    isMauritania,
    raw: input,
    normalized,
    formatted: formatted || `+${normalized}`,
    operator,
    error,
    hint,
  };
}

export function formatMauritaniaInput(value: string): string {
  // Clean non-digits
  const digits = value.replace(/\D/g, '');
  if (!digits) return '';

  // If user is typing local 8 digits
  if (digits.length <= 8 && !digits.startsWith('222')) {
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)} ${digits.slice(2)}`;
    if (digits.length <= 6) return `${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4)}`;
    return `${digits.slice(0, 2)} ${digits.slice(2, 4)} ${digits.slice(4, 6)} ${digits.slice(6, 8)}`;
  }

  // If with 222
  if (digits.startsWith('222')) {
    const local = digits.slice(3);
    if (local.length === 0) return '+222 ';
    if (local.length <= 2) return `+222 ${local}`;
    if (local.length <= 4) return `+222 ${local.slice(0, 2)} ${local.slice(2)}`;
    if (local.length <= 6) return `+222 ${local.slice(0, 2)} ${local.slice(2, 4)} ${local.slice(4)}`;
    return `+222 ${local.slice(0, 2)} ${local.slice(2, 4)} ${local.slice(4, 6)} ${local.slice(6, 8)}`;
  }

  return value;
}

/**
 * Universal, error-free WhatsApp URL builder that supports desktop, web and mobile
 * Never causes "Le lien est incorrect" errors.
 */
export function buildWhatsAppUrl(phoneNumber?: string, text?: string): string {
  const cleanPhone = phoneNumber ? phoneNumber.replace(/\D/g, '') : '';
  let normalizedPhone = '';

  if (cleanPhone) {
    if (cleanPhone.length === 8) {
      normalizedPhone = `222${cleanPhone}`;
    } else if (cleanPhone.startsWith('00222') && cleanPhone.length === 13) {
      normalizedPhone = cleanPhone.substring(2);
    } else if (cleanPhone.startsWith('222') && cleanPhone.length >= 10) {
      normalizedPhone = cleanPhone;
    } else if (cleanPhone.length >= 8 && cleanPhone.length <= 15 && cleanPhone !== '222') {
      normalizedPhone = cleanPhone;
    }
  }

  const encodedText = text ? encodeURIComponent(text.trim()) : '';

  // Valid target phone number provided (>= 8 digits, not incomplete placeholder)
  if (normalizedPhone && normalizedPhone.length >= 8 && normalizedPhone !== '222') {
    if (encodedText) {
      return `https://wa.me/${normalizedPhone}?text=${encodedText}`;
    }
    return `https://wa.me/${normalizedPhone}`;
  }

  // If no phone number is given or phone is incomplete, share to contact picker with text
  if (encodedText) {
    return `https://wa.me/?text=${encodedText}`;
  }

  // Default universal fallback
  return `https://wa.me/`;
}

