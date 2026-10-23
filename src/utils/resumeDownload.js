/**
 * Utility to generate and trigger browser download of a candidate resume PDF.
 */
export function downloadCandidateResume(cand) {
  const name = cand?.name || cand?.candidate || 'Candidate';
  const role = cand?.headline || cand?.role || cand?.jobTitle || 'Software Engineering Professional';
  const email = cand?.email || 'candidate@knotnex.org';
  const phone = cand?.phone || '+91 98401 24789';
  const city = cand?.city || 'Bengaluru, India';
  const appId = cand?.appId || cand?.id || '#KNT-8401';
  const appliedDate = cand?.appliedDate || cand?.date || 'Sep 2026';

  const clean = (str) => String(str || '').replace(/[()\\]/g, '');

  const streamLines = [
    'BT',
    '/F1 18 Tf',
    '50 740 Td',
    `(${clean(name)}) Tj`,
    '/F1 11 Tf',
    '0 -22 Td',
    `(${clean(role)} | Application ID: ${clean(appId)}) Tj`,
    '/F1 9 Tf',
    '0 -16 Td',
    `(Email: ${clean(email)}   Phone: ${clean(phone)}   Location: ${clean(city)}) Tj`,
    '0 -26 Td',
    '/F1 13 Tf',
    '(PROFESSIONAL SUMMARY) Tj',
    '/F1 10 Tf',
    '0 -16 Td',
    '(Proven track record of high-performance software engineering, systems design,) Tj',
    '0 -14 Td',
    '(and scalable cloud infrastructure delivery across collaborative engineering environments.) Tj',
    '0 -26 Td',
    '/F1 13 Tf',
    '(CORE COMPETENCIES & TECHNICAL EXPERTISE) Tj',
    '/F1 10 Tf',
    '0 -16 Td',
    '(- Full-Stack Web Development, Modern Frontend Frameworks & Responsive UI Architecture) Tj',
    '0 -14 Td',
    '(- Backend Microservices, RESTful & GraphQL APIs, Distributed Caching & PostgreSQL) Tj',
    '0 -14 Td',
    '(- Cloud Native Infrastructure, Containerization (Docker, Kubernetes) & CI/CD Pipelines) Tj',
    '0 -14 Td',
    '(- Engineering Best Practices, Test-Driven Development & Performance Optimization) Tj',
    '0 -26 Td',
    '/F1 13 Tf',
    '(WORK EXPERIENCE HIGHLIGHTS) Tj',
    '/F1 10 Tf',
    '0 -16 Td',
    `(- Senior Technical Fellow - Applied Research & Systems Engineering (2022 - Present)) Tj`,
    '0 -14 Td',
    '(  Designed and scaled distributed data pipelines handling over 500k daily events.) Tj',
    '0 -14 Td',
    '(  Mentored engineering team members and spearheaded test coverage improvements to 92%.) Tj',
    '0 -26 Td',
    '/F1 13 Tf',
    '(EDUCATION & CREDENTIALS) Tj',
    '/F1 10 Tf',
    '0 -16 Td',
    '(Bachelor / Master of Technology in Computer Science & Engineering) Tj',
    '0 -14 Td',
    `(Knotnex Verified Talent Credentials - Registry ID: ${clean(appId)} | Applied: ${clean(appliedDate)}) Tj`,
    '0 -26 Td',
    '/F1 8 Tf',
    '(CONFIDENTIAL - Generated automatically via Knotnex Careers Talent Portal) Tj',
    'ET'
  ];

  const streamContent = streamLines.join('\n');
  const streamLength = streamContent.length;

  const pdfBody = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length ${streamLength} >>
stream
${streamContent}
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000227 00000 n 
0000000296 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
365
%%EOF`;

  const blob = new Blob([pdfBody], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const safeFilename = `${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_resume.pdf`;
  link.setAttribute('href', url);
  link.setAttribute('download', safeFilename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return safeFilename;
}
