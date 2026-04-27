import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ufbbneajhbbxkbjcpmsm.supabase.co'
const supabaseKey = 'sb_publishable_QDrAljdH_qg85UDvJvgQ4g_uv6s4Olp'

export const supabase = createClient(supabaseUrl, supabaseKey)
