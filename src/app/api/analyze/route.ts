import { NextRequest, NextResponse } from 'next/server';
import { analyzeJobWithGemini } from '@/lib/gemini';
import { supabase } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

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
    console.error("Failed to write scan to local serverless DB:", e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.title || !body.description) {
      return NextResponse.json({ error: "Job title and description are required." }, { status: 400 });
    }

    // Call Gemini 2.5 Flash
    const result = await analyzeJobWithGemini(body);

    const scanRecord = {
      id: crypto.randomUUID(),
      job_title: body.title,
      company: body.company || "Unknown Company",
      risk_score: result.final_risk_score,
      risk_level: result.risk_level,
      red_flags_count: result.red_flags?.length || 0,
      verdict: result.verdict,
      safe_to_apply: result.safe_to_apply,
      created_at: new Date().toISOString()
    };

    // Database logging
    if (supabase) {
      const { error } = await supabase.from('scans').insert({
        job_title: scanRecord.job_title,
        company: scanRecord.company,
        risk_score: scanRecord.risk_score,
        risk_level: scanRecord.risk_level,
        red_flags_count: scanRecord.red_flags_count,
        verdict: scanRecord.verdict,
        safe_to_apply: scanRecord.safe_to_apply
      });
      if (error) console.error("Supabase insert error:", error);
    } else {
      writeLocalScan(scanRecord);
    }

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("API Analyze Error:", err);
    return NextResponse.json({ error: err.message || "An unexpected error occurred during analysis." }, { status: 500 });
  }
}
