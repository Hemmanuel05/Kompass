export interface User {
  email: string;
  passwordHash: string;
  salt: string;
}

export interface InviteCode {
  code: string;
  used: boolean;
}

// --- Local Storage Keys ---
const INVITE_CODES_KEY = 'kaito_invite_codes';
const USERS_KEY = 'kaito_users';
const SESSION_KEY = 'kaito_session_email';
const RATE_LIMIT_KEY = 'kaito_rate_limit';

// --- Rate Limiting Configuration ---
const LOGIN_ATTEMPTS_LIMIT = 5;
const SIGNUP_ATTEMPTS_LIMIT = 3;
const LOCKOUT_PERIOD_MS = 15 * 60 * 1000; // 15 minutes

// --- Crypto Helpers ---
const arrayBufferToHex = (buffer: ArrayBuffer): string => {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

// FIX: Renamed from hexToArrayBuffer and changed return type to Uint8Array to match hashPassword expectation.
const hexToUint8Array = (hex: string): Uint8Array => {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
};

const hashPassword = async (password: string, salt: Uint8Array): Promise<string> => {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );
  return arrayBufferToHex(derivedBits);
};

// --- Rate Limiting Helpers ---
interface RateLimitEntry {
  attempts: number;
  blockUntil: number | null;
}

const getRateLimitData = (): Record<string, RateLimitEntry> => {
    return JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '{}');
};

const saveRateLimitData = (data: Record<string, RateLimitEntry>) => {
    localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
};

const checkRateLimit = (key: string): { blocked: boolean; message: string } => {
    const rateLimitData = getRateLimitData();
    const entry = rateLimitData[key];
    if (entry && entry.blockUntil && Date.now() < entry.blockUntil) {
        const timeLeft = Math.ceil((entry.blockUntil - Date.now()) / 60000);
        return { blocked: true, message: `Too many failed attempts. Please try again in ${timeLeft} minutes.` };
    }
    return { blocked: false, message: '' };
};

const recordFailedAttempt = (key: string, limit: number) => {
    const rateLimitData = getRateLimitData();
    const entry = rateLimitData[key] || { attempts: 0, blockUntil: null };
    const newAttempts = entry.attempts + 1;

    if (newAttempts >= limit) {
        rateLimitData[key] = { attempts: newAttempts, blockUntil: Date.now() + LOCKOUT_PERIOD_MS };
    } else {
        rateLimitData[key] = { attempts: newAttempts, blockUntil: null };
    }
    saveRateLimitData(rateLimitData);
};

const clearRateLimit = (key: string) => {
    const rateLimitData = getRateLimitData();
    if (rateLimitData[key]) {
        delete rateLimitData[key];
        saveRateLimitData(rateLimitData);
    }
};

// --- Data Initialization ---
export const initializeAuthData = () => {
  if (!localStorage.getItem(INVITE_CODES_KEY)) {
    const initialCodes: InviteCode[] = [
      { code: 'KAITO-FRIEND-1', used: false },
      { code: 'KAITO-FRIEND-2', used: false },
      { code: 'KAITO-BETA-001', used: false },
      { code: 'YAP-INSIDER', used: false },
      { code: 'WEB3-KOMPASS', used: false },
    ];
    localStorage.setItem(INVITE_CODES_KEY, JSON.stringify(initialCodes));
  }
  if (!localStorage.getItem(USERS_KEY)) {
    // Admin user with pre-hashed password
    const initialUsers: User[] = [
      {
        email: 'ikezahuemma@gmail.com',
        // Salt (hex): a1b2c3d4e5f6a7b8a1b2c3d4e5f6a7b8
        // The password is 'KaitoKompass2025!'
        passwordHash: 'd70d3a5105a3053f1406b245e3d745e1286c478225e24a1387228811800539c2',
        salt: 'a1b2c3d4e5f6a7b8a1b2c3d4e5f6a7b8',
      },
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
  }
};

// --- Helper Functions ---
const getUsers = (): User[] => {
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
};

const getInviteCodes = (): InviteCode[] => {
  return JSON.parse(localStorage.getItem(INVITE_CODES_KEY) || '[]');
};

const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

const saveInviteCodes = (codes: InviteCode[]) => {
  localStorage.setItem(INVITE_CODES_KEY, JSON.stringify(codes));
};

// --- Core Auth Functions ---
export const signUp = async (email: string, password: string, inviteCode: string): Promise<{ success: boolean; message: string }> => {
    const signupKey = `signup_${inviteCode}`;
    const rateLimit = checkRateLimit(signupKey);
    if (rateLimit.blocked) {
        return { success: false, message: rateLimit.message };
    }

    try {
        const users = getUsers();
        const codes = getInviteCodes();

        if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
            return { success: false, message: "An account with this email already exists." };
        }

        const codeEntry = codes.find(c => c.code === inviteCode);
        if (!codeEntry) {
            recordFailedAttempt(signupKey, SIGNUP_ATTEMPTS_LIMIT);
            return { success: false, message: "Invalid invite code." };
        }

        if (codeEntry.used) {
            return { success: false, message: "This invite code has already been used." };
        }

        // Success case
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const passwordHash = await hashPassword(password, salt);
        const newUser: User = { email: email.toLowerCase(), passwordHash, salt: arrayBufferToHex(salt) };
        
        users.push(newUser);
        saveUsers(users);

        const updatedCodes = codes.map(c => c.code === inviteCode ? { ...c, used: true } : c);
        saveInviteCodes(updatedCodes);

        // Automatically log in the user
        sessionStorage.setItem(SESSION_KEY, newUser.email);
        
        clearRateLimit(signupKey);
        return { success: true, message: "Account created successfully!" };
    } catch (error) {
        console.error("Sign up error:", error);
        return { success: false, message: "An unexpected error occurred. Please try again." };
    }
};

export const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    const emailKey = `login_${email.toLowerCase()}`;
    const rateLimit = checkRateLimit(emailKey);
    if (rateLimit.blocked) {
        return { success: false, message: rateLimit.message };
    }
    
    try {
        const users = getUsers();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

        if (!user) {
            recordFailedAttempt(emailKey, LOGIN_ATTEMPTS_LIMIT);
            return { success: false, message: "Invalid email or password." };
        }

        const saltBuffer = hexToUint8Array(user.salt);
        const inputPasswordHash = await hashPassword(password, saltBuffer);

        if (inputPasswordHash !== user.passwordHash) {
             recordFailedAttempt(emailKey, LOGIN_ATTEMPTS_LIMIT);
             return { success: false, message: "Invalid email or password." };
        }

        // Success
        sessionStorage.setItem(SESSION_KEY, user.email);
        clearRateLimit(emailKey);
        return { success: true, message: "Logged in successfully." };
    } catch (error) {
        console.error("Login error:", error);
        return { success: false, message: "An unexpected error occurred. Please try again." };
    }
};

export const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
};

export const getCurrentUser = (): { email: string } | null => {
    const email = sessionStorage.getItem(SESSION_KEY);
    if (email) {
        return { email };
    }
    return null;
};