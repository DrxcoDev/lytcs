import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = 'https://ahjccbreeefhnnbtmhuz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoamNjYnJlZWVmaG5uYnRtaHV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcxMjgyNDYsImV4cCI6MjA1MjcwNDI0Nn0.btkawMrfEBHxshOBVFMFuaROHv7qmH4KdAAsA4Ncjuo';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);