import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    'https://hslwkxwarflnvjfytsul.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzbHdreHdhcmZsbnZqZnl0c3VsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxNzY5NzcsImV4cCI6MjA3NTc1Mjk3N30.bwAqhvyRaNaec9vkJRytf_ktZRPrbbbViiTGcjWIus4'
);

export default supabase;
