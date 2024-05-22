import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pzpoosikzcqnbwwcikzv.supabase.co';
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6cG9vc2lremNxbmJ3d2Npa3p2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUxMjQ1MjcsImV4cCI6MjAzMDcwMDUyN30.G22l-iFIhm-kTsBLglye7KPXvWvbak4TCJknO0NFHfc';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    storage: AsyncStorage,
    persistSession: true,
  },
});
