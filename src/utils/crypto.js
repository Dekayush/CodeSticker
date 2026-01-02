export const encodeBase64 = (str) => {
  try {
    return btoa(unescape(encodeURIComponent(str)));
  } catch (e) {
    return "";
  }
};

export const decodeBase64 = (str) => {
  try {
    return decodeURIComponent(escape(atob(str)));
  } catch (e) {
    return null;
  }
};

export const caesarCipher = (str, shift = 3) => {
  return str.replace(/[a-zA-Z]/g, (char) => {
    const base = char <= 'Z' ? 65 : 97;
    return String.fromCharCode(((char.charCodeAt(0) - base + shift) % 26) + base);
  });
};

export const decodeCaesar = (str, shift = 3) => {
  return caesarCipher(str, 26 - (shift % 26));
};

export const simpleCipher = (str, key = 5) => {
  return str.split('').map(char => 
    String.fromCharCode(char.charCodeAt(0) + key)
  ).join('');
};

export const decodeSimple = (str, key = 5) => {
  return str.split('').map(char => 
    String.fromCharCode(char.charCodeAt(0) - key)
  ).join('');
};

export const getSecurityLevel = (method) => {
  switch (method) {
    case 'base64': return { level: 'Low', color: 'text-yellow-500' };
    case 'caesar': return { level: 'Medium', color: 'text-orange-500' };
    case 'custom': return { level: 'High', color: 'text-green-500' };
    default: return { level: 'Unknown', color: 'text-slate-500' };
  }
};
