import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vhpykgommzfghtnwjxrk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZocHlrZ29tbXpmZ2h0bndqeHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5NzYzNzksImV4cCI6MjA5NDU1MjM3OX0.HHSE8KfIjIlwgPjb3HGs_5d_0PlK4v73BGlLai9J3sw';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
