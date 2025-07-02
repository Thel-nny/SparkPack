import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pwimzcxycyycfronyvli.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3aW16Y3h5Y3l5Y2Zyb255dmxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0NjY0MzIsImV4cCI6MjA2NzA0MjQzMn0.JzmXS2SRRSH0MzOdhIuQVYUQb6Vnq4YxtXLqp1HZAg4'

export const supabase = createClient(supabaseUrl, supabaseKey)
