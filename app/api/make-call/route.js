import { NextResponse } from 'next/server';

const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber || typeof phoneNumber !== 'string') return null;

  const digits = phoneNumber.replace(/\D/g, '');
  if (!digits) return null;

  if (phoneNumber.trim().startsWith('+')) {
    return `+${digits}`;
  }

  if (digits.length === 10) {
    return `+91${digits}`;
  }

  if (digits.length === 12 && digits.startsWith('91')) {
    return `+${digits}`;
  }

  return `+${digits}`;
};

export async function POST(req) {
  try {
    const apiKey = process.env.BLAND_API_KEY;

    if (!apiKey) {
      console.error('❌ ERROR: BLAND_API_KEY missing in .env.local');
      return NextResponse.json({ success: false, error: 'Server Configuration Error' }, { status: 500 });
    }

    let body;
    try {
      body = await req.json();
    } catch (error) {
      console.error('❌ ERROR: Invalid JSON body', error);
      return NextResponse.json({ success: false, error: 'Invalid request body' }, { status: 400 });
    }

    const { phoneNumber, candidateName, backgroundContext } = body || {};
    const missingFields = [];
    if (!candidateName?.toString().trim()) missingFields.push('candidateName');
    if (!phoneNumber?.toString().trim()) missingFields.push('phoneNumber');
    if (!backgroundContext?.toString().trim()) missingFields.push('backgroundContext');

    if (missingFields.length) {
      return NextResponse.json({ success: false, error: `Missing fields: ${missingFields.join(', ')}` }, { status: 400 });
    }

    const cleanNumber = formatPhoneNumber(phoneNumber.toString().trim());
    if (!cleanNumber) {
      return NextResponse.json({ success: false, error: 'Invalid phone number format. Use format like +91XXXXXXXXXX or 10-digit number' }, { status: 400 });
    }

    // Validate phone number format more strictly
    if (!cleanNumber.match(/^\+\d{10,15}$/)) {
      return NextResponse.json({ success: false, error: 'Phone number must be in E.164 format (+countrycodeXXXXXXXXXX)' }, { status: 400 });
    }

    const encryptedKey = process.env.BLAND_ENCRYPTED_KEY;
    const fromNumber = process.env.BLAND_FROM_NUMBER;

    const payload = {
      phone_number: cleanNumber,
      task: `You are Pooja Sharma, a Senior HR Recruiter at AI Coach Technologies. You are conducting a professional phone screening interview for a technical position. 

Context about the candidate and role: ${backgroundContext}

Interview Guidelines:
- Introduce yourself professionally as HR from AI Coach Technologies
- Ask about their current role and experience
- Inquire about technical skills relevant to the position
- Discuss salary expectations and availability
- Evaluate communication skills and professionalism
- Keep the conversation natural and engaging
- End the call professionally when appropriate

Be polite, professional, and thorough in your assessment.`,
      first_sentence: `Hello ${candidateName}, this is Pooja Sharma calling from AI Coach Technologies. I'm conducting a phone screening for our technical position. How are you today?`,
      voice: 'Josh',
      wait_for_greeting: true,
      record: true,
      reduce_latency: true,
      ...(fromNumber ? { from: fromNumber } : {}),
    };

    console.log('🚀 Bland call payload:', JSON.stringify(payload, null, 2));
    console.log(`🚀 Final Attempt: Calling ${cleanNumber} for ${candidateName}...`);

    const headers = {
      authorization: apiKey,
      'Content-Type': 'application/json',
      ...(encryptedKey ? { encrypted_key: encryptedKey } : {}),
    };

    // Add timeout and retry logic
    let response;
    let data;
    let retryCount = 0;
    const maxRetries = 2;

    while (retryCount <= maxRetries) {
      try {
        response = await fetch('https://api.bland.ai/v1/calls', {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(30000), // 30 second timeout
        });

        const text = await response.text();
        try {
          data = text ? JSON.parse(text) : {};
        } catch (error) {
          data = { raw: text };
        }

        // If successful or client error (not server error), break
        if (response.ok || (response.status >= 400 && response.status < 500)) {
          break;
        }

        // If server error and we have retries left, wait and retry
        if (response.status >= 500 && retryCount < maxRetries) {
          console.log(`🔄 Server error (${response.status}), retrying in ${2 ** retryCount} seconds...`);
          await new Promise(resolve => setTimeout(resolve, 1000 * (2 ** retryCount)));
          retryCount++;
          continue;
        }

        break;
      } catch (error) {
        if (error.name === 'TimeoutError' && retryCount < maxRetries) {
          console.log(`⏰ Request timeout, retrying in ${2 ** retryCount} seconds...`);
          await new Promise(resolve => setTimeout(resolve, 1000 * (2 ** retryCount)));
          retryCount++;
          continue;
        }
        throw error;
      }
    }

    if (!response.ok) {
      console.error('❌ Bland AI Error Details:', data);
      const errorMessage = data?.message || data?.error || data?.raw || 'Bland AI rejected the call';
      return NextResponse.json({ success: false, error: errorMessage }, { status: response.status });
    }

    console.log('✅ SUCCESS: Call Queued!', data);
    return NextResponse.json({ success: true, callId: data.call_id || data?.id || null, raw: data });
  } catch (error) {
    console.error('SERVER CRASH:', error);
    return NextResponse.json({ success: false, error: 'Network error: ' + (error?.message || 'unknown error') }, { status: 500 });
  }
}
