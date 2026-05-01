const API_BASE = import.meta.env.VITE_API_URL || '/api/v1';

export async function scanImage(imageBase64: string, lang: string = 'ru', text?: string) {
  const res = await fetch(`${API_BASE}/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_base64: imageBase64, lang, text })
  });
  return res.json();
}

export async function auditImage(imageBase64: string, locationName: string, locationType: string, lang: string = 'ru') {
  const res = await fetch(`${API_BASE}/audit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_base64: imageBase64, location_name: locationName, location_type: locationType, lang })
  });
  return res.json();
}

export async function translateSign(imageBase64: string, lang: string = 'ru') {
  const res = await fetch(`${API_BASE}/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_base64: imageBase64, lang })
  });
  return res.json();
}

export async function navigate(description: string, imageBase64?: string, lang: string = 'ru') {
  const res = await fetch(`${API_BASE}/navigate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description, image_base64: imageBase64, lang })
  });
  return res.json();
}

export async function getAudits() {
  const res = await fetch(`${API_BASE}/audits`);
  return res.json();
}

export async function getAudit(id: string) {
  const res = await fetch(`${API_BASE}/audits/${id}`);
  return res.json();
}

export function getAuditPdfUrl(id: string) {
  return `${API_BASE}/audits/${id}/pdf`;
}
