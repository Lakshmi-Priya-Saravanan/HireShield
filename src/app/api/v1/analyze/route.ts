import { NextRequest, NextResponse } from 'next/server';
import { analyzeJobWithGemini } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';
import fs from 'fs';

const LOCAL_DB = '/tmp/hireshield_db.json';

function writeLocalScan(scan: any) {
  try {
    let scans = [];
    if (fs.existsSync(LOCAL_DB)) {
      try {
        scans = JSON.parse(fs.readFileSync(LOCAL_DB, 'utf-8'));
      } catch (e) {
        scans = [];
      }
    }
    scans.push(scan);
    fs.writeFileSync(LOCAL_DB, JSON.stringify(scans, null, 2), 'utf-8');
  } catch (e) {
    console.error(e);
  }
}

export async function POST(req: NextRequest) {
  // Developer API Key check
  const authHeader = req.headers.get('authorization');
  const apiKey = req.nextUrl.searchParams.get('api_key') || (authHeader && authHeader.split(' ')[1]);

  if (!apiKey) {
    return NextResponse.json({ 
      error: "Unauthorized", 
      message: "An API key is required. Use '?api_key=your_key' or 'Authorization: Bearer <key>'. For testing, you can use 'hireshield_dev_demo_key'." 
    }, { status: 401 });
  }

  try {
    const body = await req.json();

    if (!body.title || !body.description) {
      return NextResponse.json({ error: "Bad Request", message: "Job title and description are required parameters." }, { status: 400 });
    }

    // Call Gemini 2.5 Flash
    const result = await analyzeJobWithGemini(body);

    const scanRecord = {
      id: crypto.randomUUID(),
      job_title: body.title,
      company: body.company || "API Dev Partner",
      risk_score: result.final_risk_score,
      risk_level: result.risk_level,
      red_flags_count: result.red_flags?.length || 0,
      verdict: result.verdict,
      safe_to_apply: result.safe_to_apply,
      created_at: new Date().toISOString()
    };

    // Database logging
    if (supabase) {
      await supabase.from('scans').insert({
        job_title: scanRecord.job_title,
        company: scanRecord.company,
        risk_score: scanRecord.risk_score,
        risk_level: scanRecord.risk_level,
        red_flags_count: scanRecord.red_flags_count,
        verdict: scanRecord.verdict,
        safe_to_apply: scanRecord.safe_to_apply
      });
    } else {
      writeLocalScan(scanRecord);
    }

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: result
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Internal Server Error", message: err.message || "Failed to process API request." }, { status: 500 });
  }
}
