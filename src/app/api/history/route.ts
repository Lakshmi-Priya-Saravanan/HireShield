import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

const LOCAL_DB = '/tmp/hireshield_db.json';

function readLocalScans() {
  try {
    if (!fs.existsSync(LOCAL_DB)) {
      return [];
    }
    const data = fs.readFileSync(LOCAL_DB, 'utf-8');
    const scans = JSON.parse(data);
    // Sort by created_at desc
    scans.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return scans;
  } catch (e) {
    console.error("Failed to read local scans:", e);
    return [];
  }
}

export async function GET(req: NextRequest) {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('scans')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) {
        throw error;
      }
      return NextResponse.json(data || []);
    } else {
      const scans = readLocalScans();
      return NextResponse.json(scans);
    }
  } catch (err: any) {
    console.error("API History Error:", err);
    return NextResponse.json({ error: err.message || "Failed to retrieve scan history." }, { status: 500 });
  }
}
